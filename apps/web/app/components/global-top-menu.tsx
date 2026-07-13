'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, ChevronDown, Gamepad2, Globe2, LayoutDashboard, Music4, Package2, WalletCards } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getStoredLanguagePreference, setStoredLanguagePreference, SUPPORTED_LANGUAGE_OPTIONS, type SupportedLanguage } from '../lib/language-preference'

type MenuItem = {
  name: string
  url: string
  icon: React.ComponentType<{ size?: number }>
  children?: Array<{ name: string; url: string }>
}

const menuItems: MenuItem[] = [
  {
    name: 'Business Tools',
    url: '/business-tools',
    icon: Package2,
    children: [
      { name: 'Business Tools Home', url: '/business-tools' },
      { name: 'Packages', url: '/business-tools/packages' },
      { name: 'Join', url: '/business-tools/join' },
      { name: 'AIG Ask', url: '/toolkit/app/aig-ask' },
      { name: 'AIG Business Weather', url: '/toolkit/app/aig-business-weather' },
      { name: 'AIG HELO', url: '/toolkit/app/aig-helo' },
      { name: 'AIG Investor Alerts', url: '/toolkit/app/aig-investor-alerts' },
      { name: 'AIG Me', url: '/toolkit/app/aig-me' },
      { name: 'AIG MoneyGames', url: '/toolkit/app/aig-moneygames' },
      { name: 'AIG News', url: '/toolkit/app/aig-news' },
      { name: 'AIG Record', url: '/toolkit/app/aig-record' },
      { name: 'AIG Secure Sign', url: '/toolkit/app/aig-secure-sign' },
      { name: 'AIG Translate', url: '/toolkit/app/aig-translate' },
      { name: 'AIG Website', url: '/toolkit/app/aig-website' },
    ],
  },
  {
    name: 'Investment Hub',
    url: '/ecosystem/investments',
    icon: WalletCards,
    children: [
      { name: 'General Info', url: '/ecosystem/investments/general-info' },
      { name: 'Forex Trading', url: '/ecosystem/investments/forex-trading' },
      { name: 'CFD Trading', url: '/ecosystem/investments/cfd-trading' },
      { name: 'Crypto Trading', url: '/ecosystem/investments/crypto-trading' },
      { name: 'AIG Phone ltd', url: '/ecosystem/investments/aig-phone-ltd' },
      { name: 'Long term investments', url: '/ecosystem/investments/long-term-investments' },
      { name: 'Other investments', url: '/ecosystem/investments/other-investments' },
      { name: 'AIG Cash Trading', url: '/ecosystem/investments/aig-cash-trading' },
    ],
  },
  {
    name: 'Analytics',
    url: '/ecosystem/analytics',
    icon: BarChart3,
    children: [
      { name: 'Ecosystem Analytics', url: '/ecosystem/analytics' },
      { name: 'Admin Analytics', url: '/admin/analytics' },
    ],
  },
  {
    name: 'World Domination Market',
    url: '/ecosystem/wdm',
    icon: Globe2,
    children: [
      { name: 'WDM', url: '/ecosystem/wdm' },
      { name: 'Ecosystem', url: '/ecosystem' },
    ],
  },
  {
    name: 'Music',
    url: '/music',
    icon: Music4,
    children: [{ name: 'Music Page', url: '/music' }],
  },
  {
    name: 'Games',
    url: '/games',
    icon: Gamepad2,
    children: [
      { name: 'All Games', url: '/games' },
      { name: 'Slots', url: '/games?tab=slots' },
    ],
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    children: [
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'Missions', url: '/missions' },
    ],
  },
]

const isActiveRoute = (pathname: string, url: string) => {
  return pathname === url || pathname.startsWith(`${url}/`)
}

export default function GlobalTopMenu() {
  const pathname = usePathname()
  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const languageMenuRef = useRef<HTMLDivElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const navMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preference = getStoredLanguagePreference()
    setSelectedLanguage(preference.language)
    setUserName(localStorage.getItem('userName') || '')
    setUserEmail(localStorage.getItem('userEmail') || '')

    const onLanguageApplied = (event: Event) => {
      const detail = (event as CustomEvent<{ language?: SupportedLanguage }>).detail
      if (detail?.language) setSelectedLanguage(detail.language)
    }

    window.addEventListener('aig-language-applied', onLanguageApplied as EventListener)
    return () => window.removeEventListener('aig-language-applied', onLanguageApplied as EventListener)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false)
      }
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setActiveNavMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const accountLabel = useMemo(() => {
    return userName && userName.trim().length > 0 ? userName : 'My Profile'
  }, [userName])

  const selectedLanguageOption = useMemo(() => {
    return SUPPORTED_LANGUAGE_OPTIONS.find((language) => language.code === selectedLanguage) || SUPPORTED_LANGUAGE_OPTIONS[0]
  }, [selectedLanguage])

  const languageLabel = useMemo(() => {
    return selectedLanguageOption.name
  }, [selectedLanguageOption])

  const languageMenuWidth = '24ch'
  const languageButtonWidth = '18ch'
  const accountButtonWidth = '18ch'

  return (
    <div
      style={{
        position: 'sticky',
        top: '0',
        zIndex: 95,
        width: '100%',
        border: '1px solid rgba(122, 86, 28, 0.55)',
        borderRadius: '0',
        background: 'linear-gradient(90deg, rgba(197, 143, 45, 0.68) 0%, rgba(232, 180, 72, 0.68) 40%, rgba(241, 202, 106, 0.68) 52%, rgba(225, 173, 63, 0.68) 68%, rgba(184, 129, 36, 0.68) 100%)',
        boxShadow: '0 10px 26px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        backdropFilter: 'blur(8px)',
        padding: '10px 12px',
        minHeight: '66px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px minmax(0, 1fr) auto',
          alignItems: 'center',
          columnGap: '12px',
        }}
      >
        <div style={{ width: '180px', flexShrink: 0 }}>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/logos/aig-logo.jpeg"
              alt="AIG"
              style={{ height: '34px', width: 'auto', border: '1px solid rgba(27, 18, 6, 0.25)' }}
            />
          </Link>
        </div>

        <div ref={navMenuRef} style={{ whiteSpace: 'normal', overflow: 'visible' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              minWidth: 'max-content',
              margin: '0 auto',
            }}
          >
            {menuItems.map((item) => {
              const active = isActiveRoute(pathname, item.url)
              const ItemIcon = item.icon
              const itemButtonMinWidth = item.name === 'World Domination Market' ? '224px' : '148px'
              return (
                <div
                  key={item.name}
                  style={{ flexShrink: 0, position: 'relative' }}
                  onMouseEnter={() => setActiveNavMenu(item.name)}
                  onMouseLeave={() => setActiveNavMenu((current) => (current === item.name ? null : current))}
                >
                  <Link
                    href={item.url}
                    onClick={(event) => {
                      if (!item.children || item.children.length === 0) return
                      const isOpen = activeNavMenu === item.name
                      if (!isOpen) {
                        event.preventDefault()
                        setActiveNavMenu(item.name)
                      }
                    }}
                    style={{
                      backgroundColor: active ? 'rgba(27, 18, 6, 0.26)' : 'rgba(255, 255, 255, 0.18)',
                      border: '1px solid rgba(27, 18, 6, 0.22)',
                      borderRadius: '9999px',
                      color: '#1b1206',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      minHeight: '44px',
                      minWidth: itemButtonMinWidth,
                      justifyContent: 'center',
                      boxShadow: active ? '0 4px 12px rgba(0,0,0,0.2)' : '0 3px 10px rgba(0,0,0,0.14)',
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                    className="px-4 py-2 hover:bg-white/35 transition text-xs font-bold whitespace-nowrap"
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active ? 'rgba(255, 228, 156, 0.18)' : 'rgba(27, 18, 6, 0.1)',
                      }}
                    >
                      <ItemIcon size={13} />
                    </span>
                    {item.name}
                  </Link>

                  {item.children && item.children.length > 0 && activeNavMenu === item.name && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '100%',
                        backgroundColor: 'rgba(243, 200, 101, 0.98)',
                        border: '1px solid rgba(27, 18, 6, 0.22)',
                        minWidth: '220px',
                        display: 'block',
                        whiteSpace: 'normal',
                        boxShadow: '0 16px 36px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.22)',
                      }}
                      className="shadow-xl z-50"
                    >
                      {item.children.map((subItem) => (
                        <Link
                          key={`${item.name}-${subItem.name}`}
                          href={subItem.url}
                          onClick={() => setActiveNavMenu(null)}
                          style={{
                            color: '#1b1206',
                            borderBottom: '1px solid rgba(27, 18, 6, 0.12)',
                            textDecoration: 'none',
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          className="block px-3 py-2 text-sm hover:bg-white/35 transition last:border-b-0"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div
          style={{
            width: 'fit-content',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            flexWrap: 'nowrap',
          }}
        >
          <div ref={languageMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageMenu((prev) => !prev)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.42)',
                border: '1px solid rgba(27, 18, 6, 0.45)',
                borderRadius: '9999px',
                color: '#120b02',
                boxShadow: '0 1px 0 rgba(255,255,255,0.55), 0 3px 10px rgba(27, 18, 6, 0.2)',
                minHeight: '42px',
                minWidth: languageButtonWidth,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="flex items-center gap-2 px-4 py-2 transition text-sm font-extrabold whitespace-nowrap"
            >
              {selectedLanguageOption.flag} {languageLabel}
              <ChevronDown size={12} />
            </button>

            {showLanguageMenu && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '100%',
                  transform: 'translateX(-50%)',
                  marginTop: '-1px',
                  backgroundColor: 'rgba(243, 200, 101, 0.98)',
                  border: '1px solid rgba(27, 18, 6, 0.22)',
                  borderTop: 'none',
                  width: languageMenuWidth,
                  display: 'block',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.22)',
                }}
                className="shadow-xl z-50"
              >
                {SUPPORTED_LANGUAGE_OPTIONS.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.code)
                      setStoredLanguagePreference(language.code, 'manual')
                      window.dispatchEvent(new CustomEvent('aig-language-changed', { detail: { language: language.code, mode: 'manual' } }))
                      setShowLanguageMenu(false)
                    }}
                    style={{
                      backgroundColor: selectedLanguage === language.code ? 'rgba(255,255,255,0.28)' : 'transparent',
                      color: '#1b1206',
                      borderBottom: '1px solid rgba(27, 18, 6, 0.12)',
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/35 transition last:border-b-0"
                  >
                    {language.flag} {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={accountMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountMenu((prev) => !prev)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.42)',
                border: '1px solid rgba(27, 18, 6, 0.45)',
                borderRadius: '9999px',
                color: '#120b02',
                boxShadow: '0 1px 0 rgba(255,255,255,0.55), 0 3px 10px rgba(27, 18, 6, 0.2)',
                minHeight: '42px',
                minWidth: accountButtonWidth,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="flex items-center gap-2 px-4 py-2 transition text-sm font-extrabold whitespace-nowrap"
            >
              {accountLabel}
              <ChevronDown size={12} />
            </button>

            {showAccountMenu && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '100%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(243, 200, 101, 0.98)',
                  border: '1px solid rgba(27, 18, 6, 0.22)',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  whiteSpace: 'normal',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.22)',
                }}
                className="shadow-xl z-50"
              >
                <div style={{ borderBottom: '1px solid rgba(27, 18, 6, 0.18)', padding: '10px 12px' }}>
                  <p style={{ color: '#3b2a0f', fontSize: '11px', fontWeight: 700 }}>USER INFO</p>
                  <p style={{ color: '#1b1206', fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{accountLabel}</p>
                  <p style={{ color: '#3b2a0f', fontSize: '11px' }}>{userEmail || 'No email'}</p>
                </div>

                <Link href="/profile" style={{ color: '#1b1206', borderBottom: '1px solid rgba(27, 18, 6, 0.12)', textDecoration: 'none', display: 'block', width: '100%', textAlign: 'left' }} className="px-3 py-2 text-sm hover:bg-white/35 transition">All User Info</Link>
                <Link href="/profile" style={{ color: '#1b1206', borderBottom: '1px solid rgba(27, 18, 6, 0.12)', textDecoration: 'none', display: 'block', width: '100%', textAlign: 'left' }} className="px-3 py-2 text-sm hover:bg-white/35 transition">My Profile</Link>
                <Link href="/missions" style={{ color: '#1b1206', borderBottom: '1px solid rgba(27, 18, 6, 0.12)', textDecoration: 'none', display: 'block', width: '100%', textAlign: 'left' }} className="px-3 py-2 text-sm hover:bg-white/35 transition">Missions</Link>
                <Link href="/ecosystem/wdm" style={{ color: '#1b1206', textDecoration: 'none', display: 'block', width: '100%', textAlign: 'left' }} className="px-3 py-2 text-sm hover:bg-white/35 transition">WDM</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
