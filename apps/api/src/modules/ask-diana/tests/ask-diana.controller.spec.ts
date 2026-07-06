/**
 * Ask Diana Controller Tests
 * Tests API endpoints and request handling
 */

import { Test, TestingModule } from '@nestjs/testing'
import { AskDianaController } from '../controllers/ask-diana.controller'
import { AskDianaService } from '../services/ask-diana.service'

describe('AskDianaController', () => {
  let controller: AskDianaController
  let service: AskDianaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AskDianaController],
      providers: [AskDianaService],
    }).compile()

    controller = module.get<AskDianaController>(AskDianaController)
    service = module.get<AskDianaService>(AskDianaService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('POST /chat', () => {
    it('should reject missing message', async () => {
      try {
        await controller.chat({ message: '' })
        fail('Should have thrown error')
      } catch (error) {
        expect(error.message).toContain('Message is required')
      }
    })

    it('should return chat response', async () => {
      const result = await controller.chat({ message: 'Hello' })
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('message')
    })
  })

  describe('GET /chat/models', () => {
    it('should return available models', async () => {
      const result = await controller.listModels()
      expect(result).toHaveProperty('models')
      expect(result).toHaveProperty('defaultModelId')
      expect(Array.isArray(result.models)).toBe(true)
    })
  })

  describe('GET /chat/tools', () => {
    it('should return available tools', async () => {
      const result = await controller.listTools()
      expect(result).toHaveProperty('tools')
      expect(result).toHaveProperty('total')
      expect(Array.isArray(result.tools)).toBe(true)
    })
  })

  describe('GET /chat/conversations', () => {
    it('should return conversations list', async () => {
      const result = await controller.listConversations()
      expect(result).toHaveProperty('conversations')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('pageSize')
    })
  })
})
