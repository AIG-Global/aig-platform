export class ConversationMetadata {
  title?: string
  tags?: string[]
  isBookmarked?: boolean
  customData?: Record<string, any>
}

export class ConversationResponse {
  id: string
  userId: string
  title: string
  messageCount: number
  metadata?: ConversationMetadata
  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date
}

export class GetConversationResponse extends ConversationResponse {
  messages: Array<{
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
  }>
}

export class ListConversationsResponse {
  conversations: ConversationResponse[]
  total: number
  page: number
  pageSize: number
}
