import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { CreateDocumentDto, UpdateDocumentDto, DocumentResponseDto } from './document.dto.js'

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new document (from conversation or standalone)
   */
  async createDocument(dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    const document = await this.prisma.document.create({
      data: {
        conversationId: dto.conversationId,
        userId: dto.userId,
        title: dto.title,
        content: dto.content,
        documentType: dto.documentType || 'document',
        tags: dto.tags || [],
      },
    })

    return this.mapToResponse(document)
  }

  /**
   * Get a document by ID
   */
  async getDocument(id: string): Promise<DocumentResponseDto> {
    const document = await this.prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      throw new Error(`Document not found: ${id}`)
    }

    return this.mapToResponse(document)
  }

  /**
   * Get all documents for a user
   */
  async getUserDocuments(userId: string): Promise<DocumentResponseDto[]> {
    const documents = await this.prisma.document.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return documents.map((doc) => this.mapToResponse(doc))
  }

  /**
   * Get documents for a specific conversation
   */
  async getConversationDocuments(conversationId: string): Promise<DocumentResponseDto[]> {
    const documents = await this.prisma.document.findMany({
      where: {
        conversationId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return documents.map((doc) => this.mapToResponse(doc))
  }

  /**
   * Update a document
   */
  async updateDocument(id: string, dto: UpdateDocumentDto): Promise<DocumentResponseDto> {
    const document = await this.prisma.document.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        tags: dto.tags,
      },
    })

    return this.mapToResponse(document)
  }

  /**
   * Delete a document (soft delete)
   */
  async deleteDocument(id: string): Promise<void> {
    await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  /**
   * Map Prisma document to response DTO
   */
  private mapToResponse(document: any): DocumentResponseDto {
    return {
      id: document.id,
      conversationId: document.conversationId,
      userId: document.userId,
      title: document.title,
      content: document.content,
      documentType: document.documentType,
      tags: document.tags || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }
  }
}
