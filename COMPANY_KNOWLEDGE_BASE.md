# Company Knowledge Base: Permanent Reference Structure

**Version:** 1.0  
**Status:** LOCKED — Governs how organizational knowledge is organized  
**Parent Document:** [AIGINVEST_OS.md](AIGINVEST_OS.md)

---

## Overview

The Company Knowledge Base is the permanent reference for how AIGINVEST works.

It consists of four collections:

1. **Decisions** — Why we chose what we chose
2. **Architecture** — How systems work
3. **Product** — What users experience
4. **Operations** — How the company runs

Every future employee reads from these collections.

---

## Collection 1: Decisions

### Purpose
Capture the reasoning behind major technical, product, and strategic choices.

### When to Create a Decision Record
- Major architectural choice (database, framework, pattern)
- Strategic pivot or rejection of an option
- Trade-off that affects multiple teams
- Decision that would create questions for future employees

### Decision Record Template

```markdown
# Decision: [Decision Title]

**Date:** YYYY-MM-DD
**Status:** [Locked | Under Review | Superseded]
**Maintainer:** [Person/Team Responsible]

## Context
[What problem were we trying to solve?]
[What constraints existed?]
[Who was involved in the decision?]

## Options Considered
1. [Option A]
   - Pros: [...]
   - Cons: [...]
   - Estimated effort: [...]
   
2. [Option B]
   - Pros: [...]
   - Cons: [...]
   - Estimated effort: [...]

3. [Option C]
   - Pros: [...]
   - Cons: [...]
   - Estimated effort: [...]

## Decision
**We chose: [Option X]**

## Reasoning
[Why this choice over others?]
[What was the deciding factor?]

## Trade-offs
[What do we give up with this choice?]
[What could we not have if we chose this?]

## Assumptions
[What assumptions underpin this decision?]
[What would have to change for this to be wrong?]

## Impact
[How does this affect other systems?]
[What becomes easier/harder?]

## 100-Year Test
[Would we still be happy with this decision at 100x scale?]

## Reversibility
[How hard would it be to undo this decision?]
[What would a reversal cost?]

## Next Review
[When should we revisit this decision?]
[What conditions would trigger a re-evaluation?]
```

### Example Decision Records

#### Decision 1: PostgreSQL as Primary Database

```markdown
# Decision: PostgreSQL as Primary Database

**Date:** 2026-07-07
**Status:** Locked
**Maintainer:** Engineering Lead

## Context
Building AIGINVEST platform requires reliable, consistent data storage.
Users' missions, documents, and Diana's actions must never be lost.
Need to support complex queries for analytics and timeline generation.
Team familiar with SQL but exploring modern options.

## Options Considered
1. PostgreSQL (traditional SQL)
   - Pros: ACID compliance, JSON support, proven at scale
   - Cons: Vertical scaling eventually required, ops overhead
   - Estimated effort to setup: 2 days
   
2. MongoDB (NoSQL document)
   - Pros: Flexible schema, horizontal scaling, easy replication
   - Cons: Weaker consistency guarantees, larger data size
   - Estimated effort: 3 days
   
3. DynamoDB (Serverless NoSQL)
   - Pros: Fully managed, auto-scaling, low ops overhead
   - Cons: Query limitations, cost at scale, vendor lock-in
   - Estimated effort: 2 days (learning curve)

## Decision
**We chose: PostgreSQL**

## Reasoning
AIGINVEST's core data (missions, user goals, work history) requires ACID guarantees.
Eventual consistency is unacceptable for financial/outcome-critical data.
JSON support in PostgreSQL handles flexible fields without requiring NoSQL.
Team expertise + ecosystem maturity reduce risk.
Can scale to 100M+ rows before architectural changes needed.

## Trade-offs
PostgreSQL eventual need for read replicas + sharding (at 1M+ users).
Requires more database administration than managed services.
Vertical scaling bottleneck before horizontal scaling needed.

## Assumptions
1. ACID consistency is more important than ultimate scalability
2. Team can handle database administration for 3+ years
3. Growth rate allows time to migrate before hitting limits

## Impact
- All APIs must handle transactional integrity (simpler for developers)
- Event sourcing becomes natural (append-only, immutable)
- Reporting + analytics queries straightforward
- Backup/restore procedures well-documented

## 100-Year Test
PostgreSQL is 30+ years old, still widely used, unlikely to disappear.
This decision remains valid even at 1000x scale (just need ops expertise).
✅ **Passes 100-year test.**

## Reversibility
Difficulty: Hard (would require full data migration)
Cost if needed: Estimated 4 weeks + 2 engineers + possible downtime
Time horizon: Acceptable for 3+ years

## Next Review
August 2027 (after Project One Hundred completes)
Trigger events: >100M rows, >1000 concurrent queries, cost exceeds $1000/month
```

#### Decision 2: NestJS Framework

```markdown
# Decision: NestJS for Backend Framework

**Date:** 2026-07-07
**Status:** Locked
**Maintainer:** Engineering Lead

## Context
Need TypeScript-based backend supporting REST APIs + WebSockets.
Must be productive for small team (2-3 engineers initially).
Need dependency injection + modular architecture for scale.

## Options Considered
1. NestJS
   - Pros: Built for TypeScript, DI, decorators, well-structured
   - Cons: Adds abstraction layer, learning curve
   
2. Express.js
   - Pros: Minimal, lightweight, huge ecosystem
   - Cons: No structure, lots of boilerplate, easy to make mistakes
   
3. Fastify
   - Pros: Performance, modern, TypeScript support
   - Cons: Smaller ecosystem than Express, less documentation

## Decision
**We chose: NestJS**

## Reasoning
Enforces structure from day one (helps small team avoid mistakes).
Dependency injection enables clean testing + modularity.
Decorators reduce boilerplate compared to Express.
Growing team can onboard new engineers with clear patterns.
Angular developers (growing skillset) understand decorators naturally.

## Trade-offs
Cannot use JavaScript (TypeScript required).
Adds startup time vs. Express (not significant at v1.0 scale).
Opinions can feel restrictive (but actually protect code quality).

## Assumptions
1. Team will grow beyond 2 people (thus structure matters)
2. TypeScript is non-negotiable (type safety important)
3. Learning curve investment pays off over time

## Impact
- All new engineers must learn NestJS patterns
- Module-based architecture forces good separation of concerns
- Middleware + guards + interceptors provide standard security patterns
- Easy to add features without breaking existing code

## 100-Year Test
NestJS is young (released 2017) but maturing rapidly.
Framework-agnostic (built on Express, could swap adapters).
Pattern-based rather than library-based (transferable skills).
✅ **Passes 100-year test with medium confidence** (younger framework than PostgreSQL)

## Reversibility
Difficulty: Very Hard (entire codebase is NestJS)
If needed: Would need to rewrite all backend code (8+ weeks)
Time horizon: 5+ years before reconsideration

## Next Review
August 2027
Trigger events: Framework becomes unmaintained, team expresses strong friction, better alternative emerges
```

#### Decision 3: Reject Microservices for v1.0

```markdown
# Decision: Monolithic Architecture for v1.0 (Reject Microservices)

**Date:** 2026-07-07
**Status:** Locked
**Maintainer:** Engineering Lead

## Context
Planning architecture for AIGINVEST platform.
Team is 2-3 engineers.
Considering whether to modularize into microservices from the start.

## Options Considered
1. Monolith (single deployment unit)
   - Pros: Simple deployment, fast development, shared database
   - Cons: Scaling challenges eventually, database becomes bottleneck
   
2. Microservices from Start
   - Pros: Independent scaling, clear boundaries
   - Cons: Operational complexity (Kubernetes, observability), slower development, data consistency nightmare

## Decision
**We chose: Monolith (for v1.0 only)**

## Reasoning
Microservices introduce 4-6x operational complexity.
With 2-3 engineers, ops overhead cannot be afforded.
99% of scaling problems are vertical (database) not horizontal (service count).
Monolith allows rapid iteration on product/features.
Easy to extract services later when benefits exceed costs.

## Trade-offs
Service boundaries less obvious (accepted, can refactor).
Cannot scale individual services independently (acceptable for v1.0).
Database becomes shared bottleneck earlier than with microservices (acceptable, still has runway).

## Assumptions
1. Team size stays <5 for 12+ months
2. Single-digit QPS for first 12 months
3. Service extraction is possible later

## Impact
- Single Git repo + deployment (simpler)
- All engineers can touch all code (good for v1.0)
- Database design becomes critical (shared for all services)
- Testing is simpler (single integration test suite)

## 100-Year Test
Microservices are trend-dependent. Monoliths are timeless.
This decision is easily reversible (extract services at 100x scale).
✅ **Passes 100-year test** (pragmatic, reversible)

## Reversibility
Difficulty: Medium (requires careful extraction)
Cost if needed: Estimated 4-6 weeks to extract first service
Time horizon: 18+ months before extraction needed

## Next Review
January 2027 (when team > 5 or QPS > 100)
Trigger events: Team grows, scaling requests increase, service extraction becomes economically justified
```

---

## Collection 2: Architecture

### Purpose
Document how systems work, their boundaries, and how they integrate.

### When to Create an Architecture Document
- Major system component (service, model, engine)
- Integration point between services
- Infrastructure pattern used throughout
- Scaling-critical system

### Architecture Document Template

```markdown
# Architecture: [System Name]

**Version:** 1.0
**Status:** [Current | Deprecated | Evolving]
**Maintainer:** [Team]
**Last Updated:** YYYY-MM-DD

## Purpose
[What does this system do?]
[What problem does it solve?]
[Why is it important?]

## Components
[List major components]

### Component A
- Responsibility: [...]
- Interfaces: [what it exports]
- Dependencies: [what it requires]

### Component B
- Responsibility: [...]
- Interfaces: [...]
- Dependencies: [...]

## Data Flow
[How does data move through the system?]
[Include diagram if complex]

## Integration Points
[How does this system connect to others?]
[What APIs does it expose?]
[What systems does it depend on?]

## Scalability
[How does this scale?]
[Current limits?]
[Bottlenecks?]

## Monitoring
[What should we monitor?]
[What metrics matter?]
[What would indicate problems?]

## Future Evolution
[How might this change?]
[What's the long-term direction?]

## References
[Links to related code, docs, decisions]
```

### Example: Trust Engine Architecture

```markdown
# Architecture: Trust Engine

**Version:** 1.0
**Status:** Current (New in Week 2)
**Maintainer:** Engineering Lead
**Last Updated:** 2026-07-07

## Purpose
Make every AI action in AIGINVEST transparent and explainable to users.
When Diana suggests something, users can understand:
- What Diana is suggesting
- Why Diana suggests it
- What data informed the suggestion
- How confident Diana is

## Components

### Event Model
- Table: events
- Responsibility: Record every action (user + AI)
- Fields: id, type, actor, action, reason, dataUsed, result, createdAt
- Immutable: Yes

### TrustRecord Model
- Table: trustRecords
- Responsibility: Explain AI decisions
- Fields: id, actionId, reason, sources[], confidence, assumptions[], reversibility
- Immutable: Yes (until user modifies)

### EventService
- Methods: log(), createTrustRecord(), getTimeline(), explainAction()
- Responsibility: Business logic for events + trust
- Dependency: Prisma, Logger

### Trust Engine API
- Endpoints: POST /events, GET /timeline, GET /explain/:actionId
- Responsibility: REST interface to trust data
- Authentication: x-user-id required

### Explanation UI
- Components: ExplanationModal, ReasoningCard, SourcesList
- Responsibility: Render trust records to users
- Dependency: React, Diana service for formatting

## Data Flow

```
User Action
    ↓
Controller (mission.controller)
    ↓
Service (mission.service)
    ↓
Event Created (Event model)
    ↓
Trust Record Created (TrustRecord model)
    ↓
User Views Timeline
    ↓
GET /timeline API
    ↓
Queries Event + TrustRecord
    ↓
Returns to UI
    ↓
User Clicks "Why?"
    ↓
Explanation Modal Shows Trust Record
```

## Integration Points
- MissionService: Calls eventService.log() on every action
- DianaService: Calls eventService.createTrustRecord() for suggestions
- UserUI: Displays explanations from /explain endpoint
- Analytics: Consumes Event data for reporting

## Scalability
- Events: Append-only (simple scaling)
- Current limit: ~1M events/day (1000/min)
- Bottleneck: PostgreSQL write throughput
- At 100k users × 10 events/day: 1M events/day ✅ Fine
- At 1M users × 10 events/day: 10M events/day ⚠ Need Redis cache

## Monitoring
- Event insertion rate (per minute)
- Trust record creation latency (p95 <50ms)
- Explanation rendering time (p95 <200ms)
- Explanation click-through rate (target: >50%)
- Explanation comprehension (survey-based, target: >75%)

## Future Evolution
- Q4 2026: Event archival (keep last 1M, archive older)
- Q1 2027: Event streaming (real-time analytics)
- Q2 2027: Trust record versioning (track Diana learning)
- Q3 2027: Federated trust (multiple AI systems)

## References
- Decision: [Trust Engine Design](decision-link)
- Code: /apps/api/src/event/event.service.ts
- Spec: AIGINVEST_TECHNICAL_SPECIFICATION_v1.0.md
```

---

## Collection 3: Product

### Purpose
Document what users experience, how features work, and what success looks like.

### When to Create a Product Document
- User-facing feature
- End-to-end user flow
- Product decision that affects multiple teams
- Rollback or deprecation of a feature

### Product Document Template

```markdown
# Product: [Feature Name]

**Version:** 1.0
**Status:** [Concept | In Progress | Shipped | Deprecated]
**Owner:** [PM Name]
**Last Updated:** YYYY-MM-DD

## User Objective
[What does the user want to achieve?]
[Why do they want to achieve it?]

## User Flow
[Step-by-step walkthrough]
1. User [action]
2. System [response]
3. User [action]
...

## Success Criteria
[How do we know this feature succeeded?]
[What would users say if asked "did this work?"?]

## Failure Modes
[What can go wrong?]
[How do we detect it?]
[How do we recover?]

## Rollback Procedure
[If this feature breaks, how do we undo it?]
[What data is at risk?]
[How long does rollback take?]

## Metrics + Targets
[What KPIs matter?]
[What's the target?]

## Alternatives Considered
[What other ways could we solve this?]
[Why did we choose this approach?]

## Notes for Future Iterations
[What would make this better?]
[What surprised us?]
[What should we test next?]
```

### Example: Mission Creation Feature

```markdown
# Product: Mission Creation

**Version:** 1.0
**Status:** Shipped (Week 1)
**Owner:** Product Manager
**Last Updated:** 2026-07-14

## User Objective
User wants to define a bounded, outcome-focused effort (mission).
They articulate what they're trying to achieve and in what timeframe.
AIGINVEST auto-provisions the workspace and Diana begins helping.

## User Flow
1. User clicks "New Mission" on dashboard
2. Form appears: Title, Description, Objective, Priority, Deadline
3. User fills form (typical time: 2-3 minutes)
4. User clicks "Create Mission"
5. System creates mission + auto-provisions workspace + project
6. User is redirected to workspace (ready to work)
7. Diana greets: "You're working on [title]. Goal: [objective]"

## Success Criteria
- User can create a mission in <3 minutes
- User understands what mission is for
- Diana immediately knows the mission context
- User feels ready to start working

## Failure Modes
- User fills form incorrectly (validation error + help text)
- Form takes >5 minutes (problem: unclear questions)
- Diana doesn't know mission context (problem: API integration)
- User can't find "New Mission" button (problem: navigation)

## Rollback Procedure
If mission creation breaks:
1. Disable form (show "missions temporarily unavailable")
2. Redirect users to existing missions
3. Deploy fix
4. Re-enable form
5. Notify users via Diana
Estimated rollback time: 5 minutes

## Metrics + Targets
- Form completion rate: >90% (target: 90%+)
- Form abandonment: <10% (target: <10%)
- Time to create mission: <3 minutes (target: <5 min, <3 min ideal)
- User satisfaction: >4/5 stars (target: >4)
- Successful workspace auto-provision: 100% (target: 99%+)

## Alternatives Considered
1. Wizard-based creation (multi-step)
   - Rejected: Too slow, extra friction
2. Guided Diana chat to define mission
   - Rejected: Not in v1.0 (but revisit for v2.0)
3. Mission templates
   - Rejected: Reduces user agency
4. Single-field mission name (we chose this + form)
   - Rejected: Too little context for Diana

## Notes for Future Iterations
- Some users skip description field (might make optional)
- Priority field rarely used (maybe hide in v1.1)
- Deadline often unrealistic (consider warning if <1 week)
- Users want to upload files during mission creation (v1.5?)
- Users want to collaborate on mission creation (team feature)
```

---

## Collection 4: Operations

### Purpose
Document how the company operates, rituals, and processes.

### When to Create an Operations Document
- Recurring meeting or ritual
- Company process or workflow
- Decision-making framework
- Onboarding procedure

### Operations Document Template

```markdown
# Operations: [Process Name]

**Version:** 1.0
**Status:** [Active | Pilot | Deprecated]
**Owner:** [Role]
**Last Updated:** YYYY-MM-DD

## Purpose
[Why do we have this process?]
[What would break if we didn't?]

## Participants
[Who is involved?]
[What role does each play?]

## Schedule
[When does this happen?]
[How often?]
[How long?]

## Format
[How do we run this?]
[What's the structure?]

## Inputs
[What do we need before starting?]
[What preparation is required?]

## Outputs
[What's the result?]
[Where does it go?]
[Who uses it?]

## Success Indicators
[How do we know it's working?]
[What would failure look like?]

## Escalation
[What if something goes wrong?]
[Who do we ask for help?]

## Next Review
[When do we revisit this process?]
[What would trigger a change?]
```

### Example: Friday Ritual

```markdown
# Operations: Friday Ritual (Outcome Focus)

**Version:** 1.0
**Status:** Active
**Owner:** CEO
**Last Updated:** 2026-07-07

## Purpose
Shift organizational focus from features to outcomes.
Weekly reminder: We build software to enable user achievements, not to write code.
Keep team aligned on what matters.

## Participants
- All team members (required)
- Board members (optional)
- Selected beta users (invited occasionally)

## Schedule
- Every Friday, 4:00 PM - 4:30 PM
- 30 minutes total
- 5 minutes per team (if 3 teams)
- 5 minutes for synthesis

## Format
1. Each team shares: "What did users accomplish this week?"
   - Not: "What did we build?"
   - But: "Because of what we built, what could users do?"

2. Specific examples (stories, not abstractions)
   - Good: "Alpha user created 3-year business plan using Diana's roadmap"
   - Bad: "We shipped roadmap generation"

3. Metrics (if available)
   - Documents generated: 5
   - Time saved per user: avg 2.3 hours
   - User satisfaction: 4.2/5 stars

4. One surprise or learning
   - What surprised you this week?
   - What did users do you didn't expect?

## Inputs
- Usage metrics (from analytics)
- User feedback (from support + interviews)
- Shipped features (from Product track)
- Deployed changes (from Platform track)

## Outputs
- Recorded outcomes (archived in Notion database)
- Weekly transcript (sent to team + stakeholders)
- Monthly synthesis (shapes next month priorities)
- Quarterly review (measures progress toward vision)

## Success Indicators
- ✅ All team members attend
- ✅ Outcomes measurable (not vague)
- ✅ Users can describe impact in their own words
- ✅ Patterns emerge (repeated themes across weeks)
- ✅ By week 16, clear evidence: "Diana helped users achieve outcomes"

## Escalation
- If no outcomes to report: Investigate why (product issue? market issue?)
- If negative outcomes: Address immediately (what broke?)
- If outcomes don't align with mission: Strategy discussion needed

## Example (Week 2 Friday Ritual)

Product Team:
> "We shipped the Trust Engine and Activity Timeline. Beta user opened the timeline, 
> clicked 'Why?' on 5 Diana suggestions, and said 'This is exactly what I needed to 
> understand her thinking.' User rated explanation clarity 4.5/5. Users are accepting 
> Diana suggestions at higher rate (67% vs 45% before)."

Engineering Team:
> "We optimized event logging for scale. Can now handle 10x current traffic. 
> But discovered a bug where old events weren't being archived properly. 
> Fixed it. Added monitoring dashboard. Zero incidents this week."

Learning Team:
> "Interviewed 3 beta users. Surprise: Users don't want to understand Diana's ML 
> reasoning (too technical). They want to understand 'What should I do next?' 
> Simplifying explanations should help. Testing on Monday."

Synthesis:
> This week proved transparency works. Users want explanations in plain language, 
> not technical depth. Next week: Simplify explanation language, measure 
> comprehension lift. Diana's value increasing with each feature.

## Next Review
- Weekly execution (every Friday)
- Monthly effectiveness review (measure pattern emergence)
- Quarterly impact assessment (is it shifting culture?)

## Notes
- Originally 30 min, may shorten to 20 min as team scales
- Remote teams should join video (synchronous important)
- Outcomes recorded for future reference + onboarding
- New employees watch previous 4 weeks to understand culture
```

---

## Structure for Knowledge Base Storage

### Repository Organization

```
/knowledge-base/
├── decisions/
│   ├── 001-postgresql-primary-database.md
│   ├── 002-nestjs-framework.md
│   ├── 003-reject-microservices-v1.md
│   └── index.md (searchable listing)
│
├── architecture/
│   ├── trust-engine.md
│   ├── mission-service.md
│   ├── diana-service.md
│   └── index.md
│
├── product/
│   ├── mission-creation.md
│   ├── trust-engine-ui.md
│   ├── document-generator.md
│   └── index.md
│
├── operations/
│   ├── friday-ritual.md
│   ├── three-tracks-model.md
│   ├── engineering-compass.md
│   └── index.md
│
└── README.md (entry point)
```

### README for Knowledge Base

```markdown
# AIGINVEST Company Knowledge Base

Welcome. This is the permanent reference for how AIGINVEST works.

## Where to Start

**First time here?**
1. Read [EXECUTIVE_SUMMARY.md](../EXECUTIVE_SUMMARY.md) (5 min)
2. Read [AIGINVEST_OS.md](../AIGINVEST_OS.md) (15 min)
3. Pick your role below

**Onboarding?**
1. Read all three above documents (30 min total)
2. Read role-specific section below
3. Ask questions in #help channel

## By Role

### Product Managers
Start with:
- [Product Collection](product/index.md) — User flows + success criteria
- [Decisions Collection](decisions/index.md) — Why we chose what we chose
- [THREE_TRACKS_MODEL.md](../THREE_TRACKS_MODEL.md) — How we execute

### Engineers
Start with:
- [Architecture Collection](architecture/index.md) — How systems work
- [Decisions Collection](decisions/index.md) — Trade-offs + constraints
- [Engineering Compass](../AIGINVEST_OS.md#part-4-the-engineering-compass)

### Designers
Start with:
- [Product Collection](product/index.md) — User experience
- [3-Minute Rule](../AIGINVEST_OS.md#the-3-minute-rule) — Simplicity discipline
- [Product Lifecycle](../THREE_TRACKS_MODEL.md) — Design handoff

### Leadership
Start with:
- [EXECUTIVE_SUMMARY.md](../EXECUTIVE_SUMMARY.md) — Company overview
- [AIGINVEST_OS.md](../AIGINVEST_OS.md) — Operating system
- [Operations Collection](operations/index.md) — How we run

## How to Add Knowledge

New Decision? → Create in [decisions/](decisions/) + add to index.md
New System? → Create in [architecture/](architecture/) + add to index.md
New Feature? → Create in [product/](product/) + add to index.md
New Process? → Create in [operations/](operations/) + add to index.md

Use templates provided in each collection README.

## Searching Knowledge Base

Each collection has an index.md with:
- Chronological listing
- Topic tagging
- Quick descriptions

Or use GitHub search: `site:knowledge-base/` + keyword

## Questions?

- Technical: #engineering-discuss
- Product: #product-discuss
- General: #help
- Private: Message CEO

---

This knowledge base is the source of truth.
When in doubt, check here first.
```

---

## Success Criteria for Knowledge Base

✅ **Complete:** Every decision, system, feature, and process documented  
✅ **Current:** Updated within 1 week of change  
✅ **Accessible:** New team members can find what they need in <5 minutes  
✅ **Trusted:** Team refers to KB instead of asking questions  
✅ **Living:** Grows with company, deprecated docs marked clearly  

---

**This structure is LOCKED.**

All organizational knowledge follows this four-collection model.

When you learn something important, document it.

When someone asks a question repeatedly, put the answer in the KB.

Over time, the KB becomes the organizational memory.

---

**Effective Date:** July 7, 2026  
**Maintained By:** All team members  
**Next Review:** August 7, 2026
