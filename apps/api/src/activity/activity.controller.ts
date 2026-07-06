import { Controller, Get, Param, Query } from '@nestjs/common'
import { ActivityService } from './activity.service.js'

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  /** GET /api/activity/user/:userId */
  @Get('user/:userId')
  getForUser(@Param('userId') userId: string, @Query('limit') limit?: string) {
    return this.activityService.getForUser(userId, limit ? parseInt(limit) : 50)
  }

  /** GET /api/activity/workspace/:workspaceId */
  @Get('workspace/:workspaceId')
  getForWorkspace(@Param('workspaceId') workspaceId: string, @Query('limit') limit?: string) {
    return this.activityService.getForWorkspace(workspaceId, limit ? parseInt(limit) : 30)
  }
}
