'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/generals', label: 'Generals', icon: '★' },
  { href: '/admin/pool', label: 'Management Pool', icon: '◎' },
  { href: '/admin/contracts', label: 'Contracts', icon: '✎' },
  { href: '/admin/members', label: 'Members', icon: '◉' },
  { href: '/admin/commissions', label: 'Commissions', icon: '€' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/investments', label: 'Investments', icon: '💰' },
  { href: '/admin/north-star', label: 'North Star', icon: '🚀' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0810', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a0f15 0%, #120b10 100%)',
        borderRight: '1px solid rgba(212,175,55,0.15)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
          <div style={{ fontSize: '0.65rem', color: '#d4af37', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>AIG Platform</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Admin Backoffice</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV.map(item => (
            <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(212,175,55,0.1)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
          AIG Global © 2026
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: '#0d0810' }}>
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 1.25rem',
        margin: '0.1rem 0.5rem',
        borderRadius: '0.5rem',
        background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
        borderLeft: active ? '2px solid #d4af37' : '2px solid transparent',
        color: active ? '#d4af37' : 'rgba(255,255,255,0.6)',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.15s',
        cursor: 'pointer',
      }}>
        <span style={{ fontSize: '1rem', width: '1.25rem', textAlign: 'center' }}>{icon}</span>
        {label}
      </div>
    </Link>
  )
}
