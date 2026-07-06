/**
 * Memory Manager
 * 
 * Unified memory management coordinating:
 * - ConversationMemory: Current chat history
 * - LongTermMemory: User facts and preferences
 * - SemanticMemory: Concepts and relationships
 * - MemoryPruner: Intelligent cleanup
 */

import {
  ConversationMemory,
  LongTermMemory,
  SemanticMemory,
  MemoryPruner,
  PruneStrategy,
} from './sub-engines'

export class MemoryManager {
  private conversations = new Map<string, ConversationMemory>()
  private longTermMemory: LongTermMemory
  private semanticMemory: SemanticMemory
  private pruner: MemoryPruner

  private defaultStrategy: PruneStrategy = {
    maxMessages: 50,
    maxTokens: 8000,
    keepImportant: true,
    summarizeThreshold: 5000,
  }

  constructor() {
    this.longTermMemory = new LongTermMemory()
    this.semanticMemory = new SemanticMemory()
    this.pruner = new MemoryPruner()
  }

  /**
   * Create or get conversation memory
   */
  createConversation(conversationId: string, userId: string): ConversationMemory {
    const existing = this.conversations.get(conversationId)
    if (existing) return existing

    const memory = new ConversationMemory(conversationId, userId)
    this.conversations.set(conversationId, memory)
    return memory
  }

  /**
   * Add message to conversation
   */
  addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
  ): void {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`)
    }

    conversation.addMessage(role, content)
    this.pruneIfNeeded(conversationId)
  }

  /**
   * Get conversation memory
   */
  getConversation(conversationId: string): ConversationMemory | undefined {
    return this.conversations.get(conversationId)
  }

  /**
   * Get messages from conversation
   */
  getMessages(conversationId: string) {
    const conversation = this.conversations.get(conversationId)
    return conversation?.getMessages() || []
  }

  /**
   * Get recent messages (for context window)
   */
  getRecentMessages(conversationId: string, count: number) {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return []
    return conversation.getMessages(count)
  }

  /**
   * Clear conversation
   */
  clear(conversationId: string): void {
    this.conversations.delete(conversationId)
  }

  /**
   * Get all conversations
   */
  getAllConversations(): ConversationMemory[] {
    return Array.from(this.conversations.values())
  }

  /**
   * Get statistics for conversation
   */
  getStatistics(conversationId: string) {
    const conversation = this.conversations.get(conversationId)
    return conversation?.getStats() || null
  }

  /**
   * Access long-term memory
   */
  getLongTermMemory() {
    return this.longTermMemory
  }

  /**
   * Access semantic memory
   */
  getSemanticMemory() {
    return this.semanticMemory
  }

  /**
   * Prune if needed
   */
  private pruneIfNeeded(conversationId: string): void {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) return

    if (this.pruner.needsPruning(conversation, this.defaultStrategy)) {
      this.pruner.prune(conversation, this.defaultStrategy)
    }
  }

  /**
   * Run cleanup on all memories
   */
  cleanup(): void {
    this.longTermMemory.cleanup()
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    return {
      conversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values()).reduce(
        (sum, c) => sum + c.messages.length,
        0,
      ),
      longTermMemories: this.longTermMemory.retrieve('*').length,
      concepts: this.semanticMemory.getAllConcepts().length,
    }
  }
}
