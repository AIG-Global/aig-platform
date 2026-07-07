'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight, Zap, Coins, Globe, Brain, Users, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
                AIG
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AIGINVEST
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-blue-400 transition">Features</a>
              <a href="#diana" className="hover:text-blue-400 transition">Diana AI</a>
              <a href="#ecosystem" className="hover:text-blue-400 transition">Ecosystem</a>
              <Link href="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
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
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50">
              <a href="#features" className="block py-2 hover:text-blue-400">Features</a>
              <a href="#diana" className="block py-2 hover:text-blue-400">Diana AI</a>
              <a href="#ecosystem" className="block py-2 hover:text-blue-400">Ecosystem</a>
              <Link href="/login" className="block mt-4 px-6 py-2 bg-blue-600 text-center rounded-lg font-semibold">
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
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                The AI-Powered
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Business Operating System
                </span>
              </h1>
              <p className="text-xl text-slate-300">
                Earn passive income, build your network, and access AI tools all in one unified ecosystem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
              >
                Get Started <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 border border-slate-600 hover:border-blue-400 rounded-lg font-bold text-lg transition hover:bg-slate-800/50">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-400">
              <div>🚀 10K+ Members</div>
              <div>💰 €50M+ Transacted</div>
              <div>⚡ 99.9% Uptime</div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-xl">
              <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg animate-pulse animation-delay-100"></div>
                <div className="h-12 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-lg animate-pulse animation-delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Complete Ecosystem
          </h2>
          <p className="text-center text-slate-300 mb-16 max-w-2xl mx-auto">
            Everything you need to grow your business and maximize your earnings
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Diana AI */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Diana AI Assistant</h3>
              <p className="text-slate-300 mb-4">
                AI-powered companion with access to 10+ apps: Ask Diana, Translate, Record, Investor Alerts, and more.
              </p>
              <Link href="#diana" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2">
                Learn More <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Dual Account System */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-purple-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Coins size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Dual Account System</h3>
              <p className="text-slate-300 mb-4">
                EUR Cash Account (1:1 fiat) + AIG$ Tokens (ecosystem). Earn commissions split 80/20 automatically.
              </p>
              <Link href="#ecosystem" className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2">
                Explore <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: WDM Marketplace */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-pink-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">World Domination Market</h3>
              <p className="text-slate-300 mb-4">
                Luxury marketplace with 100% commission redistribution. Buy premium goods, earn commissions from your network.
              </p>
              <Link href="#ecosystem" className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Affiliate Network */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-green-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Affiliate Program</h3>
              <p className="text-slate-300 mb-4">
                10-level commission structure. Professional tier: 26% L1, 1% L7-10. Unlimited earning potential.
              </p>
              <a href="#" className="text-green-400 hover:text-green-300 font-semibold flex items-center gap-2">
                Earn More <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 5: Investment Products */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-yellow-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Investment Products</h3>
              <p className="text-slate-300 mb-4">
                Crypto, managed funds (3-10 years), tagmarkets, and AIG Phone shares. Auto 80/20 split on returns.
              </p>
              <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-2">
                Invest <ArrowRight size={16} />
              </a>
            </div>

            {/* Card 6: Competition & Growth */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-red-500/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-rose-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Monthly Competitions</h3>
              <p className="text-slate-300 mb-4">
                Fast Tracker leaderboards, MoneyGames prizes, and tier-rise challenges. Compete and win big.
              </p>
              <a href="#" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-2">
                Compete <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diana AI Section */}
      <section id="diana" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Meet
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Diana AI
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-6">
              Your intelligent business companion with access to 10 AI-powered applications. No registration needed—just click the Diana button in the corner to chat!
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
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
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
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold inline-flex items-center gap-2 transition transform hover:scale-105"
              >
                Start Chatting with Diana <ArrowRight size={20} />
              </button>
              <Link
                href="/login"
                className="px-8 py-4 border border-slate-600 hover:border-blue-400 rounded-lg font-bold text-lg transition hover:bg-slate-800/50 inline-flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Diana Avatar */}
            <div className="col-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-12 border border-slate-700/50 backdrop-blur-xl flex items-center justify-center">
              <img
                src="/avatars/diana/diana-avatar.svg"
                alt="Diana AI Assistant"
                className="w-64 h-64 drop-shadow-2xl"
              />
            </div>

            {/* Chat Interface Preview */}
            <div className="col-span-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-6 border border-slate-700/50 backdrop-blur-xl">
              <div className="bg-slate-900/80 rounded-2xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src="/avatars/diana/diana-avatar.svg"
                    alt="Diana"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Diana</p>
                    <p className="text-sm text-slate-300">What would you like to know about the AIG ecosystem today?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="space-y-2 text-right">
                    <p className="text-sm text-slate-300 bg-blue-600/30 px-3 py-2 rounded-lg">Tell me about earning potential</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <img
                    src="/avatars/diana/diana-avatar.svg"
                    alt="Diana"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Diana</p>
                    <p className="text-sm text-slate-300">With our dual-account system, you earn 80% EUR Cash (fiat-backed) and 20% AIG$ tokens. Professional tier members have unlimited earning potential!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section id="ecosystem" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Tier
          </h2>
          <p className="text-center text-slate-300 mb-16">
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
                className={`rounded-xl p-8 transition transform hover:scale-105 ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-500/50 shadow-xl shadow-purple-500/20'
                    : 'bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-slate-400">{tier.period}</span>
                  <p className="text-sm text-blue-400 mt-2">Cap: {tier.earningCap}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-slate-700/50 hover:bg-slate-600/50'
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
        <h2 className="text-4xl font-bold mb-6">Ready to transform your business?</h2>
        <p className="text-xl text-slate-300 mb-8">
          Join thousands of members earning passive income through the AIG ecosystem
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
          >
            Create Account <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-4 border border-slate-600 hover:border-blue-400 rounded-lg font-bold text-lg transition hover:bg-slate-800/50">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  AIG
                </div>
                <span className="font-bold">AIGINVEST</span>
              </div>
              <p className="text-sm text-slate-400">
                The AI-powered business operating system
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400">Diana AI</a></li>
                <li><a href="#" className="hover:text-blue-400">Marketplace</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400">Security</a></li>
                <li><a href="#" className="hover:text-blue-400">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 AIGINVEST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
