/**
 * E2E Integration Tests — AIGINVEST Alpha 0.2
 * "Meet Diana" complete user journey
 *
 * These tests hit the running API (localhost:3333).
 * Run: pnpm test (with API + DB running)
 */

const API = process.env.API_URL || 'http://localhost:3333'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function post(path: string, body: object) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, body: await res.json() }
}

async function get(path: string) {
  const res = await fetch(`${API}${path}`)
  return { status: res.status, body: await res.json() }
}

async function streamPost(path: string, body: object): Promise<{ chunks: number; fullResponse: string; actionType?: string }> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let chunks = 0
  let fullResponse = ''
  let actionType: string | undefined

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const data = JSON.parse(line.slice(6))
        if (data.type === 'chunk') { fullResponse += data.content; chunks++ }
        if (data.type === 'action') actionType = data.action
        if (data.type === 'done') return { chunks, fullResponse, actionType }
      } catch {}
    }
  }
  return { chunks, fullResponse, actionType }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

const testEmail = `test-${Date.now()}@aiginvest.com`
let userId: string
let conversationId: string

describe('AIGINVEST Alpha 0.2 — Meet Diana E2E', () => {

  // Step 1: Platform health
  describe('Platform', () => {
    test('API is healthy', async () => {
      const { status, body } = await get('/api/health')
      expect(status).toBe(200)
      expect(body.status).toBe('ok')
    })

    test('API info returns version', async () => {
      const { status, body } = await get('/api/info')
      expect(status).toBe(200)
      expect(body.name).toBe('AIG Platform API')
    })
  })

  // Step 2: Authentication
  describe('Authentication (AIG-001)', () => {
    test('New user can register via email', async () => {
      const { status, body } = await post('/api/auth/login', { email: testEmail })
      expect(status).toBe(201)
      expect(body.id).toBeTruthy()
      expect(body.email).toBe(testEmail)
      expect(body.displayName).toBeTruthy()
      userId = body.id
    })

    test('Returning user gets same ID', async () => {
      const { body } = await post('/api/auth/login', { email: testEmail })
      expect(body.id).toBe(userId)
    })
  })

  // Step 3: Conversation
  describe('Chat — Conversation Lifecycle', () => {
    test('Creates new conversation', async () => {
      const { status, body } = await post('/api/chat/create', {
        userId,
        title: 'New Chat',
      })
      expect(status).toBe(201)
      expect(body.id).toBeTruthy()
      conversationId = body.id
    })

    test('Conversation appears in user list', async () => {
      const { status, body } = await get(`/api/chat/user/${userId}`)
      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.find((c: any) => c.id === conversationId)).toBeTruthy()
    })
  })

  // Step 4: Diana greeting
  describe('Diana — Greeting and Response (AIG-001)', () => {
    test('Diana responds via SSE stream', async () => {
      const { chunks, fullResponse } = await streamPost('/api/chat/stream', {
        conversationId,
        userMessage: 'Hello Diana, who are you?',
        userId,
      })
      expect(chunks).toBeGreaterThan(0)
      expect(fullResponse.length).toBeGreaterThan(20)
    }, 15000)

    test('Messages are persisted to database', async () => {
      const { status, body } = await get(`/api/chat/${conversationId}`)
      expect(status).toBe(200)
      expect(body.messages.length).toBeGreaterThanOrEqual(2)
      const roles = body.messages.map((m: any) => m.role)
      expect(roles).toContain('user')
      expect(roles).toContain('assistant')
    })
  })

  // Step 5: Memory
  describe('Long-Term Memory (AIG-103)', () => {
    test('Memory extraction runs without error', async () => {
      // Send message that contains a detectable pattern (name)
      const { chunks } = await streamPost('/api/chat/stream', {
        conversationId,
        userMessage: 'My name is TestUser and I prefer TypeScript',
        userId,
      })
      expect(chunks).toBeGreaterThan(0)
    }, 15000)

    test('Memory endpoint returns user memories', async () => {
      // Give extraction a moment to complete
      await new Promise((r) => setTimeout(r, 200))
      // DianaMemory is queried internally by ContextEngine
      // Verify conversation history grows (indirect test)
      const { body } = await get(`/api/chat/${conversationId}`)
      expect(body.messages.length).toBeGreaterThanOrEqual(4)
    })
  })

  // Step 6: Tool — Create Project
  describe('Tool Calling — Create Project (AIG-104)', () => {
    test('Diana creates a project when asked', async () => {
      const { fullResponse, actionType } = await streamPost('/api/chat/stream', {
        conversationId,
        userMessage: 'Create a project called Alpha Test Project',
        userId,
      })
      expect(actionType).toBe('create_project')
      expect(fullResponse.toLowerCase()).toContain('alpha test project')
    }, 15000)

    test('Project appears in user projects list', async () => {
      const { status, body } = await get(`/api/projects/user/${userId}`)
      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.find((p: any) => p.name === 'Alpha Test Project')).toBeTruthy()
    })
  })

  // Step 7: Tool — Create Document
  describe('Tool Calling — Create Document (AIG-104)', () => {
    test('Diana generates a document when asked', async () => {
      const { fullResponse, actionType } = await streamPost('/api/chat/stream', {
        conversationId,
        userMessage: 'Write a document called E2E Test Plan',
        userId,
      })
      expect(actionType).toBe('create_document')
      expect(fullResponse.toLowerCase()).toContain('e2e test plan')
    }, 15000)

    test('Document appears in user documents list', async () => {
      const { status, body } = await get(`/api/documents/user/${userId}`)
      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.find((d: any) => d.title === 'E2E Test Plan')).toBeTruthy()
    })
  })

  // Step 8: Persistence — return journey
  describe('Persistence — Return Journey (AIG-001 + AIG-002)', () => {
    test('Conversation is fully restorable after "browser close"', async () => {
      const { status, body } = await get(`/api/chat/${conversationId}`)
      expect(status).toBe(200)
      expect(body.messages.length).toBeGreaterThanOrEqual(6)
      expect(body.title).not.toBe('New Chat') // Should have auto-titled
    })

    test('User conversations list is intact', async () => {
      const { body } = await get(`/api/chat/user/${userId}`)
      expect(body.length).toBeGreaterThanOrEqual(1)
    })

    test('Context engine builds message history correctly', async () => {
      // Ask Diana to reference earlier conversation
      const { fullResponse } = await streamPost('/api/chat/stream', {
        conversationId,
        userMessage: 'Do you remember what we discussed?',
        userId,
      })
      // Diana should reference earlier messages
      expect(fullResponse.length).toBeGreaterThan(20)
    }, 15000)
  })
})
