/**
 * Long-Term Memory (Persistent)
 * 
 * For future: Stores summaries and important facts
 * Persisted to database for cross-session continuity
 */

export interface Memory {
  id: string
  userId: string
  conversationId: string
  type: 'fact' | 'preference' | 'summary' | 'insight'
  content: string
  importance: number // 0-100
  createdAt: Date
  expiresAt?: Date
}

export class LongTermMemory {
  private memories = new Map<string, Memory[]>()

  /**
   * Store a long-term memory
   */
  store(memory: Memory): void {
    const key = memory.userId
    if (!this.memories.has(key)) {
      this.memories.set(key, [])
    }
    this.memories.get(key)!.push(memory)
  }

  /**
   * Retrieve memories for a user
   */
  retrieve(userId: string, type?: string): Memory[] {
    const userMemories = this.memories.get(userId) || []

    if (type) {
      return userMemories.filter((m) => m.type === type)
    }

    return userMemories
  }

  /**
   * Search memories
   */
  search(userId: string, query: string): Memory[] {
    const userMemories = this.memories.get(userId) || []
    const queryLower = query.toLowerCase()

    return userMemories.filter((m) =>
      m.content.toLowerCase().includes(queryLower),
    )
  }

  /**
   * Clean up expired memories
   */
  cleanup(): void {
    const now = new Date()

    for (const [key, memories] of this.memories.entries()) {
      this.memories.set(
        key,
        memories.filter((m) => !m.expiresAt || m.expiresAt > now),
      )
    }
  }
}
