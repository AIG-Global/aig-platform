import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service.js'
import { InvestmentService } from '../investments/investment.service.js'
import { NorthStarService } from '../investments/north-star.service.js'

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private investmentService: InvestmentService,
    private northStarService: NorthStarService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // APP ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────

  @Post('app-usage')
  recordAppUsage(@Body() body: {
    user_id: string; app_slug: string; tier: string; is_general: boolean;
    country?: string; continent?: string; city?: string; duration_seconds?: number
  }) {
    return this.analyticsService.recordAppUsage(
      body.user_id, body.app_slug, body.tier, body.is_general,
      body.country, body.continent, body.city, body.duration_seconds,
    )
  }

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardAnalytics()
  }

  @Get('app-usage-stats')
  getAppUsageStats(@Query('days') days = '30') {
    return this.analyticsService.getAppUsageStats(Number(days))
  }

  @Get('service-interests')
  getServiceInterests() {
    return this.analyticsService.getServiceInterestStats()
  }

  @Post('service-interest')
  recordServiceInterest(@Body() body: { user_id: string; service: string; interest_level: number }) {
    return this.analyticsService.recordServiceInterest(body.user_id, body.service, body.interest_level)
  }

  @Get('member-growth')
  getMemberGrowth() {
    return this.analyticsService.getMemberGrowthByGeo()
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INVESTMENT ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────

  @Get('investments/global-stats')
  getGlobalInvestmentStats() {
    return this.investmentService.getGlobalInvestmentStats()
  }

  @Get('investments/user/:userId/portfolio')
  getUserPortfolio(@Param('userId') userId: string) {
    return this.investmentService.getPortfolioSummary(userId)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INVESTMENT MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  @Post('investments/create')
  createInvestment(@Body() body: {
    user_id: string; fund_type: string; principal_eur_cents: string; reinvest_on_maturity?: boolean
  }) {
    return this.investmentService.createInvestmentFund(
      body.user_id,
      body.fund_type as any,
      BigInt(body.principal_eur_cents),
      body.reinvest_on_maturity,
    )
  }

  @Get('investments/user/:userId/funds')
  getUserFunds(@Param('userId') userId: string) {
    return this.investmentService.getUserFunds(userId)
  }

  @Post('investments/process-mature/:userId')
  processMatureFunds(@Param('userId') userId: string) {
    return this.investmentService.processMatureFunds(userId)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NORTH STAR TOKEN
  // ─────────────────────────────────────────────────────────────────────────

  @Get('north-star/market-stats')
  getNorthStarMarketStats() {
    return this.northStarService.getMarketStats()
  }

  @Get('north-star/token-price')
  getCurrentTokenPrice() {
    return this.northStarService.getCurrentTokenPrice()
  }

  @Get('north-star/user/:userId/position')
  getUserNorthStarPosition(@Param('userId') userId: string) {
    return this.northStarService.getUserPosition(userId)
  }

  @Post('north-star/purchase')
  purchaseTokens(@Body() body: { user_id: string; quantity_tokens: string; price_per_token_eur: number }) {
    return this.northStarService.purchaseTokens(body.user_id, BigInt(body.quantity_tokens), body.price_per_token_eur)
  }

  @Post('north-star/freeze')
  freezePrice(@Body() body: { user_id: string; freeze_number: 1 | 2 }) {
    return this.northStarService.freezeTokenPrice(body.user_id, body.freeze_number)
  }

  @Post('north-star/exercise-freeze')
  exerciseFrozen(@Body() body: { user_id: string; freeze_number: 1 | 2; quantity_tokens: string }) {
    return this.northStarService.exerciseFrozenPrice(body.user_id, body.freeze_number, BigInt(body.quantity_tokens))
  }

  @Post('north-star/trade')
  createTrade(@Body() body: {
    seller_user_id: string; buyer_user_id: string; quantity_tokens: string; price_per_token_eur: number
  }) {
    return this.northStarService.createTrade(
      body.seller_user_id, body.buyer_user_id, BigInt(body.quantity_tokens), body.price_per_token_eur,
    )
  }

  @Post('north-star/trade/:tradeId/complete')
  completeTrade(@Param('tradeId') tradeId: string) {
    return this.northStarService.completeTrade(tradeId)
  }
}
