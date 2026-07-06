# EPIC-001: Intelligent Workspace

**Type:** Epic  
**Status:** In Progress  
**Milestone:** Alpha 0.2 – Real Diana  
**Priority:** P0 — Foundation Everything Else Stands On  

---

## The One Architectural Decision That Changes Everything

Make **Workspace** the primary domain object.

### Before (Projects-first)
```
User
├── Conversations  (loose)
├── Projects       (loose)
├── Documents      (attached to project or user)
└── DianaMemory    (attached to user)
```

Problems: No coherent container. Diana has no sense of "context" per engagement. 
Projects float without ownership boundary. Scaling to teams or AIOS is painful.

### After (Workspace-first)
```
Organization
├── Users
└── Workspaces
    ├── Projects
    ├── Documents
    ├── Tasks
    ├── Conversations
    ├── Memory
    └── Files
```

Benefits:
- Clean, scalable hierarchy from day one
- Diana has clear context per workspace
- AIOS gets workspace as native unit
- Teams share workspace without reinventing permissions
- Marketplace apps plug into workspaces
- Enterprise orgs manage workspace portfolio

---

## Epic Objective

A new user says:

> "I want to build an AI company."

Within 30 seconds they have:

- ✅ A named workspace ("AI Company")
- ✅ A project with initial structure
- ✅ A welcome document
- ✅ Four starter tasks
- ✅ Active conversation memory
- ✅ Diana continues the conversation naturally

**Zero manual setup. Zero empty screens.**

---

## Stories

| Issue | Title | Sprint | Hours |
|-------|-------|--------|-------|
| AIG-201 | Workspace Entity and API | Sprint 2 | 4h |
| AIG-202 | Workspace Orchestrator | Sprint 2 | 4h |
| AIG-203 | Mission Classifier | Sprint 3 | 4h |
| AIG-204 | Startup Mission Template | Sprint 3 | 4h |
| AIG-205 | Workspace Dashboard | Sprint 4 | 6h |
| AIG-206 | Diana Workspace Integration | Sprint 4 | 4h |

Total: ~26 developer-hours across 3 sprints

---

## AIG-201: Workspace Entity and API

**Goal:** Workspace exists as a first-class database entity. Every object belongs to a workspace.

### Schema Changes

```prisma
model Workspace {
  id          String   @id @default(cuid())
  ownerId     String
  title       String
  description String?  @db.Text
  goal        String?  @db.Text   // Original user goal that created this workspace
  type        String   @default("general")  // 'startup' | 'software' | 'personal' | 'learning' | 'general'
  status      String   @default("active")   // 'active' | 'archived'
  color       String   @default("blue")
  emoji       String   @default("🚀")

  // Relations
  owner         User           @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  projects      Project[]
  documents     Document[]
  conversations Conversation[]
  memories      DianaMemory[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  @@index([ownerId])
  @@map("workspaces")
}
```

**Existing model updates** (add `workspaceId` as optional first, then enforce):
- `Project.workspaceId String?`
- `Document.workspaceId String?`
- `Conversation.workspaceId String?`
- `DianaMemory.workspaceId String?`

### API Endpoints

```
POST   /api/workspaces           → Create workspace
GET    /api/workspaces           → List user's workspaces
GET    /api/workspaces/:id       → Get workspace with all children
PATCH  /api/workspaces/:id       → Update workspace metadata
DELETE /api/workspaces/:id       → Archive workspace
```

### Acceptance Criteria
- [ ] Workspace model in Prisma schema
- [ ] Migration applied cleanly
- [ ] CRUD endpoints working
- [ ] Auth guard on all routes
- [ ] Existing data unaffected (workspaceId is nullable)
- [ ] Unit tests for WorkspaceService (5 tests)
- [ ] API integration test passes

---

## AIG-202: Workspace Orchestrator

**Goal:** One service call creates a complete workspace from a user goal.

### Service: WorkspaceOrchestrator

```typescript
// Single entry point for workspace creation
orchestrator.createFromGoal(userId, goal) → WorkspaceBundle

// WorkspaceBundle:
{
  workspaceId: string
  projectId:   string
  documentId:  string   // Welcome/README doc
  tasks:       Task[]   // 4 initial tasks
  memoryId:    string
  duration:    number   // ms — must be < 2000
}
```

### Orchestration Flow

```
createFromGoal(userId, goal)
  │
  ├─ 1. Classify goal → mission type (startup/software/personal/etc.)
  ├─ 2. Create Workspace (title extracted from goal)
  ├─ 3. Create Project (same name as workspace)
  ├─ 4. Create Welcome Document (from template)
  ├─ 5. Create 4 Starter Tasks (from template)
  ├─ 6. Store DianaMemory (goal + workspace context)
  └─ 7. Return WorkspaceBundle
```

All steps run sequentially. If step 3+ fails, workspace is still created
but bundle is partial (never throw, always return what was created).

### Acceptance Criteria
- [ ] createFromGoal() returns full WorkspaceBundle in < 2000ms
- [ ] All 6 sub-steps complete successfully
- [ ] Partial failure handled gracefully (returns what was created)
- [ ] Integration test: full flow from goal string to WorkspaceBundle
- [ ] Performance test: 10 concurrent creations stay under 3s each

---

## AIG-203: Mission Classifier

**Goal:** Given a natural language goal, classify the workspace type and select the right template.

### Input / Output

```typescript
classify("I want to build an AI startup")
→ { type: 'startup', confidence: 0.92, title: 'AI Startup' }

classify("Help me learn Rust")
→ { type: 'learning', confidence: 0.88, title: 'Learning Rust' }

classify("Plan my product roadmap")
→ { type: 'software', confidence: 0.85, title: 'Product Roadmap' }
```

### Implementation: Rule-Based v1 (No LLM required)

Phase 1 uses keyword/pattern matching — fast, free, deterministic:

```typescript
const MISSION_PATTERNS = {
  startup:  ['build', 'start', 'launch', 'company', 'startup', 'business', 'found'],
  software: ['app', 'software', 'code', 'develop', 'api', 'project', 'system', 'build'],
  personal: ['personal', 'journal', 'habits', 'goals', 'life', 'health', 'fitness'],
  learning: ['learn', 'study', 'course', 'understand', 'practice', 'master'],
}
```

Phase 2 (after AIG-202 Real AI Provider): Use LLM for better classification.

### Acceptance Criteria
- [ ] Classifies 5 mission types correctly
- [ ] Returns title extracted from goal
- [ ] Confidence score included
- [ ] Falls back to 'general' when unclear
- [ ] Unit tests: 10 test cases across all types

---

## AIG-204: Startup Mission Template

**Goal:** Workspace type `startup` gets a meaningful pre-populated template.

### Template Contents

**Project:** "[Company Name]"

**Documents:**
1. `Business Vision` — Purpose, mission, value proposition
2. `Market Research` — Competitors, target market, positioning
3. `Product Roadmap` — Phases, features, priorities
4. `Financial Model` — Revenue model, costs, projections placeholder

**Tasks:**
1. Define your vision and mission statement
2. Identify your target customer
3. Research 3 competitors
4. Prototype your core feature

**Diana Memory:**
```
workspace_goal: "Build an AI startup"
workspace_type: "startup"
workspace_focus: "early-stage company building"
```

### Acceptance Criteria
- [ ] Template applied correctly for `type: 'startup'`
- [ ] All 4 documents created with placeholder content
- [ ] 4 tasks created with correct priority
- [ ] Memory stored with workspace context
- [ ] Content renders correctly in document view

---

## AIG-205: Workspace Dashboard

**Goal:** User can see and navigate their workspace visually.

### Route: `/workspace/[id]`

**Layout:**
```
┌─ Workspace Header (title, goal, emoji) ──────────────────┐
├─ Quick Actions Bar ──────────────────────────────────────┤
├─────────────────┬───────────────────┬────────────────────┤
│ Projects        │ Documents         │ Tasks              │
│ ─────────────── │ ───────────────── │ ───────────────── │
│ • AI Company    │ • Business Vision │ □ Define vision    │
│   + New Project │ • Market Research │ □ Identify customer│
│                 │ + New Document    │ □ Research comps.  │
│                 │                   │ □ Prototype feature│
│                 │                   │ + New Task         │
└─────────────────┴───────────────────┴────────────────────┘
│ Ask Diana (inline chat) ─────────────────────────────────│
└──────────────────────────────────────────────────────────┘
```

### Acceptance Criteria
- [ ] Dashboard loads in < 1 second
- [ ] Projects, Documents, Tasks all visible
- [ ] Create new item in each column
- [ ] "Ask Diana" inline chat opens
- [ ] Breadcrumb navigation (Home > Workspace > ...)
- [ ] Mobile responsive

---

## AIG-206: Diana Workspace Integration

**Goal:** Diana is aware of the current workspace and uses it in every response.

### Context Injection

When user is inside a workspace, Diana's system prompt includes:

```
You are Diana, working inside the workspace: "{workspace.title}"
Goal: "{workspace.goal}"
Active Project: "{project.name}"
Recent tasks: [list]
Recent documents: [list]

Use this context to provide relevant, specific guidance.
```

### Chat → Workspace Actions

During conversation, Diana can:

1. **Create a task** — detects "I need to..." or "add task: ..."
2. **Create a document** — detects "write a ...", "create a plan for..."
3. **Update workspace title** — detects name changes
4. **Reference existing docs** — "Here's your Business Vision doc..."

### Acceptance Criteria
- [ ] System prompt includes workspace context
- [ ] Diana references workspace name in responses
- [ ] Task creation from chat works
- [ ] Document creation from chat works
- [ ] Memory updated when new context is shared
- [ ] "Open Workspace" button appears after creation

---

## Data Architecture (Final)

```
Organization (future)
└── User
    └── Workspace (PRIMARY ENTITY)
        ├── type: startup | software | personal | learning | general
        ├── goal: original user intent
        │
        ├── Project[]
        │   └── ProjectTask[]
        │
        ├── Document[]
        │
        ├── Conversation[]
        │   └── Message[]
        │
        └── DianaMemory[]
```

### Why This Hierarchy

1. **Organization** (future Phase 3) — teams and billing
2. **User** — individual identity
3. **Workspace** — the "engagement" container (one per goal/project/area)
4. **Project** — execution container within workspace
5. **Document/Task/Conversation** — artifacts belonging to workspace or project

---

## Diana's Cognitive Architecture

Diana is not one service — she is composed of independent modules:

```
                    DIANA
              ┌─────────────┐
              │ Orchestrator│
              └──────┬──────┘
         ┌────────────┼────────────┐
    ┌────┴────┐  ┌────┴────┐  ┌───┴─────┐
    │ Memory  │  │ Context │  │AI Router│
    │ Service │  │ Engine  │  │         │
    └────┬────┘  └────┬────┘  └───┬─────┘
         │             │           │
    DianaMemory   Workspace    ┌───┴────────────┐
    extraction    + History    │  GPT-4o        │
    + recall      injection    │  Claude 3.5    │
                               │  Ollama (local)│
                               └────────────────┘
```

The **AI Router** selects provider per request type:
- General conversation → GPT-4o
- Long reasoning / analysis → Claude
- Private / offline → Ollama
- Cost-sensitive bulk → configurable

Applications never call providers directly. Always through Diana.

---

## Version 1.0 Completion Criteria

EPIC-001 is done when a new user can:

1. ✅ Register and log in
2. ✅ Tell Diana one goal in natural language
3. ✅ Receive a complete, organized workspace in < 30 seconds
4. ✅ See a dashboard with projects, documents, tasks
5. ✅ Ask Diana follow-up questions in workspace context
6. ✅ Have Diana remember context across sessions

---

## Links

- Architecture: [NORTH_STAR_ONE_MASTER_ARCHITECTURE.md](NORTH_STAR_ONE_MASTER_ARCHITECTURE.md)
- Sprint tickets: [SPRINT_1_2_DETAILED_BOARD.md](SPRINT_1_2_DETAILED_BOARD.md)
- Platform repo: `aig-platform`
- Product repo: `aig-product`
