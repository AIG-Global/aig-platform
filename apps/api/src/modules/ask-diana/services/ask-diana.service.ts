import { Injectable } from '@nestjs/common'
import {
  IAIProvider,
  OpenAIProvider,
  AnthropicProvider,
  OllamaProvider,
  AIMessage,
  ProviderManager,
  ProviderConfig,
} from '../providers'
import { MemoryManager } from '../memory/memory-manager'
import {
  ContextEngine,
  UserIdentity,
  ContextBundle,
  ConversationContextData,
} from './context-engine'
import { ToolRunner } from '../tools/tool-runner'
import { LayeredPromptBuilder } from '../prompts/layered-prompt-builder'
import { SafetyEngine } from '../safety/safety-engine'
import { KnowledgeEngine } from '../knowledge/knowledge-engine'
import { EventBus, AskDianaEvent } from '../events/event-bus'
import {
  ChatMessage,
  CreateChatRequest,
  ChatResponse,
  StreamChatRequest,
  StreamEvent,
} from '../dto'

/**
 * Ask Diana Service - Main Orchestrator
 * 
 * Coordinates all components:
 * - ContextEngine: Assembles request context
 * - MemoryManager: Manages conversation history
 * - ProviderManager: Routes to AI providers
 * - ToolRunner: Executes tools/functions
 * - SafetyEngine: Validates inputs/outputs
 * - KnowledgeEngine: RAG and document search
 * - PromptBuilder: Constructs layered prompts
 * - EventBus: Publishes lifecycle events
 */
@Injectable()
export class AskDianaService {
  private memoryManager: MemoryManager
  private contextEngine: ContextEngine
  private providerManager: ProviderManager
  private toolRunner: ToolRunner
  private safetyEngine: SafetyEngine
  private knowledgeEngine: KnowledgeEngine
  private promptBuilder: LayeredPromptBuilder
  private eventBus: EventBus

  constructor() {
    this.memoryManager = new MemoryManager()
    this.contextEngine = new ContextEngine()
    this.providerManager = new ProviderManager()
    this.toolRunner = new ToolRunner()
    this.safetyEngine = new SafetyEngine()
    this.knowledgeEngine = new KnowledgeEngine()
    this.promptBuilder = new LayeredPromptBuilder()
    this.eventBus = new EventBus()

    this.initializeProviders()
    this.registerDefaultTools()
  }

  /**
   * Initialize AI providers
   */
  private initializeProviders(): void {
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey) {
      this.providerManager.registerProvider({
        id: 'openai',
        provider: new OpenAIProvider({ apiKey: openaiKey }),
        priority: 1,
        maxRetries: 3,
        timeout: 30000,
        costMultiplier: 1,
        rateLimit: {
          requestsPerMinute: 100,
          tokensPerDay: 1000000,
        },
      })
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey) {
      this.providerManager.registerProvider({
        id: 'anthropic',
        provider: new AnthropicProvider({ apiKey: anthropicKey }),
        priority: 2,
        maxRetries: 3,
        timeout: 30000,
        costMultiplier: 0.8,
        rateLimit: {
          requestsPerMinute: 100,
          tokensPerDay: 1000000,
        },
      })
    }

    const ollamaUrl = process.env.OLLAMA_BASE_URL
    if (ollamaUrl) {
      this.providerManager.registerProvider({
        id: 'ollama',
        provider: new OllamaProvider({ apiKey: '', baseUrl: ollamaUrl }),
        priority: 3,
        maxRetries: 2,
        timeout: 60000,
        costMultiplier: 0,
        rateLimit: {
          requestsPerMinute: 50,
          tokensPerDay: 1000000,
        },
      })
    }
  }

  /**
   * Register default tools
   */
  private registerDefaultTools(): void {
    // Tools will be registered with the new unified interface
    // See tools/example-tools.ts for implementations
  }

  /**
   * Main chat handler (non-streaming)
   */
  async chat(
    userId: string,
    request: CreateChatRequest,
  ): Promise<ChatResponse> {
    const startTime = new Date()
    const conversationId = request.conversationId || this.generateId()

    try {
      // 1. SAFETY CHECK
      const inputSafety = this.safetyEngine.analyzeInput(request.message)
      if (!inputSafety.safe) {
        await this.eventBus.publish({
          type: 'error:occurred',
          timestamp: new Date(),
          data: { error: 'Input failed safety check', details: inputSafety },
          metadata: { userId, conversationId },
        })
        throw new Error(
          `Request blocked: ${inputSafety.recommendations.join(', ')}`,
        )
      }

      // 2. INITIALIZE CONVERSATION
      if (!this.memoryManager.getConversation(conversationId)) {
        this.memoryManager.createConversation(conversationId, userId)
        this.contextEngine.createConversationContext(conversationId, request.message)

        await this.eventBus.publish({
          type: 'conversation:created',
          timestamp: new Date(),
          data: { conversationId },
          metadata: { userId },
        })
      }

      // 3. BUILD CONTEXT
      const user: UserIdentity = {
        userId,
        username: userId,
        roles: ['user'],
        preferences: request.metadata,
      }

      const conversation =
        this.contextEngine.getContext(conversationId) ||
        this.contextEngine.createConversationContext(conversationId, request.message)

      this.contextEngine.updateContext(conversation, request.message)

      // 4. RETRIEVE KNOWLEDGE
      const knowledge = this.knowledgeEngine.search(request.message, 3)

      const context = this.contextEngine.buildContext(
        user,
        conversation,
        this.memoryManager.getLongTermMemory().retrieve(userId).slice(0, 3).map((m) => m.content),
        {
          documents: knowledge.map((k) => ({
            id: k.document.id,
            title: k.document.title,
            relevance: k.relevance,
          })),
          summary: `Found ${knowledge.length} relevant documents`,
        },
      )

      // 5. BUILD PROMPT
      const systemPrompt = this.promptBuilder.getSystemPrompt(context)

      // 6. ADD TO MEMORY
      this.memoryManager.addMessage(conversationId, 'user', request.message)

      // 7. GET PROVIDER
      const provider = this.providerManager.selectProvider(
        request.modelId,
        request.metadata?.costOptimized,
      )

      // 8. CALL PROVIDER
      const messages: AIMessage[] = this.memoryManager
        .getRecentMessages(conversationId, 10)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

      const response = await provider.chat(messages, {
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        systemPrompt,
      })

      // 9. SAFETY CHECK RESPONSE
      const responseSafety = this.safetyEngine.analyzeResponse(response.content)
      let finalResponse = response.content

      if (!responseSafety.safe) {
        console.warn('Response flagged by safety check:', responseSafety)
        finalResponse = '[Response filtered due to safety guidelines]'
      }

      // 10. SAVE TO MEMORY
      this.memoryManager.addMessage(conversationId, 'assistant', finalResponse)

      // 11. PUBLISH EVENT
      await this.eventBus.publish({
        type: 'response:completed',
        timestamp: new Date(),
        data: {
          messageId: this.generateId(),
          tokensUsed: response.tokensUsed,
        },
        metadata: { userId, conversationId },
      })

      return {
        id: this.generateId(),
        conversationId,
        message: finalResponse,
        modelId: response.model,
        tokensUsed: response.tokensUsed,
        toolsUsed: response.toolCalls?.map((t) => t.name),
        timestamp: new Date(),
      }
    } catch (error) {
      await this.eventBus.publish({
        type: 'response:failed',
        timestamp: new Date(),
        data: { error: String(error) },
        metadata: { userId, conversationId },
      })
      throw error
    }
  }

  /**
   * Streaming chat handler
   */
  async *streamChat(
    userId: string,
    request: StreamChatRequest,
  ): AsyncIterable<StreamEvent> {
    const conversationId = request.conversationId || this.generateId()

    try {
      // 1. SAFETY CHECK
      const inputSafety = this.safetyEngine.analyzeInput(request.message)
      if (!inputSafety.safe) {
        yield {
          type: 'error',
          data: { error: 'Input failed safety check' },
          timestamp: new Date(),
        }
        return
      }

      // 2-7. Similar setup as non-streaming...
      if (!this.memoryManager.getConversation(conversationId)) {
        this.memoryManager.createConversation(conversationId, userId)
        this.contextEngine.createConversationContext(conversationId, request.message)
      }

      const user: UserIdentity = {
        userId,
        username: userId,
        roles: ['user'],
        preferences: request.metadata,
      }

      const conversation =
        this.contextEngine.getContext(conversationId) ||
        this.contextEngine.createConversationContext(conversationId, request.message)

      this.contextEngine.updateContext(conversation, request.message)

      this.memoryManager.addMessage(conversationId, 'user', request.message)

      const provider = this.providerManager.selectProvider(request.modelId)
      const context = this.contextEngine.buildContext(user, conversation)
      const systemPrompt = this.promptBuilder.getSystemPrompt(context)

      const messages: AIMessage[] = this.memoryManager
        .getRecentMessages(conversationId, 10)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

      yield {
        type: 'start',
        data: { conversationId },
        timestamp: new Date(),
      }

      let fullResponse = ''

      for await (const event of provider.streamChat(messages, {
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        systemPrompt,
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

      this.memoryManager.addMessage(conversationId, 'assistant', fullResponse)

      await this.eventBus.publish({
        type: 'response:completed',
        timestamp: new Date(),
        data: { conversationId },
        metadata: { userId },
      })
    } catch (error) {
      yield {
        type: 'error',
        data: { error: String(error) },
        timestamp: new Date(),
      }
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string) {
    const conversation = this.memoryManager.getConversation(conversationId)
    if (!conversation) return null

    return {
      id: conversationId,
      messages: conversation.getMessages(),
      statistics: this.memoryManager.getStatistics(conversationId),
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    this.memoryManager.clear(conversationId)

    await this.eventBus.publish({
      type: 'conversation:deleted',
      timestamp: new Date(),
      data: { conversationId },
    })
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return this.providerManager.getAllProviders().map((p) => p.id)
  }

  /**
   * Get available tools
   */
  getAvailableTools() {
    return this.toolRunner.getAvailableTools()
  }

  /**
   * Get components for testing/extension
   */
  getComponents() {
    return {
      memoryManager: this.memoryManager,
      contextEngine: this.contextEngine,
      providerManager: this.providerManager,
      toolRunner: this.toolRunner,
      safetyEngine: this.safetyEngine,
      knowledgeEngine: this.knowledgeEngine,
      promptBuilder: this.promptBuilder,
      eventBus: this.eventBus,
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
