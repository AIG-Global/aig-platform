import { Module } from '@nestjs/common'
import { RegistryService } from './registry.service.js'
import { RegistryController } from './registry.controller.js'
import { OrchestratorService } from './orchestrator.service.js'
import { OrchestratorController } from './orchestrator.controller.js'

/**
 * NorthStarOneModule - Central service discovery and app orchestration
 * Provides registry access and app lifecycle management
 */
@Module({
  controllers: [RegistryController, OrchestratorController],
  providers: [RegistryService, OrchestratorService],
  exports: [RegistryService, OrchestratorService],
})
export class NorthStarOneModule {}

export { RegistryService, OrchestratorService }
export default NorthStarOneModule
