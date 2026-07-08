import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import axios from 'axios'

interface MailchimpContact {
  email: string
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending'
  merge_fields: {
    FNAME?: string
    LNAME?: string
    PHONE?: string
    COUNTRY?: string
  }
  tags?: string[]
}

@Injectable()
export class MailchimpService {
  private apiKey: string
  private baseUrl: string
  private listId: string
  private client: any

  constructor(private prisma: PrismaService) {
    this.apiKey = process.env.MAILCHIMP_API_KEY || ''
    this.listId = process.env.MAILCHIMP_LIST_ID || ''
    
    // Extract server prefix from API key (e.g., "us1", "us2")
    const serverPrefix = this.apiKey.split('-').pop() || 'us1'
    this.baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`

    this.initializeClient()
  }

  private initializeClient() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: 'apikey',
        password: this.apiKey,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Subscribe a user to Mailchimp
   */
  async subscribeUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        account: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const contact: MailchimpContact = {
      email: user.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: user.first_name || '',
        LNAME: user.last_name || '',
        PHONE: user.phone_number || '',
        COUNTRY: user.nationality || '',
      },
      tags: [user.membershipPackage || 'member'],
    }

    try {
      const response = await this.client.put(
        `/lists/${this.listId}/members/${this.getEmailHash(user.email)}`,
        contact,
      )

      // Store Mailchimp ID in database
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          mailchimpContactId: response.data.id,
        },
      })

      return response.data
    } catch (error) {
      console.error('Mailchimp subscription error:', error)
      throw error
    }
  }

  /**
   * Update user tags based on membership and activity
   */
  async updateUserTags(userId: string, tags: string[]) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.mailchimpContactId) {
      throw new Error('User not found or not subscribed to Mailchimp')
    }

    try {
      await this.client.post(
        `/lists/${this.listId}/members/${this.getEmailHash(user.email)}/tags`,
        {
          tags: tags.map(tag => ({
            name: tag,
            status: 'active',
          })),
        },
      )

      return { success: true, tags }
    } catch (error) {
      console.error('Tag update error:', error)
      throw error
    }
  }

  /**
   * Send a campaign to a segment
   */
  async sendCampaign(
    subject: string,
    htmlContent: string,
    tags: string[],
    fromEmail?: string,
  ) {
    try {
      // Create campaign
      const campaign = await this.client.post('/campaigns', {
        type: 'regular',
        recipients: {
          list_id: this.listId,
          segment_opts: {
            match: 'any',
            conditions: tags.map(tag => ({
              condition_type: 'Interests',
              field: 'interests',
              op: 'interestcontains',
              value: tag,
            })),
          },
        },
        settings: {
          subject_line: subject,
          from_name: 'AIGINVEST',
          reply_to: fromEmail || process.env.MAILCHIMP_FROM_EMAIL || 'noreply@aiginvest.com',
          to_name: '*|FNAME|*',
        },
        content: {
          html: htmlContent,
        },
      })

      // Send campaign
      await this.client.post(`/campaigns/${campaign.data.id}/actions/send`)

      return campaign.data
    } catch (error) {
      console.error('Campaign send error:', error)
      throw error
    }
  }

  /**
   * Get MD5 hash of email for Mailchimp API
   */
  private getEmailHash(email: string): string {
    const crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')
  }

  /**
   * Sync all users to Mailchimp
   */
  async syncAllUsers() {
    const users = await this.prisma.user.findMany({
      where: {
        status: 'ACTIVE',
      },
    })

    const results = []

    for (const user of users) {
      try {
        await this.subscribeUser(user.id)
        results.push({ userId: user.id, status: 'success' })
      } catch (error) {
        console.error(`Failed to sync user ${user.id}:`, error)
        results.push({ userId: user.id, status: 'failed', error: error.message })
      }
    }

    return results
  }

  /**
   * Get subscriber count
   */
  async getSubscriberCount(): Promise<number> {
    try {
      const response = await this.client.get(`/lists/${this.listId}`)
      return response.data.stats.member_count
    } catch (error) {
      console.error('Failed to get subscriber count:', error)
      throw error
    }
  }
}
