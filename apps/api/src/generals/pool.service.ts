import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { CommissionSource, PoolStatus, CommissionStatus } from '@prisma/client'
import { POOL_PERCENT } from './generals.service.js'

@Injectable()
export class PoolService {
  constructor(private prisma: PrismaService) {}

  /**
   * Record a new income event and calculate the 20% pool amount
   */
  async recordIncome(
    sourceType: CommissionSource,
    sourceId: string,
    totalAmountEurCents: bigint,
    description?: string,
  ): Promise<any> {
    const poolAmount = BigInt(Math.floor(Number(totalAmountEurCents) * (POOL_PERCENT / 100)))

    const now = new Date()
    return this.prisma.poolTransaction.create({
      data: {
        source_type: sourceType,
        source_id: sourceId,
        source_description: description,
        total_amount_eur: totalAmountEurCents,
        pool_amount_eur: poolAmount,
        period_month: now.getMonth() + 1,
        period_year: now.getFullYear(),
        status: PoolStatus.PENDING,
      },
    })
  }

  /**
   * Distribute a pool transaction to all active generals based on their effective %
   */
  async distributePoolTransaction(transactionId: string): Promise<any> {
    const transaction = await this.prisma.poolTransaction.findUnique({
      where: { id: transactionId },
    })
    if (!transaction) throw new Error('Pool transaction not found')
    if (transaction.status !== PoolStatus.PENDING) throw new Error('Already distributed')

    const activeGenerals = await this.prisma.general.findMany({
      where: { status: 'ACTIVE' },
    })

    const earnings = activeGenerals.map(g => {
      const effectivePercent = g.allocated_percent - g.distributed_percent
      if (effectivePercent <= 0) return null
      const amount = BigInt(Math.floor(Number(transaction.pool_amount_eur) * (effectivePercent / 100)))
      return { general_id: g.id, transaction_id: transactionId, effective_percent: effectivePercent, amount_eur: amount }
    }).filter(Boolean) as any[]

    await this.prisma.$transaction([
      ...earnings.map(e =>
        this.prisma.poolEarning.upsert({
          where: { general_id_transaction_id: { general_id: e.general_id, transaction_id: e.transaction_id } },
          create: e,
          update: {},
        })
      ),
      this.prisma.poolTransaction.update({
        where: { id: transactionId },
        data: { status: PoolStatus.DISTRIBUTED, distributed_at: new Date() },
      }),
    ])

    return { distributed_to: earnings.length, transaction_id: transactionId }
  }

  /**
   * Get pool summary for admin
   */
  async getPoolSummary(year?: number, month?: number): Promise<any> {
    const where: any = {}
    if (year) where.period_year = year
    if (month) where.period_month = month

    const [transactions, pendingEarnings, paidEarnings, generalBreakdown] = await Promise.all([
      this.prisma.poolTransaction.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      this.prisma.poolEarning.aggregate({
        where: { status: CommissionStatus.PENDING },
        _sum: { amount_eur: true },
        _count: true,
      }),
      this.prisma.poolEarning.aggregate({
        where: { status: CommissionStatus.PAID },
        _sum: { amount_eur: true },
        _count: true,
      }),
      this.prisma.poolEarning.groupBy({
        by: ['general_id'],
        _sum: { amount_eur: true },
        where: { status: CommissionStatus.PENDING },
        orderBy: { _sum: { amount_eur: 'desc' } },
        take: 20,
      }),
    ])

    const totalIncome = transactions.reduce((sum, t) => sum + Number(t.total_amount_eur), 0)
    const totalPool = transactions.reduce((sum, t) => sum + Number(t.pool_amount_eur), 0)

    return {
      period: { year, month },
      totals: {
        total_income_eur: totalIncome,
        total_pool_eur: totalPool,
        pending_earnings_eur: Number(pendingEarnings._sum.amount_eur ?? 0),
        paid_earnings_eur: Number(paidEarnings._sum.amount_eur ?? 0),
      },
      transactions,
      pending_by_general: generalBreakdown,
    }
  }

  /**
   * Get earnings for a specific general
   */
  async getGeneralEarnings(generalId: string): Promise<any> {
    const earnings = await this.prisma.poolEarning.findMany({
      where: { general_id: generalId },
      include: {
        transaction: { select: { source_type: true, source_description: true, period_month: true, period_year: true, created_at: true } },
      },
      orderBy: { created_at: 'desc' },
    })

    const total = earnings.reduce((sum, e) => sum + Number(e.amount_eur), 0)
    const pending = earnings.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + Number(e.amount_eur), 0)
    const paid = earnings.filter(e => e.status === 'PAID').reduce((sum, e) => sum + Number(e.amount_eur), 0)

    return { earnings, summary: { total, pending, paid } }
  }

  /**
   * Mark pool earnings as paid
   */
  async markEarningsPaid(generalId: string): Promise<any> {
    return this.prisma.poolEarning.updateMany({
      where: { general_id: generalId, status: CommissionStatus.PENDING },
      data: { status: CommissionStatus.PAID, paid_at: new Date() },
    })
  }
}
