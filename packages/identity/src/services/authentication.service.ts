/**
 * Authentication Service
 * 
 * Handles user authentication, password hashing, token generation
 * Supports JWT-based authentication and refresh token flow
 */

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { User, TokenPayload, Session, CreateSessionRequest } from '../models'

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Generate access token JWT
   */
  generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss'>): string {
    return this.jwtService.sign(
      {
        ...payload,
        iss: 'aig-platform',
      },
      {
        expiresIn: '24h',
      },
    )
  }

  /**
   * Generate refresh token JWT
   */
  generateRefreshToken(userId: string, organizationId: string): string {
    return this.jwtService.sign(
      {
        userId,
        organizationId,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
      },
    )
  }

  /**
   * Verify and decode token
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.verify(token) as TokenPayload
    } catch (error) {
      return null
    }
  }

  /**
   * Create a new session
   */
  createSession(data: CreateSessionRequest): Session {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    return {
      id: uuidv4(),
      userId: data.userId,
      organizationId: data.organizationId,
      accessToken: '', // Will be set by caller
      refreshToken: undefined,
      deviceId: data.deviceId,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      expiresAt,
      active: true,
      createdAt: now,
      lastActivityAt: now,
    }
  }

  /**
   * Invalidate session
   */
  invalidateSession(session: Session): void {
    session.active = false
    session.invalidatedAt = new Date()
  }

  /**
   * Check if session is valid
   */
  isSessionValid(session: Session): boolean {
    return session.active && session.expiresAt > new Date()
  }
}
