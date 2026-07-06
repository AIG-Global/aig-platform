export class CreateDocumentDto {
  conversationId?: string
  userId: string
  title: string
  content: string
  documentType?: string
  tags?: string[]
}

export class UpdateDocumentDto {
  title?: string
  content?: string
  tags?: string[]
}

export class DocumentResponseDto {
  id: string
  conversationId?: string
  userId: string
  title: string
  content: string
  documentType: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
