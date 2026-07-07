'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, ChevronRight, Check, Lock, Star, Zap } from 'lucide-react'

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

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem('userName') || 'User'
    setUserName(name)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    localStorage.removeItem('userPackage')
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

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
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
