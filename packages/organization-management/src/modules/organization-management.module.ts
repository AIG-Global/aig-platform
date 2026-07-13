import { Module } from '@nestjs/common'

import { IdentityModule } from '@aig/identity'
import { OrganizationManagementService } from '../services/organization-management.service'
import { OrganizationManagementController } from '../controllers/organization-management.controller'
import { InMemoryOrganizationRepository } from '../repositories/organization.repository'

/**
 * OrganizationManagementModule
 * 
 * Multi-tenant organization management module
 * Provides:
 * - Organization CRUD operations
 * - Member management
 * - Plan management
 * - Organization status control
 * - Statistics and reporting
 * 
 * Usage:
 * @Module({
 *   imports: [OrganizationManagementModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [IdentityModule],
  providers: [
    {
      provide: 'IOrganizationRepository',
      useClass: InMemoryOrganizationRepository,
    },
    OrganizationManagementService,
  ],
  controllers: [OrganizationManagementController],
  exports: [OrganizationManagementService, 'IOrganizationRepository'],
})
export class OrganizationManagementModule {}
