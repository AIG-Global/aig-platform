'use client'

import { useState } from 'react'

const MUSIC_PLAYER_URL = '/games'

export default function MusicPage() {
  const [embedFailed, setEmbedFailed] = useState(false)

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.14), transparent 34%), linear-gradient(145deg, #0b0f13 0%, #12161d 48%, #090c10 100%)',
        color: '#f5f5dc'
      }}
      className="px-4 py-4 sm:px-6 sm:py-6"
    >
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col gap-4 sm:gap-5">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-[#d4af37]/25 bg-[#0f1419] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          {!embedFailed ? (
            <iframe
              title="AIG Music Player"
              src={MUSIC_PLAYER_URL}
              onError={() => setEmbedFailed(true)}
              allow="autoplay; fullscreen"
              style={{ width: '100%', minHeight: '72dvh', border: 'none', backgroundColor: '#0f0f0f' }}
            />
          ) : (
            <div className="flex min-h-[72dvh] flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-lg font-semibold text-[#f5f5dc]">Unable to load the player</p>
              <p className="max-w-xl text-sm text-[#8b8b8b]">
                Open the complete player directly if the iframe is blocked on this device.
              </p>
              <a
                href={MUSIC_PLAYER_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#d4af37]/45 px-4 py-2 text-sm font-semibold text-[#d4af37] transition hover:bg-[#d4af37]/10"
              >
                Open Player Directly
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
