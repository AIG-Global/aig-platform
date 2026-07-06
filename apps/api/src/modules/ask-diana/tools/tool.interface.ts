/**
 * Unified Tool Interface
 * 
 * All tools follow this common interface:
 * - Email, Calendar, CRM, GitHub, etc.
 * - Database queries, API calls
 * - Document retrieval, analysis
 * 
 * Consistent behavior across all integrations
 */

export interface ToolInput {
  [key: string]: any
}

export interface ToolOutput {
  success: boolean
  data?: any
  error?: string
  metadata?: {
    executionTime: number
    tokensUsed?: number
    costEstimate?: number
  }
}

export interface ToolMetadata {
  id: string
  name: string
  description: string
  category: 'communication' | 'data' | 'integration' | 'analysis' | 'workflow'
  version: string
  author?: string
  documentation?: string
  rateLimit?: {
    callsPerMinute: number
    callsPerDay: number
  }
  costPerCall?: number
  requiresAuth?: boolean
  retryable?: boolean
}

export interface ToolSchema {
  type: string
  properties: Record<string, any>
  required?: string[]
  description?: string
}

/**
 * Base Tool interface
 * All tools must implement this
 */
export interface ITool {
  metadata: ToolMetadata
  schema: ToolSchema

  /**
   * Execute the tool
   */
  execute(input: ToolInput, context?: Record<string, any>): Promise<ToolOutput>

  /**
   * Validate input against schema
   */
  validate(input: ToolInput): { valid: boolean; errors?: string[] }

  /**
   * Get usage information
   */
  getUsage(): { callsToday: number; lastCalled?: Date }

  /**
   * Health check
   */
  healthCheck(): Promise<boolean>
}

/**
 * Abstract base class for tool implementations
 */
export abstract class BaseTool implements ITool {
  abstract metadata: ToolMetadata
  abstract schema: ToolSchema

  abstract execute(
    input: ToolInput,
    context?: Record<string, any>,
  ): Promise<ToolOutput>

  validate(input: ToolInput): { valid: boolean; errors?: string[] } {
    const errors: string[] = []

    // Check required fields
    if (this.schema.required) {
      for (const field of this.schema.required) {
        if (!(field in input)) {
          errors.push(`Required field missing: ${field}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  getUsage() {
    return {
      callsToday: 0,
      lastCalled: undefined,
    }
  }

  async healthCheck(): Promise<boolean> {
    return true
  }
}
