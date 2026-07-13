import Link from 'next/link'

export default function BusinessToolsJoinPage() {
  return (
    <main className="min-h-screen bg-[#0f1217] px-6 py-8 text-[#f5f5dc]">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-[#d4af37]/30 bg-black/30 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Business Tools</p>
        <h1 className="mt-2 text-3xl font-semibold">Join</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#c7c2b6]">
          Join the Business Tools program and get access to tools, packages, and support.
        </p>

        <div className="mt-6">
          <Link href="/business-tools" className="inline-flex rounded-lg border border-[#d4af37]/35 px-4 py-2 text-sm font-semibold text-[#f5f5dc] hover:bg-[#1f2630]">
            Back to Business Tools Home
          </Link>
        </div>
      </div>
    </main>
  )
}
