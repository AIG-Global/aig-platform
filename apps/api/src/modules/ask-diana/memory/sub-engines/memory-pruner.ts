/**
 * Memory Pruner
 * 
 * Implements intelligent pruning strategies:
 * - Remove oldest messages when limit exceeded
 * - Summarize old messages
 * - Keep important/recent messages
 */

import { ConversationMemory } from './conversation-memory'

export interface PruneStrategy {
  maxMessages: number
  maxTokens: number
  keepImportant: boolean
  summarizeThreshold: number
}

export class MemoryPruner {
  private defaultStrategy: PruneStrategy = {
    maxMessages: 50,
    maxTokens: 8000,
    keepImportant: true,
    summarizeThreshold: 5000,
  }

  /**
   * Check if pruning is needed
   */
  needsPruning(
    memory: ConversationMemory,
    strategy: PruneStrategy = this.defaultStrategy,
  ): boolean {
    return (
      memory.messages.length > strategy.maxMessages ||
      memory.tokenCount > strategy.maxTokens
    )
  }

  /**
   * Prune conversation memory
   */
  prune(
    memory: ConversationMemory,
    strategy: PruneStrategy = this.defaultStrategy,
  ): void {
    // Remove oldest messages first
    while (
      memory.tokenCount > strategy.maxTokens &&
      memory.messages.length > 1
    ) {
      const removed = memory.messages.shift()
      if (removed) {
        memory.tokenCount -= Math.ceil(removed.content.length / 4)
      }
    }

    // Keep recent messages if still over limit
    if (memory.messages.length > strategy.maxMessages) {
      const removed = memory.messages.splice(
        0,
        memory.messages.length - strategy.maxMessages,
      )

      // Recalculate token count
      memory.tokenCount = memory.messages.reduce(
        (sum, msg) => sum + Math.ceil(msg.content.length / 4),
        0,
      )
    }
  }

  /**
   * Create summary of pruned messages
   */
  summarizeMessages(
    messages: any[],
    maxLines: number = 5,
  ): string {
    if (messages.length === 0) return ''

    const userMessages = messages.filter((m) => m.role === 'user')
    const summaryLines = [
      `Summary of ${messages.length} previous messages:`,
      ...userMessages.slice(0, maxLines).map((m, i) => `${i + 1}. ${m.content.substring(0, 100)}`),
    ]

    return summaryLines.join('\n')
  }
}
