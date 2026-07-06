export class ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  metadata?: Record<string, any>
}

export class CreateChatRequest {
  conversationId?: string
  message: string
  modelId?: string
  temperature?: number
  maxTokens?: number
  tools?: string[]
  metadata?: Record<string, any>
}

export class ChatResponse {
  id: string
  conversationId: string
  message: string
  modelId: string
  tokensUsed: {
    prompt: number
    completion: number
    total: number
  }
  toolsUsed?: string[]
  metadata?: Record<string, any>
  timestamp: Date
}

export class StreamChatRequest {
  conversationId?: string
  message: string
  modelId?: string
  temperature?: number
  maxTokens?: number
  tools?: string[]
  metadata?: Record<string, any>
}

export class StreamEvent {
  type: 'start' | 'token' | 'tool_call' | 'complete' | 'error'
  data: any
  timestamp: Date
}
