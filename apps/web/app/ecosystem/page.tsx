'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, Unlock, Brain, Zap, Coins, Globe, Users, TrendingUp } from 'lucide-react'

const TIER_APPS = {
  remittance: [
    { id: 'ask', name: 'AIG Ask', description: 'Claude AI chat (limited)', icon: Brain },
    { id: 'games', name: 'MoneyGames', description: 'Community competitions', icon: Zap }
  ],
  starter: [
    { id: 'ask', name: 'AIG Ask', description: 'Claude AI chat integration', icon: Brain },
    { id: 'translate', name: 'AIG Translate', description: '28 languages', icon: Globe },
    { id: 'record', name: 'AIG Record', description: 'Meeting transcription', icon: Zap },
    { id: 'alerts', name: 'Investor Alerts', description: 'Market intelligence', icon: TrendingUp },
    { id: 'games', name: 'MoneyGames', description: 'Community competitions', icon: Zap },
    { id: 'news', name: 'AIG News', description: 'Global news aggregation', icon: Globe },
    { id: 'me', name: 'AIG Me', description: 'Personal relationship manager', icon: Users }
  ],
  'start-up': [
    { id: 'ask', name: 'AIG Ask', description: 'Claude AI chat integration', icon: Brain },
    { id: 'translate', name: 'AIG Translate', description: '28 languages', icon: Globe },
    { id: 'record', name: 'AIG Record', description: 'Meeting transcription', icon: Zap },
    { id: 'alerts', name: 'Investor Alerts', description: 'Market intelligence', icon: TrendingUp },
    { id: 'games', name: 'MoneyGames', description: 'Community competitions', icon: Zap },
    { id: 'news', name: 'AIG News', description: 'Global news aggregation', icon: Globe },
    { id: 'me', name: 'AIG Me', description: 'Personal relationship manager', icon: Users },
    { id: 'weather', name: 'Business Weather', description: 'Professional forecasts', icon: Zap },
    { id: 'helo', name: 'AIG HELO', description: 'Emergency travel assistant', icon: TrendingUp }
  ],
  professional: [
    { id: 'ask', name: 'AIG Ask', description: 'Claude AI chat integration', icon: Brain },
    { id: 'translate', name: 'AIG Translate', description: '28 languages', icon: Globe },
    { id: 'record', name: 'AIG Record', description: 'Meeting transcription', icon: Zap },
    { id: 'alerts', name: 'Investor Alerts', description: 'Market intelligence', icon: TrendingUp },
    { id: 'games', name: 'MoneyGames', description: 'Community competitions', icon: Zap },
    { id: 'news', name: 'AIG News', description: 'Global news aggregation', icon: Globe },
    { id: 'me', name: 'AIG Me', description: 'Personal relationship manager', icon: Users },
    { id: 'weather', name: 'Business Weather', description: 'Professional forecasts', icon: Zap },
    { id: 'helo', name: 'AIG HELO', description: 'Emergency travel assistant', icon: TrendingUp },
    { id: 'secure-sign', name: 'Secure Sign', description: 'E-signature with audit trail', icon: Lock }
  ]
}

export default function EcosystemPage() {
  const [selectedTier, setSelectedTier] = useState<'remittance' | 'starter' | 'start-up' | 'professional'>('professional')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const tiers = [
    { id: 'remittance', name: 'Remittance', price: '€0', featured: false },
    { id: 'starter', name: 'Starter', price: '€399/mo', featured: false },
    { id: 'start-up', name: 'Start-Up', price: '€999/mo', featured: false },
    { id: 'professional', name: 'Professional', price: '€2,999/mo', featured: true }
  ]

  const apps = TIER_APPS[selectedTier]
  const currentApp = apps.find(app => app.id === selectedApp)

  return (
    <div style={{
      background: 'linear-gradient(to right bottom, #1a0f15, #2a1f28, #1a0f15)',
      color: '#f5f5dc'
    }} className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 style={{
            background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-5xl font-bold mb-4">
            AIGINVEST Ecosystem
          </h1>
          <p style={{ color: '#e8e8d0' }} className="text-xl">
            Access powerful AI-powered applications based on your membership tier
          </p>
        </div>

        {/* Tier Selection */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          {tiers.map(tier => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id as any)}
              style={{
                backgroundColor: selectedTier === tier.id ? 'rgba(212, 175, 55, 0.2)' : 'rgba(61, 44, 53, 0.3)',
                borderColor: selectedTier === tier.id ? '#d4af37' : '#d4af37',
                borderWidth: selectedTier === tier.id ? '2px' : '1px'
              }}
              className="rounded-lg p-4 transition"
            >
              <h3 style={{ color: '#f5f5dc' }} className="font-bold text-lg mb-2">{tier.name}</h3>
              <p style={{ color: '#d4af37' }}>{tier.price}</p>
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Apps List */}
          <div className="lg:col-span-1">
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-6">
              <h2 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-4">Available Apps</h2>
              <div className="space-y-2">
                {apps.map(app => {
                  const IconComponent = app.icon
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id)}
                      style={{
                        backgroundColor: selectedApp === app.id ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                        borderColor: selectedApp === app.id ? '#d4af37' : '#d4af37',
                        borderWidth: '1px'
                      }}
                      className="w-full rounded-lg p-3 text-left transition hover:bg-[rgba(212,175,55,0.1)]"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={20} style={{ color: '#d4af37' }} />
                        <div>
                          <p style={{ color: '#f5f5dc' }} className="font-semibold">{app.name}</p>
                          <p style={{ color: '#e8e8d0' }} className="text-sm">{app.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* App Details / Demo */}
          <div className="lg:col-span-2">
            {currentApp ? (
              <AppDemo app={currentApp} tier={selectedTier} />
            ) : (
              <div style={{
                backgroundColor: 'rgba(61, 44, 53, 0.3)',
                borderColor: '#d4af37',
                borderWidth: '1px'
              }} className="rounded-xl p-12 text-center">
                <p style={{ color: '#e8e8d0' }} className="text-xl">
                  Select an app to view details and demo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* WDM Section */}
        <div className="mt-20 pt-20" style={{
          borderTopColor: '#d4af37',
          borderTopWidth: '1px'
        }}>
          <h2 style={{
            background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-4xl font-bold mb-6">
            World Domination Market (WDM)
          </h2>
          <p style={{ color: '#e8e8d0' }} className="text-lg mb-8 max-w-2xl">
            Luxury marketplace with 100% commission redistribution. Buy premium goods and earn commissions from your entire network.
          </p>
          <Link
            href="/ecosystem/wdm"
            style={{
              backgroundColor: '#d4af37',
              color: '#1a0f15'
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold hover:bg-[#e8d4a2] transition"
          >
            Explore WDM <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface AppDemoProps {
  app: any
  tier: string
}

function AppDemo({ app, tier }: AppDemoProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: `Welcome to ${app.name}! How can I help you today?` }
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, text: input }]
    setMessages(newMessages)
    setInput('')

    // Simulate AI response (in real app, would call API)
    setTimeout(() => {
      let aiResponse = `Processing your request: "${input}"`
      
      if (app.id === 'ask') {
        aiResponse = `I'm analyzing your question: "${input}". This is a demonstration of AIG Ask. In production, this would connect to Claude AI for intelligent responses.`
      } else if (app.id === 'translate') {
        aiResponse = `Translation feature active. I can translate "${input}" into 28 different languages. Select a target language to proceed.`
      } else if (app.id === 'record') {
        aiResponse = `Meeting recording initialized. Ready to transcribe your meeting. Say "stop" when done.`
      } else if (app.id === 'alerts') {
        aiResponse = `Market Intelligence: Scanning for relevant alerts matching "${input}". You have 0 active alerts matching these keywords.`
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    }, 500)
  }

  return (
    <div style={{
      backgroundColor: 'rgba(61, 44, 53, 0.3)',
      borderColor: '#d4af37',
      borderWidth: '1px'
    }} className="rounded-xl p-8">
      <div className="mb-6">
        <h3 style={{ color: '#f5f5dc' }} className="text-3xl font-bold mb-2">{app.name}</h3>
        <p style={{ color: '#e8e8d0' }} className="text-lg">{app.description}</p>
        <p style={{ color: '#d4af37' }} className="text-sm mt-2">Available in: {tier.charAt(0).toUpperCase() + tier.slice(1)} and above</p>
      </div>

      {/* Chat Demo */}
      <div style={{
        backgroundColor: 'rgba(26, 15, 21, 0.5)',
        borderColor: '#d4af37',
        borderWidth: '1px'
      }} className="rounded-lg p-6 mb-6">
        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                backgroundColor: msg.role === 'user' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(61, 44, 53, 0.5)',
                color: msg.role === 'user' ? '#f5f5dc' : '#f5f5dc',
                marginLeft: msg.role === 'user' ? 'auto' : '0',
                marginRight: msg.role === 'user' ? '0' : 'auto'
              }}
              className="max-w-xs rounded-lg p-3"
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Try asking something..."
            style={{
              backgroundColor: 'rgba(26, 15, 21, 0.8)',
              borderColor: '#d4af37',
              color: '#f5f5dc',
              borderWidth: '1px'
            }}
            className="flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: '#d4af37',
              color: '#1a0f15'
            }}
            className="px-6 py-2 rounded-lg font-bold hover:bg-[#e8d4a2] transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* Features List */}
      <div>
        <h4 style={{ color: '#f5f5dc' }} className="font-bold mb-3">Features:</h4>
        <ul className="space-y-2">
          {app.id === 'ask' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Claude AI integration for intelligent responses
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Context-aware conversations
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Multi-language support
              </li>
            </>
          )}
          {app.id === 'translate' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Real-time translation to 28 languages
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                AI-powered accuracy
              </li>
            </>
          )}
          {app.id === 'record' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Automatic meeting transcription
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Speaker identification
              </li>
            </>
          )}
          {app.id === 'alerts' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Real-time market monitoring
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Custom alert configurations
              </li>
            </>
          )}
          {app.id === 'games' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Compete in community challenges
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Win prizes and rewards
              </li>
            </>
          )}
          {app.id === 'news' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Global news aggregation
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Personalized news feed
              </li>
            </>
          )}
          {app.id === 'me' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Manage your professional network
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Track relationships and interactions
              </li>
            </>
          )}
          {app.id === 'weather' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Professional business forecasts
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Impact analysis for your operations
              </li>
            </>
          )}
          {app.id === 'helo' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                24/7 emergency travel assistance
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Real-time support and resources
              </li>
            </>
          )}
          {app.id === 'secure-sign' && (
            <>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Legally binding e-signatures
              </li>
              <li style={{ color: '#e8e8d0' }} className="flex items-center gap-2">
                <Unlock size={16} style={{ color: '#d4af37' }} />
                Complete audit trail
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
