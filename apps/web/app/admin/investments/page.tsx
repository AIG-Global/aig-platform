'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API = 'http://localhost:3333/api'

export default function InvestmentsPage() {
  const [funds, setFunds] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fund_type: 'LONG_TERM_5Y',
    principal_eur: 1000,
    reinvest: true,
  })

  const userId = 'demo-user-1' // In real app, get from session

  useEffect(() => {
    Promise.all([
      fetch(`${API}/analytics/investments/user/${userId}/funds`).then(r => r.json()),
      fetch(`${API}/analytics/investments/user/${userId}/portfolio`).then(r => r.json()),
    ])
      .then(([fundsData, summaryData]) => {
        setFunds(fundsData || [])
        setSummary(summaryData || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const handlePurchase = async () => {
    if (!formData.principal_eur) return
    try {
      const res = await fetch(`${API}/analytics/investments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          fund_type: formData.fund_type,
          principal_eur_cents: String((formData.principal_eur * 100).toFixed(0)),
          reinvest_on_maturity: formData.reinvest,
        }),
      })
      const newFund = await res.json()
      setFunds([newFund, ...funds])
      setShowForm(false)
      setFormData({ fund_type: 'LONG_TERM_5Y', principal_eur: 1000, reinvest: true })
    } catch (e) {
      console.error(e)
    }
  }

  const display = summary ?? {
    summary: { total_invested_eur: 0, total_interest_eur: 0, total_commission_eur: 0 },
    by_type: {},
    funds: [],
  }

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Investment Funds</h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
            Long-term and specialized investment products
          </p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          background: 'linear-gradient(135deg, #d4af37, #f0c856)', color: '#1a0f15', padding: '0.65rem 1.5rem', borderRadius: '0.75rem',
          border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
        }}>+ New Investment</button>
      </div>

      {/* Portfolio Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Invested', value: `€${display.summary?.total_invested_eur?.toFixed(2) ?? '0.00'}`, color: '#d4af37' },
          { label: 'Accrued Interest', value: `€${display.summary?.total_interest_eur?.toFixed(2) ?? '0.00'}`, color: '#10b981' },
          { label: 'Total Value', value: `€${((display.summary?.total_invested_eur ?? 0) + (display.summary?.total_interest_eur ?? 0)).toFixed(2)}`, color: '#fff' },
          { label: 'Commission (15%)', value: `€${display.summary?.total_commission_eur?.toFixed(2) ?? '0.00'}`, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* By Type Breakdown */}
      {Object.keys(display.by_type ?? {}).length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>Breakdown by Fund Type</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {Object.entries(display.by_type).map(([type, data]: [string, any]) => (
              <div key={type} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '0.75rem', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>{type}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.2rem' }}>{data.count}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>€{data.total_invested_eur?.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funds Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Funds</div>
        </div>

        {funds.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            No investment funds yet. Create one to get started!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Fund Type</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Principal</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Interest</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Maturity</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#d4af37', fontWeight: 600 }}>{f.fund_type?.replace('LONG_TERM_', '')}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.7)' }}>€{(Number(f.principal_eur) / 100).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#10b981' }}>€{(Number(f.accrued_interest_eur) / 100).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        background: f.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: f.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                        padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600,
                      }}>{f.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                      {f.maturity_month ? new Date(f.maturity_month).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      {f.status === 'ACTIVE' && f.reinvest_on_maturity && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>Auto-reinvest</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Purchase Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0f15, #2a1520)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '1rem', padding: '2rem',
            maxWidth: '500px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', margin: 0 }}>New Investment</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Fund Type</label>
              <select value={formData.fund_type} onChange={e => setFormData({ ...formData, fund_type: e.target.value })} style={{
                width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                color: '#fff', fontSize: '0.875rem',
              }}>
                <option value="LONG_TERM_3Y">3-Year Fund (5.5% annual)</option>
                <option value="LONG_TERM_5Y">5-Year Fund (6.5% annual)</option>
                <option value="LONG_TERM_7Y">7-Year Fund (7.5% annual)</option>
                <option value="LONG_TERM_10Y">10-Year Fund (8.5% annual)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Amount (EUR)</label>
              <input type="number" min="100" step="100" value={formData.principal_eur}
                onChange={e => setFormData({ ...formData, principal_eur: Number(e.target.value) })}
                style={{
                  width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                  color: '#fff', fontSize: '0.875rem',
                }} />
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
                15% commission (€{(formData.principal_eur * 0.15).toFixed(2)}) will be deducted
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.reinvest}
                onChange={e => setFormData({ ...formData, reinvest: e.target.checked })}
                style={{ marginRight: '0.5rem', width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Auto-reinvest on maturity</span>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handlePurchase} style={{
                flex: 1, background: 'linear-gradient(135deg, #d4af37, #f0c856)', color: '#1a0f15', padding: '0.75rem', borderRadius: '0.5rem',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              }}>Confirm Investment</button>
              <button onClick={() => setShowForm(false)} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.75rem', borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
