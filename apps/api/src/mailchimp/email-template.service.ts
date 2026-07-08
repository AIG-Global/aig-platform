import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

interface MemberWeeklyData {
  firstName: string
  upcomingCommissions: number
  tokenValueIncrease: number
  investmentValueIncrease: number
  networkNewMembers: number
  newCountriesOpened: string[]
  vaultSize: number
  vaultCapacity: number
  membershipPackage: string
}

@Injectable()
export class EmailTemplateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Build weekly digest HTML for a member
   */
  async buildWeeklyDigest(userId: string, newsContent: string): Promise<string> {
    const memberData = await this.getMemberWeeklyData(userId)

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #d4af37 0%, #e8d4a2 100%); padding: 30px; color: #1a0f15; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; }
    .content { padding: 30px; background: white; }
    .section { margin-bottom: 25px; border-left: 4px solid #d4af37; padding-left: 15px; }
    .section h2 { color: #d4af37; margin-top: 0; font-size: 18px; }
    .metric { display: inline-block; margin-right: 20px; margin-bottom: 10px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #d4af37; }
    .metric-label { font-size: 12px; color: #666; }
    .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 10px 0; }
    .alert.warning { background: #f8d7da; border-color: #f5c6cb; }
    .alert.success { background: #d4edda; border-color: #c3e6cb; }
    .footer { background: #2a1f28; color: #d4af37; padding: 20px; text-align: center; font-size: 12px; }
    .vault-indicator { display: flex; align-items: center; margin: 15px 0; }
    .vault-bar { flex: 1; background: #e0e0e0; height: 20px; border-radius: 10px; margin: 0 10px; overflow: hidden; }
    .vault-fill { background: linear-gradient(90deg, #d4af37 0%, #a38d31 100%); height: 100%; }
    .btn { display: inline-block; background: #d4af37; color: #1a0f15; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; }
    .gamification { background: linear-gradient(135deg, #d4af37 0%, #e8d4a2 50%, #d4af37 100%); color: #1a0f15; padding: 20px; border-radius: 8px; text-align: center; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Welcome, ${memberData.firstName}! 👋</h1>
      <p>Your weekly AIGINVEST Network Report</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Breaking News -->
      <div class="section">
        <h2>📰 Network News</h2>
        ${newsContent}
      </div>

      <!-- Member Performance -->
      <div class="section">
        <h2>📊 Your Performance This Week</h2>
        
        <div>
          <div class="metric">
            <div class="metric-value">€${memberData.upcomingCommissions.toLocaleString()}</div>
            <div class="metric-label">Upcoming Commissions</div>
          </div>
          <div class="metric">
            <div class="metric-value">+€${memberData.investmentValueIncrease.toLocaleString()}</div>
            <div class="metric-label">Investment Growth</div>
          </div>
          <div class="metric">
            <div class="metric-value">+${memberData.tokenValueIncrease.toFixed(2)}%</div>
            <div class="metric-label">Token Value Rise</div>
          </div>
        </div>
      </div>

      <!-- Network Growth -->
      <div class="section">
        <h2>🌍 Network Expansion</h2>
        <p>
          <strong>${memberData.networkNewMembers} new members</strong> joined your network this week! 
          Your referral commission structure means more business in your vault.
        </p>
        ${
          memberData.newCountriesOpened.length > 0
            ? `
        <div class="gamification">
          <h3>🎉 Congratulations! 🎉</h3>
          <p style="font-size: 18px; margin: 10px 0;">
            You've opened <strong>${memberData.newCountriesOpened.join(', ')}</strong> 
            for your business network!
          </p>
          <p>This achievement means:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>✅ Bigger income potential</li>
            <li>✅ Enhanced commission rates</li>
            <li>✅ Access to new market opportunities</li>
          </ul>
          <p style="margin-top: 15px; font-weight: bold; color: #ff6b6b;">
            ⚠️ Important: Ensure your current <strong>${memberData.membershipPackage}</strong> 
            package vault size (€${memberData.vaultCapacity.toLocaleString()}) 
            can accommodate the new incoming revenue. Upgrade if needed!
          </p>
        </div>
          `
            : ''
        }
      </div>

      <!-- Vault Status -->
      <div class="section">
        <h2>🏦 Your Vault Status</h2>
        <div class="vault-indicator">
          <span style="font-size: 12px; color: #666;">Available:</span>
          <div class="vault-bar">
            <div class="vault-fill" style="width: ${(memberData.vaultSize / memberData.vaultCapacity) * 100}%"></div>
          </div>
          <span style="font-size: 12px; color: #666;">€${memberData.vaultSize.toLocaleString()} / €${memberData.vaultCapacity.toLocaleString()}</span>
        </div>
        ${
          memberData.vaultSize > memberData.vaultCapacity * 0.8
            ? `
        <div class="alert warning">
          ⚠️ Your vault is ${Math.round((memberData.vaultSize / memberData.vaultCapacity) * 100)}% full. 
          Consider upgrading to a higher membership package to increase your capacity and maximize earning potential!
        </div>
          `
            : ''
        }
      </div>

      <!-- Call to Action -->
      <div class="section" style="text-align: center; border: none; padding: 20px 0;">
        <a href="https://app.aiginvest.com/dashboard" class="btn">View Full Dashboard →</a>
      </div>

      <!-- Disclaimer -->
      <div class="alert" style="background: #f0f0f0; border: none; font-size: 11px; margin-top: 30px;">
        <p style="margin: 0; color: #666;">
          This email contains important information about your AIGINVEST membership and network activity. 
          All figures are calculated as of this report's generation time.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2026 AIGINVEST - The AI-Powered Business Operating System</p>
      <p>
        <a href="#" style="color: #d4af37; text-decoration: none;">Preferences</a> | 
        <a href="#" style="color: #d4af37; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Get aggregated member data for the week
   */
  private async getMemberWeeklyData(userId: string): Promise<MemberWeeklyData> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: {
            commissions: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
              },
            },
          },
        },
        investments: true,
        northStarTokens: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Calculate upcoming commissions (next 30 days)
    const upcomingCommissions = user.accounts
      ?.reduce((sum, account) => {
        const accountCommissions = account.commissions?.reduce((accSum, comm) => accSum + Number(comm.amount), 0) || 0
        return sum + accountCommissions
      }, 0) || 0

    // Calculate investment growth
    const totalInvestment = user.investments?.reduce((sum, inv) => sum + Number(inv.principal_amount), 0) || 0
    const investmentGains = user.investments?.reduce((sum, inv) => sum + Number(inv.earned_amount), 0) || 0

    // Calculate token value increase
    const tokenValue = user.northStarTokens?.reduce((sum, token) => sum + Number(token.current_value), 0) || 0
    const tokenInitialValue = user.northStarTokens?.reduce((sum, token) => sum + Number(token.purchase_value), 0) || 1
    const tokenValueIncrease = tokenInitialValue > 0 ? ((tokenValue - tokenInitialValue) / tokenInitialValue) * 100 : 0

    // Get new members in network (simplified - would need referral tracking)
    const networkNewMembers = await this.prisma.user.count({
      where: {
        // This would need a referral relationship to calculate properly
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get vault capacity based on membership package
    const vaultCapacity = this.getVaultCapacityByPackage(user.membershipPackage)
    const vaultSize = upcomingCommissions + investmentGains // Simplified calculation

    return {
      firstName: user.first_name || 'Member',
      upcomingCommissions: Math.round(upcomingCommissions),
      investmentValueIncrease: Math.round(investmentGains),
      tokenValueIncrease,
      networkNewMembers,
      newCountriesOpened: await this.getNewCountriesOpened(userId),
      vaultSize,
      vaultCapacity,
      membershipPackage: user.membershipPackage || 'starter',
    }
  }

  /**
   * Get vault capacity based on membership package
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
   * Detect new countries opened by new members in user's network
   */
  private async getNewCountriesOpened(userId: string): Promise<string[]> {
    // This would require:
    // 1. Tracking referrals (who referred whom)
    // 2. Geotagging of new members
    // 3. Checking if this is first member from that country/continent in their network

    // Placeholder implementation
    // In production, would query referral relationships and geotag data
    const newMembers = await this.prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        nationality: { not: null },
      },
      select: { nationality: true },
    })

    const countries = newMembers
      .map(m => m.nationality)
      .filter((c, i, arr) => c && arr.indexOf(c) === i)
      .slice(0, 3) // Limit to 3 countries

    return countries as string[]
  }

  /**
   * Get current news content
   */
  async getCurrentNewsContent(): Promise<string> {
    // In production, fetch from CMS or news service
    return `
    <div style="line-height: 1.8;">
      <h3 style="color: #d4af37; margin-top: 0;">🚀 Platform Updates</h3>
      <ul style="margin: 10px 0;">
        <li><strong>New Investment Hub:</strong> Enhanced tools for tracking your portfolio performance</li>
        <li><strong>AI Market Scanner:</strong> Real-time insights on emerging opportunities in your network</li>
        <li><strong>Mobile App Launch:</strong> Coming next week - manage your vault on the go!</li>
      </ul>
      
      <h3 style="color: #d4af37;">💡 Member Spotlight</h3>
      <p>
        This week's top performer increased their network by 15 members and unlocked a new continent! 
        Read their success story in the dashboard.
      </p>
    </div>
    `
  }
}
