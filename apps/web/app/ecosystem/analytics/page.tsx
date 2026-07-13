import Link from 'next/link'

const analyticsLinks = [
  {
    title: 'Ecosystem Dashboard',
    description: 'Track core ecosystem KPIs and live growth signals.',
    href: '/dashboard',
  },
  {
    title: 'Admin Analytics',
    description: 'Open detailed operational analytics for administrators.',
    href: '/admin/analytics',
  },
  {
    title: 'Investment Analytics',
    description: 'Review portfolio, flows, and investment performance.',
    href: '/ecosystem/investments',
  },
]

export default function EcosystemAnalyticsPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        background:
          'radial-gradient(circle at top, rgba(212,175,55,0.14), transparent 34%), linear-gradient(145deg, #0b0f13 0%, #12161d 48%, #090c10 100%)',
        color: '#f5f5dc',
      }}
      className="px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="rounded-3xl border border-[#d4af37]/25 bg-[#0f1419] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4af37]/80">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f5f5dc] sm:text-4xl">Ecosystem Analytics Hub</h1>
          <p className="mt-3 max-w-3xl text-sm text-[#d8d0bf] sm:text-base">
            Use these links to open your analytics surfaces. The global top bar links are active on this page the
            same way as every other main AIGINVEST route.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyticsLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[#d4af37]/25 bg-[#111822] p-5 text-left transition hover:border-[#d4af37]/55 hover:bg-[#16202d]"
            >
              <h2 className="text-lg font-semibold text-[#f5f5dc]">{item.title}</h2>
              <p className="mt-2 text-sm text-[#cabfa9]">{item.description}</p>
              <p className="mt-4 text-sm font-semibold text-[#d4af37]">Open -></p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
