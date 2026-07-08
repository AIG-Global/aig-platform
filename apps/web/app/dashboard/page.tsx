'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, ChevronRight, Check, Lock, Star, Zap, Copy, Gift } from 'lucide-react'

interface Package {
  id: string
  name: string
  monthlyPrice: number
  description: string
  earningCap: string | 'unlimited'
  investmentCapacity: string | 'unlimited'
  apps: string[]
  bonusFeatures: string[]
  highlight?: boolean
}

const PACKAGES: Package[] = [
  {
    id: 'packagea',
    name: 'Package A',
    monthlyPrice: 399,
    description: 'Getting started',
    earningCap: '€1,000/month',
    investmentCapacity: '€1,000',
    apps: ['App Store', 'Investment Hub', 'Analytics'],
    bonusFeatures: ['Email support', 'Basic commissions', 'Starter analytics'],
    highlight: false
  },
  {
    id: 'packageb',
    name: 'Package B',
    monthlyPrice: 699,
    description: 'Growing faster',
    earningCap: '€5,000/month',
    investmentCapacity: '€5,000',
    apps: ['App Store', 'Investment Hub', 'Analytics', 'Premium Tools', 'Team Collaboration', 'Advanced Reporting', 'Mobile App'],
    bonusFeatures: ['Priority support', 'Advanced commissions', 'Team management', 'Portfolio tracking'],
    highlight: false
  },
  {
    id: 'packagec',
    name: 'Package C',
    monthlyPrice: 1099,
    description: 'Established business',
    earningCap: '€10,000/month',
    investmentCapacity: '€10,000',
    apps: ['App Store', 'Investment Hub', 'Analytics', 'Premium Tools', 'Team Collaboration', 'Advanced Reporting', 'Mobile App', 'VIP Concierge', 'API Access'],
    bonusFeatures: ['24/7 priority support', 'Enhanced commissions', 'Advanced analytics', 'Custom integrations', 'White Label Options'],
    highlight: true
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 2999,
    description: 'Enterprise solutions',
    earningCap: 'unlimited',
    investmentCapacity: 'unlimited',
    apps: ['App Store', 'Investment Hub', 'Analytics', 'Premium Tools', 'Team Collaboration', 'Advanced Reporting', 'Mobile App', 'VIP Concierge', 'API Access', 'White Label', 'Enterprise Features'],
    bonusFeatures: ['Dedicated account manager', 'Unlimited commissions', 'Real-time analytics', 'Custom development', 'Priority feature requests', 'Unlimited investment access'],
    highlight: false
  }
]

export default function DashboardPage() {
  const [selectedPackage, setSelectedPackage] = useState('packagec')
  const [userName, setUserName] = useState('')
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [isLoadingUsername, setIsLoadingUsername] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [cashBalance, setCashBalance] = useState(0)
  const [giftCerts, setGiftCerts] = useState({ professional: 0, starter: 0 })
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedPackage = localStorage.getItem('userPackage')
    const savedCode = localStorage.getItem('userInvitationCode')

    setUserEmail(email || '')
    
    // Check if this is the demo account (mikko.antila@me.com)
    const isDemoAccount = email === 'mikko.antila@me.com'

    // For demo account, set default package to Professional if no saved package
    if (isDemoAccount) {
      if (!savedPackage) {
        setSelectedPackage('professional')
        localStorage.setItem('userPackage', 'professional')
      } else {
        setSelectedPackage(savedPackage)
      }
      
      // Set demo account details
      setCashBalance(15000)
      setGiftCerts({ professional: 25, starter: 25 })
      localStorage.setItem('userCash', '15000')
      localStorage.setItem('userGiftCerts', JSON.stringify({ professional: 25, starter: 25 }))
    } else {
      // Regular users
      if (savedPackage) {
        setSelectedPackage(savedPackage)
      }
      
      // Try to load from localStorage for other users
      const savedCash = localStorage.getItem('userCash')
      const savedGiftCerts = localStorage.getItem('userGiftCerts')
      if (savedCash) setCashBalance(parseInt(savedCash))
      if (savedGiftCerts) setGiftCerts(JSON.parse(savedGiftCerts))
    }
    
    if (!savedName) {
      setShowUsernameForm(true)
    } else {
      setUserName(savedName)
    }

    // Generate invitation code if not exists
    if (!savedCode) {
      const newCode = Math.random().toString(36).substring(2, 10).toUpperCase()
      setInvitationCode(newCode)
      localStorage.setItem('userInvitationCode', newCode)
    } else {
      setInvitationCode(savedCode)
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
            className="border rounded-lg p-8 mb-12 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#d4af37' }}>
              Welcome! Let's Set Your Nickname
            </h2>
            <form onSubmit={handleSaveNickname}>
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: '#e8e8d0' }}>
                  Choose a Nickname
                </label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="e.g., Mikko"
                  style={{ backgroundColor: 'rgba(26, 15, 21, 0.8)' }}
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

        {/* Main Content - Only show after username is set */}
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

            {/* Account Balance & Gift Certificates */}
            {(cashBalance > 0 || giftCerts.professional > 0 || giftCerts.starter > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Cash Balance */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981'
                  }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ color: '#10b981' }} className="font-bold">
                      Cash Balance
                    </h3>
                    <span style={{ color: '#10b981' }} className="text-2xl">💰</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">€{cashBalance.toLocaleString()}</p>
                  <p style={{ color: '#e8e8d0' }} className="text-xs">
                    Available for investments
                  </p>
                </div>

                {/* Professional Gift Certs */}
                {giftCerts.professional > 0 && (
                  <div
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      borderColor: '#d4af37'
                    }}
                    className="border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ color: '#d4af37' }} className="font-bold">
                        Professional Certs
                      </h3>
                      <Gift size={20} style={{ color: '#d4af37' }} />
                    </div>
                    <p className="text-3xl font-bold mb-1">{giftCerts.professional}</p>
                    <p style={{ color: '#e8e8d0' }} className="text-xs">
                      €2,999/month package
                    </p>
                  </div>
                )}

                {/* Starter Gift Certs */}
                {giftCerts.starter > 0 && (
                  <div
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: '#3b82f6'
                    }}
                    className="border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ color: '#3b82f6' }} className="font-bold">
                        Starter Certs
                      </h3>
                      <Gift size={20} style={{ color: '#3b82f6' }} />
                    </div>
                    <p className="text-3xl font-bold mb-1">{giftCerts.starter}</p>
                    <p style={{ color: '#e8e8d0' }} className="text-xs">
                      €399/month package
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Gift Certificate Info */}
            {(giftCerts.professional > 0 || giftCerts.starter > 0) && (
              <div
                style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  borderColor: '#a855f7'
                }}
                className="border rounded-lg p-4 mb-12"
              >
                <p style={{ color: '#a855f7' }} className="text-sm font-semibold mb-2">
                  ℹ️ About Gift Certificates
                </p>
                <p style={{ color: '#e8e8d0' }} className="text-sm">
                  Gift certificates are complimentary packages to share with others. <strong>Note:</strong> Gift certificates do not generate commissions—they are meant to help others get started with AIGINVEST. Only direct subscriptions and affiliate sales generate commissions.
                </p>
              </div>
            )}

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
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">€{pkg.monthlyPrice}</span>
                        <span style={{ color: '#e8e8d0' }} className="text-sm">/month</span>
                      </div>
                      <p style={{ color: '#d4af37' }} className="text-xs mt-1">
                        Earning cap: {typeof pkg.earningCap === 'string' ? pkg.earningCap : pkg.earningCap}
                      </p>
                      <p style={{ color: '#10b981' }} className="text-xs mt-1">
                        Investment capacity: {typeof pkg.investmentCapacity === 'string' ? pkg.investmentCapacity : pkg.investmentCapacity}
                      </p>
                    </div>

                    <div
                      style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: '#d4af37' }}
                      className="border rounded p-3"
                    >
                      <p style={{ color: '#d4af37' }} className="text-xs font-semibold mb-2">
                        ✓ Includes {pkg.apps.length} apps
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Package Details */}
            {selectedPackage && (
              <div
                style={{
                  backgroundColor: 'rgba(61, 44, 53, 0.7)',
                  borderColor: '#d4af37'
                }}
                className="border rounded-lg p-8 mb-12"
              >
                <h2 className="text-3xl font-bold mb-6">
                  {PACKAGES.find((p) => p.id === selectedPackage)?.name} Package Details
                </h2>

                <div
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: '#d4af37'
                  }}
                  className="border rounded-lg p-4 mb-6 grid md:grid-cols-2 gap-6"
                >
                  <div>
                    <p style={{ color: '#d4af37' }} className="text-sm font-semibold mb-1">
                      Monthly Earning Cap
                    </p>
                    <p className="text-2xl font-bold">
                      {PACKAGES.find((p) => p.id === selectedPackage)?.earningCap === 'unlimited'
                        ? 'Unlimited'
                        : PACKAGES.find((p) => p.id === selectedPackage)?.earningCap}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#10b981' }} className="text-sm font-semibold mb-1">
                      Investment Capacity
                    </p>
                    <p className="text-2xl font-bold">
                      {PACKAGES.find((p) => p.id === selectedPackage)?.investmentCapacity === 'unlimited'
                        ? 'Unlimited'
                        : PACKAGES.find((p) => p.id === selectedPackage)?.investmentCapacity}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h3 style={{ color: '#d4af37' }} className="text-xl font-bold mb-4">
                      Available Apps
                    </h3>
                    <ul className="space-y-2">
                      {PACKAGES.find((p) => p.id === selectedPackage)?.apps.map((app, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check size={18} style={{ color: '#10b981' }} />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bonus Features */}
                  <div>
                    <h3 style={{ color: '#d4af37' }} className="text-xl font-bold mb-4">
                      Bonus Features
                    </h3>
                    <ul className="space-y-2">
                      {PACKAGES.find((p) => p.id === selectedPackage)?.bonusFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Zap size={18} style={{ color: '#fbbf24' }} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
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
