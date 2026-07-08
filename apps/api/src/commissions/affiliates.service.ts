import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { ReferralStatus, MembershipTier } from '@prisma/client'
import { CommissionsService } from './commissions.service.js'

@Injectable()
export class AffiliatesService {
  constructor(
    private prisma: PrismaService,
    private commissionsService: CommissionsService
  ) {}

  /**
   * Generate a unique referral code for a user
   */
  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    // Format: FirstName-LastName-UserId (e.g., john-doe-abc123)
    const firstName = user.first_name?.toLowerCase().replace(/\s+/g, '') || 'user'
    const lastName = user.last_name?.toLowerCase().replace(/\s+/g, '') || ''
    const suffix = userId.slice(0, 6)

    return `${firstName}-${lastName}-${suffix}`.replace(/--+/g, '-')
  }

  /**
   * Create a referral relationship
   */
  async createReferral(referrerUserId: string, referredUserId: string, referralCode?: string): Promise<any> {
    // Check if users exist
    const referrer = await this.prisma.user.findUnique({ where: { id: referrerUserId } })
    const referred = await this.prisma.user.findUnique({ where: { id: referredUserId } })

    if (!referrer || !referred) throw new NotFoundException('User not found')
    if (referrerUserId === referredUserId) throw new BadRequestException('Cannot refer yourself')

    // Check if referral already exists
    const existing = await this.prisma.referral.findUnique({
      where: {
        referrer_id_referred_id: {
          referrer_id: referrerUserId,
          referred_id: referredUserId,
        },
      },
    })

    if (existing) throw new BadRequestException('Referral already exists')

    // Get referrer's membership tier to determine starting level
    const referrerMembership = await this.prisma.membership.findFirst({
      where: { user_id: referrerUserId, status: 'ACTIVE' },
    })

    const tier = referrerMembership?.tier || MembershipTier.FREE
    const maxLevels = this.getMaxLevelsForTier(tier)

    // Create referral with tier 1 (will be updated when referred user makes purchase)
    const referral = await this.prisma.referral.create({
      data: {
        referrer_id: referrerUserId,
        referred_id: referredUserId,
        referral_code: referralCode,
        tier: 1,
        status: ReferralStatus.ACTIVE,
      },
      include: {
        referrer: true,
        referred: true,
      },
    })

    // Initialize affiliate network for referred user if needed
    await this.prisma.affiliateNetwork.upsert({
      where: { user_id: referredUserId },
      update: {},
      create: {
        user_id: referredUserId,
        current_tier: MembershipTier.FREE,
        direct_referrals_count: 0,
        total_network_size: 0,
        total_commissions_earned: 0n,
        total_commissions_pending: 0n,
      },
    })

    // Update referrer's affiliate network stats
    await this.commissionsService.updateAffiliateNetworkStats(referrerUserId)

    return referral
  }

  /**
   * Get referral code validity and info
   */
  async validateReferralCode(referralCode: string): Promise<any> {
    const referral = await this.prisma.referral.findFirst({
      where: { referral_code: referralCode, status: ReferralStatus.ACTIVE },
      include: {
        referrer: {
          include: {
            memberships: { where: { status: 'ACTIVE' }, take: 1 },
          },
        },
      },
    })

    if (!referral) throw new NotFoundException('Invalid or inactive referral code')

    return {
      valid: true,
      referralCode: referral.referral_code,
      referrerId: referral.referrer_id,
      referrerName: `${referral.referrer.first_name} ${referral.referrer.last_name}`,
      referrerTier: referral.referrer.memberships[0]?.tier || MembershipTier.FREE,
    }
  }

  /**
   * Get all downline referrals (multi-level)
   */
  async getDownline(userId: string, maxDepth: number = 10): Promise<any[]> {
    const downline: any[] = []
    const queue: Array<{ userId: string; depth: number }> = [{ userId, depth: 0 }]

    while (queue.length > 0) {
      const { userId: currentId, depth } = queue.shift()!

      if (depth >= maxDepth) continue

      const referrals = await this.prisma.referral.findMany({
        where: {
          referrer_id: currentId,
          status: ReferralStatus.ACTIVE,
        },
        include: {
          referred: {
            include: {
              memberships: { where: { status: 'ACTIVE' }, take: 1 },
            },
          },
        },
      })

      for (const ref of referrals) {
        downline.push({
          id: ref.id,
          userId: ref.referred_id,
          name: `${ref.referred.first_name} ${ref.referred.last_name}`,
          tier: ref.referred.memberships[0]?.tier || MembershipTier.FREE,
          level: ref.tier,
          status: ref.status,
          referredAt: ref.referred_at,
        })

        queue.push({ userId: ref.referred_id, depth: depth + 1 })
      }
    }

    return downline
  }

  /**
   * Get affiliate network dashboard stats
   */
  async getNetworkStats(userId: string): Promise<any> {
    const affiliateNet = await this.prisma.affiliateNetwork.findUnique({
      where: { user_id: userId },
    })

    if (!affiliateNet) throw new NotFoundException('Affiliate network not found')

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: { where: { status: 'ACTIVE' }, take: 1 },
      },
    })

    const downline = await this.getDownline(userId)

    // Calculate by level
    const byLevel: Record<number, number> = {}
    downline.forEach((d) => {
      byLevel[d.level] = (byLevel[d.level] || 0) + 1
    })

    const pending = await this.commissionsService.getPendingCommissions(userId)
    const total = await this.commissionsService.getTotalCommissions(userId)

    return {
      userId,
      userName: `${user?.first_name} ${user?.last_name}`,
      currentTier: user?.memberships[0]?.tier || MembershipTier.FREE,
      fastTrackerStatus: affiliateNet.fast_tracker_status,
      directReferrals: affiliateNet.direct_referrals_count,
      totalNetworkSize: affiliateNet.total_network_size,
      downlineByLevel: byLevel,
      commissionsEarned: {
        eur: (Number(affiliateNet.total_commissions_earned) / 100).toFixed(2),
        cents: affiliateNet.total_commissions_earned.toString(),
      },
      commissionsPending: {
        eur: (Number(pending) / 100).toFixed(2),
        cents: pending.toString(),
      },
      estimatedMonthly: {
        eur: (Number(pending) / 100).toFixed(2),
      },
    }
  }

  /**
   * Get top affiliates (leaderboard)
   */
  async getLeaderboard(limit: number = 10, tier?: MembershipTier): Promise<any[]> {
    let query = this.prisma.affiliateNetwork.findMany({
      take: limit,
      orderBy: { total_commissions_earned: 'desc' },
      include: {
        user: {
          include: {
            memberships: { where: { status: 'ACTIVE' }, take: 1 },
          },
        },
      },
    })

    const networks = await query

    return networks
      .filter((n) => !tier || n.user?.memberships[0]?.tier === tier)
      .map((n, idx) => ({
        rank: idx + 1,
        userId: n.user_id,
        userName: `${n.user?.first_name} ${n.user?.last_name}`,
        tier: n.user?.memberships[0]?.tier || MembershipTier.FREE,
        directReferrals: n.direct_referrals_count,
        networkSize: n.total_network_size,
        totalEarned: {
          eur: (Number(n.total_commissions_earned) / 100).toFixed(2),
        },
      }))
  }

  /**
   * Get fast tracker rankings
   */
  async getFastTrackerRankings(): Promise<any[]> {
    const rankings = await this.prisma.affiliateNetwork.findMany({
      where: {
        fast_tracker_status: {
          not: null,
        },
      },
      orderBy: { total_commissions_earned: 'desc' },
      include: {
        user: true,
      },
    })

    return rankings.map((r, idx) => ({
      rank: idx + 1,
      userId: r.user_id,
      userName: `${r.user?.first_name} ${r.user?.last_name}`,
      status: r.fast_tracker_status,
      networkSize: r.total_network_size,
      earnings: {
        eur: (Number(r.total_commissions_earned) / 100).toFixed(2),
      },
    }))
  }

  /**
   * Update fast tracker status based on performance
   */
  async updateFastTrackerStatus(userId: string): Promise<void> {
    const network = await this.prisma.affiliateNetwork.findUnique({
      where: { user_id: userId },
    })

    if (!network) return

    let status: string | null = null

    // Silver: 10+ direct referrals
    if (network.direct_referrals_count >= 10) status = 'Silver'

    // Gold: 25+ direct referrals OR €5k earned
    if (network.direct_referrals_count >= 25 || network.total_commissions_earned >= 500000n) {
      status = 'Gold'
    }

    // Platinum: 50+ direct referrals OR €20k earned
    if (network.direct_referrals_count >= 50 || network.total_commissions_earned >= 2000000n) {
      status = 'Platinum'
    }

    // Diamond: 100+ direct referrals OR €100k earned
    if (network.direct_referrals_count >= 100 || network.total_commissions_earned >= 10000000n) {
      status = 'Diamond'
    }

    await this.prisma.affiliateNetwork.update({
      where: { user_id: userId },
      data: { fast_tracker_status: status },
    })
  }

  /**
   * Deactivate referral
   */
  async deactivateReferral(referralId: string): Promise<void> {
    await this.prisma.referral.update({
      where: { id: referralId },
      data: { status: ReferralStatus.INACTIVE },
    })
  }

  /**
   * Helper: Get max affiliate levels for tier
   */
  private getMaxLevelsForTier(tier: MembershipTier): number {
    const levels: Record<MembershipTier, number> = {
      FREE: 1,
      STARTER: 3,
      PROFESSIONAL: 10,
      BUSINESS: 10,
      ENTERPRISE: 10,
    }
    return levels[tier] || 1
  }
}
