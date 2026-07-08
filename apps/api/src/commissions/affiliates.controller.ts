import { Controller, Get, Post, Body, Param, BadRequestException, NotFoundException } from '@nestjs/common'
import { AffiliatesService } from './affiliates.service.js'

@Controller('affiliates')
export class AffiliatesController {
  constructor(private affiliatesService: AffiliatesService) {}

  @Post('generate-code/:userId')
  async generateReferralCode(@Param('userId') userId: string) {
    const code = await this.affiliatesService.generateReferralCode(userId)
    return {
      userId,
      referralCode: code,
      referralUrl: `https://aiginvest.com/join?code=${code}`,
      localUrl: `http://localhost:3002/join?code=${code}`,
    }
  }

  @Post('create-referral')
  async createReferral(@Body() body: { referrer_id: string; referred_id: string; referral_code?: string }) {
    if (!body.referrer_id || !body.referred_id) {
      throw new BadRequestException('referrer_id and referred_id are required')
    }

    const referral = await this.affiliatesService.createReferral(
      body.referrer_id,
      body.referred_id,
      body.referral_code
    )

    return {
      success: true,
      referralId: referral.id,
      referrerId: referral.referrer_id,
      referredId: referral.referred_id,
      tier: referral.tier,
      status: referral.status,
      referredAt: referral.referred_at,
    }
  }

  @Get('validate-code/:code')
  async validateReferralCode(@Param('code') code: string) {
    return await this.affiliatesService.validateReferralCode(code)
  }

  @Get('downline/:userId')
  async getDownline(@Param('userId') userId: string) {
    const downline = await this.affiliatesService.getDownline(userId, 10)
    return {
      userId,
      downlineCount: downline.length,
      downline,
    }
  }

  @Get('stats/:userId')
  async getNetworkStats(@Param('userId') userId: string) {
    return await this.affiliatesService.getNetworkStats(userId)
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return {
      leaderboard: await this.affiliatesService.getLeaderboard(20),
    }
  }

  @Get('fast-tracker')
  async getFastTracker() {
    return {
      fastTracker: await this.affiliatesService.getFastTrackerRankings(),
    }
  }

  @Post('update-fast-tracker/:userId')
  async updateFastTrackerStatus(@Param('userId') userId: string) {
    await this.affiliatesService.updateFastTrackerStatus(userId)
    return { message: 'Fast tracker status updated', userId }
  }

  @Post('deactivate/:referralId')
  async deactivateReferral(@Param('referralId') referralId: string) {
    await this.affiliatesService.deactivateReferral(referralId)
    return { message: 'Referral deactivated', referralId }
  }
}
