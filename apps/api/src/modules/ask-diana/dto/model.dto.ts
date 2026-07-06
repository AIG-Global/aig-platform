export interface ModelCapabilities {
  streaming: boolean
  vision: boolean
  tools: boolean
  functionCalling: boolean
  maxTokens: number
}

export class ModelMetadata {
  contextWindow: number
  costPer1kInputTokens: number
  costPer1kOutputTokens: number
  releaseDate: string
  deprecated?: boolean
}

export class AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'ollama' | 'other'
  capabilities: ModelCapabilities
  metadata: ModelMetadata
  enabled: boolean
  version: string
}

export class ListModelsResponse {
  models: AIModel[]
  defaultModelId: string
}
