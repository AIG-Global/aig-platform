# Master Product Plan

**Date:** 2026-07-06  
**Version:** 1.0  
**Status:** Living Document (evolves with every sprint)  

---

## Executive Overview

The Master Product Plan is the **single authoritative document** for North Star ONE. It synchronizes vision, architecture, and implementation across all sprints.

This document is updated:
- **Monthly:** Architecture & capability updates
- **Bi-weekly:** Sprint plan integration
- **As needed:** Risk register, technical decisions, release history

---

## Part 1: Product Vision & Principles

### Vision Statement

> **Diana is an AI partner who remembers you, works across your devices, and turns your intentions into action.**

### Five Core Pillars

1. **Memory & Context** — Diana remembers your work, preferences, and goals
2. **Seamless Integration** — Works with your favorite tools (calendar, email, docs, etc.)
3. **Cross-Device** — Start on phone, continue on desktop, resume on tablet
4. **Transparent & Ethical** — You control your data, understand Diana's reasoning, manage permissions
5. **Extensible Platform** — Developers can build skills, plugins, and integrations

### Product Principles

| Principle | Definition |
|-----------|-----------|
| **User-First** | Every feature filters through: Does this help the user? |
| **Privacy by Default** | Data stays on-device until user explicitly shares |
| **Transparency** | Users understand what Diana is doing and why |
| **Sustainable Growth** | Build for years, not quarters |
| **Developer-Friendly** | Easy to extend; hard to break |

---

## Part 2: Architecture Overview

### System Architecture (High Level)

```
┌─────────────────────────────────────────────────────┐
│                   Diana Client Layer                │
│         (Web, Desktop, Mobile, Voice, Ambient)      │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│              API Gateway & Services                 │
├──────────────────────────────────────────────────────┤
│  • Identity Service (Auth/RBAC)                     │
│  • Memory Engine (Vector DB + Context)              │
│  • Conversation Service (Streaming)                 │
│  • Document Service (Generation)                    │
│  • Integration Hub (Webhooks, APIs)                 │
│  • Payment Service (Provider abstraction)           │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│           Core Data Layer                           │
├──────────────────────────────────────────────────────┤
│  • PostgreSQL (Relational)                          │
│  • MongoDB (Document search)                        │
│  • Vector DB (Embeddings/semantic search)           │
│  • Redis (Caching & sessions)                       │
└──────────────────────────────────────────────────────┘
```

### 8 Core Registries

```
┌─────────────────────────────────────────────────┐
│         Registry Layer (N1 Orchestrator)        │
├─────────────────────────────────────────────────┤
│ 1. Apps        → Installed applications         │
│ 2. Capabilities→ Available AI capabilities      │
│ 3. Services    → Backend services               │
│ 4. Skills      → AI agent skills                │
│ 5. Plugins     → Extensions and integrations    │
│ 6. Payments    → Active payment methods         │
│ 7. Health      → System health metrics          │
│ 8. Events      → Event bus and subscriptions    │
└─────────────────────────────────────────────────┘
```

### 26 Core API Endpoints

**Identity (6 endpoints)**
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/verify
- POST /auth/logout
- GET /auth/me

**Conversations (4 endpoints)**
- POST /conversations
- GET /conversations
- GET /conversations/:id
- POST /conversations/:id/messages

**Memory (4 endpoints)**
- POST /memory/store
- GET /memory/retrieve
- POST /memory/search
- DELETE /memory/:id

**Documents (3 endpoints)**
- POST /documents/generate
- GET /documents
- GET /documents/:id

**Registry (5 endpoints)**
- GET /registry/apps
- GET /registry/capabilities
- GET /registry/services
- GET /registry/skills
- POST /registry/install

**System (4 endpoints)**
- GET /health
- GET /status
- GET /metrics
- POST /admin/config

---

## Part 3: Diana Design Bible

### Character Definition

**Diana is intelligent, helpful, and trustworthy.**

**Personality Traits:**
- 🧠 Smart — Understands context and nuance
- 🤝 Collaborative — Works *with* you, not *for* you
- 🎯 Focused — Cuts through noise to what matters
- 💡 Creative — Generates novel ideas
- 🛡️ Protective — Respects your privacy and boundaries
- 🌱 Humble — Admits uncertainty, asks clarifying questions

### Voice & Tone

| Situation | Tone | Example |
|-----------|------|---------|
| Greeting | Warm, welcoming | "Hi Sarah, I've been thinking about your project briefing from yesterday..." |
| Explaining | Clear, patient | "I found these three approaches. Let me walk you through the pros and cons of each." |
| Error | Honest, actionable | "I'm not confident about that. Here's what I can do instead..." |
| Alert | Urgent, concise | "Your calendar conflict detected: meeting at 2pm vs. deadline at 1:30pm" |

### Visual Identity

**Color Palette:**
- Primary: `#0066FF` (Diana Blue)
- Accent: `#00D9FF` (Thinking State)
- Success: `#00CC44` (Celebration)
- Warning: `#FF9900` (Caution)
- Error: `#FF0044` (Alert)
- Neutral: `#666666` - `#CCCCCC` (Background)

**Typography:**
- Headings: Inter Bold (600+)
- Body: Inter Regular (400)
- Code: Monaco/Courier (monospace)

**Motion:**
- Smooth easing (ease-in-out, 300-500ms)
- Microinteractions: 100-200ms
- No jarring transitions
- Thoughtful loading states

### Diana Assets (Illustration States)

Diana exists as a **transparent SVG asset library**:

1. **Greeting** — Warm, open smile, relaxed posture
2. **Listening** — Focused, leaning in, eyes engaged
3. **Thinking** — Hand on chin, eyes looking up/away
4. **Processing** — Animated shimmer, slight movement
5. **Explaining** — Gesturing, forward-facing, engaging
6. **Writing** — Typing motion, concentrated
7. **Celebrating** — Raised arms, joyful expression
8. **Warning** — Concerned expression, raised hand
9. **Presenting** — Professional, pointing/gesturing
10. **Idle** — Neutral, waiting

All assets are:
- Transparent PNG/SVG
- 256x256px baseline (scalable)
- Consistent line weight (2px)
- Diana Blue (#0066FF) color
- Licensed for internal and external use

### Ethics & Guardrails

**Diana's Responsibilities:**
- ✅ Be honest about capabilities and limitations
- ✅ Respect user privacy (data stays on-device by default)
- ✅ Avoid harmful outputs (violence, illegal content, etc.)
- ✅ Disclose when using external data
- ✅ Support user autonomy (never manipulate)
- ✅ Be transparent about costs (tokens, data usage, etc.)

**What Diana Will NOT Do:**
- ❌ Pretend to be human
- ❌ Store user data without explicit consent
- ❌ Make autonomous decisions with real-world consequences
- ❌ Disable user controls or override permissions
- ❌ Generate misinformation intentionally
- ❌ Participate in deception or fraud

---

## Part 4: Roadmap

### Phase 1: Foundation (Weeks 1-12)
**Theme:** Build trust through authentication, memory, and basic productivity

**Sprint 1-2:** Setup & Authentication
- User registration/login
- Profile management
- JWT tokens and session management
- Health monitoring

**Sprint 3-4:** Conversation Engine
- Streaming responses
- Message history
- Context awareness
- Error recovery

**Sprint 5-6:** Memory & Documents
- Vector embeddings
- Semantic search
- Document generation
- Conversation save/restore

**Launch Target:** End of Phase 1 (week 12)
- 1,000+ DAU
- MVP complete
- First marketplace skill

### Phase 2: Integrations (Weeks 13-24)
**Theme:** Connect Diana to your tools

- Calendar integration
- Email integration
- Document integration
- Web search
- Payment capability
- Beam Me Up (cross-device sync)

**Launch Target:** Mid-year (week 24)
- 10,000+ DAU
- 5+ integrations
- Payment processing active

### Phase 3: Ecosystem (Weeks 25-36)
**Theme:** Enable developer innovation

- Marketplace launch
- Skill framework
- Plugin ecosystem
- AI provider flexibility
- Enterprise features

**Launch Target:** Q3 (week 36)
- 100,000+ DAU
- 50+ marketplace skills
- Enterprise pilot customers

### Phase 4: Scale (Weeks 37-48)
**Theme:** Global availability

- Mobile apps (iOS, Android)
- Localization (10+ languages)
- Enterprise support
- SOC 2 compliance
- Regional deployment

**Launch Target:** Q4 (week 48)
- 1,000,000+ DAU
- Global availability
- Enterprise tier

### Phase 5: Intelligence (Weeks 49+)
**Theme:** Autonomous capabilities

- On-device models
- Advanced reasoning
- Proactive assistance
- Ambient computing
- Voice & vision

---

## Part 5: Application Catalog

### MVP Applications (Phase 1)

Only register applications with defined, shippable MVPs:

#### 1. Ask Diana 🚧
**Owner:** Diana Core Team  
**Version:** 1.0.0  
**Status:** In Development

**Capabilities:**
- Streaming conversation
- Context awareness
- Document generation

**Dependencies:**
- Identity Service
- Memory Engine
- Conversation Service

**Health Endpoint:** GET /apps/ask-diana/health  
**Documentation:** /docs/apps/ask-diana  

---

#### 2. Documents 🚧
**Owner:** Diana Core Team  
**Version:** 1.0.0  
**Status:** In Development

**Capabilities:**
- Generate documents
- Save and retrieve
- Share with others

**Dependencies:**
- Identity Service
- Document Service
- Memory Engine

**Health Endpoint:** GET /apps/documents/health  
**Documentation:** /docs/apps/documents  

---

#### 3. Identity 🚧
**Owner:** Diana Core Team  
**Version:** 1.0.0  
**Status:** In Development

**Capabilities:**
- User authentication
- Role-based access control
- Permission management

**Dependencies:**
- PostgreSQL
- Redis

**Health Endpoint:** GET /identity/health  
**Documentation:** /docs/services/identity  

---

### Planned Applications (Phase 2+)

#### Calendar 📋
**Owner:** TBD  
**Version:** 0.1.0  
**Status:** Planned (Phase 2)

**Target Capabilities:**
- Meeting scheduling
- Conflict detection
- Agenda generation

---

#### Marketplace 📋
**Owner:** Diana Core Team  
**Version:** 0.1.0  
**Status:** Planned (Phase 2)

**Target Capabilities:**
- Skill discovery
- Installation
- Rating and reviews

---

#### Beam Me Up 📋
**Owner:** Diana Core Team  
**Version:** 0.1.0  
**Status:** Planned (Phase 2)

**Target Capabilities:**
- Cross-device sync
- Conversation history sync
- State synchronization

---

#### Payments 📋
**Owner:** Diana Core Team  
**Version:** 0.1.0  
**Status:** Planned (Phase 2)

**Target Capabilities:**
- Payment processing
- Subscription management
- Invoice generation

---

## Part 6: Service Catalog

### Core Services (Always Running)

| Service | Version | Owner | Endpoints | Status |
|---------|---------|-------|-----------|--------|
| Identity | 1.0.0 | Diana Team | 6 | 🚧 Active |
| Conversation | 1.0.0 | Diana Team | 4 | 🚧 In Dev |
| Memory | 1.0.0 | Diana Team | 4 | 🚧 In Dev |
| Document | 1.0.0 | Diana Team | 3 | 🚧 In Dev |
| Registry | 1.0.0 | Diana Team | 5 | ✅ Ready |
| Payment | 1.0.0 | Diana Team | TBD | 📋 Planned |
| Integration | 1.0.0 | Diana Team | TBD | 📋 Planned |

---

## Part 7: Capability Registry

### AI Capabilities (Currently Supported)

1. **Conversation** — Natural language chat with streaming
2. **Summarization** — Extract key points from documents
3. **Writing** — Generate documents, emails, code
4. **Analysis** — Analyze data, find patterns
5. **Planning** — Create project plans, roadmaps
6. **Brainstorming** — Generate ideas on demand
7. **Search** — Semantic search of user context
8. **Integration** — Invoke external tools/APIs

---

## Part 8: Payment Service Architecture

### Multi-Provider Payment System

```
┌──────────────────────────┐
│   Diana Payment API      │
├──────────────────────────┤
│  POST /pay/charge        │
│  POST /pay/subscribe     │
│  GET /pay/methods        │
│  POST /pay/webhook       │
└──────┬───────────────────┘
       │
    ┌──┴─────────────────────────┐
    │                            │
┌───▼────┐ ┌────────┐ ┌──────┐ ┌▼────┐
│ Stripe │ │ PayPal │ │ Link │ │ APay│
└────────┘ └────────┘ └──────┘ └─────┘
```

**Supported Providers (Phase 1-2):**
- ✅ Stripe (primary, all currencies)
- ✅ Link (from Stripe)
- ✅ PayPal (US/International)
- ✅ Apple Pay (iOS native)
- ✅ Google Pay (Android native)

**Provider Abstraction:**
- Single API regardless of provider
- Automatic fallback (if Stripe fails, try PayPal)
- Provider-agnostic webhooks
- Unified reconciliation

---

## Part 9: Runtime Dashboard Specification

### What the Dashboard Shows

**System Health (Real-time)**
- ✅ API Server Status
- ✅ Database Connections
- ✅ Cache Status
- ✅ Message Queue
- ✅ AI Provider Health

**Running Applications**
- Active apps and versions
- User count per app
- Error rates
- Performance metrics

**Registered Services**
- Service status
- Response times
- Error logs
- Capacity

**Installed Skills**
- Total count
- Recent installations
- Usage statistics
- Performance

**Memory System**
- Embeddings processed
- Vector DB status
- Search performance
- Storage usage

**Payments**
- Daily revenue
- Active subscriptions
- Failed transactions
- Top customers

**Events**
- Event bus health
- Message count/sec
- Subscription count
- Dead letter queue

**Notifications**
- Total sent
- Delivery rate
- Engagement rate
- Channel breakdown

### Dashboard Screens

1. **Overview** — 5-minute status snapshot
2. **Applications** — App registry and activity
3. **Services** — Backend services and performance
4. **Memory** — Vector DB and search performance
5. **Payments** — Revenue and transactions
6. **Events** — Event bus and subscriptions
7. **Logs** — System and error logs
8. **Alerts** — Active incidents and warnings

---

## Part 10: Diana MVP User Flow

### Complete End-to-End Experience

**Flow: "Ask Diana to Create a Project Plan"**

```
1. User Signs In
   → Email + password
   → 2FA (optional)
   → JWT token issued

2. Diana Greets User
   → "Hi Sarah! Last we spoke, you were working on the Q3 roadmap..."
   → Diana shows relevant context from previous conversations

3. User Starts Conversation
   → Types: "Create a project plan for launching our new feature"
   → Sends message

4. Diana Streams Response
   → "I'll create that for you. Let me think about what I know about your team..."
   → Response streams in real-time (word by word)
   → Diana shows thinking indicators as she processes

5. Conversation is Saved
   → Message automatically saved to PostgreSQL
   → Embedding generated for semantic search
   → Stored in vector DB for future context

6. Diana Remembers Context
   → "Based on your Q3 timeline and team structure..."
   → References previous conversations
   → Maintains conversation history

7. Diana Generates Document
   → "Should I save this as a document?"
   → User clicks "Yes"
   → Document generated and stored
   → Ready to export or share

8. Diana Invokes Platform Tool
   → "I can also create calendar blocks for your milestones"
   → Diana invokes Calendar integration
   → Generates meeting invites
   → Syncs back to user's calendar
```

### Key States in the UI

| State | Diana Expression | Interaction |
|-------|-----------------|-------------|
| Ready | Greeting (warm smile) | Ready to chat |
| Listening | Listening (eyes focused) | Processing user input |
| Thinking | Thinking (processing animation) | Generating response |
| Writing | Writing (animated typing) | Streaming output |
| Complete | Celebrating (content, engaged) | Ready for next input |
| Error | Warning (concerned) | Error state with recovery option |

---

## Part 11: North Star ONE Alpha Milestone

### Definition

> **North Star ONE Alpha** is the first publicly demonstrable milestone where a user can complete a meaningful workflow from start to finish.

### Success Criteria (All Must Pass)

✅ **User Authentication**
- User can sign up with email
- User can log in securely
- Session persists across page reloads

✅ **Meet Diana**
- Diana greets user by name
- Diana shows contextual welcome (first-time vs. returning)
- Diana's personality is clear and consistent

✅ **Chat Naturally**
- User can type messages
- Diana responds in real-time (streaming)
- Multi-turn conversation works
- Context is maintained across turns

✅ **Create Documents**
- User can ask Diana to create a document
- Document is generated and saved
- User can view saved documents
- Documents can be downloaded (markdown/PDF)

✅ **Save Work**
- Conversations are automatically saved
- Document history is accessible
- User can resume previous conversations

✅ **Resume on Another Device**
- User logs in on second device
- Conversation history is available
- Documents are synchronized
- State is consistent across devices

✅ **Install One Marketplace Skill**
- User can browse marketplace (1-3 skills available)
- User can install a skill
- Installed skill appears in Diana's capabilities
- Diana can invoke the skill in conversation

✅ **Complete a Project**
- User flows: Sign in → Chat with Diana → Create document → Install skill → Generate deliverable
- Every step works without errors
- Takes <10 minutes total
- User understands the vision

### Demo Flow for Alpha

```
Demo: 10-minute walkthrough

1. [2 min] Sign in & Meet Diana
   - Show login page
   - Login with demo account
   - Diana greets with context

2. [3 min] Ask Diana to Create a Plan
   - Type: "Create a 30-day project plan for launching a new feature"
   - Watch streaming response
   - See thinking indicators
   - Observe natural, helpful tone

3. [2 min] Generate & Save Document
   - "Should I save this as a document?"
   - Show save confirmation
   - View in Documents app
   - Download as markdown

4. [2 min] Install Marketplace Skill & Resume
   - Show marketplace (GitHub Integration skill)
   - Click install
   - Open on phone/tablet
   - Show conversation history synced
   - Invoke GitHub skill in conversation
   - Show output updated in real-time

5. [1 min] Summary
   - "That's North Star ONE Alpha"
   - Vision: Diana across devices, remembering context
   - Next: Full marketplace, integrations, mobile apps
```

### Definition of Done for Alpha

- ✅ Code compiles with zero errors
- ✅ All 8 user flows complete without errors
- ✅ Performance: <200ms response time (p95)
- ✅ Security: No secrets in code, HTTPS enforced
- ✅ Monitoring: Health checks passing
- ✅ Documentation: Complete API docs
- ✅ Testing: 80%+ coverage
- ✅ Design: Consistent with Diana brand
- ✅ Demo: 10-minute walkthrough successful
- ✅ Team: All members onboarded and productive

---

## Part 12: Technical Decisions

### Approved Decisions (Locked)

| Decision | Rationale | Status |
|----------|-----------|--------|
| Node.js v24 (ESM) | Modern, fast, ESM-native | ✅ Locked |
| NestJS 10+ | Scalable, structured, typed | ✅ Locked |
| PostgreSQL | Reliable, ACID, proven at scale | ✅ Locked |
| Vector DB (Pinecone/Weaviate) | Semantic search capability | ✅ Locked |
| Redis | Session management, caching | ✅ Locked |
| React 18+ | Frontend framework | ✅ Locked |
| TypeScript strict | Type safety across platform | ✅ Locked |

### Deferred Decisions (To be Made Sprint 3+)

- Vector DB selection (Pinecone vs. Weaviate vs. Milvus)
- Streaming protocol (Server-Sent Events vs. WebSocket)
- Authentication (OAuth2/SAML providers)
- Payment processor (Stripe vs. alternatives)

---

## Part 13: Release History

### Phase 1 Releases

**Release 0.1.0 (Sprint 1-2 end)**
- User registration and login
- Profile management
- JWT authentication
- Health monitoring

**Release 0.2.0 (Sprint 3-4 end)**
- Streaming conversations
- Real-time message delivery
- Conversation history
- Context awareness

**Release 0.3.0 (Sprint 5-6 end)**
- Document generation
- Memory system
- Semantic search
- Cross-device sync (beta)

**Release 1.0.0-alpha (Phase 1 end)**
- Complete MVP
- Marketplace skill #1
- Initial integrations
- Public demo ready

---

## Part 14: Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Hiring delays | Medium | High | Start recruiting immediately |
| Performance bottleneck | Low | High | Load test Sprint 2 |
| AI provider downtime | Medium | High | Support multiple providers |
| Scope creep | High | High | Strict governance (PROJECT_CHARTER.md) |
| Security vulnerability | Low | Critical | Third-party security audit |
| Team turnover | Low | High | Competitive compensation + equity |

---

## Part 15: How to Use This Document

**Every Sprint:**
- Review Part 4 (Roadmap) for sprint goals
- Update Part 5 (Application Catalog) with new apps
- Update Part 12 (Technical Decisions) as decisions are made
- Add to Part 13 (Release History) with new releases
- Review Part 14 (Risk Register) for new risks

**Monthly:**
- Revise timelines in Part 4 based on actual velocity
- Update cost estimates in Part 1 (if changed)
- Add architectural updates to Part 2
- Expand Part 14 (Risk Register) with learned risks

**Every Quarter:**
- Complete review of all sections
- Update vision if strategic direction changes
- Redistribute budget if needed
- Plan next quarter in detail

---

## Part 16: Approval & Governance

**Document Owner:** CPO (Chief Product Officer)  
**Reviewed by:** CTO, Engineering Lead, Product Lead  
**Approved by:** Founding Team  

**Change Log:**

| Version | Date | Change | By |
|---------|------|--------|-----|
| 1.0 | 2026-07-06 | Initial creation | CPO |

---

**This is the single source of truth for North Star ONE.**

*Master Product Plan*  
*Version 1.0 | 2026-07-06*  
*Status: Living Document (updated every sprint)*
