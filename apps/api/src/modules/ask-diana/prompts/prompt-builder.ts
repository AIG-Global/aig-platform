/**
 * Prompt templates and builders for Ask Diana
 * Handles system prompts, context injection, and prompt engineering
 */

export interface PromptContext {
  userId: string
  conversationId: string
  userBackground?: string
  previousContext?: string
  toolsAvailable?: string[]
  customInstructions?: string
}

export class PromptBuilder {
  private systemPrompt: string = ''
  private context: PromptContext

  constructor(context: PromptContext) {
    this.context = context
    this.buildSystemPrompt()
  }

  private buildSystemPrompt() {
    const parts: string[] = [
      'You are Ask Diana, an intelligent AI assistant designed to help users with analysis, questions, and problem-solving.',
      'You provide thoughtful, accurate, and helpful responses.',
      '',
    ]

    if (this.context.userBackground) {
      parts.push(
        `User Background: ${this.context.userBackground}`,
        '',
      )
    }

    if (this.context.toolsAvailable && this.context.toolsAvailable.length > 0) {
      parts.push(
        `Available Tools: ${this.context.toolsAvailable.join(', ')}`,
        'Use tools when relevant to provide better answers.',
        '',
      )
    }

    if (this.context.customInstructions) {
      parts.push(this.context.customInstructions, '')
    }

    parts.push(
      'Guidelines:',
      '- Be concise but thorough',
      '- Ask clarifying questions if needed',
      '- Provide sources or reasoning for claims',
      '- Acknowledge uncertainty',
      '- Use tools when beneficial',
    )

    this.systemPrompt = parts.join('\n')
  }

  buildContextInjection(): string {
    const parts: string[] = []

    if (this.context.previousContext) {
      parts.push(`Previous context: ${this.context.previousContext}`)
    }

    return parts.join('\n')
  }

  getSystemPrompt(): string {
    return this.systemPrompt
  }

  addContext(contextText: string): void {
    this.context.previousContext = contextText
  }

  updateInstructions(instructions: string): void {
    this.context.customInstructions = instructions
    this.buildSystemPrompt()
  }
}

export const DEFAULT_SYSTEM_PROMPT = `You are Ask Diana, an intelligent AI assistant.
You provide thoughtful, accurate, and helpful responses.
Be concise but thorough.
Acknowledge uncertainty when appropriate.
Use available tools when beneficial.`

export const RAG_SYSTEM_PROMPT = `You are Ask Diana, an intelligent research assistant with access to knowledge bases.
When answering questions:
1. Search relevant knowledge bases for information
2. Cite sources appropriately
3. Synthesize information from multiple sources
4. Acknowledge limitations or gaps in available information`

export const CODE_SYSTEM_PROMPT = `You are Ask Diana, a coding assistant specialized in software development.
When helping with code:
1. Provide clear, well-commented code examples
2. Explain your reasoning
3. Suggest best practices
4. Consider edge cases and error handling`
