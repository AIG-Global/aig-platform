import { Module } from '@nestjs/common'
import { AuditService } from './audit.service.js'
import { PrivacyService } from './privacy.service.js'
import { AuditController } from './audit.controller.js'
import { PrivacyController } from './privacy.controller.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [AuditController, PrivacyController],
  providers: [AuditService, PrivacyService, PrismaService],
  exports: [AuditService, PrivacyService],
})
export class ComplianceModule {}
