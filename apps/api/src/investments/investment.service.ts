import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { FundType, InvestmentFundStatus } from '@prisma/client'

const INVESTMENT_COMMISSION_PERCENT = 15.0 // 15% commission
const COMMISSION_TO_NETWORK = 0.8 // 80% to network
const COMMISSION_TO_POOL = 0.2 // 20% to management pool

// Interest rates by duration (annual, simplified)
const INTEREST_RATES: Record<string, number> = {
  LONG_TERM_3Y: 5.5,
  LONG_TERM_5Y: 6.5,
  LONG_TERM_7Y: 7.5,
  LONG_TERM_10Y: 8.5,
  NORTH_STAR: 0, // North Star uses token appreciation, not interest
}

const DURATIONS_MONTHS: Record<string, number> = {
  LONG_TERM_3Y: 36,
  LONG_TERM_5Y: 60,
  LONG_TERM_7Y: 84,
  LONG_TERM_10Y: 120,
  NORTH_STAR: 0,
}

@Injectable()
export class InvestmentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new investment fund
   */
  async createInvestmentFund(
    userId: string,
    fundType: string,
    principalEurCents: bigint,
    reinvestOnMaturity = true,
  ): Promise<any> {
    // Calculate commission
    const commissionCents = BigInt(Math.floor(Number(principalEurCents) * (INVESTMENT_COMMISSION_PERCENT / 100)))

    // Calculate maturity date
    let maturityDate: Date | null = null
    if ((DURATIONS_MONTHS[fundType] ?? 0) > 0) {
      maturityDate = new Date()
      maturityDate.setMonth(maturityDate.getMonth() + (DURATIONS_MONTHS[fundType] ?? 0))
    }

    const fund = await this.prisma.investmentFund.create({
      data: {
        user_id: userId,
        fund_type: fundType as any,
        principal_eur: principalEurCents,
        current_balance_eur: principalEurCents,
        accrued_interest_eur: 0n,
        duration_months: DURATIONS_MONTHS[fundType] ?? null,
        maturity_month: maturityDate,
        reinvest_on_maturity: reinvestOnMaturity,
        commission_eur: commissionCents,
        status: InvestmentFundStatus.ACTIVE,
        investment_month: new Date(),
      },
    })

    return fund
  }

  /**
   * Calculate interest for a fund (simplified annual compound)
   */
  async calculateAndApplyInterest(fundId: string): Promise<bigint> {
    const fund = await this.prisma.investmentFund.findUnique({ where: { id: fundId } })
    if (!fund) throw new NotFoundException('Fund not found')
    if (fund.status !== InvestmentFundStatus.ACTIVE) return 0n

    const rate = INTEREST_RATES[fund.fund_type] ?? 0
    const months = Math.floor((Date.now() - fund.investment_month.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = months / 12

    // Compound interest: A = P(1 + r)^t
    const interest = BigInt(Math.floor(Number(fund.principal_eur) * (Math.pow(1 + rate / 100, years) - 1)))

    await this.prisma.investmentFund.update({
      where: { id: fundId },
      data: { accrued_interest_eur: interest },
    })

    return interest
  }

  /**
   * Check for mature funds and handle reinvestment/release
   */
  async processMatureFunds(userId: string): Promise<any> {
    const now = new Date()
    const maturedFunds = await this.prisma.investmentFund.findMany({
      where: {
        user_id: userId,
        status: InvestmentFundStatus.ACTIVE,
        maturity_month: { lte: now },
      },
    })

    const results = []
    for (const fund of maturedFunds) {
      // Recalculate interest one final time
      await this.calculateAndApplyInterest(fund.id)

      const updated = await this.prisma.investmentFund.findUnique({ where: { id: fund.id } })
      const totalEur = (updated?.principal_eur ?? 0n) + (updated?.accrued_interest_eur ?? 0n)

      if (fund.reinvest_on_maturity) {
        // Create new fund with same type and reinvested amount
        const newFund = await this.createInvestmentFund(userId, fund.fund_type, totalEur, true)

        await this.prisma.investmentFund.update({
          where: { id: fund.id },
          data: {
            status: InvestmentFundStatus.REINVESTED,
            matured_at: now,
          },
        })

        results.push({ old_fund_id: fund.id, reinvested_as: newFund.id, total_reinvested_eur: totalEur })
      } else {
        // Release to AIG Cash account
        const release = await this.prisma.investmentRelease.create({
          data: {
            investment_fund_id: fund.id,
            user_id: userId,
            principal_eur: fund.principal_eur,
            interest_eur: updated?.accrued_interest_eur ?? 0n,
            total_release_eur: totalEur,
            released_to_account_id: 'aig-cash-account', // Placeholder
          },
        })

        await this.prisma.investmentFund.update({
          where: { id: fund.id },
          data: {
            status: InvestmentFundStatus.RELEASED,
            released_at: now,
          },
        })

        results.push({ fund_id: fund.id, released_to_aig_cash: totalEur })
      }
    }

    return results
  }

  /**
   * Get all investment funds for a user
   */
  async getUserFunds(userId: string): Promise<any[]> {
    const funds = await this.prisma.investmentFund.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    })

    // Recalculate interest for active funds
    for (const fund of funds) {
      if (fund.status === InvestmentFundStatus.ACTIVE) {
        await this.calculateAndApplyInterest(fund.id)
      }
    }

    return funds
  }

  /**
   * Get investment portfolio summary
   */
  async getPortfolioSummary(userId: string): Promise<any> {
    const funds = await this.getUserFunds(userId)

    const byType: Record<string, any> = {
      LONG_TERM_3Y: { count: 0, total_invested: 0n, total_interest: 0n },
      LONG_TERM_5Y: { count: 0, total_invested: 0n, total_interest: 0n },
      LONG_TERM_7Y: { count: 0, total_invested: 0n, total_interest: 0n },
      LONG_TERM_10Y: { count: 0, total_invested: 0n, total_interest: 0n },
      NORTH_STAR: { count: 0, total_invested: 0n, total_interest: 0n },
    }

    let totalInvested = 0n
    let totalInterest = 0n
    let totalCommission = 0n

    for (const fund of funds) {
      if (fund.status === InvestmentFundStatus.ACTIVE) {
        byType[fund.fund_type].count++
        byType[fund.fund_type].total_invested += fund.principal_eur
        byType[fund.fund_type].total_interest += fund.accrued_interest_eur
        totalInvested += fund.principal_eur
        totalInterest += fund.accrued_interest_eur
        totalCommission += fund.commission_eur
      }
    }

    return {
      summary: {
        total_invested_eur: Number(totalInvested) / 100,
        total_interest_eur: Number(totalInterest) / 100,
        total_commission_eur: Number(totalCommission) / 100,
      },
      by_type: Object.fromEntries(
        Object.entries(byType).map(([type, data]: any) => [
          type,
          {
            count: data.count,
            total_invested_eur: Number(data.total_invested) / 100,
            total_interest_eur: Number(data.total_interest) / 100,
          },
        ]),
      ),
      funds,
    }
  }

  /**
   * Get aggregate investment statistics
   */
  async getGlobalInvestmentStats(): Promise<any> {
    const totalFunds = await this.prisma.investmentFund.count()
    const activeCount = await this.prisma.investmentFund.count({ where: { status: InvestmentFundStatus.ACTIVE } })
    const maturedCount = await this.prisma.investmentFund.count({ where: { status: InvestmentFundStatus.MATURED } })
    const totalInvested = await this.prisma.investmentFund.aggregate({ _sum: { principal_eur: true } })
    const totalInterest = await this.prisma.investmentFund.aggregate({ _sum: { accrued_interest_eur: true } })

    const byFundType = await this.prisma.investmentFund.groupBy({
      by: ['fund_type'],
      _sum: { principal_eur: true },
      _count: true,
    })

    return {
      total_funds: totalFunds,
      active: activeCount,
      matured: maturedCount,
      total_invested_eur: Number(totalInvested._sum.principal_eur ?? 0) / 100,
      total_interest_eur: Number(totalInterest._sum.accrued_interest_eur ?? 0) / 100,
      by_fund_type: byFundType.map((t: any) => ({
        fund_type: t.fund_type,
        count: t._count,
        invested_eur: Number(t._sum.principal_eur ?? 0) / 100,
      })),
    }
  }
}

