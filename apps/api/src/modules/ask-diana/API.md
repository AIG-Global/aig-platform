# Ask Diana API Documentation

Complete API reference for the Ask Diana AI assistant module.

## Base URL

```
http://localhost:3333/api/chat
```

## Authentication

Add to request headers (in production):
```
Authorization: Bearer <jwt-token>
```

---

## Endpoints

### 1. Chat (Non-Streaming)

**Endpoint:** `POST /chat`

Send a message and receive a complete response.

**Request:**
```json
{
  "conversationId": "conv-123",
  "message": "What is the capital of France?",
  "modelId": "openai",
  "temperature": 0.7,
  "maxTokens": 2000,
  "tools": ["web_search"],
  "metadata": {
    "source": "web"
  }
}
```

**Parameters:**
- `message` (required, string) - User message
- `conversationId` (optional, string) - Continue existing conversation
- `modelId` (optional, string) - AI model to use (default: "openai")
  - Options: "openai", "anthropic", "ollama"
- `temperature` (optional, number 0-2) - Response creativity
- `maxTokens` (optional, number) - Maximum response length
- `tools` (optional, array) - Tools to make available
- `metadata` (optional, object) - Custom metadata

**Response:**
```json
{
  "id": "msg-1719123456-abc123",
  "conversationId": "conv-123",
  "message": "The capital of France is Paris.",
  "modelId": "gpt-4",
  "tokensUsed": {
    "prompt": 15,
    "completion": 8,
    "total": 23
  },
  "toolsUsed": [],
  "timestamp": "2024-06-23T14:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Response received
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing auth
- `500 Server Error` - Provider error

**Examples:**

Simple question:
```bash
curl -X POST http://localhost:3333/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is 2+2?"
  }'
```

With conversation history:
```bash
curl -X POST http://localhost:3333/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv-abc",
    "message": "Tell me more about that"
  }'
```

With custom settings:
```bash
curl -X POST http://localhost:3333/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a poem about summer",
    "modelId": "anthropic",
    "temperature": 0.9,
    "maxTokens": 500
  }'
```

---

### 2. Stream Chat

**Endpoint:** `POST /chat/stream`

Stream response tokens in real-time using Server-Sent Events.

**Request:**
```json
{
  "conversationId": "conv-123",
  "message": "Explain quantum computing",
  "modelId": "openai",
  "temperature": 0.7
}
```

**Response Format:**

Server-Sent Events stream with these event types:

**Event: start**
```
event: start
data: {"conversationId": "conv-123"}
```

**Event: token**
```
event: token
data: {"content": "Quantum"}

event: token
data: {"content": " computing"}

event: token
data: {"content": " is"}
```

**Event: tool_call**
```
event: tool_call
data: {
  "toolName": "web_search",
  "parameters": {"query": "quantum computing latest"},
  "toolCallId": "call-123"
}
```

**Event: complete**
```
event: complete
data: {
  "tokensUsed": {
    "prompt": 12,
    "completion": 145,
    "total": 157
  }
}
```

**Event: error**
```
event: error
data: {"message": "Provider error: API key invalid"}
```

**Examples:**

JavaScript/Node.js:
```javascript
const eventSource = new EventSource('/api/chat/stream');

eventSource.addEventListener('token', (event) => {
  const data = JSON.parse(event.data);
  console.log(data.content);
});

eventSource.addEventListener('complete', (event) => {
  const data = JSON.parse(event.data);
  console.log('Done! Tokens used:', data.tokensUsed);
  eventSource.close();
});

eventSource.addEventListener('error', (event) => {
  const data = JSON.parse(event.data);
  console.error('Error:', data.message);
  eventSource.close();
});
```

Using `curl` with streaming:
```bash
curl -X POST http://localhost:3333/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}' \
  -N
```

Python with streaming:
```python
import requests
import json

response = requests.post(
    'http://localhost:3333/api/chat/stream',
    json={'message': 'Explain AI'},
    stream=True
)

for line in response.iter_lines():
    if line:
        parts = line.decode().split('data: ', 1)
        if len(parts) > 1:
            data = json.loads(parts[1])
            print(data.get('content', ''), end='')
```

---

### 3. List Conversations

**Endpoint:** `GET /chat/conversations`

Retrieve user's conversation history.

**Query Parameters:**
- `page` (optional, number) - Page number (default: 1)
- `pageSize` (optional, number) - Items per page (default: 20)

**Response:**
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "userId": "user-456",
      "title": "Quantum Computing Discussion",
      "messageCount": 12,
      "metadata": {
        "tags": ["science", "ai"],
        "isBookmarked": true
      },
      "createdAt": "2024-06-20T10:00:00Z",
      "updatedAt": "2024-06-23T14:00:00Z",
      "lastMessageAt": "2024-06-23T14:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20
}
```

**Examples:**
```bash
# Get first page
curl http://localhost:3333/api/chat/conversations

# Get page 2 with 50 items per page
curl "http://localhost:3333/api/chat/conversations?page=2&pageSize=50"
```

---

### 4. Get Conversation

**Endpoint:** `GET /chat/conversations/:id`

Get a specific conversation with all messages.

**Response:**
```json
{
  "id": "conv-123",
  "userId": "user-456",
  "title": "Quantum Computing",
  "messageCount": 3,
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "What is quantum computing?",
      "timestamp": "2024-06-23T10:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Quantum computing uses quantum bits...",
      "timestamp": "2024-06-23T10:01:00Z"
    },
    {
      "id": "msg-3",
      "role": "user",
      "content": "How is it different from classical?",
      "timestamp": "2024-06-23T10:02:00Z"
    }
  ],
  "createdAt": "2024-06-23T10:00:00Z",
  "updatedAt": "2024-06-23T10:02:00Z"
}
```

**Example:**
```bash
curl http://localhost:3333/api/chat/conversations/conv-123
```

---

### 5. Delete Conversation

**Endpoint:** `DELETE /chat/conversations/:id`

Delete a conversation.

**Response:** `204 No Content`

**Example:**
```bash
curl -X DELETE http://localhost:3333/api/chat/conversations/conv-123
```

---

### 6. List Tools

**Endpoint:** `GET /chat/tools`

Get available tools that Ask Diana can use.

**Response:**
```json
{
  "tools": [
    {
      "id": "web_search",
      "name": "web_search",
      "description": "Search the web for information",
      "category": "search",
      "parameters": [
        {
          "name": "query",
          "type": "string",
          "description": "Search query",
          "required": true
        }
      ],
      "enabled": true,
      "version": "1.0.0",
      "createdAt": "2024-06-01T00:00:00Z",
      "updatedAt": "2024-06-01T00:00:00Z"
    },
    {
      "id": "calculator",
      "name": "calculator",
      "description": "Perform mathematical calculations",
      "category": "math",
      "parameters": [
        {
          "name": "expression",
          "type": "string",
          "description": "Mathematical expression",
          "required": true
        }
      ],
      "enabled": true,
      "version": "1.0.0",
      "createdAt": "2024-06-01T00:00:00Z",
      "updatedAt": "2024-06-01T00:00:00Z"
    }
  ],
  "total": 2
}
```

**Example:**
```bash
curl http://localhost:3333/api/chat/tools
```

---

### 7. Register Tool (Admin)

**Endpoint:** `POST /chat/tools`

Register a new custom tool.

**Request:**
```json
{
  "name": "weather",
  "description": "Get current weather information",
  "category": "data",
  "parameters": [
    {
      "name": "location",
      "type": "string",
      "description": "City name",
      "required": true
    }
  ]
}
```

**Response:** `201 Created`

**Example:**
```bash
curl -X POST http://localhost:3333/api/chat/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "weather",
    "description": "Get weather",
    "category": "data",
    "parameters": []
  }'
```

---

### 8. List Models

**Endpoint:** `GET /chat/models`

Get available AI models.

**Response:**
```json
{
  "models": [
    {
      "id": "openai",
      "name": "GPT-4",
      "provider": "openai",
      "capabilities": {
        "streaming": true,
        "vision": true,
        "tools": true,
        "functionCalling": true,
        "maxTokens": 8000
      },
      "metadata": {
        "contextWindow": 8000,
        "costPer1kInputTokens": 0.03,
        "costPer1kOutputTokens": 0.06,
        "releaseDate": "2024-01-01"
      },
      "enabled": true,
      "version": "1.0.0"
    },
    {
      "id": "anthropic",
      "name": "Claude 3 Opus",
      "provider": "anthropic",
      "capabilities": {
        "streaming": true,
        "vision": true,
        "tools": true,
        "functionCalling": true,
        "maxTokens": 8000
      },
      "metadata": {
        "contextWindow": 8000,
        "costPer1kInputTokens": 0.015,
        "costPer1kOutputTokens": 0.075,
        "releaseDate": "2024-03-01"
      },
      "enabled": true,
      "version": "1.0.0"
    }
  ],
  "defaultModelId": "openai"
}
```

**Example:**
```bash
curl http://localhost:3333/api/chat/models
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Message is required",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 500 Server Error

```json
{
  "statusCode": 500,
  "message": "Provider error: API key invalid",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

Recommended rate limits (implement in production):

- Chat endpoint: 10 requests/minute per user
- Stream endpoint: 5 concurrent streams per user
- Tool calls: 100 per day per user

---

## Timeout Handling

- **Chat timeout:** 30 seconds
- **Stream timeout:** None (keep-alive every 30s)
- **Tool execution timeout:** 10 seconds per tool

---

## Conversation Context Window

- **Max messages:** 50 per conversation
- **Max tokens:** 8000 per conversation
- **Auto-pruning:** Removes oldest messages when limit exceeded

---

## Webhooks (Future)

Planned webhook events:
- `chat.message_created`
- `chat.conversation_created`
- `chat.tool_executed`
- `chat.error_occurred`

---

## SDKs

### JavaScript/TypeScript

```typescript
import { AskDianaClient } from '@aig/ask-diana-sdk';

const client = new AskDianaClient({
  baseUrl: 'http://localhost:3333',
  token: '<api-key>'
});

// Non-streaming
const response = await client.chat({
  message: 'Hello!'
});

// Streaming
const stream = client.streamChat({
  message: 'Explain AI'
});

for await (const event of stream) {
  if (event.type === 'token') {
    process.stdout.write(event.data.content);
  }
}
```

### Python

```python
from ask_diana import AskDianaClient

client = AskDianaClient(
    base_url='http://localhost:3333',
    token='<api-key>'
)

# Non-streaming
response = client.chat(message='Hello!')
print(response.message)

# Streaming
for event in client.stream_chat(message='Explain AI'):
    if event.type == 'token':
        print(event.data['content'], end='')
```

---

## Best Practices

1. **Use streaming** for better user experience on long responses
2. **Reuse conversation IDs** to maintain context
3. **Set appropriate temperature** (0.7 for balanced, 0.3 for factual, 0.9 for creative)
4. **Specify model** for consistent results
5. **Handle errors gracefully** with retry logic
6. **Clean up conversations** after user session ends
7. **Monitor token usage** for cost optimization
8. **Cache model metadata** to reduce API calls
