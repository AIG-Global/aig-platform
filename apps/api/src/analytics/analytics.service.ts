import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record an app usage event
   */
  async recordAppUsage(
    userId: string,
    appSlug: string,
    tier: string,
    isGeneral: boolean,
    country?: string,
    continent?: string,
    city?: string,
    durationSeconds?: number,
  ): Promise<any> {
    return this.prisma.appUsageEvent.create({
      data: {
        user_id: userId,
        app_slug: appSlug,
        session_id: `${userId}-${Date.now()}`,
        duration_seconds: durationSeconds,
        geo_country: country,
        geo_continent: continent,
        geo_city: city,
        user_tier: tier as any,
        is_general: isGeneral,
      },
    })
  }

  /**
   * Get app usage statistics
   */
  async getAppUsageStats(days = 30): Promise<any> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const totalEvents = await this.prisma.appUsageEvent.count({ where: { created_at: { gte: since } } })
    const byApp = await this.prisma.appUsageEvent.groupBy({
      by: ['app_slug'],
      _count: true,
      where: { created_at: { gte: since } },
    })

    return {
      period_days: days,
      total_events: totalEvents,
      by_app: byApp.map((b: any) => ({ app_slug: b.app_slug, count: b._count })),
    }
  }

  /**
   * Track service interest (crypto, investing, wdm, etc)
   */
  async recordServiceInterest(userId: string, service: string, interestLevel: number): Promise<any> {
    return this.prisma.serviceInterest.upsert({
      where: { user_id_service: { user_id: userId, service } },
      create: {
        user_id: userId,
        service,
        interest_level: Math.max(1, Math.min(5, interestLevel)),
      },
      update: {
        interest_level: Math.max(1, Math.min(5, interestLevel)),
        last_updated: new Date(),
      },
    })
  }

  /**
   * Get service interest stats
   */
  async getServiceInterestStats(): Promise<any> {
    const byService = await this.prisma.serviceInterest.groupBy({
      by: ['service'],
      _avg: { interest_level: true },
      _count: true,
    })

    return {
      services: byService.map((s: any) => ({
        service: s.service,
        count: s._count,
        avg_interest: (s._avg.interest_level ?? 0).toFixed(2),
      })),
    }
  }

  /**
   * Get member growth stats by geography
   */
  async getMemberGrowthByGeo(): Promise<any> {
    const byCountry = await this.prisma.user.groupBy({
      by: ['geo_country'],
      _count: true,
      where: { status: 'ACTIVE' as any, deleted_at: null },
    })

    const byContinent = await this.prisma.user.groupBy({
      by: ['geo_continent'],
      _count: true,
      where: { status: 'ACTIVE' as any, deleted_at: null },
    })

    return {
      by_country: byCountry.filter((c: any) => c.geo_country).map((c: any) => ({ country: c.geo_country, members: c._count })),
      by_continent: byContinent.filter((c: any) => c.geo_continent).map((c: any) => ({ continent: c.geo_continent, members: c._count })),
    }
  }

  /**
   * Snapshot analytics for dashboard caching
   */
  async recordAnalyticsSnapshot(
    metricType: string,
    value: number,
    count?: number,
    dimension?: string,
    dimensionValue?: string,
  ): Promise<any> {
    return this.prisma.analyticsSnapshot.create({
      data: {
        period: 'daily',
        period_date: new Date(),
        metric_type: metricType,
        dimension,
        dimension_value: dimensionValue,
        value,
        count: count ?? 0,
      },
    })
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardAnalytics(): Promise<any> {
    const totalMembers = await this.prisma.user.count({ where: { deleted_at: null } })
    const activeMembers = await this.prisma.user.count({ where: { status: 'ACTIVE' as any } })
    const appUsageByApp = await this.getAppUsageStats(30)
    const topCountries = await this.prisma.user.groupBy({
      by: ['geo_country'],
      _count: true,
      where: { status: 'ACTIVE' as any, geo_country: { not: null } },
    })

    const topContinents = await this.prisma.user.groupBy({
      by: ['geo_continent'],
      _count: true,
      where: { status: 'ACTIVE' as any, geo_continent: { not: null } },
    })

    const serviceInterests = await this.getServiceInterestStats()
    const memberGrowth = await this.getMemberGrowthByGeo()

    return {
      members: { total: totalMembers, active: activeMembers },
      app_usage: appUsageByApp,
      top_countries: topCountries.slice(0, 10).map((c: any) => ({ country: c.geo_country, count: c._count })),
      top_continents: topContinents.map((c: any) => ({ continent: c.geo_continent, count: c._count })),
      service_interests: serviceInterests,
      member_growth_by_geo: memberGrowth,
    }
  }
}

