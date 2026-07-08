'use client'
import { useEffect, useState } from 'react'

const API = 'http://localhost:3333/api'

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'apps' | 'geography' | 'services' | 'investments'>('overview')

  useEffect(() => {
    fetch(`${API}/analytics/dashboard`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading analytics...</div>

  const display = data ?? {
    members: { total: 0, active: 0 },
    app_usage: { total_events: 0, by_app: [] },
    service_interests: { services: [] },
    member_growth_by_geo: { by_country: [], by_continent: [] },
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Analytics Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          Monitor app usage, member growth, and service adoption
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Members', value: display.members.total, color: '#fff' },
          { label: 'Active Members', value: display.members.active, color: '#3b82f6' },
          { label: 'App Events (30d)', value: display.app_usage.total_events ?? 0, color: '#d4af37' },
          { label: 'Services Tracked', value: display.service_interests.services?.length ?? 0, color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {(['overview', 'apps', 'geography', 'services', 'investments'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap',
            color: tab === t ? '#d4af37' : 'rgba(255,255,255,0.45)',
            borderBottom: `2px solid ${tab === t ? '#d4af37' : 'transparent'}`,
            fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && <OverviewTab data={display} />}
      {tab === 'apps' && <AppsTab data={display} />}
      {tab === 'geography' && <GeographyTab data={display} />}
      {tab === 'services' && <ServicesTab data={display} />}
      {tab === 'investments' && <InvestmentsTab />}
    </div>
  )
}

function OverviewTab({ data }: { data: any }) {
  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>Member Summary</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{data.members.total}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Total Registered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3b82f6' }}>{data.members.active}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Active</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#d4af37' }}>
              {((data.members.active / data.members.total) * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Active Rate</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>Top Countries</div>
        {data.top_countries?.slice(0, 5).map((c: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{i + 1}. {c.country}</span>
            <span style={{ fontWeight: 700, color: '#d4af37' }}>{c.count} members</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AppsTab({ data }: { data: any }) {
  const appData = data.app_usage?.by_app ?? []
  const total = appData.reduce((sum: number, a: any) => sum + a.count, 0) || 1

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>App Usage (30 days)</div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Pie chart simulation */}
        <div style={{ minWidth: '200px', height: '200px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#d4af37' }}>{total}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Total Events</div>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          {appData.slice(0, 10).map((a: any, i: number) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{a.app_slug}</span>
                <span style={{ fontWeight: 700, color: '#d4af37' }}>{a.count}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(a.count / total) * 100}%`, background: '#d4af37' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GeographyTab({ data }: { data: any }) {
  const continents = data.top_continents ?? []
  const countries = data.top_countries ?? []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>Members by Continent</div>
        {continents.map((c: any, i: number) => (
          <div key={i} style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem' }}>{c.continent}</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{c.count}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(c.count / Math.max(...continents.map((x: any) => x.count))) * 100}%`, background: '#10b981' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>Top Countries</div>
        {countries.slice(0, 10).map((c: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
            <span>{c.country}</span>
            <span style={{ fontWeight: 700, color: '#3b82f6' }}>{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesTab({ data }: { data: any }) {
  const services = data.service_interests?.services ?? []

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>Member Service Interests</div>
      {services.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No service interest data yet</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {services.map((s: any, i: number) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.25rem' }}>{s.service.toUpperCase()}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{s.count} interested</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>↗ {s.avg_interest}/5</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InvestmentsTab() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/analytics/investments/global-stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const display = stats ?? { total_funds: 0, active: 0, by_fund_type: [] }

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Funds', value: display.total_funds, color: '#fff' },
          { label: 'Active Funds', value: display.active, color: '#10b981' },
          { label: 'Matured', value: display.matured ?? 0, color: '#f59e0b' },
          { label: 'Total Invested', value: `€${display.total_invested_eur?.toFixed(2)}`, color: '#d4af37' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', color: 'rgba(255,255,255,0.6)' }}>Funds by Type</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {display.by_fund_type?.map((t: any, i: number) => (
            <div key={i} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '0.75rem', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {t.fund_type.replace('LONG_TERM_', '')}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.25rem' }}>{t.count}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>€{(t.invested_eur).toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
