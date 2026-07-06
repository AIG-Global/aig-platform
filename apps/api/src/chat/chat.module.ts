import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller.js'
import { ChatService } from './chat.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService],
  exports: [ChatService, PrismaService],
})
export class ChatModule {}
