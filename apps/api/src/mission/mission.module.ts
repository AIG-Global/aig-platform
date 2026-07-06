import { Module } from '@nestjs/common'
import { MissionService } from './mission.service.js'
import { MissionController } from './mission.controller.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  providers: [MissionService, PrismaService],
  controllers: [MissionController],
  exports: [MissionService],
})
export class MissionModule {}
