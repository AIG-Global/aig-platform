/**
 * Context engine for conversation understanding
 * Manages conversation state, context retrieval, and relevance scoring
 */

export interface ConversationContext {
  conversationId: string
  userId: string
  topic?: string
  entities: Set<string>
  sentiment?: 'positive' | 'negative' | 'neutral'
  intent?: string
  references: string[]
}

export class ContextEngine {
  private contexts = new Map<string, ConversationContext>()
  private entityExtractor = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g

  createContext(conversationId: string, userId: string): ConversationContext {
    const context: ConversationContext = {
      conversationId,
      userId,
      entities: new Set(),
      references: [],
    }

    this.contexts.set(conversationId, context)
    return context
  }

  updateContext(conversationId: string, userMessage: string): void {
    const context = this.contexts.get(conversationId)
    if (!context) return

    // Extract named entities
    const matches = userMessage.match(this.entityExtractor)
    if (matches) {
      matches.forEach((match) => context.entities.add(match))
    }

    // Simple sentiment analysis
    context.sentiment = this.analyzeSentiment(userMessage)

    // Extract intent
    context.intent = this.extractIntent(userMessage)
  }

  getContext(conversationId: string): ConversationContext | undefined {
    return this.contexts.get(conversationId)
  }

  addReference(conversationId: string, reference: string): void {
    const context = this.contexts.get(conversationId)
    if (context && !context.references.includes(reference)) {
      context.references.push(reference)
    }
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'happy',
      'love',
      'amazing',
    ]
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'hate',
      'angry',
      'frustrated',
    ]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter((w) =>
      lowerText.includes(w),
    ).length
    const negativeCount = negativeWords.filter((w) =>
      lowerText.includes(w),
    ).length

    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private extractIntent(text: string): string {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('?') || lowerText.match(/^(what|why|how|when|where|who)/))
      return 'question'
    if (lowerText.match(/^(help|please|can you|could you)/)) return 'request'
    if (lowerText.match(/^(i think|i believe|in my opinion)/))
      return 'opinion'
    if (lowerText.match(/^(tell|explain|describe|show)/)) return 'explain'

    return 'general'
  }
}
