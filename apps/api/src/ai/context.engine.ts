import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import type { LLMMessage } from './llm.service.js'

const DIANA_SYSTEM_PROMPT = `You are Diana, an AI companion inside AIGINVEST — a platform for building products, managing projects, and organizing work.

Your personality:
- Direct and precise. You don't hedge unnecessarily.
- Genuinely helpful. You focus on what the user actually needs.
- You ask one good clarifying question rather than many shallow ones.
- You remember context within the conversation and reference it naturally.
- You are honest about your limitations. If you don't know, you say so.

Your capabilities:
- Create projects (tell the user when you're creating one)
- Generate documents (tell the user when you're saving one)
- Organize tasks and work
- Think through ideas and strategies
- Remember previous conversations (when memory is available)

Formatting:
- Use markdown. Bold key terms. Use lists when listing things.
- Keep responses focused. Don't pad.
- Don't say "Certainly!", "Of course!", "Great question!" — just answer.

When the user asks you to create a project, respond with confirmation and ask one useful question about it.
When the user asks you to write a document, confirm and describe what you created.`

@Injectable()
export class ContextEngine {
  constructor(private prisma: PrismaService) {}

  /**
   * Build the full message array for the LLM:
   * [system prompt + memories] + [conversation history] + [current message]
   */
  async buildMessages(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<LLMMessage[]> {
    const [history, memories] = await Promise.all([
      this.getHistory(conversationId),
      this.getMemories(userId),
    ])

    const systemContent = memories.length > 0
      ? `${DIANA_SYSTEM_PROMPT}\n\n## What I remember about you:\n${memories.map((m) => `- ${m}`).join('\n')}`
      : DIANA_SYSTEM_PROMPT

    return [
      { role: 'system', content: systemContent },
      ...history,
      { role: 'user', content: userMessage },
    ]
  }

  private async getHistory(conversationId: string): Promise<LLMMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: { conversationId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
    })
    return messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  }

  private async getMemories(userId: string): Promise<string[]> {
    const memories = await this.prisma.dianaMemory.findMany({
      where: { userId },
      orderBy: { referenceCount: 'desc' },
      take: 10,
    })
    return memories.map((m) => `[${m.category}] ${m.key}: ${m.value}`)
  }

  /**
   * Extract memorable facts from the user's message and persist them.
   * Runs after each turn. Uses heuristics (no extra LLM call needed).
   */
  async extractAndSaveMemories(userId: string, userMessage: string): Promise<void> {
    const msg = userMessage.toLowerCase()

    // User's name
    const nameMatch = userMessage.match(/(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+)/i)
    if (nameMatch) {
      await this.saveMemory(userId, 'name', nameMatch[1], 'user_preference')
    }

    // Programming language preference
    const langMatch = msg.match(/(?:i (?:use|prefer|work with|know)|using|we use)\s+(python|javascript|typescript|rust|go|java|c\+\+|ruby|php)/i)
    if (langMatch) {
      await this.saveMemory(userId, 'programming_language', langMatch[1], 'technical_constraint')
    }

    // Company or project context
    const companyMatch = userMessage.match(/(?:my company|our company|we're building|i'm building|working on)\s+(?:is called\s+)?["']?([A-Z][A-Za-z0-9\s]{2,30})["']?/i)
    if (companyMatch) {
      await this.saveMemory(userId, 'company_context', companyMatch[1].trim(), 'project_context')
    }

    // Role/title
    const roleMatch = userMessage.match(/(?:i'm a|i am a|my role is|i work as)\s+([a-z\s]+(?:developer|designer|manager|founder|ceo|cto|engineer|architect|lead))/i)
    if (roleMatch) {
      await this.saveMemory(userId, 'role', roleMatch[1].trim(), 'user_preference')
    }

    // Explicit preference statements
    const prefMatch = userMessage.match(/(?:i prefer|i like|i always|i usually|i want|please)\s+(.{10,60})/i)
    if (prefMatch && !prefMatch[1].includes('?')) {
      await this.saveMemory(userId, `preference_${Date.now()}`, prefMatch[1].trim().slice(0, 100), 'user_preference')
    }
  }

  /**
   * Persist a memory entry (upsert by userId + category + key).
   */
  async saveMemory(
    userId: string,
    key: string,
    value: string,
    category: string = 'user_preference'
  ): Promise<void> {
    await this.prisma.dianaMemory.upsert({
      where: { userId_category_key: { userId, category, key } },
      update: {
        value,
        referenceCount: { increment: 1 },
        lastReferencedAt: new Date(),
      },
      create: { userId, category, key, value },
    })
  }
}
