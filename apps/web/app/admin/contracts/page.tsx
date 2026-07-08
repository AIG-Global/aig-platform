'use client'
import { useEffect, useState } from 'react'

const API = 'http://localhost:3333'

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [signForm, setSignForm] = useState<{ contractId: string; userId: string; docUrl: string } | null>(null)
  const [signMsg, setSignMsg] = useState('')

  useEffect(() => {
    // Fetch all generals and collect their appointments/contracts
    fetch(`${API}/generals`)
      .then(r => r.json())
      .then(async (generals: any[]) => {
        if (!Array.isArray(generals)) { setContracts([]); return }
        const allContracts: any[] = []
        await Promise.all(generals.map(async g => {
          const detail = await fetch(`${API}/generals/${g.id}`).then(r => r.json()).catch(() => null)
          if (detail?.appointments_given) {
            for (const a of detail.appointments_given) {
              if (a.contract) allContracts.push({ ...a.contract, appointment: a, giver: g })
            }
          }
        }))
        setContracts(allContracts)
      })
      .catch(() => setContracts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? contracts : contracts.filter(c => c.status === filter)

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    if (!signForm) return
    setSignMsg('')
    try {
      const res = await fetch(`${API}/generals/contracts/${signForm.contractId}/sign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signer_user_id: signForm.userId, document_url: signForm.docUrl || undefined }),
      })
      if (!res.ok) { const e = await res.json(); setSignMsg(`Error: ${e.message}`); return }
      setSignMsg('✓ Signed successfully!')
      setSignForm(null)
      // Refresh
      setLoading(true)
      window.location.reload()
    } catch { setSignMsg('API unavailable') }
  }

  async function handleApproveRevoke(appointmentId: string, adminUserId = 'admin') {
    try {
      const res = await fetch(`${API}/generals/appointments/${appointmentId}/revoke-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_user_id: adminUserId }),
      })
      if (res.ok) window.location.reload()
    } catch { /* ignore */ }
  }

  const STATUSES = ['ALL', 'DRAFT', 'PENDING_GIVER_SIGNATURE', 'PENDING_RECEIVER_SIGNATURE', 'FULLY_SIGNED', 'VOIDED']

  return (
    <div style={{ padding: '2rem', color: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Contracts</h1>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          All "Sharing is Caring" AIG-Secure-Sign contracts
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: filter === s ? 700 : 400, border: 'none',
            background: filter === s ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
            color: filter === s ? '#d4af37' : 'rgba(255,255,255,0.5)',
          }}>{s.replace(/_/g, ' ')}</button>
        ))}
      </div>

      {/* Sign form modal */}
      {signForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a0f15', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '1rem', padding: '1.5rem', width: '440px', maxWidth: '90vw' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#d4af37' }}>Sign Contract</h3>
            <form onSubmit={handleSign} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.25rem' }}>Signer User ID</label>
                <input value={signForm.userId} onChange={e => setSignForm(f => f ? { ...f, userId: e.target.value } : f)} required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.5rem', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.25rem' }}>Document URL (AIG-Secure-Sign)</label>
                <input value={signForm.docUrl} onChange={e => setSignForm(f => f ? { ...f, docUrl: e.target.value } : f)} placeholder="https://..."
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '0.5rem', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSignForm(null)} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '0.5rem', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#d4af37', border: 'none', borderRadius: '0.5rem', color: '#1a0f15', fontWeight: 700, cursor: 'pointer' }}>Sign</button>
              </div>
              {signMsg && <div style={{ fontSize: '0.8rem', color: signMsg.startsWith('✓') ? '#86efac' : '#fca5a5' }}>{signMsg}</div>}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>Loading contracts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✎</div>
          <div>No contracts found</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((c: any) => (
            <ContractCard key={c.id} contract={c} onSign={(cid, uid) => setSignForm({ contractId: cid, userId: uid, docUrl: '' })} onApproveRevoke={handleApproveRevoke} />
          ))}
        </div>
      )}
    </div>
  )
}

function ContractCard({ contract: c, onSign, onApproveRevoke }: { contract: any; onSign: (cid: string, uid: string) => void; onApproveRevoke: (aid: string) => void }) {
  const appt = c.appointment
  const giver = c.giver

  const statusColors: Record<string, string> = {
    FULLY_SIGNED: '#10b981', PENDING_GIVER_SIGNATURE: '#f59e0b', PENDING_RECEIVER_SIGNATURE: '#3b82f6',
    DRAFT: '#6b7280', VOIDED: '#ef4444', CANCELLED: '#ef4444',
  }
  const statusColor = statusColors[c.status] ?? '#9ca3af'

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${statusColor}22`, borderLeft: `3px solid ${statusColor}`, borderRadius: '0.875rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d4af37' }}>{appt?.percent_given}% Pool Share</span>
            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: `${statusColor}18`, color: statusColor, fontWeight: 700 }}>
              {c.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{giver?.user?.first_name} {giver?.user?.last_name}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 0.5rem' }}>→</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{appt?.receiver_user?.first_name} {appt?.receiver_user?.last_name}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>
            Contract ID: {c.id} · Created {new Date(c.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Signing status */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <SignStatus label="Giver" signed={!!c.giver_signed_at} date={c.giver_signed_at} />
          <SignStatus label="Receiver" signed={!!c.receiver_signed_at} date={c.receiver_signed_at} />
          {c.admin_reviewed_at && <SignStatus label="Admin reviewed" signed={true} date={c.admin_reviewed_at} />}
        </div>
      </div>

      {/* Document info */}
      {c.document_url && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={c.document_url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: '#3b82f6', padding: '0.25rem 0.6rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '0.375rem', textDecoration: 'none' }}>
            📄 View Document
          </a>
          {c.document_hash && (
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>SHA-256: {c.document_hash.slice(0, 20)}…</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ marginTop: '0.875rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(c.status === 'PENDING_GIVER_SIGNATURE' || c.status === 'DRAFT') && (
          <button onClick={() => onSign(c.id, appt?.giver_user_id ?? '')}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
            Sign as Giver
          </button>
        )}
        {c.status === 'PENDING_RECEIVER_SIGNATURE' && (
          <button onClick={() => onSign(c.id, appt?.receiver_user_id ?? '')}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
            Sign as Receiver
          </button>
        )}
        {appt?.status === 'REVOKE_REQUESTED' && (
          <button onClick={() => onApproveRevoke(appt.id)}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}>
            ⚠ Approve Revocation
          </button>
        )}
      </div>

      {/* Terms snapshot */}
      <details style={{ marginTop: '0.75rem' }}>
        <summary style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Contract Terms</summary>
        <pre style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '0.5rem', marginTop: '0.5rem', overflow: 'auto', maxHeight: '200px' }}>
          {c.terms_snapshot}
        </pre>
      </details>
    </div>
  )
}

function SignStatus({ label, signed, date }: { label: string; signed: boolean; date?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', background: signed ? 'rgba(16,185,129,0.08)' : 'rgba(107,114,128,0.08)', color: signed ? '#10b981' : 'rgba(255,255,255,0.3)' }}>
      {signed ? '✓' : '○'} {label}
      {signed && date && <span style={{ opacity: 0.6 }}>· {new Date(date).toLocaleDateString()}</span>}
    </div>
  )
}
