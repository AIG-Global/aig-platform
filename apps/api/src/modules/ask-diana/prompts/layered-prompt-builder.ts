/**
 * Layered Prompt Builder
 * 
 * Constructs prompts in layers for maintainability:
 * 1. Base system prompt
 * 2. Identity context (user role, preferences)
 * 3. Organization context (company, policies)
 * 4. Conversation context (history, tone)
 * 5. Memory context (facts, preferences)
 * 6. Tool instructions (available functions)
 * 7. Current user prompt (the actual question)
 */

import { ContextBundle } from './context-engine'

export interface PromptLayers {
  systemPrompt: string
  identityContext: string
  organizationContext: string
  conversationContext: string
  memoryContext: string
  toolInstructions: string
  userPrompt: string
}

export class LayeredPromptBuilder {
  /**
   * Build complete prompt from layers
   */
  buildPrompt(
    context: ContextBundle,
    userMessage: string,
    availableTools?: string[],
  ): string {
    const layers = this.buildLayers(context, userMessage, availableTools)
    return this.mergeLayers(layers)
  }

  /**
   * Build individual prompt layers
   */
  buildLayers(
    context: ContextBundle,
    userMessage: string,
    availableTools?: string[],
  ): PromptLayers {
    return {
      systemPrompt: this.buildSystemPrompt(),
      identityContext: this.buildIdentityContext(context.user),
      organizationContext: this.buildOrganizationContext(context.organization),
      conversationContext: this.buildConversationContext(
        context.conversation,
      ),
      memoryContext: this.buildMemoryContext(context.memory),
      toolInstructions: this.buildToolInstructions(availableTools),
      userPrompt: userMessage,
    }
  }

  /**
   * Layer 1: Base system prompt
   */
  private buildSystemPrompt(): string {
    return `You are Ask Diana, an intelligent AI assistant for the AIG Platform.

Your core responsibilities:
- Provide thoughtful, accurate, and helpful responses
- Acknowledge limitations and uncertainty
- Ask clarifying questions when needed
- Maintain professionalism and empathy
- Follow all security and privacy guidelines
- Use available tools when beneficial

Core principles:
- Be concise but thorough
- Cite sources and reasoning
- Respect user privacy
- Adhere to organizational policies
- Provide actionable insights`
  }

  /**
   * Layer 2: Identity context
   */
  private buildIdentityContext(user: any): string {
    const lines = [
      `User Profile:`,
      `- ID: ${user.userId}`,
      `- Name: ${user.username}`,
      `- Roles: ${user.roles.join(', ')}`,
    ]

    if (user.preferences) {
      lines.push(
        `- Preferences: ${JSON.stringify(user.preferences).substring(0, 100)}...`,
      )
    }

    return lines.join('\n')
  }

  /**
   * Layer 3: Organization context
   */
  private buildOrganizationContext(org: any): string {
    if (!org) return ''

    return `Organization Context:
- Organization: ${org.name}
- Org ID: ${org.organizationId}
${org.settings ? `- Settings: ${JSON.stringify(org.settings).substring(0, 100)}...` : ''}`
  }

  /**
   * Layer 4: Conversation context
   */
  private buildConversationContext(conversation: any): string {
    const lines: string[] = ['Conversation Context:']

    if (conversation.topic) {
      lines.push(`- Topic: ${conversation.topic}`)
    }

    if (conversation.intent) {
      lines.push(`- User Intent: ${conversation.intent}`)
    }

    if (conversation.sentiment) {
      lines.push(`- Sentiment: ${conversation.sentiment}`)
    }

    if (conversation.entities.size > 0) {
      lines.push(
        `- Entities: ${Array.from(conversation.entities).slice(0, 5).join(', ')}`,
      )
    }

    return lines.join('\n')
  }

  /**
   * Layer 5: Memory context
   */
  private buildMemoryContext(memory: any): string {
    const lines: string[] = []

    if (memory.longTermFacts.length > 0) {
      lines.push('Long-term Facts:')
      memory.longTermFacts.slice(0, 3).forEach((fact: string) => {
        lines.push(`- ${fact}`)
      })
    }

    if (memory.semanticConcepts.length > 0) {
      lines.push('\nRelevant Concepts:')
      memory.semanticConcepts.slice(0, 3).forEach((concept: string) => {
        lines.push(`- ${concept}`)
      })
    }

    return lines.join('\n')
  }

  /**
   * Layer 6: Tool instructions
   */
  private buildToolInstructions(tools?: string[]): string {
    if (!tools || tools.length === 0) {
      return 'No tools available for this conversation.'
    }

    return `Available Tools:
${tools.map((tool) => `- ${tool}`).join('\n')}

Use tools when beneficial to provide better answers. Always explain when you\'re using a tool.`
  }

  /**
   * Merge all layers into final prompt
   */
  private mergeLayers(layers: PromptLayers): string {
    const parts: string[] = [
      layers.systemPrompt,
      '',
      layers.identityContext,
    ]

    if (layers.organizationContext) {
      parts.push('', layers.organizationContext)
    }

    parts.push(
      '',
      layers.conversationContext,
      '',
      layers.memoryContext,
      '',
      layers.toolInstructions,
      '',
      '---',
      '',
      'User Message:',
      layers.userPrompt,
    )

    return parts.filter((p) => p !== null && p !== undefined).join('\n')
  }

  /**
   * Get system prompt only (for API calls that support system parameter)
   */
  getSystemPrompt(context: ContextBundle): string {
    const layers = this.buildLayers(context, '', [])
    return [
      layers.systemPrompt,
      layers.identityContext,
      layers.organizationContext,
      layers.conversationContext,
      layers.memoryContext,
      layers.toolInstructions,
    ]
      .filter((l) => l)
      .join('\n\n')
  }
}
