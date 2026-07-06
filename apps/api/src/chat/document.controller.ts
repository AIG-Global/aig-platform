import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common'
import { DocumentService } from './document.service.js'
import { CreateDocumentDto, UpdateDocumentDto, DocumentResponseDto } from './document.dto.js'

@Controller('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  /**
   * POST /api/documents
   * Create a new document
   */
  @Post()
  async createDocument(@Body() dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    return this.documentService.createDocument(dto)
  }

  /**
   * GET /api/documents/:id
   * Get a document by ID
   */
  @Get(':id')
  async getDocument(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentService.getDocument(id)
  }

  /**
   * GET /api/documents/user/:userId
   * Get all documents for a user
   */
  @Get('user/:userId')
  async getUserDocuments(@Param('userId') userId: string): Promise<DocumentResponseDto[]> {
    return this.documentService.getUserDocuments(userId)
  }

  /**
   * GET /api/documents/conversation/:conversationId
   * Get documents created from a conversation
   */
  @Get('conversation/:conversationId')
  async getConversationDocuments(
    @Param('conversationId') conversationId: string
  ): Promise<DocumentResponseDto[]> {
    return this.documentService.getConversationDocuments(conversationId)
  }

  /**
   * PATCH /api/documents/:id
   * Update a document
   */
  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto
  ): Promise<DocumentResponseDto> {
    return this.documentService.updateDocument(id, dto)
  }

  /**
   * DELETE /api/documents/:id
   * Delete a document (soft delete)
   */
  @Delete(':id')
  async deleteDocument(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.documentService.deleteDocument(id)
    return { success: true }
  }
}
