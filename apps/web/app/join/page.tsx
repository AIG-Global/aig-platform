'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, Star } from 'lucide-react'

const packs = [
  {
    id: 'remittance',
    name: 'Remittance',
    tagline: 'Start exploring for free',
    appBundle: 'Free Forever',
    price: 0,
    priceLabel: '€0',
    earningCap: '€100 / month',
    highlighted: false,
    apps: [
      'AIG Ask (limited – 20 queries/day)',
      'MoneyGames (basic access)',
      'Community feed (read-only)',
    ],
    perks: [
      'Affiliate referrals up to Level 1',
      'Basic ecosystem access',
      'Public leaderboard visibility',
    ],
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    tagline: 'Begin your wealth journey',
    appBundle: 'App Bundle: €399 / month',
    price: 399,
    priceLabel: '€399',
    earningCap: '€500 / month',
    highlighted: false,
    apps: [
      'AIG Ask (unlimited)',
      'Diana AI Personal Assistant',
      'WDM – Wealth Dashboard Manager',
      'MoneyGames (full access)',
      'AIG Business Weather',
      'AIG Market Scanner',
      'AIG Community Hub',
    ],
    perks: [
      'Affiliate commissions – 3 levels',
      '26% Level-1 commission rate',
      'Marketplace seller access',
      'Monthly webinars',
    ],
  },
  {
    id: 'startup',
    name: 'Start-Up Pack',
    tagline: 'Scale your growth fast',
    appBundle: 'App Bundle: €999 / month',
    price: 999,
    priceLabel: '€999',
    earningCap: '€5 000 / month',
    highlighted: false,
    apps: [
      'All Starter Pack apps (7)',
      'AIG Investment Intelligence',
      'AIG Automation Suite',
    ],
    perks: [
      'Affiliate commissions – 10 levels',
      'Preferred seller status',
      'Fast Tracker leaderboard entry',
      'Priority support',
      'Exclusive Start-Up events',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    tagline: 'Maximum power, unlimited upside',
    appBundle: 'App Bundle: €2 999 / month',
    price: 2999,
    priceLabel: '€2 999',
    earningCap: 'Unlimited',
    highlighted: true,
    apps: [
      'All current apps (9+)',
      'Every future app – automatically included',
      'Custom AI model training',
      'Organisation management dashboard',
    ],
    perks: [
      'Affiliate commissions – 10 levels (max rates)',
      'Unlimited earning potential',
      'VIP events & masterminds',
      'Dedicated account manager',
      '24/7 priority support',
      'Strategic partnership opportunities',
    ],
  },
]

export default function JoinPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  const handleContinue = () => {
    if (!selected) return
    router.push(`/auth?mode=signup&pack=${selected}`)
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0f15 0%, #2a1f28 50%, #1a0f15 100%)' }}
    >
      {/* Vault Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/images/vault.jpeg"
          alt="background"
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'brightness(0.35) saturate(0.7)',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen px-4 py-14">

        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.back()}
            style={{ color: '#d4af37' }}
            className="text-sm hover:opacity-70 transition mb-6 block mx-auto"
          >
            ← Back
          </button>
          <h1
            style={{
              background: 'linear-gradient(to right, #d4af37, #e8d4a2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Choose Your Pack
          </h1>
          <p style={{ color: '#e8e8d0' }} className="text-lg max-w-xl mx-auto">
            Membership is <span style={{ color: '#d4af37' }} className="font-bold">always free</span>.
            You pay only for the app bundle inside your pack — the bigger the pack, the better the perks and earning power.
          </p>
        </div>

        {/* Pack Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {packs.map((pack) => {
            const isSelected = selected === pack.id
            return (
              <div
                key={pack.id}
                onClick={() => setSelected(pack.id)}
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(212, 175, 55, 0.18)'
                    : pack.highlighted
                    ? 'rgba(212, 175, 55, 0.10)'
                    : 'rgba(26, 15, 21, 0.60)',
                  borderColor: isSelected ? '#d4af37' : pack.highlighted ? '#d4af37' : 'rgba(212,175,55,0.3)',
                  borderWidth: isSelected || pack.highlighted ? '2px' : '1px',
                  boxShadow: isSelected
                    ? '0 0 30px rgba(212, 175, 55, 0.35)'
                    : pack.highlighted
                    ? '0 0 20px rgba(212, 175, 55, 0.15)'
                    : 'none',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="rounded-2xl border p-6 flex flex-col hover:scale-[1.02] transition-transform"
              >
                {/* Badge row */}
                <div className="flex items-center justify-between mb-1">
                  {pack.highlighted && (
                    <span
                      style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                      className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <Star size={10} /> Most Popular
                    </span>
                  )}
                  {isSelected && (
                    <span
                      style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                      className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto"
                    >
                      ✓ Selected
                    </span>
                  )}
                </div>

                {/* Name & tagline */}
                <h2 style={{ color: '#f5f5dc' }} className="text-xl font-bold mt-2">{pack.name}</h2>
                <p style={{ color: '#e8e8d0' }} className="text-xs mb-4">{pack.tagline}</p>

                {/* Price */}
                <div
                  style={{
                    borderColor: 'rgba(212,175,55,0.3)',
                    borderTopWidth: '1px',
                    borderBottomWidth: '1px',
                  }}
                  className="py-3 mb-4"
                >
                  <p style={{ color: '#d4af37' }} className="text-2xl font-bold">
                    {pack.priceLabel}
                    {pack.price > 0 && (
                      <span style={{ color: '#e8e8d0' }} className="text-sm font-normal ml-1">/ month</span>
                    )}
                  </p>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mt-1">
                    App bundle · Membership FREE
                  </p>
                  <p style={{ color: '#d4af37' }} className="text-xs mt-1 font-semibold">
                    Earning cap: {pack.earningCap}
                  </p>
                </div>

                {/* Apps included */}
                <p style={{ color: '#d4af37' }} className="text-xs font-bold uppercase tracking-wider mb-2">
                  Apps Included
                </p>
                <ul className="space-y-1 mb-4">
                  {pack.apps.map((app, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#e8e8d0' }}>
                      <Check size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#d4af37' }} />
                      {app}
                    </li>
                  ))}
                </ul>

                {/* Perks */}
                <p style={{ color: '#d4af37' }} className="text-xs font-bold uppercase tracking-wider mb-2">
                  Perks
                </p>
                <ul className="space-y-1 mb-6 flex-1">
                  {pack.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#e8e8d0' }}>
                      <div
                        style={{ backgroundColor: '#d4af37', flexShrink: 0, marginTop: '5px' }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Select button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(pack.id) }}
                  style={{
                    backgroundColor: isSelected ? '#d4af37' : 'transparent',
                    color: isSelected ? '#1a0f15' : '#d4af37',
                    borderColor: '#d4af37',
                  }}
                  className="w-full py-2 rounded-lg border font-bold text-sm transition hover:bg-[#d4af37] hover:text-[#1a0f15]"
                >
                  {isSelected ? '✓ Selected' : 'Select This Pack'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Continue CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={handleContinue}
            disabled={!selected}
            style={{
              backgroundColor: selected ? '#d4af37' : 'rgba(212,175,55,0.3)',
              color: selected ? '#1a0f15' : '#e8e8d0',
            }}
            className="px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 transition disabled:cursor-not-allowed"
          >
            Continue with Registration
            <ArrowRight size={20} />
          </button>
          {!selected && (
            <p style={{ color: '#e8e8d0' }} className="text-sm mt-3 opacity-70">
              Select a pack above to continue
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
