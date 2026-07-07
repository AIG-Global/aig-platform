# DIANA AI SYSTEM SPECIFICATION
## AIG Ecosystem AI Assistant Architecture

**Version:** 1.0  
**Status:** 🔨 IMPLEMENTATION READY  
**Purpose:** Define Diana - the multi-tenant, organization-aware AI assistant for AIGINVEST ecosystem  
**Components:**
- Diana Core (LLM-agnostic AI engine)
- Diana Ask (Conversational interface - Claude-powered)
- Diana Instances (Organization-specific AI copies)
- Diana Memory System (4-layer context retention)

---

## Part 1: Diana Overview

### 1.1 What is Diana?

**Diana** is the AI backbone of the AIG ecosystem - a conversational assistant that:

```
Core Capabilities:
├─ Answer business questions (data-driven, no guessing)
├─ Analyze market trends & investments
├─ Translate text (28 languages)
├─ Summarize documents & conversations
├─ Assist with WDM marketplace operations
├─ Support customer service & support
├─ Provide personalized financial advice
└─ Adapt to organization-specific context

Access Levels:
├─ Public: Limited access (basic questions)
├─ Starter+: Full "Ask Diana" conversational access
├─ Professional+: Advanced analysis & insights
├─ Business+: Company-specific Diana instances
└─ Enterprise: Unlimited Diana + custom training

Tech Stack:
├─ Primary: Anthropic Claude (Ask Diana widget)
├─ Fallback: OpenAI GPT-4 (compatibility)
├─ Local: Ollama support (offline/compliance)
└─ Framework: Langchain (provider-agnostic)
```

### 1.2 Diana Deployment Models

**STANDALONE (Ask Diana Web Page)**
```
├─ Endpoint: /diana/ask
├─ Authentication: Required (Starter+)
├─ Interface: Full-width chat interface
├─ Features:
│  ├─ Message history (persistent)
│  ├─ File upload support (PDF, text, CSV)
│  ├─ Code syntax highlighting
│  ├─ Export conversation (PDF, markdown)
│  └─ Real-time streaming responses
└─ Deployment: NestJS backend + React frontend
```

**EMBEDDED WIDGET (2-Line Integration)**
```
Code: <script src="https://aig.io/diana-widget.js"></script>
      <div id="diana-chat"></div>

Configuration:
├─ Size: Customizable (small, medium, large, fullscreen)
├─ Position: Bottom-right, bottom-left, custom
├─ Theme: Light/dark, custom branding
├─ API key: Client-side or server-side
└─ Context: Pass page-specific context to Diana

Use Cases:
├─ Customer support on company website
├─ In-app help assistant
├─ External website integration
└─ Custom application embedding
```

**ORGANIZATION-SPECIFIC DIANA (Company AI)**
```
├─ Endpoint: /orgs/{org_id}/diana
├─ Authentication: Employee only
├─ Features:
│  ├─ Access to company data (with permission)
│  ├─ Trained on company documents/knowledge base
│  ├─ Understands org-specific processes
│  ├─ Maintains company context
│  └─ Integrates with company systems
├─ Data Privacy: All data stays within org boundaries
├─ Deployment: NestJS + shared Claude/GPT backend
└─ Availability: Business+ tier and above
```

---

## Part 2: Diana Memory Architecture

### 2.1 Four-Layer Memory System

**LAYER 1: SESSION MEMORY (Immediate Context)**
```
Duration:   Current conversation only (expires when user logs out)
Storage:    Redis (fast, temporary)
Capacity:   Last 20 messages
Scope:      Individual user + single conversation
Retrieved:  Automatically for every response

Contains:
├─ User messages
├─ Diana responses
├─ Files uploaded in this session
├─ Clarifying questions asked
└─ Topics discussed so far

Use:        "Based on what we just discussed..."
```

**LAYER 2: PERSONAL MEMORY (Individual Profile)**
```
Duration:   Persistent (user's entire history)
Storage:    PostgreSQL (durable)
Capacity:   Unlimited (archived, searchable)
Scope:      Individual user across all conversations
Retrieved:  On-demand via search or automatic context injection

Contains:
├─ User preferences & style
├─ Previous questions & topics of interest
├─ Documents user has shared
├─ Saved responses (bookmarks)
├─ Past analyses & research
├─ Personal goals (if shared)
└─ Learning history (skills, expertise areas)

Use:        "Last time you asked about crypto, you wanted..."
Retention:  Until user deletes (compliance: GDPR right to erasure)
```

**LAYER 3: COMPANY MEMORY (Organization Context)**
```
Duration:   Persistent (org lifetime)
Storage:    PostgreSQL (durable)
Capacity:   Unlimited (with versioning)
Scope:      All employees in organization
Retrieved:  Automatically when accessing company Diana
Accessible: By permission level within org

Contains:
├─ Company documents (policies, procedures)
├─ Product/service information
├─ Internal knowledge base (wikis, FAQs)
├─ Meeting notes & decisions
├─ Process documentation
├─ Customer info (with access controls)
├─ Financial data (with access controls)
├─ Department-specific context
└─ Custom training data

Use:        "According to our company handbook..."
Retention:  Company-controlled (backup, archival policy)
Access:     Role-based (Manager, Employee, Admin levels)
```

**LAYER 4: PLATFORM MEMORY (AIG Ecosystem Context)**
```
Duration:   Persistent (AIG platform lifetime)
Storage:    PostgreSQL (durable)
Capacity:   Unlimited (indexed for performance)
Scope:      All AIG users (curated, anonymized)
Retrieved:  Automatically for relevant context
Accessible: Read-only, anonymized aggregates

Contains:
├─ AIG ecosystem rules & policies
├─ Membership tier benefits (public data)
├─ WDM marketplace categories & trends
├─ Investment product descriptions
├─ Commission structure rules
├─ Frequently asked questions
├─ Community best practices
├─ Market trends & data
├─ Regulatory info (GDPR, tax, etc.)
└─ Platform announcements

Use:        "According to AIG policy..."
Retention:  Permanent (business knowledge base)
Access:     All authenticated users (anonymized)
```

### 2.2 Memory Retrieval Flow

```
When user asks Diana a question:

1. SESSION CHECK
   ├─ Load last 20 messages from session
   ├─ Understand immediate context
   └─ Pass to LLM as system context

2. PERSONAL CONTEXT INJECTION
   ├─ Search personal memory for relevant topics
   ├─ Find similar past questions (semantic search)
   ├─ Inject relevant history: "You've asked about X before..."
   └─ Pass to LLM as context

3. COMPANY CONTEXT INJECTION (if employee)
   ├─ Check user's org role & permissions
   ├─ Search company memory (full-text + semantic)
   ├─ Filter results by user's access level
   ├─ Inject: "Company data shows..."
   └─ Pass to LLM as context

4. PLATFORM CONTEXT (always)
   ├─ Automatically included for AIG-specific questions
   ├─ Used for policy questions, benefits, rules
   └─ Pass to LLM as reference

5. LLM PROCESSING
   ├─ Process question with full context
   ├─ Generate response
   ├─ Stream response to user (real-time)
   └─ Save response to session memory

6. RESPONSE ARCHIVAL
   ├─ Save entire exchange to personal memory
   ├─ Tag with topics, categories, sentiment
   ├─ Index for future retrieval
   └─ Update user's Diana profile
```

---

## Part 3: Diana API Architecture

### 3.1 REST Endpoints

**Chat Operations:**
```
POST /diana/ask
├─ Body: { message: string, conversation_id?: string }
├─ Returns: { response: string, streaming: boolean, message_id: string }
├─ Authentication: Required (Starter+)
└─ Rate limit: Based on tier (Professional: unlimited)

GET /diana/conversations
├─ Returns: List of user's conversations (paginated)
├─ Query: { page, limit, filter?: "recent|starred|by_topic" }
├─ Authentication: Required
└─ Rate limit: 100/hour

GET /diana/conversations/{id}
├─ Returns: Full conversation history + metadata
├─ Authentication: Required (owner only)
└─ Rate limit: 100/hour

POST /diana/conversations/{id}/clear
├─ Action: Delete conversation from session memory
├─ Keep in: Personal memory (archived, searchable)
├─ Returns: { cleared: true }
├─ Authentication: Required (owner only)
└─ Rate limit: 50/hour

DELETE /diana/conversations/{id}
├─ Action: Permanently delete conversation (GDPR compliance)
├─ Effect: Removed from both session & personal memory
├─ Returns: { deleted: true }
├─ Authentication: Required (owner only)
└─ Rate limit: 50/hour
```

**Document Management:**
```
POST /diana/upload
├─ Purpose: Upload file for Diana to analyze
├─ Supported: PDF, DOCX, TXT, CSV, JSON, images
├─ Max size: 20MB
├─ Returns: { file_id: string, extracted_text: string }
├─ Authentication: Required
└─ Rate limit: 10 uploads/day (Starter), unlimited (Professional+)

POST /diana/analyze
├─ Body: { file_id: string, analysis_type: "summary|extraction|qa" }
├─ Returns: Analysis results
├─ Authentication: Required
└─ Rate limit: Based on tier
```

**Organization-Specific Diana:**
```
GET /orgs/{org_id}/diana/knowledge-base
├─ Returns: List of uploaded knowledge base documents
├─ Authentication: Required (org member)
├─ Permissions: Based on role
└─ Rate limit: 100/hour

POST /orgs/{org_id}/diana/train
├─ Purpose: Upload new training data for company Diana
├─ Body: { file_id: string, category?: string, is_public?: boolean }
├─ Returns: { training_complete: boolean, indexed: boolean }
├─ Authentication: Required (admin+ only)
└─ Rate limit: 5 uploads/day

POST /orgs/{org_id}/diana/ask
├─ Same as personal Diana, but with company context
├─ Returns: Enhanced response with company data
├─ Authentication: Required (org member)
└─ Company data automatically injected
```

---

## Part 4: Diana Technical Implementation

### 4.1 NestJS Module Structure

```
apps/api/src/diana/
├─ diana.module.ts              # NestJS module bootstrap
├─ diana.controller.ts          # REST endpoint handlers
├─ services/
│  ├─ diana.service.ts         # Core chat logic
│  ├─ diana-llm.service.ts     # LLM provider abstraction
│  ├─ diana-memory.service.ts  # Memory layer management
│  ├─ diana-embedding.service.ts # Vector embeddings for search
│  ├─ diana-document.service.ts # File upload & parsing
│  └─ diana-org.service.ts     # Organization-specific logic
├─ models/
│  ├─ diana-message.model.ts
│  ├─ diana-conversation.model.ts
│  ├─ diana-memory.model.ts
│  └─ diana-document.model.ts
├─ interfaces/
│  ├─ diana-request.interface.ts
│  ├─ diana-response.interface.ts
│  └─ diana-config.interface.ts
└─ providers/
   ├─ claude.provider.ts        # Anthropic Claude integration
   ├─ openai.provider.ts        # OpenAI GPT fallback
   └─ ollama.provider.ts        # Local Ollama support
```

### 4.2 LLM Provider Abstraction

```typescript
// Pseudo-code for provider-agnostic architecture

abstract class LLMProvider {
  abstract chat(message: string, context: Context): Promise<string>;
  abstract stream(message: string, context: Context): AsyncIterable<string>;
  abstract embedText(text: string): Promise<number[]>;
  abstract modelInfo(): ModelInfo;
}

class ClaudeProvider extends LLMProvider {
  // Use Anthropic SDK
  // Supports: text, images, documents
  // Streaming: Yes (via ClaudeStreaming API)
}

class OpenAIProvider extends LLMProvider {
  // Use OpenAI SDK
  // Supports: text, images, URLs
  // Streaming: Yes (via Chat Completions Streaming)
}

class OllamaProvider extends LLMProvider {
  // Use local HTTP API
  // Supports: text only (models vary)
  // Streaming: Yes (via streaming endpoints)
}

// Runtime selection
const provider = getProviderForTier(userTier, primaryProvider);
const response = await provider.chat(message, context);
```

### 4.3 Memory Database Schema

```sql
-- Conversations
CREATE TABLE diana_conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  org_id UUID REFERENCES organizations(id),
  title VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  INDEX (user_id, org_id)
);

-- Messages (Session Layer)
CREATE TABLE diana_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES diana_conversations(id),
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP,
  metadata JSONB,
  INDEX (conversation_id, created_at)
);

-- Personal Memory
CREATE TABLE diana_personal_memory (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  conversation_id UUID,
  key_topics TEXT[],
  summary TEXT,
  embedding VECTOR(1536),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FULLTEXT INDEX (summary),
  INDEX (user_id, embedding)
);

-- Company Knowledge Base
CREATE TABLE diana_company_knowledge (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id),
  document_name VARCHAR(255),
  document_content TEXT,
  embedding VECTOR(1536),
  category VARCHAR(100),
  access_level ENUM('public', 'internal', 'restricted'),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  FULLTEXT INDEX (document_content),
  INDEX (org_id, category, embedding)
);

-- Platform Memory (AIG policies, FAQs, etc.)
CREATE TABLE diana_platform_knowledge (
  id UUID PRIMARY KEY,
  topic VARCHAR(255),
  content TEXT,
  embedding VECTOR(1536),
  category VARCHAR(100),
  priority INTEGER,
  created_at TIMESTAMP,
  FULLTEXT INDEX (content),
  INDEX (category, priority)
);

-- Document Uploads
CREATE TABLE diana_documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  org_id UUID REFERENCES organizations(id),
  filename VARCHAR(255),
  file_path VARCHAR(512),
  content_type VARCHAR(50),
  extracted_text TEXT,
  embedding VECTOR(1536),
  uploaded_at TIMESTAMP,
  INDEX (user_id, org_id)
);
```

---

## Part 5: Diana Integration Points

### 5.1 Where Diana Appears in Ecosystem

**As Standalone App:**
```
├─ /diana/ask (full-page interface)
├─ /diana/documents (document library & analysis)
├─ /diana/conversations (history & management)
└─ /diana/help (contextual help system)
```

**As Embedded Widget:**
```
├─ WDM Marketplace (help with finding products)
├─ Membership page (answer membership questions)
├─ Investor portal (investment guidance)
├─ Academy page (learning assistant)
└─ Any external website (via embed code)
```

**As Company Assistant:**
```
├─ Org dashboard (company context Diana)
├─ Department pages (dept-specific Diana)
├─ Employee portal (company knowledge access)
└─ HR/Admin tools (policy lookup)
```

**As System Support:**
```
├─ Admin dashboard (help & documentation)
├─ Onboarding flow (guide new users)
├─ Error pages (contextual help)
└─ Mobile app (offline fallback)
```

### 5.2 Integration with Other Systems

**Commission Engine:**
```
Diana helps members understand:
├─ How commissions are calculated
├─ What they've earned vs tier cap
├─ Best strategies to maximize earnings
├─ Tier upgrade benefits
└─ Commission payout schedule
```

**Investment Portal:**
```
Diana provides:
├─ Investment product explanations
├─ Risk analysis & comparisons
├─ Historical performance data
├─ Tax implications guidance
├─ Portfolio analysis (if user shares)
└─ Market trend insights
```

**WDM Marketplace:**
```
Diana assists with:
├─ Finding products (smart search)
├─ Product comparisons
├─ Seller verification & reviews
├─ Affiliation opportunities
├─ Pricing analysis (market comparisons)
└─ Purchase recommendations
```

**Academy/Learning:**
```
Diana acts as:
├─ Course guide (recommending courses)
├─ Tutor (explaining concepts)
├─ Assignment helper (review, feedback)
├─ Progress mentor (next steps)
└─ Certification prep (practice questions)
```

---

## Part 6: Diana Deployment

### 6.1 Docker Configuration

```dockerfile
# Diana API Service
FROM node:18-alpine AS diana-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:18-alpine
WORKDIR /app
COPY --from=diana-builder /app/node_modules ./node_modules
COPY dist/diana ./dist

ENV NODE_ENV=production
ENV DIANA_LLM_PROVIDER=claude
ENV DIANA_CLAUDE_KEY=${CLAUDE_API_KEY}

EXPOSE 3333
CMD ["node", "dist/main.js"]
```

### 6.2 Environment Configuration

```bash
# .env.example

# LLM Provider Selection
DIANA_LLM_PROVIDER=claude              # claude | openai | ollama
DIANA_CLAUDE_KEY=sk-ant-...            # Anthropic API key
DIANA_OPENAI_KEY=sk-...                # OpenAI API key (fallback)
DIANA_OLLAMA_URL=http://localhost:11434 # Local Ollama instance

# Memory Configuration
DIANA_SESSION_TTL=3600                 # Session expires after 1 hour
DIANA_PERSONAL_MEMORY_ENABLED=true
DIANA_COMPANY_MEMORY_ENABLED=true
DIANA_PLATFORM_MEMORY_ENABLED=true

# Embedding Model
DIANA_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
DIANA_VECTOR_DB=pgvector             # PostgreSQL vector extension

# Rate Limiting
DIANA_RATE_LIMIT_STARTER=5_requests_per_day
DIANA_RATE_LIMIT_PROFESSIONAL=unlimited
DIANA_RATE_LIMIT_BUSINESS=unlimited
DIANA_RATE_LIMIT_ENTERPRISE=unlimited

# Streaming
DIANA_STREAM_CHUNK_SIZE=512            # Bytes per SSE chunk
DIANA_STREAM_TIMEOUT=120               # Max response duration (seconds)

# Security
DIANA_CONTENT_FILTER_ENABLED=true
DIANA_TOXICITY_THRESHOLD=0.7           # 0-1 (lower = stricter)
DIANA_MAX_CONTEXT_LENGTH=8000          # Tokens to include as context
```

---

## Part 7: Diana Launch Timeline

### Phase 1 (Week 1-2): Foundation
```
├─ LLM provider abstraction (Claude primary)
├─ Session memory (Redis)
├─ Basic chat endpoint
├─ Rate limiting by tier
└─ Streaming responses
```

### Phase 2 (Week 3-4): Memory & Intelligence
```
├─ Personal memory implementation
├─ Semantic search (embeddings)
├─ Document upload & parsing
├─ Company knowledge base
└─ Multi-provider support
```

### Phase 3 (Week 5-6): Integration & Polish
```
├─ Organization-specific Diana instances
├─ Embedded widget (2-line code)
├─ Integration with other modules
├─ UI/UX refinement
└─ Testing & optimization
```

### Phase 4 (Week 7-8): Launch & Scale
```
├─ Public launch
├─ Marketing & documentation
├─ Support & feedback loops
├─ Performance monitoring
└─ Continuous improvement
```

---

**Status:** 🔨 READY FOR IMPLEMENTATION  
**Next Action:** Create Prisma schema + implement Diana service in Phase 1
