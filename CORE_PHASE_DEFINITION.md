# CORE Phase Definition: The Five Systems

**Version:** 1.0  
**Status:** LOCKED — Defines what gets built before anything else  
**Effective:** July 7, 2026  
**Duration:** Weeks 2-6 + beyond  
**Parent Document:** [AIGINVEST_REFERENCE_ARCHITECTURE.md](AIGINVEST_REFERENCE_ARCHITECTURE.md)

---

## Preamble

After Week 1, we have proof the platform works.

After Weeks 2-6, we need proof it's **stable enough to scale**.

The CORE Phase defines five systems that must be built before ANY other feature.

These five systems determine whether AIGINVEST succeeds or fails.

---

## The Five Systems

### System 1: Mission Engine

**What It Is:**
The core business logic that transforms goals into executable missions.

**What It Does:**
1. User defines goal (desired outcome + timeline)
2. System converts goal into mission structure
3. Mission becomes the execution frame
4. Workspace auto-provisions
5. Diana contextualizes to mission

**Why It Matters:**
Without Mission Engine, AIGINVEST is just a to-do app.

With Mission Engine, it's a platform for **outcome-focused execution**.

**Technical Components:**

| Component | Responsibility | Status |
|-----------|-----------------|--------|
| MissionService | CRUD + lifecycle | ✅ Done (W1) |
| GoalService | Goal creation + conversion | 🏗️ W2 |
| MissionStateManager | Valid state transitions | 🏗️ W2 |
| MissionContextBuilder | Mission → Diana context | 🏗️ W2-3 |

**Success Criteria:**
- ✅ User can create goal in <3 minutes
- ✅ Goal → Mission conversion happens automatically
- ✅ Workspace created with first mission
- ✅ Diana knows mission context immediately
- ✅ User can change mission status (planning → active → paused → completed)
- ✅ All mission operations logged as events

**APIs (Required):**
```
POST /missions/from-goal
GET /missions/:id/context
PATCH /missions/:id/status
GET /missions/:id/timeline
```

**Diana Integration:**
```
Tool: UnderstandMission
  Input: mission_id
  Output: mission context (goal, timeline, current state, progress)
  Use: Diana references this before giving advice

Tool: SuggestNextStep
  Input: mission_id, current_state
  Output: recommended next action
  Use: Diana proactively suggests work
```

**Completion Criteria (By End of Week 3):**
- ✅ Mission engine can handle 1000s of missions
- ✅ State transitions validated
- ✅ All actions produce events
- ✅ Diana has full mission context
- ✅ Timeline shows all mission events

---

### System 2: Workspace Orchestrator

**What It Is:**
The system that provisions and manages execution containers (workspaces).

**What It Does:**
1. Mission is created
2. Workspace auto-provisions with everything needed
3. Workspace has configuration (settings, integrations)
4. Diana can see and modify workspace
5. User can invite collaborators
6. Workspace lifecycle linked to mission lifecycle

**Why It Matters:**
Without Workspace Orchestrator, users have to manually set up environments.

With it, the platform does all the work.

**Technical Components:**

| Component | Responsibility | Status |
|-----------|-----------------|--------|
| WorkspaceService | CRUD + provisioning | ✅ Done (W1) |
| WorkspaceInitializer | Auto-provision on mission create | ✅ Done (W1) |
| WorkspaceConfig | Settings + integrations | 🏗️ W2 |
| WorkspaceCollaboration | Invite + permissions | 🏗️ W3-4 |

**Success Criteria:**
- ✅ Workspace auto-provisions in <5 seconds
- ✅ Default project created in workspace
- ✅ Diana can see workspace configuration
- ✅ User can modify workspace settings
- ✅ Workspace lifecycle synced with mission
- ✅ Workspace can be shared with collaborators

**APIs (Required):**
```
POST /workspaces
GET /workspaces/:id
PATCH /workspaces/:id/config
POST /workspaces/:id/collaborate
GET /workspaces/:id/members
```

**Diana Integration:**
```
Tool: GetWorkspaceContext
  Input: workspace_id
  Output: workspace configuration, active users, resources
  Use: Diana understands what's in the workspace

Tool: UpdateWorkspaceConfig
  Input: workspace_id, config_changes
  Output: updated workspace
  Use: Diana can optimize workspace settings
```

**Completion Criteria (By End of Week 4):**
- ✅ Workspace provisions instantly
- ✅ Collaboration works (multiple users)
- ✅ Configuration persists
- ✅ Diana can read all workspace data
- ✅ Audit trail shows all workspace changes

---

### System 3: Diana Orchestrator

**What It Is:**
The system that coordinates AI capabilities, tools, memory, and planning.

**What It Does:**
1. User asks Diana for help
2. Diana loads mission context
3. Diana determines what tool to use
4. Diana executes tool (or suggests action)
5. Diana explains reasoning
6. Diana learns from outcome

**Why It Matters:**
Without Diana Orchestrator, AI is just a chatbot.

With it, AI becomes a **partner in execution**.

**Technical Components:**

| Component | Responsibility | Status |
|-----------|---|---|
| DianaOrchestrator | Main coordination | 🏗️ W4-5 |
| ToolRegistry | Available tools + their use | 🏗️ W3-4 |
| MemorySystem | Workspace history + context | 🏗️ W3-4 |
| ReasoningEngine | Analysis + planning | 🏗️ W4 |
| ExecutionEngine | Act on decisions | 🏗️ W4-5 |
| LearningSystem | Pattern recognition + improvement | 🏗️ W5-6 |

**Success Criteria:**
- ✅ Diana can answer 80%+ of user questions correctly
- ✅ Diana suggests proactive actions
- ✅ Diana generates roadmaps
- ✅ Diana tracks progress
- ✅ Diana explains reasoning (trust records)
- ✅ Diana improves as it learns from mission data

**APIs (Required):**
```
POST /diana/chat
GET /diana/workspace/:id/memory
POST /diana/tools/execute
GET /diana/mission/:id/suggestions
POST /diana/feedback
```

**Diana Integration:**
```
Tool: GenerateRoadmap
  Input: mission
  Output: structured roadmap
  
Tool: AnalyzeProgress
  Input: mission, timeline
  Output: analysis + suggestions
  
Tool: SuggestNextActions
  Input: mission, current_state
  Output: ranked action suggestions
```

**Completion Criteria (By End of Week 5):**
- ✅ Diana can generate roadmaps
- ✅ Diana can analyze progress
- ✅ Diana can suggest next steps
- ✅ Diana's explanations are clear
- ✅ Diana learns from user feedback
- ✅ Diana improves week-over-week

---

### System 4: Progress Engine

**What It Is:**
The system that measures meaningful progress toward goals.

**What It Does:**
1. User defines goal + success criteria
2. System tracks work items
3. System calculates progress (not just task count)
4. System identifies blockers
5. Diana is alerted when progress changes
6. User sees meaningful progress indicators

**Why It Matters:**
Without Progress Engine, users don't know if they're actually progressing.

With it, they can see **meaningful outcomes, not just busy work**.

**Technical Components:**

| Component | Responsibility | Status |
|-----------|---|---|
| ProgressCalculator | Calculate meaningful progress | 🏗️ W3 |
| MetricsTracker | Track KPIs | 🏗️ W3 |
| BlockerDetector | Identify obstacles | 🏗️ W4 |
| ProgressNotifier | Alert on changes | 🏗️ W3-4 |
| ProgressVisualizer | UI for progress | 🏗️ W5 |

**Success Criteria:**
- ✅ Progress calculated based on meaningful outcomes (not task count)
- ✅ User can see progress dashboard
- ✅ Diana is notified of progress changes
- ✅ Blockers are automatically detected
- ✅ User can set custom success criteria
- ✅ Progress history is visible

**APIs (Required):**
```
GET /missions/:id/progress
GET /workspaces/:id/metrics
POST /missions/:id/update-metrics
GET /workspaces/:id/blockers
```

**Diana Integration:**
```
Tool: GetMissionProgress
  Input: mission_id
  Output: current progress, trends, blockers
  Use: Diana knows where mission stands
  
Tool: UpdateProgress
  Input: mission_id, metric_updates
  Output: updated progress
  Use: Diana can log progress autonomously
```

**Completion Criteria (By End of Week 5):**
- ✅ Progress accurately reflects outcomes
- ✅ Metrics tracked over time
- ✅ Trends are visible
- ✅ Blockers are identified
- ✅ Diana helps remove blockers
- ✅ Users see progress → get motivated

---

### System 5: Trust Engine

**What It Is:**
The system that makes every AI action transparent and explainable.

**What It Does:**
1. Diana takes action
2. Action produces event + trust record
3. Trust record documents:
   - What Diana suggested
   - Why Diana suggested it
   - What data informed it
   - How confident Diana is
   - What assumptions exist
4. User can view trust record anytime
5. User can validate or challenge decision

**Why It Matters:**
Without Trust Engine, users distrust Diana.

With it, users **understand and trust Diana's reasoning**.

**Technical Components:**

| Component | Responsibility | Status |
|-----------|---|---|
| EventService | Log every action | 🏗️ W2 |
| TrustRecordGenerator | Create trust records | 🏗️ W2-3 |
| ExplanationEngine | Format trust records naturally | 🏗️ W5 |
| AuditService | Maintain immutable audit trail | 🏗️ W2 |
| UndoSystem | Undo/roll-back capability | 🏗️ W5-6 |

**Success Criteria:**
- ✅ 95%+ of Diana actions have trust records
- ✅ User can click "Why?" on any suggestion
- ✅ Explanation is clear + understandable
- ✅ User can see what data was used
- ✅ User can challenge Diana's reasoning
- ✅ All actions are immutably logged

**APIs (Required):**
```
POST /events/log
GET /missions/:id/events
GET /events/:id/trust-record
GET /diana/suggestion/:id/explanation
POST /events/:id/challenge
```

**Diana Integration:**
```
Tool: LogAction
  Input: action, reason, sources, confidence
  Output: event + trust_record
  Use: Every Diana action logs itself
  
Tool: ExplainDecision
  Input: event_id
  Output: natural language explanation
  Use: UI shows explanation to user
```

**Completion Criteria (By End of Week 6):**
- ✅ Every action traceable
- ✅ Explanations understandable
- ✅ Trust records immutable
- ✅ Audit trail complete
- ✅ Undo works reliably
- ✅ Users understand Diana's reasoning

---

## Implementation Timeline

### Week 2: Trust Engine Foundation
- EventService + TrustRecord model
- Event logging on all operations
- Basic activity timeline
- **Outcome:** Every action produces event

### Week 3: Document Generator + Task Management
- DocumentGeneratorService (roadmaps, plans)
- TaskService (CRUD + status)
- Progress calculation foundation
- **Outcome:** Users can generate documents + track tasks

### Week 4: Diana Reasoning
- DianaReasoningService (roadmap generation)
- Intent detection
- Trust records for AI actions
- **Outcome:** Diana generates roadmaps + explains them

### Week 5: Activity Timeline + Explanation
- Timeline UI
- ExplanationEngine (natural language)
- Undo capability
- **Outcome:** Users see mission history + understand all changes

### Week 6: End-to-End Polish + Demo
- Integration testing (all 5 systems together)
- Performance optimization
- Documentation
- Demo preparation
- **Outcome:** Production-ready system

---

## The Success Threshold

**By End of CORE Phase (Week 6), the system must prove:**

1. **User can create mission + auto-provision workspace** ✅ (already true)
2. **Diana understands mission context** ✅ (already true)
3. **User can generate roadmap via Diana** 🏗️ (W3)
4. **User can create + track tasks** 🏗️ (W3)
5. **User can see meaningful progress** 🏗️ (W3-4)
6. **Diana proactively suggests actions** 🏗️ (W4)
7. **Diana explains every suggestion** 🏗️ (W2-3)
8. **User understands Diana's reasoning** 🏗️ (W5)
9. **Complete mission workflow works** 🏗️ (W6)
10. **System is production-ready** 🏗️ (W6)

If all 10 are true, CORE Phase is complete.

---

## After CORE Phase: What's Deferred

Until CORE Phase is complete, these features are **explicitly deferred:**

❌ Collaboration (share missions with team)
❌ Marketplace (third-party integrations)
❌ Mobile app
❌ Voice interface
❌ Payments + billing
❌ Enterprise features (SSO, audit logs)
❌ Advanced analytics
❌ Integrations (Slack, calendar, etc.)
❌ White-label
❌ Offline mode

**Why:** These are valuable but don't test the core hypothesis.

**When they're built:** After Project One Hundred validates the core.

---

## The Five Systems Interdependencies

```
Mission Engine (System 1)
  ↓
Workspace Orchestrator (System 2)
  ↓
┌─────────────────────────────────┐
│                                 │
Diana Orchestrator (S3) ← → Progress Engine (S4)
│                                 │
└─────────────────────────────────┘
  ↓
Trust Engine (System 5)
```

**Flow:**
1. User creates mission (System 1)
2. Workspace auto-provisions (System 2)
3. Diana loads mission context (System 3)
4. Diana sees progress metrics (System 4)
5. Diana suggests action (System 3)
6. Action logged with explanation (System 5)

**Each system builds on previous:**
- System 1 enables System 2
- System 2 enables Systems 3, 4
- System 3 + System 4 enable System 5
- System 5 ties everything together

---

## Verification: The CORE Phase Checklist

### Week 2 Checkpoint
- [ ] All mission operations produce events
- [ ] TrustRecord model working
- [ ] Activity timeline API responding
- [ ] EventService tested

### Week 3 Checkpoint
- [ ] DocumentGeneratorService implemented
- [ ] TaskService CRUD working
- [ ] Progress calculation functioning
- [ ] Diana knows about tasks + docs

### Week 4 Checkpoint
- [ ] DianaReasoningService working
- [ ] Roadmap generation tested
- [ ] Trust records created for AI actions
- [ ] Intent detection accurate

### Week 5 Checkpoint
- [ ] Timeline UI rendering
- [ ] Explanations clear + understandable
- [ ] Undo capability working
- [ ] All systems integrated

### Week 6 Checkpoint (CORE Phase Complete)
- [ ] End-to-end demo works (<10 min)
- [ ] All 10 success criteria met
- [ ] Production deployment ready
- [ ] Project One Hundred can launch

---

## The CORE Phase Completion Definition

**CORE Phase is complete when:**

✅ Any user can:
1. Define a goal (2 minutes)
2. Create a mission (1 minute)
3. See auto-provisioned workspace (instant)
4. Ask Diana for help (1 minute)
5. Receive roadmap (1-2 minutes)
6. Understand why (1 minute)
7. Create tasks (5 minutes)
8. Track progress (real-time)
9. Complete mission (weeks/months)

✅ All 9 steps happen within the AIGINVEST platform
✅ Diana is present throughout
✅ Every action is explained
✅ System is reliable + performant
✅ User feels guided + supported

**Time from start to end:** ~30 minutes for user orientation

**That's success.**

---

**This definition is LOCKED.**

No features ship before CORE Phase is complete.

Every week, we verify progress toward these five systems.

By Week 6, AIGINVEST will be ready to serve 100 real people.

---

**Effective Date:** July 7, 2026  
**Maintained By:** Product Lead + Engineering Lead  
**Next Update:** Every Friday (progress + blockers)
