import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

// North Star token appreciation schedule: month -> percent increase
const NORTH_STAR_APPRECIATION: Record<number, number> = {
  1: 11.834,
  5: 18.23,
  11: 20.456,
  12: 36.789,
  15: 65.36737,
  16: 77.6828,
  18: 23.567,
  22: 34.7734,
  23: 56.9345,
  24: 34.578,
  // After month 24, market opens for free member-to-member trading
}

const NORTH_STAR_STARTING_PRICE = 0.85 // EUR per token

@Injectable()
export class NorthStarService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get or initialize North Star token market value for a specific month
   */
  async getTokenValueAtMonth(monthNumber: number): Promise<number> {
    let record = await this.prisma.northStarTokenMarketValue.findUnique({
      where: { month_number: monthNumber },
    })

    if (!record) {
      // Calculate price based on appreciation schedule
      let price = NORTH_STAR_STARTING_PRICE

      // Apply appreciation up to this month
      for (let m = 1; m <= monthNumber; m++) {
        if (NORTH_STAR_APPRECIATION[m]) {
          const pct = NORTH_STAR_APPRECIATION[m]
          price = price * (1 + pct / 100)
        }
      }

      record = await this.prisma.northStarTokenMarketValue.create({
        data: {
          month_number: monthNumber,
          price_per_token_eur: price,
          monthly_appreciation_percent: NORTH_STAR_APPRECIATION[monthNumber] ?? 0,
        },
      })
    }

    return record.price_per_token_eur
  }

  /**
   * Get current token price (simulates "now")
   */
  async getCurrentTokenPrice(): Promise<number> {
    // Assume first purchase was on a fixed date, calculate current month
    // For MVP, use month 1 price; can be enhanced with time tracking
    return this.getTokenValueAtMonth(1)
  }

  /**
   * Purchase North Star tokens
   */
  async purchaseTokens(userId: string, quantityTokens: bigint, pricePerTokenEur: number): Promise<any> {
    const totalCostEur = BigInt(Math.floor(Number(quantityTokens) * pricePerTokenEur * 100))

    const txResult = await this.prisma.$transaction(async (tx) => {
      // Get or create position
      let position = await tx.northStarTokenPosition.findUnique({ where: { user_id: userId } })

      if (!position) {
        position = await tx.northStarTokenPosition.create({
          data: {
            user_id: userId,
            tokens_owned: quantityTokens,
            average_cost_per_token_eur: pricePerTokenEur,
            total_invested_eur: totalCostEur,
          },
        })
      } else {
        // Update position
        const newTotal = position.total_invested_eur + totalCostEur
        const newTokens = position.tokens_owned + quantityTokens
        const newAvgCost = Number(newTotal) / Number(newTokens)

        position = await tx.northStarTokenPosition.update({
          where: { user_id: userId },
          data: {
            tokens_owned: newTokens,
            average_cost_per_token_eur: newAvgCost,
            total_invested_eur: newTotal,
          },
        })
      }

      // Record purchase
      const purchase = await tx.northStarPurchase.create({
        data: {
          position_id: position.id,
          quantity: quantityTokens,
          price_per_token_eur: pricePerTokenEur,
          total_cost_eur: totalCostEur,
        },
      })

      return { position, purchase }
    })

    return txResult
  }

  /**
   * Freeze tokens to lock price (max 2 freezes, 2 months each)
   */
  async freezeTokenPrice(userId: string, freezeNumber: 1 | 2): Promise<any> {
    const position = await this.prisma.northStarTokenPosition.findUnique({ where: { user_id: userId } })
    if (!position) throw new NotFoundException('No North Star position')

    const field = freezeNumber === 1 ? 'freeze_1_active' : 'freeze_2_active'
    const isActive = freezeNumber === 1 ? position.freeze_1_active : position.freeze_2_active

    if (isActive) throw new BadRequestException(`Freeze ${freezeNumber} is already active`)

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) // 60 days

    const currentPrice = await this.getCurrentTokenPrice()

    const data: any = {}
    data[`freeze_${freezeNumber}_active`] = true
    data[`freeze_${freezeNumber}_locked_price_eur`] = currentPrice
    data[`freeze_${freezeNumber}_locked_at`] = now
    data[`freeze_${freezeNumber}_expires_at`] = expiresAt

    return this.prisma.northStarTokenPosition.update({
      where: { user_id: userId },
      data,
    })
  }

  /**
   * Exercise frozen price to buy at locked rate
   */
  async exerciseFrozenPrice(userId: string, freezeNumber: 1 | 2, quantityTokens: bigint): Promise<any> {
    const position = await this.prisma.northStarTokenPosition.findUnique({ where: { user_id: userId } })
    if (!position) throw new NotFoundException('No North Star position')

    const freezeActiveField = freezeNumber === 1 ? position.freeze_1_active : position.freeze_2_active
    const freezePriceField = freezeNumber === 1 ? position.freeze_1_locked_price_eur : position.freeze_2_locked_price_eur
    const freezeExpiresField = freezeNumber === 1 ? position.freeze_1_expires_at : position.freeze_2_expires_at

    if (!freezeActiveField) throw new BadRequestException(`Freeze ${freezeNumber} is not active`)
    if (new Date() > freezeExpiresField!) throw new BadRequestException(`Freeze ${freezeNumber} has expired`)

    const lockedPrice = freezePriceField!
    const costEur = BigInt(Math.floor(Number(quantityTokens) * lockedPrice * 100))

    return this.purchaseTokens(userId, quantityTokens, lockedPrice)
  }

  /**
   * Initiate trade (if market is open - after 24 months)
   */
  async createTrade(sellerUserId: string, buyerUserId: string, quantityTokens: bigint, pricePerTokenEur: number): Promise<any> {
    // Check if seller has position
    const sellerPosition = await this.prisma.northStarTokenPosition.findUnique({ where: { user_id: sellerUserId } })
    if (!sellerPosition || sellerPosition.tokens_owned < quantityTokens) {
      throw new BadRequestException('Seller does not have enough tokens')
    }

    const totalValue = BigInt(Math.floor(Number(quantityTokens) * pricePerTokenEur * 100))

    const trade = await this.prisma.northStarTrade.create({
      data: {
        seller_position_id: sellerPosition.id,
        buyer_user_id: buyerUserId,
        quantity: quantityTokens,
        price_per_token_eur: pricePerTokenEur,
        total_value_eur: totalValue,
      },
    })

    return trade
  }

  /**
   * Complete a trade (transfer tokens from seller to buyer)
   */
  async completeTrade(tradeId: string): Promise<any> {
    const trade = await this.prisma.northStarTrade.findUnique({
      where: { id: tradeId },
      include: { seller_position: true },
    })
    if (!trade) throw new NotFoundException('Trade not found')

    return this.prisma.$transaction(async (tx) => {
      // Update seller position
      await tx.northStarTokenPosition.update({
        where: { id: trade.seller_position_id },
        data: { tokens_owned: { decrement: trade.quantity } },
      })

      // Get or create buyer position
      let buyerPosition = await tx.northStarTokenPosition.findUnique({ where: { user_id: trade.buyer_user_id } })
      if (!buyerPosition) {
        buyerPosition = await tx.northStarTokenPosition.create({
          data: {
            user_id: trade.buyer_user_id,
            tokens_owned: trade.quantity,
            average_cost_per_token_eur: trade.price_per_token_eur,
            total_invested_eur: trade.total_value_eur,
          },
        })
      } else {
        const newTotal = buyerPosition.total_invested_eur + trade.total_value_eur
        const newTokens = buyerPosition.tokens_owned + trade.quantity
        const newAvgCost = Number(newTotal) / Number(newTokens)

        buyerPosition = await tx.northStarTokenPosition.update({
          where: { user_id: trade.buyer_user_id },
          data: {
            tokens_owned: newTokens,
            average_cost_per_token_eur: newAvgCost,
            total_invested_eur: newTotal,
          },
        })
      }

      // Mark trade completed
      await tx.northStarTrade.update({
        where: { id: tradeId },
        data: { status: 'COMPLETED', completed_at: new Date() },
      })

      return { seller_position: trade.seller_position, buyer_position: buyerPosition }
    })
  }

  /**
   * Get user's North Star position
   */
  async getUserPosition(userId: string): Promise<any> {
    const position = await this.prisma.northStarTokenPosition.findUnique({
      where: { user_id: userId },
      include: { purchases: true },
    })

    if (!position) return null

    const currentPrice = await this.getCurrentTokenPrice()
    const unrealizedGainEur = Number(position.tokens_owned) * (currentPrice - position.average_cost_per_token_eur)

    return {
      ...position,
      current_price_per_token_eur: currentPrice,
      current_value_eur: Number(position.tokens_owned) * currentPrice,
      unrealized_gain_eur: unrealizedGainEur,
      roi_percent: (unrealizedGainEur / Number(position.total_invested_eur)) * 100,
    }
  }

  /**
   * Get North Star market stats
   */
  async getMarketStats(): Promise<any> {
    const [totalPositions, totalTokensOwned, totalInvested, tradeCount] = await Promise.all([
      this.prisma.northStarTokenPosition.count(),
      this.prisma.northStarTokenPosition.aggregate({ _sum: { tokens_owned: true } }),
      this.prisma.northStarTokenPosition.aggregate({ _sum: { total_invested_eur: true } }),
      this.prisma.northStarTrade.count({ where: { status: 'COMPLETED' } }),
    ])

    const currentPrice = await this.getCurrentTokenPrice()

    return {
      total_holders: totalPositions,
      total_tokens_owned: Number(totalTokensOwned._sum.tokens_owned ?? 0),
      total_market_cap_eur: (Number(totalTokensOwned._sum.tokens_owned ?? 0) * currentPrice).toFixed(2),
      total_invested_eur: Number(totalInvested._sum.total_invested_eur ?? 0) / 100,
      current_price_per_token_eur: currentPrice,
      completed_trades: tradeCount,
    }
  }
}
