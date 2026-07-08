'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inviterName = searchParams.get('from') || searchParams.get('ref') || null

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0f15 0%, #2a1f28 50%, #1a0f15 100%)' }}
    >
      {/* Vault Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/images/vault.jpeg"
          alt="background"
          className="w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center',
            filter: 'brightness(0.3) saturate(0.6)',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Diana Image */}
        <div className="mb-6">
          <img
            src="/images/diane_transparent.png"
            alt="Diana"
            className="w-48 h-auto mx-auto drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 24px rgba(212,175,55,0.4))' }}
          />
        </div>

        {/* Speech bubble */}
        <div
          style={{
            backgroundColor: 'rgba(26, 15, 21, 0.70)',
            backdropFilter: 'blur(14px)',
            borderColor: '#d4af37',
          }}
          className="rounded-3xl border-2 px-8 py-7 shadow-2xl w-full"
        >
          {/* Diana label */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              style={{ background: 'linear-gradient(to right, #d4af37, #e8d4a2)', color: '#1a0f15' }}
              className="text-xs font-bold px-3 py-1 rounded-full"
            >
              Diana — Your AI Guide
            </div>
          </div>

          {/* Greeting text */}
          <p style={{ color: '#f5f5dc' }} className="text-lg leading-relaxed mb-3">
            {inviterName ? (
              <>
                Welcome to AIG!{' '}
                <span style={{ color: '#d4af37' }} className="font-semibold">{inviterName}</span>{' '}
                has invited you to join our team and thought you are a similar business-minded person — just like them.
              </>
            ) : (
              <>
                Welcome to AIG! Someone special has invited you to join our team and thought you are a similar business-minded person.
              </>
            )}
          </p>

          <p style={{ color: '#e8e8d0' }} className="text-base leading-relaxed mb-3">
            At AIG, we don&apos;t need to be successful yet — but here, if we work hard, we all will be.
          </p>

          <p style={{ color: '#d4af37' }} className="text-base font-semibold">
            Glad to have you onboard! 🐺
          </p>
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={() => router.push('/auth?mode=invitation')}
            style={{ backgroundColor: '#d4af37', color: '#1a0f15' }}
            className="flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            Enter My Invitation Code
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => router.push('/join')}
            style={{ borderColor: '#d4af37', color: '#d4af37' }}
            className="flex-1 py-4 rounded-xl font-bold text-base border-2 hover:bg-[#d4af37]/10 transition"
          >
            Browse Packs First
          </button>
        </div>

        <button
          onClick={() => router.push('/')}
          style={{ color: '#e8e8d0' }}
          className="mt-5 text-sm opacity-60 hover:opacity-100 transition"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
