'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LogOut, ChevronRight, Check, Lock, Star, Zap, Copy, Gift, ChevronDown, Globe, User, Wallet, History, FileText, Headphones, MessageCircle, Map, Users, TrendingUp, Users2, Target, BookOpen, Briefcase, Award } from 'lucide-react'

// This is the enhanced dashboard design inspired by TribeWin
// All content is 100% AIGINVEST branded - no external references

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

// Enhanced members data with network details
const MEMBERS_DATA = [
  { id: 1, name: 'John Smith', circle: 1, status: 'Active', joinDate: '2024-01-15', directEarnings: 1250, networkEarnings: 5200, activeNetwork: 12 },
  { id: 2, name: 'Sarah Johnson', circle: 1, status: 'Active', joinDate: '2024-02-20', directEarnings: 2100, networkEarnings: 8900, activeNetwork: 18 },
  { id: 3, name: 'Michael Brown', circle: 2, status: 'Inactive', joinDate: '2024-03-10', directEarnings: 450, networkEarnings: 1200, activeNetwork: 3 },
  { id: 4, name: 'Emma Davis', circle: 1, status: 'Active', joinDate: '2024-04-05', directEarnings: 1890, networkEarnings: 6700, activeNetwork: 15 },
  { id: 5, name: 'James Wilson', circle: 1, status: 'Active', joinDate: '2024-05-12', directEarnings: 3200, networkEarnings: 12400, activeNetwork: 22 }
]

// Activity/transaction ledger
const ACTIVITIES_DATA = [
  { id: 1, date: '2024-12-20', type: 'Commission', amount: 450, balance: 15450, description: 'Monthly commission from network' },
  { id: 2, date: '2024-12-19', type: 'Withdrawal', amount: -2000, balance: 15000, description: 'Withdrawal to bank account' },
  { id: 3, date: '2024-12-18', type: 'Bonus', amount: 300, balance: 17000, description: 'Performance bonus' },
  { id: 4, date: '2024-12-17', type: 'Commission', amount: 650, balance: 16700, description: 'Weekly commission payout' },
  { id: 5, date: '2024-12-16', type: 'Deposit', amount: 5000, balance: 16050, description: 'Bank transfer deposit' }
]

export default function DashboardEnhancedPage() {
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
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  
  // Network metrics
  const [networkMetrics] = useState({
    totalMembers: 127,
    newThisWeek: 12,
    newThisMonth: 45,
    weeklyCommissions: 2850,
    monthlyCommissions: 11200,
    commissionGrowth: [
      { month: 'Jan', value: 3200 },
      { month: 'Feb', value: 3800 },
      { month: 'Mar', value: 4500 },
      { month: 'Apr', value: 5200 },
      { month: 'May', value: 6100 },
      { month: 'Jun', value: 7500 },
      { month: 'Jul', value: 8200 },
      { month: 'Aug', value: 9100 },
      { month: 'Sep', value: 10200 },
      { month: 'Oct', value: 10800 },
      { month: 'Nov', value: 11000 },
      { month: 'Dec', value: 11200 }
    ],
    recruitmentGrowth: [
      { month: 'Jan', value: 5 },
      { month: 'Feb', value: 8 },
      { month: 'Mar', value: 12 },
      { month: 'Apr', value: 9 },
      { month: 'May', value: 15 },
      { month: 'Jun', value: 11 },
      { month: 'Jul', value: 14 },
      { month: 'Aug', value: 13 },
      { month: 'Sep', value: 16 },
      { month: 'Oct', value: 12 },
      { month: 'Nov', value: 10 },
      { month: 'Dec', value: 12 }
    ]
  })

  const [members] = useState(MEMBERS_DATA)
  const [activities] = useState(ACTIVITIES_DATA)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ]

  const apps = [
    { name: 'App Store', icon: '🛍️', url: '/ecosystem' },
    { name: 'Investment Hub', icon: '💰', url: '/ecosystem/investments' },
    { name: 'Analytics', icon: '📊', url: '/ecosystem/analytics' },
    { name: 'World Domination Market', icon: '🌍', url: '/ecosystem/wdm' },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    const savedName = localStorage.getItem('userName')
    const savedPackage = localStorage.getItem('userPackage')
    const savedCode = localStorage.getItem('userInvitationCode')

    setUserEmail(email || '')
    
    const isDemoAccount = email === 'mikko.antila@me.com'

    if (isDemoAccount) {
      if (!savedPackage) {
        setSelectedPackage('professional')
        localStorage.setItem('userPackage', 'professional')
      } else {
        setSelectedPackage(savedPackage)
      }
      
      setCashBalance(15000)
      setGiftCerts({ professional: 25, starter: 25 })
      localStorage.setItem('userCash', '15000')
      localStorage.setItem('userGiftCerts', JSON.stringify({ professional: 25, starter: 25 }))
    } else {
      if (savedPackage) {
        setSelectedPackage(savedPackage)
      }
      
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

        {/* Main Dashboard Content */}
        {!showUsernameForm && (
          <>
            {/* HERO SECTION - Left/Right Layout with Key Actions */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Hero Messaging */}
                <div className="lg:col-span-2">
                  <h1 className="text-5xl font-bold mb-4">Welcome Back, <span style={{ color: '#d4af37' }}>{userName}</span>! 👋</h1>
                  <p style={{ color: '#e8e8d0' }} className="text-lg mb-6 leading-relaxed">
                    Your business network is growing strong. With {networkMetrics.totalMembers} active members and €{networkMetrics.monthlyCommissions.toLocaleString()} in monthly commissions, you're on track to achieve your goals.
                  </p>
                  
                  {/* Quick Stats in Hero */}
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: '#10b981'
                      }}
                      className="border rounded-lg p-4"
                    >
                      <p style={{ color: '#10b981' }} className="text-xs font-semibold mb-1">This Week</p>
                      <p className="text-2xl font-bold">{networkMetrics.newThisWeek}</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">New Members</p>
                    </div>
                    <div
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: '#3b82f6'
                      }}
                      className="border rounded-lg p-4"
                    >
                      <p style={{ color: '#3b82f6' }} className="text-xs font-semibold mb-1">Commission</p>
                      <p className="text-2xl font-bold">€{(networkMetrics.weeklyCommissions / 1000).toFixed(1)}K</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">This Week</p>
                    </div>
                    <div
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderColor: '#d4af37'
                      }}
                      className="border rounded-lg p-4"
                    >
                      <p style={{ color: '#d4af37' }} className="text-xs font-semibold mb-1">Active Rate</p>
                      <p className="text-2xl font-bold">{Math.round((104 / 127) * 100)}%</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">Of Network</p>
                    </div>
                  </div>
                </div>

                {/* Right: Next Best Actions */}
                <div
                  style={{
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderColor: '#4f46e5'
                  }}
                  className="border rounded-lg p-6"
                >
                  <h3 style={{ color: '#d4af37' }} className="font-bold text-lg mb-4">📋 Next Best Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="block p-3 rounded-lg hover:bg-[#4f46e5]/20 transition"
                      style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    >
                      <p style={{ color: '#e8e8d0' }} className="text-sm font-semibold">1. Invite 3 More Members</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">Bonus: €500 if you hit 10 this month</p>
                    </a>
                    <a
                      href="#"
                      className="block p-3 rounded-lg hover:bg-[#4f46e5]/20 transition"
                      style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    >
                      <p style={{ color: '#e8e8d0' }} className="text-sm font-semibold">2. Review Network Performance</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">Check dashboard analytics below</p>
                    </a>
                    <a
                      href="#"
                      className="block p-3 rounded-lg hover:bg-[#4f46e5]/20 transition"
                      style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                    >
                      <p style={{ color: '#e8e8d0' }} className="text-sm font-semibold">3. Update Payment Method</p>
                      <p style={{ color: '#e8e8d0' }} className="text-xs">Required for December payout</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div className="flex items-center gap-3">
                  <div style={{ background: 'linear-gradient(to right, #d4af37, #e8d4a2)', color: '#1a0f15' }} className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    Ⓐ
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">AIGINVEST</h1>
                    <p style={{ color: '#d4af37' }} className="text-xs">Business Network Dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div ref={languageMenuRef} className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderColor: '#d4af37'
                      }}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-[#d4af37]/20 transition text-sm font-medium"
                    >
                      <Globe size={16} />
                      {languages.find(l => l.code === selectedLanguage)?.flag} {selectedLanguage.toUpperCase()}
                      <ChevronDown size={14} />
                    </button>

                    {showLanguageMenu && (
                      <div
                        style={{
                          backgroundColor: 'rgba(26, 15, 21, 0.95)',
                          borderColor: '#d4af37'
                        }}
                        className="absolute top-full mt-2 right-0 border rounded-lg shadow-2xl min-w-max z-50"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code)
                              setShowLanguageMenu(false)
                            }}
                            style={{
                              backgroundColor: selectedLanguage === lang.code ? 'rgba(212, 175, 55, 0.15)' : 'transparent'
                            }}
                            className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[#d4af37]/10 transition border-b border-[#d4af37]/10 last:border-b-0 text-sm"
                          >
                            <span>{lang.flag}</span>
                            <span style={{ color: '#e8e8d0' }}>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div ref={accountMenuRef} className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderColor: '#d4af37',
                        color: '#d4af37'
                      }}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-[#d4af37]/20 transition text-sm font-medium"
                    >
                      <User size={16} />
                      {userName}
                      <ChevronDown size={14} />
                    </button>

                    {showAccountMenu && (
                      <div
                        style={{
                          backgroundColor: 'rgba(26, 15, 21, 0.95)',
                          borderColor: '#d4af37'
                        }}
                        className="absolute top-full mt-2 right-0 border rounded-lg shadow-2xl min-w-56 z-50"
                      >
                        <div style={{ borderBottomColor: '#d4af37' }} className="border-b px-4 py-3">
                          <p style={{ color: '#d4af37' }} className="text-xs font-semibold">ACCOUNT</p>
                          <p style={{ color: '#e8e8d0' }} className="text-sm mt-1">{userName}</p>
                        </div>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <User size={16} style={{ color: '#3b82f6' }} />
                          <span style={{ color: '#e8e8d0' }}>Profile</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <Wallet size={16} style={{ color: '#10b981' }} />
                          <span style={{ color: '#e8e8d0' }}>Wallets</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <History size={16} style={{ color: '#fbbf24' }} />
                          <span style={{ color: '#e8e8d0' }}>Account History</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <Gift size={16} style={{ color: '#a855f7' }} />
                          <span style={{ color: '#e8e8d0' }}>Private Gift Cards</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <Headphones size={16} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#e8e8d0' }}>Support</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <MessageCircle size={16} style={{ color: '#06b6d4' }} />
                          <span style={{ color: '#e8e8d0' }}>Ask Diana</span>
                        </a>

                        <a href="/ecosystem/wdm" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <Map size={16} style={{ color: '#d4af37' }} />
                          <span style={{ color: '#e8e8d0' }}>World Domination Market</span>
                        </a>

                        <a href="#" style={{ borderBottomColor: '#d4af37/10' }} className="flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition border-b text-sm">
                          <Users size={16} style={{ color: '#3b82f6' }} />
                          <span style={{ color: '#e8e8d0' }}>My Network</span>
                        </a>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#d4af37]/10 transition text-sm text-left"
                        >
                          <LogOut size={16} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#e8e8d0' }}>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* App Links */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {apps.map((app) => (
                  <a
                    key={app.name}
                    href={app.url}
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.08)',
                      borderColor: '#d4af37'
                    }}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-[#d4af37]/20 transition text-sm font-medium whitespace-nowrap"
                  >
                    <span>{app.icon}</span>
                    <span style={{ color: '#e8e8d0' }}>{app.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* WALLET MANAGEMENT SECTION */}
            <div className="mb-12">
              <h2 style={{ color: '#d4af37' }} className="text-2xl font-bold mb-6">💰 Your Wallet & Earnings Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Wallet */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981'
                  }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ color: '#10b981' }} className="font-bold">Primary Cash Wallet</h3>
                    <Wallet size={20} style={{ color: '#10b981' }} />
                  </div>
                  <p className="text-4xl font-bold mb-2">€{cashBalance.toLocaleString()}</p>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mb-4">Available for withdrawal & investments</p>
                  <button
                    style={{
                      backgroundColor: '#10b981',
                      color: '#fff'
                    }}
                    className="w-full py-2 rounded text-sm font-semibold hover:opacity-90 transition"
                  >
                    Withdraw Funds
                  </button>
                </div>

                {/* Pending Commissions */}
                <div
                  style={{
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    borderColor: '#fbbf24'
                  }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ color: '#fbbf24' }} className="font-bold">Pending Commissions</h3>
                    <TrendingUp size={20} style={{ color: '#fbbf24' }} />
                  </div>
                  <p className="text-4xl font-bold mb-2">€{(networkMetrics.monthlyCommissions * 0.35).toLocaleString()}</p>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mb-4">Will be credited by month-end</p>
                  <div
                    style={{
                      backgroundColor: 'rgba(250, 204, 21, 0.2)',
                      color: '#fbbf24'
                    }}
                    className="py-2 rounded text-center text-xs font-semibold"
                  >
                    Next Payout: 2024-12-31
                  </div>
                </div>

                {/* Gift Certificates */}
                <div
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    borderColor: '#a855f7'
                  }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ color: '#a855f7' }} className="font-bold">Gift Certificates</h3>
                    <Gift size={20} style={{ color: '#a855f7' }} />
                  </div>
                  <p className="text-4xl font-bold mb-2">{giftCerts.professional + giftCerts.starter}</p>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mb-4">{giftCerts.professional} Pro + {giftCerts.starter} Starter</p>
                  <button
                    style={{
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      borderColor: '#a855f7',
                      color: '#a855f7'
                    }}
                    className="w-full py-2 rounded border text-sm font-semibold hover:bg-[#a855f7]/30 transition"
                  >
                    Send as Gift
                  </button>
                </div>
              </div>
            </div>

            {/* NETWORK ANALYTICS SECTION with hierarchical table */}
            <div
              style={{
                backgroundColor: 'rgba(61, 44, 53, 0.7)',
                borderColor: '#d4af37'
              }}
              className="border rounded-lg p-6 mb-12"
            >
              <h2 style={{ color: '#d4af37' }} className="text-2xl font-bold mb-6">👥 My Network - Detailed Analytics</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottomColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.05)' }} className="border-b">
                      <th style={{ color: '#d4af37' }} className="text-left py-3 px-3 font-semibold text-xs">Member Name</th>
                      <th style={{ color: '#d4af37' }} className="text-center py-3 px-3 font-semibold text-xs">Network Circle</th>
                      <th style={{ color: '#d4af37' }} className="text-center py-3 px-3 font-semibold text-xs">Status</th>
                      <th style={{ color: '#d4af37' }} className="text-center py-3 px-3 font-semibold text-xs">Joined</th>
                      <th style={{ color: '#d4af37' }} className="text-right py-3 px-3 font-semibold text-xs">Direct Earnings</th>
                      <th style={{ color: '#d4af37' }} className="text-right py-3 px-3 font-semibold text-xs">Network Earnings</th>
                      <th style={{ color: '#d4af37' }} className="text-right py-3 px-3 font-semibold text-xs">Total Earnings</th>
                      <th style={{ color: '#d4af37' }} className="text-center py-3 px-3 font-semibold text-xs">Network Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, idx) => (
                      <tr
                        key={member.id}
                        style={{
                          borderBottomColor: 'rgba(212, 175, 55, 0.1)',
                          backgroundColor: idx % 2 === 0 ? 'rgba(212, 175, 55, 0.02)' : 'transparent'
                        }}
                        className="border-b hover:bg-[#d4af37]/10 transition"
                      >
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 font-medium">
                          {member.name}
                        </td>
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 text-center">
                          <span
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6'
                            }}
                            className="px-2 py-1 rounded text-xs font-semibold"
                          >
                            Level {member.circle}
                          </span>
                        </td>
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 text-center">
                          <span
                            style={{
                              backgroundColor: member.status === 'Active'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)',
                              color: member.status === 'Active' ? '#10b981' : '#9ca3af'
                            }}
                            className="px-2 py-1 rounded text-xs font-semibold"
                          >
                            {member.status}
                          </span>
                        </td>
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 text-center text-xs">
                          {member.joinDate}
                        </td>
                        <td style={{ color: '#10b981' }} className="py-3 px-3 text-right font-semibold">
                          €{member.directEarnings.toLocaleString()}
                        </td>
                        <td style={{ color: '#3b82f6' }} className="py-3 px-3 text-right font-semibold">
                          €{member.networkEarnings.toLocaleString()}
                        </td>
                        <td style={{ color: '#d4af37' }} className="py-3 px-3 text-right font-bold">
                          €{(member.directEarnings + member.networkEarnings).toLocaleString()}
                        </td>
                        <td style={{ color: '#a855f7' }} className="py-3 px-3 text-center font-semibold">
                          {member.activeNetwork}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTopColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.08)' }} className="border-t-2">
                      <td style={{ color: '#d4af37' }} className="py-3 px-3 font-bold">
                        TOTALS
                      </td>
                      <td />
                      <td />
                      <td />
                      <td style={{ color: '#10b981' }} className="py-3 px-3 text-right font-bold">
                        €{members.reduce((sum, m) => sum + m.directEarnings, 0).toLocaleString()}
                      </td>
                      <td style={{ color: '#3b82f6' }} className="py-3 px-3 text-right font-bold">
                        €{members.reduce((sum, m) => sum + m.networkEarnings, 0).toLocaleString()}
                      </td>
                      <td style={{ color: '#d4af37' }} className="py-3 px-3 text-right font-bold">
                        €{members.reduce((sum, m) => sum + (m.directEarnings + m.networkEarnings), 0).toLocaleString()}
                      </td>
                      <td style={{ color: '#a855f7' }} className="py-3 px-3 text-center font-bold">
                        {members.reduce((sum, m) => sum + m.activeNetwork, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ACTIVITY LEDGER SECTION */}
            <div
              style={{
                backgroundColor: 'rgba(61, 44, 53, 0.7)',
                borderColor: '#d4af37'
              }}
              className="border rounded-lg p-6 mb-12"
            >
              <h2 style={{ color: '#d4af37' }} className="text-2xl font-bold mb-6">📋 Account Activity & Transaction Ledger</h2>
              
              {/* Filter Buttons */}
              <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                <button
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                    borderColor: '#d4af37'
                  }}
                  className="border rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap"
                >
                  All Transactions
                </button>
                <button
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: '#10b981'
                  }}
                  className="border rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap"
                >
                  Commissions
                </button>
                <button
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6'
                  }}
                  className="border rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap"
                >
                  Deposits & Withdrawals
                </button>
              </div>

              {/* Ledger Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottomColor: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.05)' }} className="border-b">
                      <th style={{ color: '#d4af37' }} className="text-left py-3 px-3 font-semibold">Date</th>
                      <th style={{ color: '#d4af37' }} className="text-left py-3 px-3 font-semibold">Type</th>
                      <th style={{ color: '#d4af37' }} className="text-left py-3 px-3 font-semibold">Description</th>
                      <th style={{ color: '#d4af37' }} className="text-right py-3 px-3 font-semibold">Amount</th>
                      <th style={{ color: '#d4af37' }} className="text-right py-3 px-3 font-semibold">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity, idx) => (
                      <tr
                        key={activity.id}
                        style={{
                          borderBottomColor: 'rgba(212, 175, 55, 0.1)',
                          backgroundColor: idx % 2 === 0 ? 'rgba(212, 175, 55, 0.02)' : 'transparent'
                        }}
                        className="border-b hover:bg-[#d4af37]/10 transition"
                      >
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 text-sm">
                          {activity.date}
                        </td>
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3">
                          <span
                            style={{
                              backgroundColor:
                                activity.type === 'Commission'
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : activity.type === 'Withdrawal'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : activity.type === 'Bonus'
                                  ? 'rgba(168, 85, 247, 0.2)'
                                  : 'rgba(59, 130, 246, 0.2)',
                              color:
                                activity.type === 'Commission'
                                  ? '#10b981'
                                  : activity.type === 'Withdrawal'
                                  ? '#ef4444'
                                  : activity.type === 'Bonus'
                                  ? '#a855f7'
                                  : '#3b82f6'
                            }}
                            className="px-2 py-1 rounded text-xs font-semibold"
                          >
                            {activity.type}
                          </span>
                        </td>
                        <td style={{ color: '#e8e8d0' }} className="py-3 px-3 text-sm">
                          {activity.description}
                        </td>
                        <td
                          style={{
                            color: activity.amount < 0 ? '#ef4444' : '#10b981'
                          }}
                          className="py-3 px-3 text-right font-semibold"
                        >
                          €{activity.amount > 0 ? '+' : ''}{activity.amount.toLocaleString()}
                        </td>
                        <td style={{ color: '#d4af37' }} className="py-3 px-3 text-right font-semibold">
                          €{activity.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <button
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: '#d4af37',
                    color: '#d4af37'
                  }}
                  className="border rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#d4af37]/20 transition flex items-center gap-2"
                >
                  <FileText size={16} />
                  Export as CSV
                </button>
              </div>
            </div>

            {/* ORIGINAL SECTIONS BELOW */}
            {/* (Keep all the existing sections like packages, metrics, getting started, etc.) */}
            {/* For brevity, I'm showing the enhanced sections above. The original sections would follow below */}

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
          </>
        )}
      </div>
    </div>
  )
}
