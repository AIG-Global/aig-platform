'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

const DianaWelcome = () => (
  <div style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px',
    color: '#fff',
  }}>
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        marginBottom: '24px',
        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
      }}>
        ✨
      </div>
      <h2 style={{ margin: '0 0 12px', fontSize: '28px', fontWeight: '700' }}>
        Welcome to AIGINVEST
      </h2>
      <p style={{
        margin: '0 0 24px',
        fontSize: '16px',
        color: '#aaa',
        lineHeight: '1.6',
      }}>
        I'm Diana. I help people turn intentions into outcomes.
      </p>
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#888',
        lineHeight: '1.6',
      }}>
        Let's start by creating your first mission. You'll see how we work together to turn your goals into completed work.
      </p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
      marginTop: '32px',
    }}>
      {[
        { icon: '🎯', label: 'Set Goals' },
        { icon: '🗺️', label: 'Plan Work' },
        { icon: '⚡', label: 'Execute' },
        { icon: '📊', label: 'Track Progress' },
      ].map(({ icon, label }) => (
        <div key={label} style={{
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
          <div style={{ fontSize: '12px', fontWeight: '500' }}>{label}</div>
        </div>
      ))}
    </div>
  </div>
)

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
      localStorage.setItem('userName', user.displayName || email.split('@')[0])
      if (!localStorage.getItem('userPackage')) {
        localStorage.setItem('userPackage', 'packagea')
      }

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          packageId: localStorage.getItem('userPackage') || 'packagea',
          userName: user.displayName || email.split('@')[0],
          userPassword: localStorage.getItem('userPassword') || undefined,
        }),
      })

      // First-time users go to onboarding, returning users go to home
      const isNewUser = !user.lastLoginAt || new Date(user.lastLoginAt).getTime() === new Date(user.createdAt).getTime()
      const onboardingDone = localStorage.getItem('onboardingDone')
      if (isNewUser && !onboardingDone) {
        router.push('/onboarding')
      } else {
        router.push('/home')
      }
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
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        }}>
          {/* Diana Welcome Guide - Left Side */}
          <DianaWelcome />

          {/* Login Form - Right Side */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
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
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  margin: '0 auto 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}>
                  ◇
                </div>
                <h1 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>Sign In</h1>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                  to start building with Diana
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
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '11px',
              color: '#555',
              lineHeight: 1.6,
            }}>
              Enter your email to sign in or create an account.
            </p>
            </div>
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

