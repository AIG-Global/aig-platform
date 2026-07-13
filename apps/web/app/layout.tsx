import './globals.css'
import DianaWidget from './components/diana-widget'
import DeletionNoticeBanner from './components/deletion-notice-banner'
import SiteProtection from './components/site-protection'

export const metadata = {
  title: 'AIGINVEST — The AI-Powered Business Operating System',
  description: 'Earn passive income, build your network, and access AI tools all in one unified ecosystem.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DeletionNoticeBanner />
        <SiteProtection />
        {children}
        <DianaWidget />
      </body>
    </html>
  )
}

