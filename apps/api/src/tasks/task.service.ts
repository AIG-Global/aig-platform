import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { ActivityService } from '../activity/activity.service.js'

export interface CreateTaskDto {
  projectId: string
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  order?: number
}

export interface TaskResponseDto {
  id: string
  projectId: string
  title: string
  description?: string | null
  status: string
  priority: string
  order: number
  dueDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private activityService: ActivityService,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const count = await this.prisma.projectTask.count({
      where: { projectId: dto.projectId, deletedAt: null },
    })

    const task = await this.prisma.projectTask.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || 'medium',
        order: count,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    })
    return this.map(task)
  }

  async getProjectTasks(projectId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.prisma.projectTask.findMany({
      where: { projectId, deletedAt: null },
      orderBy: [{ status: 'asc' }, { order: 'asc' }],
    })
    return tasks.map((t) => this.map(t))
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<TaskResponseDto> {
    const task = await this.prisma.projectTask.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.order !== undefined && { order: dto.order }),
      },
      include: { project: { select: { userId: true } } },
    })
    // Log task completion
    if (dto.status === 'done') {
      this.activityService.log({
        userId: (task as any).project.userId,
        type: 'task_completed',
        title: `Task completed: "${task.title}"`,
        resourceId: task.id,
        resourceType: 'task',
      }).catch(() => {})
    }
    return this.map(task)
  }

  async deleteTask(id: string): Promise<void> {
    await this.prisma.projectTask.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  private map(t: any): TaskResponseDto {
    return {
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      order: t.order,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }
  }
}
