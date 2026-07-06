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
   * Stream Diana's response via Server-Sent Events (SSE)
   */
  @Post('stream')
  @HttpCode(200)
  async streamResponse(
    @Body() dto: { conversationId: string; userMessage: string },
    @Res() res: Response
  ) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    try {
      // Get streaming generator
      const stream = await this.dianaService.getStreamingResponse(
        dto.conversationId,
        dto.userMessage
      )

      let fullResponse = ''

      // Stream each chunk
      for await (const chunk of stream) {
        fullResponse += chunk
        res.write(chunk)
      }

      // Save complete response (without streaming overhead)
      const content = fullResponse
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => {
          try {
            return JSON.parse(line.substring(6)).content || ''
          } catch {
            return ''
          }
        })
        .join('')

      if (content) {
        await this.dianaService.saveStreamResponse(dto.conversationId, content)
      }

      res.end()
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          message: error.message,
        })}\n\n`
      )
      res.end()
    }
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
   * GET /api/chat/user/:userId
   * Get all conversations for a user
   */
  @Get('user/:userId')
  async getUserConversations(
    @Param('userId') userId: string
  ): Promise<ConversationResponseDto[]> {
    return this.chatService.getUserConversations(userId)
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
