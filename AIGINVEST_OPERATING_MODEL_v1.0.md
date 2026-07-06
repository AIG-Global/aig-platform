# AIGINVEST Operating Model v1.0

**Status**: Locked (No expansion without amendment)  
**Version**: 1.0  
**Date**: 2026-07-07  
**Owner**: Executive Leadership  
**Last Reviewed**: 2026-07-07  

---

## Executive Summary

The AIGINVEST Operating Model defines how the platform organizes work and creates value.

It is built on **five core domains**. Everything in the platform belongs to one of these domains.

**No domain expansion is permitted without formal amendment to this document.**

This operating model is the constitutional foundation. It does not change with feature requests or market feedback. It changes only through deliberate, documented amendment.

---

## The Five Core Domains

### 1. People

People are not just "users." They can occupy multiple roles:

- **Individual** — Solo user with personal missions
- **Team member** — Part of a team executing shared missions  
- **Organization owner** — Controls organization and allocates resources
- **External partner** — Collaborates on specific missions
- **AI agent** — Future: autonomous agents that operate on behalf of people

**Every person has**:
- Identity (email, name, avatar)
- Permissions (what they can do in which organization/team)
- Relationships (teams, collaborators, followers)
- Active missions (what they're currently executing)
- Memory (preferences, working style, history)

**Platform Service**: Identity Service

---

### 2. Goals

Goals answer: **Why does this work exist?**

Goals are **long-lived, aspirational statements** of intent.

**Examples**:
- Launch AIGINVEST publicly
- Raise €2M investment
- Learn AI development
- Build North Star ONE

**Characteristics**:
- Chosen by people, not systems
- Can exist indefinitely without execution
- Multiple goals per person
- Goals → Missions (conversion happens during planning)
- Can be private or shared

**Why separate from Missions?** Because intent and action are different. You can state a goal without being ready to execute it.

**Platform Service**: Goal Service

---

### 3. Missions

Missions answer: **What are we doing right now?**

Missions are **executable commitments** to achieve specific outcomes.

**Examples**:
- Build Alpha 0.2 (outcome: working demo)
- Create Investor Pitch (outcome: funded presentation)
- Recruit First 100 Users (outcome: 100 active users)
- Complete Q3 Roadmap (outcome: 5 features shipped)

**Characteristics**:
- Derived from goals or created independently
- Have deadline, owner, success criteria
- Broken into projects, tasks, milestones
- Produce outcomes (workspace, documents, metrics)
- Have observable progress
- Can be paused, completed, or abandoned
- One workspace per mission (1:1 relationship)

**Why separate from Goals?** Because you commit to specific execution. A goal is aspiration. A mission is accountability.

**Platform Service**: Mission Service

---

### 4. Workspaces

Workspaces answer: **Where does the work happen?**

A workspace is the **operational sandbox** for a mission's execution.

**Contains**:
- Projects (logical groupings of work)
- Documents (specifications, plans, reports, knowledge)
- Tasks (atomic units of work)
- Timeline (activity log of everything that happened)
- Knowledge (searchable context and decisions)
- Files (attachments and artifacts)
- Calendar (deadlines and milestones)

**Characteristics**:
- 1:1 relationship with a mission
- Isolated from other workspaces
- Members (people who can access and edit)
- Discoverable (can be shared with others)
- Can be archived or deleted
- Maintains full history

**Why separate from Missions?** Because a mission is the "why and what". A workspace is the "where and how". You need both concepts.

**Platform Services**: Workspace, Project, Task, Document, Activity

---

### 5. Assets

Assets are **everything created** and becomes **reusable**.

**Examples**:
- Document (specification, plan, report, template)
- Roadmap (visual timeline)
- Task (template for recurring work)
- Image (diagram, screenshot, mockup)
- Presentation (pitch deck, investor material)
- Contract (legal agreement)
- Dataset (training data)
- AI Prompt (reusable instruction)
- Workflow (automation sequence)
- Code (reusable component, library)

**Characteristics**:
- Created within missions
- Can be reused across missions
- Have versions and audit trails
- Can be public or private
- Tagged and searchable
- Have access controls
- Can be exported or shared

**Why separate?** Because you want to create once, reuse many times. A document created for Mission A might be perfect for Mission B.

**Platform Service**: Asset Service (future)

---

## Diana's Role: Mission Director

Diana is not a chatbot. She is the **Mission Director**.

She has **four core responsibilities**:

### 1. Understand Intent

Listen to what the person wants to achieve.

Clarify ambiguous goals.

Ask questions that surface hidden constraints.

**Output**: Clear understanding of intent

### 2. Build the Right Workspace

Translate intent into a structured workspace.

Create appropriate projects, documents, and tasks.

Provision access and communication channels.

**Output**: Operational workspace ready for execution

### 3. Coordinate Execution

Push tasks forward.

Unblock work when people are stuck.

Connect knowledge across projects.

Manage dependencies.

**Output**: Steady progress toward mission objectives

### 4. Measure Progress

Track completion against success criteria.

Surface metrics and trends.

Celebrate milestones.

Recommend adjustments.

**Output**: Transparency on mission health

---

## The Platform Loop

Every interaction should follow the same cycle:

```
Intent → Understand → Plan → Execute → Measure → Improve → Repeat
```

**Understand**: Clarify what the person wants.  
**Plan**: Break into milestones, projects, tasks.  
**Execute**: Create workspace, documents, assign work.  
**Measure**: Track progress, surface blockers.  
**Improve**: Learn from outcomes, adjust approach.  
**Repeat**: Next cycle.

This loop repeats continuously for as long as the mission exists.

---

## Event-Driven Architecture

Every significant action produces an event.

**Examples**:
```
GoalCreated
MissionStarted
MissionPlanned
WorkspaceProvisioned
ProjectCreated
TaskCreated
DocumentGenerated
TaskCompleted
MilestoneReached
MemoryUpdated
MissionCompleted
MissionPaused
```

**Why?** Events enable:
- Activity timelines (users see what happened)
- Analytics (measure platform usage)
- Automation (trigger workflows on events)
- Audit trails (compliance and debugging)
- Integrations (webhooks for external systems)
- Machine learning (learn from patterns)

**All events are immutable and append-only.**

---

## One Unified Platform SDK

Instead of separate SDKs for every subsystem, expose **one cohesive platform SDK**.

**Usage**:
```
aiginvest.goal.create(...)
aiginvest.mission.start(...)
aiginvest.workspace.create(...)
aiginvest.document.generate(...)
aiginvest.memory.search(...)
aiginvest.timeline.events(...)
```

**Benefits**:
- Consistent developer experience
- Single documentation surface
- Lower learning curve
- Easier to extend

---

## KPI Dashboard: Measure Outcomes

Stop measuring only technical metrics. **Measure outcomes**.

### Platform Health
- API uptime %
- Deployment success %
- Error rate (errors per 1M requests)
- Response time (p50, p95, p99)

### User Success (Outcome Metrics)
- Missions started per month
- Missions completed per month
- Average mission duration (days)
- User return rate (% active week-over-week)
- Time to first value (days until first completed task)
- Mission success rate (% missions meeting success criteria)

### Diana Intelligence
- Tool success rate (% actions that achieve intent)
- Memory recall quality (% memory retrievals that help)
- User approval rate (% suggested actions user approves)
- Context relevance score (AI judges relevance of context)

### Business Metrics
- Monthly active users
- Churn rate
- Net promoter score (NPS)
- Cost per user acquisition
- Lifetime value

---

## Principles

### Principle 1: Domains are Isolated
People, Goals, Missions, Workspaces, and Assets operate independently.

Changing one domain should not break another.

**Test**: Can you disable Goals without breaking Missions? YES → design is good.

### Principle 2: Events are Immutable
All state changes flow through events.

No direct database mutations (except during migrations).

**Test**: Can you replay events to rebuild any state? YES → design is good.

### Principle 3: Diana is Autonomous
Diana acts without waiting for permission.

She creates tasks, generates documents, updates progress.

She never says "Would you like me to...?" She says "I've done this."

**Test**: Can Diana complete 80% of missions without human input after kickoff? If not, redesign.

### Principle 4: Permissions are Explicit
Every action is checked before execution.

No "just try it" attacks.

**Test**: Can you accidentally expose another user's workspace? If YES → security failure.

### Principle 5: Context is Abundant
Diana has full history, memory, and metadata before deciding.

Every LLM call includes person history, mission state, recent activities, relevant documents.

**Test**: Does Diana know the person's working style and preferences? If NO → context architecture is incomplete.

### Principle 6: Progress is Visible
Users always know where they stand.

Metrics are transparent.

**Test**: Can a user answer "How am I doing?" with actual numbers without asking Diana? If NO → progress visibility is incomplete.

### Principle 7: APIs are Mission-Centric
Not application-centric.

The API speaks in missions, not CRUD.

`POST /api/missions/:id/execute` not `POST /api/database/update`

**Test**: Can a developer build a new interface without seeing any database code? If YES → APIs are abstracted correctly.

### Principle 8: Fail Open
If Diana can't decide, she asks the human.

She never silently fails or guesses.

**Test**: If Diana encounters ambiguity, does she ask for clarification? If NO → error handling is poor.

### Principle 9: Extensions are First-Class
External developers matter.

They have same API access as internal code.

**Test**: Can an external developer build a feature as easily as an internal team member? If NO → API design is poor.

### Principle 10: Learning Compounds
Diana stores what worked and what didn't.

Every completed mission makes Diana smarter.

**Test**: Does Diana make better recommendations over time for a returning user? If NO → learning system is incomplete.

---

## The Three Repositories of Responsibility

Split ownership into three logical repositories (even if initially in one monorepo):

### 1. AIGINVEST Core Services
- Mission orchestration
- Workspace provisioning
- Event handling
- Activity tracking
- Progress calculation
- Database schema
- SDK

**Ownership**: Platform Engineering

### 2. Diana Intelligence
- Intent understanding
- Planning engine
- Execution engine
- Memory system
- LLM integration
- Prompt engineering
- Context building

**Ownership**: AI/ML Engineering

### 3. Client Experiences
- Web interface
- Mobile application
- AIOS integration
- API documentation
- Developer portal

**Ownership**: Product Engineering

**Why?** This separation allows scaling teams independently while maintaining architectural coherence.

---

## The 12-Month Execution Plan

Instead of "features," plan in **outcome releases**.

### Release 1: First Mission (Month 1-2)
- A new user completes one mission end-to-end
- Metrics: 50% of onboarded users complete one mission

### Release 2: Daily Productivity (Month 3-4)
- A user returns every workday
- Metrics: 30% of users are daily active users

### Release 3: Team Collaboration (Month 5-6)
- A team completes a shared mission
- Metrics: 5+ teams on platform

### Release 4: Ecosystem (Month 7-9)
- External developers extend the platform
- Metrics: 10+ community extensions

### Release 5: AIOS Integration (Month 10-12)
- Experience follows user onto AIOS
- Metrics: 1K+ AIOS users

---

## What Does NOT Change

The following are **locked unless amended**:

- The five domains (People, Goals, Missions, Workspaces, Assets)
- Event-driven architecture
- Diana's four responsibilities
- The platform loop (Intent → Understand → Plan → Execute → Measure → Improve)
- The 10 principles

**Amendment Process**:
1. Documented proposal with rationale
2. Full team review (executive + engineering + product)
3. Impact analysis on existing systems
4. Decision with documented vote
5. Version bump + Git commit
6. All systems updated to reflect amendment

---

## Migration Path from Alpha 0.2

**Current state** (Alpha 0.2):
- Workspace-centric (no Mission object yet)
- Goal → auto-create Workspace

**Phase 1** (this sprint):
- Add Mission model and schema ✓
- Mission ← Goal (migrations)
- Workspace ← Mission (1:1)

**Phase 2** (next sprint):
- MissionService fully implemented
- Planning Engine creates tasks from missions
- Execution Engine provisions workspaces

**Phase 3** (sprint after):
- Organization and Team support
- Multi-user missions
- Role-based access control

**Phase 4** (month 2):
- Diana becomes full Mission Director
- Real planning and execution engines
- Event publishing system

**Phase 5** (month 3+):
- Asset reusability
- AIOS integration
- Ecosystem SDK release

---

## Document Control

| Version | Date | Amendment | Author |
|---------|------|-----------|--------|
| 1.0 | 2026-07-07 | Initial operating model. Five domains locked. | Leadership |

---

**End of AIGINVEST Operating Model v1.0**

This document is the constitutional foundation. Every line of code should serve this model.

When in doubt about architecture or design, reference this document.

When facing ambiguous requirements, use this document to decide.

When tempted to add a sixth domain, propose an amendment instead.
