import {
  IAIProvider,
  AIMessage,
  AIProviderResponse,
  AIStreamEvent,
  AIProviderConfig,
  AIProviderOptions,
} from './ai-provider.interface'

/**
 * Anthropic Claude provider implementation
 * Supports Claude models including Claude 3
 */
export class AnthropicProvider implements IAIProvider {
  private apiKey: string
  private baseUrl: string = 'https://api.anthropic.com/v1'
  private timeout: number = 30000
  private retries: number = 3

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey
    if (config.baseUrl) this.baseUrl = config.baseUrl
    if (config.timeout) this.timeout = config.timeout
    if (config.retries) this.retries = config.retries
  }

  async chat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): Promise<AIProviderResponse> {
    const body = {
      model: 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens ?? 2000,
      temperature: options?.temperature ?? 0.7,
      system: options?.systemPrompt,
      messages,
      tools: this.formatTools(options?.tools),
    }

    const response = await this.request<any>('/messages', 'POST', body)

    return {
      content: response.content[0].text,
      tokensUsed: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      },
      toolCalls: this.extractToolCalls(response.content),
      stopReason: response.stop_reason,
      model: response.model,
    }
  }

  async *streamChat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): AsyncIterable<AIStreamEvent> {
    const body = {
      model: 'claude-3-opus-20240229',
      max_tokens: options?.maxTokens ?? 2000,
      temperature: options?.temperature ?? 0.7,
      system: options?.systemPrompt,
      messages,
      tools: this.formatTools(options?.tools),
    }

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'content_block_delta') {
                if (parsed.delta.type === 'text_delta') {
                  yield {
                    type: 'token',
                    data: { token: parsed.delta.text },
                  }
                }
              }

              if (parsed.type === 'message_stop') {
                yield { type: 'complete', data: {} }
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request<any>('/models', 'GET')
      return true
    } catch {
      return false
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-2.1',
    ]
  }

  private formatTools(tools: any[]) {
    if (!tools || tools.length === 0) return undefined
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }))
  }

  private extractToolCalls(content: any[]) {
    return content
      .filter((c) => c.type === 'tool_use')
      .map((c) => ({
        id: c.id,
        name: c.name,
        parameters: c.input,
      }))
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
  ): Promise<T> {
    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        if (!response.ok) {
          if (response.status === 429 && attempt < this.retries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000),
            )
            continue
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return (await response.json()) as T
      } catch (error) {
        if (attempt === this.retries - 1) throw error
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000),
        )
      }
    }

    throw new Error('Request failed after retries')
  }
}
