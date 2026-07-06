import { Injectable } from '@nestjs/common'
import { RegistryService } from './registry.service.js'

export interface AppLoadContext {
  appId: string
  status: 'pending' | 'loading' | 'loaded' | 'failed'
  error?: string
  loadedAt?: Date
  version?: string
}

/**
 * Orchestrator Service - Manages app lifecycle and service coordination
 * Handles app loading, dependency resolution, and health monitoring
 */
@Injectable()
export class OrchestratorService {
  private loadedApps = new Map<string, AppLoadContext>()
  private loadQueue: string[] = []
  private isLoading = false

  constructor(private registryService: RegistryService) {}

  /**
   * Initialize orchestrator - load registry
   */
  async initialize(): Promise<void> {
    console.log('🌟 North Star ONE - Initializing...')
    await this.registryService.loadRegistry()
    console.log('🌟 North Star ONE - Registry loaded')
    console.log(this.registryService.getStats())
  }

  /**
   * Request to load an application
   */
  async loadApp(appId: string): Promise<AppLoadContext> {
    const app = this.registryService.getApp(appId)
    if (!app) {
      const error = `App '${appId}' not found in registry`
      return {
        appId,
        status: 'failed',
        error,
      }
    }

    // Check if already loaded
    const existing = this.loadedApps.get(appId)
    if (existing && (existing.status === 'loaded' || existing.status === 'loading')) {
      return existing
    }

    // Add to queue
    this.loadQueue.push(appId)
    this.processLoadQueue()

    return {
      appId,
      status: 'pending',
    }
  }

  /**
   * Process app load queue with dependency resolution
   */
  private async processLoadQueue(): Promise<void> {
    if (this.isLoading) return
    this.isLoading = true

    while (this.loadQueue.length > 0) {
      const appId = this.loadQueue.shift()!

      // Get required services and dependencies
      const requiredServices = this.registryService.getRequiredServices(appId)
      const allDependencies = await this.resolveDependencies(requiredServices)

      // Load dependencies first
      for (const dep of allDependencies) {
        await this.ensureServiceLoaded(dep.id)
      }

      // Mark app as loaded
      const app = this.registryService.getApp(appId)!
      this.loadedApps.set(appId, {
        appId,
        status: 'loaded',
        loadedAt: new Date(),
        version: app.version,
      })

      console.log(`✅ App loaded: ${appId} v${app.version}`)
    }

    this.isLoading = false
  }

  /**
   * Resolve service dependencies recursively
   */
  private async resolveDependencies(services: any[]): Promise<any[]> {
    const resolved: any[] = []
    const visited = new Set<string>()

    const visit = async (service: any) => {
      if (visited.has(service.id)) return
      visited.add(service.id)

      const deps = this.registryService.getServiceDependencies(service.id)
      for (const dep of deps) {
        await visit(dep)
      }

      resolved.push(service)
    }

    for (const service of services) {
      await visit(service)
    }

    return resolved
  }

  /**
   * Ensure a service is loaded
   */
  private async ensureServiceLoaded(serviceId: string): Promise<void> {
    const service = this.registryService.getService(serviceId)
    if (!service) {
      console.warn(`⚠️  Service '${serviceId}' not found`)
      return
    }

    // In production, this would start the service process/container
    console.log(`📦 Service ready: ${serviceId}`)
  }

  /**
   * Get all loaded apps
   */
  getLoadedApps(): AppLoadContext[] {
    return Array.from(this.loadedApps.values())
  }

  /**
   * Get app load status
   */
  getAppStatus(appId: string): AppLoadContext | undefined {
    return this.loadedApps.get(appId)
  }

  /**
   * Unload an application
   */
  unloadApp(appId: string): void {
    this.loadedApps.delete(appId)
    console.log(`🛑 App unloaded: ${appId}`)
  }

  /**
   * Check health of all loaded apps
   */
  async checkHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {}

    for (const [appId] of this.loadedApps) {
      // In production, would make actual health check requests
      health[appId] = true
    }

    return health
  }

  /**
   * Get orchestration status
   */
  getStatus() {
    const stats = this.registryService.getStats()
    return {
      status: 'online',
      timestamp: new Date().toISOString(),
      registry: stats,
      loadedApps: this.getLoadedApps().length,
      totalApps: stats.totalApps,
      queue: this.loadQueue,
      isProcessing: this.isLoading,
    }
  }
}

export default OrchestratorService
