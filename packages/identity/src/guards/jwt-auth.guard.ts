/**
 * Auth Guard
 * 
 * NestJS guard for JWT authentication
 * Can be applied to controllers/routes that require authentication
 */

import { Injectable } from '@nestjs/common'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends PassportAuthGuard('jwt') {}
