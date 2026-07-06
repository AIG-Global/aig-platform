/**
 * Conversation Memory
 * 
 * Stores and manages individual conversation histories
 */

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export class ConversationMemory {
  id: string
  userId: string
  messages: ConversationMessage[] = []
  tokenCount: number = 0
  createdAt: Date
  updatedAt: Date

  constructor(id: string, userId: string) {
    this.id = id
    this.userId = userId
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  addMessage(
    role: 'user' | 'assistant' | 'system',
    content: string,
  ): ConversationMessage {
    const message: ConversationMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
    }

    this.messages.push(message)
    this.tokenCount += Math.ceil(content.length / 4)
    this.updatedAt = new Date()

    return message
  }

  getMessages(limit?: number): ConversationMessage[] {
    if (limit) {
      return this.messages.slice(-limit)
    }
    return this.messages
  }

  clear(): void {
    this.messages = []
    this.tokenCount = 0
  }

  getStats() {
    return {
      messageCount: this.messages.length,
      tokenCount: this.tokenCount,
      duration: new Date().getTime() - this.createdAt.getTime(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
