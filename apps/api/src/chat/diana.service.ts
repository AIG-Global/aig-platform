import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

@Injectable()
export class DianaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Mock Diana response generator
   * In production, this will call OpenAI/Claude/etc
   */
  async *streamDianaResponse(userMessage: string): AsyncGenerator<string> {
    // Simulated Diana thinking time
    const responses = {
      default: [
        'I understand. ',
        'Let me think about that. ',
        'Based on what you told me, ',
        'Here is what I recommend: ',
        '1. Start with a clear objective. ',
        '2. Break it into milestones. ',
        '3. Define success metrics. ',
        'This approach has worked well for many teams. ',
        'What aspect would you like to explore first?',
      ],
      project: [
        'Building a great product requires: ',
        '1. Clear vision and milestones ',
        '2. A focused team ',
        '3. Regular feedback loops ',
        '4. Ruthless prioritization ',
        'Let us define your first sprint together.',
      ],
    }

    // Determine response type based on keywords
    const keyword = userMessage.toLowerCase()
    const responseText = keyword.includes('project') || keyword.includes('build')
      ? responses.project
      : responses.default

    // Stream response word by word
    for (const chunk of responseText) {
      await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate network delay
      yield `data: ${JSON.stringify({
        type: 'text',
        content: chunk,
        timestamp: new Date().toISOString(),
      })}\n\n`
    }

    // End stream
    yield `data: ${JSON.stringify({
      type: 'done',
      timestamp: new Date().toISOString(),
    })}\n\n`
  }

  /**
   * Process streaming response and return async generator
   */
  async getStreamingResponse(
    conversationId: string,
    userMessage: string
  ): Promise<AsyncGenerator<string>> {
    // Save user message
    await this.prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: userMessage,
      },
    })

    // Generate streaming response
    return this.streamDianaResponse(userMessage)
  }

  /**
   * Save complete response after streaming
   */
  async saveStreamResponse(
    conversationId: string,
    fullResponse: string,
    tokenCount: number = 0
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: fullResponse,
        tokens: tokenCount,
      },
    })
  }
}
