import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  /**
   * POST /api/auth/login
   * Email-only login: upserts user, returns profile
   * MVP: no password required — identity is email-based
   */
  @Post('login')
  async login(@Body() body: { email: string; displayName?: string }) {
    const email = body.email?.trim().toLowerCase()
    if (!email) {
      throw new Error('Email is required')
    }

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        lastLoginAt: new Date(),
        ...(body.displayName && { displayName: body.displayName }),
      },
      create: {
        email,
        displayName: body.displayName || email.split('@')[0],
        lastLoginAt: new Date(),
      },
    })

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }
  }

  /**
   * GET /api/auth/me/:userId
   * Return user profile
   */
  @Get('me/:userId')
  async getProfile(@Param('userId') userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    }
  }
}
