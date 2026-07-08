import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common'
import { MailchimpService } from './mailchimp.service'
import { WeeklyDigestService } from './weekly-digest.service'

@Controller('api/mailchimp')
export class MailchimpController {
  constructor(
    private mailchimp: MailchimpService,
    private weeklyDigest: WeeklyDigestService,
  ) {}

  /**
   * POST /api/mailchimp/subscribe/:userId
   * Subscribe a user to the Mailchimp list
   */
  @Post('subscribe/:userId')
  async subscribeUser(@Param('userId') userId: string) {
    try {
      const result = await this.mailchimp.subscribeUser(userId)
      return {
        success: true,
        message: 'User subscribed to Mailchimp',
        contactId: result.id,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * POST /api/mailchimp/subscribe-all
   * Sync all active users to Mailchimp
   */
  @Post('subscribe-all')
  async subscribeAll() {
    try {
      const results = await this.mailchimp.syncAllUsers()
      const successCount = results.filter(r => r.status === 'success').length
      const failureCount = results.filter(r => r.status === 'failed').length

      return {
        success: true,
        message: `Synced ${successCount} users, ${failureCount} failed`,
        results,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * POST /api/mailchimp/weekly-digest
   * Send weekly digest to all members
   */
  @Post('weekly-digest')
  async sendWeeklyDigest() {
    try {
      const result = await this.weeklyDigest.sendWeeklyDigestToAll()
      return {
        success: true,
        message: 'Weekly digest sent',
        ...result,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * POST /api/mailchimp/country-opened
   * Send gamification email for newly opened country
   */
  @Post('country-opened')
  async sendCountryOpenedEmail(
    @Body() body: { userId: string; countryName: string; continentName: string },
  ) {
    if (!body.userId || !body.countryName || !body.continentName) {
      throw new BadRequestException('Missing required fields: userId, countryName, continentName')
    }

    try {
      await this.weeklyDigest.sendCountryOpenedEmail(body.userId, body.countryName, body.continentName)
      return {
        success: true,
        message: `Country opened email sent for ${body.countryName}`,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * GET /api/mailchimp/stats
   * Get email campaign statistics
   */
  @Get('stats')
  async getCampaignStats(@Query('days') days: string = '7') {
    try {
      const stats = await this.weeklyDigest.getCampaignStats(parseInt(days))
      return {
        success: true,
        stats,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * GET /api/mailchimp/subscriber-count
   * Get total subscriber count
   */
  @Get('subscriber-count')
  async getSubscriberCount() {
    try {
      const count = await this.mailchimp.getSubscriberCount()
      return {
        success: true,
        subscriberCount: count,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * POST /api/mailchimp/update-tags/:userId
   * Update user tags for segmentation
   */
  @Post('update-tags/:userId')
  async updateUserTags(@Param('userId') userId: string, @Body() body: { tags: string[] }) {
    if (!body.tags || !Array.isArray(body.tags)) {
      throw new BadRequestException('Invalid tags provided')
    }

    try {
      await this.mailchimp.updateUserTags(userId, body.tags)
      return {
        success: true,
        message: 'User tags updated',
        tags: body.tags,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
