import { Module } from '@nestjs/common'
import { ProgressController } from './progress.controller.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [ProgressController],
  providers: [PrismaService],
})
export class ProgressModule {}
