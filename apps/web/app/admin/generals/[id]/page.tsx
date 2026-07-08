'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const API = 'http://localhost:3333'

export default function GeneralDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [general, setGeneral] = useState<any>(null)
  const [org, setOrg] = useState<{ tree: any; geoPoints: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [apptForm, setApptForm] = useState({ receiver_user_id: '', percent_to_give: '' })
  const [apptError, setApptError] = useState('')
  const [apptSuccess, setApptSuccess] = useState('')
  const [tab, setTab] = useState<'overview' | 'org' | 'map' | 'appointments'>('overview')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/generals/${id}`).then(r => r.json()).catch(() => null),
      fetch(`${API}/generals/${id}/organization`).then(r => r.json()).catch(() => null),
    ]).then(([g, o]) => {
      setGeneral(g)
      setOrg(o)
    }).finally(() => setLoading(false))
  }, [id])

  async function handleAppoint(e: React.FormEvent) {
    e.preventDefault()
    setApptError(''); setApptSuccess('')
    try {
      const res = await fetch(`${API}/generals/${id}/appoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver_user_id: apptForm.receiver_user_id, percent_to_give: Number(apptForm.percent_to_give) }),
      })
      if (!res.ok) { const err = await res.json(); setApptError(err.message ?? 'Error'); return }
      const appt = await res.json()
      setApptSuccess(`Appointment created! Contract ID: ${appt.contract?.id}. Both parties must sign.`)
      setApptForm({ receiver_user_id: '', percent_to_give: '' })
    } catch {
      setApptError('API unavailable')
    }
  }

  if (loading) return <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
  if (!general || general.error) return (
    <div style={{ padding: '2rem', color: '#fca5a5' }}>
      General not found. <Link href="/admin/generals" style={{ color: '#d4af37' }}>← Back</Link>
    </div>
  )

  const effectivePct = general.allocated_percent - general.distributed_percent
  const formatEur = (cents: number) => `€${(cents / 100).toLocaleString('fi-FI', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/admin/generals" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>← All Generals</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #8b6914)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#1a0f15' }}>
            {general.user?.first_name?.[0]}{general.user?.last_name?.[0]}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{general.user?.first_name} {general.user?.last_name}</h1>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{general.user?.email}</div>
          </div>
          <span style={{ marginLeft: 'auto', padding: '0.3rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>★ GENERAL</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Pool Allocation', value: `${general.allocated_percent}%`, color: '#d4af37' },
          { label: 'Given Away', value: `${general.distributed_percent}%`, color: '#f59e0b' },
          { label: 'Effective %', value: `${effectivePct.toFixed(1)}%`, color: '#10b981' },
          { label: 'Total Earned', value: formatEur(general.total_earned_eur ?? 0), color: '#3b82f6' },
          { label: 'Pending', value: formatEur(general.pending_earnings_eur ?? 0), color: '#8b5cf6' },
          { label: 'Appointees', value: general.appointees?.length ?? 0, color: '#6b7280' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* String capacity bar */}
      <StringCapacityBar allocatedPercent={general.allocated_percent} distributedPercent={general.distributed_percent} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
        {(['overview', 'org', 'map', 'appointments'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.65rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem',
            color: tab === t ? '#d4af37' : 'rgba(255,255,255,0.45)',
            borderBottom: `2px solid ${tab === t ? '#d4af37' : 'transparent'}`,
            fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize',
          }}>{t === 'org' ? 'Organization' : t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div>
          <AppointForm form={apptForm} setForm={setApptForm} onSubmit={handleAppoint} error={apptError} success={apptSuccess} effectivePct={effectivePct} />
          <PoolEarnings earnings={general.pool_earnings ?? []} formatEur={formatEur} />
        </div>
      )}

      {tab === 'org' && <OrgTree tree={org?.tree} />}

      {tab === 'map' && <GeoMap points={org?.geoPoints ?? []} />}

      {tab === 'appointments' && (
        <AppointmentsList appointments={general.appointments_given ?? []} />
      )}
    </div>
  )
}

function StringCapacityBar({ allocatedPercent, distributedPercent }: { allocatedPercent: number; distributedPercent: number }) {
  const effectivePct = allocatedPercent - distributedPercent
  const usedPct = (allocatedPercent / 20) * 100
  const remainingPct = 20 - allocatedPercent

  return (
    <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '0.75rem', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>String Capacity (max 20% pool)</span>
        <span style={{ fontSize: '0.75rem', color: remainingPct <= 2 ? '#ef4444' : '#d4af37', fontWeight: 700 }}>{remainingPct.toFixed(1)}% remaining to give</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ height: '100%', width: `${(distributedPercent / 20) * 100}%`, background: '#f59e0b' }} title={`Given away: ${distributedPercent}%`} />
        <div style={{ height: '100%', width: `${(effectivePct / 20) * 100}%`, background: '#d4af37' }} title={`Effective: ${effectivePct}%`} />
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4af37' }} />
          Effective {effectivePct.toFixed(1)}%
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
          Given away {distributedPercent}%
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          Available {remainingPct.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function AppointForm({ form, setForm, onSubmit, error, success, effectivePct }: any) {
  return (
    <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
      <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.95rem', color: '#d4af37' }}>
        ★ Sharing is Caring — Appoint Sub-General
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: '0 0 1rem', lineHeight: 1.5 }}>
        Share part of your effective {effectivePct.toFixed(1)}% pool allocation with someone in your organization. Both parties must sign an AIG-Secure-Sign contract. This cannot be undone without admin approval.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>Receiver User ID</label>
          <input
            value={form.receiver_user_id} onChange={(e: any) => setForm((f: any) => ({ ...f, receiver_user_id: e.target.value }))}
            placeholder="User's cuid..."
            required
            style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', width: '260px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>% to Share (max {effectivePct.toFixed(1)})</label>
          <input
            type="number" min="0.1" max={effectivePct} step="0.1"
            value={form.percent_to_give} onChange={(e: any) => setForm((f: any) => ({ ...f, percent_to_give: e.target.value }))}
            required
            style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', width: '120px' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1.25rem', background: '#d4af37', color: '#1a0f15', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
          Share & Generate Contract
        </button>
      </form>
      {error && <div style={{ marginTop: '0.5rem', color: '#fca5a5', fontSize: '0.8rem' }}>{error}</div>}
      {success && <div style={{ marginTop: '0.5rem', color: '#86efac', fontSize: '0.8rem' }}>{success}</div>}
    </div>
  )
}

function PoolEarnings({ earnings, formatEur }: { earnings: any[]; formatEur: (n: number) => string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Pool Earnings History</div>
      {earnings.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '1rem 0' }}>No earnings recorded yet</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Source', 'Period', 'Percent', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {earnings.slice(0, 15).map((e: any) => (
              <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }}>
                <td style={{ padding: '0.5rem 0' }}>{e.transaction?.source_type ?? '—'}</td>
                <td style={{ padding: '0.5rem 0' }}>{e.transaction?.period_year}/{String(e.transaction?.period_month).padStart(2, '0')}</td>
                <td style={{ padding: '0.5rem 0', color: '#d4af37' }}>{e.effective_percent}%</td>
                <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>{formatEur(Number(e.amount_eur))}</td>
                <td style={{ padding: '0.5rem 0' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', background: e.status === 'PAID' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: e.status === 'PAID' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function OrgTree({ tree }: { tree: any }) {
  if (!tree) return <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>No organization data</div>

  function Node({ node, depth = 0 }: { node: any; depth?: number }) {
    const [open, setOpen] = useState(depth < 2)
    return (
      <div style={{ marginLeft: depth > 0 ? '1.5rem' : 0, borderLeft: depth > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingLeft: depth > 0 ? '1rem' : 0 }}>
        <div
          onClick={() => node.children?.length > 0 && setOpen(!open)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: '0.5rem', cursor: node.children?.length > 0 ? 'pointer' : 'default', background: node.isGeneral ? 'rgba(212,175,55,0.06)' : 'transparent', border: node.isGeneral ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent', marginBottom: '0.25rem' }}
        >
          {node.children?.length > 0 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{open ? '▼' : '▶'}</span>}
          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: node.isGeneral ? 700 : 400 }}>{node.name || node.email}</span>
          {node.isGeneral && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', background: 'rgba(212,175,55,0.2)', color: '#d4af37', borderRadius: '0.25rem', fontWeight: 700 }}>★ {node.generalData?.effective_percent?.toFixed(1)}%</span>}
          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', borderRadius: '0.25rem', marginLeft: 'auto' }}>{node.tier}</span>
          {node.geo && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>📍 {node.geo.city}, {node.geo.country}</span>}
        </div>
        {open && node.children?.map((child: any, i: number) => <Node key={child.id ?? i} node={child} depth={depth + 1} />)}
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Organization Tree</div>
      <Node node={tree} />
    </div>
  )
}

function GeoMap({ points }: { points: any[] }) {
  // SVG world map placeholder with plotted points
  const hasPoints = points.length > 0
  const EUROPE = { minLat: 35, maxLat: 72, minLng: -12, maxLng: 45 }

  function toXY(lat: number, lng: number, width: number, height: number) {
    const x = ((lng - EUROPE.minLng) / (EUROPE.maxLng - EUROPE.minLng)) * width
    const y = ((EUROPE.maxLat - lat) / (EUROPE.maxLat - EUROPE.minLat)) * height
    return { x, y }
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
        Organization Geotagging ({points.length} members with location)
      </div>

      {/* Map area */}
      <div style={{ position: 'relative', background: 'rgba(0,0,0,0.4)', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <svg viewBox="0 0 800 500" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Grid lines */}
          {[0, 100, 200, 300, 400].map(y => (
            <line key={y} x1={0} y1={y} x2={800} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          ))}
          {[0, 160, 320, 480, 640, 800].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={500} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          ))}

          {/* Label */}
          <text x={20} y={30} fill="rgba(255,255,255,0.2)" fontSize={12} fontFamily="system-ui">Europe Focus View</text>

          {/* Plot points */}
          {!hasPoints && (
            <text x={400} y={250} fill="rgba(255,255,255,0.2)" fontSize={14} fontFamily="system-ui" textAnchor="middle">
              No geo data — update user profiles with lat/lng
            </text>
          )}
          {points.map((p, i) => {
            const { x, y } = toXY(p.lat, p.lng, 800, 500)
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={p.isGeneral ? 8 : 5} fill={p.isGeneral ? '#d4af37' : '#3b82f6'} opacity={0.85} />
                {p.isGeneral && <circle cx={x} cy={y} r={14} fill="none" stroke="#d4af37" strokeWidth={1.5} opacity={0.4} />}
                <title>{p.name} — {p.city}, {p.country}{p.isGeneral ? ' (General)' : ''}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#d4af37' }} /> General
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Member
        </div>
      </div>

      {/* Point list */}
      {hasPoints && (
        <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
          {points.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.isGeneral ? '#d4af37' : '#3b82f6', flexShrink: 0 }} />
              <span style={{ fontWeight: p.isGeneral ? 600 : 400, color: p.isGeneral ? '#d4af37' : 'rgba(255,255,255,0.65)' }}>{p.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{p.city}, {p.country}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>L{p.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AppointmentsList({ appointments }: { appointments: any[] }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>
        Sharing is Caring — Appointments Given ({appointments.length})
      </div>
      {appointments.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', padding: '1rem 0' }}>No appointments made yet</div>
      ) : appointments.map((a: any) => (
        <div key={a.id} style={{ padding: '0.875rem', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                → {a.receiver_user?.first_name} {a.receiver_user?.last_name}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: '0.5rem' }}>{a.receiver_user?.email}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                {new Date(a.created_at).toLocaleDateString()} · Contract: {a.contract?.status ?? 'N/A'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d4af37' }}>{a.percent_given}%</div>
              <StatusBadge status={a.status} />
            </div>
          </div>

          {/* Contract signing status */}
          {a.contract && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <SignBadge label="Giver signed" done={!!a.contract.giver_signed_at} date={a.contract.giver_signed_at} />
              <SignBadge label="Receiver signed" done={!!a.contract.receiver_signed_at} date={a.contract.receiver_signed_at} />
              {a.contract.document_hash && (
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.25rem' }}>
                  Hash: {a.contract.document_hash.slice(0, 16)}…
                </div>
              )}
            </div>
          )}

          {a.status === 'REVOKE_REQUESTED' && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#fca5a5' }}>
              Revocation requested — pending admin approval. Notes: {a.revoke_notes ?? '—'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SignBadge({ label, done, date }: { label: string; done: boolean; date?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: done ? 'rgba(16,185,129,0.08)' : 'rgba(107,114,128,0.08)', color: done ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
      {done ? '✓' : '○'} {label}
      {done && date && <span style={{ opacity: 0.6 }}>· {new Date(date).toLocaleDateString()}</span>}
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
  }
  const [color, bg] = colors[status] ?? ['#9ca3af', 'rgba(156,163,175,0.1)']
  return (
    <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.45rem', borderRadius: '0.25rem', background: bg, color, fontWeight: 700, display: 'inline-block', marginTop: '0.25rem' }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
