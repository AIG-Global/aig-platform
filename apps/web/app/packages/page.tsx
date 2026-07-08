'use client'

import Image from 'next/image'

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-950 to-luxury-900 text-luxury-cream p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-bold text-center mb-4 text-luxury-gold">
          The Wealth Escalation Pathway
        </h1>
        <p className="text-center text-luxury-cream/80 text-lg max-w-2xl mx-auto">
          Choose the perfect membership tier to accelerate your wealth and unlock exclusive benefits within the AIGINVEST ecosystem.
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Package A */}
        <div className="bg-luxury-900/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-6 hover:border-luxury-gold/50 transition">
          <h3 className="text-2xl font-bold text-luxury-gold mb-2">Package A</h3>
          <p className="text-luxury-cream/80 text-sm mb-4">Entry Level</p>
          <div className="text-3xl font-bold text-luxury-gold mb-6">Free</div>
          <ul className="space-y-2 text-sm text-luxury-cream/80">
            <li>✓ Basic access to ecosystem</li>
            <li>✓ Diana AI assistant</li>
            <li>✓ Community forum</li>
            <li>✓ Educational resources</li>
          </ul>
        </div>

        {/* Package B */}
        <div className="bg-luxury-900/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-6 hover:border-luxury-gold/50 transition">
          <h3 className="text-2xl font-bold text-luxury-gold mb-2">Package B</h3>
          <p className="text-luxury-cream/80 text-sm mb-4">Starter Tier</p>
          <div className="text-3xl font-bold text-luxury-gold mb-6">€399<span className="text-sm">/mo</span></div>
          <ul className="space-y-2 text-sm text-luxury-cream/80">
            <li>✓ All Package A features</li>
            <li>✓ Advanced marketplace access</li>
            <li>✓ Priority support</li>
            <li>✓ 10% affiliate commission</li>
          </ul>
        </div>

        {/* Package C */}
        <div className="bg-luxury-900/50 backdrop-blur-sm rounded-xl border border-luxury-gold/30 p-6 hover:border-luxury-gold/60 transition ring-1 ring-luxury-gold/40">
          <h3 className="text-2xl font-bold text-luxury-gold mb-2">Package C</h3>
          <p className="text-luxury-cream/80 text-sm mb-4">Professional</p>
          <div className="text-3xl font-bold text-luxury-gold mb-6">€699<span className="text-sm">/mo</span></div>
          <ul className="space-y-2 text-sm text-luxury-cream/80">
            <li>✓ All Package B features</li>
            <li>✓ VIP marketplace access</li>
            <li>✓ 26% affiliate commission</li>
            <li>✓ Multi-level earnings (10 levels)</li>
          </ul>
        </div>

        {/* Enterprise */}
        <div className="bg-luxury-900/50 backdrop-blur-sm rounded-xl border border-luxury-gold/20 p-6 hover:border-luxury-gold/50 transition">
          <h3 className="text-2xl font-bold text-luxury-gold mb-2">Enterprise</h3>
          <p className="text-luxury-cream/80 text-sm mb-4">Premium</p>
          <div className="text-3xl font-bold text-luxury-gold mb-6">€2,999<span className="text-sm">/mo</span></div>
          <ul className="space-y-2 text-sm text-luxury-cream/80">
            <li>✓ All features unlocked</li>
            <li>✓ Dedicated account manager</li>
            <li>✓ Unlimited affiliate levels</li>
            <li>✓ Custom investment strategies</li>
          </ul>
        </div>
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
                <span className="text-luxury-cream">Package C & Above</span>
                <span className="text-luxury-gold font-bold">26% Level 1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-luxury-950/30 rounded-lg">
                <span className="text-luxury-cream">Multi-Level Depth</span>
                <span className="text-luxury-gold font-bold">10+ Levels</span>
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
