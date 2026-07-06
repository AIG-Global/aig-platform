/**
 * Context Engine
 * 
 * Assembles comprehensive context for AI responses
 * Inputs: user identity, permissions, organization, conversation, memory, documents, preferences
 * Output: ContextBundle with everything the AI needs
 */

export interface UserIdentity {
  userId: string
  username: string
  email?: string
  roles: string[]
  preferences?: Record<string, any>
}

export interface OrganizationContext {
  organizationId: string
  name: string
  settings?: Record<string, any>
  permissions?: string[]
}

export interface ConversationContextData {
  conversationId: string
  topic?: string
  entities: Set<string>
  sentiment?: 'positive' | 'negative' | 'neutral'
  intent?: string
  references: string[]
}

export interface MemoryContext {
  longTermFacts: string[]
  semanticConcepts: string[]
  relatedConversations: string[]
}

export interface DocumentContext {
  documents: Array<{
    id: string
    title: string
    relevance: number
  }>
  summary: string
}

export interface ContextBundle {
  user: UserIdentity
  organization?: OrganizationContext
  conversation: ConversationContextData
  memory: MemoryContext
  documents: DocumentContext
  currentDevice?: string
  location?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export class ContextEngine {
  private entityExtractor = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g
  private contexts = new Map<string, ConversationContextData>()

  /**
   * Build comprehensive context bundle
   */
  buildContext(
    user: UserIdentity,
    conversation: ConversationContextData,
    memory?: MemoryContext,
    documents?: DocumentContext,
    org?: OrganizationContext,
    metadata?: Record<string, any>,
  ): ContextBundle {
    return {
      user,
      organization: org,
      conversation,
      memory: memory || {
        longTermFacts: [],
        semanticConcepts: [],
        relatedConversations: [],
      },
      documents: documents || {
        documents: [],
        summary: '',
      },
      timestamp: new Date(),
      metadata,
    }
  }

  /**
   * Create conversation context
   */
  createConversationContext(
    conversationId: string,
    userMessage: string,
  ): ConversationContextData {
    const context: ConversationContextData = {
      conversationId,
      entities: new Set(),
      references: [],
    }

    this.updateContext(context, userMessage)
    this.contexts.set(conversationId, context)
    return context
  }

  /**
   * Update conversation context with new message
   */
  updateContext(
    context: ConversationContextData,
    userMessage: string,
  ): void {
    // Extract named entities
    const matches = userMessage.match(this.entityExtractor)
    if (matches) {
      matches.forEach((match) => context.entities.add(match))
    }

    // Analyze sentiment
    context.sentiment = this.analyzeSentiment(userMessage)

    // Detect intent
    context.intent = this.extractIntent(userMessage)

    // Extract references
    context.references = this.extractReferences(userMessage)

    // Detect topic if not set
    if (!context.topic) {
      context.topic = this.detectTopic(userMessage)
    }
  }

  /**
   * Get conversation context
   */
  getContext(conversationId: string): ConversationContextData | undefined {
    return this.contexts.get(conversationId)
  }

  /**
   * Analyze sentiment
   */
  private analyzeSentiment(
    text: string,
  ): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'happy',
      'love',
      'amazing',
      'wonderful',
      'fantastic',
      'perfect',
      'awesome',
    ]
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'hate',
      'angry',
      'frustrated',
      'disappointed',
      'sad',
      'horrible',
      'useless',
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

  /**
   * Extract intent from message
   */
  private extractIntent(text: string): string {
    const lowerText = text.toLowerCase()

    if (lowerText.includes('?') || lowerText.match(/^(what|why|how|when|where|who)/))
      return 'question'
    if (lowerText.match(/^(help|please|can you|could you)/)) return 'request'
    if (lowerText.match(/^(i think|i believe|in my opinion)/)) return 'opinion'
    if (lowerText.match(/^(tell|explain|describe|show)/)) return 'explain'
    if (lowerText.match(/^(create|write|generate|build)/)) return 'create'
    if (lowerText.match(/^(analyze|review|check)/)) return 'analyze'

    return 'general'
  }

  /**
   * Extract references from message
   */
  private extractReferences(text: string): string[] {
    const references: string[] = []

    // Look for URLs
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = text.match(urlRegex)
    if (urls) references.push(...urls)

    // Look for emails
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = text.match(emailRegex)
    if (emails) references.push(...emails)

    // Look for file paths or IDs
    const idRegex = /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/g
    const ids = text.match(idRegex)
    if (ids) references.push(...ids)

    return references
  }

  /**
   * Detect topic from message
   */
  private detectTopic(text: string): string {
    const words = text.toLowerCase().split(/\s+/)

    // Simple heuristics
    if (words.some((w) => w.match(/code|program|software|develop/))) {
      return 'programming'
    }
    if (words.some((w) => w.match(/data|analytics|report|metric/))) {
      return 'analytics'
    }
    if (words.some((w) => w.match(/design|ui|ux|interface/))) {
      return 'design'
    }
    if (words.some((w) => w.match(/business|strategy|market/))) {
      return 'business'
    }

    return 'general'
  }

  /**
   * Check permission
   */
  hasPermission(user: UserIdentity, permission: string): boolean {
    return user.roles.some((role) => {
      // Simple RBAC
      const rolePermissions: Record<string, string[]> = {
        admin: ['*'],
        user: ['read', 'create'],
        guest: ['read'],
      }

      const perms = rolePermissions[role] || []
      return perms.includes('*') || perms.includes(permission)
    })
  }

  /**
   * Check organization permission
   */
  hasOrgPermission(
    org: OrganizationContext | undefined,
    permission: string,
  ): boolean {
    if (!org) return false
    return org.permissions?.includes(permission) || false
  }

  /**
   * Check if user can access resource
   */
  canAccess(
    user: UserIdentity,
    resource: { owner?: string; public?: boolean },
  ): boolean {
    if (resource.public) return true
    if (resource.owner === user.userId) return true
    return user.roles.includes('admin')
  }
}
