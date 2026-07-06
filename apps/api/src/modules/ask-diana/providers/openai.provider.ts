import {
  IAIProvider,
  AIMessage,
  AIProviderResponse,
  AIStreamEvent,
  AIProviderConfig,
  AIProviderOptions,
} from './ai-provider.interface'

/**
 * OpenAI provider implementation
 * Supports GPT-4, GPT-3.5-Turbo, and other OpenAI models
 */
export class OpenAIProvider implements IAIProvider {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'
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
      model: 'gpt-4',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      top_p: options?.topP ?? 1,
      tools: this.formatTools(options?.tools),
    }

    const response = await this.request<any>('/chat/completions', 'POST', body)

    return {
      content: response.choices[0].message.content,
      tokensUsed: {
        prompt: response.usage.prompt_tokens,
        completion: response.usage.completion_tokens,
        total: response.usage.total_tokens,
      },
      toolCalls: response.choices[0].message.tool_calls,
      stopReason: response.choices[0].finish_reason,
      model: response.model,
    }
  }

  async *streamChat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): AsyncIterable<AIStreamEvent> {
    const body = {
      model: 'gpt-4',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      top_p: options?.topP ?? 1,
      stream: true,
      tools: this.formatTools(options?.tools),
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
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
            if (data === '[DONE]') {
              yield { type: 'complete', data: {} }
              continue
            }

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices[0].delta

              if (delta.content) {
                yield {
                  type: 'token',
                  data: { token: delta.content },
                }
              }

              if (delta.tool_calls) {
                yield {
                  type: 'tool_call',
                  data: { toolCall: delta.tool_calls[0] },
                }
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
      const response = await this.request<any>('/models/gpt-4', 'GET')
      return !!response.id
    } catch {
      return false
    }
  }

  async getAvailableModels(): Promise<string[]> {
    const response = await this.request<any>('/models', 'GET')
    return response.data
      .filter((m: any) => m.id.includes('gpt'))
      .map((m: any) => m.id)
  }

  private formatTools(tools: any[]) {
    if (!tools || tools.length === 0) return undefined
    return tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
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
            Authorization: `Bearer ${this.apiKey}`,
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
