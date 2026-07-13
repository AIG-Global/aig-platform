import { NextRequest, NextResponse } from 'next/server'
import {
  AUTH_SESSION_COOKIE,
  authSessionMaxAge,
  createAuthSessionToken,
  readAuthSessionToken,
} from '../../../../lib/auth-session'
import { normalizeMembershipId } from '../../../../lib/toolkit-apps'

export async function GET(req: NextRequest) {
  const session = readAuthSessionToken(req.cookies.get(AUTH_SESSION_COOKIE)?.value)

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    session,
  })
}

export async function POST(req: NextRequest) {
  let body: { email?: string; packageId?: string; userName?: string; userPassword?: string } = {}

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const packageId = normalizeMembershipId(body.packageId)
  const userName = body.userName?.trim() || undefined
  const userPassword = body.userPassword?.trim() || undefined

  const token = createAuthSessionToken({
    email,
    packageId,
    userName,
    userPassword,
  })

  const response = NextResponse.json({
    authenticated: true,
    session: {
      email,
      packageId,
      userName,
      userPassword,
    },
  })

  response.cookies.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: authSessionMaxAge,
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(AUTH_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
