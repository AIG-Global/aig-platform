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
  async login(@Body() body: { email: string; first_name?: string }) {
    const email = body.email?.trim().toLowerCase()
    if (!email) {
      throw new Error('Email is required')
    }

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        last_login: new Date(),
        ...(body.first_name && { first_name: body.first_name }),
      },
      create: {
        email,
        first_name: body.first_name || email.split('@')[0],
        last_login: new Date(),
        password_hash: 'oauth', // OAuth placeholder
      },
    })

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      created_at: user.created_at,
      last_login: user.last_login,
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
      first_name: user.first_name,
      created_at: user.created_at,
    }
  }
}
