import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatServiceMemory } from './chat.service.memory.js'
import { DianaService } from './diana.service.js'
import { DocumentController } from './document.controller.js'
import { DocumentService } from './document.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [ChatController, DocumentController],
  providers: [
    // Use in-memory service for MVP (no database required)
    // Switch to ChatService when PostgreSQL is ready
    { provide: 'ChatService', useClass: ChatServiceMemory },
    ChatServiceMemory,
    DianaService,
    DocumentService,
    PrismaService,
  ],
  exports: [ChatServiceMemory, DianaService, DocumentService, PrismaService],
})
export class ChatModule {}
