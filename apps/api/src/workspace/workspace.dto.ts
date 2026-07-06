// Workspace DTOs — request/response shapes

export interface CreateWorkspaceDto {
  title: string
  description?: string
  goal?: string
  type?: 'startup' | 'software' | 'personal' | 'learning' | 'general'
  color?: string
  emoji?: string
}

export interface UpdateWorkspaceDto {
  title?: string
  description?: string
  status?: 'active' | 'archived'
  color?: string
  emoji?: string
}

export interface WorkspaceResponseDto {
  id: string
  ownerId: string
  title: string
  description: string | null
  goal: string | null
  type: string
  status: string
  color: string
  emoji: string
  createdAt: Date
  updatedAt: Date
  // Counts (included in list view)
  _count?: {
    projects: number
    documents: number
    conversations: number
  }
}

export interface WorkspaceBundleDto {
  workspace: WorkspaceResponseDto
  projectId: string
  documentId: string
  taskIds: string[]
  memoryId: string
  durationMs: number
}
