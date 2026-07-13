'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Activity, ArrowRight, BellRing, Clock3, Gift, Globe2, Lock, Megaphone, ShieldCheck, Target, TrendingUp, Users2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

type AccessCard = { label: string; value: string }
type RegionMetric = { region: string; hubs: number; members: number; growth: string; avgMinutes: number }
type GeneralMetric = { name: string; orgs: number; growth: string; risk: 'Low' | 'Watch'; spend: string; time: string }
type ActivityRow = { actor: string; action: string; duration: string; spend: string; city: string }
type OfferPreset = { name: string; value: string; label: string }
type SecurityTileData = { title: string; detail: string; status: 'Active' | 'Planned' }
type BackofficeOverview = {
  access_cards: AccessCard[]
  summary_metrics: {
    live_events: string
    avg_time: string
    global_hubs: string
    generals_monitored: string
    gift_offers_ready: string
    announcements: string
  }
  network_regions: RegionMetric[]
  general_oversight: GeneralMetric[]
  activity_feed: ActivityRow[]
  offer_presets: OfferPreset[]
  selected_offer_name: string
  banner_ideas: string[]
  selected_banner_text: string
  selected_banner_target: string
  security_tiles: SecurityTileData[]
}

const accessCards: AccessCard[] = [
  { label: 'Route', value: '/admin/backoffice' },
  { label: 'Scope', value: 'Network command center' },
  { label: 'Mode', value: 'Read + action panels' },
  { label: 'Protection', value: 'Copy deterrence enabled' },
]

const networkRegions: RegionMetric[] = [
  { region: 'Europe', hubs: 14, members: 1840, growth: '+18.2%', avgMinutes: 42 },
  { region: 'North America', hubs: 11, members: 1622, growth: '+12.4%', avgMinutes: 39 },
  { region: 'Middle East', hubs: 7, members: 840, growth: '+21.9%', avgMinutes: 47 },
  { region: 'Asia Pacific', hubs: 16, members: 2410, growth: '+26.1%', avgMinutes: 51 },
  { region: 'Africa', hubs: 9, members: 910, growth: '+16.7%', avgMinutes: 36 },
  { region: 'Latin America', hubs: 8, members: 760, growth: '+14.3%', avgMinutes: 33 },
]

const generalOversight: GeneralMetric[] = [
  { name: 'Northern Command', orgs: 18, growth: '+11.8%', risk: 'Low', spend: '€42,100', time: '38m' },
  { name: 'Pacific Command', orgs: 22, growth: '+17.6%', risk: 'Watch', spend: '€58,900', time: '44m' },
  { name: 'Central Command', orgs: 14, growth: '+8.4%', risk: 'Low', spend: '€31,250', time: '29m' },
  { name: 'Global Command', orgs: 31, growth: '+24.1%', risk: 'Watch', spend: '€96,480', time: '52m' },
]

const activityFeed: ActivityRow[] = [
  { actor: 'User 4821', action: 'opened analytics dashboard', duration: '12m', spend: '€0', city: 'Berlin' },
  { actor: 'User 7752', action: 'purchased gift certificate', duration: '7m', spend: '€250', city: 'Paris' },
  { actor: 'General Pacific Command', action: 'reviewed organization growth', duration: '31m', spend: '€0', city: 'Singapore' },
  { actor: 'User 9910', action: 'engaged promo banner', duration: '19m', spend: '€120', city: 'London' },
]

const offerPresets: OfferPreset[] = [
  { name: 'Starter Gift Offer', value: '€100 gift certificate + onboarding bonus', label: 'Launch' },
  { name: 'Growth Bundle', value: '€250 gift certificate + priority support', label: 'Promote' },
  { name: 'Executive Offer', value: '€500 gift certificate + campaign placement', label: 'Boost' },
]

const bannerIdeas = [
  'Flash offer: gift certificates available this week only.',
  'Global growth summit starts in 48 hours.',
  'North Star command review open for selected leaders.',
]

export default function BackofficePage() {
  const [selectedOffer, setSelectedOffer] = useState<OfferPreset>(offerPresets[1])
  const [bannerText, setBannerText] = useState(bannerIdeas[0])
  const [bannerTarget, setBannerTarget] = useState('All users')
  const [overview, setOverview] = useState<BackofficeOverview | null>(null)
  const [loadingOverview, setLoadingOverview] = useState(true)
  const [connectionMessage, setConnectionMessage] = useState('')

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await fetch(`${API}/api/backoffice/overview`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as BackofficeOverview
        setOverview(data)

        const matchedOffer = data.offer_presets.find((offer) => offer.name === data.selected_offer_name)
        if (matchedOffer) setSelectedOffer(matchedOffer)
        setBannerText(data.selected_banner_text || bannerIdeas[0])
        setBannerTarget(data.selected_banner_target || 'All users')
        setConnectionMessage('Live backend connected')
      } catch {
        setConnectionMessage('Backend unavailable - showing local fallback data')
      } finally {
        setLoadingOverview(false)
      }
    }

    void loadOverview()
  }, [])

  const resolvedAccessCards = overview?.access_cards ?? accessCards
  const resolvedRegions = overview?.network_regions ?? networkRegions
  const resolvedGenerals = overview?.general_oversight ?? generalOversight
  const resolvedActivity = overview?.activity_feed ?? activityFeed
  const resolvedOffers = overview?.offer_presets ?? offerPresets
  const resolvedBannerIdeas = overview?.banner_ideas ?? bannerIdeas
  const resolvedSecurityTiles = overview?.security_tiles ?? [
    { title: 'Copy deterrence', detail: 'Enabled across the app shell for text selection and copy/cut shortcuts.', status: 'Active' as const },
    { title: 'Session review', detail: 'Track logins, active duration, and action traces for admin review.', status: 'Planned' as const },
    { title: 'Banner approvals', detail: 'All promotions can be reviewed before publishing to the network.', status: 'Planned' as const },
    { title: 'General alerts', detail: 'Watch growth, risk, and organization drift for each command group.', status: 'Active' as const },
  ]

  const summary = overview?.summary_metrics ?? {
    live_events: '18,420',
    avg_time: '41m',
    global_hubs: '65',
    generals_monitored: '4',
    gift_offers_ready: '12',
    announcements: '3',
  }

  const selectOffer = async (offer: OfferPreset) => {
    setSelectedOffer(offer)
    try {
      await fetch(`${API}/api/backoffice/offers/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: offer.name }),
      })
    } catch {
      // Keep local selection even when backend is offline.
    }
  }

  const publishBanner = async () => {
    try {
      const res = await fetch(`${API}/api/backoffice/banners/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bannerText, target: bannerTarget }),
      })
      if (res.ok) {
        setConnectionMessage('Banner published to backend')
      } else {
        setConnectionMessage('Banner publish failed on backend')
      }
    } catch {
      setConnectionMessage('Backend unavailable - banner kept locally')
    }
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> Backoffice Command Center
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Network Intelligence & Operations</h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.35rem', maxWidth: '760px' }}>
            Track network behavior, global growth, general oversight, gift certificate offers, announcements, and hardening controls from one workspace.
          </p>
          <p style={{ fontSize: '0.8rem', color: connectionMessage.includes('unavailable') ? '#f59e0b' : '#10b981', marginTop: '0.45rem' }}>
            {loadingOverview ? 'Connecting to backend...' : connectionMessage}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ textDecoration: 'none', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)', padding: '0.7rem 1rem', borderRadius: '0.7rem', background: 'rgba(212,175,55,0.08)', fontWeight: 700 }}>
            Admin Dashboard
          </Link>
          <Link href="/admin/generals" style={{ textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.7rem 1rem', borderRadius: '0.7rem', background: 'rgba(255,255,255,0.03)', fontWeight: 600 }}>
            General Oversight
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {resolvedAccessCards.map((card) => (
          <div key={card.label} style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(26,15,21,0.85))', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '0.9rem', padding: '1rem 1.1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</div>
            <div style={{ marginTop: '0.45rem', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <MetricCard icon={<Activity size={18} />} label="Live Events" value={summary.live_events} sub="clicks, logins, actions" />
        <MetricCard icon={<Clock3 size={18} />} label="Avg. Time on System" value={summary.avg_time} sub="per active member" color="#3b82f6" />
        <MetricCard icon={<Globe2 size={18} />} label="Global Hubs" value={summary.global_hubs} sub="active network cities" color="#10b981" />
        <MetricCard icon={<Users2 size={18} />} label="Generals Monitored" value={summary.generals_monitored} sub="growth + risk watch" color="#8b5cf6" />
        <MetricCard icon={<Gift size={18} />} label="Gift Offers Ready" value={summary.gift_offers_ready} sub="certificate offers" color="#f59e0b" />
        <MetricCard icon={<BellRing size={18} />} label="Announcements" value={summary.announcements} sub="scheduled banners" color="#ef4444" />
      </div>

      <SectionCard title="Network Activity & Time on System" icon={<TrendingUp size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '1rem' }} className="max-lg:grid-cols-1">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ textAlign: 'left', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Actor</th>
                  <th style={{ textAlign: 'left', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Action</th>
                  <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Session</th>
                  <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Spend</th>
                  <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>City</th>
                </tr>
              </thead>
              <tbody>
                {resolvedActivity.map((row) => (
                  <tr key={row.actor + row.action} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 0.4rem', color: '#fff' }}>{row.actor}</td>
                    <td style={{ padding: '0.75rem 0.4rem', color: 'rgba(255,255,255,0.72)' }}>{row.action}</td>
                    <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: '#d4af37', fontWeight: 700 }}>{row.duration}</td>
                    <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: '#10b981' }}>{row.spend}</td>
                    <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)' }}>{row.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '0.85rem', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d4af37', fontWeight: 700, marginBottom: '0.8rem' }}>
              <Target size={18} /> Monitoring Summary
            </div>
            <ul style={{ margin: 0, paddingLeft: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, fontSize: '0.86rem' }}>
              <li>Page visits, session time, and spend tracking are surfaced in one feed.</li>
              <li>Regional growth can be traced by city and by command tier.</li>
              <li>Use this panel as the operating layer for event review and escalation.</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Global Network Growth" icon={<Globe2 size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {resolvedRegions.map((region) => (
            <div key={region.region} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>{region.region}</div>
                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>{region.growth}</div>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.35rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                <div>Hubs: <strong style={{ color: '#fff' }}>{region.hubs}</strong></div>
                <div>Members: <strong style={{ color: '#fff' }}>{region.members.toLocaleString()}</strong></div>
                <div>Avg. time: <strong style={{ color: '#fff' }}>{region.avgMinutes}m</strong></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="General Oversight" icon={<Users2 size={18} />}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ color: 'rgba(255,255,255,0.45)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '0.8rem 0.4rem', fontWeight: 600 }}>General</th>
                <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Organizations</th>
                <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Growth</th>
                <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Risk</th>
                <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Spend</th>
                <th style={{ textAlign: 'right', padding: '0.8rem 0.4rem', fontWeight: 600 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {resolvedGenerals.map((general) => (
                <tr key={general.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.4rem', color: '#fff', fontWeight: 700 }}>{general.name}</td>
                  <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: 'rgba(255,255,255,0.72)' }}>{general.orgs}</td>
                  <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>{general.growth}</td>
                  <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: general.risk === 'Watch' ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{general.risk}</td>
                  <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: '#d4af37' }}>{general.spend}</td>
                  <td style={{ padding: '0.75rem 0.4rem', textAlign: 'right', color: 'rgba(255,255,255,0.55)' }}>{general.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="max-lg:grid-cols-1">
        <SectionCard title="Gift Certificate Offers" icon={<Gift size={18} />}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {resolvedOffers.map((offer) => (
              <button
                key={offer.name}
                onClick={() => void selectOffer(offer)}
                style={{
                  background: selectedOffer.name === offer.name ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedOffer.name === offer.name ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '0.8rem',
                  padding: '0.9rem 1rem',
                  textAlign: 'left',
                  color: '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{offer.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{offer.value}</div>
                  </div>
                  <div style={{ color: '#d4af37', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{offer.label}</div>
                </div>
              </button>
            ))}

            <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '0.8rem', padding: '1rem', marginTop: '0.5rem' }}>
              <div style={{ color: '#d4af37', fontWeight: 700, marginBottom: '0.35rem' }}>Selected Offer</div>
              <div style={{ color: '#fff', fontWeight: 700 }}>{selectedOffer.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.86rem', marginTop: '0.25rem' }}>{selectedOffer.value}</div>
              <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link href="/admin/contracts" style={{ textDecoration: 'none', color: '#1a0f15', background: '#d4af37', padding: '0.55rem 0.85rem', borderRadius: '0.55rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Create contract <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Promotions & Banners" icon={<Megaphone size={18} />}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Announcement text</label>
            <textarea
              value={bannerText}
              onChange={(event) => setBannerText(event.target.value)}
              style={{ width: '100%', minHeight: '110px', resize: 'vertical', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8rem', padding: '0.9rem', outline: 'none' }}
            />
            <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target audience</label>
            <select value={bannerTarget} onChange={(event) => setBannerTarget(event.target.value)} style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8rem', padding: '0.8rem', outline: 'none' }}>
              <option>All users</option>
              <option>Active members</option>
              <option>Generals only</option>
              <option>Top 10% network leaders</option>
            </select>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.8rem', padding: '0.9rem' }}>
              <div style={{ color: '#d4af37', fontWeight: 700, marginBottom: '0.3rem' }}>Banner preview</div>
              <div style={{ color: '#fff', lineHeight: 1.5 }}>{bannerText}</div>
              <div style={{ marginTop: '0.4rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Audience: {bannerTarget}</div>
            </div>
            <button
              onClick={() => void publishBanner()}
              style={{ background: '#d4af37', color: '#1a0f15', border: 'none', borderRadius: '0.65rem', padding: '0.65rem 0.9rem', fontWeight: 800, width: 'fit-content', cursor: 'pointer' }}
            >
              Publish Announcement
            </button>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {resolvedBannerIdeas.map((idea) => (
                <button key={idea} onClick={() => setBannerText(idea)} style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '999px', padding: '0.45rem 0.75rem', fontSize: '0.78rem', fontWeight: 700 }}>
                  Use preset
                </button>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Security & Hardening" icon={<Lock size={18} />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
          {resolvedSecurityTiles.map((tile) => (
            <SecurityTile key={tile.title} title={tile.title} detail={tile.detail} status={tile.status} />
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function MetricCard({ icon, label, value, sub, color = '#d4af37' }: { icon: React.ReactNode; label: string; value: string; sub: string; color?: string }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(26,15,21,0.85))', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '0.9rem', padding: '1rem 1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1, marginTop: '0.5rem' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.35rem' }}>{sub}</div>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#d4af37', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

function SecurityTile({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '0.85rem', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, color: '#fff' }}>{title}</div>
        <div style={{ color: status === 'Active' ? '#10b981' : '#f59e0b', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{status}</div>
      </div>
      <div style={{ marginTop: '0.45rem', color: 'rgba(255,255,255,0.66)', fontSize: '0.85rem', lineHeight: 1.55 }}>{detail}</div>
    </div>
  )
}