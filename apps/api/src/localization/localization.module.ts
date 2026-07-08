import { Module } from '@nestjs/common'
import { LanguageService } from './language.service.js'
import { GeolocationService } from './geolocation.service.js'
import { LocalizationController } from './localization.controller.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [LocalizationController],
  providers: [LanguageService, GeolocationService, PrismaService],
  exports: [LanguageService, GeolocationService]
})
export class LocalizationModule {}
