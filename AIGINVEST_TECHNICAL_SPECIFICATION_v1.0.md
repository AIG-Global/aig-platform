# AIGINVEST Technical Specification v1.0

**Status**: Active — Governs all engineering  
**Version**: 1.0  
**Date**: 2026-07-07  
**Alignment**: AIGINVEST_OPERATING_DOCTRINE.md  
**Owner**: Engineering Leadership  
**Audience**: All developers, AI agents, contributors  

---

## Executive Summary

**North Star Statement**:  
> AIGINVEST is an AI-native operating platform that organizes people, knowledge, and work around **missions** rather than applications.

**Philosophical Foundation**:  
This specification implements the four principles from the Operating Doctrine:
1. **Human First** — Every API endpoint serves a user objective
2. **AI Second** — Diana is an engine, not the center
3. **Platform Third** — Every component is reusable
4. **Ecosystem Fourth** — Every service is extensible

**Core Insight**: The Mission is the highest-level operational object. Everything else—workspaces, projects, tasks, documents, teams—is subordinate infrastructure serving mission execution.

---

## Part 1: Core Domain Model

### 1.1 The Mission Object

The Mission is the operational center of AIGINVEST. It represents a significant outcome the organization wants to achieve.

```
Mission {
  id:                  UUID
  title:               string (e.g., "Launch AIGINVEST Beta")
  description:         string (markdown)
  objective:           string (what success looks like)
  successCriteria:     SuccessCriterion[] (measurable outcomes)
  
  owner:               Person (who is accountable)
  organization:        Organization
  status:              enum (planning | active | paused | completed | archived)
  priority:            enum (critical | high | medium | low)
  
  deadline:            datetime (target completion)
  startDate:           datetime
  completedDate:       datetime (when finished)
  
  progress:            MissionProgress (see 1.7)
  
  workspaceId:         UUID (associated workspace)
  projectIds:          UUID[] (child projects)
  taskIds:             UUID[] (direct tasks)
  documentIds:         UUID[] (associated docs)
  milestoneIds:        UUID[] (planned checkpoints)
  
  timeline:            Timeline (events and history)
  memory:              DianaMemory (mission context for AI)
  aiContext:           AIContext (system prompt data)
  
  createdAt:           datetime
  updatedAt:           datetime
  createdBy:           Person
  lastModifiedBy:      Person
}
```

**Key Principle**: A Mission is NOT a container. It is a reference point. A Mission owns Projects, which own Tasks, which create Documents. But all of these can exist independently. Diana uses the Mission as context for orchestration.

### 1.2 The Goal Object

A Goal is what a Person articulates. A Mission is what an Organization commits to.

```
Goal {
  id:                  UUID
  userId:              UUID (who stated this)
  title:               string (e.g., "Build an AI SaaS company")
  description:         string
  createdAt:           datetime
  
  status:              enum (draft | proposed | accepted | transformed_to_mission)
  relatedMission:      UUID (if accepted, which mission?)
  
  feedback:            string (Diana's analysis)
  confidence:          number (0-100, how aligned is this goal with org?)
}
```

**Workflow**: Goal → (Diana analyzes) → Proposed Mission → (Leadership approves) → Mission

### 1.3 The Organization Object

```
Organization {
  id:                  UUID
  name:                string
  slug:                string (unique identifier)
  
  missions:            Mission[]
  teams:               Team[]
  members:             Person[]
  
  settings:            OrganizationSettings
  subscriptionTier:    enum (free | starter | pro | enterprise)
  
  createdAt:           datetime
  createdBy:           Person
}
```

### 1.4 The Person Object

```
Person {
  id:                  UUID
  email:               string (unique)
  name:                string
  avatar:              URL
  
  organizations:       Organization[] (which orgs are they in?)
  missions:            Mission[] (which missions do they own?)
  teams:               Team[]
  
  preferences:         UserPreferences
  dianaMemory:         DianaMemory (personal history)
  
  createdAt:           datetime
  lastLoginAt:         datetime
}
```

### 1.5 The Workspace Object

A Workspace is the operational sandbox for a Mission. It contains Projects, Tasks, Documents, and collaborative artifacts.

```
Workspace {
  id:                  UUID
  title:               string
  description:         string
  type:                enum (startup | department | product | squad | personal)
  
  missionId:           UUID (parent mission)
  organizationId:      UUID
  createdBy:           Person
  
  projects:            Project[]
  documents:           Document[]
  tasks:               Task[]
  
  members:             Person[]
  
  settings:            WorkspaceSettings
  
  createdAt:           datetime
  updatedAt:           datetime
}
```

### 1.6 The Project / Task / Document Hierarchy

```
Project {
  id:                  UUID
  missionId:           UUID (or workspaceId if independent)
  title:               string
  description:         string
  status:              enum (planning | active | paused | completed)
  priority:            enum (critical | high | medium | low)
  
  tasks:               Task[]
  owner:               Person
  
  deadline:            datetime
  progress:            number (0-100%)
  
  createdAt:           datetime
  updatedAt:           datetime
}

Task {
  id:                  UUID
  projectId:           UUID (or missionId)
  title:               string
  description:         string
  status:              enum (todo | in_progress | blocked | completed | cancelled)
  priority:            enum (critical | high | medium | low)
  
  assignee:            Person
  owner:               Person
  
  dueDate:             datetime
  completedAt:         datetime
  
  subtasks:            Task[]
  dependencies:        Task[] (which tasks must finish first?)
  
  tags:                string[]
  
  createdAt:           datetime
  completedAt:         datetime
}

Document {
  id:                  UUID
  missionId:           UUID (or workspaceId)
  title:               string
  type:                enum (constitution | plan | spec | proposal | report | other)
  
  content:             string (markdown)
  version:             number
  status:              enum (draft | review | approved | published | archived)
  
  owner:               Person
  collaborators:       Person[]
  
  createdAt:           datetime
  updatedAt:           datetime
}
```

### 1.7 Mission Progress

Progress is a first-class service, not a computed field.

```
MissionProgress {
  id:                  UUID
  missionId:           UUID
  
  percentComplete:     number (0-100, calculated from tasks)
  tasksTotal:          number
  tasksCompleted:      number
  tasksBlocked:        number
  
  milestonesReached:   number
  milestonesTotalReached: number
  
  score:               number (0-100, weighted by priority + velocity)
  trend:               enum (accelerating | stable | decelerating)
  
  updatedAt:           datetime
  lastActivityAt:      datetime
  
  estimatedCompletion: datetime
  burndownChart:       BurndownPoint[]
}

BurndownPoint {
  date:                datetime
  tasksRemaining:      number
}
```

### 1.8 The Team Object

```
Team {
  id:                  UUID
  organizationId:      UUID
  name:                string
  
  members:             Person[]
  missions:            Mission[] (which missions does this team own?)
  
  createdAt:           datetime
}
```

### 1.9 The Milestone Object

A Milestone is a planned checkpoint within a Mission.

```
Milestone {
  id:                  UUID
  missionId:           UUID
  
  title:               string (e.g., "Investor Deck Complete")
  description:         string
  
  targetDate:          datetime
  completedDate:       datetime
  
  successCriteria:     string (how do we know this is done?)
  status:              enum (planned | active | completed | missed)
  
  associatedTasks:     Task[]
  
  createdAt:           datetime
}
```

---

## Part 2: Platform Services

Platform Services are shared infrastructure that every domain object can use.

### 2.1 Identity Service

**Responsibility**: User authentication, authorization, organization membership.

**Endpoints**:
```
POST   /api/auth/register              → register new person
POST   /api/auth/login                 → get auth token
POST   /api/auth/refresh               → refresh token
POST   /api/auth/logout                → invalidate session

GET    /api/organizations              → list orgs this person belongs to
POST   /api/organizations              → create new org
POST   /api/organizations/:id/invite   → invite person to org
GET    /api/organizations/:id/members  → list team
DELETE /api/organizations/:id/members/:personId → remove member

GET    /api/teams                      → list teams this person is in
POST   /api/teams                      → create new team
POST   /api/teams/:id/members          → add person to team
```

**Implementation**: JWT tokens, scoped to organization. Claims include: userId, organizationId, teams, permissions.

### 2.2 Mission Service

**Responsibility**: Create, read, update, orchestrate Missions.

**Endpoints**:
```
POST   /api/missions                   → create mission
GET    /api/missions                   → list missions (filtered by org, team, person)
GET    /api/missions/:id               → get mission details
PUT    /api/missions/:id               → update mission
PUT    /api/missions/:id/status        → change status
DELETE /api/missions/:id               → archive mission

POST   /api/missions/:id/plan          → invoke planning engine
POST   /api/missions/:id/execute       → invoke execution engine
GET    /api/missions/:id/progress      → get mission progress
POST   /api/missions/:id/milestone     → create milestone
GET    /api/missions/:id/timeline      → get mission history

POST   /api/missions/:id/workspace     → provision workspace for this mission
```

**Implementation**: MissionController, MissionService, MissionRepository. Heavy integration with Planning Engine and Execution Engine.

### 2.3 Memory Service (DianaMemory)

**Responsibility**: Store and retrieve context for Diana. Persistent, searchable, versioned.

**Endpoints**:
```
POST   /api/memory                     → store fact
GET    /api/memory?query=...           → search memory
GET    /api/memory/person/:id          → get person's memory
GET    /api/memory/mission/:id         → get mission's memory
DELETE /api/memory/:id                 → forget a fact

POST   /api/memory/summary             → generate memory summary for prompt
```

**Data Structure**:
```
DianaMemory {
  id:                  UUID
  entityType:          enum (person | mission | organization | workspace)
  entityId:            UUID
  
  facts:               MemoryFact[]
  topics:              string[]
  timeline:            TimelineEvent[]
  
  searchVector:        Vector (for semantic search)
  
  createdAt:           datetime
  updatedAt:           datetime
}

MemoryFact {
  id:                  UUID
  category:            string (e.g., "preferences", "history", "goals")
  content:             string
  source:              string (where did we learn this?)
  confidence:          number (0-100)
  createdAt:           datetime
}
```

**Implementation**: DianaMemoryService, backed by PostgreSQL (full-text search) and optional vector DB (semantic search).

### 2.4 AI Router Service

**Responsibility**: Route requests to appropriate LLM. Handle different models, contexts, costs, and response patterns.

**Endpoints**:
```
POST   /api/ai/complete                → send prompt, get completion
POST   /api/ai/analyze-goal            → Diana analyzes a stated goal
POST   /api/ai/generate-plan           → Diana generates mission plan
POST   /api/ai/generate-tasks          → create tasks from plan
POST   /api/ai/generate-document       → create document with Diana
POST   /api/ai/recommend               → Diana recommends next actions

GET    /api/ai/context/:missionId      → build full context for this mission
GET    /api/ai/context/:personId       → build full context for this person
```

**Key Feature**: Context-aware prompting. Every AI call includes:
- Person history and preferences
- Mission state and progress
- Recent activities
- Relevant documents
- Organizational goals

**Implementation**: AIRouterService, ContextEngine, LLMProviderFactory. Support for OpenAI, Claude, local models.

### 2.5 Events Service

**Responsibility**: Emit and subscribe to events. Immutable event log.

**Events**:
```
mission.created
mission.started
mission.milestone_reached
mission.progress_updated
mission.completed
mission.paused

task.created
task.assigned
task.started
task.completed
task.blocked
task.unblocked

document.created
document.updated
document.published

workspace.created
workspace.member_added
workspace.member_removed

person.joined_organization
person.left_organization

activity.logged
```

**Endpoints**:
```
GET    /api/events?type=...&after=...  → query event log
POST   /api/events/subscribe           → WebSocket subscription to real-time events
```

**Implementation**: EventService backed by Postgres (immutable append-only table) + Redis for pub/sub (optional).

### 2.6 Activity Service

**Responsibility**: Log and retrieve activities (human-readable events).

**Endpoints**:
```
GET    /api/activity                   → list activities (filtered by date, actor, type)
GET    /api/activity/mission/:id       → timeline for a mission
GET    /api/activity/workspace/:id     → timeline for a workspace
POST   /api/activity                   → log activity (internal only)
```

**Activity Types**:
```
workspace_created
task_created
task_completed
task_assigned
document_created
document_published
mission_started
mission_completed
milestone_reached
person_joined
comment_added
```

**Implementation**: ActivityService, backed by Activity model in Prisma.

### 2.7 Progress Service

**Responsibility**: Calculate and update MissionProgress. First-class service.

**Endpoints**:
```
GET    /api/progress/mission/:id       → current progress
GET    /api/progress/person/:id        → aggregate progress across all missions
POST   /api/progress/recalculate       → force recalculation
GET    /api/progress/burndown/:id      → burndown chart data
```

**Calculation**:
```
percentComplete = (tasksCompleted / tasksTotal) * 100
score = percentComplete * priorityWeight + velocityBonus
trend = compare(score(today), score(yesterday))
estimatedCompletion = extrapolate(burndownChart)
```

**Implementation**: ProgressService, cached with invalidation on task completion.

### 2.8 Search Service

**Responsibility**: Full-text and semantic search across all objects.

**Endpoints**:
```
GET    /api/search?q=...               → search everything
GET    /api/search/missions?q=...
GET    /api/search/documents?q=...
GET    /api/search/tasks?q=...
GET    /api/search/people?q=...
```

**Implementation**: PostgreSQL full-text search + optional vector DB for semantic search.

### 2.9 Notification Service

**Responsibility**: Send notifications to people about important events.

**Channels**: Email, in-app, Slack, SMS (optional).

**Triggers**:
- Mission started
- Milestone reached
- Task assigned to you
- Task you assigned is completed
- Comment on document you own
- Daily digest of activity

**Implementation**: NotificationService with adapter pattern for channels.

### 2.10 Integration Service (SDK & Extensions)

**Responsibility**: Allow external systems to call AIGINVEST APIs and publish events.

**Concept**: AIGINVEST becomes a platform others can build on top of.

**Endpoints**:
```
POST   /api/integrations/webhooks      → register webhook
GET    /api/integrations/webhooks      → list webhooks
DELETE /api/integrations/webhooks/:id  → remove webhook

POST   /api/integrations/oauth         → OAuth flow for connected apps
```

**SDK** (JavaScript/TypeScript):
```typescript
import { AIGINVEST } from '@aiginvest/sdk';

const client = new AIGINVEST({ apiKey: '...' });

// Create a mission from external system
const mission = await client.missions.create({
  title: "Integrate with HubSpot",
  objective: "Sync customer data",
  deadline: new Date('2026-08-01')
});

// Listen to events
client.events.subscribe('task.completed', (event) => {
  console.log('Task completed:', event.task.title);
  // Send to Slack, update CRM, etc.
});
```

**Implementation**: SDKClient, WebhookHandler, OAuthProvider.

---

## Part 3: Diana Orchestration Model

### 3.1 Diana's Core Responsibilities

Diana is not a chatbot. She is an autonomous agent that:

1. **Understands Intent** — What does the person want to achieve?
2. **Plans Missions** — Breaking goals into milestones, projects, tasks
3. **Executes Work** — Creating documents, assigning tasks, moving work forward
4. **Learns Context** — Storing facts and history in memory
5. **Reports Progress** — Updating metrics and generating summaries
6. **Recommends Actions** — Proactive suggestions based on goals and context

### 3.2 The Intent → Mission Pipeline

```
Person: "I want to launch AIGINVEST publicly by September"
           ↓
Diana: "I understand. Let me create a mission for this."
           ↓
[Planning Engine]
└─ Analyze: What does public launch require?
└─ Research: What are the key milestones?
└─ Propose: Mission structure with 4 phases
           ↓
Diana: "I've created 'Launch AIGINVEST Publicly'. 
        Here are the 4 phases:
        - Phase 1: Marketing (due Aug 1)
        - Phase 2: Beta feedback (due Aug 15)
        - Phase 3: Polish (due Aug 29)
        - Phase 4: Launch day (Sept 1)
        
        Ready to begin?"
           ↓
[Execution Engine]
└─ Create workspace
└─ Generate documents (marketing brief, beta plan)
└─ Create tasks for each milestone
└─ Assign initial tasks
           ↓
Diana: "Mission active. Your next priority:
        Complete marketing brief (due Aug 1).
        I've created the document—ready when you are."
```

### 3.3 Core LLM Prompt Structure

Every Diana message is generated from a context-rich prompt:

```
System Prompt Template:

You are Diana, the intelligence layer of AIGINVEST.

## Your Role
You orchestrate missions, not just answer questions.
When someone asks for help, you help them move toward their mission goals.

## Current Context

### Person
Name: {person.name}
Current Missions: {missions.titles}
Recent Activities: {activities.recent}

### Active Mission
Title: {mission.title}
Progress: {mission.progress.percentComplete}%
Status: {mission.status}
Next Milestone: {nextMilestone.title} (due {nextMilestone.targetDate})
Blocked Tasks: {blockedTasks.count}
Completed Today: {completedToday.count}

### Memory
Recent Decisions: {dianaMemory.recentDecisions}
Known Preferences: {dianaMemory.preferences}
Past Mistakes: {dianaMemory.mistakes}

## Your Guidelines

1. Be direct. Not verbose.
2. Recommend specific next steps, not generic advice.
3. If something is blocking progress, highlight it.
4. Suggest, don't command. The person decides.
5. Track what you recommend and learn from outcomes.

## Available Actions

You can:
- Create tasks or projects
- Generate documents
- Update mission status
- Create milestones
- Suggest timeline adjustments
- Flag risks or blockers
```

### 3.4 Diana's Decision Tree

```
Input: User message or event

if (message is a goal or objective):
  → Planning Engine: Create mission proposal
  
elif (message is feedback on existing work):
  → Execute Engine: Update tasks, documents, progress
  
elif (message is a question):
  → Router: Is this about current mission? Knowledge request? Recommendation?
  
elif (event is task completed):
  → Progress Engine: Recalculate, check for milestones
  → Diana: Auto-generate summary message
  
elif (event is milestone reached):
  → Diana: Celebrate, suggest next phase
  
else:
  → Conversational: Answer naturally using context
```

---

## Part 4: Execution Engine

The Execution Engine is responsible for moving work forward autonomously.

### 4.1 Execution Engine Responsibilities

1. **Create Tasks** — From plans, recommendations, or templates
2. **Schedule Work** — Assign tasks, set deadlines, manage dependencies
3. **Generate Documents** — Auto-create specs, briefs, reports
4. **Update Progress** — Recalculate metrics as work completes
5. **Request Approvals** — When work needs sign-off
6. **Notify Stakeholders** — Keep everyone informed

### 4.2 Execution Flow

```
Execution Request
  ↓
Validate (is this aligned with mission goals?)
  ↓
Generate Tasks (break into atomic work)
  ↓
Create Documents (specs, briefs, templates)
  ↓
Assign Owners (who should do this?)
  ↓
Set Deadlines (when should this be done?)
  ↓
Emit Events (activity log, notifications)
  ↓
Report Back (Diana summarizes what was created)
```

### 4.3 Key Execution Methods

```
ExecutionEngine.createTasksForMilestone(milestone)
  → Analyzes milestone objectives
  → Creates 5-15 atomic tasks
  → Sets priority and dependencies
  → Returns tasks array

ExecutionEngine.generateDocumentForTask(task)
  → Analyzes task requirements
  → Calls LLM to generate document
  → Stores in Workspace/Mission
  → Returns document ID

ExecutionEngine.updateProgressFromEvent(event)
  → Recalculates mission/task/project progress
  → Emits progress.updated event
  → Notifies Diana of milestone hits
  → Returns updated progress

ExecutionEngine.requestApproval(request)
  → Creates approval task
  → Notifies owner
  → Waits for decision
  → Executes next actions on approval
  → Returns approval task ID
```

### 4.4 Implementation Notes

- ExecutionEngine is stateless (all state in DB)
- Heavy use of async/event-driven patterns
- Never blocks on user input; create tasks and notify
- All actions are reversible (audit trail required)

---

## Part 5: API Contracts (Mission-Centric)

### 5.1 Core Mission APIs

```
POST /api/missions
  Request:  { title, objective, deadline, organizationId }
  Response: Mission

GET /api/missions
  Query:    ?organizationId=...&status=...&ownerId=...
  Response: Mission[]

GET /api/missions/:id
  Response: Mission (with full context)

PUT /api/missions/:id
  Request:  { title?, description?, status?, priority? }
  Response: Mission

DELETE /api/missions/:id
  Response: { success: true }

POST /api/missions/:id/plan
  Request:  {}
  Response: { 
    milestones: Milestone[],
    projects: Project[],
    estimatedCompletionDate: datetime,
    summary: string
  }

POST /api/missions/:id/execute
  Request:  {}
  Response: {
    workspace: Workspace,
    tasks: Task[],
    documents: Document[],
    summary: string
  }

GET /api/missions/:id/progress
  Response: MissionProgress

POST /api/missions/:id/milestone
  Request:  { title, targetDate, successCriteria }
  Response: Milestone

GET /api/missions/:id/timeline
  Response: TimelineEvent[]

POST /api/missions/:id/recommend
  Response: { recommendations: string[] }

POST /api/missions/from-goal
  Request:  { goal: string, organizationId: UUID }
  Response: Mission (proposed for approval)
```

### 5.2 Supporting APIs

```
GET /api/progress/person/:id
  Response: { 
    missions: Mission[],
    completedMissionsCount: number,
    activeMissionsCount: number,
    summary: string
  }

POST /api/tasks
  Request:  { title, missionId?, projectId?, dueDate, priority }
  Response: Task

PUT /api/tasks/:id/complete
  Response: Task (with progress recalculation)

GET /api/documents/mission/:id
  Response: Document[]

POST /api/activity/mission/:id
  Response: Activity[]
```

---

## Part 6: Database Schema (Prisma)

```prisma
model Organization {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  
  members         Person[]
  missions        Mission[]
  teams           Team[]
  
  createdAt       DateTime  @default(now())
  createdBy       String
  
  @@index([createdBy])
}

model Person {
  id              String    @id @default(cuid())
  email           String    @unique
  name            String
  avatar          String?
  
  organizations   Organization[]
  missions        Mission[]    @relation("MissionOwner")
  assignedTasks   Task[]       @relation("TaskAssignee")
  ownedTasks      Task[]       @relation("TaskOwner")
  teams           Team[]
  
  memory          DianaMemory?
  preferences     Json
  
  createdAt       DateTime  @default(now())
  lastLoginAt     DateTime?
  
  @@index([email])
}

model Mission {
  id                    String      @id @default(cuid())
  organizationId        String
  organization          Organization @relation(fields: [organizationId], references: [id])
  
  title                 String
  description           String?
  objective             String
  successCriteria       String    // JSON array
  
  owner                 Person    @relation("MissionOwner", fields: [ownerId], references: [id])
  ownerId               String
  
  status                String    @default("planning") // planning|active|paused|completed|archived
  priority              String    @default("high")
  
  deadline              DateTime?
  startDate             DateTime?
  completedDate         DateTime?
  
  workspaceId           String?
  workspace             Workspace?
  
  projects              Project[]
  tasks                 Task[]
  documents             Document[]
  milestones            Milestone[]
  
  progress              MissionProgress?
  
  memory                DianaMemory?
  aiContext             Json?
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  createdBy             String
  
  @@index([organizationId])
  @@index([ownerId])
  @@index([status])
}

model Milestone {
  id              String    @id @default(cuid())
  missionId       String
  mission         Mission   @relation(fields: [missionId], references: [id], onDelete: Cascade)
  
  title           String
  description     String?
  
  targetDate      DateTime
  completedDate   DateTime?
  
  successCriteria String?
  status          String    @default("planned") // planned|active|completed|missed
  
  tasks           Task[]
  
  createdAt       DateTime  @default(now())
  
  @@index([missionId])
}

model Project {
  id              String    @id @default(cuid())
  missionId       String?
  mission         Mission?  @relation(fields: [missionId], references: [id])
  
  title           String
  description     String?
  status          String    @default("planning")
  priority        String    @default("medium")
  
  owner           Person    @relation(fields: [ownerId], references: [id])
  ownerId         String
  
  tasks           Task[]
  deadline        DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([missionId])
  @@index([ownerId])
}

model Task {
  id              String    @id @default(cuid())
  missionId       String?
  mission         Mission?  @relation(fields: [missionId], references: [id])
  
  projectId       String?
  project         Project?  @relation(fields: [projectId], references: [id])
  
  milestoneId     String?
  milestone       Milestone? @relation(fields: [milestoneId], references: [id])
  
  title           String
  description     String?
  status          String    @default("todo") // todo|in_progress|blocked|completed|cancelled
  priority        String    @default("medium")
  
  assignee        Person?   @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId      String?
  
  owner           Person    @relation("TaskOwner", fields: [ownerId], references: [id])
  ownerId         String
  
  dueDate         DateTime?
  completedAt     DateTime?
  
  dependencies    Task[]    @relation("TaskDependencies")
  dependentTasks  Task[]    @relation("TaskDependencies")
  
  tags            String[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([missionId])
  @@index([projectId])
  @@index([assigneeId])
  @@index([ownerId])
  @@index([status])
}

model Document {
  id              String    @id @default(cuid())
  missionId       String?
  mission         Mission?  @relation(fields: [missionId], references: [id])
  
  title           String
  type            String    // constitution|plan|spec|proposal|report|other
  
  content         String    @db.Text
  version         Int       @default(1)
  status          String    @default("draft") // draft|review|approved|published|archived
  
  owner           Person    @relation(fields: [ownerId], references: [id])
  ownerId         String
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([missionId])
  @@index([ownerId])
}

model Workspace {
  id              String    @id @default(cuid())
  missionId       String    @unique
  mission         Mission   @relation(fields: [missionId], references: [id], onDelete: Cascade)
  
  organizationId  String
  
  title           String
  description     String?
  type            String    @default("standard")
  
  documents       Document[]
  tasks           Task[]
  projects        Project[]
  
  members         Person[]
  
  createdAt       DateTime  @default(now())
  
  @@index([missionId])
}

model MissionProgress {
  id                      String    @id @default(cuid())
  missionId               String    @unique
  mission                 Mission   @relation(fields: [missionId], references: [id], onDelete: Cascade)
  
  percentComplete         Int       @default(0)
  tasksTotal              Int       @default(0)
  tasksCompleted          Int       @default(0)
  tasksBlocked            Int       @default(0)
  
  milestonesReached       Int       @default(0)
  milestonesTotalPlanned  Int       @default(0)
  
  score                   Int       @default(0)
  trend                   String    @default("stable")
  
  estimatedCompletion     DateTime?
  
  updatedAt               DateTime  @updatedAt
  
  @@index([missionId])
}

model DianaMemory {
  id              String    @id @default(cuid())
  
  personId        String?   @unique
  person          Person?   @relation(fields: [personId], references: [id])
  
  missionId       String?   @unique
  mission         Mission?  @relation(fields: [missionId], references: [id])
  
  facts           String    @db.Text // JSON array of MemoryFact
  topics          String[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Activity {
  id              String    @id @default(cuid())
  userId          String
  organizationId  String?
  missionId       String?
  workspaceId     String?
  
  type            String    // mission_created|task_completed|document_created|etc
  title           String
  description     String?
  
  resourceId      String?
  resourceType    String?
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([missionId])
  @@index([workspaceId])
  @@index([createdAt])
}

model Event {
  id              String    @id @default(cuid())
  type            String
  aggregateId     String
  aggregateType   String
  
  data            Json
  metadata        Json?
  
  createdAt       DateTime  @default(now())
  
  @@index([aggregateId])
  @@index([type])
  @@index([createdAt])
}

model Team {
  id              String    @id @default(cuid())
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  
  name            String
  description     String?
  
  members         Person[]
  missions        Mission[]
  
  createdAt       DateTime  @default(now())
  
  @@index([organizationId])
}

model WebhookSubscription {
  id              String    @id @default(cuid())
  organizationId  String
  
  event           String    // task.completed, mission.created, etc
  url             String
  
  isActive        Boolean   @default(true)
  
  createdAt       DateTime  @default(now())
  
  @@index([organizationId])
  @@index([event])
}
```

---

## Part 7: Event Model

All significant changes emit events. Events are immutable and append-only.

### 7.1 Event Categories

**Mission Events**:
- `mission.created` → Mission instantiated
- `mission.started` → Status changed to "active"
- `mission.planning_complete` → Planning phase done
- `mission.milestone_reached` → Milestone completed
- `mission.progress_updated` → Progress recalculated
- `mission.status_changed` → Status transition
- `mission.paused` → Paused by owner
- `mission.resumed` → Resumed
- `mission.completed` → Successfully finished
- `mission.archived` → Archived

**Task Events**:
- `task.created` → Task instantiated
- `task.assigned` → Assigned to person
- `task.started` → Status changed to "in_progress"
- `task.blocked` → Marked as blocked
- `task.unblocked` → Unblocked
- `task.completed` → Marked complete
- `task.cancelled` → Cancelled

**Document Events**:
- `document.created` → Document instantiated
- `document.updated` → Content changed
- `document.published` → Published

**Workspace Events**:
- `workspace.created` → Workspace provisioned
- `workspace.member_added` → Member joined
- `workspace.member_removed` → Member left

**Person Events**:
- `person.joined_organization` → New member
- `person.left_organization` → Member removed
- `person.mission_assigned` → Assigned to mission

### 7.2 Event Structure

```typescript
interface DomainEvent {
  id: UUID                  // unique event ID
  type: string              // e.g., "task.completed"
  aggregateId: UUID         // which entity does this event concern?
  aggregateType: string     // e.g., "Task"
  
  data: {
    [key: string]: any      // event-specific data
  }
  
  metadata: {
    userId: UUID            // who triggered this?
    organizationId: UUID    // which org?
    timestamp: datetime
    causedBy: UUID?         // what other event caused this?
  }
  
  version: number           // event stream version
  createdAt: datetime
}
```

### 7.3 Event Sourcing Pattern

Key principle: Derive all state from events, not the other way around.

```typescript
// To rebuild current mission state:
const events = await eventStore.query({
  aggregateId: missionId,
  aggregateType: 'Mission'
});

let mission = null;
for (const event of events) {
  mission = applyEvent(mission, event);
}
return mission;

// applyEvent handles each event type
function applyEvent(state, event) {
  switch(event.type) {
    case 'mission.created':
      return { ...event.data };
    case 'mission.status_changed':
      return { ...state, status: event.data.newStatus };
    case 'task.completed':
      return { ...state, completedTasks: state.completedTasks + 1 };
    // etc...
  }
}
```

---

## Part 8: Permission Model

### 8.1 Permission Levels

```
Owner
  - Create, read, update, delete mission/workspace/project
  - Assign members
  - Change status and priority
  - Archive or delete

Editor
  - Read mission/workspace/project
  - Create and edit tasks, documents
  - Assign tasks to others (within team)
  - Cannot change mission status or delete

Contributor
  - Read mission/workspace/project
  - Create and edit own tasks
  - Cannot create projects or change status

Viewer
  - Read mission/workspace/project
  - Cannot create or edit anything

Admin (Organization-level)
  - Full access to all missions/workspaces in organization
  - Manage team members and permissions
```

### 8.2 Permission Check Patterns

```typescript
// At controller level, before every action:
async getMission(missionId) {
  const mission = await missionRepository.get(missionId);
  if (!this.permissions.can('read', mission)) {
    throw new ForbiddenException();
  }
  return mission;
}

async updateMission(missionId, updates) {
  const mission = await missionRepository.get(missionId);
  if (!this.permissions.can('update', mission)) {
    throw new ForbiddenException();
  }
  // validate updates...
  return missionRepository.update(missionId, updates);
}

// Permission check considers:
// 1. Is user org member?
// 2. What role in org? (owner, editor, viewer, etc.)
// 3. What role in mission? (owner, contributor, viewer)
// 4. Is team shared mission? (check team membership)
```

---

## Part 9: SDK & Extension Model

AIGINVEST opens its capabilities to external developers via SDK.

### 9.1 SDK Goals

1. Allow external apps to call AIGINVEST APIs
2. Allow external systems to subscribe to AIGINVEST events
3. Allow external systems to extend Diana's capabilities

### 9.2 JavaScript/TypeScript SDK

```typescript
import { AIGINVEST, defineAction } from '@aiginvest/sdk';

const client = new AIGINVEST({
  apiKey: process.env.AIGINVEST_API_KEY,
  organizationId: 'org_123'
});

// Create a mission
const mission = await client.missions.create({
  title: 'Q3 Product Goals',
  objective: 'Ship 5 new features',
  deadline: '2026-09-30',
  priority: 'high'
});

// Listen for events
client.events.on('task.completed', async (event) => {
  console.log(`Task completed: ${event.data.title}`);
  
  // Example: notify Slack
  await slackClient.sendMessage({
    channel: '#engineering',
    text: `✓ ${event.data.title} completed by ${event.metadata.userId}`
  });
});

// Custom action for Diana
const customAction = defineAction({
  name: 'analyze_customer_feedback',
  description: 'Analyze customer feedback and suggest tasks',
  
  execute: async (input: { missionId: string; feedbackFile: string }) => {
    // Call LLM or external service
    const analysis = await analyzeFeedback(input.feedbackFile);
    
    // Create tasks in AIGINVEST
    for (const task of analysis.suggestedTasks) {
      await client.tasks.create({
        missionId: input.missionId,
        title: task.title,
        description: task.description,
        priority: task.priority
      });
    }
    
    return { taskCount: analysis.suggestedTasks.length };
  }
});

// Register custom action
client.actions.register(customAction);
```

### 9.3 Extension Model

Extensions are small programs that extend Diana or the platform.

```
Extension Package:
  - manifest.json (name, version, permissions)
  - handlers/ (Diana handlers, webhooks)
  - ui/ (React components, optional)
  - package.json
```

**Example**: Slack Extension

```
manifest.json:
{
  "name": "AIGINVEST Slack Integration",
  "version": "1.0.0",
  "permissions": ["missions:read", "tasks:read", "events:subscribe"],
  "handlers": [
    {
      "event": "task.completed",
      "handler": "./handlers/task-completed.ts"
    },
    {
      "event": "mission.milestone_reached",
      "handler": "./handlers/milestone-reached.ts"
    }
  ]
}
```

---

## Part 10: Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Database schema (Prisma migrations)
- [ ] Mission model and core APIs
- [ ] MissionService, MissionController
- [ ] Basic Mission CRUD

### Phase 2: Intelligence (Weeks 3-4)
- [ ] DianaMemory service
- [ ] AI Router with context engine
- [ ] Planning Engine
- [ ] Execution Engine

### Phase 3: Orchestration (Weeks 5-6)
- [ ] Events system
- [ ] Activity service
- [ ] Progress tracking
- [ ] Milestone management

### Phase 4: Platform Services (Weeks 7-8)
- [ ] Search service
- [ ] Notification service
- [ ] Webhook system
- [ ] SDK initial release

### Phase 5: UI & UX (Weeks 9-10)
- [ ] Mission dashboard
- [ ] Mission detail view
- [ ] Diana conversational interface
- [ ] Progress visualizations

---

## Part 11: Success Metrics

How we measure if this architecture is working:

### Engagement Metrics
- Users with active missions (target: >80% of signups)
- Missions completed per organization per month
- Average tasks per mission (target: 20-50)
- Task completion rate (target: >70%)

### Performance Metrics
- API response time (target: <200ms p95)
- Mission planning latency (target: <5s)
- Progress recalculation latency (target: <100ms)

### Platform Metrics
- Extension count (target: 10+ by month 6)
- API call volume from third-party apps
- Webhook subscription count

### Quality Metrics
- Percent of Diana recommendations acted upon
- Milestone accuracy (planned vs actual)
- User satisfaction with mission outcomes

---

## Part 12: Key Principles

1. **Mission is the North Star** — Everything revolves around mission success, not feature adoption.

2. **Diana is Autonomous** — She doesn't wait for input. She acts, creates, suggests, learns.

3. **Events are Immutable** — All changes flow through events. State is derived, not stored.

4. **Permissions are Explicit** — Every action is checked. No accidental exposure.

5. **Context is Abundant** — Diana has full history, memory, and metadata before deciding.

6. **APIs are Mission-Centric** — Not application-centric. The API speaks in missions, not CRUD.

7. **Extensions are First-Class** — External developers matter. They're not second-class citizens.

8. **Progress is Visible** — Users always know where they stand. Metrics are transparent.

9. **Fail Open** — If Diana can't decide, she asks the human. She never pretends.

10. **Learn from Outcomes** — Diana stores what worked and what didn't. Continuous improvement.

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **Mission** | A significant outcome the organization wants to achieve, with objectives and success criteria |
| **Goal** | What a person articulates they want to achieve |
| **Workspace** | The operational sandbox where a mission's work happens |
| **Project** | A logical grouping of tasks within a mission |
| **Task** | An atomic unit of work with an owner and deadline |
| **Milestone** | A planned checkpoint within a mission |
| **Diana** | The AI orchestrator that manages missions and coordinates work |
| **Event** | An immutable record that something happened |
| **Memory** | Persistent context about a person, mission, or organization |
| **Progress** | A quantified measure of mission completion |

---

## Appendix B: Example: 30-Day Mission

**Goal**: "Launch beta program"

**Mission Created**:
```
Title: Launch AIGINVEST Beta
Objective: Get 100 beta users with NPS > 50
Success Criteria: 100 active users, NPS survey result > 50, zero critical bugs
Deadline: 30 days from now
```

**Planning Phase** (Diana recommends):
```
Milestone 1 (Week 1): Onboarding System Ready
  - Create beta signup page
  - Build user onboarding flow
  - Set up feedback collection
  
Milestone 2 (Week 2): Initial Cohort
  - Recruit 50 beta users
  - Monitor onboarding metrics
  - Gather initial feedback
  
Milestone 3 (Week 3): Iterate & Improve
  - Fix top 5 bugs from feedback
  - Improve onboarding UX
  - Add missing features
  
Milestone 4 (Week 4): Scale & Measure
  - Recruit 50 more users
  - Run NPS survey
  - Document learnings
```

**Execution Phase** (Diana creates):
```
Tasks:
  ✓ Design beta landing page (due Day 2)
  ✓ Build user signup API (due Day 3)
  ✓ Create welcome email (due Day 3)
  ✓ Deploy to beta.aiginvest.com (due Day 4)
  ✓ Write beta program guide (due Day 5)
  ✓ Recruit 50 initial users (due Day 7)
  ✓ Set up monitoring (due Day 3)
  
Documents:
  - Beta Program Guide
  - Onboarding Checklist
  - Feedback Collection Template
  - Bug Triage Process
```

**Progress Tracking**:
```
Day 1:  Progress: 10% (signup + landing ready)
Day 7:  Progress: 25% (50 users onboarded, collecting feedback)
Day 14: Progress: 50% (bugs fixed, UX improved, scaling)
Day 21: Progress: 75% (100 users active, NPS pending)
Day 28: Progress: 95% (NPS survey done, results positive)
Day 30: Progress: 100% ✓ Mission Complete
```

**Outcome**: Mission completed in 30 days. Bonus: 120 users, NPS 62, 3 new feature requests.

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-07 | Initial specification. Mission as core object, Diana as orchestrator, full platform services defined. |

---

**End of AIGINVEST Technical Specification v1.0**
