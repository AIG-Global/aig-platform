import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [AuthController],
  providers: [PrismaService],
})
export class AuthModule {}
