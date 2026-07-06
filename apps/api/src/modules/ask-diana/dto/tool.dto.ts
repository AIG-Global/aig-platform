export class ToolParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description: string
  required: boolean
  enum?: string[]
}

export class ToolDefinition {
  id: string
  name: string
  description: string
  category: string
  parameters: ToolParameter[]
  enabled: boolean
  version: string
}

export class CreateToolRequest {
  name: string
  description: string
  category: string
  parameters: ToolParameter[]
}

export class ToolResponse {
  id: string
  name: string
  description: string
  category: string
  parameters: ToolParameter[]
  enabled: boolean
  version: string
  createdAt: Date
  updatedAt: Date
}

export class ListToolsResponse {
  tools: ToolResponse[]
  total: number
}
