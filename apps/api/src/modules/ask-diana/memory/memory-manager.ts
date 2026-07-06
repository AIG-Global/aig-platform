/**
 * Memory management for conversations
 * Handles conversation history, context windows, and summarization
 */

export interface ConversationMemory {
  conversationId: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  metadata: {
    tokenCount: number
    createdAt: Date
    updatedAt: Date
  }
}

export class MemoryManager {
  private conversations = new Map<string, ConversationMemory>()
  private maxTokensPerConversation = 8000
  private maxMessages = 50

  createConversation(conversationId: string): ConversationMemory {
    const memory: ConversationMemory = {
      conversationId,
      messages: [],
      metadata: {
        tokenCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }

    this.conversations.set(conversationId, memory)
    return memory
  }

  addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
  ): void {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`)
    }

    conversation.messages.push({
      role,
      content,
      timestamp: new Date(),
    })

    conversation.metadata.tokenCount += Math.ceil(content.length / 4)
    conversation.metadata.updatedAt = new Date()

    this.pruneIfNeeded(conversationId)
  }

  getConversation(conversationId: string): ConversationMemory | undefined {
    return this.conversations.get(conversationId)
  }

  getMessages(conversationId: string) {
    const conversation = this.conversations.get(conversationId)
    return conversation?.messages || []
  }

  getRecentMessages(conversationId: string, count: number) {
    const messages = this.getMessages(conversationId)
    return messages.slice(-count)
  }

  clear(conversationId: string): void {
    this.conversations.delete(conversationId)
  }

  private pruneIfNeeded(conversationId: string): void {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return

    // Remove messages from start if exceeded
    while (
      conversation.metadata.tokenCount > this.maxTokensPerConversation &&
      conversation.messages.length > 1
    ) {
      const removed = conversation.messages.shift()
      if (removed) {
        conversation.metadata.tokenCount -= Math.ceil(removed.content.length / 4)
      }
    }

    // Keep recent messages if exceeded
    if (conversation.messages.length > this.maxMessages) {
      conversation.messages = conversation.messages.slice(-this.maxMessages)
    }
  }

  getStatistics(conversationId: string) {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return null

    return {
      messageCount: conversation.messages.length,
      tokenCount: conversation.metadata.tokenCount,
      duration:
        new Date().getTime() - conversation.metadata.createdAt.getTime(),
      createdAt: conversation.metadata.createdAt,
      updatedAt: conversation.metadata.updatedAt,
    }
  }
}
