# AIGINVEST Complete Ecosystem Reference
## Unified Architecture Overview with Financial Model & Roadmap

**Date:** 2026-07-07  
**Status:** 🔒 LOCKED FOR PHASE 1  
**Location:** Master reference for all ecosystem, platform, and financial architecture

---

## PART 1: Ecosystem Overview

### What is AIGINVEST?

AIGINVEST is a **platform company** delivering three integrated products:

1. **AIGINVEST Platform** (Web) — The primary interface
2. **AIOS** (Operating System) — The foundation for future devices
3. **North Star ONE** (Device) — The flagship phone powered by AIOS

All three are coordinated by **Diana**, an AI assistant integrated everywhere.

---

## PART 2: Core Components (Four Elements)

### 🤖 **Diana: The AI Assistant**

The central intelligence of AIGINVEST. Present on:
- ✓ Web (chatbot interface)
- ✓ AIOS (native app on device)
- ✓ North Star ONE (hardware integration)
- ✓ Every surface inside ecosystem

**Diana does:**
- Conversational reasoning
- Tool execution (create projects, documents, tasks)
- Persistent memory (remembers user preferences, context)
- Provider switching (OpenAI / Anthropic / Ollama)
- Intent detection (understands what user wants to do)

**Diana's personality:**
- Direct and precise
- Genuinely helpful
- Action-oriented
- Honest about limitations

---

### 🌐 **AIGINVEST Platform (Web)**

The primary web application (Next.js 14 + React 18)

**Core Modules:**
- Identity — User registration, authentication, SSO
- Ask Diana — AI interface, streaming responses, memory
- Projects — Project creation from conversation
- Documents — Generated documents with versioning
- Tasks — Task management and tracking
- Workspace — Team collaboration features
- Marketplace — Skills, templates, third-party integrations (future)
- Payments — Billing and subscription management (future)

**URL Structure:**
```
/login          — Email authentication
/chat           — Main Diana interface
/projects       — Project management
/documents      — Document library
/workspace      — Team collaboration
/marketplace    — Skills and integrations
```

---

### 🖥️ **AIOS: Operating System Layer**

A software layer that prepares AIGINVEST for hardware (future North Star ONE device)

**AIOS Capabilities:**
- Native device integration
- Offline AI capabilities
- Beam Me Up synchronization (sync web ↔ device)
- Hardware optimization
- Privacy-first design
- Sailfish OS foundation (future)

**Current Status:** Foundation laid, Ollama support (local LLM running offline)

**Future:** Custom AI accelerator chip for on-device inference

---

### 📱 **North Star ONE: Flagship Device**

The first AIGINVEST hardware product (future)

**Specifications:**
- Sailfish OS foundation
- Diana built-in and always available
- Privacy-first design
- AIOS operating system
- Custom AI accelerator (future)
- Synchronization with web via Beam Me Up

**Status:** Prototype phase, 2028 target launch

---

## PART 3: Platform Architecture

### System Layers

```
┌─────────────────────────────────────────────────────┐
│            CLIENT LAYER                             │
│  Browser (Next.js 14)     North Star ONE (Future)   │
│  ├── Diana UI             ├── AIOS Native App       │
│  ├── Projects             └── Beam Me Up Sync       │
│  └── Documents                                      │
└────────────────┬──────────────────────────────────┘
                 │ HTTPS / SSE
┌────────────────▼──────────────────────────────────┐
│            API LAYER (NestJS 10)                    │
│  Port 3333                                         │
│  ├── AuthController       — Login/Register         │
│  ├── ChatController       — /stream (SSE)          │
│  ├── ProjectController    — CRUD operations        │
│  ├── DocumentController   — Generation/Versioning  │
│  ├── TaskController       — Task management        │
│  └── HealthController     — Monitoring             │
│                                                    │
│  AI LAYER                                          │
│  ├── LLMService           — Provider router        │
│  │   (OpenAI/Anthropic/Ollama/Mock)               │
│  ├── ContextEngine        — Build prompts          │
│  ├── MemoryEngine         — Persistence            │
│  ├── ToolRunner           — Intent detection       │
│  └── StreamingLayer       — SSE events             │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│            DATA LAYER                              │
│                                                    │
│  PostgreSQL 16 (Port 5432)                         │
│  ├── users                — Identity               │
│  ├── conversations        — Chat threads           │
│  ├── messages             — Chat history           │
│  ├── projects             — User projects          │
│  ├── project_tasks        — Tasks per project      │
│  ├── documents            — Generated docs         │
│  ├── diana_memories       — Long-term memory       │
│  ├── accounts             — Dual-wallet model      │
│  ├── commissions          — MLM commissions        │
│  └── tiers                — Membership tiers       │
│                                                    │
│  Redis 7 (Port 6379)                               │
│  ├── Sessions             — User sessions          │
│  ├── Rate limiting        — API throttling         │
│  └── Real-time events     — WebSocket broker       │
└─────────────────────────────────────────────────────┘
```

---

## PART 4: Ask Diana Architecture (Core Intelligence)

### Data Flow

```
User Message
     ↓
┌─────────────────────────────────────┐
│     CONTEXT ENGINE                   │
│  • Last 20 messages                 │
│  • User memories                    │
│  • Diana system prompt              │
│  • User preferences                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     MEMORY ENGINE                    │
│  • Extract facts from message       │
│  • Save to DianaMemory (async)      │
│  • Categories:                      │
│    - user_preference                │
│    - technical_constraint           │
│    - project_context                │
│    - working_style                  │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     TOOL RUNNER                      │
│  • Intent detection                 │
│  • create_project → ProjectService  │
│  • create_document → DocumentService│
│  • create_task → TaskService        │
│  • search_memory → MemoryService    │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     PROVIDER ROUTER                  │
│  • Selects best AI model            │
│  • OpenAI (general chat)            │
│  • Anthropic (long reasoning)       │
│  • Ollama (local/private)           │
│  • Mock (dev/testing)               │
│  • Auto-fallback on error           │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     LLM (Generate Response)          │
│  • Streams word-by-word              │
│  • Tools can be called mid-stream    │
│  • Cancellable via AbortController   │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     TOOL EXECUTOR                    │
│  • Actually runs the tools           │
│  • ProjectService.create()           │
│  • DocumentService.create()          │
│  • Updates database                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     SSE STREAMING LAYER              │
│  Events:                            │
│  • chunk {content: string}          │
│  • action {action, result}          │
│  • title {title: string}            │
│  • done {response: string}          │
└─────────────────┬───────────────────┘
                  ↓
         User sees Diana typing
```

### Diana's Tools (Current)

| Tool | Trigger | Action | Status |
|------|---------|--------|--------|
| `create_project` | "create a project called X" | ProjectService.create() | ✅ v0.2 |
| `create_document` | "write a document called X" | DocumentService.create() | ✅ v0.2 |
| `create_task` | "add a task to X project" | TaskService.create() | 🔵 v0.3 |
| `search_memory` | "do you remember..." | MemoryService.search() | 🔵 v0.3 |
| `schedule_event` | "schedule a meeting" | CalendarService.create() | ⏳ v0.4 |
| `search_knowledge` | "search for X" | SearchService.search() | ⏳ v0.4 |

---

## PART 5: Database Schema (Dual-Account Model)

### Core Tables

#### Users & Identity
```sql
users
├── id (UUID)
├── email (unique)
├── name
├── preferences (JSON)
├── created_at
└── tier_id (links to membership tier)

tiers
├── id (tier_starter, tier_professional, etc.)
├── name (Starter, Professional, Business, Platinum)
├── price (EUR)
├── commission_depth (6, 7, 9, 10)
├── benefits (JSON array)
└── updated_at
```

#### Dual-Account Wallet (NEW)
```sql
accounts
├── id (UUID)
├── user_id
├── account_type ENUM('cash_account', 'aig_cash_account')
├── currency VARCHAR (EUR or AIG$)
├── balance DECIMAL(18, 8)
├── exchange_rate DECIMAL(10, 6)
│   (1.0 for cash_account, market rate for aig_cash_account)
├── daily_withdrawal_limit
└── created_at

Key Rule: Every user has EXACTLY 2 rows in this table
- Row 1: cash_account (EUR, 1:1 fixed)
- Row 2: aig_cash_account (AIG$, market-driven)

account_conversions
├── id (UUID)
├── user_id
├── from_account_id
├── to_account_id
├── from_amount DECIMAL
├── to_amount DECIMAL
├── exchange_rate DECIMAL
├── conversion_type ENUM
│   ('cash_to_aigcash_manual', 'aigcash_to_cash_marketplace')
├── status ENUM('pending', 'completed', 'failed')
└── created_at
```

#### MLM Commissions (with 80/20 Split)
```sql
commissions
├── id (UUID)
├── source_user_id (who made the purchase)
├── recipient_user_id (who gets commission)
├── recipient_tier_id (level at which recipient gets paid)
├── commission_level (1-10)
├── percentage (30%, 20%, 15%, 10%, 3%, 2%, 1%, 0.5%)
├── gross_amount (total earned)
├── amount_cash_account (80% in EUR)
├── amount_aigcash_account (20% in AIG$)
├── source_type ENUM
│   ('purchase', 'bonus', 'achievement', 'team_volume', 'leadership')
├── recipient_account_id_cash
├── recipient_account_id_aigcash
├── status ENUM('pending', 'approved', 'paid')
└── created_at

Key Rule: Every commission AUTOMATICALLY splits 80/20
- 80% goes to Cash Account (real money holding)
- 20% goes to AIG Cash Account (spending power)
```

#### Marketplace (AIG$ ↔ EUR Exchange)
```sql
marketplace_orders
├── id (UUID)
├── seller_user_id
├── buyer_user_id (NULL if open)
├── order_type ENUM('buy', 'sell')
├── selling_currency VARCHAR(AIG$)
├── buying_currency VARCHAR(EUR)
├── selling_quantity DECIMAL
├── price_per_unit DECIMAL
├── status ENUM('open', 'partially_filled', 'filled', 'cancelled')
├── filled_quantity DECIMAL
└── created_at

marketplace_transactions
├── id (UUID)
├── order_id
├── seller_user_id
├── buyer_user_id
├── seller_amount (AIG$)
├── buyer_amount (EUR)
├── exchange_rate DECIMAL
├── platform_fee DECIMAL (2% on seller)
└── completed_at

Key: Peer-to-peer AIG$ → EUR at market prices
```

#### Diana Memory
```sql
diana_memories
├── id (UUID)
├── user_id
├── key VARCHAR (indexed for retrieval)
├── value TEXT (the actual memory)
├── category VARCHAR ENUM
│   ('user_preference', 'technical_constraint',
│    'project_context', 'working_style')
├── source_conversation_id
└── created_at
```

---

## PART 6: Financial Model (LOCKED)

### Dual-Account System

Every member has exactly **TWO accounts** (immutable):

#### 1. Cash Account (EUR)
- **Currency:** EUR with 1:1 fixed exchange rate
- **Purpose:** Real money holding vault
- **Receives:** 80% of ALL commissions, bonuses, rewards
- **Cannot:** Be spent directly on ecosystem purchases
- **Can:** Be manually converted to AIG Cash (1:1)
- **Protections:** Full KYC, withdrawal limits
- **Governance:** Regulatory-compliant, segregated

#### 2. AIG Cash Account (AIG$)
- **Currency:** AIG$ with market-driven value
- **Purpose:** Only spending account inside AIGINVEST
- **Receives:** 20% of ALL commissions, bonuses, rewards
- **Can:** Buy apps, services, invest, upgrade tiers, create gifts
- **Exchange:** Back to Cash via peer-to-peer marketplace
- **Market:** Price determined by member supply/demand
- **Governance:** Transparent price discovery

### Automatic 80/20 Distribution

**EVERY earning event splits automatically:**

```
Event: User earns €100 commission
├─ €80 → Cash Account (80%, real money value)
└─ €20 → AIG Cash Account (20%, spending power in AIG$)

Event: User earns €50 bonus
├─ €40 → Cash Account (80%)
└─ €10 → AIG Cash Account (20%)

Event: User wins €25 game prize
├─ €20 → Cash Account (80%)
└─ €5 → AIG Cash Account (20%)
```

**No exceptions.** This is hard-coded into the commission engine.

### Conversion Flows

#### Manual: Cash → AIG Cash (1:1)
```
User Action: "Convert €100 to spending"
    ↓
System debits €100 from Cash Account
    ↓
System credits 100 AIG$ to AIG Cash Account
    ↓
Transaction recorded (conversion_cash_to_aigcash_manual)
    ↓
Completed immediately
```

#### Marketplace: AIG Cash → Cash (Market-Driven)
```
Seller: Lists 1,000 AIG$ at €0.92 each = €920 total
    ↓
Buyer: Sees order, purchases with €920 from Cash Account
    ↓
Platform: Takes 2% fee = €18.40
    ↓
Seller receives: €920 - €18.40 = €901.60 in Cash Account
    ↓
Buyer receives: 1,000 AIG$ in AIG Cash Account
    ↓
Exchange rate: Self-corrects via supply/demand
```

### Membership Tiers & Commission Depth

| Tier | Price | Width | Depth | Rates | Upside |
|------|-------|-------|-------|-------|--------|
| Free | €0 | None | 0 levels | N/A | 0% |
| Starter | €399 | Unlimited | 6 levels | 30/20/15/10/3/2 | 80% network share |
| Professional | €699 | Unlimited | 7 levels | +1% L7 | 80% network share |
| Business | €1,099 | Unlimited | 9 levels | +0.5% L8-9 | 80% network share |
| Platinum | €2,999 | Unlimited | 10 levels | +0.5% L10 | 80% + leadership |

**Key:** Width is unlimited (no cap on recruits), depth varies by tier (6-10 levels). Higher tier = deeper reach into upline organization.

---

## PART 7: Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18, TypeScript)
- **Styling:** Tailwind CSS
- **State:** React Context + Hooks
- **Components:** Headless UI, Radix UI
- **Streaming:** SSE (Server-Sent Events)

### Backend
- **Framework:** NestJS 10 (TypeScript, ESM)
- **Database ORM:** Prisma 5
- **Authentication:** JWT + bcrypt
- **HTTP:** Express.js
- **Streaming:** Node.js SSE

### Data
- **Primary DB:** PostgreSQL 16 (source of truth)
- **Cache:** Redis 7 (sessions, rate limiting)
- **Search:** Full-text (PostgreSQL native)

### AI
- **Providers:** OpenAI GPT-4 / Anthropic Claude / Ollama (local)
- **Router:** In-process (LLMService)
- **Streaming:** SSE with AbortController

### DevOps
- **Container:** Docker, Docker Compose
- **Monorepo:** pnpm workspaces + Turbo
- **Package Manager:** pnpm v8+
- **Cloud:** Hetzner (primary), edge CDN
- **Monitoring:** Prometheus, Grafana (planned)

---

## PART 8: Development Roadmap

### Current Status (v0.2 Released)

| Version | Name | Status | Release |
|---------|------|--------|---------|
| v0.1 | Meet Diana | ✅ | 2026-07-06 |
| v0.2 | Real Diana | ✅ | 2026-07-06 |
| v0.3 | Diana Works | 🔵 Next | Q3 2026 |
| v0.4 | Connectivity | ⏳ Planned | Q4 2026 |
| v0.5 | AIOS Prep | ⏳ Planned | Q1 2027 |
| v1.0 | Public Launch | ⏳ Planned | Q4 2026/Q1 2027 |

### v0.2 (Complete) — Real Diana ✅

**Features:**
- ✅ LLM provider router (OpenAI/Anthropic/Ollama/Mock)
- ✅ SSE streaming (word-by-word responses)
- ✅ Cancel generation (AbortController)
- ✅ Long-term memory (DianaMemory table)
- ✅ Context engine (system prompt + history + memories)
- ✅ Tool framework (create_project, create_document)
- ✅ Backend auto-titling
- ✅ Redis infrastructure
- ✅ E2E tests: 17/17 passing

### v0.3 (Next) — Diana Works 🔵

**Features:**
- [ ] Tasks (create from chat, status, priority)
- [ ] Notes (capture and organize)
- [ ] Kanban (visual project board)
- [ ] Full-text search
- [ ] Mobile optimization
- [ ] Error states and offline indicator

**Definition of Done:** User can manage complete project lifecycle via conversation.

### v0.4 (Planned) — Connectivity ⏳

**Features:**
- [ ] Team workspaces
- [ ] Shared projects and documents
- [ ] Role-based access (owner/editor/viewer)
- [ ] Real-time collaboration (WebSockets)
- [ ] Activity feed
- [ ] Notifications

### v0.5 (Planned) — AIOS Prep ⏳

**Features:**
- [ ] Offline queue (messages sent when reconnected)
- [ ] Beam Me Up sync protocol design
- [ ] Sailfish OS integration research
- [ ] Device API abstraction layer
- [ ] Local model optimization

### v1.0 (Target) — Public Launch ⏳

**Features:**
- [ ] All Alpha features polished
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] GDPR compliance
- [ ] Marketplace foundation
- [ ] Payments integration
- [ ] Public documentation
- [ ] Support system
- [ ] 99.9% uptime SLA

---

## PART 9: Codebase Structure

### Repository Layout

```
aig-platform/
├── apps/
│   ├── api/                          NestJS backend
│   │   ├── src/
│   │   │   ├── ai/                   LLMService, ContextEngine
│   │   │   ├── auth/                 AuthController, AuthModule
│   │   │   ├── chat/                 ChatController, streaming
│   │   │   ├── projects/             ProjectController, ProjectService
│   │   │   ├── documents/            DocumentController
│   │   │   ├── tasks/                TaskController (future)
│   │   │   ├── memories/             DianaMemory service
│   │   │   └── main.ts               NestJS bootstrap
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── dist/                     Compiled JavaScript
│   │
│   └── web/                          Next.js frontend
│       ├── app/
│       │   ├── chat/                 Diana UI
│       │   ├── projects/             Project management
│       │   ├── documents/            Document library
│       │   ├── login/                Authentication
│       │   ├── layout.tsx            Root layout
│       │   └── page.tsx              Home page
│       ├── components/               Reusable components
│       ├── lib/                      Utilities
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   └── identity/                     Shared auth package
│       ├── jwt.ts                    JWT utilities
│       ├── bcrypt.ts                 Password hashing
│       └── index.ts                  Exports
│
├── prisma/
│   ├── schema.prisma                 Database schema (13 models)
│   ├── migrations/                   All applied migrations
│   └── seed.ts                       Seed script (future)
│
├── infra/
│   └── docker/
│       ├── Dockerfile.api            NestJS Dockerfile
│       ├── Dockerfile.web            Next.js Dockerfile
│       └── docker-compose.yml        Local dev setup
│
├── docker-compose.yml                PostgreSQL + Redis
├── .env.example                      Environment template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Key Files

**Backend (apps/api/):**
- `src/main.ts` — NestJS bootstrap, 3333 port
- `src/ai/llm.service.ts` — Provider router, model selection
- `src/ai/context.engine.ts` — Prompt building + memory loading
- `src/chat/chat.controller.ts` — POST /stream endpoint (SSE)
- `src/projects/project.service.ts` — Project CRUD
- `src/documents/document.service.ts` — Document generation

**Frontend (apps/web/):**
- `app/chat/page.tsx` — Main Diana interface
- `components/ChatMessage.tsx` — Message display
- `components/ChatInput.tsx` — User input
- `lib/api.ts` — API client for streaming

**Database (prisma/):**
- `schema.prisma` — 13 Prisma models (users, conversations, projects, etc.)
- `migrations/` — All schema changes version-controlled

---

## PART 10: API Reference (Key Endpoints)

### Authentication

```
POST /api/auth/register
  Params: email, name
  Returns: {user, token}

POST /api/auth/login
  Params: email
  Returns: {user, token}

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Returns: {user, tier, accounts}
```

### Chat & Diana

```
POST /api/chat/stream
  Headers: Authorization: Bearer <token>
  Params: message, conversationId (optional)
  Returns: SSE stream (text/event-stream)
  Events:
    - chunk {content: string}
    - action {action, result}
    - title {title}
    - done {response}
    - error {message}

POST /api/chat/conversations
  Returns: [{id, title, createdAt}]

GET /api/chat/conversations/:id/messages
  Returns: [{role, content, createdAt}]
```

### Account Management (Dual-Wallet)

```
GET /api/accounts
  Returns: Both accounts (Cash + AIG Cash)
  Response: {
    accounts: [
      {accountType: "cash_account", currency: "EUR", balance: ...},
      {accountType: "aig_cash_account", currency: "AIG$", balance: ...}
    ]
  }

POST /api/accounts/deposit
  Params: amount, paymentMethod
  Note: EUR only → Cash Account

POST /api/accounts/convert
  Params: fromAccountType, toAccountType, amount
  Note: Cash → AIG$ at 1:1 (manual)

GET /api/commissions/breakdown
  Returns: How last commission split 80/20
```

### Marketplace (AIG$ ↔ EUR)

```
GET /api/marketplace/orders
  Params: orderType (buy|sell), status
  Returns: [orders with prices and volumes]

POST /api/marketplace/orders
  Params: orderType, quantity, pricePerUnit
  Returns: Order confirmation

POST /api/marketplace/orders/:id/accept
  Params: acceptQuantity
  Returns: Transaction confirmation
```

### Projects & Documents

```
POST /api/projects
  Params: name, description
  Returns: {id, name, createdAt}

GET /api/projects
  Returns: [projects]

POST /api/documents
  Params: projectId, title, content
  Returns: {id, title, version}

GET /api/documents/:id/versions
  Returns: [all versions with timestamps]
```

---

## PART 11: Deployment & Operations

### Local Development

```bash
# Start infrastructure
docker-compose up -d postgres redis

# Apply migrations
npx prisma migrate dev

# Start API (dev mode)
cd apps/api && npm run dev

# Start Web (dev mode)
cd apps/web && npm run dev

# Both running: http://localhost:3001 (web), http://localhost:3333 (API)
```

### Environment Variables

```env
# Database
DATABASE_URL=postgres://aig:aig@localhost:5432/aig
REDIS_URL=redis://localhost:6379

# API
PORT=3333
NODE_ENV=development

# LLM Provider
LLM_PROVIDER=openai|anthropic|ollama|mock
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_URL=http://localhost:11434

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Production Deployment

- **Container Registry:** Docker images built and pushed
- **Orchestration:** (Kubernetes planned)
- **Database:** Managed PostgreSQL (Heroku, AWS RDS, etc.)
- **Cache:** Managed Redis
- **CDN:** Hetzner edge CDN
- **Monitoring:** Prometheus + Grafana
- **Logging:** (Centralized logging planned)

---

## PART 12: Quality Standards

### Before Every Release

- [ ] Build: TypeScript compiles without errors
- [ ] Lint: No lint errors
- [ ] Tests: All E2E tests pass (17/17 currently)
- [ ] Product: Product Acceptance Test completed
- [ ] Performance: Response time < 200ms (non-streaming)
- [ ] Security: No new OWASP Top 10 issues

### Product Acceptance Test

1. Can a new user register?
2. Does Diana greet them naturally?
3. Can they create a project?
4. Is generated content useful?
5. Can they continue later?
6. Would we show this to a customer?

If any "no" → fix before release.

---

## PART 13: Key Architectural Decisions

### ADR-001: Email-only authentication (MVP)
**Decision:** No password required initially. Email = identity.  
**Status:** Active (v0.1+)

### ADR-002: In-process LLM routing
**Decision:** Provider selection via env vars in LLMService, not separate gateway.  
**Status:** Active

### ADR-003: SSE over WebSockets
**Decision:** Use Server-Sent Events for streaming.  
**Status:** Active

### ADR-004: PostgreSQL primary + Redis cache
**Decision:** PostgreSQL is source of truth. Redis for ephemeral data.  
**Status:** Active

### ADR-005: Monorepo with pnpm
**Decision:** All code in one repository.  
**Status:** Active

### ADR-006: Dual-Account Financial Model
**Decision:** Two accounts per member (Cash + AIG Cash) with automatic 80/20 split.  
**Status:** LOCKED for Phase 1+

### ADR-007: Unilevel MLM (Unlimited Width, Variable Depth)
**Decision:** Width unlimited (no cap on recruits), depth 6-10 levels by tier.  
**Status:** LOCKED for Phase 1+

---

## PART 14: Three Repositories

### 1. aig-platform (Source Code)
- Apps: API, Web
- Services: All business logic
- Database: Prisma schemas
- Tests: E2E coverage
- Docker: Deployment configs

### 2. aig-product (Product Design)
- Chapters 01-13: Complete vision
- Program definitions
- Core services layer
- Sprint planning
- Marketing materials

### 3. ai-docs (Engineering Playbook)
- Architecture decisions
- API documentation
- Deployment guides
- Best practices
- Troubleshooting

---

## PART 15: Timeline 2026-2028

### Q2 2026 (Current)
- ✅ v0.1 — Meet Diana
- ✅ v0.2 — Real Diana
- 🔵 v0.3 — Diana Works (Sprint 3+)

### Q3 2026
- Production stability
- Partner integration
- North Star prototype planning

### Q4 2026
- v1.0 public release
- First paying customers
- Marketplace seed creators

### 2027
- International expansion
- Mobile app launch
- AIOS developer preview
- North Star developer edition

### 2028
- North Star ONE device launch
- Public marketplace launch
- Global scale operations

---

## LOCKED SPECIFICATIONS (Phase 1-4 Immutable)

🔒 **LOCKED:**
- Dual-Account Financial Model (Cash EUR + AIG Cash with 80/20 split)
- Unilevel MLM Structure (Unlimited width, variable 6-10 depth by tier)
- Commission Rates (30/20/15/10/3/2 + 1/0.5/0.5/0.5 for levels 7-10)
- Database Schema (accounts, commissions, marketplace tables)
- API Contracts (all endpoints documented and versioned)
- Technology Stack (Next.js, NestJS, PostgreSQL, Redis, Ollama)
- Diana Personality (direct, helpful, action-oriented)
- Marketplace Mechanism (peer-to-peer, market-driven pricing)

**Any deviation requires:**
- Architecture Council approval
- CFO sign-off (financial impact)
- Legal review (compliance)
- Database migration (data integrity)

---

**Status:** 🔒 LOCKED FOR PHASE 1  
**Last Updated:** 2026-07-07  
**Next Review:** 2026-07-15 (Phase 1 Check-in)  
**Compliance Review:** 2026-07-22 (Quarterly Audit)
