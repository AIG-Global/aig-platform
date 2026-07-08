'use client'
import { useEffect, useState } from 'react'

const API = 'http://localhost:3333'

export default function PoolPage() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [recordForm, setRecordForm] = useState({ source_type: 'MEMBERSHIP', source_id: '', total_amount_eur: '', description: '' })
  const [recordMsg, setRecordMsg] = useState('')

  const load = () => {
    setLoading(true)
    fetch(`${API}/generals/pool/summary?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [year, month])

  const formatEur = (cents: number) => `€${(cents / 100).toLocaleString('fi-FI', { minimumFractionDigits: 2 })}`

  async function handleRecordIncome(e: React.FormEvent) {
    e.preventDefault()
    setRecordMsg('')
    try {
      const totalCents = Math.round(Number(recordForm.total_amount_eur) * 100)
      const res = await fetch(`${API}/generals/pool/record-income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_type: recordForm.source_type,
          source_id: recordForm.source_id || `manual-${Date.now()}`,
          total_amount_eur_cents: String(totalCents),
          description: recordForm.description,
        }),
      })
      if (!res.ok) { const err = await res.json(); setRecordMsg(`Error: ${err.message}`); return }
      const t = await res.json()
      setRecordMsg(`✓ Pool transaction created. Pool amount: ${formatEur(Number(t.pool_amount_eur))}. ID: ${t.id}`)
      load()
    } catch {
      setRecordMsg('API unavailable')
    }
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Management Pool</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>20% of all income distributed to Generals</p>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Period:</span>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}
          style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(2000, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.875rem' }}>
          {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Totals */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
      ) : summary ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Income', value: formatEur(summary.totals?.total_income_eur ?? 0), color: '#fff' },
              { label: '20% Pool', value: formatEur(summary.totals?.total_pool_eur ?? 0), color: '#d4af37' },
              { label: 'Distributed', value: formatEur(summary.totals?.paid_earnings_eur ?? 0), color: '#10b981' },
              { label: 'Pending Payout', value: formatEur(summary.totals?.pending_earnings_eur ?? 0), color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{s.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Transactions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>
              Pool Transactions ({summary.transactions?.length ?? 0})
            </div>
            {!summary.transactions?.length ? (
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No transactions this period</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Source', 'Description', 'Income', 'Pool (20%)', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.5rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {summary.transactions.map((t: any) => (
                    <PoolTxRow key={t.id} tx={t} formatEur={formatEur} onDistributed={load} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>Failed to load pool data. API may be offline.</div>
      )}

      {/* Record income form */}
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.95rem', color: '#10b981' }}>Record Income Event</h3>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1rem' }}>
          Manually record an income event. 20% will automatically be allocated to the management pool.
        </p>
        <form onSubmit={handleRecordIncome} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>Source Type</label>
            <select value={recordForm.source_type} onChange={e => setRecordForm(f => ({ ...f, source_type: e.target.value }))}
              style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem' }}>
              {['MEMBERSHIP', 'WDM_ORDER', 'INVESTMENT', 'REFERRAL'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>Amount (€)</label>
            <input
              type="number" min="0.01" step="0.01"
              value={recordForm.total_amount_eur} onChange={e => setRecordForm(f => ({ ...f, total_amount_eur: e.target.value }))}
              required placeholder="0.00"
              style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', width: '120px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>Description</label>
            <input
              value={recordForm.description} onChange={e => setRecordForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional"
              style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', width: '200px' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.5rem 1.25rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
            Record
          </button>
        </form>
        {recordMsg && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: recordMsg.startsWith('✓') ? '#86efac' : '#fca5a5' }}>{recordMsg}</div>
        )}
      </div>
    </div>
  )
}

function PoolTxRow({ tx, formatEur, onDistributed }: { tx: any; formatEur: (n: number) => string; onDistributed: () => void }) {
  const [distributing, setDistributing] = useState(false)
  const [msg, setMsg] = useState('')

  async function distribute() {
    setDistributing(true); setMsg('')
    try {
      const res = await fetch(`http://localhost:3333/generals/pool/${tx.id}/distribute`, { method: 'POST' })
      if (!res.ok) { const e = await res.json(); setMsg(e.message ?? 'Error'); return }
      setMsg('✓ Distributed!')
      onDistributed()
    } catch { setMsg('API error') }
    finally { setDistributing(false) }
  }

  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }}>
      <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{tx.source_type}</td>
      <td style={{ padding: '0.6rem 0.5rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.source_description ?? '—'}</td>
      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{formatEur(Number(tx.total_amount_eur))}</td>
      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#d4af37' }}>{formatEur(Number(tx.pool_amount_eur))}</td>
      <td style={{ padding: '0.6rem 0.5rem' }}>
        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 600, background: tx.status === 'DISTRIBUTED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: tx.status === 'DISTRIBUTED' ? '#10b981' : '#f59e0b' }}>
          {tx.status}
        </span>
      </td>
      <td style={{ padding: '0.6rem 0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
        {new Date(tx.created_at).toLocaleDateString()}
      </td>
      <td style={{ padding: '0.6rem 0.5rem' }}>
        {tx.status === 'PENDING' && (
          <button onClick={distribute} disabled={distributing}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
            {distributing ? '…' : 'Distribute'}
          </button>
        )}
        {msg && <span style={{ fontSize: '0.7rem', color: msg.startsWith('✓') ? '#86efac' : '#fca5a5', marginLeft: '0.25rem' }}>{msg}</span>}
      </td>
    </tr>
  )
}
