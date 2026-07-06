import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

export interface CreateProjectDto {
  userId: string
  conversationId?: string
  name: string
  description?: string
  color?: string
}

export interface ProjectResponseDto {
  id: string
  userId: string
  conversationId?: string | null
  name: string
  description?: string | null
  status: string
  color: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(dto: CreateProjectDto): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.create({
      data: {
        userId: dto.userId,
        conversationId: dto.conversationId,
        name: dto.name,
        description: dto.description || null,
        color: dto.color || 'blue',
      },
    })

    return this.map(project)
  }

  async getUserProjects(userId: string): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      where: { userId, deletedAt: null, status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
    return projects.map((p) => this.map(p))
  }

  async getProject(id: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({ where: { id } })
    if (!project) throw new Error(`Project not found: ${id}`)
    return this.map(project)
  }

  private map(p: any): ProjectResponseDto {
    return {
      id: p.id,
      userId: p.userId,
      conversationId: p.conversationId,
      name: p.name,
      description: p.description,
      status: p.status,
      color: p.color,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }
  }
}
