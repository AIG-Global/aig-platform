'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, this would call your auth API
      // For now, just store the email in localStorage and redirect
      localStorage.setItem('userId', email.split('@')[0])
      localStorage.setItem('userEmail', email)
      router.push('/chat')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please try again.')
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
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            padding: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
              }}>
                ◇
              </div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>North Star ONE</h1>
              <p style={{ margin: '0', color: '#999', fontSize: '14px' }}>Meet Diana</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.5)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo Info */}
            <div style={{
              marginTop: '30px',
              padding: '16px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#aaa',
              lineHeight: '1.6',
            }}>
              Demo credentials:
              <br />
              Email: demo@example.com
              <br />
              <br />
              This will start your first conversation with Diana.
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
