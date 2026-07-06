'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

interface Workspace {
  id: string
  title: string
  type: string
  emoji: string
  goal: string | null
  _count?: { projects: number; documents: number }
}

export default function HomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState('')
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [greeting, setGreeting] = useState('Hello')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const email = localStorage.getItem('userEmail')
      const id = localStorage.getItem('userId')
      const displayName = localStorage.getItem('userDisplayName')
      if (!email || !id) { router.push('/login'); return }

      setUserName(displayName || email.split('@')[0])
      setUserId(id)

      const hour = new Date().getHours()
      setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')

      try {
        const res = await fetch(`${API}/api/workspaces`, { headers: { 'x-user-id': id } })
        if (res.ok) setWorkspaces(await res.json())
      } catch {}
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <html><body style={{ margin: 0, background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '32px' }}>◇</div>
    </body></html>
  )

  return (
    <html>
      <body style={{ margin: 0, padding: 0, color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

          {/* Nav */}
          <nav style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>◇</div>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>AIGINVEST</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={() => router.push('/chat')} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer' }}>Ask Diana</button>
              <button onClick={() => { localStorage.clear(); router.push('/login') }} style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer' }}>Sign out</button>
            </div>
          </nav>

          <main style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px' }}>

            {/* Greeting */}
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: 700, background: 'linear-gradient(135deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {greeting}, {userName}.
              </h1>
              <p style={{ margin: 0, color: '#888', fontSize: '16px' }}>
                {workspaces.length === 0 ? "I'm Diana. What would you like to accomplish today?" : `You have ${workspaces.length} workspace${workspaces.length > 1 ? 's' : ''}. Where would you like to continue?`}
              </p>
            </div>

            {/* Workspaces */}
            {workspaces.length > 0 ? (
              <section style={{ marginBottom: '48px' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#666' }}>Your Workspaces</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                  {workspaces.map((w) => (
                    <button key={w.id} onClick={() => router.push(`/workspace/${w.id}`)}
                      style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(102,126,234,0.1)'; e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{w.emoji}</div>
                      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{w.title}</div>
                      {w.goal && <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.goal}</div>}
                      <div style={{ marginTop: '12px', fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{w.type}</div>
                    </button>
                  ))}
                  {/* New workspace tile */}
                  <button onClick={() => router.push('/chat')}
                    style={{ padding: '20px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', color: '#555', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100px', gap: '8px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(102,126,234,0.4)'; e.currentTarget.style.color = '#aaa' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#555' }}
                  >
                    <span style={{ fontSize: '24px' }}>+</span>
                    <span style={{ fontSize: '13px' }}>New workspace</span>
                  </button>
                </div>
              </section>
            ) : (
              /* First-time user: show goal options */
              <section style={{ marginBottom: '48px' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#666' }}>Start your first workspace</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {[
                    { emoji: '🚀', label: 'Build a Startup', goal: 'I want to build a startup' },
                    { emoji: '💼', label: 'Grow My Business', goal: 'I want to grow my business' },
                    { emoji: '📚', label: 'Learn Something', goal: 'I want to learn something new' },
                    { emoji: '💻', label: 'Build Software', goal: 'I want to build a software product' },
                    { emoji: '💡', label: 'Start a Project', goal: 'I want to start a new project' },
                  ].map(({ emoji, label, goal }) => (
                    <button key={label} onClick={() => router.push(`/chat?goal=${encodeURIComponent(goal)}`)}
                      style={{ padding: '20px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(102,126,234,0.12)'; e.currentTarget.style.borderColor = 'rgba(102,126,234,0.3)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{label}</div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Always-present Diana CTA */}
            <div style={{ padding: '20px 24px', background: 'rgba(102,126,234,0.08)', border: '1px solid rgba(102,126,234,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '14px' }}>◇ Ask Diana anything</p>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '12px' }}>She remembers your goals and context.</p>
              </div>
              <button onClick={() => router.push('/chat')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Open Diana →
              </button>
            </div>

          </main>
        </div>
      </body>
    </html>
  )
}

