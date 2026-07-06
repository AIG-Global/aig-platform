/**
 * North Star ONE - Central Service Discovery and Orchestration System
 *
 * This module provides:
 * - Application discovery and registry
 * - Service dependency resolution
 * - App lifecycle management
 * - Health monitoring
 */

export { NorthStarOneModule } from './north-star-one.module.js'
export { RegistryService } from './registry.service.js'
export { RegistryController } from './registry.controller.js'
export { OrchestratorService } from './orchestrator.service.js'
export { OrchestratorController } from './orchestrator.controller.js'

export default NorthStarOneModule
