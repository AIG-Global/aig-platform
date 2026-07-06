/**
 * Session Model
 * 
 * Tracks active user sessions for security and compliance
 */

export interface Session {
  id: string
  userId: string
  organizationId: string
  
  // Session details
  accessToken: string
  refreshToken?: string
  deviceId?: string
  userAgent?: string
  ipAddress?: string
  
  // Expiration
  expiresAt: Date
  
  // Status
  active: boolean
  invalidatedAt?: Date
  
  // Audit
  createdAt: Date
  lastActivityAt: Date
}

export interface CreateSessionRequest {
  userId: string
  organizationId: string
  deviceId?: string
  userAgent?: string
  ipAddress?: string
}

export interface TokenPayload {
  userId: string
  organizationId: string
  roleIds: string[]
  permissions: string[]
  iat: number
  exp: number
  iss: 'aig-platform'
}

export interface JwtConfig {
  secret: string
  expiresIn: string // e.g., '24h', '7d'
  refreshSecret?: string
  refreshExpiresIn?: string
}
