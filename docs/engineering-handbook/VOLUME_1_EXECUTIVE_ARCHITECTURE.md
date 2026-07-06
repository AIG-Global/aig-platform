# AIGINVEST Engineering Handbook
## Volume 1: Executive Architecture

**Volume:** 1 of 15  
**Pages:** 30 (estimated)  
**Audience:** All engineers, architects, product managers  
**Last Updated:** July 7, 2026  
**Status:** 🟢 Complete & Locked  

---

## Table of Contents

1. The Defining Vision
2. Ten-Year Principle
3. Five-Layer Architecture
4. The AIGINVEST Kernel
5. The Three Engineering Rules
6. Design Principles
7. Layer Contracts
8. Bounded Contexts
9. Key Decisions
10. The Commitment

---

## 1. The Defining Vision

### What We're Building

> **AIGINVEST is the operating system for human progress.**
>
> Not an AI assistant. Not a productivity platform.
>
> A system that turns intentions into outcomes.

### The Intent → Progress Formula

Every feature we build improves one of these six stages:

```
Intent → Understanding → Planning → Execution → Learning → Progress
```

**Nothing ships that doesn't improve one stage.**

### The Promise to Users

We promise that if you:
- Tell us your goal
- We'll help you plan the work
- You'll track progress
- You'll achieve it

And we promise:
- Every decision Diana makes is explainable
- Your data is yours
- You're always in control
- The system works for you, not against you

---

## 2. Ten-Year Principle

AIGINVEST is designed to be true for a decade.

### What "Stable for a Decade" Means

1. **The 5-layer architecture** won't change
   - Infrastructure stays Infrastructure
   - Platform stays Platform
   - Mission stays Mission
   - Diana stays Diana
   - Experience stays Experience

2. **The kernel concepts** won't change
   - Person, Organization, Goal, Mission, Workspace, Asset, Event
   - These are permanent

3. **The contracts between layers** won't change
   - Layers talk through documented APIs
   - APIs are versioned
   - Old versions supported minimum 3 years

4. **The three engineering rules** are permanent
   - Diana must understand it
   - Everything is an API
   - Single responsibility

### What Can Change

- Implementation details (technology choices)
- Database indexes and optimization
- Internal service architecture
- UI/UX within layer constraints
- Non-core features

### Why This Matters

If the architecture changes every 6 months:
- New engineers waste months learning new structure
- Code organization becomes chaotic
- Onboarding AI agents becomes harder
- Technical debt accumulates

If the architecture is stable for 10 years:
- New engineers learn once
- Code stays organized
- 100 engineers can work independently
- Platform scales sustainably

---

## 3. Five-Layer Architecture

AIGINVEST is organized into five permanent layers.

### Layer 1: Infrastructure

**Purpose:** Where it lives  
**Responsibility:** Reliability, scalability, observability

**Components:**
- PostgreSQL (primary datastore)
- Redis (caching, sessions)
- Object Storage (documents, media)
- Kubernetes (container orchestration)
- Monitoring (Prometheus, Grafana, OpenTelemetry)
- CI/CD (GitHub Actions)

**Example Service:** Infrastructure team owns the database schema, backup strategy, monitoring dashboards

**Contract:** Provides reliable data storage and compute resources. Nothing else.

**Success Metric:** 99.95% uptime, <1s p99 latency, zero data loss

---

### Layer 2: Platform

**Purpose:** How it works  
**Responsibility:** Core services all apps depend on

**Services:**
- Identity (authentication, authorization, permissions)
- Search (full-text + semantic)
- Storage (file versioning, access control)
- Events (audit trail, event sourcing foundation)
- Payments (monetization, billing)
- Security (encryption, secrets, compliance)

**Example Service:** Payments service - every app uses the same service to charge users. Abstracts Stripe, Link, PayPal, etc.

**Contract:** Provides reliable, auditable, secure primitives for higher layers

**Success Metric:** 99.99% uptime, <100ms API latency, 100% audit coverage

---

### Layer 3: Mission

**Purpose:** What we do  
**Responsibility:** Core business objects and workflows

**Services:**
- Mission Engine (CRUD, lifecycle, state machine)
- Workspace Orchestrator (auto-provisioning, defaults)
- Mission Orchestrator (coordination)
- Progress Engine (completion calculation)
- Trust Engine (audit + explainability)

**Example:** When a user creates a mission:
1. Mission Engine validates inputs
2. Workspace Orchestrator auto-creates workspace
3. Progress Engine initializes progress tracking
4. Trust Engine logs the action
5. Diana gets notified to welcome the user

**Contract:** Exposes Mission, Workspace, Task, Document, Progress objects. Everything through APIs.

**Success Metric:** >65% mission completion, <30 min onboarding, missions queryable in <100ms

---

### Layer 4: Diana

**Purpose:** How we think  
**Responsibility:** All reasoning, memory, AI coordination

**Services:**
- Diana Orchestrator (conversation, routing, memory)
- AI Router (model selection, provider abstraction)
- Memory (short-term, long-term, episodic)
- Planning Engine (roadmap generation)
- Tool Runner (execute capabilities from other layers)
- Context Engine (gather relevant context)
- Reasoning Engine (explainable decision-making)

**Example:** User asks Diana for a roadmap:
1. Reasoning Engine gathers current mission context
2. Tool Runner queries current tasks from Mission layer
3. Memory Engine recalls historical similar missions
4. AI Router selects best model for reasoning
5. Planning Engine generates roadmap with reasoning trace
6. Trust Engine records the decision

**Contract:** Exposes Diana interface. Everything Diana does is queryable and explainable.

**Success Metric:** >90% AI success, >4.0/5.0 trust, reasoning visible for 90% of decisions

---

### Layer 5: Experience

**Purpose:** What users see  
**Responsibility:** User interfaces across all platforms

**Applications:**
- `apps/web` — Web dashboard (Next.js)
- `apps/mobile` — Mobile app (React Native)
- `apps/aios` — AIGINVEST OS (native)
- `apps/north-star-one` — Hardware integration
- `apps/admin` — Internal tools

**Components:**
- Login flow
- Mission dashboard
- Workspace editor
- Timeline viewer
- Settings panel
- Marketplace browser
- Diana chat interface

**Contract:** Consumes APIs from layers 2-4. No business logic in Experience layer.

**Success Metric:** <1s page load, >75% weekly return, NPS >50

---

## 4. The AIGINVEST Kernel

Seven core concepts that never change.

### Concept 1: Person

**What:** Individual user  
**Owned By:** Identity service (Layer 2)  
**Attributes:**
- id
- email
- displayName
- permissions (list of capabilities)
- metadata (preferences, settings)

**Invariant:** Every action in the system is attributed to a Person

---

### Concept 2: Organization

**What:** Workspace owner  
**Owned By:** Identity service (Layer 2)  
**Attributes:**
- id
- name
- members (list of Persons)
- billing info
- settings

**Invariant:** Organizations are isolated (multi-tenancy boundary)

---

### Concept 3: Goal

**What:** Desired outcome  
**Owned By:** Mission service (Layer 3)  
**Attributes:**
- id
- owner (Person)
- organization (Organization)
- title
- description
- successCriteria
- deadline
- status (active, achieved, abandoned)

**Invariant:** Goals can become Missions

---

### Concept 4: Mission

**What:** Execution frame for a goal  
**Owned By:** Mission service (Layer 3)  
**Attributes:**
- id
- goal (references Goal)
- workspace (auto-created, 1:1 relationship)
- title
- objective
- status (planning, active, paused, completed, archived)
- priority
- deadline
- progress (calculated)

**Invariant:** Every mission has exactly one workspace. One workspace per mission.

---

### Concept 5: Workspace

**What:** Execution container  
**Owned By:** Workspace service (Layer 3)  
**Attributes:**
- id
- mission (1:1 with Mission)
- organization (Organization)
- projects (list of Projects)
- documents (list of Documents)
- tasks (list of Tasks)
- timeline (list of Events)

**Invariant:** Workspaces are isolated. Users see only workspaces they have permissions for.

---

### Concept 6: Asset

**What:** Work product (document, artifact, output)  
**Owned By:** Workspace service (Layer 3)  
**Attributes:**
- id
- type (plan, research, output, template)
- workspace (Workspace)
- creator (Person)
- title
- content
- versions (list of past versions)
- metadata

**Invariant:** Every asset is versioned. No deletions, only archiving.

---

### Concept 7: Event

**What:** Action record  
**Owned By:** Events service (Layer 2)  
**Attributes:**
- id
- timestamp
- actor (Person)
- action (string: "mission.created", "task.completed", etc.)
- resource (what was affected)
- resourceId
- changes (what changed)
- reason (why Diana did this)
- result (success/failure)
- metadata

**Invariant:** Events are immutable. Complete audit trail of every action.

---

## 5. The Three Engineering Rules

These rules apply to all code in all layers.

### Rule 1: Diana Must Understand It

**Definition:** Every feature, API, object, and workflow must be understandable by Diana.

**What This Means:**
- Diana can query it
- Diana can invoke it
- Diana can explain it to users
- Diana can suggest when to use it

**Why:** Diana becomes more powerful as more of the system is available to her. If features hide from Diana, the platform becomes fragmented.

**Example:**
```
✅ Good: Add task() → Diana can see task created, can suggest next step
❌ Bad: Internal optimization → Diana can't see it, can't explain it
```

**Enforcement:** Every API must include `dianaCapability` field describing how Diana uses it.

---

### Rule 2: Everything Is an API

**Definition:** All communication between layers is through documented APIs.

**What This Means:**
- No direct database access across layers
- No cross-layer function calls
- No shared internal libraries between layers
- Everything goes through REST/GraphQL/Events

**Why:**
- Layers can evolve independently
- Easy to replace implementations
- Clear contracts
- Testable in isolation
- Scalable to multiple services

**Example:**
```
✅ Good: Experience → API call → Mission Service → Database
❌ Bad: Experience → Direct database query
```

**Enforcement:** Code review will block cross-layer imports.

---

### Rule 3: Single Responsibility

**Definition:** Each service owns one domain. No service does two things.

**What This Means:**
- Identity service does identity only
- Payments service does payments only
- Mission service does missions only
- If it's two things, it's two services

**Why:**
- Clear ownership
- Easy testing
- Easy scaling
- Easy to reason about
- Easy to onboard new engineers

**Example:**
```
✅ Good: PaymentService handles all billing/payments
❌ Bad: MissionService handles both missions and billing
```

**Enforcement:** Code review will challenge services that do more than one thing.

---

## 6. Design Principles

Five principles guide all architectural decisions.

### Principle 1: Outcome-Centric

Don't measure activity. Measure outcomes.

**Not:** "Users created 50 documents"  
**But:** "Users achieved goals 30% faster"

**Implication:** Every metric, every dashboard, every alert is about user progress.

---

### Principle 2: Transparency-First

Every AI action is explainable.

**Not:** "Diana suggests you do X"  
**But:** "Diana suggests you do X because [reasoning visible]"

**Implication:** Trust Engine logs reason for every action. Timeline shows reasoning.

---

### Principle 3: Human-First, AI-Second

Humans own intentions. AI handles reasoning and execution.

**Not:** "AI decides your next step"  
**But:** "AI suggests next step. You decide."

**Implication:** Diana recommends but doesn't command. Users always have agency.

---

### Principle 4: Scalability-Through-Independence

Teams work independently on independent layers.

**Not:** "We need to coordinate with 10 teams to ship this"  
**But:** "One team can own this, test it, ship it"

**Implication:** 100 engineers can work simultaneously with minimal coordination.

---

### Principle 5: Evolution-Through-Contracts

Old versions coexist with new versions during transition.

**Not:** "We're rewriting everything from scratch"  
**But:** "v1 and v2 APIs coexist for 6 months during transition"

**Implication:** Backward compatibility is mandatory. Breaking changes require migration plan.

---

## 7. Layer Contracts

Each layer has a contract with the layers above and below.

### Infrastructure ↔ Platform Contract

**Platform expects from Infrastructure:**
- Reliable data storage (99.95% SLA)
- <100ms query latency (p99)
- Transactional consistency
- Point-in-time backups

**Infrastructure expects from Platform:**
- Database schema migrations approved by DBA
- Indexes defined upfront
- Query plans reviewed for efficiency
- Connection pooling configured

---

### Platform ↔ Mission Contract

**Mission expects from Platform:**
- Authentication/authorization enforcement
- Immutable audit trail (Events service)
- File versioning and storage
- Payment processing and billing

**Platform expects from Mission:**
- Mission objects are queryable
- Progress is calculable
- Events are published for audit
- Diana can reason about missions

---

### Mission ↔ Diana Contract

**Diana expects from Mission:**
- Current state queryable (mission status, progress, tasks)
- Recommendations queryable (next steps, risks, wins)
- Workspace context available
- Historical context available

**Mission expects from Diana:**
- Diana suggests next steps
- Diana recommends optimizations
- Diana identifies risks
- Diana provides team guidance

---

### Diana ↔ Experience Contract

**Experience expects from Diana:**
- Greeting messages (personalized)
- Recommendations (context-aware)
- Explanations (for any action)
- Help (on any topic)

**Diana expects from Experience:**
- User context (who, where, what mission)
- Action context (what just happened)
- User permissions (what can the user do)
- User history (what has the user done)

---

## 8. Bounded Contexts

Each domain is a bounded context with clear ownership.

### Identity Context
- Owns: Authentication, Authorization, Permissions
- Boundary: Identity service in Layer 2
- Owned By: VP of Infrastructure

### Mission Context
- Owns: Goals, Missions, Lifecycle, Progress
- Boundary: Mission services in Layer 3
- Owned By: VP of Engineering

### Workspace Context
- Owns: Documents, Assets, Knowledge, Timeline
- Boundary: Workspace services in Layer 3
- Owned By: VP of Engineering

### Diana Context
- Owns: Reasoning, Memory, Planning, Tools
- Boundary: Diana services in Layer 4
- Owned By: VP of AI

### Experience Context
- Owns: Web UI, Mobile UI, AIOS, Design System
- Boundary: Apps in Layer 5
- Owned By: VP of Product

---

## 9. Key Decisions

### Decision 1: Multi-Tenant from the Start

**What:** Every organization is isolated. User data never mixes.

**Rationale:**
- Security
- Compliance (GDPR, etc.)
- Scaling
- Enterprise requirements

**Implication:** Every query has organization_id filter. Database enforces isolation.

---

### Decision 2: Event Sourcing Foundation

**What:** Every action creates an event. Complete audit trail.

**Rationale:**
- Trust (users see why Diana did things)
- Debugging (replay to understand state)
- Analytics (understand user behavior)
- Compliance (legal requirements)

**Implication:** Events are immutable. No deletes, only archive flags.

---

### Decision 3: One Mission, One Workspace

**What:** Mission and Workspace are 1:1. Auto-created together.

**Rationale:**
- Isolation (one mission's work doesn't contaminate another)
- Clarity (workspace = mission execution space)
- Simplicity (no workspace-sharing complexity yet)

**Implication:** Can upgrade to workspace-sharing later if needed.

---

### Decision 4: API-First Design

**What:** Every service exposes APIs. No internal databases exposed.

**Rationale:**
- Testability
- Scalability
- Independence
- Clear contracts

**Implication:** All communication is through documented APIs.

---

### Decision 5: Diana as First-Class Citizen

**What:** Diana is built into platform, not bolted on.

**Rationale:**
- Users need guidance
- Diana reduces friction
- Competitive advantage
- Foundation for future AI features

**Implication:** Every feature asks "How will Diana use this?"

---

## 10. The Commitment

### We Commit To:

✅ **Stability**
- 5-layer architecture is permanent
- Kernel concepts are permanent
- Three rules are permanent
- Core APIs are versioned and backward-compatible

✅ **Clarity**
- Every layer has clear purpose
- Every service has clear responsibility
- Every API has clear contract
- Architecture documentation is current

✅ **Scalability**
- Independent teams on independent layers
- 100 engineers without constant coordination
- Services can scale independently
- Platform can grow to millions of users

✅ **Testability**
- Each layer testable in isolation
- Services have clear contracts
- Integration tests between layers
- End-to-end workflows tested

✅ **Extensibility**
- Everything is an API
- New features don't break existing APIs
- New services fit into the architecture
- Marketplace enables third-party extensions

### We Don't Commit To:

❌ Perfection (we'll fix bugs)  
❌ Feature completeness (we'll add features)  
❌ Performance perfection (we'll optimize)  
❌ Zero downtime (we'll do our best)  

But the architecture will be stable for a decade.

---

## How to Use This Volume

### When Making an Architecture Decision
→ Check if it fits the 5-layer model  
→ Check if it follows the 3 rules  
→ Check if it respects layer contracts  

### When Designing a New Service
→ Identify which layer it belongs to  
→ Define its bounded context  
→ Document its contract with adjacent layers  

### When Onboarding a New Engineer
→ Start here (20 min read)  
→ Then read the relevant domain volume  

### When Code Review Comments Seem Arbitrary
→ Find the principle in this volume  
→ Apply it consistently  

---

## Next Volumes

- **Volume 2:** Domain Model (Person, Mission, Workspace, etc.)
- **Volume 3:** Platform Kernel (Identity, Events, Permissions)
- **Volume 4:** Diana Intelligence (Reasoning, Memory, Tools)
- **Volume 5:** Mission Operating System (Lifecycle, Progress, Recommendations)

---

## Questions?

If something in this volume is unclear:
- File a GitHub issue with tag `handbook`
- Tag the volume: `handbook/volume-1`
- PR to clarify the documentation

This handbook improves as the platform grows.

---

**End of Volume 1**

**Published:** July 7, 2026  
**Status:** 🟢 Complete & Locked  
**Next Review:** January 2027 (semi-annual architecture review)
