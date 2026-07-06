import { Controller, Get, Param } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

@Controller('progress')
export class ProgressController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /api/progress/:userId
   * Returns a summary of what the user has accomplished.
   * Diana uses this to answer "How am I doing?"
   */
  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    const [workspaces, allTasks, completedTasks, documents, recentActivity] = await Promise.all([
      this.prisma.workspace.count({ where: { ownerId: userId, status: 'active', deletedAt: null } }),
      this.prisma.projectTask.count({
        where: { project: { userId, deletedAt: null }, deletedAt: null },
      }),
      this.prisma.projectTask.count({
        where: { project: { userId, deletedAt: null }, status: 'done', deletedAt: null },
      }),
      this.prisma.document.count({ where: { userId, deletedAt: null } }),
      this.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ])

    const taskCompletionPct = allTasks > 0 ? Math.round((completedTasks / allTasks) * 100) : 0

    // Most recent workspace for context
    const latestWorkspace = await this.prisma.workspace.findFirst({
      where: { ownerId: userId, status: 'active', deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      select: { title: true, type: true, goal: true },
    })

    // Next pending task
    const nextTask = await this.prisma.projectTask.findFirst({
      where: { project: { userId, deletedAt: null }, status: 'todo', deletedAt: null },
      orderBy: [{ priority: 'desc' }, { order: 'asc' }],
      select: { title: true, priority: true },
    })

    return {
      workspaces,
      totalTasks: allTasks,
      completedTasks,
      taskCompletionPct,
      documents,
      recentActivityCount: recentActivity.length,
      latestWorkspace,
      nextTask,
      // Human-readable summary for Diana to use
      summary: buildSummary({ workspaces, completedTasks, taskCompletionPct, documents, latestWorkspace, nextTask }),
    }
  }
}

function buildSummary({ workspaces, completedTasks, taskCompletionPct, documents, latestWorkspace, nextTask }: {
  workspaces: number
  completedTasks: number
  taskCompletionPct: number
  documents: number
  latestWorkspace: { title: string; goal: string | null } | null
  nextTask: { title: string; priority: string } | null
}): string {
  const parts: string[] = []

  if (latestWorkspace) {
    parts.push(`You're working on **${latestWorkspace.title}**.`)
  }

  if (completedTasks > 0) {
    parts.push(`You've completed **${completedTasks} task${completedTasks > 1 ? 's' : ''}** (${taskCompletionPct}% of your board).`)
  } else if (workspaces > 0) {
    parts.push(`Your workspace is set up and ready to go.`)
  }

  if (documents > 0) {
    parts.push(`You have **${documents} document${documents > 1 ? 's' : ''}** in your workspace.`)
  }

  if (nextTask) {
    parts.push(`Your next priority: **${nextTask.title}**.`)
  }

  if (parts.length === 0) {
    return `You're just getting started. Tell Diana your first goal and she'll set everything up.`
  }

  return parts.join(' ')
}
