/**
 * Ask Diana Service Unit Tests
 * Tests core functionality: chat, streaming, providers, memory
 */

import { Test, TestingModule } from '@nestjs/testing'
import { AskDianaService } from '../ask-diana.service'

describe('AskDianaService', () => {
  let service: AskDianaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AskDianaService],
    }).compile()

    service = module.get<AskDianaService>(AskDianaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('chat', () => {
    it('should handle user message and return response', async () => {
      const result = await service.chat('user-1', {
        message: 'Hello, how are you?',
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('conversationId')
      expect(result).toHaveProperty('message')
      expect(result).toHaveProperty('tokensUsed')
      expect(result).toHaveProperty('timestamp')
    })

    it('should maintain conversation history', async () => {
      const conversationId = 'test-conv-1'

      // First message
      await service.chat('user-1', {
        conversationId,
        message: 'What is 2+2?',
      })

      // Second message
      const result = await service.chat('user-1', {
        conversationId,
        message: 'What about 3+3?',
      })

      expect(result.conversationId).toBe(conversationId)
    })
  })

  describe('getAvailableModels', () => {
    it('should return list of available AI models', () => {
      const models = service.getAvailableModels()
      expect(Array.isArray(models)).toBe(true)
    })
  })

  describe('getAvailableTools', () => {
    it('should return list of available tools', () => {
      const tools = service.getAvailableTools()
      expect(Array.isArray(tools)).toBe(true)
      expect(tools.length).toBeGreaterThan(0)
    })
  })

  describe('deleteConversation', () => {
    it('should delete conversation from memory', async () => {
      const conversationId = 'test-conv-delete'

      // Create conversation
      await service.chat('user-1', {
        conversationId,
        message: 'Test message',
      })

      // Delete it
      await service.deleteConversation(conversationId)

      // Verify it's gone
      const result = await service.getConversationHistory(conversationId)
      expect(result).toBeNull()
    })
  })
})
