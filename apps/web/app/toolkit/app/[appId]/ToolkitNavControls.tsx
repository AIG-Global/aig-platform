'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ToolkitNavControls() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <button
        type='button'
        onClick={() => router.back()}
        style={{
          background: '#0f172a',
          border: '1px solid rgba(148,163,184,0.35)',
          color: '#e2e8f0',
          borderRadius: '8px',
          padding: '6px 10px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        Back
      </button>

      <Link
        href='/toolkit'
        style={{
          background: '#0f172a',
          border: '1px solid rgba(148,163,184,0.35)',
          color: '#93c5fd',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '12px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Toolkit
      </Link>

      <Link
        href='/dashboard'
        style={{
          background: '#1e293b',
          border: '1px solid rgba(148,163,184,0.35)',
          color: '#f8d57a',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '12px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Dashboard
      </Link>
    </div>
  )
}
