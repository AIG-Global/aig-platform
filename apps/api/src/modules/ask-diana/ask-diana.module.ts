import { Module } from '@nestjs/common'
import { AskDianaController } from './controllers'
import { AskDianaService } from './services'

/**
 * Ask Diana Module
 * 
 * Provides AI-powered chat capabilities with:
 * - Multiple AI provider support (OpenAI, Anthropic, Ollama)
 * - Conversation management and memory
 * - Tool execution and function calling
 * - Streaming responses
 * - Context-aware responses
 */
@Module({
  controllers: [AskDianaController],
  providers: [AskDianaService],
  exports: [AskDianaService],
})
export class AskDianaModule {}
