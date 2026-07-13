'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bitcoin,
  CandlestickChart,
  CheckCircle2,
  Clock3,
  Coins,
  Globe2,
  Landmark,
  Newspaper,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'

type TrackId = 'north-star' | 'long-term'

const TRACKS: Array<{
  id: TrackId
  label: string
  headline: string
  summary: string
  cta: string
  bulletPoints: string[]
}> = [
  {
    id: 'north-star',
    label: 'AIG Phone Ltd Token Exchange',
    headline: 'North Star exchange for AIG Phone Ltd token execution and liquidity',
    summary:
      'Trade AIG Phone Ltd token pairs with live order-book context, execution rails, and treasury-aware market intelligence.',
    cta: 'Open Token Exchange',
    bulletPoints: [
      'AIGP/EUR and AIGP/USDT execution lanes',
      'Depth, spread, and slippage visibility before order submit',
      'Treasury and float monitoring for token stability',
      'Session analytics for volume, volatility, and flow imbalance',
    ],
  },
  {
    id: 'long-term',
    label: 'Long-Term Investing',
    headline: 'Structured wealth compounding for 3 to 10 year horizons',
    summary:
      'Build durable positions with tiered products, scheduled contributions, and maturity planning for investors prioritizing consistency.',
    cta: 'Build Long-Term Plan',
    bulletPoints: [
      '3Y / 5Y / 7Y / 10Y investment products',
      'Reinvestment and maturity planning controls',
      'Commission-aware return projections',
      'Portfolio mix suggestions by risk profile',
    ],
  },
]

const LONG_TERM_PRODUCTS = [
  { name: '3-Year Growth', apr: '5.5% APR', min: 'EUR 1,000', liquidity: 'Quarterly review window' },
  { name: '5-Year Compounding', apr: '6.5% APR', min: 'EUR 2,500', liquidity: 'Semi-annual review window' },
  { name: '7-Year Strategic', apr: '7.5% APR', min: 'EUR 5,000', liquidity: 'Annual review window' },
  { name: '10-Year Legacy', apr: '8.5% APR', min: 'EUR 10,000', liquidity: 'Annual review with bonus tiers' },
]

const PLATFORM_PARTNERS = [
  {
    name: 'TagMarkets',
    kind: 'Primary Trading Partner',
    url: 'https://tagmarkets.com',
    description: 'Integrated entry for multi-asset execution and account workflows.',
    highlights: ['Broker bridge readiness', 'Order routing surface', 'Unified account handoff'],
    accent: '#d4af37',
    icon: CandlestickChart,
  },
  {
    name: 'Binance',
    kind: 'Crypto Exchange',
    url: 'https://www.binance.com',
    description: 'Deep liquidity routes for digital asset strategies and signal execution.',
    highlights: ['Spot and derivatives coverage', 'API connectivity path', 'Global market depth'],
    accent: '#f59e0b',
    icon: Bitcoin,
  },
  {
    name: 'Kraken',
    kind: 'Crypto Exchange',
    url: 'https://www.kraken.com',
    description: 'Institution-oriented trading rails for secure crypto market participation.',
    highlights: ['Security-focused posture', 'Advanced order types', 'Professional market interface'],
    accent: '#60a5fa',
    icon: ShieldCheck,
  },
  {
    name: 'Coinbase Advanced',
    kind: 'Crypto Exchange',
    url: 'https://www.coinbase.com/advanced-trade',
    description: 'User-friendly execution stack for portfolio expansion into digital assets.',
    highlights: ['Simple onboarding flow', 'Advanced trade terminal', 'Portfolio custody options'],
    accent: '#22d3ee',
    icon: Wallet,
  },
]

const EXCHANGE_PAIRS = [
  { pair: 'AIGP/EUR', price: '4.82', spread: '0.6%', volume: '2.6M' },
  { pair: 'AIGP/USDT', price: '5.19', spread: '0.9%', volume: '3.8M' },
  { pair: 'AIGP/BTC', price: '0.000071', spread: '1.2%', volume: '0.6M' },
  { pair: 'AIGP/ETH', price: '0.00131', spread: '1.1%', volume: '0.9M' },
]

type MarketNewsItem = {
  title: string
  link: string
  source: string
  region: string
  publishedAt: string
}

const MARKETWATCH_FALLBACK: MarketNewsItem[] = [
  {
    title: 'Global stocks edge higher as rate-cut expectations return to the foreground',
    link: '#',
    source: 'AIG Market Desk',
    region: 'Global',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Commodities mixed as oil demand forecasts and inventories diverge',
    link: '#',
    source: 'AIG Market Desk',
    region: 'EMEA',
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Crypto majors consolidate while derivatives funding rates normalize',
    link: '#',
    source: 'AIG Market Desk',
    region: 'Global',
    publishedAt: new Date().toISOString(),
  },
]

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Now'

  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export default function EcosystemInvestmentsPage() {
  const [activeTrack, setActiveTrack] = useState<TrackId>('north-star')
  const [newsItems, setNewsItems] = useState<MarketNewsItem[]>(MARKETWATCH_FALLBACK)
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [newsUpdatedAt, setNewsUpdatedAt] = useState<string>(new Date().toISOString())

  const selectedTrack = useMemo(
    () => TRACKS.find((track) => track.id === activeTrack) ?? TRACKS[0],
    [activeTrack]
  )

  useEffect(() => {
    let cancelled = false

    const loadNews = async () => {
      setNewsLoading(true)
      setNewsError(null)

      try {
        const response = await fetch('/api/marketwatch', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`Marketwatch fetch failed with ${response.status}`)
        }

        const payload = await response.json()
        const items: MarketNewsItem[] = Array.isArray(payload?.items) ? payload.items : []

        if (!cancelled) {
          setNewsItems(items.length > 0 ? items.slice(0, 12) : MARKETWATCH_FALLBACK)
          setNewsUpdatedAt(payload?.updatedAt || new Date().toISOString())
        }
      } catch (_error) {
        if (!cancelled) {
          setNewsItems(MARKETWATCH_FALLBACK)
          setNewsError('Live feeds are temporarily limited. Showing market desk fallback headlines.')
          setNewsUpdatedAt(new Date().toISOString())
        }
      } finally {
        if (!cancelled) {
          setNewsLoading(false)
        }
      }
    }

    loadNews()
    const intervalId = setInterval(loadNews, 180000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(circle at 15% 20%, rgba(212,175,55,0.24), transparent 38%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.08), transparent 30%), linear-gradient(135deg, rgba(10, 7, 10, 0.84) 0%, rgba(22, 13, 18, 0.84) 45%, rgba(9, 6, 9, 0.88) 100%), url("/images/Use%20AI%20Image%20May%2015,%202026,%2012_49_19.png")',
        backgroundSize: 'auto, auto, auto, cover',
        backgroundPosition: 'center, center, center, center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat',
        minHeight: '100vh',
        color: '#f5f5dc',
        paddingTop: '3.5rem',
        paddingBottom: '4rem',
      }}
    >
      <div
        style={{
          width: 'min(1200px, 94vw)',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(212,175,55,0.35)',
            background: 'linear-gradient(140deg, rgba(61,44,53,0.6), rgba(24,17,23,0.7))',
            boxShadow: '0 20px 70px rgba(0,0,0,0.35)',
            width: '100%',
            borderRadius: '1rem',
            padding: '2rem 1.25rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#d4af37',
            }}
          >
            <Sparkles size={14} />
            <span>Investment Intelligence Hub</span>
          </div>

          <h1
            style={{
              background: 'linear-gradient(90deg, #d4af37 0%, #fff2b8 45%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 'clamp(2.4rem, 7.5vw, 5.2rem)',
              lineHeight: 1.06,
              fontWeight: 700,
              marginTop: '1rem',
            }}
          >
            Ecosystem Investments And Exchange
          </h1>

          <p style={{ margin: '1rem auto 0 auto', maxWidth: '900px', fontSize: 'clamp(1rem, 2.8vw, 1.2rem)', color: '#efe8d4' }}>
            Trade the AIG Phone Ltd token via North Star exchange workflows or compound over time through long-term products.
            This workspace now includes integrated partner access for TagMarkets and selected crypto platforms.
          </p>

          <div
            style={{
              margin: '2rem auto 0 auto',
              width: 'min(920px, 100%)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setActiveTrack(track.id)}
                style={{
                  border: activeTrack === track.id ? '1px solid rgba(212,175,55,0.9)' : '1px solid rgba(212,175,55,0.35)',
                  background:
                    activeTrack === track.id
                      ? 'linear-gradient(130deg, rgba(212,175,55,0.22), rgba(212,175,55,0.06))'
                      : 'linear-gradient(130deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                  borderRadius: '0.8rem',
                  padding: '1.25rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#f7efd1', fontWeight: 600 }}>
                  {track.id === 'north-star' ? <TrendingUp size={18} /> : <Landmark size={18} />}
                  <span>{track.label}</span>
                </div>
                <p style={{ marginTop: '0.6rem', color: '#ded5bd', fontSize: '0.95rem' }}>{track.summary}</p>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            margin: '2rem auto 0 auto',
            width: '100%',
            maxWidth: '1150px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          <section
            style={{
              border: '1px solid rgba(212,175,55,0.32)',
              background: 'rgba(29,20,27,0.72)',
              borderRadius: '1rem',
              padding: '1.75rem 1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4af37' }}>
              {activeTrack === 'north-star' ? <BarChart3 size={18} /> : <Clock3 size={18} />}
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.18em' }}>{selectedTrack.label}</span>
            </div>

            <h2 style={{ marginTop: '0.75rem', fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: '#f8f1d9' }}>{selectedTrack.headline}</h2>
            <p style={{ margin: '0.8rem auto 0 auto', maxWidth: '780px', color: '#e5dcc4', fontSize: '1rem' }}>{selectedTrack.summary}</p>

            <div
              style={{
                margin: '1.5rem auto 0 auto',
                width: 'min(860px, 100%)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {selectedTrack.bulletPoints.map((point) => (
                <div
                  key={point}
                  style={{
                    border: '1px solid rgba(212,175,55,0.2)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '0.7rem',
                    padding: '0.6rem 0.75rem',
                    color: '#efe6cf',
                    fontSize: '0.92rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '0.5rem', textAlign: 'left' }}>
                    <CheckCircle2 size={16} style={{ marginTop: '0.2rem', flexShrink: 0, color: '#d4af37' }} />
                    <span>{point}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
              <Link
                href="/dashboard"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4d77e 100%)',
                  color: '#1a0f15',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.65rem',
                  padding: '0.7rem 1.1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                }}
              >
                {selectedTrack.cta}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/join"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.65rem',
                  padding: '0.7rem 1.1rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#f4ebcf',
                  border: '1px solid rgba(212,175,55,0.6)',
                  background: 'rgba(212,175,55,0.08)',
                }}
              >
                Upgrade Access
              </Link>
            </div>

            {activeTrack === 'north-star' && (
              <div
                style={{
                  margin: '1.35rem auto 0 auto',
                  width: 'min(860px, 100%)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  background: 'rgba(12,9,12,0.5)',
                  borderRadius: '0.9rem',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4af37' }}>
                  <Activity size={16} />
                  <p style={{ margin: 0, fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>
                    AIG Phone Ltd Token Exchange Board
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '0.8rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: '0.6rem',
                  }}
                >
                  {EXCHANGE_PAIRS.map((item) => (
                    <div
                      key={item.pair}
                      style={{
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: '0.65rem',
                        padding: '0.65rem',
                        background: 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <p style={{ margin: 0, color: '#f6efd8', fontWeight: 700, fontSize: '0.9rem' }}>{item.pair}</p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#d4af37', fontWeight: 700, fontSize: '1.02rem' }}>{item.price}</p>
                      <div style={{ marginTop: '0.25rem', fontSize: '0.74rem', color: '#c6ba9b' }}>
                        Spread: {item.spread} | Vol: {item.volume}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            style={{
              border: '1px solid rgba(212,175,55,0.28)',
              background: 'rgba(18,13,18,0.75)',
              borderRadius: '1rem',
              padding: '1.75rem 1.25rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4af37' }}>
              <Coins size={18} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Long-Term Products</h3>
            </div>
            <div style={{ margin: '1rem auto 0 auto', maxWidth: '520px', display: 'grid', gap: '0.75rem' }}>
              {LONG_TERM_PRODUCTS.map((fund) => (
                <div
                  key={fund.name}
                  style={{
                    border: '1px solid rgba(212,175,55,0.2)',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '0.7rem',
                    padding: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#f7efd3' }}>{fund.name}</p>
                    <p style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#d4af37' }}>{fund.apr}</p>
                  </div>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#cfc3a8' }}>Minimum: {fund.min}</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#b9ab8b' }}>Liquidity: {fund.liquidity}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section style={{ margin: '2rem auto 0 auto', width: '100%', maxWidth: '1150px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4af37' }}>
            <Globe2 size={18} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f5ecd2' }}>Integrated Trading Platforms</h3>
          </div>
          <p style={{ margin: '0.5rem auto 0 auto', maxWidth: '900px', fontSize: '1rem', color: '#dfd4bb' }}>
            Unified partner cards for account handoff, platform launch, and integration readiness across traditional and crypto venues.
          </p>

          <div
            style={{
              margin: '1rem auto 0 auto',
              width: '100%',
              maxWidth: '1050px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {PLATFORM_PARTNERS.map((platform) => {
              const Icon = platform.icon
              return (
                <article
                  key={platform.name}
                  style={{
                    border: `1px solid ${platform.accent}55`,
                    background: 'linear-gradient(140deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    borderRadius: '0.8rem',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Icon size={18} style={{ color: platform.accent }} />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f5eed4' }}>{platform.name}</h4>
                    </div>
                    <span
                      style={{
                        color: platform.accent,
                        border: `1px solid ${platform.accent}66`,
                        borderRadius: '999px',
                        padding: '0.22rem 0.5rem',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                      }}
                    >
                      {platform.kind}
                    </span>
                  </div>

                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.93rem', color: '#ddd2b8' }}>{platform.description}</p>

                  <ul style={{ margin: '0.7rem auto 0 auto', width: 'fit-content', textAlign: 'left', paddingLeft: '1rem' }}>
                    {platform.highlights.map((item) => (
                      <li key={item} style={{ fontSize: '0.78rem', color: '#cdbf9f', marginBottom: '0.2rem' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      marginTop: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      background: `${platform.accent}1a`,
                      border: `1px solid ${platform.accent}77`,
                      color: platform.accent,
                    }}
                  >
                    Open {platform.name}
                    <ArrowRight size={14} />
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        <section
          style={{
            margin: '2rem auto 0 auto',
            width: '100%',
            maxWidth: '1150px',
            border: '1px solid rgba(212,175,55,0.28)',
            background: 'rgba(11,8,12,0.66)',
            borderRadius: '1rem',
            padding: '1.2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', color: '#d4af37' }}>
            <Newspaper size={18} />
            <h3 style={{ margin: 0, color: '#f5ecd2', fontWeight: 700, fontSize: '1.18rem' }}>Global Investment MarketWatch</h3>
          </div>
          <p style={{ margin: '0.45rem auto 0 auto', maxWidth: '920px', color: '#dfd4bb', fontSize: '0.96rem' }}>
            Real-time investment news stream across global equities, macro, commodities, FX, and digital assets.
          </p>

          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.7rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: '999px',
                padding: '0.28rem 0.6rem',
                fontSize: '0.72rem',
                color: '#dbcda9',
              }}
            >
              <RefreshCw size={12} />
              Updated {formatTimeAgo(newsUpdatedAt)}
            </span>
            {newsLoading && <span style={{ fontSize: '0.72rem', color: '#d4af37' }}>Syncing live feeds...</span>}
          </div>

          {newsError && (
            <p style={{ margin: '0.7rem 0 0 0', color: '#f0d998', fontSize: '0.78rem' }}>
              {newsError}
            </p>
          )}

          <div
            style={{
              marginTop: '1rem',
              display: 'grid',
              gap: '0.7rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {newsItems.map((item, index) => (
              <a
                key={`${item.title}-${index}`}
                href={item.link || '#'}
                target={item.link && item.link !== '#' ? '_blank' : undefined}
                rel={item.link && item.link !== '#' ? 'noreferrer' : undefined}
                style={{
                  textDecoration: 'none',
                  border: '1px solid rgba(212,175,55,0.18)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '0.8rem',
                  padding: '0.82rem',
                  textAlign: 'left',
                  color: '#efe6cf',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.55rem' }}>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#d4af37',
                      fontWeight: 700,
                    }}
                  >
                    {item.source}
                  </span>
                  <span style={{ fontSize: '0.67rem', color: '#bfaf8c' }}>{item.region}</span>
                </div>
                <p style={{ margin: '0.52rem 0 0 0', fontSize: '0.9rem', lineHeight: 1.36 }}>{item.title}</p>
                <p style={{ margin: '0.42rem 0 0 0', fontSize: '0.7rem', color: '#b4a584' }}>{formatTimeAgo(item.publishedAt)}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
