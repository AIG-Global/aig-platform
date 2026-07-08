import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuditService } from './audit.service'

@Injectable()
export class PrivacyService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  /**
   * Export all user data as JSON (GDPR Data Subject Access Request)
   */
  async exportUserData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        memberships: true,
        employees: true,
        addresses: true,
        commissions: true,
        investments: true,
        wallet_transactions: true,
        affiliate_network: true,
        referrals_made: true,
        referrals_received: true,
        general: true,
        diana_conversations: { take: 100 },
        diana_documents: { take: 50 },
        consentRecords: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Log the export
    await this.audit.logDataExported(userId, 'json')

    // Create export log
    await this.prisma.dataExportLog.create({
      data: {
        userId,
        status: 'COMPLETED',
        format: 'json',
      },
    })

    return {
      exportDate: new Date().toISOString(),
      user: this.sanitizeUserData(user),
      accountData: {
        accounts: user.accounts,
        memberships: user.memberships,
        commissions: user.commissions,
        investments: user.investments,
        walletTransactions: user.wallet_transactions,
      },
      networkData: {
        affiliateNetwork: user.affiliate_network,
        referralsMade: user.referrals_made,
        referralsReceived: user.referrals_received,
      },
      consentRecords: user.consentRecords,
      metadata: {
        totalRecords: this.countRecords(user),
        exportedAt: new Date().toISOString(),
        dataControllerEmail: 'privacy@aiginvest.com',
      },
    }
  }

  /**
   * Delete all user data (Right to be forgotten)
   */
  async deleteUserData(userId: string, reason: string = 'User requested deletion') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    try {
      // Start transaction to delete everything
      await this.prisma.$transaction(async (tx) => {
        // Delete user-related data in order of dependencies
        const deletedItems = {
          auditLogs: await tx.auditLog.deleteMany({ where: { userId } }),
          consentRecords: await tx.consentRecord.deleteMany({ where: { userId } }),
          dataExportLogs: await tx.dataExportLog.deleteMany({ where: { userId } }),
          dianConversations: await tx.dianConversation.deleteMany({ where: { user_id: userId } }),
          dianaPersonalMemories: await tx.dianaPersonalMemory.deleteMany({ where: { user_id: userId } }),
          dianaDocuments: await tx.dianaDocument.deleteMany({ where: { user_id: userId } }),
          walletTransactions: await tx.walletTransaction.deleteMany({ where: { user_id: userId } }),
          commissions: await tx.commission.deleteMany({ where: { user_id: userId } }),
          investments: await tx.investment.deleteMany({ where: { user_id: userId } }),
          referrals: await tx.referral.deleteMany({
            where: {
              OR: [
                { referrer_id: userId },
                { referred_id: userId },
              ],
            },
          }),
          memberships: await tx.membership.deleteMany({ where: { user_id: userId } }),
          accounts: await tx.account.deleteMany({ where: { user_id: userId } }),
          employees: await tx.employee.deleteMany({ where: { user_id: userId } }),
          addresses: await tx.address.deleteMany({ where: { user_id: userId } }),
          
          // Finally delete the user
          user: await tx.user.delete({ where: { id: userId } }),
        }

        return deletedItems
      })

      // Log deletion (create a non-associated log for compliance)
      await this.prisma.auditLog.create({
        data: {
          userId: null,
          action: 'ACCOUNT_DELETED',
          resourceType: 'User',
          resourceId: userId,
          reason: `Right to be forgotten - ${reason}`,
          metadata: JSON.stringify({ deletedUser: user.email }),
        },
      })

      return {
        success: true,
        message: `User ${user.email} and all associated data have been permanently deleted`,
        deletedAt: new Date().toISOString(),
        reason: reason,
      }
    } catch (error) {
      console.error('Error deleting user data:', error)
      throw new Error(`Failed to delete user data: ${error.message}`)
    }
  }

  /**
   * Manage user consent
   */
  async updateConsent(
    userId: string,
    consent: {
      marketing?: boolean
      analytics?: boolean
      thirdParty?: boolean
    },
  ) {
    const existing = await this.prisma.consentRecord.findFirst({
      where: { userId },
      orderBy: { consentedAt: 'desc' },
    })

    const record = await this.prisma.consentRecord.create({
      data: {
        userId,
        marketing: consent.marketing ?? existing?.marketing ?? false,
        analytics: consent.analytics ?? existing?.analytics ?? false,
        thirdParty: consent.thirdParty ?? existing?.thirdParty ?? false,
        privacyVersion: '1.0',
      },
    })

    await this.audit.log(userId, {
      action: 'CONSENT_UPDATED',
      resourceType: 'Consent',
      metadata: { consent },
    })

    return record
  }

  /**
   * Get user consent history
   */
  async getConsentHistory(userId: string) {
    return this.prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { consentedAt: 'desc' },
    })
  }

  /**
   * Check if user has given consent for marketing
   */
  async hasMarketingConsent(userId: string): Promise<boolean> {
    const latest = await this.prisma.consentRecord.findFirst({
      where: { userId },
      orderBy: { consentedAt: 'desc' },
    })

    if (!latest) return false
    if (latest.withdrawnAt) return false
    return latest.marketing
  }

  /**
   * Withdraw all consents
   */
  async withdrawAllConsent(userId: string) {
    const latest = await this.prisma.consentRecord.findFirst({
      where: { userId },
      orderBy: { consentedAt: 'desc' },
    })

    if (latest && !latest.withdrawnAt) {
      await this.prisma.consentRecord.update({
        where: { id: latest.id },
        data: { withdrawnAt: new Date() },
      })
    }

    await this.audit.log(userId, {
      action: 'CONSENT_WITHDRAWN',
      resourceType: 'Consent',
      reason: 'User withdrew all consents',
    })

    return { success: true }
  }

  /**
   * Generate privacy impact assessment
   */
  async getPrivacyAssessment(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) throw new Error('User not found')

    const audit = await this.prisma.auditLog.findMany({
      where: { userId },
      select: { action: true },
    })

    const consent = await this.getConsentHistory(userId)

    return {
      userId,
      email: user.email,
      accountAge: this.calculateAge(user.created_at),
      lastLogin: user.last_login,
      dataProcessing: {
        marketingEmails: consent[0]?.marketing || false,
        analytics: consent[0]?.analytics || false,
        thirdPartySharing: consent[0]?.thirdParty || false,
      },
      auditTrail: {
        totalEvents: audit.length,
        recentActions: audit.slice(0, 10).map((a) => a.action),
      },
      dataRetention: {
        accountStatus: user.status,
        deletionEligible: !user.deleted_at,
        recommendation: 'Account can be deleted upon request (GDPR Right to be forgotten)',
      },
    }
  }

  /**
   * Sanitize sensitive user data for export
   */
  private sanitizeUserData(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLogin: user.last_login,
      status: user.status,
      emailVerified: user.email_verified,
      dateOfBirth: user.date_of_birth,
      nationality: user.nationality,
      // Note: password_hash is intentionally excluded
    }
  }

  /**
   * Count total records for a user
   */
  private countRecords(user: any): number {
    let count = 1 // user itself
    count += user.accounts?.length || 0
    count += user.memberships?.length || 0
    count += user.commissions?.length || 0
    count += user.investments?.length || 0
    count += user.wallet_transactions?.length || 0
    count += user.diana_conversations?.length || 0
    count += user.diana_documents?.length || 0
    count += user.consentRecords?.length || 0
    return count
  }

  /**
   * Calculate account age
   */
  private calculateAge(createdAt: Date): string {
    const now = new Date()
    const diff = now.getTime() - createdAt.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const years = Math.floor(days / 365)

    if (years > 0) return `${years} year${years > 1 ? 's' : ''}`
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    return 'Less than a day'
  }
}
