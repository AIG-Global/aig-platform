'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Conversation {
  id: string
  title: string
  updatedAt: string
}

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [greeting, setGreeting] = useState('Hello')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeHome = async () => {
      const email = localStorage.getItem('userEmail')
      const id = localStorage.getItem('userId')

      if (!email || !id) {
        router.push('/login')
        return
      }

      // Extract name from email
      const name = email.split('@')[0]
      setUserName(name)
      setUserId(id)

      // Set greeting based on time of day
      const hour = new Date().getHours()
      if (hour < 12) {
        setGreeting('Good morning')
      } else if (hour < 18) {
        setGreeting('Good afternoon')
      } else {
        setGreeting('Good evening')
      }

      // Fetch recent conversations
      try {
        const response = await fetch(`http://localhost:3333/api/api/chat/user/${id}`)
        if (response.ok) {
          const convs = await response.json()
          setConversations(convs.slice(0, 3)) // Show top 3
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeHome()
  }, [router])

  const startNewChat = () => {
    router.push('/chat')
  }

  const continueChatRaw = (conversationId: string) => {
    router.push(`/chat?id=${conversationId}`)
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
          }}
        >
          {/* Main Welcome Container */}
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Diana Avatar - Idle Pose */}
            <div
              style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                fontWeight: 'bold',
                marginBottom: '32px',
                animation: 'float 3s ease-in-out infinite',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
              }}
            >
              ◇
            </div>

            {/* Greeting */}
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {greeting}, {userName}.
            </h1>

            {/* Intro */}
            <p
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#ccc',
                margin: '0 0 8px 0',
              }}
            >
              I'm Diana.
            </p>

            <p
              style={{
                fontSize: '16px',
                color: '#999',
                margin: '0 0 40px 0',
                lineHeight: '1.6',
              }}
            >
              Your AI companion for thinking, building, and organizing. I'll remember our conversations and help you continue where you left off.
            </p>

            {/* Recent Activity */}
            {conversations.length > 0 && (
              <div
                style={{
                  width: '100%',
                  marginBottom: '40px',
                  textAlign: 'left',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
              >
                <p style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', marginBottom: '12px', margin: 0 }}>
                  Recent Activity
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '12px',
                  }}
                >
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => continueChatRaw(conv.id)}
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'
                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'
                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      • {conv.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question Prompt */}
            <p
              style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#ccc',
                marginBottom: '20px',
              }}
            >
              How can I help you today?
            </p>

            {/* Action Buttons */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <button
                onClick={startNewChat}
                style={{
                  padding: '14px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Start a New Conversation
              </button>

              <button
                onClick={() => router.push('/login')}
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Quick Tips */}
            <div
              style={{
                marginTop: '60px',
                fontSize: '12px',
                color: '#666',
                textAlign: 'center',
                lineHeight: '1.8',
              }}
            >
              <p style={{ margin: '0 0 8px 0' }}>💡 Try asking me to:</p>
              <p style={{ margin: '0 0 4px 0' }}>• Help you think through a problem</p>
              <p style={{ margin: '0 0 4px 0' }}>• Generate a project plan or document</p>
              <p style={{ margin: 0 }}>• Research a topic or explain a concept</p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          body {
            animation: fadeIn 0.6s ease-out;
          }
        `}</style>
      </body>
    </html>
  )
}
