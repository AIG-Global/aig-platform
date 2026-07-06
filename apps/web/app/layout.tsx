export const metadata = {
  title: 'AIGINVEST — Turn every goal into completed work',
  description: 'Your AI companion for building, learning, and organizing work.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { -webkit-text-size-adjust: 100%; }
          body { min-height: 100dvh; overflow-x: hidden; }
          button { font-family: inherit; }
          input, textarea { font-family: inherit; }
          @media (max-width: 640px) {
            .desktop-only { display: none !important; }
          }
          @media (min-width: 641px) {
            .mobile-only { display: none !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

