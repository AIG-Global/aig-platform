'use client'
import { useEffect, useState } from 'react'

const API = 'http://localhost:3333'

function StatCard({ label, value, sub, color = '#d4af37' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(26,15,21,0.8) 100%)',
      border: '1px solid rgba(212,175,55,0.18)',
      borderRadius: '0.875rem',
      padding: '1.25rem 1.5rem',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.35rem' }}>{sub}</div>}
    </div>
  )
}

function TierBar({ data }: { data: Record<string, number> }) {
  const tiers = ['FREE', 'STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']
  const colors: Record<string, string> = {
    FREE: '#6b7280', STARTER: '#3b82f6', PROFESSIONAL: '#8b5cf6', BUSINESS: '#d4af37', ENTERPRISE: '#ef4444',
  }
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Members by Tier</div>
      <div style={{ display: 'flex', gap: '0.25rem', height: '1rem', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
        {tiers.map(t => (
          <div key={t} style={{ flex: data[t] ?? 0, background: colors[t], minWidth: data[t] ? '4px' : 0 }} title={`${t}: ${data[t] ?? 0}`} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {tiers.map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[t] }} />
            {t}: <strong style={{ color: '#fff' }}>{data[t] ?? 0}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/generals/admin/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError('API offline — showing placeholder data'))
      .finally(() => setLoading(false))
  }, [])

  // Placeholder for when API is offline
  const display = stats ?? {
    users: { total: 0, active_members: 0 },
    generals: { total: 0 },
    pool: { total_income_eur: 0, total_pool_eur: 0, transaction_count: 0 },
    pending_contracts: 0,
    recent_appointments: [],
    members_by_tier: {},
  }

  const formatEur = (cents: number) => `€${(cents / 100).toLocaleString('fi-FI', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: 0 }}>Business Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        {error && <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#fca5a5' }}>{error}</div>}
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Loading...</div>
      ) : (
        <>
          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <StatCard label="Total Members" value={display.users?.total ?? 0} sub="Active accounts" />
            <StatCard label="Active Subscriptions" value={display.users?.active_members ?? 0} sub="Paying members" color="#3b82f6" />
            <StatCard label="Active Generals" value={display.generals?.total ?? 0} sub="Pool earners" color="#8b5cf6" />
            <StatCard label="Total Income" value={formatEur(display.pool?.total_income_eur ?? 0)} sub="All time" color="#10b981" />
            <StatCard label="Management Pool" value={formatEur(display.pool?.total_pool_eur ?? 0)} sub="20% of income" color="#d4af37" />
            <StatCard label="Pending Contracts" value={display.pending_contracts ?? 0} sub="Awaiting signatures" color="#f59e0b" />
          </div>

          {/* Tier breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <TierBar data={display.members_by_tier ?? {}} />
          </div>

          {/* Recent appointments */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Recent "Sharing is Caring" Appointments
            </div>
            {(!display.recent_appointments || display.recent_appointments.length === 0) ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '0.5rem 0' }}>No appointments yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 500 }}>Giver</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 500 }}>Receiver</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 500 }}>% Given</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 500 }}>Status</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 500 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {display.recent_appointments.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)' }}>
                      <td style={{ padding: '0.6rem 0' }}>{a.giver_user?.first_name} {a.giver_user?.last_name}</td>
                      <td style={{ padding: '0.6rem 0' }}>{a.receiver_user?.first_name} {a.receiver_user?.last_name}</td>
                      <td style={{ padding: '0.6rem 0', textAlign: 'right', color: '#d4af37', fontWeight: 600 }}>{a.percent_given}%</td>
                      <td style={{ padding: '0.6rem 0', textAlign: 'right' }}>
                        <StatusBadge status={a.status} />
                      </td>
                      <td style={{ padding: '0.6rem 0', textAlign: 'right', color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, [string, string]> = {
    ACTIVE: ['#10b981', 'rgba(16,185,129,0.1)'],
    PENDING_CONTRACT: ['#f59e0b', 'rgba(245,158,11,0.1)'],
    CONTRACT_SIGNED: ['#3b82f6', 'rgba(59,130,246,0.1)'],
    REVOKE_REQUESTED: ['#ef4444', 'rgba(239,68,68,0.1)'],
    REVOKED: ['#6b7280', 'rgba(107,114,128,0.1)'],
    REJECTED: ['#ef4444', 'rgba(239,68,68,0.1)'],
  }
  const [color, bg] = colors[status] ?? ['#9ca3af', 'rgba(156,163,175,0.1)']
  return (
    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: bg, color, fontWeight: 600 }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
