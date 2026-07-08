import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { MembershipTier } from '@prisma/client'

@Injectable()
export class AppsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Initialize the 10 core apps in registry
   */
  async initializeApps(): Promise<any[]> {
    const apps = [
      {
        name: 'AIG-Ask',
        slug: 'aig-ask',
        description: 'AI-powered Q&A and knowledge assistant',
        color: '#FF6B6B',
        free_access: true,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-Business-Weather',
        slug: 'aig-business-weather',
        description: 'Market and business intelligence platform',
        color: '#4ECDC4',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-HELO',
        slug: 'aig-helo',
        description: 'Helicopter view analytics dashboard',
        color: '#45B7D1',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-Investor-Alerts',
        slug: 'aig-investor-alerts',
        description: 'Real-time investment opportunity alerts',
        color: '#F7B731',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-MoneyGames',
        slug: 'aig-moneygames',
        description: 'Gamified financial learning platform',
        color: '#5F27CD',
        free_access: true,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-News',
        slug: 'aig-news',
        description: 'Curated financial and business news feed',
        color: '#00D2D3',
        free_access: true,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-Record',
        slug: 'aig-record',
        description: 'Secure document and transaction recording',
        color: '#FF9FF3',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-Secure-Sign',
        slug: 'aig-secure-sign',
        description: 'Blockchain-verified digital signatures',
        color: '#54A0FF',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'AIG-Translate',
        slug: 'aig-translate',
        description: 'Multi-language translation engine',
        color: '#48DBFB',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
      {
        name: 'Diana AI',
        slug: 'diana-ai',
        description: 'Personal AI assistant and chatbot',
        color: '#D4AF37',
        free_access: false,
        starter_access: true,
        professional_access: true,
      },
    ]

    const created = []
    for (const app of apps) {
      const existing = await this.prisma.appRegistry.findUnique({
        where: { slug: app.slug },
      })

      if (!existing) {
        const created_app = await this.prisma.appRegistry.create({
          data: app,
        })
        created.push(created_app)
      } else {
        created.push(existing)
      }
    }

    return created
  }

  /**
   * Get all apps
   */
  async getAllApps(): Promise<any[]> {
    return await this.prisma.appRegistry.findMany({
      orderBy: { created_at: 'asc' },
    })
  }

  /**
   * Get app by slug
   */
  async getAppBySlug(slug: string): Promise<any> {
    const app = await this.prisma.appRegistry.findUnique({
      where: { slug },
    })
    if (!app) throw new NotFoundException('App not found')
    return app
  }

  /**
   * Get apps accessible for a membership tier
   */
  async getAppsForTier(tier: MembershipTier): Promise<any[]> {
    const tierField = this.getTierAccessField(tier)

    const apps = await this.prisma.appRegistry.findMany({
      where: {
        [tierField]: true,
        status: 'ACTIVE',
      },
    })

    return apps
  }

  /**
   * Subscribe user to apps based on membership tier
   */
  async subscribeToTierApps(membershipId: string, tier: MembershipTier): Promise<void> {
    const tierField = this.getTierAccessField(tier)

    // Get all apps accessible for this tier
    const apps = await this.prisma.appRegistry.findMany({
      where: {
        [tierField]: true,
      },
    })

    // Create subscriptions
    for (const app of apps) {
      await this.prisma.appSubscription.upsert({
        where: {
          membership_id_app_id: {
            membership_id: membershipId,
            app_id: app.id,
          },
        },
        update: {},
        create: {
          membership_id: membershipId,
          app_id: app.id,
          access_level: 'INTERNAL',
          granted_at: new Date(),
        },
      })
    }
  }

  /**
   * Get user's subscribed apps
   */
  async getUserApps(userId: string): Promise<any[]> {
    const membership = await this.prisma.membership.findFirst({
      where: { user_id: userId, status: 'ACTIVE' },
    })

    if (!membership) return []

    const subscriptions = await this.prisma.appSubscription.findMany({
      where: { membership_id: membership.id },
      include: { app: true },
    })

    return subscriptions.map((s) => ({
      appId: s.app_id,
      name: s.app.name,
      slug: s.app.slug,
      description: s.app.description,
      color: s.app.color,
      icon_url: s.app.icon_url,
      accessLevel: s.access_level,
      grantedAt: s.granted_at,
    }))
  }

  /**
   * Check if user has access to an app
   */
  async hasAppAccess(userId: string, appSlug: string): Promise<boolean> {
    const membership = await this.prisma.membership.findFirst({
      where: { user_id: userId, status: 'ACTIVE' },
    })

    if (!membership) return false

    const app = await this.prisma.appRegistry.findUnique({
      where: { slug: appSlug },
    })

    if (!app) return false

    const subscription = await this.prisma.appSubscription.findUnique({
      where: {
        membership_id_app_id: {
          membership_id: membership.id,
          app_id: app.id,
        },
      },
    })

    return !!subscription
  }

  /**
   * Helper: Get tier access field name
   */
  private getTierAccessField(tier: MembershipTier): string {
    const fields: Record<MembershipTier, string> = {
      FREE: 'free_access',
      STARTER: 'starter_access',
      PROFESSIONAL: 'professional_access',
      BUSINESS: 'starter_access', // Use starter for business as fallback
      ENTERPRISE: 'professional_access', // Use professional for enterprise as fallback
    }
    return fields[tier]
  }
}
