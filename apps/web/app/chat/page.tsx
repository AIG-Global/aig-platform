'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [streaming, setStreaming] = useState(false)

  // Initialize conversation on mount
  useEffect(() => {
    const initializeChat = async () => {
      const email = localStorage.getItem('userEmail')
      const userId = localStorage.getItem('userId')

      if (!email || !userId) {
        router.push('/login')
        return
      }

      setUserEmail(email)

      // Create new conversation
      try {
        const response = await fetch('http://localhost:3333/api/api/chat/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            title: 'Chat with Diana',
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setConversationId(data.id)

          // Add initial greeting from Diana
          setMessages([
            {
              id: '0',
              role: 'assistant',
              content: `Welcome back, ${email.split('@')[0]}. I'm Diana. Ready to continue building North Star ONE?`,
              timestamp: new Date(),
            },
          ])
        }
      } catch (error) {
        console.error('Failed to create conversation:', error)
      }
    }

    initializeChat()
  }, [router])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || !conversationId || loading || streaming) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)
    setStreaming(true)

    try {
      // Send message and stream response
      const response = await fetch('http://localhost:3333/api/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          userMessage: inputValue,
        }),
      })

      // Create assistant message placeholder
      const assistantMessageId = Date.now().toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Read and stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        let done = false

        while (!done) {
          const { value, done: streamDone } = await reader.read()
          done = streamDone

          if (value) {
            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const data = JSON.parse(line.substring(6))

                  if (data.type === 'text') {
                    fullResponse += data.content

                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: fullResponse }
                          : msg
                      )
                    )
                  } else if (data.type === 'done') {
                    console.log('Stream complete')
                  } else if (data.type === 'error') {
                    console.error('Stream error:', data.message)
                  }
                } catch (e) {
                  // Not valid JSON, skip
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    router.push('/login')
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}>
          {/* Header */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
              }}>
                ◇
              </div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Diana</h1>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
            >
              Sign out
            </button>
          </header>

          {/* Messages Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', paddingTop: '60px' }}>
                <p style={{ fontSize: '16px', marginBottom: '12px' }}>Start a conversation with Diana</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    wordBreak: 'break-word',
                    lineHeight: '1.5',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {streaming && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '6px', padding: '12px 16px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.5s infinite',
                }} />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.5s infinite',
                  animationDelay: '0.3s',
                }} />
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#667eea',
                  animation: 'pulse 1.5s infinite',
                  animationDelay: '0.6s',
                }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              gap: '12px',
              padding: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Diana anything..."
              disabled={loading || streaming}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                opacity: loading || streaming ? 0.5 : 1,
                cursor: loading || streaming ? 'not-allowed' : 'text',
              }}
              onFocus={(e) => !loading && !streaming && (e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)')}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
            <button
              type="submit"
              disabled={loading || streaming || !inputValue.trim()}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading || streaming || !inputValue.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || streaming || !inputValue.trim() ? 0.6 : 1,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading && !streaming && inputValue.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Send
            </button>
          </form>
        </main>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </body>
    </html>
  )
}
