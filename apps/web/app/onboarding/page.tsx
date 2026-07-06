'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUGGESTIONS = [
  { emoji: '🚀', text: 'Launch a startup or business' },
  { emoji: '📈', text: 'Grow my existing business' },
  { emoji: '💻', text: 'Build a software product' },
  { emoji: '📚', text: 'Learn something new' },
  { emoji: '🎯', text: 'Achieve a personal goal' },
  { emoji: '💡', text: 'Something else' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('')
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)

  const goal = selected === '💡 Something else' ? custom : selected

  const handleContinue = async () => {
    if (!goal.trim()) return
    setLoading(true)
    // Store the goal so chat page can auto-submit it
    localStorage.setItem('onboardingGoal', goal.trim())
    localStorage.setItem('onboardingDone', 'true')
    router.push(`/chat?goal=${encodeURIComponent(goal.trim())}`)
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingDone', 'true')
    router.push('/chat')
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#fff' }}>
        <main style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{ width: '100%', maxWidth: '520px' }}>
            {/* Diana avatar */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '14px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '16px',
              }}>◇</div>
              <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700 }}>
                Hi, I'm Diana.
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '16px', lineHeight: 1.5 }}>
                I help you turn goals into completed work.<br />
                What are you trying to achieve?
              </p>
            </div>

            {/* Suggestion tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {SUGGESTIONS.map(({ emoji, text }) => {
                const value = `${emoji} ${text}`
                const isActive = selected === value
                return (
                  <button
                    key={value}
                    onClick={() => setSelected(isActive ? '' : value)}
                    style={{
                      padding: '14px 16px',
                      background: isActive ? 'rgba(102,126,234,0.25)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isActive ? 'rgba(102,126,234,0.6)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '10px',
                      color: isActive ? '#fff' : '#bbb',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{emoji}</span>
                    <span>{text}</span>
                  </button>
                )
              })}
            </div>

            {/* Custom input (shown when "Something else" selected) */}
            {selected.includes('Something else') && (
              <textarea
                autoFocus
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Tell Diana what you'd like to accomplish..."
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(102,126,234,0.4)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  padding: '14px',
                  marginBottom: '16px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            )}

            {/* Or type anything */}
            {!selected && (
              <div style={{ marginBottom: '16px' }}>
                <textarea
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected('') }}
                  placeholder="Or describe your goal in your own words..."
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '14px',
                    padding: '12px 14px',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(102,126,234,0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={handleContinue}
              disabled={!goal.trim() || loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: goal.trim() && !loading ? 'pointer' : 'not-allowed',
                opacity: goal.trim() && !loading ? 1 : 0.4,
                transition: 'opacity 0.2s',
                marginBottom: '12px',
              }}
            >
              {loading ? 'Setting up…' : 'Start with Diana →'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleSkip}
                style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer' }}
              >
                Skip for now
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
