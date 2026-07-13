import crypto from 'crypto'
import { normalizeMembershipId, packageLevel, type MembershipId } from './toolkit-apps'

export const AUTH_SESSION_COOKIE = 'aig_auth_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

export type AuthSessionClaims = {
  email: string
  packageId: MembershipId
  userName?: string
  userPassword?: string
  exp: number
}

const base64url = (value: string) => Buffer.from(value, 'utf8').toString('base64url')

const getSessionSecret = () => {
  const secret = process.env.AIG_TOOLKIT_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET
  if (secret && secret.trim()) return secret
  return 'aig-dev-session-secret-change-me'
}

const sign = (payloadBase64: string) => {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(payloadBase64)
    .digest('base64url')
}

export const createAuthSessionToken = (input: {
  email: string
  packageId: string
  userName?: string
  userPassword?: string
}) => {
  const claims: AuthSessionClaims = {
    email: input.email.trim().toLowerCase(),
    packageId: normalizeMembershipId(input.packageId),
    userName: input.userName?.trim() || undefined,
    userPassword: input.userPassword?.trim() || undefined,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }

  const payload = base64url(JSON.stringify(claims))
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export const readAuthSessionToken = (token: string | undefined | null): AuthSessionClaims | null => {
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expectedSignature = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expectedSignature)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthSessionClaims
    if (!claims.email || !claims.packageId || !claims.exp) return null
    if (claims.exp < Math.floor(Date.now() / 1000)) return null

    return {
      ...claims,
      packageId: normalizeMembershipId(claims.packageId),
    }
  } catch {
    return null
  }
}

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

export const readAuthSessionFromCookies = (cookies: CookieReader): AuthSessionClaims | null => {
  return readAuthSessionToken(cookies.get(AUTH_SESSION_COOKIE)?.value)
}

export const canAccessByPackage = (memberPackage: MembershipId, minimumPackage: MembershipId) => {
  return packageLevel(memberPackage) >= packageLevel(minimumPackage)
}

export const authSessionMaxAge = SESSION_TTL_SECONDS
