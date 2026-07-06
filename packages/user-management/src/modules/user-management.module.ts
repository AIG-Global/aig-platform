import { Module } from '@nestjs/common'

import { IdentityModule } from '../../../identity/src/modules/identity.module.js'
import { UserManagementService } from '../services/user-management.service'
import { UserManagementController } from '../controllers/user-management.controller'
import { InMemoryUserRepository } from '../repositories/user.repository'

/**
 * UserManagementModule
 * 
 * User account management module
 * Provides:
 * - User CRUD operations
 * - Password management
 * - Role assignment
 * - Account status control
 * - User listing and filtering
 * 
 * Usage:
 * @Module({
 *   imports: [UserManagementModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [IdentityModule],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
    UserManagementService,
  ],
  controllers: [UserManagementController],
  exports: [UserManagementService, 'IUserRepository'],
})
export class UserManagementModule {}
