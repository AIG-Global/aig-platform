'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Zap, Coins, Globe, Brain, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              <Link href="/login" style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }} className="px-6 py-2 rounded-lg font-semibold transition hover:bg-[#e8d4a2]">
                Sign In
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
              <Link href="/login" style={{
                backgroundColor: '#d4af37',
                color: '#1a0f15'
              }} className="block mt-4 px-6 py-2 text-center rounded-lg font-semibold">
                Sign In
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
              <Link href="#ecosystem" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
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
              <Link href="#ecosystem" style={{ color: '#d4af37' }} className="hover:text-[#e8d4a2] font-semibold flex items-center gap-2">
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
          <p style={{ color: '#e8e8d0' }} className="text-center mb-16">
            Select the membership that fits your goals and earning potential
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Remittance',
                price: '€0',
                period: 'forever',
                earningCap: '€100/month',
                description: 'Start exploring',
                features: ['Basic ecosystem access', '€100/month earning cap', 'Limited WDM access', 'MoneyGames', 'AIG Ask (limited)'],
                highlighted: false
              },
              {
                name: 'Starter',
                price: '€399',
                period: '/month',
                earningCap: '€500/month',
                description: 'Begin your journey',
                features: ['Full WDM access', '€500/month earning cap', 'All AIG apps (7)', 'Affiliate program', 'Commission earnings'],
                highlighted: false
              },
              {
                name: 'Start-Up',
                price: '€999',
                period: '/month',
                earningCap: '€5000/month',
                description: 'Scale your growth',
                features: ['Unlimited earning potential', '10-level affiliate program', 'All apps (9)', 'Market intelligence', 'Preferred seller status'],
                highlighted: false
              },
              {
                name: 'Professional',
                price: '€2,999',
                period: '/month',
                earningCap: 'Unlimited',
                description: 'Maximum growth',
                features: ['All current & future apps', 'Organization support', 'Custom AI training', 'VIP features', '24/7 support', 'Strategic partnerships'],
                highlighted: true
              }
            ].map((tier, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: tier.highlighted ? 'rgba(212, 175, 55, 0.15)' : 'rgba(61, 44, 53, 0.3)',
                  borderColor: tier.highlighted ? '#d4af37' : '#d4af37',
                  borderWidth: tier.highlighted ? '2px' : '1px',
                  boxShadow: tier.highlighted ? '0 0 30px rgba(212, 175, 55, 0.2)' : 'none'
                }}
                className="rounded-2xl p-8 transition transform hover:scale-105"
              >
                <h3 style={{ color: '#f5f5dc' }} className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p style={{ color: '#e8e8d0' }} className="text-sm mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span style={{
                    color: tier.highlighted ? '#d4af37' : '#f5f5dc',
                    background: tier.highlighted ? 'linear-gradient(to right, #d4af37, #e8d4a2)' : undefined,
                    WebkitBackgroundClip: tier.highlighted ? 'text' : undefined,
                    WebkitTextFillColor: tier.highlighted ? 'transparent' : undefined,
                    backgroundClip: tier.highlighted ? 'text' : undefined
                  }} className="text-4xl font-bold">{tier.price}</span>
                  <span style={{ color: '#e8e8d0' }} className="ml-2">{tier.period}</span>
                  <p style={{ color: tier.highlighted ? '#d4af37' : '#e8e8d0' }} className="text-sm mt-2">Cap: {tier.earningCap}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <div style={{
                        background: tier.highlighted ? 'linear-gradient(to right, #d4af37, #e8d4a2)' : 'rgba(212, 175, 55, 0.6)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        flexShrink: 0
                      }}></div>
                      <span style={{ color: '#e8e8d0' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    backgroundColor: tier.highlighted ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
                    color: tier.highlighted ? '#1a0f15' : '#d4af37',
                    borderColor: tier.highlighted ? undefined : '#d4af37',
                    borderWidth: tier.highlighted ? '0' : '1px'
                  }}
                  className="w-full py-3 rounded-lg font-bold transition transform hover:scale-105"
                >
                  {tier.name === 'Remittance' ? 'Get Started' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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
