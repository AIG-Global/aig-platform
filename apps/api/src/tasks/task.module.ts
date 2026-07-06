import { Module } from '@nestjs/common'
import { TaskController } from './task.controller.js'
import { TaskService } from './task.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  exports: [TaskService],
})
export class TaskModule {}
