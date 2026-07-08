'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const API = 'http://localhost:3333/api'

const APPRECIATION_SCHEDULE: Record<number, number> = {
  1: 11.834, 5: 18.23, 11: 20.456, 12: 36.789, 15: 65.36737,
  16: 77.6828, 18: 23.567, 22: 34.7734, 23: 56.9345, 24: 34.578,
}

// Animated star SVG component
function GlowingStar({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))' }}>
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <polygon points="50,10 61,40 93,40 68,60 79,90 50,70 21,90 32,60 7,40 39,40" fill="url(#starGrad)" />
    </svg>
  )
}

export default function NorthStarPage() {
  const [position, setPosition] = useState<any>(null)
  const [marketStats, setMarketStats] = useState<any>(null)
  const [currentPrice, setCurrentPrice] = useState(0.85)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'buy' | 'freeze' | 'trade' | 'schedule'>('overview')
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [buyAmount, setBuyAmount] = useState(1)

  const userId = 'demo-user-1'

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics/north-star/user/${userId}/position`).then(r => r.json()),
      fetch(`${API}/analytics/north-star/market-stats`).then(r => r.json()),
      fetch(`${API}/analytics/north-star/token-price`).then(r => r.json()),
    ])
      .then(([pos, stats, price]) => {
        setPosition(pos || {})
        setMarketStats(stats || {})
        setCurrentPrice(price || 0.85)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  const handleBuy = async () => {
    if (buyAmount <= 0) return
    try {
      const res = await fetch(`${API}/analytics/north-star/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          quantity_tokens: String(Math.floor(buyAmount * 1e18)),
          price_per_token_eur: currentPrice,
        }),
      })
      const result = await res.json()
      setPosition(result.position)
      setShowBuyModal(false)
      setBuyAmount(1)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFreeze = async (freezeNum: 1 | 2) => {
    try {
      const res = await fetch(`${API}/analytics/north-star/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, freeze_number: freezeNum }),
      })
      const updated = await res.json()
      setPosition(updated)
    } catch (e) {
      console.error(e)
    }
  }

  const getSchedulePrice = (month: number) => {
    let price = 0.85
    for (let m = 1; m <= month; m++) {
      if (APPRECIATION_SCHEDULE[m]) {
        price = price * (1 + APPRECIATION_SCHEDULE[m] / 100)
      }
    }
    return price
  }

  const display = {
    tokens_owned: Number(position?.tokens_owned ?? 0),
    current_value_eur: position?.current_value_eur ?? 0,
    unrealized_gain_eur: position?.unrealized_gain_eur ?? 0,
    roi_percent: position?.roi_percent ?? 0,
  }

  return (
    <div style={{ background: '#0d0810', color: '#fff', minHeight: '100vh' }}>
      {/* Hero Section with Branding */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.5) 100%)',
        borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(59, 130, 246, 0.1)', border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px', filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))',
            }}>
              <GlowingStar size={60} />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                NORTH STAR
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'rgba(147, 197, 253, 0.8)', marginTop: '0.25rem', letterSpacing: '0.1em', fontWeight: 600 }}>
                I AM ALWAYS WITH YOU
              </p>
            </div>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { icon: '⚡', label: 'AI POWERED' },
              { icon: '👤', label: 'YOUR COMPANION' },
              { icon: '🛡️', label: 'TRUSTED & SECURE' },
              { icon: '❤️', label: 'ALWAYS WITH YOU' },
            ].map(p => (
              <div key={p.label} style={{
                background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)',
                borderRadius: '8px', padding: '0.75rem', textAlign: 'center', fontSize: '0.7rem',
              }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{p.icon}</div>
                <div style={{ color: 'rgba(147, 197, 253, 0.7)', letterSpacing: '0.05em', fontWeight: 600 }}>{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem', color: '#fff', minHeight: 'calc(100vh - 200px)' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Current Price', value: `€${currentPrice.toFixed(2)}`, color: '#3b82f6', icon: '💰' },
          { label: 'Your Holdings', value: `${display.tokens_owned.toFixed(2)}`, color: '#60a5fa', icon: '⭐' },
          { label: 'Portfolio Value', value: `€${display.current_value_eur.toFixed(2)}`, color: '#10b981', icon: '📈' },
          { label: 'Unrealized Gain', value: `€${display.unrealized_gain_eur.toFixed(2)}`, color: display.unrealized_gain_eur >= 0 ? '#10b981' : '#ef4444', icon: '📊' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)',
            border: `1px solid ${s.color}40`, borderRadius: '0.875rem', padding: '1.25rem',
            boxShadow: `inset 0 0 20px ${s.color}08, 0 0 1px ${s.color}20`,
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {(['overview', 'buy', 'freeze', 'trade', 'schedule'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap',
            color: tab === t ? '#d4af37' : 'rgba(255,255,255,0.45)',
            borderBottom: `2px solid ${tab === t ? '#d4af37' : 'transparent'}`,
            fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && <OverviewTab position={position} marketStats={marketStats} currentPrice={currentPrice} display={display} />}
      {tab === 'buy' && <BuyTab currentPrice={currentPrice} onOpen={() => setShowBuyModal(true)} />}
      {tab === 'freeze' && <FreezeTab position={position} onFreeze={handleFreeze} />}
      {tab === 'trade' && <TradeTab />}
      {tab === 'schedule' && <ScheduleTab getPrice={getSchedulePrice} currentPrice={currentPrice} />}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }} onClick={() => setShowBuyModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.5) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.3)', borderRadius: '1.25rem', padding: '2.5rem',
            maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(59, 130, 246, 0.2)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <GlowingStar size={40} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Buy North Star Tokens</h2>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(147, 197, 253, 0.6)', letterSpacing: '0.05em' }}>CURRENT MARKET PRICE</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', marginTop: '0.5rem' }}>
                €{currentPrice.toFixed(2)}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'rgba(147, 197, 253, 0.8)' }}>Quantity</label>
              <input type="number" min="0.01" step="0.1" value={buyAmount}
                onChange={e => setBuyAmount(Number(e.target.value))}
                style={{
                  width: '100%', padding: '0.875rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.625rem', color: '#fff', fontSize: '1rem', fontWeight: 600,
                }} />
              <div style={{ fontSize: '0.75rem', color: 'rgba(147, 197, 253, 0.5)', marginTop: '0.5rem', fontWeight: 600 }}>
                Total cost: <span style={{ color: 'rgba(147, 197, 253, 0.8)' }}>€{(buyAmount * currentPrice).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.875rem' }}>
              <button onClick={handleBuy} style={{
                flex: 1, background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', color: '#fff', padding: '0.875rem', borderRadius: '0.625rem',
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s',
              }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.6)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                🚀 Confirm Purchase
              </button>
              <button onClick={() => setShowBuyModal(false)} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.875rem', borderRadius: '0.625rem',
                border: '1px solid rgba(59, 130, 246, 0.2)', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OverviewTab({ position, marketStats, currentPrice, display }: any) {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(147, 197, 253, 0.8)' }}>Your Position</div>
        {!position?.tokens_owned || position.tokens_owned === 0 ? (
          <div style={{ color: 'rgba(147, 197, 253, 0.4)', textAlign: 'center', padding: '2rem' }}>
            <GlowingStar size={48} />
            <p style={{ marginTop: '1rem' }}>No North Star tokens yet. Buy some to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Holdings', value: display.tokens_owned.toFixed(4), unit: 'tokens', icon: '⭐', color: '#3b82f6' },
              { label: 'Avg Cost', value: position.average_cost_per_token_eur?.toFixed(2), unit: 'EUR/token', icon: '💰', color: '#10b981' },
              { label: 'Return', value: display.roi_percent?.toFixed(1), unit: '%', icon: '📈', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(59, 130, 246, 0.1)', border: `1px solid ${s.color}30`, borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(147, 197, 253, 0.5)', marginBottom: '0.25rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, marginBottom: '0.25rem' }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(147, 197, 253, 0.4)' }}>{s.unit}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(147, 197, 253, 0.8)' }}>🌍 Market Statistics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Holders', value: marketStats?.total_holders ?? 0, icon: '👥' },
            { label: 'Total Holdings', value: `${((marketStats?.total_tokens_owned ?? 0)).toFixed(0)}`, icon: '💎' },
            { label: 'Market Cap', value: marketStats?.total_market_cap_eur ?? '€0', icon: '📊' },
            { label: 'Trades', value: marketStats?.completed_trades ?? 0, icon: '🔄' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(147, 197, 253, 0.4)', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>MARKET</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BuyTab({ currentPrice, onOpen }: any) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <GlowingStar size={80} />
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(147, 197, 253, 0.6)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Current Market Price</div>
      <div style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '1.5rem', lineHeight: 1 }}>
        €{currentPrice.toFixed(2)}
      </div>
      <p style={{ color: 'rgba(147, 197, 253, 0.6)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
        Invest in our flagship cryptocurrency token with guaranteed monthly appreciation up to 34.6% by month 24.
      </p>
      <button onClick={onOpen} style={{
        background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', padding: '1rem 2.5rem', borderRadius: '0.75rem',
        border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em',
        boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s',
      }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(59, 130, 246, 0.7)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.4)'}>
        🚀 Buy Tokens Now
      </button>
    </div>
  )
}

function FreezeTab({ position, onFreeze }: any) {
  const freezes = [
    { num: 1 as const, active: position?.freeze_1_active, locked: position?.freeze_1_locked_price_eur, expires: position?.freeze_1_expires_at },
    { num: 2 as const, active: position?.freeze_2_active, locked: position?.freeze_2_locked_price_eur, expires: position?.freeze_2_expires_at },
  ]

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {freezes.map(f => (
        <div key={f.num} style={{
          background: f.active ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.4))' : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(15, 23, 42, 0.4))',
          border: `1px solid ${f.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          borderRadius: '1rem', padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(147, 197, 253, 0.8)' }}>
              ❄️ FREEZE #{f.num}
            </div>
            <span style={{
              background: f.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
              color: f.active ? '#10b981' : '#6b7280',
              padding: '0.35rem 0.875rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {f.active ? '🔒 ACTIVE' : '🔓 AVAILABLE'}
            </span>
          </div>

          {f.active ? (
            <>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(16, 185, 129, 0.6)', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>Locked Price</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>€{f.locked?.toFixed(2)}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(16, 185, 129, 0.5)' }}>
                  ⏱️ Expires: {f.expires ? new Date(f.expires).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <button disabled style={{
                width: '100%', background: 'rgba(16, 185, 129, 0.15)', color: 'rgba(16, 185, 129, 0.5)', padding: '0.875rem', borderRadius: '0.625rem',
                border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'not-allowed', fontWeight: 700, fontSize: '0.95rem',
              }}>✓ Freeze Active</button>
            </>
          ) : (
            <button onClick={() => onFreeze(f.num)} style={{
              width: '100%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', padding: '0.875rem', borderRadius: '0.625rem',
              border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(59, 130, 246, 0.6)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)'}>
              ❄️ Activate Freeze (2 months)
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function TradeTab() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(15, 23, 42, 0.4))',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(147, 197, 253, 0.8)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>P2P TRADING OPENS AT MONTH 24</div>
      <p style={{ color: 'rgba(147, 197, 253, 0.5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
        After 24 months of platform operation, member-to-member token trading will be enabled. All participants will be able to freely exchange tokens at market rates. Come back in {(24 - 1)} months!
      </p>
    </div>
  )
}

function ScheduleTab({ getPrice, currentPrice }: any) {
  const months = [1, 5, 11, 12, 15, 16, 18, 22, 23, 24]
  const maxPrice = Math.max(...months.map(m => getPrice(m)))

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '1rem', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(147, 197, 253, 0.8)' }}>📅 24-Month Appreciation Schedule</div>
      
      {/* Price chart simulation */}
      <div style={{ marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '150px', gap: '0.5rem' }}>
          {months.map(m => {
            const price = getPrice(m)
            const percentage = (price / maxPrice) * 100
            const appreciation = ((price / 0.85 - 1) * 100).toFixed(1)
            return (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(147, 197, 253, 0.5)', fontWeight: 600 }}>+{appreciation}%</div>
                <div style={{
                  width: '100%', height: `${percentage}%`, background: 'linear-gradient(180deg, #3b82f6, #60a5fa)',
                  borderRadius: '0.25rem', transition: 'all 0.3s', cursor: 'pointer',
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
                }} onMouseEnter={e => e.currentTarget.style.filter = 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.7))'} onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'} />
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa' }}>M{m}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
        {months.map(m => {
          const price = getPrice(m)
          const appreciation = ((price / 0.85 - 1) * 100).toFixed(1)
          return (
            <div key={m} style={{
              background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.625rem',
              padding: '0.875rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(147, 197, 253, 0.5)', marginBottom: '0.3rem', letterSpacing: '0.05em', fontWeight: 600 }}>MONTH {m}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.25rem' }}>€{price.toFixed(2)}</div>
              <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>↗ +{appreciation}%</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.625rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'rgba(16, 185, 129, 0.8)', fontWeight: 600 }}>
          ✓ P2P trading unlocks at Month 24
        </div>
      </div>
    </div>
  )
}
