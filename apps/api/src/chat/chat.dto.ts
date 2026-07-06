export class CreateConversationDto {
  title?: string
  userId: string
}

export class SendMessageDto {
  conversationId: string
  content: string
  role: 'user' | 'assistant'
}

export class MessageResponseDto {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  tokens?: number
  createdAt: Date
}

export class ConversationResponseDto {
  id: string
  userId: string
  title?: string
  createdAt: Date
  updatedAt: Date
  messages?: MessageResponseDto[]
}
