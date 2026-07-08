import { Controller, Get, Post, Param, Query } from '@nestjs/common'
import { AppsService } from './apps.service.js'

@Controller('apps')
export class AppsController {
  constructor(private appsService: AppsService) {}

  @Post('initialize')
  async initializeApps() {
    const apps = await this.appsService.initializeApps()
    return {
      message: 'Apps initialized',
      count: apps.length,
      apps: apps.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
      })),
    }
  }

  @Get()
  async getAllApps() {
    const apps = await this.appsService.getAllApps()
    return {
      count: apps.length,
      apps,
    }
  }

  @Get('for-tier/:tier')
  async getAppsForTier(@Param('tier') tier: string) {
    const apps = await this.appsService.getAppsForTier(tier as any)
    return {
      tier,
      count: apps.length,
      apps,
    }
  }

  @Get('user/:userId')
  async getUserApps(@Param('userId') userId: string) {
    const apps = await this.appsService.getUserApps(userId)
    return {
      userId,
      count: apps.length,
      apps,
    }
  }

  @Get('check-access/:userId/:appSlug')
  async checkAccess(@Param('userId') userId: string, @Param('appSlug') appSlug: string) {
    const hasAccess = await this.appsService.hasAppAccess(userId, appSlug)
    return {
      userId,
      appSlug,
      hasAccess,
    }
  }

  @Get(':slug')
  async getAppBySlug(@Param('slug') slug: string) {
    return await this.appsService.getAppBySlug(slug)
  }
}
