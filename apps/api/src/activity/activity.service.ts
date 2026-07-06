import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

export interface LogActivityDto {
  userId: string
  workspaceId?: string
  type: string
  title: string
  description?: string
  resourceId?: string
  resourceType?: string
}

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async log(dto: LogActivityDto) {
    return this.prisma.activity.create({ data: dto }).catch(() => null) // never throw
  }

  async getForUser(userId: string, limit = 50) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async getForWorkspace(workspaceId: string, limit = 30) {
    return this.prisma.activity.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }
}
