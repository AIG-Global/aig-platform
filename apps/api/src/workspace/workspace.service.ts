import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
} from './workspace.dto.js'

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateWorkspaceDto): Promise<WorkspaceResponseDto> {
    const workspace = await this.prisma.workspace.create({
      data: {
        ownerId,
        title: dto.title,
        description: dto.description ?? null,
        goal: dto.goal ?? null,
        type: dto.type ?? 'general',
        color: dto.color ?? 'blue',
        emoji: dto.emoji ?? '🚀',
      },
    })
    return this.map(workspace)
  }

  async findAllForUser(ownerId: string): Promise<WorkspaceResponseDto[]> {
    const workspaces = await this.prisma.workspace.findMany({
      where: { ownerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { projects: true, documents: true, conversations: true },
        },
      },
    })
    return workspaces.map((w) => this.map(w))
  }

  async findOne(id: string): Promise<WorkspaceResponseDto & {
    projects: any[]
    documents: any[]
    conversations: any[]
  }> {
    const w = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        projects: {
          where: { deletedAt: null },
          include: { tasks: { where: { deletedAt: null }, orderBy: { order: 'asc' } } },
          orderBy: { createdAt: 'asc' },
        },
        documents: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
        conversations: {
          where: { deletedAt: null, isArchived: false },
          orderBy: { updatedAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!w) throw new Error(`Workspace not found: ${id}`)
    return { ...this.map(w), projects: w.projects, documents: w.documents, conversations: w.conversations }
  }

  async update(id: string, dto: UpdateWorkspaceDto): Promise<WorkspaceResponseDto> {
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.emoji !== undefined && { emoji: dto.emoji }),
      },
    })
    return this.map(workspace)
  }

  async archive(id: string): Promise<WorkspaceResponseDto> {
    const workspace = await this.prisma.workspace.update({
      where: { id },
      data: { status: 'archived', deletedAt: new Date() },
    })
    return this.map(workspace)
  }

  private map(w: any): WorkspaceResponseDto {
    return {
      id: w.id,
      ownerId: w.ownerId,
      title: w.title,
      description: w.description,
      goal: w.goal,
      type: w.type,
      status: w.status,
      color: w.color,
      emoji: w.emoji,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      ...(w._count && { _count: w._count }),
    }
  }
}
