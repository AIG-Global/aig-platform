import { Module } from '@nestjs/common'
import { LLMService } from './llm.service.js'
import { ContextEngine } from './context.engine.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  providers: [LLMService, ContextEngine, PrismaService],
  exports: [LLMService, ContextEngine],
})
export class AIModule {}
