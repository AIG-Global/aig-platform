# Ask Diana - Architecture Deep Dive

## System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User Request                              │
│                        (POST /chat or /stream)                      │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  AskDianaController    │
                    │  - Validate request    │
                    │  - Extract user auth   │
                    │  - Call service        │
                    └────────────┬───────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  AskDianaService       │
                    │  - Route to provider   │
                    │  - Manage memory       │
                    │  - Execute tools       │
                    └────────────┬───────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │ MemoryManager    │  │ ContextEngine    │  │ PromptBuilder    │
    │ - Load history   │  │ - Extract intent │  │ - Build system   │
    │ - Track tokens   │  │ - Extract entities│ │   prompt         │
    │ - Prune if full  │  │ - Sentiment      │  │ - Inject context │
    └──────────────────┘  └──────────────────┘  └──────────────────┘
            │
            ▼
    ┌────────────────────────┐
    │   AI Provider Route    │
    │   (Select OpenAI,      │
    │    Anthropic, Ollama)  │
    └────────┬───────────────┘
             │
    ┌────────┴──────────┬─────────────────┬─────────────────┐
    │                   │                 │                 │
    ▼                   ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────┐
│  OpenAI     │   │ Anthropic   │   │   Ollama    │   │  Custom  │
│  Provider   │   │  Provider   │   │  Provider   │   │ Provider │
│             │   │             │   │             │   │          │
│ - gpt-4     │   │ - claude-3  │   │ - mistral   │   │ [future] │
│ - gpt-4o    │   │ - claude-2.1│   │ - llama2    │   │          │
│ - gpt-3.5   │   │             │   │ - neural-chat│  │          │
└────┬────────┘   └────┬────────┘   └────┬────────┘   └──────────┘
     │                 │                 │
     └─────────────────┼─────────────────┘
                       │
                       ▼
            ┌────────────────────┐
            │  Stream or Full    │
            │  Response          │
            │                    │
            │ token → token → ..→ complete
            └────────┬───────────┘
                     │
                     ▼
            ┌────────────────────┐
            │ Save to Memory     │
            │ and Database       │
            └────────┬───────────┘
                     │
                     ▼
            ┌────────────────────┐
            │  Response to User  │
            └────────────────────┘
```

## Component Interactions

### 1. Request Processing

```
Request arrives at controller
    ↓
Validation (message required, etc)
    ↓
Extract/Lookup userId
    ↓
Call AskDianaService.chat() or streamChat()
```

### 2. Conversation Setup

```
Check if conversation exists in memory
    ↓
If new: Create conversation & context
    ↓
Load recent messages (rolling window)
    ↓
Update context with new message
```

### 3. Prompt Engineering

```
Get user background/preferences
    ↓
Build base system prompt
    ↓
Add available tools list
    ↓
Add custom instructions
    ↓
Inject previous context if relevant
    ↓
Final prompt ready for AI provider
```

### 4. AI Provider Selection

```
Route based on:
  - Model requested (openai, anthropic, ollama)
  - User preferences
  - Fallback chain if unavailable
```

### 5. Response Handling

For non-streaming:
```
Call provider.chat()
    ↓
Parse response
    ↓
Extract token usage
    ↓
Save to memory
    ↓
Return to client
```

For streaming:
```
Call provider.streamChat()
    ↓
For each event:
  - Format as SSE
  - Send to client
  - Track in memory
    ↓
On complete:
  - Save conversation
  - Send summary
```

## Memory Management

### Conversation Lifecycle

```
CREATE
  └─ Initialize memory store
  └─ Create context
  
ADD_MESSAGE
  └─ Append to messages array
  └─ Update token count
  └─ Check if pruning needed
      ├─ If tokens > MAX: Remove oldest messages
      └─ If messages > MAX: Keep only recent N
  
RETRIEVE
  └─ Get recent M messages (default 10)
  └─ Maintain conversation continuity
  
DELETE
  └─ Clear from memory
  └─ Mark for DB cleanup
```

### Token Counting

```
For each message:
  token_count = Math.ceil(text.length / 4)
  
Rationale:
  - Rough estimate: ~4 chars per token
  - Allows pruning without calling tokenizer
  - Fast computation
```

## Provider Abstraction

All providers implement the same interface:

```typescript
interface IAIProvider {
  // Single response
  chat(messages: AIMessage[], options?: AIProviderOptions)
    → Promise<AIProviderResponse>
  
  // Streaming response
  streamChat(messages: AIMessage[], options?: AIProviderOptions)
    → AsyncIterable<AIStreamEvent>
  
  // Health check
  healthCheck()
    → Promise<boolean>
  
  // Get available models
  getAvailableModels()
    → Promise<string[]>
}
```

This allows:
- ✅ Swapping providers without code changes
- ✅ Failover chains if one provider is down
- ✅ Testing with mock providers
- ✅ Easy addition of new providers

## Tool System

### Tool Registration

```
toolRunner.registerTool(
  name: "web_search",
  description: "Search the web",
  category: "search",
  schema: { /* OpenAI function schema */ },
  executor: async (input) => { /* implementation */ }
)
```

### Tool Execution Flow

```
User message contains tool call
    ↓
Extract tool name and parameters
    ↓
Validate against schema
    ↓
Get registered tool executor
    ↓
Execute with timeout/safety checks
    ↓
Capture output and errors
    ↓
Add to response
    ↓
Include in next conversation turn
```

### Available Tools

- `web_search` - Search the web
- `calculator` - Math operations
- Custom tools registered at runtime

## Context Understanding

### Sentiment Analysis

```
Count positive words: good, great, happy...
Count negative words: bad, terrible, angry...

sentiment = 
  positive_count > negative_count ? "positive" :
  negative_count > positive_count ? "negative" :
  "neutral"
```

### Intent Detection

```
Pattern matching on message start:
  "What/Why/How/..." → "question"
  "Help/Please/Can you..." → "request"
  "Tell/Explain/Show..." → "explain"
  "I think/I believe..." → "opinion"
  Default → "general"
```

### Entity Extraction

```
Regex: /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g

Examples:
  "Ask Diana" → ["Ask", "Diana"]
  "I work at AIG Global" → ["I", "AIG", "Global"]
```

## Streaming Architecture

### Server-Sent Events (SSE)

```
HTTP Response Headers:
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive

Stream Format:
event: token
data: {"content": "Hello"}

event: token
data: {"content": " world"}

event: complete
data: {"tokensUsed": {...}}
```

### Keep-Alive

```
Every 30 seconds: ": keep-alive\n\n"
Prevents client timeout
No-op for client code
```

## Database Schema

Future implementation with Prisma:

```prisma
model Conversation {
  id              String   @id @default(cuid())
  userId          String
  title           String?
  messages        Message[]
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Message {
  id              String   @id @default(cuid())
  conversationId  String
  conversation    Conversation @relation(...)
  role            String   // 'user' | 'assistant'
  content         String
  tokensUsed      Json?    // {prompt, completion, total}
  createdAt       DateTime @default(now())
}
```

## Extension Points

### Add New Provider

1. Implement `IAIProvider`
2. Register in `initializeDefaultProviders()`
3. Add environment variable support

### Add New Tool

1. Call `toolRunner.registerTool()`
2. Implement executor function
3. Define schema

### Customize System Prompt

1. Extend `PromptBuilder`
2. Override `buildSystemPrompt()`
3. Add domain-specific instructions

### Add Context Sources

1. Extend `ContextEngine`
2. Override `updateContext()`
3. Add custom extraction logic

## Performance Tips

- Cache AI model metadata
- Use connection pooling for DB
- Implement request rate limiting
- Monitor token usage per conversation
- Archive old conversations to cold storage
- Use Redis for distributed memory (future)
