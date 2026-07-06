export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ToolCall {
  id: string
  name: string
  parameters: Record<string, any>
}

export interface AIProviderResponse {
  content: string
  toolCalls?: ToolCall[]
  tokensUsed: {
    prompt: number
    completion: number
    total: number
  }
  stopReason?: string
  model: string
}

export interface AIStreamEvent {
  type: 'token' | 'tool_call' | 'complete' | 'error'
  data: {
    token?: string
    toolCall?: ToolCall
    tokensUsed?: { prompt: number; completion: number; total: number }
    error?: string
  }
}

export interface AIProviderConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retries?: number
}

export interface AIProviderOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  tools?: ToolDefinition[]
  systemPrompt?: string
}

export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
}

/**
 * Abstract interface for AI providers
 * Allows switching between different AI models/services without changing application code
 */
export interface IAIProvider {
  /**
   * Send a chat message and get a response
   */
  chat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): Promise<AIProviderResponse>

  /**
   * Stream a chat response token by token
   */
  streamChat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): AsyncIterable<AIStreamEvent>

  /**
   * Check if provider is healthy and has valid credentials
   */
  healthCheck(): Promise<boolean>

  /**
   * Get available models from this provider
   */
  getAvailableModels(): Promise<string[]>
}
