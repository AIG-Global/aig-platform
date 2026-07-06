'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  color: string
}

interface DocItem {
  id: string
  title: string
}

// Message Renderer Component
const MessageRenderer = ({ content, role }: { content: string; role: 'user' | 'assistant' }) => {
  if (role === 'user') {
    return <div>{content}</div>
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props: any) {
          const { children, className, inline } = props
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : 'text'

          if (inline) {
            return (
              <code
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                }}
              >
                {children}
              </code>
            )
          }

          return (
            <div
              style={{
                position: 'relative',
                marginTop: '12px',
                marginBottom: '12px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                Copy
              </button>
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                  margin: 0,
                  padding: '12px 16px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          )
        },
        h1: ({ children }: any) => (
          <h1 style={{ fontSize: '1.8em', marginTop: '12px', marginBottom: '8px' }}>{children}</h1>
        ),
        h2: ({ children }: any) => (
          <h2 style={{ fontSize: '1.4em', marginTop: '12px', marginBottom: '8px' }}>{children}</h2>
        ),
        h3: ({ children }: any) => (
          <h3 style={{ fontSize: '1.1em', marginTop: '10px', marginBottom: '6px' }}>{children}</h3>
        ),
        ul: ({ children }: any) => (
          <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>{children}</ul>
        ),
        ol: ({ children }: any) => (
          <ol style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>{children}</ol>
        ),
        li: ({ children }: any) => <li style={{ marginBottom: '4px' }}>{children}</li>,
        p: ({ children }: any) => <p style={{ marginTop: '8px', marginBottom: '8px', lineHeight: '1.6' }}>{children}</p>,
        a: ({ children, href }: any) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {children}
          </a>
        ),
        blockquote: ({ children }: any) => (
          <blockquote
            style={{
              borderLeft: '3px solid #667eea',
              paddingLeft: '12px',
              marginLeft: '0',
              marginTop: '8px',
              marginBottom: '8px',
              opacity: 0.8,
            }}
          >
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationIdFromQuery = searchParams.get('id')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [conversationTitle, setConversationTitle] = useState('New Chat')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [documents, setDocuments] = useState<DocItem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [streaming, setStreaming] = useState(false)

  // Initialize conversation on mount
  useEffect(() => {
    const initializeChat = async () => {
      const email = localStorage.getItem('userEmail')
      const id = localStorage.getItem('userId')

      if (!email || !id) {
        router.push('/login')
        return
      }

      setUserEmail(email)
      setUserId(id)

      // Fetch user's conversations, projects, documents in parallel
      try {
        const [convRes, projRes, docRes] = await Promise.all([
          fetch(`${API}/api/chat/user/${id}`),
          fetch(`${API}/api/projects/user/${id}`),
          fetch(`${API}/api/documents/user/${id}`),
        ])
        if (convRes.ok) setConversations(await convRes.json())
        if (projRes.ok) setProjects(await projRes.json())
        if (docRes.ok) setDocuments(await docRes.json())
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }

      // If conversation ID is provided in query params, load it
      if (conversationIdFromQuery) {
        try {
          const response = await fetch(`${API}/api/chat/${conversationIdFromQuery}`)
          if (response.ok) {
            const data = await response.json()
            setConversationId(data.id)
            setConversationTitle(data.title || 'New Chat')
            setMessages(
              data.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.createdAt),
              }))
            )
            return
          }
        } catch (error) {
          console.error('Failed to load conversation:', error)
        }
      }

      // Create new conversation
      try {
        const response = await fetch('${API}/api/chat/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: id,
            title: 'New Chat',
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setConversationId(data.id)
          setConversationTitle(data.title || 'New Chat')

          const greeting = `Welcome to AIGINVEST. I'm Diana. Let's build something together.`

          // Save Diana's greeting to DB
          await fetch('${API}/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: data.id,
              role: 'assistant',
              content: greeting,
            }),
          })

          setMessages([
            {
              id: '0',
              role: 'assistant',
              content: greeting,
              timestamp: new Date(),
            },
          ])

          // Refresh sidebar
          const convRes = await fetch(`${API}/api/chat/user/${id}`)
          if (convRes.ok) setConversations(await convRes.json())
        } else {
          console.warn(`Failed to create conversation: ${response.status}`)
          const tempId = `temp-${Date.now()}`
          setConversationId(tempId)
          setMessages([
            {
              id: '0',
              role: 'assistant',
              content: `Welcome to AIGINVEST. I'm Diana. Let's build something together.`,
              timestamp: new Date(),
            },
          ])
        }
      } catch (error) {
        console.error('Failed to create conversation:', error)
        const tempId = `temp-${Date.now()}`
        setConversationId(tempId)
        setMessages([
          {
            id: '0',
            role: 'assistant',
            content: `Welcome to AIGINVEST. I'm Diana. Let's build something together.`,
            timestamp: new Date(),
          },
        ])
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

    const messageText = inputValue
    setInputValue('')
    setLoading(true)
    setStreaming(true)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      // Send message and get response
      const response = await fetch('${API}/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          userMessage: messageText,          userId,        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      // Parse JSON response
      const data = await response.json()

      // Create assistant message with Diana's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize for the error. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-title: set conversation title from first user message
      if (messages.length <= 1) {
        const shortTitle = messageText.length > 40 ? messageText.slice(0, 40) + '…' : messageText
        try {
          await fetch(`${API}/api/chat/${conversationId}/title`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: shortTitle }),
          })
          setConversationTitle(shortTitle)
        } catch {}
      }

      // Refresh sidebar + projects
      if (userId) {
        try {
          const convRes = await fetch(`${API}/api/chat/user/${userId}`)
          if (convRes.ok) setConversations(await convRes.json())
          if (data.action?.type === 'create_project') {
            const projRes = await fetch(`${API}/api/projects/user/${userId}`)
            if (projRes.ok) setProjects(await projRes.json())
          }
          if (data.action?.type === 'create_document') {
            const docRes = await fetch(`${API}/api/documents/user/${userId}`)
            if (docRes.ok) setDocuments(await docRes.json())
          }
        } catch {}
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

  const updateConversationTitle = async () => {
    if (!titleInput.trim() || !conversationId) return

    try {
      const response = await fetch(`${API}/api/chat/${conversationId}/title`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput }),
      })

      if (response.ok) {
        setConversationTitle(titleInput)
        setEditingTitle(false)
      }
    } catch (error) {
      console.error('Failed to update title:', error)
    }
  }

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`${API}/api/chat/${convId}`)
      if (response.ok) {
        const data = await response.json()
        setConversationId(convId)
        setConversationTitle(data.title || 'New Chat')
        setMessages(
          data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.createdAt),
          }))
        )
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          display: 'flex',
          height: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}>
          {/* Sidebar */}
          <aside style={{
            width: '260px',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(0, 0, 0, 0.3)',
            overflowY: 'auto',
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
              onClick={async () => {
                  if (!userId) return
                  try {
                    const response = await fetch('${API}/api/chat/create', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId, title: 'New Chat' }),
                    })
                    if (response.ok) {
                      const data = await response.json()
                      const greeting = `Welcome to AIGINVEST. I'm Diana. Let's build something together.`
                      await fetch('${API}/api/chat/message', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ conversationId: data.id, role: 'assistant', content: greeting }),
                      })
                      setConversationId(data.id)
                      setConversationTitle('New Chat')
                      setMessages([{ id: '0', role: 'assistant', content: greeting, timestamp: new Date() }])
                      const convRes = await fetch(`${API}/api/chat/user/${userId}`)
                      if (convRes.ok) setConversations(await convRes.json())
                    }
                  } catch {
                    setConversationId(`temp-${Date.now()}`)
                    setConversationTitle('New Chat')
                    setMessages([{ id: '0', role: 'assistant', content: `Welcome to AIGINVEST. I'm Diana. Let's build something together.`, timestamp: new Date() }])
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                + New Chat
              </button>
            </div>

            <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
                Chats
              </p>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: '4px',
                    background: conv.id === conversationId ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    border: '1px solid ' + (conv.id === conversationId ? 'rgba(102, 126, 234, 0.5)' : 'transparent'),
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { if (conv.id !== conversationId) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={(e) => { if (conv.id !== conversationId) e.currentTarget.style.background = 'transparent' }}
                >
                  {conv.title}
                </button>
              ))}

              {projects.length > 0 && (
                <>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginTop: '16px', marginBottom: '8px' }}>
                    Projects
                  </p>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      style={{
                        padding: '8px 12px',
                        marginBottom: '4px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea', flexShrink: 0 }} />
                      {proj.name}
                    </div>
                  ))}
                </>
              )}

              {documents.length > 0 && (
                <>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginTop: '16px', marginBottom: '8px' }}>
                    Documents
                  </p>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        padding: '8px 12px',
                        marginBottom: '4px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '10px', opacity: 0.5 }}>📄</span>
                      {doc.title}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                Sign out
              </button>
            </div>
          </aside>

          {/* Main Chat Area */}
          <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <header style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)',
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
                {editingTitle ? (
                  <input
                    autoFocus
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onBlur={updateConversationTitle}
                    onKeyDown={(e) => e.key === 'Enter' && updateConversationTitle()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.5)',
                      borderRadius: '4px',
                      color: '#fff',
                      padding: '4px 8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <h1
                    onClick={() => {
                      setEditingTitle(true)
                      setTitleInput(conversationTitle)
                    }}
                    style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {conversationTitle}
                  </h1>
                )}
              </div>
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
                  <p style={{ fontSize: '18px', marginBottom: '24px', color: '#aaa' }}>What would you like to work on?</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '480px', margin: '0 auto' }}>
                    {['Create my first project', 'Continue yesterday\'s work', 'Generate a document', 'Organize my tasks', 'Help me learn something'].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setInputValue(prompt)}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(102, 126, 234, 0.1)',
                          border: '1px solid rgba(102, 126, 234, 0.3)',
                          borderRadius: '20px',
                          color: '#aaa',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'; e.currentTarget.style.color = '#aaa' }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
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
                      <MessageRenderer content={msg.content} role={msg.role} />
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
        </div>

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
