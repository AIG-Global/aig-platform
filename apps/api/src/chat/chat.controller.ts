import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common'
import { ChatService } from './chat.service.js'
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from './chat.dto.js'

@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

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
