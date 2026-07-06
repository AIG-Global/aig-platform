import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
import { DocumentController } from './document.controller.js'
import { DocumentService } from './document.service.js'
import { PrismaService } from '../prisma.service.js'
import { ProjectService } from '../projects/project.service.js'

@Module({
  controllers: [ChatController, DocumentController],
  providers: [
    ChatService,
    { provide: 'ChatService', useClass: ChatService },
    DianaService,
    DocumentService,
    ProjectService,
    PrismaService,
  ],
  exports: [ChatService, DianaService, DocumentService, ProjectService, PrismaService],
})
export class ChatModule {}
