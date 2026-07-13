'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const GAMES_EMBED_BASE_URL = '/api/games-file/index.html'

export default function GamesPage() {
  const searchParams = useSearchParams()
  const [embedFailed, setEmbedFailed] = useState(false)

  const gamesEmbedUrl = useMemo(() => {
    const tab = (searchParams.get('tab') || '').toLowerCase()
    if (tab === 'slots') {
      return `${GAMES_EMBED_BASE_URL}#slotsView`
    }
    return GAMES_EMBED_BASE_URL
  }, [searchParams])

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.14), transparent 34%), linear-gradient(145deg, #0b0f13 0%, #12161d 48%, #090c10 100%)',
        color: '#f5f5dc',
      }}
      className="px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col gap-4 sm:gap-5">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-[#0f1419] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          {!embedFailed ? (
            <iframe
              title="AIG MoneyGames"
              src={gamesEmbedUrl}
              onError={() => setEmbedFailed(true)}
              allow="autoplay; fullscreen"
              style={{ width: '100%', minHeight: '78dvh', border: 'none', backgroundColor: '#0f0f0f' }}
            />
          ) : (
            <div className="flex min-h-[72dvh] flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-lg font-semibold text-[#f5f5dc]">Unable to load games</p>
              <p className="max-w-xl text-sm text-[#8b8b8b]">
                Open the full games page directly if embedding is blocked on this device.
              </p>
              <a
                href={gamesEmbedUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#d4af37]/45 px-4 py-2 text-sm font-semibold text-[#d4af37] transition hover:bg-[#d4af37]/10"
              >
                Open Games Directly
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
