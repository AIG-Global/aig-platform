/**
 * Tool execution engine
 * Manages tool definitions, validation, and execution
 */

export interface ToolInput {
  [key: string]: any
}

export interface ToolOutput {
  success: boolean
  data?: any
  error?: string
}

export type ToolExecutor = (input: ToolInput) => Promise<ToolOutput>

export interface RegisteredTool {
  name: string
  description: string
  category: string
  schema: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
  executor: ToolExecutor
  enabled: boolean
}

export class ToolRunner {
  private tools = new Map<string, RegisteredTool>()
  private executionHistory: Array<{
    toolName: string
    input: ToolInput
    output: ToolOutput
    duration: number
  }> = []

  registerTool(
    name: string,
    description: string,
    category: string,
    schema: any,
    executor: ToolExecutor,
  ): void {
    this.tools.set(name, {
      name,
      description,
      category,
      schema,
      executor,
      enabled: true,
    })
  }

  async executeTool(name: string, input: ToolInput): Promise<ToolOutput> {
    const tool = this.tools.get(name)

    if (!tool) {
      return {
        success: false,
        error: `Tool ${name} not found`,
      }
    }

    if (!tool.enabled) {
      return {
        success: false,
        error: `Tool ${name} is disabled`,
      }
    }

    const startTime = Date.now()

    try {
      const output = await tool.executor(input)

      this.executionHistory.push({
        toolName: name,
        input,
        output,
        duration: Date.now() - startTime,
      })

      return output
    } catch (error) {
      const output = {
        success: false,
        error: String(error),
      }

      this.executionHistory.push({
        toolName: name,
        input,
        output,
        duration: Date.now() - startTime,
      })

      return output
    }
  }

  getTool(name: string): RegisteredTool | undefined {
    return this.tools.get(name)
  }

  getAvailableTools(): RegisteredTool[] {
    return Array.from(this.tools.values()).filter((t) => t.enabled)
  }

  getToolsByCategory(category: string): RegisteredTool[] {
    return this.getAvailableTools().filter((t) => t.category === category)
  }

  disableTool(name: string): void {
    const tool = this.tools.get(name)
    if (tool) tool.enabled = false
  }

  enableTool(name: string): void {
    const tool = this.tools.get(name)
    if (tool) tool.enabled = true
  }

  getExecutionHistory(limit: number = 100) {
    return this.executionHistory.slice(-limit)
  }

  clearExecutionHistory(): void {
    this.executionHistory = []
  }
}
