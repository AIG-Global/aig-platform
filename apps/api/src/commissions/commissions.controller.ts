import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { CommissionsService } from './commissions.service.js'

@Controller('commissions')
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  @Post('initialize-rules')
  async initializeRules() {
    await this.commissionsService.initializeCommissionRules()
    return { message: 'Commission rules initialized' }
  }

  @Get('pending/:userId')
  async getPendingCommissions(@Param('userId') userId: string) {
    const amount = await this.commissionsService.getPendingCommissions(userId)
    return {
      userId,
      pending_eur: (Number(amount) / 100).toFixed(2),
      pending_cents: amount.toString(),
    }
  }

  @Get('total/:userId')
  async getTotalCommissions(@Param('userId') userId: string) {
    const amount = await this.commissionsService.getTotalCommissions(userId)
    return {
      userId,
      total_eur: (Number(amount) / 100).toFixed(2),
      total_cents: amount.toString(),
    }
  }

  @Get('rate/:tier/:level')
  async getCommissionRate(
    @Param('tier') tier: string,
    @Param('level') level: string
  ) {
    const percent = await this.commissionsService.getCommissionRate(tier as any, parseInt(level))
    return {
      tier,
      level: parseInt(level),
      percent,
    }
  }

  @Get('upline/:userId')
  async getUpline(@Param('userId') userId: string) {
    const upline = await this.commissionsService.getUplineReferrers(userId, 10)
    return {
      userId,
      upline_count: upline.length,
      upline,
    }
  }

  @Post('process-referral/:referralId')
  async processReferral(
    @Param('referralId') referralId: string,
    @Body() body: { amount_cents: number }
  ) {
    await this.commissionsService.processReferralCommission(referralId, BigInt(body.amount_cents))
    return {
      message: 'Referral commission processed',
      referralId,
      amount_eur: (body.amount_cents / 100).toFixed(2),
    }
  }

  @Post('process-membership/:userId')
  async processMembership(
    @Param('userId') userId: string,
    @Body() body: { membership_id: string; amount_cents: number }
  ) {
    await this.commissionsService.processMembershipCommission(userId, body.membership_id, BigInt(body.amount_cents))
    return {
      message: 'Membership commission processed',
      userId,
      membershipId: body.membership_id,
      amount_eur: (body.amount_cents / 100).toFixed(2),
    }
  }

  @Post('process-order/:buyerId')
  async processOrder(
    @Param('buyerId') buyerId: string,
    @Body() body: { order_id: string; amount_cents: number }
  ) {
    await this.commissionsService.processOrderCommission(buyerId, body.order_id, BigInt(body.amount_cents))
    return {
      message: 'Order commission processed',
      buyerId,
      orderId: body.order_id,
      amount_eur: (body.amount_cents / 100).toFixed(2),
    }
  }
}
