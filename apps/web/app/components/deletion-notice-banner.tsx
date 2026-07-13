'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const DELETION_KEY = 'aig_deletion_request_at'
const DAY_MS = 24 * 60 * 60 * 1000

export default function DeletionNoticeBanner() {
  const [requestAt, setRequestAt] = useState<number | null>(null)

  useEffect(() => {
    const sync = () => {
      const raw = localStorage.getItem(DELETION_KEY)
      const parsed = raw ? Number(raw) : NaN
      setRequestAt(Number.isFinite(parsed) ? parsed : null)
    }

    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('aig-deletion-updated', sync as EventListener)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('aig-deletion-updated', sync as EventListener)
    }
  }, [])

  const deletionMeta = useMemo(() => {
    if (!requestAt) return null

    const elapsedDays = Math.floor((Date.now() - requestAt) / DAY_MS)
    const remainingDays = Math.max(30 - elapsedDays, 0)

    return { elapsedDays, remainingDays }
  }, [requestAt])

  if (!deletionMeta || deletionMeta.remainingDays === 0) return null

  const cancelDeletion = () => {
    localStorage.removeItem(DELETION_KEY)
    window.dispatchEvent(new Event('aig-deletion-updated'))
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '12px',
        right: '12px',
        zIndex: 2000,
        backgroundColor: 'rgba(127, 29, 29, 0.95)',
        color: '#fee2e2',
        border: '1px solid rgba(252, 165, 165, 0.65)',
        borderRadius: '10px',
        padding: '10px 12px',
        width: 'min(460px, calc(100vw - 24px))',
        boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)'
      }}
      role="status"
      aria-live="polite"
    >
      <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
        Under deletion by the owner
      </p>
      <p style={{ fontSize: '12px', lineHeight: 1.35 }}>
        Scheduled for deletion in {deletionMeta.remainingDays} day(s). You can still cancel during the 30-day grace period.
      </p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
        <Link
          href="/profile"
          style={{
            fontSize: '12px',
            color: '#fecaca',
            textDecoration: 'underline',
            textUnderlineOffset: '2px'
          }}
        >
          Manage deletion request
        </Link>
        <button
          onClick={cancelDeletion}
          style={{
            fontSize: '12px',
            backgroundColor: '#fee2e2',
            color: '#7f1d1d',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          Cancel deletion
        </button>
      </div>
    </div>
  )
}
