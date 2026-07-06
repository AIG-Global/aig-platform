import { Injectable } from '@nestjs/common'
import {
  IAIProvider,
  OpenAIProvider,
  AnthropicProvider,
  OllamaProvider,
  AIMessage,
} from '../providers'
import { MemoryManager } from '../memory/memory-manager'
import { ContextEngine } from './context-engine'
import { ToolRunner } from '../tools/tool-runner'
import { PromptBuilder } from '../prompts/prompt-builder'
import {
  ChatMessage,
  CreateChatRequest,
  ChatResponse,
  StreamChatRequest,
  StreamEvent,
} from '../dto'

/**
 * Main Ask Diana chat service
 * Orchestrates AI providers, memory, context, and tools
 */
@Injectable()
export class AskDianaService {
  private providers = new Map<string, IAIProvider>()
  private defaultProviderId = 'openai'
  private memoryManager: MemoryManager
  private contextEngine: ContextEngine
  private toolRunner: ToolRunner

  constructor() {
    this.memoryManager = new MemoryManager()
    this.contextEngine = new ContextEngine()
    this.toolRunner = new ToolRunner()
    this.initializeDefaultProviders()
    this.registerDefaultTools()
  }

  private initializeDefaultProviders(): void {
    // Initialize with environment variables or defaults
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      this.registerProvider(
        'openai',
        new OpenAIProvider({ apiKey: openaiKey }),
      )
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey) {
      this.registerProvider(
        'anthropic',
        new AnthropicProvider({ apiKey: anthropicKey }),
      )
    }

    const ollamaUrl = process.env.OLLAMA_BASE_URL
    if (ollamaUrl) {
      this.registerProvider(
        'ollama',
        new OllamaProvider({ apiKey: '', baseUrl: ollamaUrl }),
      )
    }
  }

  private registerDefaultTools(): void {
    // Example tool: Web search
    this.toolRunner.registerTool(
      'web_search',
      'Search the web for information',
      'search',
      {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query',
          },
          limit: {
            type: 'number',
            description: 'Number of results',
          },
        },
        required: ['query'],
      },
      async (input) => {
        // Placeholder implementation
        return {
          success: true,
          data: {
            results: `Search results for: ${input.query}`,
          },
        }
      },
    )

    // Example tool: Calculator
    this.toolRunner.registerTool(
      'calculator',
      'Perform mathematical calculations',
      'math',
      {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Mathematical expression',
          },
        },
        required: ['expression'],
      },
      async (input) => {
        try {
          // Simple calculator - in production, use safer evaluation
          const result = Function('"use strict";return (' + input.expression + ')')()
          return {
            success: true,
            data: { result },
          }
        } catch (error) {
          return {
            success: false,
            error: String(error),
          }
        }
      },
    )
  }

  registerProvider(id: string, provider: IAIProvider): void {
    this.providers.set(id, provider)
  }

  async chat(userId: string, request: CreateChatRequest): Promise<ChatResponse> {
    const conversationId = request.conversationId || this.generateId()
    const provider = this.getProvider(request.modelId || this.defaultProviderId)

    // Initialize conversation if new
    if (!this.memoryManager.getConversation(conversationId)) {
      this.memoryManager.createConversation(conversationId)
      this.contextEngine.createContext(conversationId, userId)
    }

    // Update context
    this.contextEngine.updateContext(conversationId, request.message)

    // Add user message to memory
    this.memoryManager.addMessage(conversationId, 'user', request.message)

    // Build messages for API
    const messages: AIMessage[] = this.memoryManager
      .getRecentMessages(conversationId, 10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

    // Build prompt
    const promptBuilder = new PromptBuilder({
      userId,
      conversationId,
      toolsAvailable: request.tools,
    })

    // Call AI provider
    const response = await provider.chat(messages, {
      temperature: request.temperature,
      maxTokens: request.maxTokens,
      systemPrompt: promptBuilder.getSystemPrompt(),
    })

    // Add assistant response to memory
    this.memoryManager.addMessage(conversationId, 'assistant', response.content)

    return {
      id: this.generateId(),
      conversationId,
      message: response.content,
      modelId: response.model,
      tokensUsed: response.tokensUsed,
      toolsUsed: response.toolCalls?.map((t) => t.name),
      timestamp: new Date(),
    }
  }

  async *streamChat(
    userId: string,
    request: StreamChatRequest,
  ): AsyncIterable<StreamEvent> {
    const conversationId = request.conversationId || this.generateId()
    const provider = this.getProvider(request.modelId || this.defaultProviderId)

    // Initialize conversation if new
    if (!this.memoryManager.getConversation(conversationId)) {
      this.memoryManager.createConversation(conversationId)
      this.contextEngine.createContext(conversationId, userId)
    }

    // Update context
    this.contextEngine.updateContext(conversationId, request.message)

    // Add user message to memory
    this.memoryManager.addMessage(conversationId, 'user', request.message)

    // Build messages for API
    const messages: AIMessage[] = this.memoryManager
      .getRecentMessages(conversationId, 10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))

    // Build prompt
    const promptBuilder = new PromptBuilder({
      userId,
      conversationId,
      toolsAvailable: request.tools,
    })

    yield {
      type: 'start',
      data: { conversationId },
      timestamp: new Date(),
    }

    let fullResponse = ''

    try {
      for await (const event of provider.streamChat(messages, {
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        systemPrompt: promptBuilder.getSystemPrompt(),
      })) {
        if (event.type === 'token') {
          fullResponse += event.data.token || ''
          yield {
            type: 'token',
            data: event.data,
            timestamp: new Date(),
          }
        } else if (event.type === 'tool_call') {
          yield {
            type: 'tool_call',
            data: event.data,
            timestamp: new Date(),
          }
        } else if (event.type === 'complete') {
          yield {
            type: 'complete',
            data: event.data,
            timestamp: new Date(),
          }
        }
      }

      // Add assistant response to memory
      this.memoryManager.addMessage(conversationId, 'assistant', fullResponse)
    } catch (error) {
      yield {
        type: 'error',
        data: { error: String(error) },
        timestamp: new Date(),
      }
    }
  }

  async getConversationHistory(conversationId: string) {
    const conversation = this.memoryManager.getConversation(conversationId)
    if (!conversation) return null

    return {
      id: conversationId,
      messages: conversation.messages,
      statistics: this.memoryManager.getStatistics(conversationId),
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    this.memoryManager.clear(conversationId)
    // In production, also delete from database
  }

  getAvailableModels() {
    return Array.from(this.providers.keys())
  }

  getAvailableTools() {
    return this.toolRunner.getAvailableTools()
  }

  private getProvider(providerId: string): IAIProvider {
    const provider = this.providers.get(providerId)
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`)
    }
    return provider
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
