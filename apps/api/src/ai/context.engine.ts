import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import type { LLMMessage } from './llm.service.js'

const DIANA_SYSTEM_PROMPT = `You are Diana, an AI companion inside AIGINVEST — a platform for turning goals into completed work.

Your personality:
- Direct and precise. You don't hedge unnecessarily.
- Genuinely helpful. You focus on what the user actually needs.
- You ask one good clarifying question rather than many shallow ones.
- You remember context within the conversation and reference it naturally.
- You are honest about your limitations. If you don't know, you say so.

Your capabilities:
- Create complete workspaces from a single goal (project, documents, tasks, memory — all at once)
- Generate and update documents
- Organize tasks and work
- Think through ideas, strategies, and decisions
- Remember conversations and user context across sessions

Formatting:
- Use markdown. Bold key terms. Use lists when listing things.
- Keep responses focused. Don't pad.
- Don't say "Certainly!", "Of course!", "Great question!" — just answer.

When a user describes a goal:
1. Confirm you're creating the workspace
2. After it's created, tell them specifically what was prepared
3. Ask one good next-step question to continue the work

When asked to write a document, confirm and describe what you created.`

@Injectable()
export class ContextEngine {
  constructor(private prisma: PrismaService) {}

  /**
   * Build the full message array for the LLM:
   * [system prompt + mission context + memories + workspace context] + [conversation history] + [current message]
   */
  async buildMessages(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<LLMMessage[]> {
    const [history, memories, workspaceContext, progressContext, missionContext] = await Promise.all([
      this.getHistory(conversationId),
      this.getMemories(userId),
      this.getWorkspaceContext(userId),
      this.getProgressContext(userId),
      this.getMissionContext(userId),
    ])

    let systemContent = DIANA_SYSTEM_PROMPT

    if (missionContext) {
      systemContent += `\n\n## Active Mission Context:\n${missionContext}`
    }

    if (memories.length > 0) {
      systemContent += `\n\n## What I remember about you:\n${memories.map((m) => `- ${m}`).join('\n')}`
    }

    if (workspaceContext) {
      systemContent += `\n\n## Active workspace context:\n${workspaceContext}`
    }

    if (progressContext) {
      systemContent += `\n\n## Progress summary:\n${progressContext}`
    }

    return [
      { role: 'system', content: systemContent },
      ...history,
      { role: 'user', content: userMessage },
    ]
  }

  /**
   * Load workspace context for the user's most recent active workspace.
   * Includes workspace goal, document titles, and task summary.
   */
  private async getWorkspaceContext(userId: string): Promise<string | null> {
    const workspace = await this.prisma.workspace.findFirst({
      where: { ownerId: userId, status: 'active', deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: {
        projects: {
          include: {
            tasks: { where: { deletedAt: null, status: 'todo' }, take: 5, orderBy: { order: 'asc' } },
          },
          take: 1,
        },
        documents: { where: { deletedAt: null }, select: { title: true, documentType: true }, take: 5 },
      },
    })

    if (!workspace) return null

    const lines: string[] = [
      `Workspace: "${workspace.title}" (${workspace.type})`,
    ]
    if (workspace.goal) lines.push(`Goal: ${workspace.goal}`)
    if (workspace.documents.length > 0) {
      lines.push(`Documents: ${workspace.documents.map((d) => d.title).join(', ')}`)
    }
    const todoTasks = workspace.projects[0]?.tasks ?? []
    if (todoTasks.length > 0) {
      lines.push(`Next tasks: ${todoTasks.map((t) => t.title).join('; ')}`)
    }

    return lines.join('\n')
  }

  private async getProgressContext(userId: string): Promise<string | null> {
    const [completed, total] = await Promise.all([
      this.prisma.projectTask.count({
        where: { project: { userId, deletedAt: null }, status: 'done', deletedAt: null },
      }),
      this.prisma.projectTask.count({
        where: { project: { userId, deletedAt: null }, deletedAt: null },
      }),
    ])
    if (total === 0) return null
    const pct = Math.round((completed / total) * 100)
    return `Tasks: ${completed}/${total} completed (${pct}%)`
  }

  /**
   * Get mission context for the user's active mission
   */
  private async getMissionContext(userId: string): Promise<string | null> {
    const mission = await this.prisma.mission.findFirst({
      where: { ownerId: userId, status: { in: ['active', 'planning'] } },
      orderBy: { updatedAt: 'desc' },
      include: {
        progress: true,
      },
    })

    if (!mission) return null

    const lines: string[] = [`Mission: "${mission.title}"`]
    if (mission.objective) lines.push(`Objective: ${mission.objective}`)
    if (mission.progress) {
      lines.push(`Progress: ${mission.progress.percentComplete}% complete (${mission.progress.tasksCompleted}/${mission.progress.tasksTotal} tasks)`)
    }
    if (mission.deadline) {
      const daysLeft = Math.ceil((new Date(mission.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysLeft > 0) {
        lines.push(`Timeline: ${daysLeft} days remaining`)
      }
    }
    if (mission.status) {
      lines.push(`Status: ${mission.status}`)
    }

    return lines.join('\n')
  }

  private async getHistory(conversationId: string): Promise<LLMMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })
    return messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  }

  private async getMemories(userId: string): Promise<string[]> {
    const memories = await this.prisma.dianaMemory.findMany({
      where: { userId },
      orderBy: { referenceCount: 'desc' },
      take: 10,
    })
    return memories.map((m) => `[${m.category}] ${m.key}: ${m.value}`)
  }

  /**
   * Extract memorable facts from the user's message and persist them.
   * Runs after each turn. Uses heuristics (no extra LLM call needed).
   */
  async extractAndSaveMemories(userId: string, userMessage: string): Promise<void> {
    const msg = userMessage.toLowerCase()

    // User's name
    const nameMatch = userMessage.match(/(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+)/i)
    if (nameMatch) {
      await this.saveMemory(userId, 'name', nameMatch[1], 'user_preference')
    }

    // Programming language preference
    const langMatch = msg.match(/(?:i (?:use|prefer|work with|know)|using|we use)\s+(python|javascript|typescript|rust|go|java|c\+\+|ruby|php)/i)
    if (langMatch) {
      await this.saveMemory(userId, 'programming_language', langMatch[1], 'technical_constraint')
    }

    // Company or project context
    const companyMatch = userMessage.match(/(?:my company|our company|we're building|i'm building|working on)\s+(?:is called\s+)?["']?([A-Z][A-Za-z0-9\s]{2,30})["']?/i)
    if (companyMatch) {
      await this.saveMemory(userId, 'company_context', companyMatch[1].trim(), 'project_context')
    }

    // Role/title
    const roleMatch = userMessage.match(/(?:i'm a|i am a|my role is|i work as)\s+([a-z\s]+(?:developer|designer|manager|founder|ceo|cto|engineer|architect|lead))/i)
    if (roleMatch) {
      await this.saveMemory(userId, 'role', roleMatch[1].trim(), 'user_preference')
    }

    // Explicit preference statements
    const prefMatch = userMessage.match(/(?:i prefer|i like|i always|i usually|i want|please)\s+(.{10,60})/i)
    if (prefMatch && !prefMatch[1].includes('?')) {
      await this.saveMemory(userId, `preference_${Date.now()}`, prefMatch[1].trim().slice(0, 100), 'user_preference')
    }
  }

  /**
   * Persist a memory entry (upsert by userId + category + key).
   */
  async saveMemory(
    userId: string,
    key: string,
    value: string,
    category: string = 'user_preference'
  ): Promise<void> {
    await this.prisma.dianaMemory.upsert({
      where: { userId_category_key: { userId, category, key } },
      update: {
        value,
        referenceCount: { increment: 1 },
        lastReferencedAt: new Date(),
      },
      create: { userId, category, key, value },
    })
  }
}
