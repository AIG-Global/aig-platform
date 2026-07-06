'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <html>
      <body style={{ margin: 0, background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>◇</div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Page not found</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>This page doesn't exist.</p>
          <button onClick={() => router.push('/chat')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Back to Diana
          </button>
        </div>
      </body>
    </html>
  )
}
