import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'
import { Response } from 'express'
import { AskDianaService } from '../services'
import { StreamingResponseHandler } from '../streaming/streaming-response'
import {
  CreateChatRequest,
  StreamChatRequest,
  ChatResponse,
  GetConversationResponse,
  ListConversationsResponse,
  ListModelsResponse,
  ListToolsResponse,
  AIModel,
} from '../dto'

/**
 * Ask Diana chat controller
 * Provides REST API endpoints for AI chat and conversation management
 */
@Controller('chat')
export class AskDianaController {
  private streamingHandler = new StreamingResponseHandler()

  constructor(private readonly askDianaService: AskDianaService) {}

  /**
   * POST /chat
   * Send a chat message and get a complete response
   */
  @Post()
  @HttpCode(200)
  async chat(
    @Body() request: CreateChatRequest,
  ): Promise<ChatResponse> {
    if (!request.message) {
      throw new BadRequestException('Message is required')
    }

    // In production, get userId from auth context
    const userId = 'user-123'

    return this.askDianaService.chat(userId, request)
  }

  /**
   * POST /chat/stream
   * Stream a chat response using Server-Sent Events
   */
  @Post('stream')
  async streamChat(
    @Body() request: StreamChatRequest,
    @Res() res: Response,
  ): Promise<void> {
    if (!request.message) {
      throw new BadRequestException('Message is required')
    }

    // In production, get userId from auth context
    const userId = 'user-123'

    try {
      await this.streamingHandler.streamAsyncIterable(
        res,
        this.askDianaService.streamChat(userId, request),
        { keepAliveInterval: 30000 },
      )
    } catch (error) {
      this.streamingHandler.sendError(res, String(error))
    }
  }

  /**
   * GET /chat/conversations
   * List user's conversations
   */
  @Get('conversations')
  async listConversations(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ): Promise<ListConversationsResponse> {
    // In production, fetch from database
    // This is a placeholder implementation
    return {
      conversations: [],
      total: 0,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }
  }

  /**
   * GET /chat/conversations/:id
   * Get a specific conversation with all messages
   */
  @Get('conversations/:id')
  async getConversation(
    @Param('id') conversationId: string,
  ): Promise<GetConversationResponse> {
    const conversation = await this.askDianaService.getConversationHistory(
      conversationId,
    )

    if (!conversation) {
      throw new BadRequestException(`Conversation ${conversationId} not found`)
    }

    return {
      id: conversation.id,
      userId: 'user-123',
      title: conversation.messages[0]?.content.substring(0, 50) || 'Untitled',
      messageCount: conversation.messages.length,
      messages: conversation.messages,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  /**
   * DELETE /chat/conversations/:id
   * Delete a conversation
   */
  @Delete('conversations/:id')
  @HttpCode(204)
  async deleteConversation(@Param('id') conversationId: string): Promise<void> {
    await this.askDianaService.deleteConversation(conversationId)
  }

  /**
   * POST /chat/tools
   * Register a new tool (admin only)
   */
  @Post('tools')
  async registerTool(@Body() tool: any): Promise<void> {
    // In production, validate and persist tool definition
    // This endpoint would typically require admin privileges
  }

  /**
   * GET /chat/tools
   * List available tools
   */
  @Get('tools')
  async listTools(): Promise<ListToolsResponse> {
    const tools = this.askDianaService.getAvailableTools()

    return {
      tools: tools.map((t) => ({
        id: t.name,
        name: t.name,
        description: t.description,
        category: t.category,
        parameters: [],
        enabled: t.enabled,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      total: tools.length,
    }
  }

  /**
   * GET /chat/models
   * List available AI models
   */
  @Get('models')
  async listModels(): Promise<ListModelsResponse> {
    const modelIds = this.askDianaService.getAvailableModels()

    const models: AIModel[] = modelIds.map((id) => ({
      id,
      name: this.getModelName(id),
      provider: this.getModelProvider(id),
      capabilities: this.getModelCapabilities(id),
      metadata: this.getModelMetadata(id),
      enabled: true,
      version: '1.0.0',
    }))

    return {
      models,
      defaultModelId: 'openai',
    }
  }

  private getModelName(id: string): string {
    const names: Record<string, string> = {
      openai: 'GPT-4',
      anthropic: 'Claude 3 Opus',
      ollama: 'Ollama Mistral',
    }
    return names[id] || id
  }

  private getModelProvider(
    id: string,
  ): 'openai' | 'anthropic' | 'google' | 'ollama' | 'other' {
    const providers: Record<
      string,
      'openai' | 'anthropic' | 'google' | 'ollama' | 'other'
    > = {
      openai: 'openai',
      anthropic: 'anthropic',
      ollama: 'ollama',
    }
    return providers[id] || 'other'
  }

  private getModelCapabilities(id: string) {
    return {
      streaming: true,
      vision: id === 'openai' || id === 'anthropic',
      tools: true,
      functionCalling: true,
      maxTokens: 8000,
    }
  }

  private getModelMetadata(id: string) {
    return {
      contextWindow: 8000,
      costPer1kInputTokens: 0.03,
      costPer1kOutputTokens: 0.06,
      releaseDate: '2024-01-01',
    }
  }
}
