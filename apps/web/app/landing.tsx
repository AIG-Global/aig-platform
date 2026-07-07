'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Zap, Coins, Globe, Brain, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-950 via-luxury-900 to-luxury-950 text-luxury-cream">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-luxury-950/80 backdrop-blur-md border-b border-luxury-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center font-bold text-lg text-luxury-950">
                AIG
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">
                AIGINVEST
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-luxury-gold transition">Features</a>
              <a href="#diana" className="hover:text-luxury-gold transition">Diana AI</a>
              <a href="#ecosystem" className="hover:text-luxury-gold transition">Ecosystem</a>
              <Link href="/login" className="px-6 py-2 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-950 rounded-lg font-semibold transition">
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-luxury-gold/30">
              <a href="#features" className="block py-2 hover:text-luxury-gold">Features</a>
              <a href="#diana" className="block py-2 hover:text-luxury-gold">Diana AI</a>
              <a href="#ecosystem" className="block py-2 hover:text-luxury-gold">Ecosystem</a>
              <Link href="/login" className="block mt-4 px-6 py-2 bg-luxury-gold text-luxury-950 text-center rounded-lg font-semibold">
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
                className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-950 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 border border-luxury-gold/50 hover:border-luxury-gold rounded-lg font-bold text-lg text-luxury-gold transition hover:bg-luxury-gold/10">
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
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50 border-y border-luxury-gold/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">
            Your Complete Ecosystem
          </h2>
          <p className="text-center text-luxury-cream-dark mb-16 max-w-2xl mx-auto">
            Everything you need to grow your business and maximize your earnings
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Diana AI */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">Diana AI Assistant</h3>
              <p className="text-luxury-cream-dark mb-4">
                AI-powered companion with access to 10+ apps: Ask Diana, Translate, Record, Investor Alerts, and more.
              </p>
              <Link href="#diana" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Dual Account System */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <Coins size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">Dual Account System</h3>
              <p className="text-luxury-cream-dark mb-4">
                EUR Cash Account (1:1 fiat) + AIG$ Tokens (ecosystem). Earn commissions split 80/20 automatically.
              </p>
              <Link href="#ecosystem" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
                Explore <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: WDM Marketplace */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">World Domination Market</h3>
              <p className="text-luxury-cream-dark mb-4">
                Luxury marketplace with 100% commission redistribution. Buy premium goods, earn commissions from your network.
              </p>
              <Link href="#ecosystem" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Affiliate Network */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">Affiliate Program</h3>
              <p className="text-luxury-cream-dark mb-4">
                10-level commission structure. Professional tier: 26% L1, 1% L7-10. Unlimited earning potential.
              </p>
              <a href="#" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
                Earn More <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 5: Investment Products */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">Investment Products</h3>
              <p className="text-luxury-cream-dark mb-4">
                Crypto, managed funds (3-10 years), tagmarkets, and AIG Phone shares. Auto 80/20 split on returns.
              </p>
              <a href="#" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
                Invest <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 6: Competition & Growth */}
            <div className="bg-luxury-800/30 border border-luxury-gold/40 rounded-xl p-8 hover:border-luxury-gold/80 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition text-luxury-950">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-luxury-cream">Monthly Competitions</h3>
              <p className="text-luxury-cream-dark mb-4">
                Fast Tracker leaderboards, MoneyGames prizes, and tier-rise challenges. Compete and win big.
              </p>
              <a href="#" className="text-luxury-gold hover:text-luxury-gold-light font-semibold flex items-center gap-2">
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
            <div className="bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/20 rounded-3xl p-12 border border-luxury-gold/50 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/30 to-luxury-gold-light/30 rounded-full blur-3xl"></div>
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
            <h2 className="text-4xl font-bold mb-6 text-luxury-cream">
              Meet
              <span className="block bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">
                Diana AI
              </span>
            </h2>
            <p className="text-lg text-luxury-cream-dark mb-6">
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
                <li key={i} className="flex items-center gap-3 text-luxury-cream-dark">
                  <div className="w-2 h-2 bg-gradient-to-r from-luxury-gold to-luxury-gold-light rounded-full flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const button = document.querySelector('[title="Chat with Diana"]') as HTMLButtonElement
                  button?.click()
                }}
                className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-950 rounded-lg font-bold inline-flex items-center gap-2 transition transform hover:scale-105 shadow-lg"
              >
                Start Chatting with Diana <ArrowRight size={20} />
              </button>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-luxury-gold/60 hover:border-luxury-gold text-luxury-gold hover:text-luxury-gold-light rounded-lg font-bold text-lg transition hover:bg-luxury-gold/5 inline-flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Diana Chat Preview */}
        <div className="mt-16 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold-light/20 rounded-3xl p-8 border border-luxury-gold/50 backdrop-blur-xl shadow-2xl">
          <div className="bg-luxury-800/80 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto border border-luxury-gold/30">
            <div className="flex items-start gap-3">
              <img
                src="/avatars/diana/diana-avatar.svg"
                alt="Diana"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-luxury-cream">Diana</p>
                <p className="text-sm text-luxury-cream-dark">What would you like to know about the AIG ecosystem today?</p>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="space-y-2 text-right max-w-xs">
                <p className="text-sm text-luxury-cream-dark bg-luxury-gold/20 px-4 py-2 rounded-lg border border-luxury-gold/40">Tell me about earning potential</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img
                src="/avatars/diana/diana-avatar.svg"
                alt="Diana"
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-luxury-cream">Diana</p>
                <p className="text-sm text-luxury-cream-dark">With our dual-account system, you earn 80% EUR Cash (fiat-backed) and 20% AIG$ tokens. Professional tier members have unlimited earning potential!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section id="ecosystem" className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50 border-y border-luxury-gold/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">
            Choose Your Tier
          </h2>
          <p className="text-center text-luxury-cream-dark mb-16">
            Select the membership that fits your goals and earning potential
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
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
                name: 'Professional',
                price: '€699',
                period: '/month',
                earningCap: 'Unlimited',
                description: 'Serious income',
                features: ['Unlimited earnings', '10-level affiliate program', 'All apps (9)', 'Market intelligence', 'Preferred seller status'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: '€2,999',
                period: '/month',
                earningCap: 'Unlimited',
                description: 'Maximum growth',
                features: ['All current & future apps', 'Organization support', 'Custom AI training', 'VIP features', '24/7 support', 'Strategic partnerships'],
                highlighted: false
              }
            ].map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 transition transform hover:scale-105 border ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-luxury-gold/15 to-luxury-gold-light/15 border-2 border-luxury-gold shadow-2xl shadow-luxury-gold/20'
                    : 'bg-luxury-800/30 border-luxury-gold/40 hover:border-luxury-gold/60'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2 text-luxury-cream">{tier.name}</h3>
                <p className="text-sm text-luxury-cream-dark mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${tier.highlighted ? 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent' : 'text-luxury-cream'}`}>{tier.price}</span>
                  <span className="text-luxury-cream-dark ml-2">{tier.period}</span>
                  <p className={`text-sm mt-2 ${tier.highlighted ? 'text-luxury-gold' : 'text-luxury-cream-dark'}`}>Cap: {tier.earningCap}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-luxury-cream-dark">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tier.highlighted ? 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light' : 'bg-luxury-gold/60'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                    tier.highlighted
                      ? 'bg-luxury-gold hover:bg-luxury-gold-light text-luxury-950 shadow-lg shadow-luxury-gold/30'
                      : 'bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-gold border border-luxury-gold/50'
                  }`}
                >
                  {tier.name === 'Free' ? 'Get Started' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-luxury-cream">Ready to transform your business?</h2>
        <p className="text-xl text-luxury-cream-dark mb-8">
          Join thousands of members earning passive income through the AIG ecosystem
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-950 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-lg"
          >
            Create Account <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-4 border-2 border-luxury-gold/60 hover:border-luxury-gold text-luxury-gold hover:text-luxury-gold-light rounded-lg font-bold text-lg transition hover:bg-luxury-gold/5">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-luxury-gold/30 bg-luxury-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-lg flex items-center justify-center font-bold text-sm text-luxury-950">
                  AIG
                </div>
                <span className="font-bold text-luxury-cream">AIGINVEST</span>
              </div>
              <p className="text-sm text-luxury-cream-dark">
                The AI-powered business operating system
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-luxury-cream">Product</h4>
              <ul className="space-y-2 text-sm text-luxury-cream-dark">
                <li><a href="#" className="hover:text-luxury-gold transition">Features</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Pricing</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Diana AI</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-luxury-cream">Company</h4>
              <ul className="space-y-2 text-sm text-luxury-cream-dark">
                <li><a href="#" className="hover:text-luxury-gold transition">About</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Blog</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Careers</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-luxury-cream">Legal</h4>
              <ul className="space-y-2 text-sm text-luxury-cream-dark">
                <li><a href="#" className="hover:text-luxury-gold transition">Privacy</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Terms</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Security</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-luxury-gold/30 pt-8 text-center text-sm text-luxury-cream-dark">
            <p>&copy; 2026 AIGINVEST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
