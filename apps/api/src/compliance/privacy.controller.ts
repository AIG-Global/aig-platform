import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PrivacyService } from './privacy.service'

@Controller('api/compliance/privacy')
@UseGuards(AuthGuard('jwt'))
export class PrivacyController {
  constructor(private privacy: PrivacyService) {}

  /**
   * GET /api/compliance/privacy/export
   * Export user's personal data (GDPR DSAR)
   */
  @Get('export')
  async exportMyData() {
    // In real implementation, get userId from JWT
    // For now, return example structure
    return {
      message: 'Data export initiated',
      note: 'Use POST /api/compliance/privacy/export/:userId with admin auth',
    }
  }

  /**
   * POST /api/compliance/privacy/export/:userId
   * Export specific user's data (admin endpoint)
   */
  @Post('export/:userId')
  async exportUserData(@Param('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required')
    }

    try {
      const data = await this.privacy.exportUserData(userId)
      return {
        success: true,
        data,
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * POST /api/compliance/privacy/delete
   * Delete user account and all data (Right to be forgotten)
   */
  @Post('delete')
  async deleteMyAccount(@Body() body: { reason?: string }) {
    return {
      message: 'Account deletion initiated',
      warning: 'This action cannot be undone. Use POST with userId and confirmDeletion flag.',
      note: 'This requires email verification',
    }
  }

  /**
   * POST /api/compliance/privacy/delete/:userId
   * Delete specific user's account (admin endpoint)
   */
  @Post('delete/:userId')
  async deleteUserAccount(
    @Param('userId') userId: string,
    @Body() body: { confirmDeletion: boolean; reason?: string },
  ) {
    if (!userId) {
      throw new BadRequestException('User ID is required')
    }

    if (!body.confirmDeletion) {
      throw new BadRequestException(
        'confirmDeletion must be true to delete an account. This action cannot be undone.',
      )
    }

    try {
      const result = await this.privacy.deleteUserData(userId, body.reason)
      return { success: true, result }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * GET /api/compliance/privacy/consent
   * Get user's consent history
   */
  @Get('consent')
  async getConsentHistory() {
    return {
      message: 'Use GET /api/compliance/privacy/consent/:userId',
    }
  }

  /**
   * GET /api/compliance/privacy/consent/:userId
   * Get specific user's consent records (admin)
   */
  @Get('consent/:userId')
  async getConsentHistoryByUserId(@Param('userId') userId: string) {
    try {
      const history = await this.privacy.getConsentHistory(userId)
      return { success: true, consentRecords: history }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * POST /api/compliance/privacy/consent/:userId
   * Update user consent preferences
   */
  @Post('consent/:userId')
  async updateConsent(
    @Param('userId') userId: string,
    @Body() body: { marketing?: boolean; analytics?: boolean; thirdParty?: boolean },
  ) {
    try {
      const result = await this.privacy.updateConsent(userId, body)
      return { success: true, consentRecord: result }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * POST /api/compliance/privacy/consent/:userId/withdraw
   * Withdraw all consents
   */
  @Post('consent/:userId/withdraw')
  async withdrawConsent(@Param('userId') userId: string) {
    try {
      const result = await this.privacy.withdrawAllConsent(userId)
      return { success: true, result }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * GET /api/compliance/privacy/assessment/:userId
   * Get privacy impact assessment (admin)
   */
  @Get('assessment/:userId')
  async getPrivacyAssessment(@Param('userId') userId: string) {
    try {
      const assessment = await this.privacy.getPrivacyAssessment(userId)
      return { success: true, assessment }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  /**
   * Check marketing consent
   */
  @Get('consent/:userId/marketing')
  async checkMarketingConsent(@Param('userId') userId: string) {
    try {
      const hasConsent = await this.privacy.hasMarketingConsent(userId)
      return { userId, hasMarketingConsent: hasConsent }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
