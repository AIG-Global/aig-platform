'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Volume2, VolumeX } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'diana'
  timestamp: Date
}

export default function DianaWidget() {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate Diana response
    setTimeout(() => {
      const dianaResponses: { [key: string]: string } = {
        'hi': "Hello! I'm here to help you learn about AIGINVEST ecosystem. What would you like to know?",
        'pricing': "We offer 4 membership tiers: Free (€0), Starter (€399/month), Professional (€699/month), and Enterprise (€2,999/month).",
        'diana': "I'm Diana, your AI companion. I can help with the AIG ecosystem, answer questions, and guide you through features.",
        'affiliate': "Our affiliate program offers 26% commission on Level 1, with up to 10 levels of commissions. Professional tier members get unlimited earning!",
        'earn': "You can earn through affiliate commissions, marketplace sales, investments, and more. All earnings get 80% EUR Cash + 20% AIG$ tokens.",
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

      // Text-to-speech if not muted
      if (!isMuted && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.rate = 0.95
        window.speechSynthesis.speak(utterance)
      }
    }, 500)
  }

  return (
    <>
      {/* Diana Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {isOpen ? (
          <div className="bg-luxury-cream dark:bg-luxury-900 rounded-2xl shadow-2xl w-96 h-96 flex flex-col border border-luxury-gold/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-950 p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-950/30 bg-luxury-950/10">
                  <img
                    src="/avatars/diana/diana-avatar.svg"
                    alt="Diana"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Diana</h3>
                  <p className="text-xs text-luxury-950/70">AI Assistant • Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:bg-luxury-950/20 rounded-lg transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-luxury-950/20 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-luxury-cream dark:bg-luxury-900">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.sender === 'diana' && (
                    <img
                      src="/avatars/diana/diana-avatar.svg"
                      alt="Diana"
                      className="w-7 h-7 rounded-full flex-shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-luxury-gold text-luxury-950 rounded-br-none font-medium'
                        : 'bg-luxury-800 dark:bg-luxury-800 text-luxury-cream rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-2">
                  <img
                    src="/avatars/diana/diana-avatar.svg"
                    alt="Diana"
                    className="w-7 h-7 rounded-full flex-shrink-0"
                  />
                  <div className="bg-luxury-800 dark:bg-luxury-800 px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-luxury-gold/30 p-3 flex gap-2 bg-luxury-cream dark:bg-luxury-900 rounded-b-2xl">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Diana..."
                className="flex-1 px-3 py-2 bg-luxury-cream-dark dark:bg-luxury-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold dark:text-luxury-cream"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-luxury-gold hover:bg-luxury-gold-light disabled:bg-gray-400 text-luxury-950 rounded-lg transition font-bold"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-light hover:to-luxury-gold text-luxury-950 rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-110 overflow-hidden border-2 border-luxury-gold/60 hover:border-luxury-gold"
            title="Chat with Diana"
          >
            <img
              src="/avatars/diana/diana-avatar.svg"
              alt="Diana"
              className="w-14 h-14"
            />
          </button>
        )}
      </div>
    </>
  )
}
