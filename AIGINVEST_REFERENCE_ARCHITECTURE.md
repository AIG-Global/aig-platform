# AIGINVEST Reference Architecture v1.0 (ARA)

**Version:** 1.0  
**Status:** LOCKED — Governs all engineering decisions  
**Effective:** July 7, 2026  
**Horizon:** 10-year platform stability  
**Parent Document:** [AIGINVEST_OS.md](AIGINVEST_OS.md)

---

## Preamble

An operating system needs a stable kernel.

A platform needs a stable architecture.

AIGINVEST's Reference Architecture is the constitution for the codebase.

This document is not about "this week's features."

It's about "what remains true for the next decade."

Every engineer, every AI coding agent, every team that joins AIGINVEST builds against this architecture.

---

## The Five Permanent Layers

Nothing crosses layers directly. Everything moves through defined contracts.

### Layer 1: Infrastructure
**Responsibility:** Cloud, database, monitoring, security, CI/CD

**What Lives Here:**
- PostgreSQL database
- Redis cache
- Monitoring (Sentry, DataDog)
- Security (encryption, secrets)
- CI/CD pipeline

**What Does NOT Live Here:**
- Business logic
- User-facing code
- AI orchestration

**Owned By:** Infrastructure Team

**Stability:** Highest (changes only when requirements shift)

**10-Year View:** Same layer we're building today will likely serve decade from now (cloud providers, databases, monitoring evolve but role stays same)

---

### Layer 2: Platform
**Responsibility:** Core data models, services, events, and AI infrastructure

**What Lives Here:**
- **Identity Service** — Users, organizations, authentication
- **Storage Service** — Files, documents, assets
- **Event Service** — Immutable event log (audit trail)
- **Search Service** — Full-text search over workspaces
- **AI Infrastructure** — LLM client, embeddings, vector store

**What Does NOT Live Here:**
- Mission-specific logic (that's Layer 3)
- Diana's reasoning (that's Layer 3)
- UI code (that's Layer 5)

**Owned By:** Core Platform Team

**Stability:** High (changes when core abstractions need refinement)

**10-Year View:** These are the primitives. They'll evolve, but role stays central.

**Key APIs (Examples):**
```
POST /platform/identity/users/register
POST /platform/storage/documents/upload
POST /platform/events/log
GET /platform/search/query
POST /platform/ai/embedding/encode
```

---

### Layer 3: Mission
**Responsibility:** Goal lifecycle, mission orchestration, workspace provisioning, progress tracking

**What Lives Here:**
- **Goal Service** — What users want to achieve
- **Mission Service** — Bounded execution toward goals
- **Workspace Service** — Provisioning + configuration
- **Progress Engine** — Measuring meaningful progress
- **Timeline Service** — Activity history + visualization
- **Trust Engine** — Audit records for every action

**What Does NOT Live Here:**
- AI reasoning (that's Layer 4)
- UI styling (that's Layer 5)
- Payments (that's Layer 4, Ecosystem)

**Owned By:** Workspace Team

**Stability:** Medium (will evolve as we learn what "mission" means at scale)

**10-Year View:** The core business model. This layer will be refined extensively, but the concept remains.

**Key APIs (Examples):**
```
POST /missions/create
GET /missions/:id/timeline
PATCH /missions/:id/status
GET /workspaces/:id/progress
POST /trust-records/create
```

---

### Layer 4: Diana
**Responsibility:** AI orchestration, reasoning, memory, planning, execution, learning

**What Lives Here:**
- **Memory Service** — User context, workspace history, learned patterns
- **Reasoning Engine** — Problem analysis, decision-making
- **Planning Service** — Roadmap generation, task decomposition
- **Execution Engine** — Action coordination, tool invocation
- **Learning System** — Pattern recognition, continuous improvement

**What Does NOT Live Here:**
- UI rendering (that's Layer 5)
- Event logging (that's Layer 2)
- User authentication (that's Layer 2)

**Owned By:** Diana Intelligence Team

**Stability:** Medium-Low (AI capabilities evolve rapidly)

**10-Year View:** This layer will be completely rewritten multiple times. New AI models, new reasoning approaches, new capabilities. But the interface will remain stable.

**Key APIs (Examples):**
```
POST /diana/chat/message
POST /diana/planning/generate-roadmap
GET /diana/memory/workspace-context
POST /diana/reasoning/analyze-progress
POST /diana/learning/feedback
```

---

### Layer 5: Experience
**Responsibility:** User interfaces across all platforms

**What Lives Here:**
- **Web App** — React/Next.js frontend
- **Mobile App** — React Native or native (future)
- **AIOS Shell** — Operating system interface (future)
- **Voice Interface** — Natural language interaction (future)
- **API Documentation** — Developer reference

**What Does NOT Live Here:**
- Business logic (that's Layers 2-4)
- Data persistence (that's Layer 2)
- AI orchestration (that's Layer 4)

**Owned By:** Experience Team

**Stability:** Lowest (UI evolves constantly based on feedback)

**10-Year View:** Will look completely different. But Layer 5 should always be replaceable without touching Layers 2-4.

**Key Interfaces:**
```
GET /ui/missions - Mission list page
POST /ui/auth/login - Login form
GET /ui/workspace/:id - Workspace view
POST /ui/chat/message - Diana chat
```

---

## The Three Products (Different Businesses, Same Platform)

### Product 1: AIGINVEST Platform
**What it is:** The ecosystem and marketplace

**Depends on:** Layers 2, 3, 5

**Key Components:**
- Identity + Organizations
- Marketplace (themes, templates, apps)
- Payments + Billing
- Developer APIs + SDK

**10-Year Vision:** Becomes the place where people build on top of AIGINVEST

**Revenue:** Marketplace fees, API usage, SDK licenses

---

### Product 2: Diana
**What it is:** The intelligence layer

**Depends on:** Layers 2, 4

**Key Components:**
- Memory system (workspace context + learning)
- Planning (roadmap generation)
- Reasoning (problem analysis)
- Execution (action coordination)

**10-Year Vision:** Becomes the AI that can handle any mission type

**Revenue:** Diana becomes the premium feature (free for 1 workspace, $X/month for multiple)

---

### Product 3: AIOS
**What it is:** The operating system layer (comes later)

**Depends on:** All layers (when built)

**Key Components:**
- North Star ONE integration (when released)
- Mobile + desktop apps
- Voice interaction
- Hardware integration (future)

**10-Year Vision:** AIOS becomes "the interface to everything"

**Revenue:** Licensing, device partnerships

---

## The AIGINVEST Kernel

Everything else is a module.

The kernel knows only:

```
Person ─── Identity + Permissions
          (who can do what)
          
Organization ─── Ownership + Boundaries
                (what belongs to whom)

Goal ─── Desired Outcome
       (what are we trying to achieve)

Mission ─── Execution Frame
           (how + when are we doing it)

Workspace ─── Execution Container
             (where does the work happen)

Asset ─── Work Product
        (what's being created)

Event ─── Action Record
        (what happened)
```

**Everything else is built as a module on top of the kernel:**

```
Kernel Stable ────────────────────────────
                    ↑
    ┌───────────────┼───────────────┐
    │               │               │
Module: Documents   Module: Tasks   Module: Timeline
Module: Templates   Module: Reports Module: Integrations
```

**This design enables:**
- New modules to be added without touching kernel
- Kernel to evolve independently
- Teams to own modules without coordination
- AI coding agents to generate modules reliably

---

## Core Engineering Rules

### Rule 1: Nothing Is Built Unless Diana Can Understand It

When someone wants to add:
- CRM
- Calendar
- Accounting
- HR
- Marketplace
- Custom domain

They must also teach Diana:
- What it is (description + use cases)
- Why it exists (user outcome)
- How to use it (APIs + examples)
- When to recommend it (heuristics)
- What it produces (outputs + formats)

**This keeps the platform coherent.**

**Enforcement:** PR review checklist includes "Does Diana understand this?"

---

### Rule 2: Everything Is an API

Every capability exists in three forms:

```
Capability
    ↓
REST API (machine-friendly)
    ↓
SDK / Library (developer-friendly)
    ↓
Diana Tool (AI-friendly)
```

**Example: Create Workspace**

```
REST API:
POST /workspaces
{
  "name": "Q3 Planning",
  "missionId": "m123",
  "config": {...}
}

SDK:
workspace = await client.workspaces.create({
  name: "Q3 Planning",
  missionId: "m123",
  config: {...}
})

Diana Tool:
Tool: CreateWorkspace
  - Input: name, missionId, config
  - Output: workspace object
  - When to use: "User needs a new execution space"
```

**Benefits:**
- No hidden functionality
- AI can use every feature
- Developers can choose interface (REST, SDK, Diana)
- Everything is discoverable

**Enforcement:** PR review includes "Does this have REST API + SDK + Diana tool?"

---

### Rule 3: No Monolithic Services

As the platform grows, services may split.

But they must follow the contract pattern:

```
Before: MonolithicService
  - God object with 50+ methods
  - No clear boundaries
  - Fragile dependencies

After: Modular Services
  - IdentityService (authentication only)
  - StorageService (file handling only)
  - Each service has clear responsibility
  - Services communicate via defined APIs
```

**Enforcement:** New services must define:
- Responsibility (one thing only)
- Input contracts (what does it accept?)
- Output contracts (what does it return?)
- Dependencies (what other services does it call?)

---

## The Layer Contracts

Layers communicate only through defined contracts.

### Contract: Layer 5 → Layer 4 (Experience → Diana)

**What Layer 5 Can Call:**
```
POST /diana/chat/message
{
  "workspaceId": "w123",
  "userId": "u456",
  "message": "Create a roadmap",
  "context": {...}
}

Response:
{
  "response": "Here's your roadmap...",
  "reasoning": {...},
  "nextActions": [...]
}
```

**What Layer 5 Cannot Do:**
- Cannot access Diana's internal memory directly
- Cannot modify reasoning algorithms
- Cannot bypass trust records

**Contract Enforcement:** API versioning + strict schema validation

---

### Contract: Layer 4 → Layer 3 (Diana → Mission)

**What Layer 4 Can Call:**
```
GET /missions/:id/context
GET /workspaces/:id/progress
POST /tasks/create
GET /timeline/:workspaceId
```

**What Layer 4 Cannot Do:**
- Cannot directly modify database
- Cannot access other users' missions
- Cannot bypass permission checks

**Contract Enforcement:** Authorization middleware + audit logging

---

### Contract: Layer 3 → Layer 2 (Mission → Platform)

**What Layer 3 Can Call:**
```
GET /platform/identity/users/:id
POST /platform/events/log
GET /platform/storage/documents/:id
POST /platform/search/query
```

**What Layer 3 Cannot Do:**
- Cannot bypass event logging
- Cannot modify core identity data
- Cannot access raw database

**Contract Enforcement:** API gateway + request validation

---

### Contract: Layer 2 → Layer 1 (Platform → Infrastructure)

**What Layer 2 Can Call:**
```
Database queries (via Prisma ORM)
Cache operations (via Redis client)
File operations (via cloud storage)
```

**What Layer 2 Cannot Do:**
- Cannot make raw SQL queries (use ORM)
- Cannot access infrastructure config
- Cannot bypass security middleware

**Contract Enforcement:** Strict ORM usage + infrastructure access control

---

## Architecture Scalability Path

### Phase 1 (Now - Week 6)
- Single monolithic NestJS service
- Layer 5: Web UI only
- Layers organized logically (not physically separated)

```
monolithic-api/
├── Layer 5: controllers/ (UI routes)
├── Layer 4: diana/ (reasoning)
├── Layer 3: missions/ (business logic)
├── Layer 2: platform/ (services)
└── Layer 1: (database config)
```

### Phase 2 (Weeks 7-12)
- Services physically separated by directory
- Each layer has clear boundaries
- Internal APIs defined between layers

```
monolithic-api/
├── layers/
│   ├── 5-experience/
│   ├── 4-diana/
│   ├── 3-mission/
│   ├── 2-platform/
│   └── 1-infrastructure/
├── contracts/ (layer boundaries)
└── shared/ (utilities)
```

### Phase 3 (Months 6-12)
- Independent services (if scaling demands)
- Each service maps to one layer
- Services communicate via HTTP + events

```
api-infrastructure/
api-platform/
api-mission/
api-diana/
web-app/ (Experience)
```

**Key: Contract remains the same. Implementation can change.**

---

## The Six Permanent Teams

Whether you have 1 engineer or 100, the ownership model stays the same.

| Team | Responsibility | Examples |
|------|-----------------|----------|
| **Core Platform** | Layers 1-2: Infrastructure, Identity, Events, Storage | Database optimization, security patches, monitoring |
| **Diana Intelligence** | Layer 4: AI, reasoning, memory, learning | New capabilities, model improvements, Diana tools |
| **Workspace** | Layer 3: Missions, goals, progress, workspaces | Mission lifecycle, workspace provisioning, timeline |
| **Experience** | Layer 5: Web, mobile, AIOS, voice | UI/UX, web app features, mobile app (future) |
| **Ecosystem** | Marketplace, SDK, integrations, payments | Developer relations, third-party apps, API docs |
| **Trust & Quality** | Testing, security, observability, compliance | Automated testing, security audits, performance |

**How This Works:**
- Each team owns one or more layers
- Teams communicate through defined contracts
- Pull requests are reviewed by team owners
- Weekly sync ensures cross-team coordination

**Example Scenario (Week 3):**

Feature: "Diana generates documents"

| Team | Responsibility |
|------|-----------------|
| **Diana Intelligence** | Build DocumentGenerationEngine (Layer 4) |
| **Workspace** | Add Document model + DocumentService (Layer 3) |
| **Core Platform** | Optimize storage for large files (Layer 2) |
| **Experience** | Build document editor UI (Layer 5) |
| **Trust & Quality** | E2E testing + performance testing |

Each team works independently. Contract ensures they integrate.

---

## API Version Strategy

**Version Everything:**

```
v1 (Stable)
├── /api/v1/missions (current)
├── /api/v1/workspaces
├── /api/v1/tasks

v2 (Evolving)
├── /api/v2/missions (new structure)
├── /api/v2/workspaces (new fields)
├── /api/v2/tasks (new behavior)

Deprecated
├── /api/v0/* (sunsetted)
```

**Deprecation Policy:**
- New version ships
- Old version supported for 6 months
- Deprecation notice in headers + docs
- After 6 months: remove old version

**This allows:**
- Clients to upgrade at their own pace
- Multiple versions live simultaneously
- Breaking changes without breaking clients

---

## The Architecture Scorecard

Every quarter, evaluate:

| Metric | Target | Check |
|--------|--------|-------|
| **Layer Coupling** | <3% cross-layer dependencies | Weekly PR review |
| **API Contract Compliance** | 100% | Linting + tests |
| **Diana Coverage** | >80% of features have Diana tools | Feature checklist |
| **Service Independence** | Each team can deploy independently | CI/CD config |
| **Code Clarity** | New engineer understands any service in <1 hour | Onboarding test |
| **Test Coverage** | >85% overall | CI/CD reporting |
| **Performance** | P95 API latency <100ms | Monitoring dashboard |
| **Observability** | 100% of actions loggable | Audit trail requirement |

---

## Architecture Decision Making

When facing a decision:

**Step 1: Which layer does this belong to?**
- If uncertain, belongs to lower layer

**Step 2: Does this follow the three rules?**
- Diana can understand it?
- Everything is an API?
- Service has single responsibility?

**Step 3: What does the contract require?**
- Does it violate layer boundaries?
- Does it break existing APIs?
- Does it require new contracts?

**Step 4: If uncertain, defer to lower layer**
- Prefer Layer 2 over Layer 3
- Prefer Layer 3 over Layer 4
- Lower layers are more stable

**Example (Product Request: "Add calendar integration")**

```
Q: Which layer?
A: Could be Layer 3 (Mission calendar) or Layer 4 (Diana scheduling)
   → Defer to Layer 3 (Mission owns workflow)

Q: What's the contract?
A: Layer 4 needs: GET /missions/:id/calendar, GET /workspaces/:id/calendar

Q: Does Diana understand it?
A: Yes, Diana tool: "ScheduleCalendarEvent"
   Input: mission, event, date
   Output: calendar_entry

Decision: Build in Layer 3, expose via API, teach Diana
```

---

## 10-Year Principle in Architecture

**The Question:**
> "If AIGINVEST serves 1M users with 1000 developers contributing, would we still be happy with this architecture?"

**Applied to Common Decisions:**

**Decision: Should we use microservices now?**
- No. Microservices complexity doesn't pay off until 50+ developers.
- Better: Well-organized monolith that can split later.
- ✅ Passes 10-year test (can evolve to microservices if needed)

**Decision: Should we hardcode Diana's capabilities?**
- No. Diana's capabilities will change completely.
- Better: Diana tools are configurable and extensible.
- ✅ Passes 10-year test (Diana learns, doesn't change codebase)

**Decision: Should we use PostgreSQL?**
- Yes. Battle-tested, consistent, proven at 1M+ scale.
- ✅ Passes 10-year test (will still work at massive scale)

**Decision: Should we make every service independently deployable?**
- Not yet. Coordination overhead outweighs benefits with small team.
- Better: Single deployment, organize by layer.
- ✅ Passes 10-year test (can split into independent services later without rewriting)

---

## Reference Architecture: The Constitution

Every pull request must answer:

1. **Which domain does this belong to?** (Layer + team)
2. **Which layer does it affect?** (Which of the 5 layers?)
3. **Does it follow the three rules?** (Diana, API, single responsibility)
4. **How does Diana understand it?** (Explicit Diana tool?)
5. **Does it respect layer boundaries?** (No cross-layer leaps?)
6. **What's the contract?** (APIs, inputs, outputs)
7. **How is it tested?** (Unit, integration, E2E coverage)
8. **How is it observed?** (Logging, metrics, monitoring)
9. **How is it secured?** (Auth, permissions, audit trail)
10. **10-year principle: Still happy in 10 years?** (Reversible? Scalable?)

If all 10 questions are answered with "yes" or clear reasoning, the PR is ready to merge.

---

## Summary: The Three Promises

### Promise 1: Stability
The five-layer architecture remains true for a decade.

Implementations change. Layers don't.

### Promise 2: Scalability
What works today with 3 engineers works with 100.

Teams own layers, not individual features.

### Promise 3: Extensibility
Every capability is an API.

Nothing is locked into AIGINVEST alone.

---

**This architecture is LOCKED.**

It governs all engineering decisions.

Changes to ARA require CTO approval + documented reasoning.

When in doubt, ask: "Does this belong in this layer? Does it violate the three rules? Would we still be happy in 10 years?"

---

**Effective Date:** July 7, 2026  
**Maintained By:** Architecture Council  
**Next Review:** October 7, 2026

**"Build the best platform, not the biggest feature."**
