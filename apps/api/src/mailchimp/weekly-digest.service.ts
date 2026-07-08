import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { MailchimpService } from './mailchimp.service'
import { EmailTemplateService } from './email-template.service'

@Injectable()
export class WeeklyDigestService {
  constructor(
    private prisma: PrismaService,
    private mailchimp: MailchimpService,
    private emailTemplate: EmailTemplateService,
  ) {}

  /**
   * Send weekly digest to all active members
   * Should be called via cron job (e.g., Monday 9 AM)
   */
  async sendWeeklyDigestToAll() {
    console.log('[Weekly Digest] Starting batch send...')
    const startTime = Date.now()

    try {
      // Get all active members
      const members = await this.prisma.user.findMany({
        where: {
          status: 'ACTIVE',
          membershipStatus: {
            in: ['active', null], // active members or legacy
          },
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          membershipPackage: true,
        },
      })

      console.log(`[Weekly Digest] Found ${members.length} active members`)

      // Get common news content
      const newsContent = await this.emailTemplate.getCurrentNewsContent()

      // Send to each member
      const results = {
        success: 0,
        failed: 0,
        errors: [] as any[],
      }

      for (const member of members) {
        try {
          await this.sendWeeklyDigestToMember(member.id, newsContent)
          results.success++
          console.log(`[Weekly Digest] ✓ Sent to ${member.email}`)
        } catch (error) {
          results.failed++
          results.errors.push({
            memberId: member.id,
            email: member.email,
            error: error.message,
          })
          console.error(`[Weekly Digest] ✗ Failed for ${member.email}:`, error.message)
        }

        // Rate limiting: wait 500ms between sends to avoid API throttling
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log(`[Weekly Digest] Complete in ${duration}s - Success: ${results.success}, Failed: ${results.failed}`)

      // Log to database
      await this.prisma.emailCampaign.create({
        data: {
          name: 'Weekly Digest',
          type: 'WEEKLY_DIGEST',
          recipientCount: members.length,
          successCount: results.success,
          failureCount: results.failed,
          status: 'COMPLETED',
          sentAt: new Date(),
          errors: JSON.stringify(results.errors),
        },
      })

      return results
    } catch (error) {
      console.error('[Weekly Digest] Fatal error:', error)
      throw error
    }
  }

  /**
   * Send weekly digest to individual member
   */
  private async sendWeeklyDigestToMember(userId: string, newsContent: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    // Build personalized HTML
    const htmlContent = await this.emailTemplate.buildWeeklyDigest(userId, newsContent)

    // Send via Mailchimp
    await this.mailchimp.sendCampaign(
      `Your Weekly AIGINVEST Report - ${new Date().toLocaleDateString()}`,
      htmlContent,
      ['weekly-digest', user.membershipPackage || 'member'],
      'noreply@aiginvest.com',
    )

    // Log sent email
    await this.prisma.emailLog.create({
      data: {
        userId,
        recipient: user.email,
        subject: 'Your Weekly AIGINVEST Report',
        type: 'WEEKLY_DIGEST',
        status: 'SENT',
        sentAt: new Date(),
      },
    })
  }

  /**
   * Send gamification email when member opens new country
   */
  async sendCountryOpenedEmail(userId: string, countryName: string, continentName: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    const vaultCapacity = this.getVaultCapacityByPackage(user.membershipPackage)

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #d4af37 0%, #e8d4a2 100%); }
    .content { background: white; margin: 20px; padding: 40px; text-align: center; border-radius: 8px; }
    h1 { color: #d4af37; font-size: 36px; margin: 0; }
    .emoji { font-size: 80px; margin: 20px 0; }
    .description { color: #333; font-size: 18px; line-height: 1.8; margin: 20px 0; }
    .benefits { background: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: left; }
    .benefits li { color: #333; margin: 10px 0; }
    .warning { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; color: #856404; }
    .cta { background: #d4af37; color: #1a0f15; padding: 15px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 20px; }
    .footer { background: #1a0f15; color: #d4af37; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="emoji">🎉</div>
      <h1>Congratulations, ${user.first_name}!</h1>
      
      <div class="description">
        <p>You've successfully opened <strong>${countryName}</strong> (${continentName}) for your business network!</p>
        <p>This is a major milestone in your AIGINVEST journey.</p>
      </div>

      <div class="benefits">
        <strong>What This Means for Your Business:</strong>
        <ul>
          <li>✅ <strong>Increased Income:</strong> New market access generates higher commission revenue</li>
          <li>✅ <strong>Enhanced Commissions:</strong> Multi-country networks qualify for higher tier rates</li>
          <li>✅ <strong>Expanded Opportunity:</strong> Access to ${continentName} market ecosystem</li>
          <li>✅ <strong>Growth Potential:</strong> First-mover advantage in this geographic area</li>
        </ul>
      </div>

      <div class="warning">
        <strong>⚠️ Important Note:</strong><br>
        Your current <strong>${user.membershipPackage || 'Starter'}</strong> package has a vault capacity of <strong>€${vaultCapacity.toLocaleString()}</strong>. 
        <br><br>
        With new income flowing in from ${countryName}, ensure your vault size can accommodate the incoming revenue. 
        If you're expecting significant growth, consider upgrading to a higher membership tier to maximize your earning potential!
      </div>

      <a href="https://app.aiginvest.com/dashboard?action=upgrade" class="cta">Upgrade Membership →</a>
    </div>
  </div>

  <div class="footer">
    <p>© 2026 AIGINVEST - The AI-Powered Business Operating System</p>
  </div>
</body>
</html>
    `

    // Send via Mailchimp
    await this.mailchimp.sendCampaign(
      `🎉 You've Opened ${countryName} for Your Business!`,
      htmlContent,
      ['country-opened', user.membershipPackage || 'member'],
      'noreply@aiginvest.com',
    )

    // Log sent email
    await this.prisma.emailLog.create({
      data: {
        userId,
        recipient: user.email,
        subject: `🎉 You've Opened ${countryName} for Your Business!`,
        type: 'COUNTRY_OPENED',
        status: 'SENT',
        sentAt: new Date(),
        metadata: JSON.stringify({
          countryName,
          continentName,
        }),
      },
    })

    console.log(`[Gamification] Sent country opened email to ${user.email} for ${countryName}`)
  }

  /**
   * Get vault capacity by membership package
   */
  private getVaultCapacityByPackage(packageType?: string): number {
    const capacities: Record<string, number> = {
      remittance: 100,
      starter: 1000,
      startup: 5000,
      professional: 10000000,
    }
    return capacities[packageType || 'starter'] || 1000
  }

  /**
   * Get email campaign statistics
   */
  async getCampaignStats(days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const campaigns = await this.prisma.emailCampaign.findMany({
      where: {
        sentAt: {
          gte: since,
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    })

    const emails = await this.prisma.emailLog.findMany({
      where: {
        sentAt: {
          gte: since,
        },
      },
    })

    return {
      campaigns: {
        total: campaigns.length,
        data: campaigns,
        totalRecipients: campaigns.reduce((sum, c) => sum + c.recipientCount, 0),
        totalSuccess: campaigns.reduce((sum, c) => sum + c.successCount, 0),
        totalFailed: campaigns.reduce((sum, c) => sum + c.failureCount, 0),
      },
      emails: {
        total: emails.length,
        byType: emails.reduce(
          (acc, e) => {
            acc[e.type] = (acc[e.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      },
    }
  }
}
