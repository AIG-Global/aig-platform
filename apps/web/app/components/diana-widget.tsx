'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Volume2, VolumeX } from 'lucide-react'

// Add CSS for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-0.5rem);
      }
    }
  `
  document.head.appendChild(style)
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'diana'
  timestamp: Date
}

export default function DianaWidget() {
  // ALL hooks must be called unconditionally
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Diana, your AI assistant. How can I help you today?",
      sender: 'diana',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isMuted, setIsMuted] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthPage, setIsAuthPage] = useState(false)

  // Use effect to check if we're on an auth page (after initial render)
  useEffect(() => {
    // Check immediately on mount and whenever location changes
    const checkAuthPage = () => {
      const pathname = window.location.pathname
      const isAuth = pathname === '/auth' || pathname.startsWith('/auth?')
      setIsAuthPage(isAuth)
    }
    
    checkAuthPage()
    
    // Also listen for route changes
    const handlePopState = () => checkAuthPage()
    window.addEventListener('popstate', handlePopState)
    
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const dianaResponses: { [key: string]: string } = {
        'hi': "Hello! I'm here to help you learn about AIGINVEST ecosystem. What would you like to know?",
        'pricing': "Check out our membership tiers: Package A (Free), Package B (€399/mo), Package C (€699/mo), and Enterprise (€2,999/mo). Visit /packages to see the full Wealth Escalation Pathway!",
        'package': "We have 4 membership packages: Free entry, Starter (€399/mo), Professional (€699/mo), and Enterprise (€2,999/mo). Each tier unlocks more earning potential. Visit /packages for details!",
        'diana': "I'm Diana, your AI companion. I can help with the AIG ecosystem, answer questions, and guide you through features.",
        'affiliate': "Our affiliate program offers 26% commission on Level 1, with up to 10 levels of commissions. Professional tier members get unlimited earning potential!",
        'earn': "You can earn through affiliate commissions, marketplace sales, investments, and more. All earnings get 80% EUR Cash + 20% AIG$ tokens.",
        'wealth': "Visit /packages to see The Wealth Escalation Pathway - our complete membership structure designed to help you grow your earnings!",
        'default': "That's a great question! I can help with information about memberships, Diana AI apps, the marketplace, affiliate program, and investments. What interests you?"
      }

      const lowerInput = input.toLowerCase()
      let response = dianaResponses['default']

      for (const [key, value] of Object.entries(dianaResponses)) {
        if (key !== 'default' && lowerInput.includes(key)) {
          response = value
          break
        }
      }

      const dianaMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'diana',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, dianaMessage])
      setIsLoading(false)

      if (!isMuted && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.rate = 0.95
        window.speechSynthesis.speak(utterance)
      }
    }, 500)
  }

  // Don't render on auth pages
  if (isAuthPage) {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 50,
      pointerEvents: 'auto'
    }}>
      {isOpen ? (
        <div 
          style={{
            borderRadius: '1rem',
            width: '24rem',
            height: '24rem',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backgroundColor: '#1a0f15',
            overflow: 'hidden'
          }}
        >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
              color: '#1a0f15',
              padding: '1rem',
              borderRadius: '1rem 1rem 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div 
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: 'none',
                    backgroundColor: 'transparent'
                  }}
                >
                  <img
                    src="/images/diana-avatar.png"
                    alt="Diana"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }}
                  />
                </div>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', margin: 0, color: '#1a0f15' }}>Diana</h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(26, 15, 21, 0.7)', margin: 0 }}>AI Assistant • Online</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    padding: '0.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(26, 15, 21, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '0.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(26, 15, 21, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: 'rgba(26, 15, 21, 0.8)'
              }}
            >
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  {msg.sender === 'diana' && (
                    <img
                      src="/images/diana-avatar.png"
                      alt="Diana"
                      style={{
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '50%',
                        flexShrink: 0,
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div
                    style={{
                      maxWidth: '20rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: msg.sender === 'user' ? '#d4af37' : '#3d2c35',
                      color: msg.sender === 'user' ? '#1a0f15' : '#f5f5dc',
                      borderBottomRightRadius: msg.sender === 'user' ? '0' : undefined,
                      borderBottomLeftRadius: msg.sender === 'diana' ? '0' : undefined,
                      fontWeight: msg.sender === 'user' ? 'bold' : 'normal'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' }}>
                  <img
                    src="/images/diana-avatar.png"
                    alt="Diana"
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      flexShrink: 0,
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    backgroundColor: '#3d2c35',
                    padding: '1rem',
                    borderRadius: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        backgroundColor: '#d4af37',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite'
                      }}></div>
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        backgroundColor: '#d4af37',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.2s'
                      }}></div>
                      <div style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        backgroundColor: '#d4af37',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite 0.4s'
                      }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div 
              style={{
                borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                borderRadius: '0 0 2rem 2rem',
                backgroundColor: 'rgba(26, 15, 21, 0.8)'
              }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Diana..."
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  color: '#f5f5dc',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  flex: 1,
                  outline: 'none',
                  border: '1.5px solid #d4af37'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px #d4af37';
                  e.target.style.outline = 'none'
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#d4af37',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                  opacity: !input.trim() || isLoading ? 0.5 : 1,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!(!input.trim() || isLoading)) {
                    e.currentTarget.style.opacity = '0.8'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(!input.trim() || isLoading)) {
                    e.currentTarget.style.opacity = '1'
                  }
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            title="Chat with Diana"
          >
            <img
              src="/images/diana-avatar.png"
              alt="Diana"
              style={{
                width: '10rem',
                height: 'auto',
                mixBlendMode: 'multiply'
              }}
            />
          </button>
        )}
      </div>
    )
}