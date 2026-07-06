import { Module } from '@nestjs/common'
import { WorkspaceController } from './workspace.controller.js'
import { WorkspaceService } from './workspace.service.js'
import { WorkspaceOrchestrator } from './workspace.orchestrator.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceOrchestrator, PrismaService],
  exports: [WorkspaceService, WorkspaceOrchestrator],
})
export class WorkspaceModule {}
