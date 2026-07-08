import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { MembershipTier, CommissionSource, CommissionStatus } from '@prisma/client'

interface CommissionCalculationInput {
  referredUserId: string
  referrerUserId: string
  sourceType: CommissionSource
  sourceId: string
  baseAmount: bigint // Amount in cents
}

interface CommissionResult {
  level: number
  userId: string
  amount: bigint
  percent: number
}

@Injectable()
export class CommissionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get commission percentage for a specific tier and affiliate level
   */
  async getCommissionRate(tier: MembershipTier, level: number): Promise<number> {
    const rule = await this.prisma.commissionRule.findUnique({
      where: {
        tier_level_source: {
          tier,
          level,
          source: CommissionSource.REFERRAL,
        },
      },
    })
    return rule?.percent || 0
  }

  /**
   * Get all upline referrers for a user (all levels above them)
   */
  async getUplineReferrers(userId: string, maxLevels: number = 10): Promise<Array<{ userId: string; level: number; tier: MembershipTier }>> {
    const upline: Array<{ userId: string; level: number; tier: MembershipTier }> = []
    let currentUserId = userId
    let currentLevel = 1

    // Traverse upline through referral chain
    while (currentLevel <= maxLevels) {
      const referral = await this.prisma.referral.findFirst({
        where: {
          referred_id: currentUserId,
          status: 'ACTIVE',
        },
        include: {
          referrer: {
            include: {
              memberships: {
                where: { status: 'ACTIVE' },
                take: 1,
              },
            },
          },
        },
      })

      if (!referral) break

      const membership = referral.referrer.memberships[0]
      if (!membership) break

      upline.push({
        userId: referral.referrer_id,
        level: currentLevel,
        tier: membership.tier as MembershipTier,
      })

      currentUserId = referral.referrer_id
      currentLevel++
    }

    return upline
  }

  /**
   * Calculate commission distribution across upline
   * Returns array of commission records to be created
   */
  async calculateCommissionDistribution(input: CommissionCalculationInput): Promise<CommissionResult[]> {
    const upline = await this.getUplineReferrers(input.referredUserId, 10)
    const commissions: CommissionResult[] = []

    // Calculate commission for each upline member
    for (const uplineMember of upline) {
      const percent = await this.getCommissionRate(uplineMember.tier, uplineMember.level)

      if (percent > 0) {
        const commission = (input.baseAmount * BigInt(Math.floor(percent * 100))) / BigInt(10000)

        commissions.push({
          level: uplineMember.level,
          userId: uplineMember.userId,
          amount: commission,
          percent,
        })
      }
    }

    return commissions
  }

  /**
   * Create commission records in database
   */
  async createCommissions(
    commissions: CommissionResult[],
    sourceType: CommissionSource,
    sourceId: string
  ): Promise<any[]> {
    const created = await Promise.all(
      commissions.map((comm) =>
        this.prisma.commission.create({
          data: {
            user_id: comm.userId,
            source_type: sourceType,
            source_id: sourceId,
            tier: comm.level,
            level_percent: comm.percent,
            amount_eur: comm.amount,
            status: CommissionStatus.PENDING,
          },
        })
      )
    )
    return created
  }

  /**
   * Process commission for a referral event
   */
  async processReferralCommission(referralId: string, amount: bigint): Promise<void> {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
    })

    if (!referral) throw new Error('Referral not found')

    const input: CommissionCalculationInput = {
      referredUserId: referral.referred_id,
      referrerUserId: referral.referrer_id,
      sourceType: CommissionSource.REFERRAL,
      sourceId: referralId,
      baseAmount: amount,
    }

    const commissions = await this.calculateCommissionDistribution(input)
    await this.createCommissions(commissions, CommissionSource.REFERRAL, referralId)

    // Update affiliate network stats
    await this.updateAffiliateNetworkStats(referral.referrer_id)
  }

  /**
   * Process commission for a membership purchase
   */
  async processMembershipCommission(userId: string, membershipId: string, amount: bigint): Promise<void> {
    // Get referrer (who referred this user to membership)
    const referral = await this.prisma.referral.findFirst({
      where: {
        referred_id: userId,
        status: 'ACTIVE',
      },
    })

    if (!referral) return // No referrer, no commission

    const input: CommissionCalculationInput = {
      referredUserId: userId,
      referrerUserId: referral.referrer_id,
      sourceType: CommissionSource.MEMBERSHIP,
      sourceId: membershipId,
      baseAmount: amount,
    }

    const commissions = await this.calculateCommissionDistribution(input)
    await this.createCommissions(commissions, CommissionSource.MEMBERSHIP, membershipId)

    // Update affiliate network stats
    await this.updateAffiliateNetworkStats(referral.referrer_id)
  }

  /**
   * Process commission for a marketplace order
   */
  async processOrderCommission(buyerId: string, orderId: string, amount: bigint): Promise<void> {
    // Get referrer (who referred this user)
    const referral = await this.prisma.referral.findFirst({
      where: {
        referred_id: buyerId,
        status: 'ACTIVE',
      },
    })

    if (!referral) return

    const input: CommissionCalculationInput = {
      referredUserId: buyerId,
      referrerUserId: referral.referrer_id,
      sourceType: CommissionSource.INVESTMENT,
      sourceId: orderId,
      baseAmount: amount,
    }

    const commissions = await this.calculateCommissionDistribution(input)
    await this.createCommissions(commissions, CommissionSource.INVESTMENT, orderId)

    await this.updateAffiliateNetworkStats(referral.referrer_id)
  }

  /**
   * Update affiliate network statistics
   */
  async updateAffiliateNetworkStats(userId: string): Promise<void> {
    // Count direct referrals
    const directReferrals = await this.prisma.referral.count({
      where: {
        referrer_id: userId,
        status: 'ACTIVE',
      },
    })

    // Count total network
    const totalNetwork = await this.prisma.referral.count({
      where: {
        referrer_id: userId,
      },
    })

    // Sum pending commissions
    const pendingCommissions = await this.prisma.commission.aggregate({
      where: {
        user_id: userId,
        status: CommissionStatus.PENDING,
      },
      _sum: {
        amount_eur: true,
      },
    })

    // Sum paid commissions
    const paidCommissions = await this.prisma.commission.aggregate({
      where: {
        user_id: userId,
        status: CommissionStatus.PAID,
      },
      _sum: {
        amount_eur: true,
      },
    })

    const totalEarned = (paidCommissions._sum.amount_eur || 0n) + (pendingCommissions._sum.amount_eur || 0n)

    await this.prisma.affiliateNetwork.upsert({
      where: { user_id: userId },
      update: {
        direct_referrals_count: directReferrals,
        total_network_size: totalNetwork,
        total_commissions_pending: pendingCommissions._sum.amount_eur || 0n,
        total_commissions_earned: totalEarned,
      },
      create: {
        user_id: userId,
        direct_referrals_count: directReferrals,
        total_network_size: totalNetwork,
        total_commissions_earned: totalEarned,
        total_commissions_pending: pendingCommissions._sum.amount_eur || 0n,
        current_tier: MembershipTier.FREE,
      },
    })
  }

  /**
   * Get pending commissions for a user
   */
  async getPendingCommissions(userId: string): Promise<bigint> {
    const result = await this.prisma.commission.aggregate({
      where: {
        user_id: userId,
        status: CommissionStatus.PENDING,
      },
      _sum: {
        amount_eur: true,
      },
    })
    return result._sum.amount_eur || 0n
  }

  /**
   * Get total earned commissions for a user
   */
  async getTotalCommissions(userId: string): Promise<bigint> {
    const result = await this.prisma.commission.aggregate({
      where: {
        user_id: userId,
        status: {
          in: [CommissionStatus.PAID, CommissionStatus.APPROVED],
        },
      },
      _sum: {
        amount_eur: true,
      },
    })
    return result._sum.amount_eur || 0n
  }

  /**
   * Initialize commission rules for all tiers
   */
  async initializeCommissionRules(): Promise<void> {
    const rules = [
      // FREE tier - Level 1 only
      { tier: MembershipTier.FREE, level: 1, percent: 10, source: CommissionSource.REFERRAL },

      // STARTER tier - 3 levels
      { tier: MembershipTier.STARTER, level: 1, percent: 26, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.STARTER, level: 2, percent: 15, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.STARTER, level: 3, percent: 8, source: CommissionSource.REFERRAL },

      // PROFESSIONAL tier - 10 levels
      { tier: MembershipTier.PROFESSIONAL, level: 1, percent: 26, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 2, percent: 18, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 3, percent: 12, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 4, percent: 10, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 5, percent: 8, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 6, percent: 6, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 7, percent: 4, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 8, percent: 2, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 9, percent: 1, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.PROFESSIONAL, level: 10, percent: 0.5, source: CommissionSource.REFERRAL },

      // BUSINESS tier - 10 levels (enhanced rates)
      { tier: MembershipTier.BUSINESS, level: 1, percent: 30, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 2, percent: 20, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 3, percent: 15, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 4, percent: 12, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 5, percent: 10, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 6, percent: 8, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 7, percent: 6, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 8, percent: 4, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 9, percent: 2, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.BUSINESS, level: 10, percent: 1, source: CommissionSource.REFERRAL },

      // ENTERPRISE tier - 10 levels (max rates)
      { tier: MembershipTier.ENTERPRISE, level: 1, percent: 35, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 2, percent: 25, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 3, percent: 18, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 4, percent: 15, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 5, percent: 12, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 6, percent: 10, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 7, percent: 8, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 8, percent: 6, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 9, percent: 4, source: CommissionSource.REFERRAL },
      { tier: MembershipTier.ENTERPRISE, level: 10, percent: 2, source: CommissionSource.REFERRAL },
    ]

    // Check if rules already exist
    const existing = await this.prisma.commissionRule.count()
    if (existing > 0) return

    for (const rule of rules) {
      await this.prisma.commissionRule.create({
        data: rule,
      })
    }
  }
}
