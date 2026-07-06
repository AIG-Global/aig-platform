import {
  IAIProvider,
  AIMessage,
  AIProviderResponse,
  AIStreamEvent,
  AIProviderConfig,
  AIProviderOptions,
} from './ai-provider.interface'

/**
 * Local Ollama provider implementation
 * For running models locally or on-premises
 */
export class OllamaProvider implements IAIProvider {
  private baseUrl: string
  private timeout: number = 60000
  private model: string = 'mistral'

  constructor(config: AIProviderConfig) {
    this.baseUrl = config.baseUrl ?? 'http://localhost:11434'
    if (config.timeout) this.timeout = config.timeout
  }

  async chat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): Promise<AIProviderResponse> {
    const body = {
      model: this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      num_predict: options?.maxTokens ?? 2000,
      stream: false,
    }

    const response = await this.request<any>('/api/chat', 'POST', body)

    return {
      content: response.message.content,
      tokensUsed: {
        prompt: response.prompt_eval_count || 0,
        completion: response.eval_count || 0,
        total: (response.prompt_eval_count || 0) + (response.eval_count || 0),
      },
      stopReason: 'stop',
      model: this.model,
    }
  }

  async *streamChat(
    messages: AIMessage[],
    options?: AIProviderOptions,
  ): AsyncIterable<AIStreamEvent> {
    const body = {
      model: this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      num_predict: options?.maxTokens ?? 2000,
      stream: true,
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })

        try {
          const parsed = JSON.parse(text)

          if (parsed.message?.content) {
            yield {
              type: 'token',
              data: { token: parsed.message.content },
            }
          }

          if (parsed.done) {
            yield {
              type: 'complete',
              data: {
                tokensUsed: {
                  prompt: parsed.prompt_eval_count || 0,
                  completion: parsed.eval_count || 0,
                  total:
                    (parsed.prompt_eval_count || 0) + (parsed.eval_count || 0),
                },
              },
            }
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      const data = (await response.json()) as any
      return data.models?.map((m: any) => m.name) || []
    } catch {
      return []
    }
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return (await response.json()) as T
  }
}
