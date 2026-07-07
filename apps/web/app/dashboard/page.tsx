'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, ChevronRight, Check, Lock, Star, Zap, Copy } from 'lucide-react'

interface Package {
  id: string
  name: string
  monthlyPrice: number
  description: string
  earningCap: string | 'unlimited'
  apps: string[]
  bonusFeatures: string[]
  highlight?: boolean
}

const PACKAGES: Package[] = [
  {
    id: 'remittance',
    name: 'Remittance',
    monthlyPrice: 0,
    description: 'Start exploring the ecosystem',
    earningCap: '€100/month',
    apps: [
      'AIG Ask (Limited)',
      'MoneyGames',
      'Basic News Feed'
    ],
    bonusFeatures: [
      'Basic account access',
      'Limited WDM access'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 399,
    description: 'Begin your journey',
    earningCap: '€500/month',
    apps: [
      'AIG Ask',
      'AIG Translate (28 languages)',
      'AIG Record',
      'Investor Alerts',
      'MoneyGames',
      'AIG News',
      'AIG Me'
    ],
    bonusFeatures: [
      'Full WDM marketplace access',
      'Affiliate program (5 levels)',
      'Commission earnings',
      'Monthly competitions'
    ]
  },
  {
    id: 'startup',
    name: 'Start-Up',
    monthlyPrice: 999,
    description: 'Scale your growth',
    earningCap: '€5,000/month',
    apps: [
      'AIG Ask',
      'AIG Translate',
      'AIG Record',
      'Investor Alerts',
      'MoneyGames',
      'AIG News',
      'AIG Me',
      'Business Weather',
      'AIG HELO'
    ],
    bonusFeatures: [
      'Unlimited earning potential (up to cap)',
      '10-level affiliate program',
      'Preferred seller status',
      'Market intelligence tools',
      'Priority support',
      'Investment products access'
    ],
    highlight: true
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 2999,
    description: 'Maximum growth',
    earningCap: 'Unlimited',
    apps: [
      'AIG Ask',
      'AIG Translate',
      'AIG Record',
      'Investor Alerts',
      'MoneyGames',
      'AIG News',
      'AIG Me',
      'Business Weather',
      'AIG HELO',
      'Secure Sign',
      'Future AI Apps (Early Access)'
    ],
    bonusFeatures: [
      'Unlimited earning potential',
      'Custom AI training',
      'Organization support',
      'VIP features',
      '24/7 concierge support',
      'Strategic partnerships',
      'Custom integrations',
      'All future apps included'
    ]
  }
]

export default function DashboardPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>('startup')
  const [userName, setUserName] = useState('')
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [isLoadingUsername, setIsLoadingUsername] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem('userName')
    if (name) {
      setUserName(name)
    } else {
      // Show nickname form if user hasn't set one yet
      setShowUsernameForm(true)
    }

    // Generate or retrieve invitation code
    const savedCode = localStorage.getItem('userInvitationCode')
    if (savedCode) {
      setInvitationCode(savedCode)
    } else {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      localStorage.setItem('userInvitationCode', newCode)
      setInvitationCode(newCode)
    }
  }, [])

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
    localStorage.setItem('userPackage', packageId)
  }

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nicknameInput.trim()) return

    setIsLoadingUsername(true)
    setTimeout(() => {
      localStorage.setItem('userName', nicknameInput.trim())
      setUserName(nicknameInput.trim())
      setShowUsernameForm(false)
      setNicknameInput('')
      setIsLoadingUsername(false)
    }, 500)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleSignOut = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPackage')
    localStorage.removeItem('userInvitationCode')
    window.location.href = '/auth'
  }

  return (
    <div
      style={{
        background: 'linear-gradient(to right bottom, #1a0f15, #2a1f28, #1a0f15)',
        color: '#f5f5dc'
      }}
      className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Nickname Selection Form */}
        {showUsernameForm && (
          <div
            style={{
              backgroundColor: 'rgba(61, 44, 53, 0.7)',
              borderColor: '#d4af37'
            }}
            className="border rounded-xl p-8 mb-12 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-2">Choose Your Nickname</h2>
            <p style={{ color: '#e8e8d0' }} className="text-sm mb-6">
              Your nickname is your public identity on AIGINVEST. Choose something unique that represents you!
            </p>
            <form onSubmit={handleSaveNickname} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Enter your nickname..."
                  style={{
                    backgroundColor: 'rgba(26, 15, 21, 0.8)',
                    borderColor: '#d4af37'
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-[#f5f5dc] placeholder-[#e8e8d0]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  maxLength={20}
                  required
                />
                <p style={{ color: '#e8e8d0' }} className="text-xs mt-2">
                  {nicknameInput.length}/20 characters
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoadingUsername || !nicknameInput.trim()}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition disabled:opacity-50"
              >
                {isLoadingUsername ? 'Saving...' : 'Set Nickname & Continue'}
              </button>
            </form>
          </div>
        )}

        {/* Header - only show after username is set */}
        {!showUsernameForm && (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {userName}! 👋</h1>
            <p style={{ color: '#e8e8d0' }} className="text-lg">
              Select the perfect plan and get immediate access to premium apps
            </p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              borderColor: '#d4af37',
              color: '#d4af37'
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-[#d4af37]/10 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        {/* Info Box */}
        <div
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: '#d4af37'
          }}
          className="border rounded-lg p-4 mb-12"
        >
          <p style={{ color: '#e8d4a2' }} className="text-sm">
            💡 <strong>No membership fees.</strong> You only pay for the apps you use. Bigger packages include bonus apps and higher earning capabilities.
          </p>
        </div>

        {/* Invitation Code Section */}
        <div
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            borderColor: '#d4af37'
          }}
          className="border rounded-lg p-6 mb-12"
        >
          <h3 style={{ color: '#d4af37' }} className="font-bold text-lg mb-3">
            📨 Invite Others to AIGINVEST
          </h3>
          <p style={{ color: '#e8e8d0' }} className="text-sm mb-4">
            Share your unique invitation code with friends and family. They can use it to join and start their journey with AIGINVEST.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              style={{
                backgroundColor: 'rgba(26, 15, 21, 0.8)',
                borderColor: '#d4af37'
              }}
              className="border rounded-lg px-6 py-3 flex items-center gap-4"
            >
              <code style={{ color: '#d4af37' }} className="text-xl font-bold tracking-wider">
                {invitationCode}
              </code>
              <button
                onClick={handleCopyCode}
                style={{
                  backgroundColor: copiedCode ? '#10b981' : '#d4af37',
                  color: '#1a0f15'
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition hover:opacity-90"
              >
                <Copy size={16} />
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg.id)}
              style={{
                backgroundColor: selectedPackage === pkg.id ? 'rgba(212, 175, 55, 0.15)' : 'rgba(61, 44, 53, 0.5)',
                borderColor: selectedPackage === pkg.id ? '#d4af37' : '#d4af37',
                borderWidth: selectedPackage === pkg.id ? '2px' : '1px'
              }}
              className="rounded-xl p-6 cursor-pointer transition hover:border-[#e8d4a2] relative"
            >
              {pkg.highlight && (
                <div
                  style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                  className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg rounded-tr-xl text-xs font-bold flex items-center gap-1"
                >
                  <Star size={14} />
                  POPULAR
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                  <p style={{ color: '#e8e8d0' }} className="text-sm">
                    {pkg.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    {pkg.monthlyPrice > 0 ? (
                      <>
                        <span className="text-3xl font-bold">€{pkg.monthlyPrice}</span>
                        <span style={{ color: '#e8e8d0' }} className="text-sm">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Free</span>
                    )}
                  </div>
                  <p
                    style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                    className="text-xs font-semibold mt-2 px-2 py-1 rounded inline-block"
                  >
                    Cap: {pkg.earningCap}
                  </p>
                </div>

                <div>
                  <p style={{ color: '#e8e8d0' }} className="text-xs uppercase tracking-wide font-semibold mb-3">
                    Apps Included ({pkg.apps.length})
                  </p>
                  <div className="space-y-2">
                    {pkg.apps.map((app, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check size={16} style={{ color: '#d4af37' }} className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: selectedPackage === pkg.id ? '#d4af37' : 'transparent',
                    color: selectedPackage === pkg.id ? '#1a0f15' : '#d4af37',
                    borderColor: '#d4af37'
                  }}
                  className="w-full py-2 rounded-lg font-semibold border transition hover:bg-[#d4af37]/20"
                >
                  {pkg.monthlyPrice === 0 ? 'Start Free' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Comparison */}
        {selectedPackage && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              {PACKAGES.find((p) => p.id === selectedPackage)?.name} - Complete Features
            </h2>

            <div
              style={{
                backgroundColor: 'rgba(61, 44, 53, 0.5)',
                borderColor: '#d4af37'
              }}
              className="border rounded-xl p-8"
            >
              <div className="space-y-6">
                <div>
                  <h3 style={{ color: '#d4af37' }} className="text-lg font-bold mb-3">
                    📱 Available Apps
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKAGES.find((p) => p.id === selectedPackage)?.apps.map((app, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Zap size={16} style={{ color: '#d4af37' }} className="flex-shrink-0 mt-1" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#d4af37' }} className="text-lg font-bold mb-3">
                    🎁 Bonus Features
                  </h3>
                  <div className="space-y-2">
                    {PACKAGES.find((p) => p.id === selectedPackage)?.bonusFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check size={16} style={{ color: '#d4af37' }} className="flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: '#d4af37',
                    color: '#1a0f15'
                  }}
                  className="w-full py-3 rounded-lg font-semibold hover:bg-[#e8d4a2] transition mt-6 flex items-center justify-center gap-2"
                >
                  Upgrade to {PACKAGES.find((p) => p.id === selectedPackage)?.name}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/ecosystem"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: '#d4af37',
              color: '#f5f5dc'
            }}
            className="border rounded-lg p-4 text-center hover:bg-[#d4af37]/20 transition"
          >
            <div style={{ color: '#d4af37' }} className="text-2xl mb-2">
              🚀
            </div>
            <p className="text-sm font-semibold">Explore Ecosystem</p>
          </Link>

          <Link
            href="/ecosystem/wdm"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: '#d4af37',
              color: '#f5f5dc'
            }}
            className="border rounded-lg p-4 text-center hover:bg-[#d4af37]/20 transition"
          >
            <div style={{ color: '#d4af37' }} className="text-2xl mb-2">
              🛍️
            </div>
            <p className="text-sm font-semibold">Go to WDM</p>
          </Link>

          <a
            href="#"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: '#d4af37',
              color: '#f5f5dc'
            }}
            className="border rounded-lg p-4 text-center hover:bg-[#d4af37]/20 transition"
          >
            <div style={{ color: '#d4af37' }} className="text-2xl mb-2">
              💬
            </div>
            <p className="text-sm font-semibold">Contact Support</p>
          </a>

          <a
            href="#"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: '#d4af37',
              color: '#f5f5dc'
            }}
            className="border rounded-lg p-4 text-center hover:bg-[#d4af37]/20 transition"
          >
            <div style={{ color: '#d4af37' }} className="text-2xl mb-2">
              ⚙️
            </div>
            <p className="text-sm font-semibold">Account Settings</p>
          </a>
        </div>
      </div>
          </>
        )}
      </div>

      {/* Diana Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          style={{
            background: 'linear-gradient(to br, #d4af37, #e8d4a2)',
            color: '#1a0f15'
          }}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-110 border-2 border-[#d4af37]"
          title="Chat with Diana"
        >
          💬
        </button>
      </div>
    </div>
  )
}
