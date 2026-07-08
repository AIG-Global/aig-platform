import { Module } from '@nestjs/common'
import { AuditService } from './audit.service'
import { PrivacyService } from './privacy.service'
import { AuditController } from './audit.controller'
import { PrivacyController } from './privacy.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [AuditController, PrivacyController],
  providers: [AuditService, PrivacyService, PrismaService],
  exports: [AuditService, PrivacyService],
})
export class ComplianceModule {}
