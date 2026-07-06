/**
 * Provider Manager
 * 
 * Manages multiple AI providers with:
 * - Model selection and routing
 * - Failover and fallback chains
 * - Cost optimization
 * - Provider health monitoring
 * - Rate limiting per provider
 */

import { IAIProvider, AIProviderConfig } from '../providers'

export interface ProviderConfig {
  id: string
  provider: IAIProvider
  priority: number
  maxRetries: number
  timeout: number
  costMultiplier: number
  rateLimit: {
    requestsPerMinute: number
    tokensPerDay: number
  }
  metadata?: {
    model?: string
    version?: string
    capabilities?: string[]
  }
}

export interface ProviderHealth {
  providerId: string
  healthy: boolean
  lastCheck: Date
  successRate: number
  averageLatency: number
  errorCount: number
  lastError?: string
}

export interface ProviderRoute {
  primary: string
  fallbacks: string[]
  costOptimized?: boolean
}

export class ProviderManager {
  private providers = new Map<string, ProviderConfig>()
  private health = new Map<string, ProviderHealth>()
  private usageStats = new Map<string, { tokensUsed: number; requestsToday: number }>()
  private defaultRoute: ProviderRoute = {
    primary: 'openai',
    fallbacks: ['anthropic', 'ollama'],
  }

  registerProvider(config: ProviderConfig): void {
    this.providers.set(config.id, config)
    this.health.set(config.id, {
      providerId: config.id,
      healthy: true,
      lastCheck: new Date(),
      successRate: 100,
      averageLatency: 0,
      errorCount: 0,
    })
    this.usageStats.set(config.id, {
      tokensUsed: 0,
      requestsToday: 0,
    })
  }

  /**
   * Select best provider based on:
   * - Availability and health
   * - Cost optimization
   * - Rate limits
   * - User preferences
   */
  selectProvider(
    preferredId?: string,
    costOptimized?: boolean,
  ): IAIProvider {
    const route = this.getRoute(preferredId, costOptimized)
    const candidates = [route.primary, ...route.fallbacks]

    for (const providerId of candidates) {
      const provider = this.providers.get(providerId)
      if (!provider) continue

      const health = this.health.get(providerId)
      if (!health?.healthy) continue

      if (!this.checkRateLimit(providerId)) continue

      return provider.provider
    }

    throw new Error(
      `No available providers. Candidates: ${candidates.join(', ')}`,
    )
  }

  /**
   * Get provider route based on strategy
   */
  private getRoute(preferredId?: string, costOptimized?: boolean): ProviderRoute {
    if (preferredId && this.providers.has(preferredId)) {
      return {
        primary: preferredId,
        fallbacks: Array.from(this.providers.keys()).filter((id) => id !== preferredId),
      }
    }

    if (costOptimized) {
      return this.getCostOptimizedRoute()
    }

    return this.defaultRoute
  }

  /**
   * Get cheapest provider route
   */
  private getCostOptimizedRoute(): ProviderRoute {
    const sorted = Array.from(this.providers.values()).sort(
      (a, b) => a.costMultiplier - b.costMultiplier,
    )

    return {
      primary: sorted[0]?.id || 'openai',
      fallbacks: sorted.slice(1).map((p) => p.id),
      costOptimized: true,
    }
  }

  /**
   * Check provider rate limits
   */
  private checkRateLimit(providerId: string): boolean {
    const config = this.providers.get(providerId)
    const stats = this.usageStats.get(providerId)

    if (!config || !stats) return false

    // Check requests per minute
    if (stats.requestsToday >= config.rateLimit.requestsPerMinute) {
      return false
    }

    // Check daily token quota
    if (stats.tokensUsed >= config.rateLimit.tokensPerDay) {
      return false
    }

    return true
  }

  /**
   * Record provider usage
   */
  recordUsage(
    providerId: string,
    tokensUsed: number,
    latency: number,
    success: boolean,
  ): void {
    const stats = this.usageStats.get(providerId)
    const health = this.health.get(providerId)

    if (stats) {
      stats.tokensUsed += tokensUsed
      stats.requestsToday += 1
    }

    if (health) {
      // Update success rate
      const totalRequests =
        health.errorCount + (success ? 1 : 0)
      health.successRate = (1 - health.errorCount / totalRequests) * 100

      // Update average latency
      health.averageLatency =
        (health.averageLatency + latency) / 2

      if (!success) {
        health.errorCount += 1
      }

      health.lastCheck = new Date()
    }
  }

  /**
   * Mark provider as unhealthy
   */
  markUnhealthy(providerId: string, error: string): void {
    const health = this.health.get(providerId)
    if (health) {
      health.healthy = false
      health.lastError = error
      health.errorCount += 1
    }
  }

  /**
   * Mark provider as healthy
   */
  markHealthy(providerId: string): void {
    const health = this.health.get(providerId)
    if (health) {
      health.healthy = true
      health.errorCount = 0
      health.lastError = undefined
    }
  }

  /**
   * Get health status of all providers
   */
  getHealthStatus(): ProviderHealth[] {
    return Array.from(this.health.values())
  }

  /**
   * Check specific provider health
   */
  async healthCheck(providerId: string): Promise<boolean> {
    const provider = this.providers.get(providerId)
    if (!provider) return false

    try {
      const healthy = await provider.provider.healthCheck()
      if (healthy) {
        this.markHealthy(providerId)
      } else {
        this.markUnhealthy(providerId, 'Health check failed')
      }
      return healthy
    } catch (error) {
      this.markUnhealthy(providerId, String(error))
      return false
    }
  }

  /**
   * Get provider configuration
   */
  getProvider(providerId: string): ProviderConfig | undefined {
    return this.providers.get(providerId)
  }

  /**
   * Get all providers
   */
  getAllProviders(): ProviderConfig[] {
    return Array.from(this.providers.values())
  }

  /**
   * Reset daily usage stats (call once per day)
   */
  resetDailyStats(): void {
    for (const stats of this.usageStats.values()) {
      stats.requestsToday = 0
      stats.tokensUsed = 0
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(providerId?: string) {
    if (providerId) {
      return this.usageStats.get(providerId)
    }
    return Object.fromEntries(this.usageStats)
  }
}
