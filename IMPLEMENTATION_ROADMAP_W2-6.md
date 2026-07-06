# AIGINVEST Implementation Roadmap: Week 2-6

**Version:** 1.0  
**Status:** LOCKED — Governs engineering priorities  
**Timeframe:** July 7 - August 18, 2026  
**Alignment:** AIGINVEST_OPERATING_DOCTRINE.md  

---

## Overview

This roadmap bridges the **conceptual architecture** (now complete via Operating Doctrine) to **tangible engineering** (Mission Engine, Workspace Orchestrator, Trust Engine).

Success = **End-to-end demonstration: Goal → Mission → Workspace → Completed Work → Knowledge**

---

## Foundation Status

### ✅ Complete (Week 1)

- Mission CRUD service (fully implemented)
- MissionController with REST API (fully implemented)
- Workspace auto-provisioning (fully implemented)
- Diana mission context integration (fully implemented)
- Web UI for mission creation and listing (fully implemented)
- Database schema and migrations (applied)
- TypeScript compilation: 0 errors
- Git: All code committed and pushed

### ⏳ Next Priority (Week 2-6)

1. **Trust Engine** — Make every AI action transparent
2. **Document Generator** — Users can create structured outputs
3. **Task Management + Progress** — Track work toward mission
4. **Diana Reasoning** — AI-driven roadmaps and recommendations
5. **Activity Timeline** — All work becomes visible history

### 🗺️ Later Phases (Week 7+)

- Team collaboration
- Real-time multiplayer
- Marketplace and SDK
- AIOS integration

---

## Week 2: Trust Engine + Event Logging

### Goal

Every AI action produces a record that explains itself.

### Deliverables

#### 1. Event Model & Service

**What:** Add Event table to Prisma schema, implement EventService

**Why:** Foundation for transparency and audit trail

```prisma
model Event {
  id              String
  missionId       String?
  workspaceId     String?
  type            String      // mission_created | diana_action | task_completed
  actor           String      // userId or "diana"
  action          String      // created | suggested | analyzed
  reason          String?     // Why this happened
  dataUsed        Json?       // Sources and confidence
  result          Json?       // What was created/changed
  trustRecord     TrustRecord?
  createdAt       DateTime
}

model TrustRecord {
  id              String
  eventId         String
  action          String      // "created_roadmap"
  reason          String      // "User asked for 12-week plan"
  sources         String[]    // ["mission.objective", "workspace.context"]
  confidence      Float       // 0.0 - 1.0
  assumptions     String[]    // ["market is $2B", "team is 3 people"]
  editable        Boolean     // Can user edit this?
  undoable        Boolean     // Can user undo this?
}
```

**Implementation:**
- Add models to Prisma schema
- Run migration
- Create EventService with methods:
  - `log(event)` — Record any event
  - `createTrustRecord(eventId, data)` — Document AI action
  - `getTimeline(workspaceId)` — Fetch all events
  - `explainAction(eventId)` — Format explanation for user

**API Endpoints:**
```
POST   /api/events                    → Log event
GET    /api/workspaces/:id/events     → Get timeline
GET    /api/events/:id/trust          → Get trust record
GET    /api/events/:id/explanation    → Get formatted explanation
```

**Testing:**
- Unit test: EventService.log()
- Unit test: EventService.createTrustRecord()
- Integration test: Create mission → Event logged
- Integration test: Diana action → Trust record created

**Success Criteria:**
- Timeline shows all events for workspace
- Diana actions include trust records
- User can click "Why?" on any AI action and see explanation

---

#### 2. Update MissionService to Log Events

**What:** Every mission operation creates an Event

```typescript
// In MissionService.create():
await this.eventService.log({
  missionId: mission.id,
  type: 'mission_created',
  actor: userId,
  action: 'created',
  reason: `User created mission for goal: ${goal.title}`,
  dataUsed: { goal: goal.id },
  result: { missionId: mission.id, workspaceId: workspace.id }
});
```

**Success Criteria:**
- Mission created → Event logged
- Mission status changed → Event logged
- Mission updated → Event logged

---

### Testing

```bash
npm run test -- EventService
npm run test -- MissionService.integration
```

### Deployment

- Merge to main
- Push to GitHub
- CI/CD runs tests
- Deploy to staging

---

## Week 3: Document Generator + Task Management

### Goal

Users can create structured documents and track progress.

### Deliverables

#### 1. Document Generator Service

**What:** Generate structured documents (roadmap, plan, research template)

```typescript
class DocumentGeneratorService {
  // Generate document from template + context
  async generate(
    documentType: string,      // roadmap | plan | research | timeline
    context: GenerationContext // mission, workspace, knowledge
  ): Promise<Document> {
    // 1. Load template for document type
    // 2. Fill template with context
    // 3. Generate markdown
    // 4. Create Document object
    // 5. Log event: "document_generated"
    // 6. Create trust record with reasoning
    // 7. Return document
  }
}
```

**Supported Document Types:**
- **Roadmap** — 12-week/quarter/year timeline with milestones
- **Plan** — Structured project plan with phases
- **Research** — Summarize findings and context
- **Timeline** — Gantt-style view of work

**API Endpoints:**
```
POST   /api/documents/generate
       Body: { type, workspaceId, templateData }
       Response: { id, content, trustRecord }

GET    /api/documents/:id
       Response: { id, content, versions, status }

PUT    /api/documents/:id
       Body: { content }
       Response: Document (with version history)
```

**Integration:**
- User: "Diana, create a roadmap"
- Diana detects intent: `generate_document`
- Diana calls DocumentGeneratorService
- DocumentGeneratorService creates Document
- Event logged with trust record
- User sees formatted document with "Why?" button

**Success Criteria:**
- User can generate roadmap via Diana
- User can see generation reasoning
- Document is editable
- Document versioning works

---

#### 2. Task Management Service

**What:** Create tasks, track progress, update status

```typescript
class TaskService {
  async create(dto: CreateTaskDto): Promise<Task> {
    // Create task in workspace/mission
    // Log event: "task_created"
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    // Update task status (todo → in-progress → completed)
    // Update MissionProgress automatically
    // Log event: "task_status_changed"
  }

  async listTasks(missionId: string): Promise<Task[]> {
    // Get all tasks for mission
  }

  async getProgress(missionId: string): Promise<MissionProgress> {
    // Calculate: tasksCompleted / tasksTotal
    // Return progress %
  }
}
```

**API Endpoints:**
```
POST   /api/tasks
       Body: { workspaceId, title, description }
       Response: Task

GET    /api/missions/:id/tasks
       Response: Task[]

PATCH  /api/tasks/:id
       Body: { status }
       Response: Task

GET    /api/missions/:id/progress
       Response: { tasksTotal, tasksCompleted, percent }
```

**Integration with Diana:**
- Diana detects: "Create task: Write business plan"
- DianaService calls TaskService.create()
- Task created + event logged
- User sees task in workspace
- User can mark complete

**Success Criteria:**
- User can create tasks
- User can update task status
- Progress bar updates automatically
- Events logged for all changes

---

### Testing

```bash
npm run test -- DocumentGeneratorService
npm run test -- TaskService
npm run test -- DocumentGenerator.integration
```

### Deployment

- Merge to main
- Push to GitHub
- Deploy to staging

---

## Week 4: Diana Reasoning + Recommendations

### Goal

Diana can generate roadmaps, suggest next steps, provide strategic guidance.

### Deliverables

#### 1. Diana Reasoning Service

**What:** Structured reasoning for roadmaps and recommendations

```typescript
class DianaReasoningService {
  // Generate roadmap for mission
  async generateRoadmap(missionId: string): Promise<Roadmap> {
    // 1. Load mission + workspace + knowledge
    // 2. Analyze mission objective and timeline
    // 3. Break into milestones
    // 4. Create tasks
    // 5. Estimate timeline
    // 6. Log event with trust record
    // 7. Return roadmap
  }

  // Suggest next steps
  async suggestNextSteps(missionId: string): Promise<Suggestion[]> {
    // Analyze: completed tasks, remaining tasks, progress
    // Suggest: what to do next based on data
    // Return: 3-5 suggestions with reasoning
  }

  // Provide strategic guidance
  async analyzeProgress(missionId: string): Promise<Analysis> {
    // Analyze: progress, timeline, risks
    // Generate: strategic recommendations
  }
}
```

**Integration with Diana:**
- User: "Create a roadmap for this mission"
- Diana detects: `generate_roadmap`
- Calls DianaReasoningService.generateRoadmap()
- Service creates Roadmap document
- Event logged with reasoning
- User sees roadmap with "Why this structure?" explanation

**API Endpoints:**
```
POST   /api/diana/roadmap
       Body: { missionId }
       Response: { document, trustRecord }

POST   /api/diana/suggestions
       Body: { missionId }
       Response: [{ suggestion, reasoning, confidence }]

POST   /api/diana/analysis
       Body: { missionId }
       Response: { status, risks, recommendations, trustRecord }
```

**Success Criteria:**
- Diana can generate multi-week roadmaps
- Each roadmap includes reasoning
- User can undo roadmap (revert to previous state)
- Suggestions appear in Diana chat

---

#### 2. Update Diana Intent Engine

**What:** Handle new intents: generate_roadmap, suggest_next, analyze_progress

```typescript
class DianaIntentEngine {
  async executeIntent(intent: Intent): Promise<DianaResult> {
    switch(intent.type) {
      case 'generate_roadmap':
        return await this.reasoningService.generateRoadmap(intent.missionId);
      
      case 'suggest_next':
        return await this.reasoningService.suggestNextSteps(intent.missionId);
      
      case 'analyze_progress':
        return await this.reasoningService.analyzeProgress(intent.missionId);
      
      // ... other intents
    }
  }
}
```

**Success Criteria:**
- Diana understands natural language roadmap requests
- Suggestions are relevant and timely
- All AI actions are transparent (trust records)

---

### Testing

```bash
npm run test -- DianaReasoningService
npm run test -- DianaIntentEngine.roadmap
npm run test -- End-to-end: Chat → Roadmap
```

### Deployment

- Merge to main
- Deploy to staging
- Demo to team

---

## Week 5: Activity Timeline + Visibility

### Goal

Every action (user + Diana) becomes part of mission history.

### Deliverables

#### 1. Activity Timeline UI

**What:** Web component showing all workspace events

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Activity Timeline

   Today, 2:34 PM
   ✓ You completed task "Market research"
     
   Today, 1:15 PM
   → Diana suggested "Add competitor analysis"
     Why? [Show reasoning]

   Today, 12:00 PM
   📋 You published document "Product Strategy"
     3 versions saved

   Yesterday, 6:45 PM
   → Diana created roadmap
     ✎ Edit  ↶ Undo  ⓘ Explanation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**API Support:**
```
GET    /api/workspaces/:id/timeline
       Query: ?limit=50&offset=0
       Response: [Event] ordered by createdAt DESC
```

**Success Criteria:**
- Timeline loads for workspace
- Shows all event types
- Can click "Why?" on any event
- Can click "Undo" on AI actions (until committed)

---

#### 2. Explanation Engine

**What:** Format trust records into user-friendly explanations

```typescript
class ExplanationEngine {
  // Format trust record into natural language
  format(trustRecord: TrustRecord): string {
    return `
      Diana ${trustRecord.action} because:
      
      Reason: ${trustRecord.reason}
      
      Based on:
      ${trustRecord.sources.map(s => `- ${s}`).join('\n')}
      
      Assumptions:
      ${trustRecord.assumptions.map(a => `- ${a}`).join('\n')}
      
      Confidence: ${trustRecord.confidence * 100}%
    `;
  }
}
```

**Success Criteria:**
- Every AI action has a clear explanation
- User can understand Diana's reasoning
- Explanation is presented in < 3 minutes reading time

---

### Testing

```bash
npm run test -- ActivityTimeline.integration
npm run test -- ExplanationEngine
```

### Deployment

- Merge to main
- Update web UI
- Deploy to staging

---

## Week 6: End-to-End Demo + Polish

### Goal

Complete end-to-end demonstration of: Goal → Mission → Work → Knowledge

### Deliverables

#### 1. Scripted Demo

**Setup:**
1. Create user account
2. Create goal "Launch SaaS in 12 weeks"
3. Create mission "Build MVP"
4. Ask Diana: "Create roadmap"
5. Create tasks based on roadmap
6. Mark tasks complete
7. Ask Diana: "What should we focus on next?"
8. Diana analyzes progress + suggests
9. Create document summarizing work
10. Review activity timeline

**Timing:** < 10 minutes

**Success:** All 10 steps complete, nothing breaks

---

#### 2. Bug Fixes + Polish

- Fix any crashes or errors
- Optimize performance
- Improve error messages
- Clean up code and remove debug logs

---

#### 3. Documentation

- Update README with architecture
- Document all APIs
- Create developer onboarding guide
- Record demo video

---

### Testing

```bash
npm run test -- Full end-to-end
npm run build
npm run start
```

### Deployment

- All code committed
- Tests passing
- Ready for production
- Demo recorded

---

## Success Criteria for Weeks 2-6

By end of Week 6, users can:

✅ Create a goal
✅ Create a mission for a goal
✅ Ask Diana to create a roadmap
✅ Create and track tasks
✅ See all work in activity timeline
✅ Understand Diana's reasoning (trust records)
✅ Undo Diana's suggestions
✅ Create and publish documents
✅ See progress tracking
✅ Complete a full mission (end-to-end)

---

## Parallel Track: Project One Hundred Recruitment

### Week 2-3: Recruitment

While engineering works on Trust Engine and Documents, recruiting can:
- Publish cohort applications
- Reach out to target users
- Conduct intake interviews
- Onboard first 10-20 participants to staging

### Week 4-5: Onboarding

- Provide training to cohort members
- Collect baseline data
- Answer early questions
- Monitor usage patterns

### Week 6+: First Data

- Analyze: Which features are used?
- Identify: What breaks?
- Survey: What's valuable?
- Iterate: Fix issues discovered

---

## Engineering Practices (All Weeks)

### Code Quality
- TypeScript strict mode
- 100% passing tests before merge
- Code review on all PRs
- Linting + formatting on commit

### Documentation
- Every API documented
- Every service has docstring
- Architecture decisions recorded
- Breaking changes flagged

### Deployment
- Automated tests on PR
- Staging deploy on merge to main
- Production ready at any time
- Rollback plan for every deploy

### Monitoring
- Error tracking (Sentry or equivalent)
- Performance monitoring
- User session recording
- Database monitoring

---

## Risk Mitigation

### Highest Risk: Diana reasoning flawed
**Mitigation:** Trust engine makes all reasoning visible, easy to audit and fix

### High Risk: Performance degrades with events
**Mitigation:** Archive events monthly, separate read model for timeline

### Medium Risk: Users don't understand features
**Mitigation:** 3-minute rule ensures simplicity, on-screen explanations

### Medium Risk: Scope creep
**Mitigation:** Lock on Operating Doctrine, NO FEATURES outside the 4 principles

---

## What Comes After Week 6

If v1.0 is successful:

**Week 7-8:** Team collaboration features
**Week 9-10:** Real-time multiplayer
**Week 11-12:** Marketplace prep
**Week 13-16:** AIOS integration + North Star ONE

If bugs/improvements needed:
**Weeks 7-12:** Iterate on v1.0 based on Project One Hundred feedback

---

## Related Documents

- [AIGINVEST_OPERATING_DOCTRINE.md](AIGINVEST_OPERATING_DOCTRINE.md) — Philosophical foundation
- [AIGINVEST_TECHNICAL_SPECIFICATION_v1.0.md](AIGINVEST_TECHNICAL_SPECIFICATION_v1.0.md) — Implementation spec
- [PROJECT_ONE_HUNDRED.md](PROJECT_ONE_HUNDRED.md) — Validation framework
- [90_DAY_EXECUTION_PROGRAM_v1.0.md](90_DAY_EXECUTION_PROGRAM_v1.0.md) — Overall roadmap

---

**This roadmap is LOCKED.**

All engineering decisions must align with these 5 weeks of deliverables.

When in doubt, return to the Operating Doctrine.

Execution begins now.
