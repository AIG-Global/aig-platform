/**
 * JWT Strategy
 * 
 * Passport strategy for JWT token validation
 * Used by AuthGuard for protecting endpoints
 */

import { Injectable, Optional } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { TokenPayload } from '../models'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Optional() secret?: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || process.env.JWT_SECRET || 'dev-secret-key',
    })
  }

  async validate(payload: TokenPayload) {
    return {
      userId: payload.userId,
      organizationId: payload.organizationId,
      roleIds: payload.roleIds,
      permissions: payload.permissions,
    }
  }
}
