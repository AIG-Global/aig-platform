# Diana MVP Specification

**Date:** 2026-07-06  
**Phase:** Phase 1 (Weeks 1-12)  
**Status:** Locked for development  

---

## User Story: "Ask Diana to Create a Project Plan"

This is the canonical MVP user flow. Every feature is tested against this story.

---

## Flow Overview

```
┌─────────────────┐
│  1. User Signs  │
│     In          │
└────────┬────────┘
         │
    ┌────▼────────┐
    │  2. Diana   │
    │  Greets     │
    │  User       │
    └────┬────────┘
         │
    ┌────▼──────────────┐
    │  3. User Starts   │
    │  Conversation     │
    └────┬──────────────┘
         │
    ┌────▼────────────────┐
    │  4. Diana Streams   │
    │  Response           │
    └────┬────────────────┘
         │
    ┌────▼──────────────────┐
    │  5. Conversation is  │
    │  Saved               │
    └────┬──────────────────┘
         │
    ┌────▼────────────────────┐
    │  6. Diana Remembers    │
    │  Context               │
    └────┬────────────────────┘
         │
    ┌────▼──────────────────┐
    │  7. Diana Generates   │
    │  Document             │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────────────┐
    │  8. Diana Invokes Platform    │
    │  Tool (Calendar Integration)   │
    └───────────────────────────────┘
```

---

## Step 1: User Signs In

### User Actions

1. User opens Diana dashboard
2. Sees login screen (email + password)
3. Enters email: `user@example.com`
4. Enters password: `••••••••`
5. Clicks "Sign In" button

### System Processing

```
POST /auth/login
{
  "email": "user@example.com",
  "password": "••••••••"
}

Response (200 OK):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "Sarah Chen",
    "avatar": "/avatars/sarah.jpg",
    "createdAt": "2026-01-15T10:30:00Z"
  },
  "expiresIn": 3600
}
```

### Success Criteria

✅ JWT token issued and stored in secure storage  
✅ Token persists across page reloads  
✅ User profile loaded  
✅ Redirect to dashboard  
✅ <200ms response time  

### Error Handling

**Case: Wrong password**
```
Response (401 Unauthorized):
{
  "error": "invalid_credentials",
  "message": "Email or password is incorrect. Try again.",
  "retries": 2
}
```

**Case: User not found**
```
Response (404 Not Found):
{
  "error": "user_not_found",
  "message": "We don't have an account for that email. Sign up instead?"
}
```

### UI States

| State | What User Sees | Time |
|-------|----------------|------|
| Loading | Spinner, disabled button | While request in flight |
| Success | Redirected to dashboard | <1 second |
| Error | Red error message + retry button | Until user retries |

---

## Step 2: Diana Greets User

### What Happens

User lands on dashboard and sees Diana greeting.

### First-Time User (New Account)

```
Diana says:
"Hi Sarah! Welcome to Diana. I'm your AI partner, and I'm here to help you 
with your work. I can answer questions, create documents, manage your 
calendar, and remember what matters to you."

Diana shows:
• Greeting animation (Diana smiling, warm)
• Quick start guide (3 steps)
• "Get Started" button
```

### Returning User (Has Conversation History)

```
Diana says:
"Hi Sarah! Welcome back. I've been thinking about the project briefing 
you shared yesterday. How's that coming along?"

Diana shows:
• Context card: "Last conversation: Project Briefing (Jul 5, 3:15 PM)"
• Quick actions: "Continue" or "Start New"
• Recent documents
```

### System Processing

```
GET /auth/me (verify token)
Response (200 OK):
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "Sarah Chen",
  "lastLogin": "2026-07-05T15:30:00Z",
  "conversationCount": 12,
  "isFirstLogin": false
}

GET /memory/recent (fetch recent context)
Response (200 OK):
{
  "recentConversations": [
    {
      "id": "conv-456",
      "title": "Project Briefing",
      "summary": "Q3 roadmap discussion",
      "timestamp": "2026-07-05T15:30:00Z"
    }
  ],
  "recentDocuments": [...]
}
```

### Success Criteria

✅ Greeting displays within 500ms  
✅ Context is personalized (first-time vs. returning)  
✅ No errors in fetching user/memory data  
✅ Greeting matches Diana's personality  

---

## Step 3: User Starts Conversation

### User Action

User sees Diana's greeting and types message:

```
"Create a 30-day project plan for launching our new feature to 
production. Use what you know about our team, timeline, and 
dependencies."
```

Then clicks "Send" button or presses Cmd+Enter.

### System Processing

```
POST /conversations/:id/messages
{
  "content": "Create a 30-day project plan...",
  "conversationId": "conv-new",
  "timestamp": "2026-07-06T09:30:00Z"
}

Response (202 Accepted):
{
  "id": "msg-789",
  "conversationId": "conv-new",
  "status": "pending",
  "createdAt": "2026-07-06T09:30:00Z"
}
```

### Message Processing Pipeline

```
1. Message received
   ├── Validate: Not empty, <5000 chars
   ├── Sanitize: Remove malicious scripts
   └── Store: Save to PostgreSQL (status: pending)

2. Fetch context
   ├── Load user profile
   ├── Load recent conversations (vector search)
   ├── Load relevant documents
   └── Build prompt context

3. Queue for AI processing
   ├── Determine which AI model to use
   ├── Build final prompt with context
   └── Send to model (OpenAI, Claude, etc.)

4. Streaming setup
   ├── Open Server-Sent Event stream to client
   ├── Begin streaming tokens as they arrive
   └── Update UI in real-time
```

### Success Criteria

✅ Message validated  
✅ Stored in database  
✅ Response begins streaming within 2 seconds  
✅ No message loss  
✅ User sees "Diana is typing..." indicator  

---

## Step 4: Diana Streams Response

### What Happens

Diana's response streams in real-time. User sees text appearing word-by-word.

### Response Example

```
Diana's streaming response:

"I'll create a comprehensive 30-day plan for you. Based on your team 
structure and the timeline you mentioned, here's what I'd recommend:

**Phase 1: Preparation (Days 1-5)**
• Feature finalization and code review...
• [continues streaming]
```

### Technical Implementation

**Server-Sent Events (SSE) Stream:**

```
Response Headers:
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

Response Body (streaming):
data: {"type":"token","content":"I'll"}
data: {"type":"token","content":"create"}
data: {"type":"token","content":"a"}
data: {"type":"token","content":"comprehensive"}
...
data: {"type":"complete","messageId":"msg-789"}
```

### UI Rendering

| Phase | What User Sees | Animation |
|-------|----------------|-----------|
| Start | Diana thinking (animated shimmer) | Pulsing lights |
| Streaming | Text appearing word-by-word | Smooth fade-in per word |
| Complete | Full response visible | Stop animation |

### Performance Requirements

✅ First token within 2 seconds  
✅ Subsequent tokens: <100ms between each  
✅ Smooth animation (60fps)  
✅ No jank or stuttering  
✅ Responsive to user input (can type while streaming)  

### Handling Errors During Streaming

**If stream disconnects:**
```
Diana says: "I lost connection. Let me continue where we left off..."

System:
1. Detect stream closure
2. Fetch partial response from database
3. Resume streaming from last token
4. Update conversation history
```

**If model times out:**
```
Diana says: "I'm taking longer than usual. Here's what I have so far..."

System:
1. Detect timeout (after 30 seconds)
2. Return partial response with apology
3. Offer to continue or try different approach
4. Log incident for monitoring
```

### Success Criteria

✅ Streaming begins within 2 seconds  
✅ Text renders smoothly  
✅ No lag or delays  
✅ Errors handled gracefully  
✅ User can read full response  

---

## Step 5: Conversation is Saved

### What Happens

As Diana streams, conversation is automatically saved:

1. **User message** saved immediately
2. **Diana's response** saved as it streams
3. **Embedding generated** for semantic search
4. **Metadata created** (timestamp, tokens used, cost)

### Database Storage

**PostgreSQL - Conversations Table:**
```sql
INSERT INTO conversations (
  id, userId, title, createdAt, updatedAt
) VALUES (
  'conv-new', 'user-123', 'Project Plan - 30 Days', 
  '2026-07-06T09:30:00Z', '2026-07-06T09:30:00Z'
);
```

**PostgreSQL - Messages Table:**
```sql
INSERT INTO messages (
  id, conversationId, role, content, tokens, cost, createdAt
) VALUES (
  'msg-789', 'conv-new', 'assistant', '...full response...', 
  1245, 0.0187, '2026-07-06T09:31:00Z'
);
```

**Vector DB - Embeddings:**
```
embedding = embed(
  "Create a 30-day project plan... [response]"
)

INSERT INTO message_embeddings (
  id, messageId, embedding, createdAt
) VALUES (
  'embed-789', 'msg-789', [0.123, 0.456, ...], 
  '2026-07-06T09:31:00Z'
);
```

**Redis - Cache:**
```
SET conversation:conv-new:summary "Project Plan - 30 Days"
SET user:user-123:last-conversation conv-new
EXPIRE ... 86400 (1 day)
```

### Automatic Processing

```
Parallel Operations:
├── Save to PostgreSQL (block until complete)
├── Generate embedding (async)
├── Update Redis cache (async)
├── Update conversation index (async)
├── Calculate cost (async)
└── Log metrics (async)
```

### What Gets Saved

| Data | Storage | Purpose |
|------|---------|---------|
| Message text | PostgreSQL | History + display |
| Embedding | Vector DB | Semantic search |
| Tokens used | PostgreSQL | Cost tracking |
| Timestamp | PostgreSQL | Timeline |
| User ID | PostgreSQL | Multi-tenancy |
| Model used | PostgreSQL | Analytics |

### Success Criteria

✅ Message saved before streaming completes  
✅ Embedding generated within 5 seconds  
✅ No data loss on network failure  
✅ Cost accurately calculated  
✅ Retrievable in <100ms  

---

## Step 6: Diana Remembers Context

### What Happens

In subsequent messages, Diana references previous context:

**User:**
```
"How's the feature launch looking now?"
```

**Diana:**
```
"Good question! Last we spoke, we mapped out the 30-day plan with these 
phases:

Phase 1 (Days 1-5): Preparation
Phase 2 (Days 6-20): Development 
Phase 3 (Days 21-28): Testing & refinement
Phase 4 (Days 29-30): Launch preparation

You mentioned your team has 5 engineers and a 2-week testing window...
"
```

### How It Works

**Context Retrieval Pipeline:**

```
1. User sends new message
   └── Extract semantic meaning

2. Search for relevant context
   ├── Vector similarity search in embeddings
   │  └── Find related conversations/documents
   ├── Keyword search in message history
   │  └── Find exact mentions
   └── Time-based search
      └── Recent conversations (within 7 days)

3. Rank and merge results
   ├── Score by relevance
   ├── Deduplicate
   └── Select top 3-5 most relevant

4. Build augmented prompt
   ├── System prompt (Diana's personality)
   ├── User message (new question)
   ├── Context (retrieved relevant history)
   └── Instructions (how to use context)

5. Send to AI model
   └── Model generates response with context awareness
```

### Context Window Size

| Context Type | Max Tokens | Recency |
|--------------|-----------|----------|
| Recent messages | 2000 | Last 7 days |
| Relevant documents | 1500 | Any |
| User profile | 500 | Current |
| **Total** | **4000** | **Variable** |

### Success Criteria

✅ Relevant context retrieved (>80% accuracy)  
✅ Context search <500ms  
✅ No hallucination of false context  
✅ Diana clearly references source ("As we discussed...")  
✅ Context doesn't overwhelm response  

---

## Step 7: Diana Generates Document

### What Happens

At the end of the project plan response, Diana asks:

```
"Should I save this as a document? I can make it ready to share 
with your team."
```

User clicks "Yes" → Document is created and saved.

### User Workflow

```
1. Diana finishes streaming response

2. Diana shows action buttons:
   ├── "Save as Document" (primary button)
   ├── "Copy to Clipboard"
   ├── "Share" (grayed out for now)
   └── "Try Again" (if not satisfied)

3. User clicks "Save as Document"

4. Diana shows:
   ├── Document title input (pre-filled: "Project Plan - 30 Days")
   ├── Format selection (Markdown / PDF)
   ├── Save button

5. User clicks "Save"

6. Document saved and notification shows:
   "✅ Document saved. You can view it anytime in your Documents app."
```

### Document Creation

**System Process:**

```
POST /documents/generate
{
  "conversationId": "conv-new",
  "messageId": "msg-789",
  "title": "Project Plan - 30 Days",
  "format": "markdown"
}

Response (201 Created):
{
  "id": "doc-456",
  "title": "Project Plan - 30 Days",
  "content": "# Project Plan - 30 Days\n\n...",
  "format": "markdown",
  "url": "/documents/doc-456",
  "shareUrl": "https://diana.share/doc/abc123",
  "createdAt": "2026-07-06T09:35:00Z"
}
```

**Database Storage:**

```sql
INSERT INTO documents (
  id, userId, conversationId, title, content, 
  format, createdAt, updatedAt
) VALUES (
  'doc-456', 'user-123', 'conv-new', 'Project Plan - 30 Days',
  '...markdown content...', 'markdown',
  '2026-07-06T09:35:00Z', '2026-07-06T09:35:00Z'
);
```

### Document Formats

| Format | Use Case | Export Options |
|--------|----------|-----------------|
| Markdown | Default, version control friendly | Plain text, PDF, HTML |
| PDF | Print-ready, professional sharing | Download, email |
| HTML | Web display | Publish to web |
| DOCX | Word integration (future) | Download, send to Word |

### Success Criteria

✅ Document created within 2 seconds  
✅ Title auto-generated but editable  
✅ Format selection works  
✅ Document retrievable in Documents app  
✅ Export options functional  
✅ <100KB file size  

---

## Step 8: Diana Invokes Platform Tool (Calendar Integration)

### What Happens

Diana follows up:

```
Diana says: "I can also add calendar blocks for your key milestones. 
Should I create a series of events for the 4 phases?"

User: "Yes, please!"

Diana:
"Adding to your calendar now...

✅ Phase 1 Prep (Jul 9-13)
✅ Phase 2 Dev (Jul 14-28)
✅ Phase 3 Test (Jul 29-Aug 4)
✅ Phase 4 Launch (Aug 5-6)

All set! You can view them in your calendar."
```

### Integration Flow

**Step 1: Diana decides to use Calendar**

```
Post-response analysis:
├── Diana recognizes: "user wants to track milestones"
├── Check available integrations
│  ├── Calendar available: YES
│  ├── Calendar connected: YES
│  └── Calendar permissions: YES
└── Decision: Use Calendar integration
```

**Step 2: Diana constructs Calendar events**

```
Diana formats 4 calendar events:

{
  "title": "Phase 1: Preparation",
  "startDate": "2026-07-09",
  "endDate": "2026-07-13",
  "description": "Feature finalization, code review, team prep",
  "color": "#0066FF"
}

{
  "title": "Phase 2: Development",
  "startDate": "2026-07-14",
  "endDate": "2026-07-28",
  "description": "Feature development, integration testing",
  "color": "#0066FF"
}

... (2 more events)
```

**Step 3: Invoke Calendar API**

```
POST /integrations/calendar/events
{
  "userId": "user-123",
  "events": [
    { "title": "Phase 1: Preparation", ... },
    { "title": "Phase 2: Development", ... },
    { "title": "Phase 3: Testing", ... },
    { "title": "Phase 4: Launch", ... }
  ]
}

Response (201 Created):
{
  "created": 4,
  "calendarUrl": "https://calendar.google.com/calendar/..."
}
```

**Step 4: Confirmation to user**

```
Diana shows:
✅ Events created
✅ "View in Calendar" button
├── Links to Google Calendar (or user's calendar provider)
└── Shows events synced
```

### Integration Permissions

**What Diana Checks:**

```
Before invoking ANY integration:

1. User has permission
   └── "Do I have permission to access your calendar?"

2. Integration is connected
   └── "Is your calendar connected?"

3. Integration is enabled
   └── "Do you want me to use your calendar?"

4. Rate limiting
   └── "Can I make 4 API calls right now?"
```

### Supported Integrations (MVP)

| Integration | Status | Capability |
|-------------|--------|-----------|
| Calendar | 🚧 Phase 1 | Create events |
| Email | 📋 Phase 2 | Send messages |
| Documents | 📋 Phase 2 | Create files |
| Spreadsheets | 📋 Phase 2 | Write data |

### Success Criteria

✅ Integration invoked only with permission  
✅ Events created correctly  
✅ Sync with user's calendar within 5 seconds  
✅ Confirmation shown to user  
✅ No data loss  
✅ Errors handled gracefully  

---

## Complete MVP Checklist

### Technical Requirements

- [ ] POST /auth/login returns JWT token
- [ ] GET /auth/me validates token and returns user
- [ ] Dashboard loads user context within 500ms
- [ ] POST /conversations creates new conversation
- [ ] POST /conversations/:id/messages accepts message
- [ ] Server-Sent Event stream returns tokens in <100ms increments
- [ ] Message saved to PostgreSQL with embedding
- [ ] Vector search retrieves relevant context
- [ ] Response includes contextual references
- [ ] POST /documents/generate creates document
- [ ] GET /documents retrieves saved documents
- [ ] Integrations API accepts calendar events
- [ ] All responses <200ms (p95)

### UX Requirements

- [ ] Login page is clear and friendly
- [ ] Diana greeting matches personality
- [ ] Chat interface is intuitive
- [ ] Streaming response is smooth
- [ ] Error messages are helpful
- [ ] Document save flow is clear
- [ ] Integration confirmation is explicit
- [ ] Mobile responsive (TBD for Alpha)

### Quality Requirements

- [ ] 80%+ test coverage
- [ ] Zero critical bugs
- [ ] All error cases handled
- [ ] Performance meets targets
- [ ] Security audit passed
- [ ] Documentation complete

### Demo Requirements

- [ ] Flows works end-to-end
- [ ] Repeatable in <10 minutes
- [ ] No manual setup between runs
- [ ] Network failures don't break demo
- [ ] Demo data is realistic

---

## Acceptance Criteria: MVP Complete

✅ All 8 steps above are implemented and working  
✅ User can complete flow without manual intervention  
✅ System handles errors gracefully  
✅ Performance meets targets  
✅ Demo can run 10 times in a row without failure  
✅ Code is clean, tested, and documented  
✅ Diana's personality is consistent throughout  

---

**This is the specification that engineers build from.**

*Diana MVP Specification*  
*Version 1.0 | 2026-07-06*  
*Status: Locked for development*
