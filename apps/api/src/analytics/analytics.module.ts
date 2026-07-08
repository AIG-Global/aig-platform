import { Module } from '@nestjs/common'
import { AnalyticsService } from './analytics.service.js'
import { AnalyticsController } from './analytics.controller.js'
import { InvestmentService } from '../investments/investment.service.js'
import { NorthStarService } from '../investments/north-star.service.js'

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, InvestmentService, NorthStarService],
  exports: [AnalyticsService, InvestmentService, NorthStarService],
})
export class AnalyticsModule {}
