'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>◇</div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Something went wrong</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', maxWidth: '320px' }}>
            Diana encountered an unexpected problem. Your work is safe.
          </p>
          <button
            onClick={reset}
            style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
