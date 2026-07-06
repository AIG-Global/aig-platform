'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          displayName: name.trim() || undefined,
        }),
      })

      if (!res.ok) throw new Error(`${res.status}`)

      const user = await res.json()
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userDisplayName', user.displayName || email.split('@')[0])
      router.push('/chat')
    } catch {
      setError('Could not sign in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '48px 40px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 'bold',
              }}>
                ◇
              </div>
              <h1 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700' }}>AIGINVEST</h1>
              <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                Turn every goal into completed work.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#ccc' }}>
                  Your name <span style={{ color: '#666' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Diana will remember this"
                  autoComplete="name"
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#ccc' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              {error && (
                <p style={{ margin: 0, color: '#f87171', fontSize: '13px' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{
                  marginTop: '8px',
                  padding: '13px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading || !email.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !email.trim() ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!loading && email.trim()) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? 'Starting…' : 'Start with Diana →'}
              </button>
            </form>

            <p style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#555',
              lineHeight: 1.6,
            }}>
              Enter your email to sign in or create an account.<br />
              No password required.
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
}

