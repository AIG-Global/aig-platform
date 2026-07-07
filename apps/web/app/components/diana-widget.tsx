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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-96 h-96 flex flex-col border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/avatars/diana/diana-avatar.svg"
                  alt="Diana"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-bold">Diana</h3>
                  <p className="text-xs text-blue-100">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-3 flex gap-2 bg-white dark:bg-slate-900 rounded-b-2xl">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Diana..."
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
            title="Chat with Diana"
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>
    </>
  )
}
