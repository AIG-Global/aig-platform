# Ask Diana Module

AI-powered conversational assistant with advanced features for the AIG Platform.

## Overview

Ask Diana is a modular, extensible AI assistant built into the AIG Platform API. It provides:

- **Multi-Provider Support** - OpenAI, Anthropic, Google, Ollama, with easy extension
- **Streaming Responses** - Real-time token streaming via Server-Sent Events
- **Tool/Function Calling** - Execute custom tools and functions
- **Conversation Management** - Persistent conversation history
- **Context Engine** - Understand user intent and maintain conversation context
- **Memory Management** - Intelligent conversation pruning and summarization

## Architecture

### Provider Layer

The AI Provider abstraction allows switching between models without changing application code:

```typescript
interface IAIProvider {
  chat(messages: AIMessage[], options?: AIProviderOptions): Promise<AIProviderResponse>
  streamChat(messages: AIMessage[], options?: AIProviderOptions): AsyncIterable<AIStreamEvent>
  healthCheck(): Promise<boolean>
  getAvailableModels(): Promise<string[]>
}
```

Implementations:
- `OpenAIProvider` - GPT-4, GPT-3.5-Turbo, etc.
- `AnthropicProvider` - Claude 3, Claude 2.1
- `OllamaProvider` - Local models (Mistral, Llama2, etc.)

### Service Layer

`AskDianaService` orchestrates:
- Provider selection and management
- Memory management for conversation history
- Context engine for understanding
- Tool execution
- Prompt building and injection

### Components

**Memory Manager** - Maintains conversation history with:
- Automatic pruning when exceeding token limits
- Message retention (recent N messages kept)
- Statistics tracking

**Context Engine** - Extracts and maintains:
- Named entities
- Conversation sentiment
- User intent detection
- References and relationships

**Prompt Builder** - Constructs system prompts with:
- Base instructions for Ask Diana
- User background and context
- Available tools
- Custom instructions

**Tool Runner** - Executes tools with:
- Tool registration
- Input validation
- Execution tracking
- Error handling

**Streaming Response** - Handles SSE streams with:
- Keep-alive pings
- Event formatting
- Error handling
- Graceful shutdown

## API Endpoints

### Chat

```
POST /chat
- Send message and receive complete response
- Request: { message: string, modelId?: string, temperature?: number, maxTokens?: number }
- Response: { id, conversationId, message, tokensUsed, timestamp }

POST /chat/stream
- Stream response tokens in real-time
- Uses Server-Sent Events
- Events: token, tool_call, complete, error
```

### Conversations

```
GET /chat/conversations
- List user's conversations
- Query params: page, pageSize

GET /chat/conversations/:id
- Get conversation with all messages

DELETE /chat/conversations/:id
- Delete conversation
```

### Models & Tools

```
GET /chat/models
- List available AI models and capabilities

POST /chat/tools
- Register new tool (admin only)

GET /chat/tools
- List available tools
```

## Usage Examples

### Basic Chat

```bash
curl -X POST http://localhost:3333/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the capital of France?",
    "modelId": "openai"
  }'
```

### Streaming Response

```bash
curl -X POST http://localhost:3333/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain machine learning",
    "modelId": "openai"
  }'
```

Response events:
```
event: token
data: {"content": "Machine"}

event: token
data: {"content": " learning"}

event: complete
data: {"tokensUsed": {"prompt": 10, "completion": 50, "total": 60}}
```

### With Tools

```bash
curl -X POST http://localhost:3333/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is 15 * 3?",
    "tools": ["calculator"]
  }'
```

### Continue Conversation

```bash
curl -X POST http://localhost:3333/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-123",
    "message": "And what is 20 + 5?"
  }'
```

## Configuration

Environment variables:

```bash
# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434

# Optional
DIANA_MAX_TOKENS_PER_CONVERSATION=8000
DIANA_MAX_MESSAGES_PER_CONVERSATION=50
DIANA_KEEP_ALIVE_INTERVAL=30000
```

## Adding New Providers

1. Create new provider class implementing `IAIProvider`:

```typescript
export class MyProvider implements IAIProvider {
  async chat(messages: AIMessage[], options?: AIProviderOptions): Promise<AIProviderResponse> {
    // Implementation
  }

  async *streamChat(messages: AIMessage[], options?: AIProviderOptions): AsyncIterable<AIStreamEvent> {
    // Implementation
  }

  // ... other methods
}
```

2. Register in `AskDianaService.initializeDefaultProviders()`:

```typescript
this.registerProvider('myprovider', new MyProvider({ apiKey }))
```

## Adding Custom Tools

```typescript
askDianaService.toolRunner.registerTool(
  'web_search',
  'Search the web for information',
  'search',
  {
    type: 'object',
    properties: {
      query: { type: 'string' }
    },
    required: ['query']
  },
  async (input) => {
    const results = await searchWeb(input.query)
    return { success: true, data: results }
  }
)
```

## Testing

```bash
# Unit tests
npm run test -- ask-diana.service.spec
npm run test -- ask-diana.controller.spec

# Integration tests (requires live API provider)
npm run test:integration
```

## Database Schema

When using Prisma, add to `schema.prisma`:

- `Conversation` - Conversation metadata
- `Message` - Individual messages with tokens and metadata
- `Tool` - Tool definitions
- `AIModel` - Available models and capabilities

See [database.models.ts](./models/database.models.ts) for schema.

## Performance Considerations

- **Memory**: Conversations are stored in-memory. For production, use database
- **Token Limits**: Configure per-conversation limits to prevent memory bloat
- **Streaming**: Keep-alive pings every 30s to prevent client timeout
- **Providers**: Each provider has retry logic with exponential backoff
- **Tools**: Tool execution is tracked; avoid blocking operations

## Security

- API keys stored in environment variables
- Tool execution validated against schema
- Conversation access should be restricted to owner (implement auth middleware)
- Rate limiting recommended on API endpoints
- Sanitize user input before tool execution

## Future Enhancements

- [ ] Database persistence (currently in-memory)
- [ ] Conversation summarization for long chats
- [ ] RAG (Retrieval-Augmented Generation) support
- [ ] Multi-modal input (images, documents)
- [ ] Function calling state machine for complex workflows
- [ ] Plugin system for tool loading
- [ ] Analytics and usage tracking
- [ ] Fine-tuning support for custom models
