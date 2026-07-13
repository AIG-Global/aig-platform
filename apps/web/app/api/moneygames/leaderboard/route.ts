import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { AUTH_SESSION_COOKIE, readAuthSessionToken } from '../../../../lib/auth-session'

type MonthEntry = {
  email: string
  nickname: string
  coins: number
  updatedAt: string
}

type LeaderboardStore = {
  months: Record<string, Record<string, MonthEntry>>
}

const STORE_FILE = path.resolve(process.cwd(), '.data', 'moneygames-leaderboard.json')

const ensureMonthKey = (value?: string | null) => {
  const v = String(value || '').trim()
  return /^\d{4}-\d{2}$/.test(v) ? v : currentMonthKey()
}

const currentMonthKey = (d = new Date()) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

const readStore = async (): Promise<LeaderboardStore> => {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8')
    const parsed = JSON.parse(raw) as LeaderboardStore
    if (!parsed || typeof parsed !== 'object' || !parsed.months || typeof parsed.months !== 'object') {
      return { months: {} }
    }
    return parsed
  } catch {
    return { months: {} }
  }
}

const writeStore = async (store: LeaderboardStore) => {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true })
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf8')
}

const getAuthedSession = (req: NextRequest) => {
  return readAuthSessionToken(req.cookies.get(AUTH_SESSION_COOKIE)?.value)
}

export async function GET(req: NextRequest) {
  const session = getAuthedSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = req.nextUrl.searchParams
  const period = search.get('period') === 'yearly' ? 'yearly' : 'monthly'
  const monthKey = ensureMonthKey(search.get('monthKey'))
  const year = parseInt(search.get('year') || monthKey.slice(0, 4), 10)

  const store = await readStore()
  const months = store.months || {}

  if (period === 'monthly') {
    const monthRows = Object.values(months[monthKey] || {})
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 100)
      .map((row) => ({ nickname: row.nickname, coins: row.coins }))

    return NextResponse.json({ period, monthKey, rows: monthRows })
  }

  const perUserBest: Record<string, { nickname: string; bestMonthCoins: number }> = {}
  const yearPrefix = `${year}-`

  for (const [mk, monthEntries] of Object.entries(months)) {
    if (!mk.startsWith(yearPrefix)) continue

    for (const row of Object.values(monthEntries || {})) {
      const existing = perUserBest[row.email]
      if (!existing || row.coins > existing.bestMonthCoins) {
        perUserBest[row.email] = {
          nickname: row.nickname,
          bestMonthCoins: row.coins,
        }
      }
    }
  }

  const rows = Object.values(perUserBest)
    .sort((a, b) => b.bestMonthCoins - a.bestMonthCoins)
    .slice(0, 100)

  return NextResponse.json({ period, year, rows })
}

export async function POST(req: NextRequest) {
  const session = getAuthedSession(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { email?: string; nickname?: string; coins?: number; monthKey?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const sessionEmail = session.email.trim().toLowerCase()
  const email = String(body.email || '').trim().toLowerCase()
  if (!email || email !== sessionEmail) {
    return NextResponse.json({ error: 'Invalid user email' }, { status: 400 })
  }

  const nickname = String(body.nickname || '').trim().slice(0, 30)
  if (!nickname) {
    return NextResponse.json({ error: 'Nickname is required' }, { status: 400 })
  }

  const coins = Math.max(0, Math.floor(Number(body.coins || 0)))
  const monthKey = ensureMonthKey(body.monthKey)

  const store = await readStore()
  if (!store.months[monthKey]) store.months[monthKey] = {}

  store.months[monthKey][email] = {
    email,
    nickname,
    coins,
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)

  return NextResponse.json({ ok: true, monthKey, coins })
}
