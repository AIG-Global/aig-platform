import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuditService } from './audit.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('api/compliance/audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private audit: AuditService) {}

  /**
   * GET /api/compliance/audit/logs
   * Get current user's audit logs
   */
  @Get('logs')
  async getUserLogs(@Query('limit') limit?: string) {
    const actualLimit = Math.min(parseInt(limit || '100'), 500)
    return this.audit.getUserLogs('user-id', actualLimit)
  }

  /**
   * GET /api/compliance/audit/logs/:userId
   * Get specific user's audit logs (admin only)
   */
  @Get('logs/:userId')
  async getUserLogsById(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const actualLimit = Math.min(parseInt(limit || '100'), 500)
    return this.audit.getUserLogs(userId, actualLimit)
  }

  /**
   * GET /api/compliance/audit/all
   * Get all audit logs (admin only)
   */
  @Get('all')
  async getAllLogs(
    @Query('limit') limit?: string,
    @Query('action') action?: string,
    @Query('resourceType') resourceType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const actualLimit = Math.min(parseInt(limit || '1000'), 10000)
    return this.audit.getAllLogs(
      actualLimit,
      action,
      resourceType,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }

  /**
   * GET /api/compliance/audit/stats
   * Get audit statistics (admin only)
   */
  @Get('stats')
  async getStats(@Query('days') days?: string) {
    const actualDays = Math.min(parseInt(days || '30'), 365)
    return this.audit.getStats(actualDays)
  }
}
