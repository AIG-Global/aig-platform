import { Controller, Get, Param, Query } from '@nestjs/common'
import { RegistryService } from './registry.service.js'

/**
 * Registry Controller - REST API for accessing registry information
 * Endpoints for app discovery, service lookup, and ecosystem browsing
 */
@Controller('registry')
export class RegistryController {
  constructor(private registryService: RegistryService) {}

  /**
   * GET /registry/health - Health check
   */
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'registry',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * GET /registry/stats - Get registry statistics
   */
  @Get('stats')
  stats() {
    return this.registryService.getStats()
  }

  /**
   * GET /registry/apps - List all registered applications
   */
  @Get('apps')
  listApps(@Query('status') status?: string, @Query('category') category?: string) {
    let apps = this.registryService.getApps()

    if (status) {
      apps = this.registryService.getAppsByStatus(status)
    }

    if (category) {
      apps = this.registryService.getAppsByCategory(category)
    }

    return {
      total: apps.length,
      apps,
    }
  }

  /**
   * GET /registry/apps/:id - Get specific application
   */
  @Get('apps/:id')
  getApp(@Param('id') id: string) {
    const app = this.registryService.getApp(id)
    if (!app) {
      return { error: `App '${id}' not found` }
    }
    return app
  }

  /**
   * GET /registry/services - List all backend services
   */
  @Get('services')
  listServices() {
    return {
      total: this.registryService.getServices().length,
      services: this.registryService.getServices(),
    }
  }

  /**
   * GET /registry/services/:id - Get specific service
   */
  @Get('services/:id')
  getService(@Param('id') id: string) {
    const service = this.registryService.getService(id)
    if (!service) {
      return { error: `Service '${id}' not found` }
    }
    return service
  }

  /**
   * GET /registry/services/:id/dependencies - Get service dependencies
   */
  @Get('services/:id/dependencies')
  getServiceDependencies(@Param('id') id: string) {
    const dependencies = this.registryService.getServiceDependencies(id)
    return {
      serviceId: id,
      total: dependencies.length,
      dependencies,
    }
  }

  /**
   * GET /registry/apps/:id/services - Get services required by an app
   */
  @Get('apps/:id/services')
  getAppServices(@Param('id') id: string) {
    const services = this.registryService.getRequiredServices(id)
    return {
      appId: id,
      total: services.length,
      services,
    }
  }

  /**
   * GET /registry/skills - List all skills
   */
  @Get('skills')
  listSkills(@Query('category') category?: string) {
    let skills = this.registryService.getSkills()

    if (category) {
      skills = this.registryService.getSkillsByCategory(category)
    }

    return {
      total: skills.length,
      skills,
    }
  }

  /**
   * GET /registry/skills/:id - Get specific skill
   */
  @Get('skills/:id')
  getSkill(@Param('id') id: string) {
    const skill = this.registryService.getSkill(id)
    if (!skill) {
      return { error: `Skill '${id}' not found` }
    }
    return skill
  }

  /**
   * GET /registry/plugins - List all plugins
   */
  @Get('plugins')
  listPlugins(@Query('category') category?: string) {
    let plugins = this.registryService.getPlugins()

    if (category) {
      plugins = this.registryService.getPluginsByCategory(category)
    }

    return {
      total: plugins.length,
      plugins,
    }
  }

  /**
   * GET /registry/plugins/:id - Get specific plugin
   */
  @Get('plugins/:id')
  getPlugin(@Param('id') id: string) {
    const plugin = this.registryService.getPlugin(id)
    if (!plugin) {
      return { error: `Plugin '${id}' not found` }
    }
    return plugin
  }

  /**
   * GET /registry/plugins/:target/integrations - Get plugins for integration target
   */
  @Get('plugins/:target/integrations')
  getPluginIntegrations(@Param('target') target: string) {
    const plugins = this.registryService.getPluginIntegrations(target)
    return {
      target,
      total: plugins.length,
      plugins,
    }
  }

  /**
   * GET /registry/ecosystem - Get full ecosystem overview
   */
  @Get('ecosystem')
  getEcosystem() {
    return {
      name: 'AIG Platform Ecosystem',
      version: '0.2.0',
      stage: 'Phase 2',
      registry: {
        apps: {
          total: this.registryService.getApps().length,
          byStatus: {
            stable: this.registryService.getAppsByStatus('stable').length,
            testing: this.registryService.getAppsByStatus('testing').length,
            development: this.registryService.getAppsByStatus('development').length,
          },
        },
        services: {
          total: this.registryService.getServices().length,
        },
        skills: {
          total: this.registryService.getSkills().length,
        },
        plugins: {
          total: this.registryService.getPlugins().length,
        },
      },
      stats: this.registryService.getStats(),
      timestamp: new Date().toISOString(),
    }
  }
}

export default RegistryController
