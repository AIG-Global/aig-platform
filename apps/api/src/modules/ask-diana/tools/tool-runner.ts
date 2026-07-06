/**
 * Tool Runner
 * 
 * Manages tool registration, validation, and execution
 * Works with unified ITool interface
 */

import { ITool, ToolInput, ToolOutput } from './tool.interface'

export interface ToolExecutionRecord {
  toolName: string
  input: ToolInput
  output: ToolOutput
  duration: number
  timestamp: Date
}

export class ToolRunner {
  private tools = new Map<string, ITool>()
  private executionHistory: ToolExecutionRecord[] = []
  private maxHistorySize = 1000

  /**
   * Register a tool
   */
  registerTool(tool: ITool): void {
    this.tools.set(tool.metadata.id, tool)
  }

  /**
   * Unregister a tool
   */
  unregisterTool(toolId: string): boolean {
    return this.tools.delete(toolId)
  }

  /**
   * Execute a tool with validation
   */
  async executeTool(
    toolId: string,
    input: ToolInput,
    context?: Record<string, any>,
  ): Promise<ToolOutput> {
    const tool = this.tools.get(toolId)

    if (!tool) {
      return {
        success: false,
        error: `Tool ${toolId} not found`,
      }
    }

    // Validate input
    const validation = tool.validate(input)
    if (!validation.valid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`,
      }
    }

    const startTime = Date.now()

    try {
      const output = await tool.execute(input, context)

      const duration = Date.now() - startTime

      // Record execution
      this.recordExecution(toolId, input, output, duration)

      return output
    } catch (error) {
      const output = {
        success: false,
        error: String(error),
      }

      this.recordExecution(toolId, input, output, Date.now() - startTime)

      return output
    }
  }

  /**
   * Batch execute multiple tools
   */
  async executeBatch(
    requests: Array<{ toolId: string; input: ToolInput }>,
    context?: Record<string, any>,
  ): Promise<Array<{ toolId: string; output: ToolOutput }>> {
    return Promise.all(
      requests.map(async (req) => ({
        toolId: req.toolId,
        output: await this.executeTool(req.toolId, req.input, context),
      })),
    )
  }

  /**
   * Get tool by ID
   */
  getTool(toolId: string): ITool | undefined {
    return this.tools.get(toolId)
  }

  /**
   * Get all available tools
   */
  getAvailableTools(): ITool[] {
    return Array.from(this.tools.values())
  }

  /**
   * Get tools by category
   */
  getToolsByCategory(category: string): ITool[] {
    return Array.from(this.tools.values()).filter(
      (t) => t.metadata.category === category,
    )
  }

  /**
   * Check tool health
   */
  async checkToolHealth(toolId: string): Promise<boolean> {
    const tool = this.tools.get(toolId)
    if (!tool) return false

    try {
      return await tool.healthCheck()
    } catch {
      return false
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(toolId?: string, limit: number = 100): ToolExecutionRecord[] {
    let history = this.executionHistory

    if (toolId) {
      history = history.filter((r) => r.toolName === toolId)
    }

    return history.slice(-limit)
  }

  /**
   * Clear execution history
   */
  clearExecutionHistory(): void {
    this.executionHistory = []
  }

  /**
   * Get execution statistics
   */
  getExecutionStats(toolId?: string) {
    const history = toolId
      ? this.executionHistory.filter((r) => r.toolName === toolId)
      : this.executionHistory

    if (history.length === 0) {
      return {
        totalExecutions: 0,
        successCount: 0,
        failureCount: 0,
        averageDuration: 0,
      }
    }

    const successful = history.filter((r) => r.output.success)

    return {
      totalExecutions: history.length,
      successCount: successful.length,
      failureCount: history.length - successful.length,
      averageDuration:
        history.reduce((sum, r) => sum + r.duration, 0) / history.length,
      successRate: (successful.length / history.length) * 100,
    }
  }

  private recordExecution(
    toolId: string,
    input: ToolInput,
    output: ToolOutput,
    duration: number,
  ): void {
    const record: ToolExecutionRecord = {
      toolName: toolId,
      input,
      output,
      duration,
      timestamp: new Date(),
    }

    this.executionHistory.push(record)

    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory.shift()
    }
  }
}
