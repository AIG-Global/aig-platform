import { Module } from '@nestjs/common'
import { CommissionsService } from './commissions.service.js'
import { CommissionsController } from './commissions.controller.js'
import { AffiliatesService } from './affiliates.service.js'
import { AffiliatesController } from './affiliates.controller.js'
import { AppsService } from './apps.service.js'
import { AppsController } from './apps.controller.js'

@Module({
  controllers: [CommissionsController, AffiliatesController, AppsController],
  providers: [CommissionsService, AffiliatesService, AppsService],
  exports: [CommissionsService, AffiliatesService, AppsService],
})
export class CommissionsModule {}
