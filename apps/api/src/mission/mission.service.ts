import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { CreateMissionDto, UpdateMissionDto } from './dto/index.js'

@Injectable()
export class MissionService {
  private readonly logger = new Logger('MissionService')

  constructor(private prisma: PrismaService) {}

  // Create a new mission + auto-provision workspace
  async create(organizationId: string, userId: string, dto: CreateMissionDto) {
    try {
      // Create mission
      const mission = await this.prisma.mission.create({
        data: {
          title: dto.title,
          description: dto.description,
          objective: dto.objective || '',
          successCriteria: '[]',
          organizationId,
          ownerId: userId,
          status: 'planning',
          priority: dto.priority || 'medium',
          deadline: dto.deadline,
          startDate: new Date(),
        },
        include: {
          owner: true,
          organization: true,
        },
      })

      // Auto-provision workspace
      const workspace = await this.prisma.workspace.create({
        data: {
          title: `${mission.title} Workspace`,
          description: `Working space for mission: ${mission.title}`,
          missionId: mission.id,
          ownerId: userId,
        },
      })

      // Create default project
      await this.prisma.project.create({
        data: {
          name: 'General',
          workspaceId: workspace.id,
          userId: userId,
          status: 'active',
        },
      })

      this.logger.log(`✅ Mission created: ${mission.id} with workspace: ${workspace.id}`)

      return {
        mission,
        workspace,
      }
    } catch (error) {
      this.logger.error(`Failed to create mission: ${error.message}`)
      throw error
    }
  }

  // Get all missions for organization
  async findAll(organizationId: string) {
    try {
      return await this.prisma.mission.findMany({
        where: { organizationId },
        include: {
          owner: true,
          progress: true,
          workspace: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      this.logger.error(`Failed to list missions: ${error.message}`)
      throw error
    }
  }

  // Get single mission with full context
  async findOne(id: string) {
    try {
      return await this.prisma.mission.findUnique({
        where: { id },
        include: {
          owner: true,
          organization: true,
          workspace: true,
          milestones: true,
          progress: true,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to find mission ${id}: ${error.message}`)
      throw error
    }
  }

  // Update mission
  async update(id: string, dto: UpdateMissionDto) {
    try {
      return await this.prisma.mission.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          objective: dto.objective,
          deadline: dto.deadline,
          priority: dto.priority,
        },
        include: {
          owner: true,
          organization: true,
          progress: true,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to update mission ${id}: ${error.message}`)
      throw error
    }
  }

  // Change mission status with validation
  async updateStatus(id: string, status: string) {
    try {
      const mission = await this.findOne(id)
      if (!mission) {
        throw new Error('Mission not found')
      }

      // Validate transitions
      const validTransitions: Record<string, string[]> = {
        planning: ['active'],
        active: ['paused', 'completed'],
        paused: ['active', 'abandoned'],
        completed: [],
        abandoned: [],
      }

      if (!validTransitions[mission.status]?.includes(status)) {
        throw new Error(`Cannot transition from ${mission.status} to ${status}`)
      }

      const updateData: any = { status }
      if (status === 'completed') {
        updateData.completedDate = new Date()
      }

      const updated = await this.prisma.mission.update({
        where: { id },
        data: updateData,
        include: {
          owner: true,
          organization: true,
          progress: true,
        },
      })

      this.logger.log(`✅ Mission ${id} status updated to ${status}`)
      return updated
    } catch (error) {
      this.logger.error(`Failed to update mission status: ${error.message}`)
      throw error
    }
  }

  // Soft delete mission (archive)
  async delete(id: string) {
    try {
      return await this.prisma.mission.update({
        where: { id },
        data: { status: 'archived' },
      })
    } catch (error) {
      this.logger.error(`Failed to delete mission ${id}: ${error.message}`)
      throw error
    }
  }

  // Find active mission for user
  async findActive(organizationId: string, userId: string) {
    try {
      return await this.prisma.mission.findFirst({
        where: {
          organizationId,
          ownerId: userId,
          status: { in: ['planning', 'active', 'paused'] },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          progress: true,
          workspace: {
            include: {
              projects: true,
            },
          },
        },
      })
    } catch (error) {
      this.logger.error(`Failed to find active mission: ${error.message}`)
      throw error
    }
  }
}
