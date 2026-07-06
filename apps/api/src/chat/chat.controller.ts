import { Controller, Post, Get, Patch, Body, Param, Res, HttpCode, Headers } from '@nestjs/common'
import type { Response } from 'express'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
import { DocumentService } from './document.service.js'
import { ProjectService } from '../projects/project.service.js'
import { TaskService } from '../tasks/task.service.js'
import { LLMService } from '../ai/llm.service.js'
import { ContextEngine } from '../ai/context.engine.js'
import { WorkspaceOrchestrator } from '../workspace/workspace.orchestrator.js'
import { PrismaService } from '../prisma.service.js'
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from './chat.dto.js'

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private dianaService: DianaService,
    private documentService: DocumentService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private llmService: LLMService,
    private contextEngine: ContextEngine,
    private workspaceOrchestrator: WorkspaceOrchestrator,
    private prisma: PrismaService,
  ) {}

  /**
   * POST /api/chat/create
   * Create a new conversation
   */
  @Post('create')
  async createConversation(
    @Body() dto: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    return this.chatService.createConversation(dto)
  }

  /**
   * POST /api/chat/greet
   * Generate a contextual greeting for a returning user.
   * Returns { greeting: string } based on mission + workspace + progress context.
   */
  @Post('greet')
  async greet(@Headers('x-user-id') userId: string): Promise<{ greeting: string }> {
    if (!userId) return { greeting: `Welcome to AIGINVEST. I'm Diana.\n\nWhat would you like to accomplish today?` }

    const [workspace, progress, activeMission] = await Promise.all([
      this.prisma.workspace.findFirst({
        where: { ownerId: userId, status: 'active', deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        include: {
          projects: {
            include: {
              tasks: { where: { status: 'todo', deletedAt: null }, take: 1, orderBy: { order: 'asc' } },
            },
            take: 1,
          },
        },
      }),
      this.prisma.projectTask.count({
        where: { project: { userId, deletedAt: null }, status: 'done', deletedAt: null },
      }),
      this.prisma.mission.findFirst({
        where: { ownerId: userId, status: { in: ['active', 'planning'] } },
        orderBy: { updatedAt: 'desc' },
        include: {
          progress: true,
        },
      }),
    ])

    // First-time user
    if (!workspace && !activeMission) {
      return { greeting: `Welcome to AIGINVEST. I'm Diana.\n\nWhat would you like to accomplish today?` }
    }

    // Returning user with mission — reference mission context
    if (activeMission) {
      let greeting = `Welcome back.\n\nYou're working on **${activeMission.title}**.`
      
      if (activeMission.objective) {
        greeting += `\n\n**Goal:** ${activeMission.objective}`
      }
      
      if (activeMission.progress) {
        const progressPercent = activeMission.progress.percentComplete || 0
        greeting += `\n\n**Progress:** ${progressPercent}% complete (${activeMission.progress.tasksCompleted}/${activeMission.progress.tasksTotal} tasks)`
      }
      
      if (activeMission.deadline) {
        const daysLeft = Math.ceil((new Date(activeMission.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (daysLeft > 0) {
          greeting += `\n\n**Timeline:** ${daysLeft} days remaining`
        }
      }
      
      greeting += `\n\nWhat should we focus on next?`
      return { greeting }
    }

    // Returning user — reference workspace + progress
    const nextTask = workspace?.projects[0]?.tasks[0]?.title
    let greeting = `Welcome back.\n\nYour **${workspace?.title}** workspace is ready.`
    if (progress > 0) {
      greeting += ` You've completed **${progress} task${progress > 1 ? 's' : ''}** so far.`
    }
    if (nextTask) {
      greeting += `\n\nNext up: **${nextTask}**.\n\nShall we continue?`
    } else {
      greeting += `\n\nWhat would you like to work on today?`
    }

    return { greeting }
  }

  /**
   * POST /api/chat/message
   * Save a message to a conversation
   */
  @Post('message')
  async saveMessage(@Body() dto: SendMessageDto): Promise<MessageResponseDto> {
    return this.chatService.saveMessage(dto)
  }

  /**
   * POST /api/chat/stream
   * Get Diana's response (simplified version without SSE for MVP)
   * Returns a simple JSON response that the frontend can handle
   */
  /**
   * POST /api/chat/stream
   * SSE streaming endpoint — Diana responds word by word.
   * Detects intent (create_project, create_document) and executes actions.
   */
  @Post('stream')
  async streamResponse(
    @Body() dto: { conversationId: string; userMessage: string; userId?: string },
    @Res() res: Response,
  ): Promise<void> {
    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders()

    const send = (data: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    try {
      // 1. Save user message
      await this.chatService.saveMessage({
        conversationId: dto.conversationId,
        role: 'user',
        content: dto.userMessage,
      })

      // Auto-title: set conversation title from the first user message
      const history = await this.chatService.getMessageHistory(dto.conversationId)
      const userMessages = history.filter((m) => m.role === 'user')
      if (userMessages.length === 1) {
        const shortTitle = dto.userMessage.length > 50
          ? dto.userMessage.slice(0, 50) + '…'
          : dto.userMessage
        await this.chatService.updateConversationTitle(dto.conversationId, shortTitle)
        send({ type: 'title', title: shortTitle })
      }

    // Detect workspace creation intent FIRST (before other actions)
      const workspaceBundle = await this.detectAndCreateWorkspace(
        dto.userMessage,
        dto.userId,
      )
      if (workspaceBundle) {
        send({ type: 'workspace.created', workspace: workspaceBundle })
      }

      // 2. Detect action intent before streaming (project / document creation)
      const actionResult = await this.detectAndExecuteAction(
        dto.userMessage,
        dto.conversationId,
        dto.userId
      )
      if (actionResult) {
        send({ type: 'action', action: actionResult.type, result: actionResult.result })
      }

      // 3. Build context-aware message array
      // If a workspace was just created, prepend context so Diana's response is specific
      const userId = dto.userId || 'anonymous'
      let effectiveMessage = dto.userMessage
      if (workspaceBundle) {
        const { workspace, projectId, taskIds } = workspaceBundle
        effectiveMessage = `${dto.userMessage}\n\n[SYSTEM: Workspace "${workspace.title}" was just created with 1 project, ${taskIds.length} starter tasks, and documents including Business Vision and Product Roadmap. Acknowledge this specifically and ask one concrete next-step question to help the user start working.]`
      }
      const messages = await this.contextEngine.buildMessages(
        dto.conversationId,
        effectiveMessage,
        userId
      )

      // 4. Stream LLM response
      let fullResponse = ''
      for await (const chunk of this.llmService.stream(messages)) {
        if (!chunk.done && chunk.content) {
          fullResponse += chunk.content
          send({ type: 'chunk', content: chunk.content })
        }
      }

      // 5. Save Diana's complete response
      if (fullResponse) {
        await this.chatService.saveMessage({
          conversationId: dto.conversationId,
          role: 'assistant',
          content: fullResponse,
        })
        // Extract and persist memories from user's message (non-blocking)
        this.contextEngine.extractAndSaveMemories(userId, dto.userMessage).catch(() => {})
      }

      send({ type: 'done', response: fullResponse })
    } catch (error) {
      send({ type: 'error', message: error.message })
    } finally {
      res.end()
    }
  }

  private async detectAndCreateWorkspace(
    userMessage: string,
    userId?: string,
  ) {
    if (!userId) return null
    const msg = userMessage.toLowerCase()

    // Goal patterns that indicate workspace creation intent
    const isGoal =
      /(?:i want to|i'm going to|i plan to|let's|i need to|help me)\s+(?:build|create|start|launch|develop|learn|work on)/i.test(msg) ||
      /(?:start|launch|build|create)\s+(?:an?|my)\s+(?:company|startup|business|app|project|website|product)/i.test(msg) ||
      /(?:learn|study|master)\s+(?:how to|to)?\s*\w+/i.test(msg)

    if (!isGoal) return null
    return this.workspaceOrchestrator.createFromGoal(userId, userMessage)
  }

  private async detectAndExecuteAction(
    userMessage: string,
    conversationId: string,
    userId?: string,
  ): Promise<{ type: string; result: any } | null> {
    if (!userId) return null
    const msg = userMessage.toLowerCase()

    if ((msg.includes('create') || msg.includes('new') || msg.includes('start') || msg.includes('make')) && msg.includes('project')) {
      const nameMatch = userMessage.match(/(?:called|named|for|about)\s+["']?([^"'\n,]+)["']?/i)
      const name = nameMatch ? nameMatch[1].trim() : 'New Project'
      const result = await this.projectService.createProject({ userId, conversationId, name, description: userMessage })
      return { type: 'create_project', result }
    }

    if ((msg.includes('create') || msg.includes('write') || msg.includes('draft') || msg.includes('generate')) && (msg.includes('document') || msg.includes('doc') || msg.includes('spec') || msg.includes('plan'))) {
      const nameMatch = userMessage.match(/(?:called|named|for|about|titled)\s+["']?([^"'\n,]+)["']?/i)
      const title = nameMatch ? nameMatch[1].trim() : 'New Document'
      const content = `# ${title}\n\n*Generated by Diana on ${new Date().toLocaleDateString()}*\n\n## Overview\n\n${userMessage}\n\n## Next Steps\n\n- [ ] Review and refine\n- [ ] Share with team\n`
      const result = await this.documentService.createDocument({ userId, conversationId, title, content, documentType: 'document' })
      return { type: 'create_document', result }
    }

    // Task creation: "add a task to X" or "create a task called X"
    if ((msg.includes('add') || msg.includes('create') || msg.includes('new')) && msg.includes('task')) {
      const titleMatch = userMessage.match(/(?:task(?:\s+called|\s+named|\s+to)?|add)\s+["']?([^"'\n,?]+)["']?/i)
      const title = titleMatch ? titleMatch[1].trim() : userMessage.slice(0, 60)
      const projects = await this.projectService.getUserProjects(userId)
      if (projects.length > 0) {
        const result = await this.taskService.createTask({ projectId: projects[0].id, title })
        return { type: 'create_task', result }
      }
    }

    return null
  }

  /**
   * GET /api/chat/user/:userId
   * Get all conversations for a user
   * Must come BEFORE :id route to take precedence
   */
  @Get('user/:userId')
  async getUserConversations(
    @Param('userId') userId: string
  ): Promise<ConversationResponseDto[]> {
    return this.chatService.getUserConversations(userId)
  }

  /**
   * GET /api/chat/:id
   * Get a conversation by ID with all messages
   */
  @Get(':id')
  async getConversation(@Param('id') id: string): Promise<ConversationResponseDto> {
    return this.chatService.getConversation(id)
  }

  /**
   * PATCH /api/chat/:id/title
   * Update conversation title
   */
  @Patch(':id/title')
  async updateTitle(
    @Param('id') id: string,
    @Body() dto: { title: string }
  ): Promise<ConversationResponseDto> {
    return this.chatService.updateConversationTitle(id, dto.title)
  }
}
