import { Injectable, Logger } from '@nestjs/common'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMChunk {
  content: string
  done: boolean
}

/**
 * Provider Router — routes to OpenAI, Anthropic, Ollama, or mock based on env config.
 * Set LLM_PROVIDER=openai|anthropic|ollama|mock and provide the corresponding API key.
 * Falls back to mock if no provider is configured or API key is missing.
 */
@Injectable()
export class LLMService {
  private readonly logger = new Logger('LLMService')
  private readonly provider: string

  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'mock'
    if (this.provider !== 'mock') {
      this.logger.log(`✅ LLM Provider: ${this.provider.toUpperCase()}`)
    } else {
      this.logger.warn('⚠️  LLM Provider: MOCK (set LLM_PROVIDER + API key to use real AI)')
    }
  }

  /**
   * Stream a response from the configured LLM provider.
   * Yields text chunks. Caller assembles the full response.
   */
  async *stream(messages: LLMMessage[]): AsyncGenerator<LLMChunk> {
    const provider = this.resolveProvider()

    try {
      if (provider === 'openai') {
        yield* this.streamOpenAI(messages)
      } else if (provider === 'anthropic') {
        yield* this.streamAnthropic(messages)
      } else if (provider === 'ollama') {
        yield* this.streamOllama(messages)
      } else {
        yield* this.streamMock(messages)
      }
    } catch (error) {
      this.logger.error(`LLM stream error (${provider}): ${error.message}`)
      // Graceful fallback to mock
      yield* this.streamMock(messages)
    }
  }

  private resolveProvider(): string {
    if (this.provider === 'openai' && process.env.OPENAI_API_KEY) return 'openai'
    if (this.provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic'
    if (this.provider === 'ollama') return 'ollama'
    return 'mock'
  }

  // ─── OpenAI ──────────────────────────────────────────────────────────────────

  private async *streamOpenAI(messages: LLMMessage[]): AsyncGenerator<LLMChunk> {
    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const stream = await client.chat.completions.create({
      model,
      messages: messages as any,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) yield { content, done: false }
    }
    yield { content: '', done: true }
  }

  // ─── Anthropic ────────────────────────────────────────────────────────────────

  private async *streamAnthropic(messages: LLMMessage[]): AsyncGenerator<LLMChunk> {
    const Anthropic = await import('@anthropic-ai/sdk')
    const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307'

    // Anthropic requires system message separated from user/assistant turns
    const systemMsg = messages.find((m) => m.role === 'system')
    const turns = messages.filter((m) => m.role !== 'system')

    const stream = client.messages.stream({
      model,
      max_tokens: 1024,
      system: systemMsg?.content,
      messages: turns.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { content: event.delta.text, done: false }
      }
    }
    yield { content: '', done: true }
  }

  // ─── Ollama ───────────────────────────────────────────────────────────────────

  private async *streamOllama(messages: LLMMessage[]): AsyncGenerator<LLMChunk> {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
    const model = process.env.OLLAMA_MODEL || 'llama3.2'

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: true }),
    })

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      for (const line of text.split('\n').filter(Boolean)) {
        try {
          const parsed = JSON.parse(line)
          if (parsed.message?.content) yield { content: parsed.message.content, done: false }
          if (parsed.done) yield { content: '', done: true }
        } catch {}
      }
    }
  }

  // ─── Mock (keyword-based, always available) ───────────────────────────────────

  private async *streamMock(messages: LLMMessage[]): AsyncGenerator<LLMChunk> {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    const msg = lastUser?.content?.toLowerCase() || ''
    const history = messages.filter((m) => m.role !== 'system')
    const isReturning = history.length > 2

    let response: string

    if ((msg.includes('create') || msg.includes('new') || msg.includes('start')) && msg.includes('project')) {
      const nameMatch = lastUser?.content?.match(/(?:called|named|for|about)\s+["']?([^"'\n,]+)["']?/i)
      const name = nameMatch ? nameMatch[1].trim() : 'your project'
      response = `I've created a project called **"${name}"**.\n\nHere's how I'd structure the first sprint:\n\n1. **Define the goal** — What does success look like in 30 days?\n2. **Identify blockers** — What could prevent progress?\n3. **First milestone** — What's the smallest version that proves the idea?\n\nYour project is saved. What should we tackle first?`
    } else if ((msg.includes('create') || msg.includes('write') || msg.includes('draft')) && (msg.includes('document') || msg.includes('doc') || msg.includes('spec') || msg.includes('plan'))) {
      const nameMatch = lastUser?.content?.match(/(?:called|named|for|about|titled)\s+["']?([^"'\n,]+)["']?/i)
      const title = nameMatch ? nameMatch[1].trim() : 'your document'
      response = `I've created **"${title}"** and saved it to your workspace.\n\nThe document includes:\n- Overview section\n- Purpose statement\n- Next steps checklist\n\nWould you like me to expand any section or add specific content?`
    } else if (msg.includes('help') || msg.includes('what can') || msg.includes('who are')) {
      response = `I'm Diana — your AI companion inside AIGINVEST.\n\n**What I can do right now:**\n\n- Create and track **projects**\n- Generate **documents** and specifications\n- Remember what we've discussed\n- Help you think through ideas\n\n*With a real AI provider connected (OpenAI, Claude, or Ollama), I can do much more.*\n\nWhat would you like to work on?`
    } else if (msg.includes('remember') || msg.includes('before') || msg.includes('earlier') || msg.includes('last time')) {
      const prevMsgs = messages.filter((m) => m.role === 'user').slice(-3, -1)
      if (prevMsgs.length > 0) {
        response = `Yes — in our earlier exchange you mentioned:\n\n> *"${prevMsgs[0].content.slice(0, 100)}${prevMsgs[0].content.length > 100 ? '...' : ''}"*\n\nShall we continue from there, or is there something new on your mind?`
      } else {
        response = `This is the start of our conversation, so there's nothing earlier to reference yet. But I'm tracking everything from here on.\n\nWhat would you like to discuss?`
      }
    } else if (msg.includes('thank') || msg.includes('great') || msg.includes('perfect') || msg.includes('nice')) {
      response = `Happy to help — that's what I'm here for.\n\nWhat's the next thing on your list?`
    } else if (isReturning) {
      response = `Building on what we've discussed — here's how I'd approach this:\n\nStart with the smallest version that proves the core idea. Don't optimize too early.\n\nWhat's the main blocker right now?`
    } else {
      response = `That's a good starting point.\n\nTo give you the most useful answer: **what does success look like here?**\n\nOnce I know what "done" means to you, I can give you much more specific guidance.`
    }

    // Stream word by word for natural feel
    const words = response.split(' ')
    for (let i = 0; i < words.length; i++) {
      const word = i === 0 ? words[i] : ' ' + words[i]
      yield { content: word, done: false }
      await new Promise((r) => setTimeout(r, 18)) // ~55 words/sec
    }
    yield { content: '', done: true }
  }
}
