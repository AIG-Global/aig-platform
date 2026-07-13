'use client'

import Image from 'next/image'

const BUSINESS_PACKS = [
  {
    name: 'Remittance',
    subtitle: 'Entry Access',
    price: '€0',
    earningCap: '€100 / month',
    investmentMin: 'Not available',
    transferFee: '5.0%',
    features: [
      'WDM and AIG ecosystem access',
      'AIG Ask (limited)',
      'MoneyGames (basic access)',
      'Affiliate referrals up to Level 1',
    ],
  },
  {
    name: 'Starter Business Pack',
    subtitle: 'Growth Tools',
    price: '€399/mo',
    earningCap: '€1,000 / month',
    investmentMin: '€1,000',
    transferFee: '3.90% (80% network, 20% management)',
    features: [
      'AIG Investment platform',
      'AIG MoneyGames App',
      'AIG Investor Alerts',
      'Marketplace seller access',
    ],
  },
  {
    name: 'Start-Up Business Pack',
    subtitle: 'Scale Faster',
    price: '€699/mo',
    earningCap: '€5,000 / month',
    investmentMin: '€5,000',
    transferFee: '1.90%',
    features: [
      'All Starter Pack features',
      'AIG HELO (emergency travel)',
      'AIG Business Weather',
      'Preferred seller status',
    ],
  },
  {
    name: 'Premium Business Pack',
    subtitle: 'Premium Suite',
    price: '€1,099/mo',
    earningCap: '€10,000 / month',
    investmentMin: '€10,000',
    transferFee: '0.90%',
    features: [
      'All Start-Up Pack features',
      'AIG Me (relationship manager)',
      'Exclusive VIP tools',
      'Priority support',
    ],
  },
  {
    name: 'Professional Business Pack',
    subtitle: 'Elite Suite',
    price: '€2,999/mo',
    earningCap: 'Unlimited',
    investmentMin: '€200,000',
    transferFee: '0.15%',
    features: [
      'All current and future apps',
      'AIG Record and AIG Secure Sign',
      'AIG Ask (Claude AI integration)',
      'Affiliate commissions up to 10 levels',
    ],
    featured: true,
  },
]

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-950 to-luxury-900 text-luxury-cream p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-bold text-center mb-4 text-luxury-gold">
          The Wealth Escalation Pathway
        </h1>
        <p className="text-center text-luxury-cream/80 text-lg max-w-2xl mx-auto">
          Membership is always free. Choose your business pack to unlock higher caps, deeper app access, and stronger earning potential.
        </p>
      </div>

      {/* Package Image */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="bg-luxury-900/50 backdrop-blur-sm rounded-2xl border border-luxury-gold/30 p-8 shadow-2xl">
          <Image
            src="/images/WhatsApp Image 2026-07-07 at 13.58.58.jpeg"
            alt="The Wealth Escalation Pathway - AIGINVEST Membership Tiers"
            width={800}
            height={600}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Package Details */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {BUSINESS_PACKS.map((pack) => (
          <div
            key={pack.name}
            className={`bg-luxury-900/50 backdrop-blur-sm rounded-xl border p-6 transition hover:border-luxury-gold/60 ${pack.featured ? 'border-luxury-gold/40 ring-1 ring-luxury-gold/40' : 'border-luxury-gold/20'}`}
          >
            <h3 className="text-2xl font-bold text-luxury-gold mb-2">{pack.name}</h3>
            <p className="text-luxury-cream/80 text-sm mb-4">{pack.subtitle}</p>
            <div className="text-3xl font-bold text-luxury-gold mb-4">{pack.price}</div>

            <div className="text-xs text-luxury-cream/80 space-y-1 mb-4">
              <p><strong>Earning cap:</strong> {pack.earningCap}</p>
              <p><strong>Investment min:</strong> {pack.investmentMin}</p>
              <p><strong>Transfer fee:</strong> {pack.transferFee}</p>
              <p><strong>AIG Cash transfers:</strong> FREE</p>
            </div>

            <ul className="space-y-2 text-sm text-luxury-cream/80">
              {pack.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Earnings Structure */}
      <div className="max-w-4xl mx-auto bg-luxury-900/50 backdrop-blur-sm rounded-xl border border-luxury-gold/30 p-8 mb-12">
        <h2 className="text-3xl font-bold text-luxury-gold mb-6">Earnings Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-luxury-gold mb-4">Payment Allocation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-luxury-950/30 rounded-lg">
                <span className="text-luxury-cream">EUR Cash</span>
                <span className="text-luxury-gold font-bold">80%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-luxury-950/30 rounded-lg">
                <span className="text-luxury-cream">AIG$ Tokens</span>
                <span className="text-luxury-gold font-bold">20%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-luxury-gold mb-4">Affiliate Commission</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-luxury-950/30 rounded-lg">
                <span className="text-luxury-cream">Starter Pack & Above</span>
                <span className="text-luxury-gold font-bold">26% Level 1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-luxury-950/30 rounded-lg">
                <span className="text-luxury-cream">Multi-Level Depth</span>
                <span className="text-luxury-gold font-bold">Up to 10 Levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto text-center">
        <button className="bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-950 px-12 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition">
          Get Started Today
        </button>
        <p className="text-luxury-cream/60 text-sm mt-4">
          Join thousands of members already earning with AIGINVEST
        </p>
      </div>
    </div>
  )
}
