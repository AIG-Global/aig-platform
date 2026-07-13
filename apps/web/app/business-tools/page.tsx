import Link from 'next/link'

export default function BusinessToolsPage() {
  return (
    <main className="min-h-screen bg-[#0f1217] px-6 py-8 text-[#f5f5dc]">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-[#d4af37]/30 bg-black/30 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Business Tools</p>
        <h1 className="mt-2 text-3xl font-semibold">Business Tools Home</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#c7c2b6]">
          This section is the dedicated Business Tools area. Use the links below to access packages and onboarding.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link href="/business-tools" className="rounded-xl border border-[#d4af37]/35 bg-[#171b21] px-4 py-3 text-sm font-semibold text-[#f5f5dc] hover:bg-[#1f2630]">
            Business Tools Home
          </Link>
          <Link href="/business-tools/packages" className="rounded-xl border border-[#d4af37]/35 bg-[#171b21] px-4 py-3 text-sm font-semibold text-[#f5f5dc] hover:bg-[#1f2630]">
            Packages
          </Link>
          <Link href="/business-tools/join" className="rounded-xl border border-[#d4af37]/35 bg-[#171b21] px-4 py-3 text-sm font-semibold text-[#f5f5dc] hover:bg-[#1f2630]">
            Join
          </Link>
        </div>
      </div>
    </main>
  )
}
