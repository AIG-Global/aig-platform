import { Injectable } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import {
  CreateConversationDto,
  SendMessageDto,
  ConversationResponseDto,
  MessageResponseDto,
} from './chat.dto.js'

/**
 * In-memory implementation for MVP testing (no database required)
 * Conversations and messages are stored in memory and will be lost on server restart
 * Use ChatService (Prisma) for production with PostgreSQL
 */
@Injectable()
export class ChatServiceMemory {
  // In-memory storage
  private conversations: Map<
    string,
    {
      id: string
      userId: string
      title: string
      createdAt: Date
      updatedAt: Date
      messages: {
        id: string
        conversationId: string
        role: 'user' | 'assistant'
        content: string
        tokens?: number
        createdAt: Date
      }[]
    }
  > = new Map()

  /**
   * Create a new conversation
   */
  async createConversation(
    dto: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    const id = uuid()
    const now = new Date()

    const conversation = {
      id,
      userId: dto.userId,
      title: dto.title || 'New Chat',
      createdAt: now,
      updatedAt: now,
      messages: [],
    }

    this.conversations.set(id, conversation)

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
    const conversation = this.conversations.get(dto.conversationId)
    if (!conversation) {
      throw new Error(`Conversation not found: ${dto.conversationId}`)
    }

    const messageId = uuid()
    const now = new Date()

    const message = {
      id: messageId,
      conversationId: dto.conversationId,
      role: dto.role,
      content: dto.content,
      createdAt: now,
    }

    conversation.messages.push(message)
    conversation.updatedAt = now

    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      tokens: 0,
      createdAt: message.createdAt,
    }
  }

  /**
   * Get a conversation by ID with all messages
   */
  async getConversation(id: string): Promise<ConversationResponseDto> {
    const conversation = this.conversations.get(id)
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
        role: msg.role,
        content: msg.content,
        tokens: msg.tokens || 0,
        createdAt: msg.createdAt,
      })),
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string): Promise<ConversationResponseDto[]> {
    return Array.from(this.conversations.values())
      .filter((conv) => conv.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map((conv) => ({
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
    const conversation = this.conversations.get(id)
    if (!conversation) {
      throw new Error(`Conversation not found: ${id}`)
    }

    conversation.title = title
    conversation.updatedAt = new Date()

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
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      return []
    }

    return conversation.messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      role: msg.role,
      content: msg.content,
      tokens: msg.tokens || 0,
      createdAt: msg.createdAt,
    }))
  }
}
