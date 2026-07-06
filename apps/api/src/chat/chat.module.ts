import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatService } from './chat.service.js'
import { DianaService } from './diana.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [ChatController],
  providers: [ChatService, DianaService, PrismaService],
  exports: [ChatService, DianaService, PrismaService],
})
export class ChatModule {}
