/**
 * Database models for Ask Diana
 * Prisma schema definitions for persistence
 */

// This file documents the Prisma schema for Ask Diana
// Add the following to prisma/schema.prisma:

/*
model Conversation {
  id            String   @id @default(cuid())
  userId        String   @db.VarChar(255)
  title         String?
  description   String?
  metadata      Json?
  messageCount  Int      @default(0)
  isBookmarked  Boolean  @default(false)
  tags          String[] @default([])
  
  messages      Message[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?
  
  @@index([userId])
  @@index([createdAt])
  @@fulltext([title, description])
}

model Message {
  id              String   @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  role            String   // 'user' | 'assistant' | 'system'
  content         String   @db.LongText
  modelId         String?
  tokensUsed      Json?    // { prompt: number, completion: number, total: number }
  toolCalls       Json?    // Array of tool calls
  metadata        Json?
  
  createdAt       DateTime @default(now())
  
  @@index([conversationId])
  @@index([role])
}

model Tool {
  id            String   @id @default(cuid())
  name          String   @unique
  description   String
  category      String
  schema        Json     // Tool input schema
  parameters    Json?
  enabled       Boolean  @default(true)
  version       String   @default("1.0.0")
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([category])
  @@index([enabled])
}

model AIModel {
  id            String   @id @default(cuid())
  name          String   @unique
  provider      String   // 'openai' | 'anthropic' | 'google' | 'ollama' | 'other'
  capabilities  Json     // Model capabilities
  metadata      Json     // Pricing, context, etc.
  enabled       Boolean  @default(true)
  version       String   @default("1.0.0")
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([provider])
  @@index([enabled])
}
*/

export interface ConversationEntity {
  id: string
  userId: string
  title?: string
  messageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MessageEntity {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  modelId?: string
  tokensUsed?: {
    prompt: number
    completion: number
    total: number
  }
  createdAt: Date
}

export interface ToolEntity {
  id: string
  name: string
  description: string
  category: string
  schema: any
  enabled: boolean
  version: string
  createdAt: Date
  updatedAt: Date
}

export interface AIModelEntity {
  id: string
  name: string
  provider: string
  capabilities: any
  metadata: any
  enabled: boolean
  version: string
  createdAt: Date
  updatedAt: Date
}
