import { Module } from '@nestjs/common'
import { GeneralsService } from './generals.service.js'
import { GeneralsController } from './generals.controller.js'
import { PoolService } from './pool.service.js'

@Module({
  controllers: [GeneralsController],
  providers: [GeneralsService, PoolService],
  exports: [GeneralsService, PoolService],
})
export class GeneralsModule {}
