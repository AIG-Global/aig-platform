import { Controller, Post, Get, Patch, Body, Param, Res, HttpCode } from '@nestjs/common'
import type { Response } from 'express'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
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
    private dianaService: DianaService
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
  @Post('stream')
  @HttpCode(200)
  async streamResponse(
    @Body() dto: { conversationId: string; userMessage: string }
  ): Promise<{ response: string; type: string }> {
    try {
      // Save user message first
      await this.chatService.saveMessage({
        conversationId: dto.conversationId,
        role: 'user',
        content: dto.userMessage,
      })

      // Get context-aware response from Diana
      const response = await this.dianaService.respond(dto.conversationId, dto.userMessage)

      // Save Diana's response
      await this.chatService.saveMessage({
        conversationId: dto.conversationId,
        role: 'assistant',
        content: response,
      })

      return { response, type: 'complete' }
    } catch (error) {
      return {
        response: `I encountered an error: ${error.message}`,
        type: 'error',
      }
    }
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
