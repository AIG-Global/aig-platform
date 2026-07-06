import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { OrchestratorService } from './orchestrator.service.js'

/**
 * Orchestrator Controller - REST API for app orchestration
 * Endpoints for loading apps, checking status, and health monitoring
 */
@Controller('orchestrator')
export class OrchestratorController {
  constructor(private orchestratorService: OrchestratorService) {}

  /**
   * GET /orchestrator/health - Health check
   */
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'orchestrator',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * GET /orchestrator/status - Get orchestration status
   */
  @Get('status')
  getStatus() {
    return this.orchestratorService.getStatus()
  }

  /**
   * GET /orchestrator/apps - Get all loaded apps
   */
  @Get('apps')
  getLoadedApps() {
    return {
      total: this.orchestratorService.getLoadedApps().length,
      apps: this.orchestratorService.getLoadedApps(),
    }
  }

  /**
   * GET /orchestrator/apps/:id - Get app status
   */
  @Get('apps/:id')
  getAppStatus(@Param('id') appId: string) {
    const status = this.orchestratorService.getAppStatus(appId)
    if (!status) {
      return { error: `App '${appId}' not loaded` }
    }
    return status
  }

  /**
   * POST /orchestrator/apps/:id/load - Load application
   */
  @Post('apps/:id/load')
  async loadApp(@Param('id') appId: string) {
    const result = await this.orchestratorService.loadApp(appId)
    return result
  }

  /**
   * POST /orchestrator/apps/:id/unload - Unload application
   */
  @Post('apps/:id/unload')
  unloadApp(@Param('id') appId: string) {
    this.orchestratorService.unloadApp(appId)
    return {
      appId,
      action: 'unloaded',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * GET /orchestrator/health/check - Full health check
   */
  @Get('health/check')
  async healthCheck() {
    const appHealth = await this.orchestratorService.checkHealth()
    return {
      orchestrator: 'healthy',
      apps: appHealth,
      timestamp: new Date().toISOString(),
    }
  }
}

export default OrchestratorController
