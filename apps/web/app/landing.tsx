'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Zap, Coins, Globe, Brain, Users, TrendingUp, ChevronDown } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-950 via-luxury-900 to-luxury-950 text-luxury-cream" style={{
      background: 'linear-gradient(to right bottom, #1a0f15, #2a1f28, #1a0f15)',
      color: '#f5f5dc'
    }}>
      {/* Navigation */}
      <nav style={{
        borderBottomColor: '#d4af37',
        backgroundColor: 'rgba(26, 15, 21, 0.8)'
      }} className="fixed w-full top-0 z-50 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                AIG
              </div>
              <span style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }} className="text-xl font-bold">
                AIGINVEST
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" style={{ color: '#f5f5dc' }} className="hover:text-[#d4af37] transition">Features</a>
              <a href="#diana" style={{ color: '#f5f5dc' }} className="hover:text-[#d4af37] transition">Diana AI</a>
              <a href="#ecosystem" style={{ color: '#f5f5dc' }} className="hover:text-[#d4af37] transition">Ecosystem</a>
              <Link href="/ecosystem" style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }} className="px-6 py-2 rounded-lg font-semibold transition hover:bg-[#e8d4a2]">
                Explore Apps
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              style={{ color: '#d4af37' }}
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={{
              borderTopColor: '#d4af37'
            }} className="md:hidden mt-4 pb-4 border-t">
              <a href="#features" style={{ color: '#f5f5dc' }} className="block py-2 hover:text-[#d4af37]">Features</a>
              <a href="#diana" style={{ color: '#f5f5dc' }} className="block py-2 hover:text-[#d4af37]">Diana AI</a>
              <a href="#ecosystem" style={{ color: '#f5f5dc' }} className="block py-2 hover:text-[#d4af37]">Ecosystem</a>
              <Link href="/ecosystem" style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }} className="block mt-4 px-6 py-2 text-center rounded-lg font-semibold">
                Explore Apps
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-luxury-cream">
                The AI-Powered
                <span className="block bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent">
                  Business Operating System
                </span>
              </h1>
              <p className="text-xl text-luxury-cream-dark">
                Earn passive income, build your network, and access AI tools all in one unified ecosystem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:bg-[#e8d4a2]"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <button style={{
                borderColor: '#d4af37',
                color: '#d4af37'
              }} className="px-8 py-4 border-2 rounded-lg font-bold text-lg transition hover:bg-[#d4af3720]">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm text-luxury-cream-dark">
              <div>🚀 10K+ Members</div>
              <div>💰 €50M+ Transacted</div>
              <div>⚡ 99.9% Uptime</div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold-light/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-luxury-800/50 border border-luxury-gold/30 rounded-3xl p-8 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold-light/20 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gradient-to-r from-luxury-gold-light/20 to-luxury-gold/20 rounded-lg animate-pulse animation-delay-100"></div>
                <div className="h-12 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold-light/20 rounded-lg animate-pulse animation-delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        backgroundColor: 'rgba(42, 31, 40, 0.5)',
        borderTopColor: '#d4af37',
        borderBottomColor: '#d4af37'
      }} className="py-20 px-4 sm:px-6 lg:px-8 border-y">
        <div className="max-w-7xl mx-auto">
          <h2 style={{
            background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-4xl font-bold text-center mb-4">
            Your Complete Ecosystem
          </h2>
          <p style={{ color: '#e8e8d0' }} className="text-center mb-16 max-w-2xl mx-auto">
            Everything you need to grow your business and maximize your earnings
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Diana AI */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Brain size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">Diana AI Assistant</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                AI-powered companion with access to 10+ apps: Ask Diana, Translate, Record, Investor Alerts, and more.
              </p>
              <Link href="#diana" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Dual Account System */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Coins size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">Dual Account System</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                EUR Cash Account (1:1 fiat) + AIG$ Tokens (ecosystem). Earn commissions split 80/20 automatically.
              </p>
              <Link href="/ecosystem" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Explore <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: WDM Marketplace */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Globe size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">World Domination Market</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                Luxury marketplace with 100% commission redistribution. Buy premium goods, earn commissions from your network.
              </p>
              <Link href="/ecosystem/wdm" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Affiliate Network */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">Affiliate Program</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                10-level commission structure. Professional tier: 26% L1, 1% L7-10. Unlimited earning potential.
              </p>
              <a href="#" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Earn More <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 5: Investment Products */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <TrendingUp size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">Investment Products</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                Crypto, managed funds (3-10 years), tagmarkets, and AIG Phone shares. Auto 80/20 split on returns.
              </p>
              <a href="#" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Invest <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 6: Competition & Growth */}
            <div style={{
              backgroundColor: 'rgba(61, 44, 53, 0.3)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-xl p-8 hover:border-[#d4af37] transition group">
              <div style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                color: '#1a0f15'
              }} className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>
              <h3 style={{ color: '#f5f5dc' }} className="text-xl font-bold mb-3">Monthly Competitions</h3>
              <p style={{ color: '#e8e8d0' }} className="mb-4">
                Fast Tracker leaderboards, MoneyGames prizes, and tier-rise challenges. Compete and win big.
              </p>
              <a href="#" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
                Compete <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diana AI Section */}
      <section id="diana" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Diana Avatar - Large Showcase */}
          <div className="order-2 md:order-1">
            <div style={{
              background: 'rgba(212, 175, 55, 0.2)',
              borderColor: '#d4af37',
              borderWidth: '1px'
            }} className="rounded-3xl p-12 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <div className="relative">
                <div style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3), rgba(232, 212, 162, 0.3))'
                }} className="absolute inset-0 rounded-full blur-3xl"></div>
                <img
                  src="/avatars/diana/diana-avatar.svg"
                  alt="Diana AI Assistant"
                  className="w-72 h-72 drop-shadow-2xl relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Diana Info */}
          <div className="order-1 md:order-2">
            <h2 style={{ color: '#f5f5dc' }} className="text-4xl font-bold mb-6">
              Meet
              <span style={{
                background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block'
              }}>
                Diana AI
              </span>
            </h2>
            <p style={{ color: '#e8e8d0' }} className="text-lg mb-6">
              Your intelligent business companion with access to 10 AI-powered applications. Diana is available on every page—no registration needed. Just click the Diana button to chat!
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'AIG Ask - Claude AI chat integration',
                'AIG Translate - 28 languages',
                'AIG Record - Meeting transcription',
                'AIG Investor Alerts - Market intelligence',
                'AIG MoneyGames - Community competitions',
                'AIG News - Global news aggregation',
                'AIG Me - Personal relationship manager',
                'AIG Business Weather - Professional forecasts',
                'AIG HELO - Emergency travel assistant',
                'AIG Secure Sign - E-signature with audit trail'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div style={{
                    background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  <span style={{ color: '#e8e8d0' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const button = document.querySelector('[title="Chat with Diana"]') as HTMLButtonElement
                  button?.click()
                }}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a0f15'
                }}
                className="px-8 py-4 rounded-lg font-bold inline-flex items-center gap-2 transition transform hover:bg-[#e8d4a2] shadow-lg"
              >
                Start Chatting with Diana <ArrowRight size={20} />
              </button>
              <Link
                href="/login"
                style={{
                  borderColor: '#d4af37',
                  color: '#d4af37'
                }}
                className="px-8 py-4 border-2 rounded-lg font-bold text-lg transition hover:text-[#e8d4a2] hover:border-[#e8d4a2] inline-flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Diana Chat Preview */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.2)',
          borderColor: '#d4af37',
          borderWidth: '1px'
        }} className="mt-16 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div style={{
            backgroundColor: 'rgba(61, 44, 53, 0.8)',
            borderColor: '#d4af37',
            borderWidth: '1px'
          }} className="rounded-2xl p-6 space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <img
                src="/avatars/diana/diana-avatar.svg"
                alt="Diana"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="space-y-2">
                <p style={{ color: '#f5f5dc' }} className="text-sm font-semibold">Diana</p>
                <p style={{ color: '#e8e8d0' }} className="text-sm">What would you like to know about the AIG ecosystem today?</p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="space-y-2 text-right max-w-xs">
                <p style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                  color: '#e8e8d0',
                  borderColor: '#d4af37',
                  borderWidth: '1px'
                }} className="text-sm px-4 py-2 rounded-lg">Tell me about earning potential</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img
                src="/avatars/diana/diana-avatar.svg"
                alt="Diana"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="space-y-2">
                <p style={{ color: '#f5f5dc' }} className="text-sm font-semibold">Diana</p>
                <p style={{ color: '#e8e8d0' }} className="text-sm">With our dual-account system, you earn 80% EUR Cash (fiat-backed) and 20% AIG$ tokens. Professional tier members have unlimited earning potential!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section id="ecosystem" style={{
        backgroundColor: 'rgba(42, 31, 40, 0.5)',
        borderTopColor: '#d4af37',
        borderBottomColor: '#d4af37'
      }} className="py-20 px-4 sm:px-6 lg:px-8 border-y">
        <div className="max-w-7xl mx-auto">
          <h2 style={{
            background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} className="text-4xl font-bold text-center mb-4">
            Choose Your Tier
          </h2>
          <p style={{ color: '#e8e8d0' }} className="text-center mb-16 text-lg">
            Membership always free. Pay only for the app bundle you choose. Bigger packs = more perks & services.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                id: 'remittance',
                name: 'Remittance',
                price: '€0',
                highlighted: false,
                description: 'Start exploring for free',
                earnCap: '€100 / month'
              },
              {
                id: 'starter',
                name: 'Starter Business Pack',
                price: '€399',
                highlighted: false,
                description: 'Begin your wealth journey',
                earnCap: '€1,000 / month'
              },
              {
                id: 'startup',
                name: 'Start-Up Business Pack',
                price: '€699',
                highlighted: false,
                description: 'Scale your growth fast',
                earnCap: '€5,000 / month'
              }
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  backgroundColor: tier.highlighted ? 'rgba(212, 175, 55, 0.15)' : 'rgba(61, 44, 53, 0.3)',
                  borderColor: '#d4af37',
                  borderWidth: '2px'
                }}
                className="rounded-2xl p-8 transition transform hover:scale-105 hover:shadow-2xl text-left group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p style={{ color: '#e8e8d0' }} className="text-sm">{tier.description}</p>
                  </div>
                  <ChevronDown style={{ color: '#d4af37' }} className="group-hover:translate-y-1 transition" />
                </div>
                <div className="mb-4">
                  <span style={{ color: '#d4af37' }} className="text-3xl font-bold">{tier.price}</span>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mt-2">Earning cap: {tier.earnCap}</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }} className="mb-4"></div>
                <p style={{ color: '#d4af37' }} className="text-sm font-semibold">View full details →</p>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                id: 'premium',
                name: 'Premium Business Pack',
                price: '€1,099',
                highlighted: false,
                description: "It's time to build.",
                earnCap: '€10,000 / month'
              },
              {
                id: 'professional',
                name: 'Professional Business Pack',
                price: '€2,999',
                highlighted: true,
                description: 'When the target is to reach the world.',
                earnCap: 'Unlimited / month'
              }
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  backgroundColor: tier.highlighted ? 'rgba(212, 175, 55, 0.15)' : 'rgba(61, 44, 53, 0.3)',
                  borderColor: tier.highlighted ? '#d4af37' : '#d4af37',
                  borderWidth: tier.highlighted ? '2px' : '2px'
                }}
                className="rounded-2xl p-8 transition transform hover:scale-105 hover:shadow-2xl text-left group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p style={{ color: '#e8e8d0' }} className="text-sm">{tier.description}</p>
                  </div>
                  <ChevronDown style={{ color: '#d4af37' }} className="group-hover:translate-y-1 transition" />
                </div>
                <div className="mb-4">
                  <span style={{ color: tier.highlighted ? '#d4af37' : '#f5f5dc' }} className="text-3xl font-bold">{tier.price}</span>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mt-2">Earning cap: {tier.earnCap}</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }} className="mb-4"></div>
                <p style={{ color: '#d4af37' }} className="text-sm font-semibold">View full details →</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {selectedTier && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedTier(null)}
        >
          <div
            style={{
              backgroundColor: 'rgba(42, 31, 40, 0.98)',
              borderColor: '#d4af37',
              borderWidth: '2px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            className="rounded-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: '#f5f5dc' }} className="text-3xl font-bold">
                {selectedTier === 'remittance' && 'Remittance'}
                {selectedTier === 'starter' && 'Starter Business Pack'}
                {selectedTier === 'startup' && 'Start-Up Business Pack'}
                {selectedTier === 'premium' && 'Premium Business Pack'}
                {selectedTier === 'professional' && 'Professional Business Pack'}
              </h2>
              <button
                onClick={() => setSelectedTier(null)}
                style={{ color: '#d4af37' }}
                className="text-2xl hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            {selectedTier === 'remittance' && (
              <div style={{ color: '#e8e8d0' }} className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">€0 · Start exploring for free</p>
                  <p className="text-sm">Investment options aren't open for this account</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }}></div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">KEY DETAILS</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Earning cap:</strong> €100 / month</li>
                    <li>• <strong>Transfer fee:</strong> 5.0% (cash → AIG Cash)</li>
                    <li>• <strong>AIG Cash transfers:</strong> FREE (no commissions)</li>
                    <li>• <strong>Membership:</strong> Always FREE</li>
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">SERVICES INCLUDED</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ WDM and AIG ecosystem access</li>
                    <li>✓ Affiliate referrals up to Level 1</li>
                    <li>✓ Basic ecosystem access</li>
                    <li>✓ Public leaderboard visibility</li>
                  </ul>
                </div>
                <p style={{ color: '#e8e8d0' }} className="text-xs mt-4 italic">Can upgrade to next level by paying via giftcard</p>
              </div>
            )}

            {selectedTier === 'starter' && (
              <div style={{ color: '#e8e8d0' }} className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">€399 · Begin your wealth journey</p>
                  <p className="text-sm">Start building your network and earning power</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }}></div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">KEY DETAILS</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Earning cap:</strong> €1,000 / month</li>
                    <li>• <strong>Investment min:</strong> €1,000</li>
                    <li>• <strong>Transfer fee:</strong> 3.90% (80% network, 20% management)</li>
                    <li>• <strong>AIG Cash transfers:</strong> FREE (no commissions)</li>
                    <li>• <strong>Membership:</strong> Always FREE</li>
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">SERVICES INCLUDED</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ WDM and AIG ecosystem access</li>
                    <li>✓ AIG Investment platform access</li>
                    <li>✓ AIG MoneyGames App</li>
                    <li>✓ AIG Investor Alerts App</li>
                    <li>✓ Affiliate commissions – 6 levels (26% Level-1)</li>
                    <li>✓ Marketplace seller access</li>
                    <li>✓ Monthly webinars</li>
                  </ul>
                </div>
                <p style={{ color: '#e8e8d0' }} className="text-xs mt-4 italic">Can upgrade to next level by paying via giftcard</p>
              </div>
            )}

            {selectedTier === 'startup' && (
              <div style={{ color: '#e8e8d0' }} className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">€699 · Scale your growth fast</p>
                  <p className="text-sm">Expand your earning potential and services</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }}></div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">KEY DETAILS</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Earning cap:</strong> €5,000 / month</li>
                    <li>• <strong>Investment min:</strong> €5,000</li>
                    <li>• <strong>Transfer fee:</strong> 1.90%</li>
                    <li>• <strong>AIG Cash transfers:</strong> FREE (no commissions)</li>
                    <li>• <strong>Membership:</strong> Always FREE</li>
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">SERVICES INCLUDED</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ WDM and AIG ecosystem access</li>
                    <li>✓ AIG Investment platform</li>
                    <li>✓ AIG MoneyGames App</li>
                    <li>✓ AIG Investor Alerts App</li>
                    <li>✓ AIG HELO (emergency travel assistant)</li>
                    <li>✓ AIG Business Weather</li>
                    <li>✓ Affiliate commissions – 6 levels</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTier === 'premium' && (
              <div style={{ color: '#e8e8d0' }} className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">€1,099 · It's time to build</p>
                  <p className="text-sm">Unlock premium tools and unlimited potential</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }}></div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">KEY DETAILS</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Earning cap:</strong> €10,000 / month</li>
                    <li>• <strong>Investment min:</strong> €10,000</li>
                    <li>• <strong>Transfer fee:</strong> 0.90%</li>
                    <li>• <strong>AIG Cash transfers:</strong> FREE (no commissions)</li>
                    <li>• <strong>Membership:</strong> Always FREE</li>
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">SERVICES INCLUDED</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ All Start-Up features</li>
                    <li>✓ AIG Me (personal relationship manager)</li>
                    <li>✓ Priority support</li>
                    <li>✓ Enhanced seller tools</li>
                    <li>✓ 6-level affiliate program</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedTier === 'professional' && (
              <div style={{ color: '#e8e8d0' }} className="space-y-4">
                <div>
                  <p className="text-2xl font-bold mb-2">€2,999 · Reach the world</p>
                  <p className="text-sm">Maximum earning potential with all premium features</p>
                </div>
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  height: '1px'
                }}></div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">KEY DETAILS</p>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Earning cap:</strong> Unlimited / month</li>
                    <li>• <strong>Investment min:</strong> €200,000</li>
                    <li>• <strong>Transfer fee:</strong> 0.15%</li>
                    <li>• <strong>AIG Cash transfers:</strong> FREE (no commissions)</li>
                    <li>• <strong>Membership:</strong> Always FREE</li>
                  </ul>
                </div>
                <div>
                  <p style={{ color: '#d4af37' }} className="font-bold text-sm mb-3">ALL SERVICES INCLUDED</p>
                  <ul className="space-y-2 text-sm">
                    <li>✓ All current & future AIG apps</li>
                    <li>✓ AIG Record (organization management)</li>
                    <li>✓ AIG Secure Sign (e-signature with audit trail)</li>
                    <li>✓ AIG Ask (Claude AI integration)</li>
                    <li>✓ AIG ONE (premium dashboard)</li>
                    <li>✓ Affiliate commissions – 10 levels</li>
                    <li>✓ 24/7 VIP support</li>
                    <li>✓ Strategic partnership opportunities</li>
                  </ul>
                </div>
              </div>
            )}

            <div style={{
              background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
              height: '1px'
            }} className="my-6"></div>

            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderLeft: '3px solid #d4af37' }} className="p-4 rounded text-sm">
              <p style={{ color: '#d4af37' }} className="font-semibold mb-2">💡 Friend Transfers</p>
              <p style={{ color: '#e8e8d0' }} className="text-xs">Send AIG Cash to trusted partners for FREE. Establish connection with shared code, both accept, then transfer using username—no real names needed.</p>
            </div>

            <button
              onClick={() => setSelectedTier(null)}
              style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }}
              className="w-full mt-6 py-3 rounded-lg font-bold transition hover:bg-[#e8d4a2]"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 style={{ color: '#f5f5dc' }} className="text-4xl font-bold mb-6">Ready to transform your business?</h2>
        <p style={{ color: '#e8e8d0' }} className="text-xl mb-8">
          Join thousands of members earning passive income through the AIG ecosystem
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            style={{
              backgroundColor: '#d4af37',
              color: '#1a0f15'
            }}
            className="px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:bg-[#e8d4a2] shadow-lg"
          >
            Create Account <ArrowRight size={20} />
          </Link>
          <button style={{
            borderColor: '#d4af37',
            color: '#d4af37'
          }} className="px-8 py-4 border-2 rounded-lg font-bold text-lg transition hover:text-[#e8d4a2] hover:border-[#e8d4a2] hover:bg-[#d4af371a]">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTopColor: '#d4af37',
        backgroundColor: 'rgba(42, 31, 40, 0.5)'
      }} className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{
                  background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
                  color: '#1a0f15'
                }} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                  AIG
                </div>
                <span style={{ color: '#f5f5dc' }} className="font-bold">AIGINVEST</span>
              </div>
              <p style={{ color: '#e8e8d0' }} className="text-sm">
                The AI-powered business operating system
              </p>
            </div>
            <div>
              <h4 style={{ color: '#f5f5dc' }} className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Features</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Pricing</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Diana AI</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#f5f5dc' }} className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">About</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Blog</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Careers</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#f5f5dc' }} className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Privacy</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Terms</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Security</a></li>
                <li><a href="#" style={{ color: '#e8e8d0' }} className="hover:text-[#d4af37] transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div style={{
            borderTopColor: '#d4af37'
          }} className="border-t pt-8 text-center text-sm">
            <p style={{ color: '#e8e8d0' }}>&copy; 2026 AIGINVEST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
