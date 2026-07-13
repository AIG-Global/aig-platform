'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { PACKAGE_LABELS, normalizeMembershipId, packageLevel, TOOLKIT_APPS, type MembershipId, type ToolkitApp } from '../../lib/toolkit-apps'

const getShortcutImageData = (app: ToolkitApp, url: string) => {
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#0f172a' />
      <stop offset='100%' stop-color='#1f2937' />
    </linearGradient>
  </defs>
  <rect width='640' height='360' fill='url(#g)' rx='20' />
  <text x='40' y='90' font-size='42' fill='#d4af37'>${app.icon}</text>
  <text x='100' y='90' font-size='34' fill='#f8fafc' font-family='Segoe UI, Arial'>${app.name}</text>
  <text x='40' y='160' font-size='19' fill='#cbd5e1' font-family='Segoe UI, Arial'>AIGINVEST Toolkit Quick Access</text>
  <text x='40' y='206' font-size='16' fill='#93c5fd' font-family='Segoe UI, Arial'>${url}</text>
  <text x='40' y='285' font-size='14' fill='#94a3b8' font-family='Segoe UI, Arial'>Save this image to phone or desktop for direct launch reference.</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default function ToolkitPage() {
  const [selectedPackage, setSelectedPackage] = useState<MembershipId>('packagea')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const currentSession = await fetch('/api/auth/session', { method: 'GET' })
        if (currentSession.ok) {
          const payload = await currentSession.json()
          const pkg = normalizeMembershipId(payload?.session?.packageId)
          setSelectedPackage(pkg)
          setIsAuthenticated(true)

          if (payload?.session?.email) localStorage.setItem('userEmail', payload.session.email)
          if (payload?.session?.userName) localStorage.setItem('userName', payload.session.userName)
          if (payload?.session?.userPassword) localStorage.setItem('userPassword', payload.session.userPassword)
          localStorage.setItem('userPackage', pkg)
          return
        }

        const email = localStorage.getItem('userEmail')
        const userName = localStorage.getItem('userName') ?? undefined
        const userPassword = localStorage.getItem('userPassword') ?? undefined
        const localPackage = normalizeMembershipId(localStorage.getItem('userPackage'))
        setSelectedPackage(localPackage)

        if (!email) {
          setIsAuthenticated(false)
          return
        }

        const synced = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, packageId: localPackage, userName, userPassword }),
        })

        setIsAuthenticated(synced.ok)
      } catch {
        setIsAuthenticated(false)
      }
    }

    void hydrateSession()
  }, [])

  const currentPackageLabel = PACKAGE_LABELS[selectedPackage]

  const appsWithAccess = useMemo(() => {
    return TOOLKIT_APPS.map((app) => {
      const isAllowed = packageLevel(selectedPackage) >= packageLevel(app.minPackage)
      const launchUrl = `/toolkit/app/${app.id}`
      return {
        ...app,
        isAllowed,
        launchUrl,
        shortcutImageData: getShortcutImageData(app, launchUrl),
      }
    })
  }, [selectedPackage])

  const allowedApps = appsWithAccess.filter((app) => app.isAllowed)
  const lockedApps = appsWithAccess.filter((app) => !app.isAllowed)

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b1220',
        backgroundImage: "linear-gradient(rgba(11, 18, 32, 0.84), rgba(17, 24, 39, 0.9)), url('/toolkit/toolkit-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#e5e7eb',
        padding: '24px 16px 48px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
          <h1 style={{ color: '#d4af37', fontSize: '30px', fontWeight: 800 }}>Toolkit</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Membership level: {currentPackageLabel}</span>
            <Link href='/dashboard' style={{ color: '#93c5fd', textDecoration: 'underline' }}>Back to Dashboard</Link>
          </div>
        </div>

        {!isAuthenticated && (
          <div style={{ ...cardStyle, borderColor: 'rgba(252, 165, 165, 0.5)', marginBottom: '12px' }}>
            <p style={{ color: '#fecaca', fontWeight: 700, marginBottom: '6px' }}>Sign-in required</p>
            <p style={{ color: '#cbd5e1', fontSize: '13px' }}>
              Toolkit apps are available only to authenticated members with eligible profile access.
            </p>
            <Link href='/auth?mode=signin' style={{ color: '#93c5fd', textDecoration: 'underline', fontSize: '13px' }}>Go to Sign In</Link>
          </div>
        )}

        <p style={{ marginBottom: '14px', color: '#94a3b8', fontSize: '13px' }}>
          Showing all apps allowed for {currentPackageLabel}. Each app can be launched directly, includes usage guidance, and has a downloadable quick-access image for phone or desktop.
        </p>

        <div style={{ display: 'grid', gap: '14px' }}>
          {allowedApps.map((app) => (
            <article key={app.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <h2 style={{ fontWeight: 700, color: '#f8d57a', fontSize: '20px', marginBottom: '6px' }}>{app.icon} {app.name}</h2>
                  {app.tagline && <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{app.tagline}</p>}
                  <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '10px' }}>{app.description}</p>
                  {app.highlights && app.highlights.length > 0 && (
                    <ul style={{ margin: '0 0 10px', paddingLeft: '18px', color: '#cbd5e1', fontSize: '12px', lineHeight: 1.5 }}>
                      {app.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {app.notice && <p style={{ color: '#fca5a5', fontSize: '12px', marginBottom: '10px' }}>{app.notice}</p>}
                  <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
                    Source app file: {app.relativeHtmlPath}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <a href={app.launchUrl} style={{ ...primaryButtonStyle, opacity: isAuthenticated ? 1 : 0.65, pointerEvents: isAuthenticated ? 'auto' : 'none' }} aria-disabled={!isAuthenticated}>Open App</a>
                    <a href={app.shortcutImageData} download={`${app.id}-quick-access.png`} style={secondaryButtonStyle}>Download phone/desktop image</a>
                  </div>
                </div>

                <div style={{ width: '240px', minWidth: '220px' }}>
                  <img
                    src={app.shortcutImageData}
                    alt={`${app.name} quick access image`}
                    style={{ width: '100%', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.35)' }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {lockedApps.length > 0 && (
          <section style={{ marginTop: '18px' }}>
            <h3 style={{ color: '#fca5a5', marginBottom: '8px' }}>Locked apps (upgrade required)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {lockedApps.map((app) => (
                <div key={app.id} style={{ ...cardStyle, opacity: 0.72 }}>
                  <p style={{ fontWeight: 700 }}>{app.icon} {app.name}</p>
                  <p style={{ fontSize: '12px', color: '#cbd5e1' }}>{app.description}</p>
                  <p style={{ marginTop: '6px', fontSize: '12px', color: '#fca5a5' }}>Requires {PACKAGE_LABELS[app.minPackage]} or higher.</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(15, 23, 42, 0.74)',
  border: '1px solid rgba(148, 163, 184, 0.28)',
  borderRadius: '12px',
  padding: '14px',
}

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#d4af37',
  color: '#0f172a',
  textDecoration: 'none',
  borderRadius: '8px',
  padding: '8px 10px',
  fontSize: '12px',
  fontWeight: 700,
}

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#1f2937',
  color: '#cbd5e1',
  textDecoration: 'none',
  border: '1px solid rgba(148, 163, 184, 0.45)',
  borderRadius: '8px',
  padding: '8px 10px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
}
