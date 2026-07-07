import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { WDMController } from './wdm.controller.js'
import { WDMService } from './wdm.service.js'
import { WDMProductService } from './services/wdm-product.service.js'
import { WDMOrderService } from './services/wdm-order.service.js'
import { WDMSellerService } from './services/wdm-seller.service.js'
import { WDMAffiliateService } from './services/wdm-affiliate.service.js'

@Module({
  providers: [
    PrismaService,
    WDMService,
    WDMProductService,
    WDMOrderService,
    WDMSellerService,
    WDMAffiliateService,
  ],
  controllers: [WDMController],
  exports: [WDMService],
})
export class WDMModule {}
