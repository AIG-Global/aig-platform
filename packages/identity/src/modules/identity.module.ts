import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthenticationService } from '../services/authentication.service.js'
import { AuthorizationService } from '../services/authorization.service.js'
import { JwtStrategy } from '../strategies/jwt.strategy.js'
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js'
import { PermissionGuard } from '../guards/permission.guard.js'

/**
 * IdentityModule
 * 
 * Core authentication and authorization module
 * Provides:
 * - JWT strategy for Passport
 * - Authentication service (password hashing, token generation)
 * - Authorization service (permission checking)
 * - JWT and Permission guards for protecting routes
 * 
 * Usage:
 * @Module({
 *   imports: [IdentityModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthenticationService,
    AuthorizationService,
    JwtStrategy,
    JwtAuthGuard,
    PermissionGuard,
  ],
  exports: [
    AuthenticationService,
    AuthorizationService,
    JwtAuthGuard,
    PermissionGuard,
    JwtModule,
    PassportModule,
  ],
})
export class IdentityModule {}
