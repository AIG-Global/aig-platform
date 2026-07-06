import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
import { DocumentController } from './document.controller.js'
import { DocumentService } from './document.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [ChatController, DocumentController],
  providers: [
    // Use Prisma-backed ChatService with PostgreSQL
    ChatService,
    { provide: 'ChatService', useClass: ChatService },
    DianaService,
    DocumentService,
    PrismaService,
  ],
  exports: [ChatService, DianaService, DocumentService, PrismaService],
})
export class ChatModule {}
