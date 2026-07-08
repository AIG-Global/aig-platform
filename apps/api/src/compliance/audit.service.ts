import { Injectable, Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { PrismaService } from '../prisma.service.js'
import type { Request } from 'express'

interface AuditAction {
  action: string
  resourceType: string
  resourceId?: string
  changes?: Record<string, any>
  reason?: string
  metadata?: Record<string, any>
}

@Injectable()
export class AuditService {
  constructor(
    private prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  /**
   * Log an audit action
   */
  async log(
    userId: string | null,
    auditData: AuditAction,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: userId || undefined,
          action: auditData.action,
          resourceType: auditData.resourceType,
          resourceId: auditData.resourceId,
          changes: auditData.changes ? JSON.stringify(auditData.changes) : null,
          reason: auditData.reason,
          metadata: auditData.metadata ? JSON.stringify(auditData.metadata) : null,
          
          // Request context
          ipAddress: this.getClientIp(),
          userAgent: this.request.headers['user-agent'],
          method: this.request.method,
          path: this.request.path,
        },
      })
    } catch (error) {
      // Don't throw - audit logging failure shouldn't break the app
      console.error('Audit logging failed:', error)
    }
  }

  /**
   * Get audit logs for a user
   */
  async getUserLogs(userId: string, limit: number = 100) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        action: true,
        resourceType: true,
        resourceId: true,
        changes: true,
        reason: true,
        ipAddress: true,
        method: true,
        path: true,
        createdAt: true,
      },
    })
  }

  /**
   * Get all audit logs (admin only)
   */
  async getAllLogs(
    limit: number = 1000,
    action?: string,
    resourceType?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = {}

    if (action) where.action = action
    if (resourceType) where.resourceType = resourceType
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    })
  }

  /**
   * Get audit summary/statistics
   */
  async getStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await this.prisma.auditLog.findMany({
      where: { createdAt: { gte: startDate } },
      select: { action: true, resourceType: true },
    })

    // Group by action
    const byAction: Record<string, number> = {}
    logs.forEach((log) => {
      byAction[log.action] = (byAction[log.action] || 0) + 1
    })

    // Group by resource type
    const byResourceType: Record<string, number> = {}
    logs.forEach((log) => {
      byResourceType[log.resourceType] = (byResourceType[log.resourceType] || 0) + 1
    })

    return {
      totalEvents: logs.length,
      period: `Last ${days} days`,
      byAction,
      byResourceType,
    }
  }

  /**
   * Track common actions
   */
  async logUserCreated(userId: string, email: string) {
    await this.log(userId, {
      action: 'USER_CREATED',
      resourceType: 'User',
      resourceId: userId,
      metadata: { email },
    })
  }

  async logUserLoggedIn(userId: string) {
    await this.log(userId, {
      action: 'USER_LOGGED_IN',
      resourceType: 'User',
      resourceId: userId,
    })
  }

  async logPasswordChanged(userId: string) {
    await this.log(userId, {
      action: 'PASSWORD_CHANGED',
      resourceType: 'User',
      resourceId: userId,
    })
  }

  async logDataExported(userId: string, format: string = 'json') {
    await this.log(userId, {
      action: 'DATA_EXPORTED',
      resourceType: 'User',
      resourceId: userId,
      metadata: { format },
      reason: 'User requested data export (GDPR)',
    })
  }

  async logAccountDeleted(userId: string) {
    await this.log(userId, {
      action: 'ACCOUNT_DELETED',
      resourceType: 'User',
      resourceId: userId,
      reason: 'User requested account deletion (Right to be forgotten)',
    })
  }

  async logMembershipUpgraded(userId: string, fromTier: string, toTier: string) {
    await this.log(userId, {
      action: 'MEMBERSHIP_UPGRADED',
      resourceType: 'Membership',
      changes: { fromTier, toTier },
    })
  }

  async logPaymentProcessed(userId: string, amount: number, currency: string) {
    await this.log(userId, {
      action: 'PAYMENT_PROCESSED',
      resourceType: 'Payment',
      metadata: { amount, currency },
    })
  }

  /**
   * Get client IP address
   */
  private getClientIp(): string {
    const forwarded = this.request.headers['x-forwarded-for']
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim()
    }
    return this.request.ip || 'unknown'
  }
}
