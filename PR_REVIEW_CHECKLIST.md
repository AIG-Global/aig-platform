# PR Review Checklist: Architecture Compliance

**Version:** 1.0  
**Status:** REQUIRED for all PRs  
**Effective:** July 7, 2026  
**Parent Document:** [AIGINVEST_REFERENCE_ARCHITECTURE.md](AIGINVEST_REFERENCE_ARCHITECTURE.md)

---

## Overview

Every pull request must answer 10 architecture questions.

If all 10 are addressed with "yes" or clear reasoning, the PR is ready to merge.

If any question is unclear, the author returns to address it.

This checklist enforces the Reference Architecture.

---

## The 10 Questions

### Question 1: Which Domain Does This Belong To?

**What We're Asking:**
Is this feature clear about what it does?

**Examples of Good Answers:**
- ✅ "This is a Document CRUD service — belongs in Mission layer"
- ✅ "This adds memory persistence — belongs in Diana layer"
- ✅ "This is the mission creation UI — belongs in Experience layer"

**Examples of Bad Answers:**
- ❌ "Various improvements"
- ❌ "Bug fixes and features"
- ❌ "Random updates"

**How to Verify:**
In PR description, section "Domain":
```
Domain: Mission Layer
Service: MissionService
Responsibility: Goal → Mission lifecycle management
```

---

### Question 2: Which Layer Does It Affect?

**What We're Asking:**
Does the PR modify only one layer, or does it cross layers?

**The Five Layers:**
```
Layer 5: Experience (UI)
Layer 4: Diana (AI)
Layer 3: Mission (Business logic)
Layer 2: Platform (Infrastructure)
Layer 1: Infrastructure (Cloud, DB)
```

**Examples of Good Answers:**
- ✅ "Only modifies Layer 3 (Mission service) + Layer 5 (UI component)"
- ✅ "Only modifies Layer 4 (Diana reasoning engine)"
- ✅ "Only modifies Layer 2 (Event model) + Layer 3 (event logging calls)"

**Examples of Bad Answers:**
- ❌ "Affects all layers"
- ❌ "Unclear which layers"
- ❌ "Might affect something else"

**How to Verify:**
In PR description, section "Architecture":
```
Architecture:
- Primary: Layer 3 (Mission Service)
- Secondary: Layer 5 (UI components for mission creation)
- Infrastructure: No Layer 2 changes
```

---

### Question 3: Does It Follow the Three Rules?

**The Three Rules:**

**Rule 1: Diana Can Understand It**
- Every feature Diana might use has a Diana tool
- Feature is discoverable + explainable

**Rule 2: Everything Is an API**
- REST API exists
- SDK exists (or planned)
- Diana tool exists (or planned)

**Rule 3: Single Responsibility**
- Service does one thing
- No god objects
- Clear boundaries

**Examples of Good Answers:**
- ✅ "MissionService has single responsibility: mission lifecycle. APIs: REST + SDK + Diana tools all defined"
- ✅ "DocumentService handles CRUD only. Versioning is separate. Diana tools defined."

**Examples of Bad Answers:**
- ❌ "Does many things"
- ❌ "Diana won't understand this"
- ❌ "No API, just internal calls"

**How to Verify:**
In PR description, section "Rules Compliance":
```
Rule 1 (Diana): ✅ Diana tool "GenerateRoadmap" defined + implemented
Rule 2 (API): ✅ REST API, SDK, Diana tool all present
Rule 3 (Single Responsibility): ✅ MissionService = mission lifecycle only
```

---

### Question 4: How Does Diana Understand It?

**What We're Asking:**
If this feature exists, can Diana use it?

**Examples of Good Answers:**
- ✅ "Diana tool: CreateDocument(type, title, content)"
- ✅ "Diana tool: GetMissionProgress(mission_id)"
- ✅ "Diana can access via REST API /documents/create"

**Examples of Bad Answers:**
- ❌ "Diana doesn't need to understand this"
- ❌ "Diana can't use this feature"
- ❌ "No Diana integration planned"

**How to Verify:**
In PR description, section "Diana Integration":
```
Diana Integration:
Tool: UpdateMissionStatus
  Input: mission_id, new_status
  Output: updated mission
  When: User asks to pause mission OR Diana proactively suggests

Tool: GetMissionContext
  Input: mission_id
  Output: mission details + progress
  When: Diana needs mission context for suggestions
```

If no Diana integration applies, explain why:
```
Diana Integration: N/A
Reason: This is internal infrastructure change (database optimization)
        Does not create new user capability
```

---

### Question 5: Does It Respect Layer Boundaries?

**What We're Asking:**
Does this PR jump across layers without going through contracts?

**Bad Pattern (violates boundaries):**
```javascript
// Layer 5 (UI) directly modifies Layer 2 (database)
❌ db.missions.raw("UPDATE missions SET...")
```

**Good Pattern (uses contracts):**
```javascript
// Layer 5 calls Layer 3
✅ await missionService.updateStatus(missionId, "active")

// Layer 3 calls Layer 2
✅ await this.prisma.mission.update(...)
```

**Examples of Good Answers:**
- ✅ "Layer 5 → Layer 3 via API (POST /missions/:id/status)"
- ✅ "Layer 4 → Layer 3 via EventService.log()"
- ✅ "Layer 3 → Layer 2 via Prisma ORM"

**Examples of Bad Answers:**
- ❌ "Layer 5 directly accesses database"
- ❌ "Diana directly modifies events table"
- ❌ "UI calls database stored procedures"

**How to Verify:**
In PR description, section "Layer Boundaries":
```
Layer Boundaries:
- ✅ All Layer 5 calls go through Layer 3 APIs
- ✅ All Layer 3 calls use Prisma (Layer 2)
- ✅ No cross-layer jumps
- ✅ Contracts respected
```

---

### Question 6: What's the Contract?

**What We're Asking:**
When this service is called, what are the input/output contracts?

**Examples of Good Answers:**
```javascript
// Input contract
Input: {
  missionId: string,    // Required, UUID format
  status: string,       // Required, enum: planning|active|paused|completed|archived
  reason: string        // Optional, explanation
}

// Output contract
Output: {
  id: string,
  status: string,
  updatedAt: ISO8601,
  trust_record: {
    action: string,
    reason: string,
    timestamp: ISO8601
  }
}

// Error contract
Errors: {
  MissionNotFound,      // 404
  InvalidStatusChange,  // 422
  Unauthorized,         // 403
}
```

**Examples of Bad Answers:**
- ❌ "Input: anything"
- ❌ "Output: ???"
- ❌ "Errors: not defined"

**How to Verify:**
In PR description, section "API Contracts":
```
API Contracts:

POST /missions/:id/status
  Request: { status: string, reason?: string }
  Response: { mission: {...}, trust_record: {...} }
  Errors: MissionNotFound, InvalidStatusChange, Unauthorized
  Versioning: v1 (stable)

GET /missions/:id/context
  Response: { goal, timeline, status, progress, workspace }
  Cache: 5 minutes
  Versioning: v1 (stable)
```

---

### Question 7: How Is It Tested?

**What We're Asking:**
Can we verify this works without manual testing?

**Automated Tests Required:**
- Unit tests (service logic)
- Integration tests (API endpoints)
- E2E tests (full workflow)

**Examples of Good Answers:**
- ✅ "Unit tests: 95% coverage of MissionService"
- ✅ "Integration tests: Mission creation, status changes, timeline"
- ✅ "E2E tests: User can create goal → mission → see timeline"

**Examples of Bad Answers:**
- ❌ "Manual testing only"
- ❌ "Will test later"
- ❌ "Test coverage: 30%"

**How to Verify:**
In PR description, section "Testing":
```
Testing:
- Unit: 92% coverage (MissionService, DocumentService)
  New tests: 34 test cases
  
- Integration: 
  ✅ POST /missions creates mission + auto-provisions workspace
  ✅ PATCH /missions/:id/status validates state transitions
  ✅ GET /missions/:id/timeline returns events
  
- E2E:
  ✅ User creates goal → mission → sees workspace
  ✅ Diana accesses mission context
  
- Performance:
  ✅ Mission creation <500ms
  ✅ Timeline query <100ms (100 events)
```

---

### Question 8: How Is It Observed?

**What We're Asking:**
If something breaks in production, how do we know?

**Metrics Required:**
- Request latency (P50, P95, P99)
- Error rate
- Business metrics (missions created, tasks completed)
- Diana metrics (suggestions made, accepted rate)

**Examples of Good Answers:**
- ✅ "Mission creation latency tracked (target: <500ms)"
- ✅ "Error rate monitored (target: <0.1%)"
- ✅ "Diana suggestion acceptance rate tracked (target: >50%)"

**Examples of Bad Answers:**
- ❌ "No metrics"
- ❌ "We'll monitor later"
- ❌ "Unclear what to monitor"

**How to Verify:**
In PR description, section "Observability":
```
Observability:
- Metric: mission_creation_latency_ms
  Target: P95 <500ms
  Alert: If P95 >1000ms
  
- Metric: diana_suggestion_acceptance_rate
  Target: >50%
  Alert: If <40% (indicates quality issue)
  
- Metric: mission_completion_rate
  Target: >65% (by week 16)
  Dashboard: Project One Hundred dashboard
  
- Logging:
  Every mission operation: action, actor, timestamp, result
  Every Diana action: reasoning, sources, confidence
  All errors: error type, context, stack trace
```

---

### Question 9: How Is It Secured?

**What We're Asking:**
Who can do what with this feature?

**Security Requirements:**
- Authentication (who are you?)
- Authorization (what can you do?)
- Audit trail (who did what?)
- Encryption (if sensitive data)

**Examples of Good Answers:**
- ✅ "Only authenticated users can create missions"
- ✅ "Only workspace owner can modify settings"
- ✅ "All API calls require x-user-id header"
- ✅ "All actions logged with user ID + timestamp"

**Examples of Bad Answers:**
- ❌ "No auth checks"
- ❌ "Security: TBD"
- ❌ "Anyone can access"

**How to Verify:**
In PR description, section "Security":
```
Security:
- Authentication: ✅ x-user-id header required
- Authorization: ✅ Can only modify own missions
- Audit Trail: ✅ All actions logged (user_id, action, timestamp)
- Encryption: N/A (no sensitive data beyond standard auth)
- Rate Limiting: ✅ 100 requests/minute per user

Access Matrix:
  User: can create own missions
  User: can modify own missions
  Owner: can delete missions
  Admin: can audit all actions
```

---

### Question 10: 10-Year Principle — Still Happy in 10 Years?

**What We're Asking:**
If AIGINVEST succeeds at 100x scale, would this decision still be right?

**Examples of Good Answers:**
- ✅ "PostgreSQL choice: Yes. Still using at 1M+ users"
- ✅ "Event sourcing: Yes. Still immutable + queryable at any scale"
- ✅ "Layer architecture: Yes. Can split to microservices if needed"

**Examples of Bad Answers:**
- ❌ "Not sure"
- ❌ "Hope so"
- ❌ "We'll change it later"

**How to Verify:**
In PR description, section "10-Year Test":
```
10-Year Test:
- This change: Adding event logging to all operations
- Scale scenario: 1M users, 100 events/min per user
- Decision still valid? ✅ YES
  Reason: Event sourcing is timeless architecture pattern
          Can archive old events without losing audit trail
          Scales horizontally (sharding by user)
          
Alternative scenarios:
  - If Diana becomes more powerful: Still need audit trail
  - If regulations require compliance: Event sourcing is advantage
  - If team grows to 100: Clear pattern for new developers
```

---

## How to Use This Checklist

### For PR Authors

**Before opening a PR:**
1. Copy the "PR Template" below
2. Answer all 10 questions thoroughly
3. Include in PR description
4. If any answer is "unclear" or "TBD", don't open PR yet

**If reviewer asks for changes:**
1. Update code + checklist
2. Re-explain the changed answers
3. Re-submit for review

### For PR Reviewers

**When reviewing a PR:**
1. Read the 10-question checklist first
2. Verify each answer is clear and complete
3. Ask for clarification if needed
4. Don't approve until all 10 are satisfied
5. If multiple answers are unclear, ask author to revise

**Red Flags:**
- ❌ Domain unclear
- ❌ Layer boundaries violated
- ❌ Diana can't understand feature
- ❌ <80% test coverage
- ❌ No observability metrics
- ❌ Security unclear
- ❌ 10-year test not discussed

---

## PR Template

Copy this into every PR description:

```markdown
## Architecture Review (Required)

### 1. Domain
[Which service? Which responsibility?]

### 2. Layers Affected
[Which of the 5 layers does this change?]
- Layer 5 (Experience): [Yes/No]
- Layer 4 (Diana): [Yes/No]
- Layer 3 (Mission): [Yes/No]
- Layer 2 (Platform): [Yes/No]
- Layer 1 (Infrastructure): [Yes/No]

### 3. Three Rules Compliance
- Rule 1 (Diana Understands): [✅/❌] [Explanation]
- Rule 2 (Everything Is API): [✅/❌] [Explanation]
- Rule 3 (Single Responsibility): [✅/❌] [Explanation]

### 4. Diana Integration
[How does Diana use this? Include Diana tool definitions]

### 5. Layer Boundaries
[Does this respect layer contracts? Any layer jumps?]

### 6. API Contracts
[Input/output/error contracts for new/modified APIs]

### 7. Testing
- Unit tests: [Coverage %]
- Integration tests: [Scenarios covered]
- E2E tests: [User workflows]

### 8. Observability
- Key metrics: [What do we track?]
- Alerts: [When do we alert?]
- Logs: [What do we log?]

### 9. Security
- Authentication: [How do we verify user?]
- Authorization: [What can user do?]
- Audit trail: [What do we record?]

### 10. 10-Year Test
- Architectural decision: [What did we decide?]
- Scale scenario: [How does this scale?]
- Still valid at 10x scale: [✅ Yes / ❌ No]
- Why: [Reasoning]

---

[Rest of PR description + changes]
```

---

## Enforcement

### Phase 1 (Weeks 2-3): Recommended
All PRs should answer the 10 questions.

Reviewers use the checklist but don't block on missing answers yet.

Goal: Get team familiar with architectural thinking.

### Phase 2 (Weeks 4-6): Required
All PRs must answer all 10 questions.

If any answer is missing or unclear, PR is blocked.

Goal: Enforce architecture compliance.

### Phase 3+ (Ongoing): Automated
Eventually, PR checklist is automated (bot validates).

But manual review remains important for nuance.

---

## The Principle

This checklist isn't bureaucracy.

It's a **thinking tool**.

Answering the 10 questions forces you to think clearly about:
- Where your code belongs
- Whether it respects architecture
- How Diana will use it
- If it will scale

The result: **Better code. Better architecture. Better product.**

---

**This checklist is LOCKED.**

Every PR must use it.

No exceptions.

---

**Effective Date:** July 7, 2026  
**Maintained By:** Architecture Council  
**Next Review:** August 7, 2026
