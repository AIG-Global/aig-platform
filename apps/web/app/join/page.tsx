'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ArrowRight, Star, Wallet, Zap, Rocket, Crown } from 'lucide-react'

const packs = [
  {
    id: 'remittance',
    name: 'Remittance',
    tagline: 'Start exploring for free',
    appBundle: 'Free Forever',
    price: 0,
    priceLabel: '€0',
    earningCap: '€100 / month',
    investmentMin: 'Not available',
    transferFee: '5.0%',
    highlighted: false,
    apps: [
      'WDM and AIG ecosystem access',
      'AIG Ask (limited)',
      'MoneyGames (basic access)',
    ],
    perks: [
      'Affiliate referrals up to Level 1',
      'Basic ecosystem access',
      'Public leaderboard visibility',
      'AIG Cash transfers: FREE (no commissions)',
    ],
  },
  {
    id: 'starter',
    name: 'Starter Business Pack',
    tagline: 'Begin your wealth journey',
    appBundle: 'App Bundle: €399 / month',
    price: 399,
    priceLabel: '€399',
    earningCap: '€1,000 / month',
    investmentMin: '€1,000',
    transferFee: '3.90%',
    highlighted: false,
    apps: [
      'WDM and AIG ecosystem access',
      'AIG Investment platform',
      'AIG MoneyGames App',
      'AIG Investor Alerts',
      'Affiliate commissions – 6 levels',
      'Marketplace seller access',
      'Monthly webinars',
    ],
    perks: [
      '26% Level-1 commission rate',
      'Full ecosystem access',
      'Transfer fee: 80% network, 20% management',
      'AIG Cash transfers: FREE (no commissions)',
    ],
  },
  {
    id: 'startup',
    name: 'Start-Up Business Pack',
    tagline: 'Scale your growth fast',
    appBundle: 'App Bundle: €699 / month',
    price: 699,
    priceLabel: '€699',
    earningCap: '€5,000 / month',
    investmentMin: '€5,000',
    transferFee: '1.90%',
    highlighted: false,
    apps: [
      'All Starter Pack features',
      'AIG HELO (emergency travel)',
      'AIG Business Weather',
      'Affiliate commissions – 6 levels',
      'Preferred seller status',
    ],
    perks: [
      'Enhanced earning potential',
      'Priority support',
      'Transfer fee: 1.90%',
      'AIG Cash transfers: FREE (no commissions)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Business Pack',
    tagline: "It's time to build",
    appBundle: 'App Bundle: €1,099 / month',
    price: 1099,
    priceLabel: '€1,099',
    earningCap: '€10,000 / month',
    investmentMin: '€10,000',
    transferFee: '0.90%',
    highlighted: false,
    apps: [
      'All Start-Up Pack features',
      'AIG Me (relationship manager)',
      'Exclusive VIP tools',
      'Priority support',
    ],
    perks: [
      'High earning capacity',
      'Transfer fee: 0.90%',
      'Exclusive events',
      'AIG Cash transfers: FREE (no commissions)',
    ],
  },
  {
    id: 'professional',
    name: 'Professional Business Pack',
    tagline: 'Reach the world',
    appBundle: 'App Bundle: €2,999 / month',
    price: 2999,
    priceLabel: '€2,999',
    earningCap: 'Unlimited',
    investmentMin: '€200,000',
    transferFee: '0.15%',
    highlighted: true,
    apps: [
      'All current & future apps',
      'AIG Record (organization management)',
      'AIG Secure Sign (e-signature)',
      'AIG Ask (Claude AI integration)',
      'AIG ONE (premium dashboard)',
      'Affiliate commissions – 10 levels',
    ],
    perks: [
      'Unlimited earning potential',
      'Transfer fee: 0.15%',
      '24/7 VIP support',
      'Strategic partnership opportunities',
      'AIG Cash transfers: FREE (no commissions)',
    ],
  },
]

const PACK_ICONS = {
  remittance: Wallet,
  starter: Zap,
  startup: Rocket,
  premium: Star,
  professional: Crown,
} as const

const PACK_SUBLABELS = {
  remittance: 'Entry Access',
  starter: 'Growth Tools',
  startup: 'Scale Faster',
  premium: 'Premium Suite',
  professional: 'Elite Suite',
} as const

const PACK_BEST_FOR = {
  remittance: 'Best for curious newcomers who want to explore the ecosystem first.',
  starter: 'Best for members ready to activate core tools and begin earning.',
  startup: 'Best for fast movers building a wider network and stronger momentum.',
  premium: 'Best for established businesses looking to maximize their operations.',
  professional: 'Best for leaders who want the full suite and maximum earning potential.',
} as const

const PACK_ACCENTS = {
  remittance: {
    glow: 'rgba(148, 163, 184, 0.28)',
    soft: 'rgba(148, 163, 184, 0.12)',
    strong: '#cbd5e1'
  },
  starter: {
    glow: 'rgba(34, 197, 94, 0.28)',
    soft: 'rgba(34, 197, 94, 0.12)',
    strong: '#86efac'
  },
  startup: {
    glow: 'rgba(59, 130, 246, 0.28)',
    soft: 'rgba(59, 130, 246, 0.12)',
    strong: '#93c5fd'
  },
  premium: {
    glow: 'rgba(168, 85, 247, 0.28)',
    soft: 'rgba(168, 85, 247, 0.12)',
    strong: '#e9d5ff'
  },
  professional: {
    glow: 'rgba(212, 175, 55, 0.32)',
    soft: 'rgba(212, 175, 55, 0.14)',
    strong: '#f5d77f'
  }
} as const

export default function JoinPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [activePackId, setActivePackId] = useState<string>(packs.find((pack) => pack.highlighted)?.id ?? packs[0].id)
  const detailPanelRef = useRef<HTMLDivElement>(null)

  const activePack = packs.find((pack) => pack.id === activePackId) ?? packs[0]
  const activePackIndex = packs.findIndex((pack) => pack.id === activePackId)
  const ActivePackIcon = PACK_ICONS[activePack.id as keyof typeof PACK_ICONS] ?? Wallet
  const activePackSublabel = PACK_SUBLABELS[activePack.id as keyof typeof PACK_SUBLABELS] ?? 'Package Details'
  const activePackBestFor = PACK_BEST_FOR[activePack.id as keyof typeof PACK_BEST_FOR] ?? 'Best for members comparing package options.'
  const activePackAccent = PACK_ACCENTS[activePack.id as keyof typeof PACK_ACCENTS] ?? PACK_ACCENTS.professional
  const selectedPack = packs.find((pack) => pack.id === selected) ?? null

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) {
      return
    }

    detailPanelRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [activePackId])

  const handleChoosePack = (packId: string) => {
    setActivePackId(packId)
    setSelected(packId)
  }

  const handleContinue = () => {
    if (!selected) return
    router.push(`/auth?mode=signup&pack=${selected}`)
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(26, 15, 21, 0.45) 0%, rgba(42, 31, 40, 0.35) 50%, rgba(26, 15, 21, 0.45) 100%), url("/images/WhatsApp%20Image%202026-06-10%20at%2013.27.50%20%285%29.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/40" />

      {/* Content */}
      <div
        className="relative z-10 min-h-screen px-4 py-14"
        style={{
          width: '100%',
          maxWidth: '820px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >

        {/* Header */}
        <div
          className="text-center mb-8 md:mb-10"
          style={{
            width: '100%',
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
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

        {/* Package Steps */}
        <div
          className="flex flex-col items-center w-full md:pt-[8vh]"
          style={{
            width: '100%',
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <div className="w-full flex items-center justify-center">
            <div className="w-full mx-auto">
              <div className="pack-grid relative z-10 pb-4" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {packs.map((pack, index) => {
              const isActive = activePackId === pack.id
              const isSelected = selected === pack.id
              const PackIcon = PACK_ICONS[pack.id as keyof typeof PACK_ICONS] ?? Wallet
              const packSublabel = PACK_SUBLABELS[pack.id as keyof typeof PACK_SUBLABELS] ?? 'Package'
              const packAccent = PACK_ACCENTS[pack.id as keyof typeof PACK_ACCENTS] ?? PACK_ACCENTS.professional

              return (
                <button
                  key={pack.id}
                  onClick={() => setActivePackId(pack.id)}
                  style={{
                    backgroundColor: isActive ? packAccent.soft : 'rgba(26, 15, 21, 0.58)',
                    borderColor: isActive ? packAccent.strong : 'rgba(212, 175, 55, 0.28)',
                    boxShadow: isActive ? `0 0 24px ${packAccent.glow}` : 'none',
                    backdropFilter: 'blur(12px)',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0px)',
                    textAlign: 'center'
                  }}
                  className="pack-card rounded-2xl border p-4 text-center transition-all duration-200 hover:border-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] h-full"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span style={{ color: '#d4af37' }} className="text-[11px] font-bold tracking-[0.24em] uppercase">
                      Step {index + 1}
                    </span>
                    {pack.highlighted && (
                      <span
                        style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                        className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Star size={10} /> Popular
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: isActive ? packAccent.soft : 'rgba(212, 175, 55, 0.08)',
                      color: isActive ? packAccent.strong : '#d4af37',
                      borderColor: isActive ? packAccent.strong : 'rgba(212, 175, 55, 0.24)'
                    }}
                    className="w-11 h-11 rounded-2xl border flex items-center justify-center mb-4"
                  >
                    <PackIcon size={20} />
                  </div>
                  <p style={{ color: isActive ? packAccent.strong : '#d4af37' }} className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2 opacity-85">
                    {packSublabel}
                  </p>
                  <h2 style={{ color: '#f5f5dc' }} className="text-lg font-bold">{pack.name}</h2>
                  <p style={{ color: '#e8e8d0' }} className="text-xs mt-1">{pack.tagline}</p>
                  <div className="mt-4 flex items-end justify-between gap-3 text-center" style={{ textAlign: 'center' }}>
                    <div className="text-center" style={{ textAlign: 'center' }}>
                      <p style={{ color: '#d4af37' }} className="text-2xl font-bold">{pack.priceLabel}</p>
                      <p style={{ color: '#b9b5aa' }} className="text-xs">{pack.apps.length} apps</p>
                    </div>
                    <div
                      style={{
                        backgroundColor: isActive ? packAccent.strong : 'rgba(212, 175, 55, 0.15)',
                        color: isActive ? '#1a0f15' : '#d4af37',
                        borderColor: isActive ? packAccent.strong : 'rgba(212, 175, 55, 0.35)'
                      }}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0"
                    >
                      {index + 1}
                    </div>
                    {isSelected && (
                      <span
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.18)', color: '#d4af37', borderColor: 'rgba(212, 175, 55, 0.35)' }}
                        className="border rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                      >
                        Chosen
                      </span>
                    )}
                  </div>
                </button>
                )
              })}
              </div>
            </div>
          </div>

          <div
            ref={detailPanelRef}
            style={{
              backgroundColor: 'rgba(26, 15, 21, 0.62)',
              borderColor: activePackAccent.strong,
              boxShadow: `0 0 28px rgba(0, 0, 0, 0.18), 0 0 22px ${activePackAccent.glow}`,
              backdropFilter: 'blur(12px)',
              animation: 'joinPanelFade 280ms ease-out',
            }}
            className="rounded-[28px] border mt-8 w-full overflow-hidden"
            key={activePack.id}
          >
            {/* Header Section */}
            <div
              style={{
                background: `linear-gradient(135deg, ${activePackAccent.soft}, rgba(212, 175, 55, 0.04))`,
                borderBottom: `1px solid ${activePackAccent.strong}`,
              }}
              className="p-6 md:p-8 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span style={{ color: '#d4af37' }} className="text-[11px] font-bold tracking-[0.28em] uppercase">
                  Selected Package
                </span>
                {activePack.highlighted && (
                  <span
                    style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
                    className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <Star size={10} /> Most Popular
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div
                  style={{
                    background: `linear-gradient(180deg, ${activePackAccent.soft}, rgba(212, 175, 55, 0.04))`,
                    borderColor: activePackAccent.strong,
                    color: activePackAccent.strong
                  }}
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0"
                >
                  <ActivePackIcon size={24} />
                </div>
                <div className="text-left">
                  <p style={{ color: activePackAccent.strong }} className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-85">
                    {activePackSublabel}
                  </p>
                  <h2 style={{ color: '#f5f5dc' }} className="text-2xl md:text-3xl font-bold mt-1">{activePack.name}</h2>
                </div>
              </div>
              <p style={{ color: '#e8e8d0' }} className="text-sm mt-3">{activePack.tagline}</p>
              <p style={{ color: '#d9cfbe' }} className="text-xs mt-3 font-medium">
                {activePackBestFor}
              </p>
            </div>

            {/* Pricing & Metrics Section */}
            <div
              style={{ borderBottom: `1px solid ${activePackAccent.strong}` }}
              className="p-6 md:p-8"
            >
              <div
                style={{
                  background: `linear-gradient(180deg, ${activePackAccent.soft}, rgba(212, 175, 55, 0.06))`,
                  borderColor: activePackAccent.strong
                }}
                className="border rounded-2xl px-6 py-5 mb-6 text-center"
              >
                <p style={{ color: activePackAccent.strong }} className="text-xs font-bold uppercase tracking-[0.24em]">Monthly Investment</p>
                <p style={{ color: '#f5f5dc' }} className="text-5xl font-bold mt-2">{activePack.priceLabel}</p>
                <p style={{ color: '#cfc7b8' }} className="text-xs mt-2">One-time setup • No hidden fees</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }} className="border rounded-2xl p-4 text-center">
                  <p style={{ color: '#8f887b' }} className="uppercase text-[10px] tracking-[0.2em] font-semibold mb-2">Earning Cap</p>
                  <p style={{ color: '#f5f5dc' }} className="font-bold text-sm">{activePack.earningCap}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }} className="border rounded-2xl p-4 text-center">
                  <p style={{ color: '#8f887b' }} className="uppercase text-[10px] tracking-[0.2em] font-semibold mb-2">Investment Min</p>
                  <p style={{ color: '#f5f5dc' }} className="font-bold text-sm">{activePack.investmentMin}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }} className="border rounded-2xl p-4 text-center">
                  <p style={{ color: '#8f887b' }} className="uppercase text-[10px] tracking-[0.2em] font-semibold mb-2">Transfer Fee</p>
                  <p style={{ color: '#f5f5dc' }} className="font-bold text-sm">{activePack.transferFee}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }} className="border rounded-2xl p-4 text-center">
                  <p style={{ color: '#8f887b' }} className="uppercase text-[10px] tracking-[0.2em] font-semibold mb-2">Tools Included</p>
                  <p style={{ color: '#f5f5dc' }} className="font-bold text-sm">{activePack.apps.length}</p>
                </div>
              </div>
            </div>

            {/* Features Grid Section */}
            <div className="p-6 md:p-8">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Apps Included */}
                <div
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }}
                  className="border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      style={{ backgroundColor: activePackAccent.soft, color: activePackAccent.strong }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                    >
                      <Zap size={16} />
                    </div>
                    <p style={{ color: '#d4af37' }} className="text-xs font-bold uppercase tracking-[0.24em]">
                      Tools & Apps
                    </p>
                  </div>
                  <div className="space-y-2">
                    {activePack.apps.map((app, index) => (
                      <div
                        key={app}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.06)' }}
                      >
                        <div
                          style={{ backgroundColor: activePackAccent.soft, color: activePackAccent.strong }}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        >
                          {index + 1}
                        </div>
                        <p style={{ color: '#ece7dc' }} className="text-sm leading-5 pt-0.5">{app}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perks & Benefits */}
                <div
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(212, 175, 55, 0.18)' }}
                  className="border rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      style={{ backgroundColor: activePackAccent.soft, color: activePackAccent.strong }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                    >
                      <Check size={16} />
                    </div>
                    <p style={{ color: '#d4af37' }} className="text-xs font-bold uppercase tracking-[0.24em]">
                      Benefits & Perks
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {activePack.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(212, 175, 55, 0.06)' }}>
                        <Check size={14} className="mt-1.5 flex-shrink-0" style={{ color: '#d4af37' }} />
                        <span style={{ color: '#ece7dc' }} className="text-sm leading-5">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div
              style={{
                background: `linear-gradient(135deg, ${activePackAccent.soft}, rgba(212, 175, 55, 0.04))`,
                borderTop: `1px solid ${activePackAccent.strong}`,
              }}
              className="p-6 md:p-8 text-center"
            >
              <button
                onClick={() => handleChoosePack(activePack.id)}
                style={{
                  backgroundColor: selected === activePack.id ? '#d4af37' : 'transparent',
                  color: selected === activePack.id ? '#1a0f15' : '#d4af37',
                  borderColor: '#d4af37'
                }}
                className="w-full md:w-auto px-8 py-3 rounded-xl border font-bold text-sm transition hover:bg-[#d4af37] hover:text-[#1a0f15]"
              >
                {selected === activePack.id ? `✓ ${activePack.name} Selected` : `Choose ${activePack.name}`}
              </button>
            </div>
          </div>
        </div>

        {/* Continue CTA */}
        <div
          className="mt-8 text-center w-full"
          style={{
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <button
            onClick={handleContinue}
            disabled={!selected}
            style={{
              backgroundColor: selected ? '#d4af37' : 'rgba(212,175,55,0.3)',
              color: selected ? '#1a0f15' : '#e8e8d0',
            }}
            className="px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 transition disabled:cursor-not-allowed"
          >
            {selectedPack ? `Continue with ${selectedPack.name}` : 'Continue with Registration'}
            <ArrowRight size={20} />
          </button>
          {selectedPack && (
            <p style={{ color: '#d4af37' }} className="text-sm mt-3 font-semibold tracking-[0.16em] uppercase">
              Selected: {selectedPack.name} · {selectedPack.priceLabel}
            </p>
          )}
          {!selected && (
            <p style={{ color: '#e8e8d0' }} className="text-sm mt-3 opacity-70">
              Select a pack above to continue
            </p>
          )}
        </div>

        <style jsx>{`
          .pack-grid {
            display: grid;
            grid-template-columns: minmax(0, 340px);
            justify-content: center;
            justify-items: center;
            gap: 16px;
            width: 100%;
            margin: 0 auto;
          }

          .pack-card {
            width: 100%;
            max-width: 340px;
          }

          @media (min-width: 700px) {
            .pack-grid {
              grid-template-columns: repeat(2, minmax(0, 340px));
            }
          }

          @media (min-width: 1480px) {
            .pack-grid {
              grid-template-columns: repeat(4, minmax(0, 210px));
            }

            .pack-card {
              max-width: 210px;
            }
          }

          @keyframes joinPanelFade {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

      </div>
    </div>
  )
}
