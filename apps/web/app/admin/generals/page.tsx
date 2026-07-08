'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const API = 'http://localhost:3333'

export default function GeneralsPage() {
  const [generals, setGenerals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ user_id: '', allocated_percent: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetch(`${API}/generals`)
      .then(r => r.json())
      .then(d => Array.isArray(d) ? setGenerals(d) : setGenerals([]))
      .catch(() => setGenerals([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    try {
      const res = await fetch(`${API}/generals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: form.user_id, allocated_percent: Number(form.allocated_percent) }),
      })
      if (!res.ok) { const err = await res.json(); setFormError(err.message ?? 'Error'); return }
      const g = await res.json()
      setGenerals(prev => [g, ...prev])
      setCreating(false)
      setForm({ user_id: '', allocated_percent: '' })
    } catch {
      setFormError('API unavailable')
    }
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Generals</h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Leaders earning from the 20% management pool</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #d4af37, #b8952e)', color: '#1a0f15', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
        >
          + Appoint General
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#d4af37' }}>Appoint Root General</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>User ID</label>
              <input
                value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))}
                placeholder="cuid..."
                required
                style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem', width: '280px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>Pool % (max 20)</label>
              <input
                type="number" min="0.1" max="20" step="0.1"
                value={form.allocated_percent} onChange={e => setForm(f => ({ ...f, allocated_percent: e.target.value }))}
                required
                style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem', width: '120px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ padding: '0.5rem 1rem', background: '#d4af37', color: '#1a0f15', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
              <button type="button" onClick={() => setCreating(false)} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
          {formError && <div style={{ marginTop: '0.5rem', color: '#fca5a5', fontSize: '0.8rem' }}>{formError}</div>}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
      ) : generals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>★</div>
          <div>No Generals appointed yet</div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['General', 'Allocated %', 'Given Away', 'Effective %', 'String Capacity', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generals.map(g => (
                <GeneralRow key={g.id} general={g} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function GeneralRow({ general: g }: { general: any }) {
  const effectivePct = g.allocated_percent - g.distributed_percent
  const fillPct = Math.min((g.allocated_percent / 20) * 100, 100)

  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)' }}>
      <td style={{ padding: '0.875rem 1rem' }}>
        <div style={{ fontWeight: 600, color: '#fff' }}>
          {g.user?.first_name} {g.user?.last_name}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{g.user?.email}</div>
      </td>
      <td style={{ padding: '0.875rem 1rem' }}>
        <span style={{ fontWeight: 700, color: '#d4af37' }}>{g.allocated_percent}%</span>
      </td>
      <td style={{ padding: '0.875rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{g.distributed_percent}%</td>
      <td style={{ padding: '0.875rem 1rem' }}>
        <span style={{ fontWeight: 700, color: effectivePct > 0 ? '#10b981' : '#6b7280' }}>{effectivePct.toFixed(1)}%</span>
      </td>
      <td style={{ padding: '0.875rem 1rem', minWidth: '140px' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>{g.allocated_percent}% of 20% max</div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${fillPct}%`, background: fillPct >= 90 ? '#ef4444' : fillPct >= 70 ? '#f59e0b' : '#d4af37', borderRadius: '2px' }} />
        </div>
      </td>
      <td style={{ padding: '0.875rem 1rem' }}>
        <span style={{
          fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontWeight: 600,
          background: g.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
          color: g.status === 'ACTIVE' ? '#10b981' : '#9ca3af',
        }}>{g.status}</span>
      </td>
      <td style={{ padding: '0.875rem 1rem' }}>
        <Link href={`/admin/generals/${g.id}`} style={{
          fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '0.375rem',
          background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)',
          textDecoration: 'none', fontWeight: 600,
        }}>View →</Link>
      </td>
    </tr>
  )
}
