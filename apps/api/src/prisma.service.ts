import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('PrismaService')

  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log('✅ Database connected successfully')
    } catch (error) {
      this.logger.warn('⚠️ Database connection failed - running in mock mode')
      this.logger.warn(`Error: ${error.message}`)
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect()
    } catch (error) {
      this.logger.warn(`Disconnect error: ${error.message}`)
    }
  }
}
