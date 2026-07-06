import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from './chat.dto.js'

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new conversation
   */
  async createConversation(
    dto: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.create({
      data: {
        userId: dto.userId,
        title: dto.title || 'New Chat',
      },
    })

    return {
      id: conversation.id,
      userId: conversation.userId,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: [],
    }
  }

  /**
   * Save a message to a conversation
   */
  async saveMessage(dto: SendMessageDto): Promise<MessageResponseDto> {
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: dto.role,
        content: dto.content,
      },
    })

    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role as 'user' | 'assistant',
      content: message.content,
      tokens: message.tokens,
      createdAt: message.createdAt,
    }
  }

  /**
   * Get a conversation by ID with all messages
   */
  async getConversation(id: string): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      throw new Error(`Conversation not found: ${id}`)
    }

    return {
      id: conversation.id,
      userId: conversation.userId,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((msg) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        tokens: msg.tokens,
        createdAt: msg.createdAt,
      })),
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string): Promise<ConversationResponseDto[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
    })

    return conversations.map((conv) => ({
      id: conv.id,
      userId: conv.userId,
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messages: [],
    }))
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(
    id: string,
    title: string
  ): Promise<ConversationResponseDto> {
    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: { title },
    })

    return {
      id: conversation.id,
      userId: conversation.userId,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: [],
    }
  }

  /**
   * Get message history for a conversation
   */
  async getMessageHistory(conversationId: string): Promise<MessageResponseDto[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    })

    return messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      tokens: msg.tokens,
      createdAt: msg.createdAt,
    }))
  }
}
