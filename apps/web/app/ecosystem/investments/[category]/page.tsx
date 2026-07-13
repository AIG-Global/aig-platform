import Link from 'next/link'

type CategoryPageProps = {
  params: {
    category: string
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  'general-info': 'General Info',
  'forex-trading': 'Forex Trading',
  'cfd-trading': 'CFD Trading',
  'crypto-trading': 'Crypto Trading',
  'aig-phone-ltd': 'AIG Phone ltd',
  'long-term-investments': 'Long term investments',
  'other-investments': 'Other investments',
  'aig-cash-trading': 'AIG Cash Trading',
}

export default function InvestmentCategoryPage({ params }: CategoryPageProps) {
  const title = CATEGORY_LABELS[params.category] || 'Investment Category'

  return (
    <main className="min-h-screen bg-[#0f1217] px-6 py-8 text-[#f5f5dc]">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-[#d4af37]/30 bg-black/30 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Investment Hub</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#c7c2b6]">
          This section is reserved for {title}. Content can be expanded here with charts, strategy notes, and related tools.
        </p>

        <div className="mt-6 flex gap-3">
          <Link href="/ecosystem/investments" className="rounded-lg border border-[#d4af37]/35 px-4 py-2 text-sm font-semibold text-[#f5f5dc] hover:bg-[#1f2630]">
            Back to Investments
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-[#f5f5dc] hover:bg-white/10">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
