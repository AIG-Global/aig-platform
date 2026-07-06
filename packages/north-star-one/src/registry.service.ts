import { Injectable } from '@nestjs/common'
import { promises as fs } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(import.meta.url).split('/').slice(0, -1).join('/')

export interface RegistryApp {
  id: string
  name: string
  version: string
  status: 'development' | 'testing' | 'stable'
  entry: string
  permissions: string[]
  dependencies?: Record<string, string>
}

export interface RegistryService {
  id: string
  name: string
  version: string
  status: 'development' | 'testing' | 'stable'
  port: number
  endpoints: Array<{
    path: string
    method: string
    description: string
  }>
  dependencies: string[]
}

export interface RegistrySkill {
  id: string
  name: string
  version: string
  category: string
  capabilities: string[]
}

export interface RegistryPlugin {
  id: string
  name: string
  version: string
  category: string
  status: string
  integration: {
    target: string
    method: string
  }
}

/**
 * Registry Service - Manages app, service, skill, and plugin discovery
 * Reads from packages/registry/* JSON files and provides unified access
 */
@Injectable()
export class RegistryService {
  private registryPath = '../registry'
  private apps: RegistryApp[] = []
  private services: RegistryService[] = []
  private skills: RegistrySkill[] = []
  private plugins: RegistryPlugin[] = []
  private loaded = false

  async loadRegistry(): Promise<void> {
    if (this.loaded) return

    try {
      const basePath = join(__dirname, this.registryPath)

      // Load all registry files
      const [appsData, servicesData, skillsData, pluginsData] = await Promise.all([
        this.loadJsonFile(join(basePath, 'apps.json')),
        this.loadJsonFile(join(basePath, 'services.json')),
        this.loadJsonFile(join(basePath, 'skills.json')),
        this.loadJsonFile(join(basePath, 'plugins.json')),
      ])

      this.apps = appsData.apps || []
      this.services = servicesData.services || []
      this.skills = skillsData.skills || []
      this.plugins = pluginsData.plugins || []
      this.loaded = true

      console.log(`✅ Registry loaded: ${this.apps.length} apps, ${this.services.length} services, ${this.skills.length} skills, ${this.plugins.length} plugins`)
    } catch (error) {
      console.error('❌ Failed to load registry:', error)
      throw error
    }
  }

  private async loadJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error)
      return {}
    }
  }

  /**
   * Get all registered applications
   */
  getApps(): RegistryApp[] {
    return this.apps
  }

  /**
   * Get application by ID
   */
  getApp(id: string): RegistryApp | undefined {
    return this.apps.find(app => app.id === id)
  }

  /**
   * Get applications by status
   */
  getAppsByStatus(status: string): RegistryApp[] {
    return this.apps.filter(app => app.status === status)
  }

  /**
   * Get applications by category
   */
  getAppsByCategory(category: string): RegistryApp[] {
    return this.apps.filter(app => app.category === category)
  }

  /**
   * Get all registered backend services
   */
  getServices(): RegistryService[] {
    return this.services
  }

  /**
   * Get service by ID
   */
  getService(id: string): RegistryService | undefined {
    return this.services.find(svc => svc.id === id)
  }

  /**
   * Get services required by app (based on permissions)
   */
  getRequiredServices(appId: string): RegistryService[] {
    const app = this.getApp(appId)
    if (!app) return []

    return this.services.filter(svc =>
      app.permissions?.some(perm => perm.startsWith(svc.id))
    )
  }

  /**
   * Get service dependencies (services that must load first)
   */
  getServiceDependencies(serviceId: string): RegistryService[] {
    const service = this.getService(serviceId)
    if (!service || !service.dependencies) return []

    return service.dependencies
      .map(depId => this.getService(depId))
      .filter((s): s is RegistryService => s !== undefined)
  }

  /**
   * Get all skills
   */
  getSkills(): RegistrySkill[] {
    return this.skills
  }

  /**
   * Get skill by ID
   */
  getSkill(id: string): RegistrySkill | undefined {
    return this.skills.find(skill => skill.id === id)
  }

  /**
   * Get skills by category
   */
  getSkillsByCategory(category: string): RegistrySkill[] {
    return this.skills.filter(skill => skill.category === category)
  }

  /**
   * Get all plugins
   */
  getPlugins(): RegistryPlugin[] {
    return this.plugins
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): RegistryPlugin | undefined {
    return this.plugins.find(plugin => plugin.id === id)
  }

  /**
   * Get plugins by category
   */
  getPluginsByCategory(category: string): RegistryPlugin[] {
    return this.plugins.filter(plugin => plugin.category === category)
  }

  /**
   * Get plugin integration points
   */
  getPluginIntegrations(target: string): RegistryPlugin[] {
    return this.plugins.filter(plugin => plugin.integration.target === target || plugin.integration.target === 'all-services')
  }

  /**
   * Get registry statistics
   */
  getStats() {
    return {
      totalApps: this.apps.length,
      stableApps: this.apps.filter(a => a.status === 'stable').length,
      testingApps: this.apps.filter(a => a.status === 'testing').length,
      devApps: this.apps.filter(a => a.status === 'development').length,
      totalServices: this.services.length,
      totalSkills: this.skills.length,
      totalPlugins: this.plugins.length,
    }
  }
}

export default RegistryService
