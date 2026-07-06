import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
import { DocumentController } from './document.controller.js'
import { DocumentService } from './document.service.js'
import { PrismaService } from '../prisma.service.js'
import { ProjectService } from '../projects/project.service.js'
import { TaskService } from '../tasks/task.service.js'
import { AIModule } from '../ai/ai.module.js'
import { WorkspaceOrchestrator } from '../workspace/workspace.orchestrator.js'
import { WorkspaceService } from '../workspace/workspace.service.js'

@Module({
  imports: [AIModule],
  controllers: [ChatController, DocumentController],
  providers: [
    ChatService,
    { provide: 'ChatService', useClass: ChatService },
    DianaService,
    DocumentService,
    ProjectService,
    TaskService,
    PrismaService,
    WorkspaceOrchestrator,
    WorkspaceService,
  ],
  exports: [ChatService, DianaService, DocumentService, ProjectService, TaskService, PrismaService],
})
export class ChatModule {}
