# AIGINVEST Operating Doctrine

**Version:** 1.0  
**Status:** LOCKED — Governs all engineering decisions  
**Effective Date:** July 7, 2026  

---

## Preamble

AIGINVEST is not a feature roadmap. It is a **way of building software**.

This doctrine establishes the philosophical and architectural boundaries that guide every decision—from product design to code architecture to team prioritization.

When in doubt, return to these principles.

---

## The Four Principles

### 1. Human First

Every screen should answer one question clearly:

> **What is this helping the user achieve?**

NOT:

> What feature is this showing?

**In Code:**
- User-facing screens derive from mission/goal context
- Every UI component has a clear `userObjective` property
- If a feature doesn't map to a user outcome, question it

**In Design:**
- Every mockup starts with: "What is the user trying to accomplish?"
- Features are measured by outcomes, not by feature count
- If you can't articulate the user's goal in one sentence, redesign

---

### 2. AI Second

AI never becomes the center.

AI is the **engine**.

The **user's goal** is always the center.

**What This Means:**
- Diana is a tool for goal achievement, not the primary interface
- Users should never wonder "What can Diana do?" Instead: "What do I want to achieve?"
- AI capabilities are presented as accelerators, not destinations

**In Architecture:**
- Goal objects exist independent of Diana
- Missions exist independent of Diana
- Diana is injected into the execution context, not the other way around

**In Product:**
- The primary navigation is: Goals → Missions → Work
- Diana appears in context when help is needed
- Not: "Ask Diana" as primary entry point

---

### 3. Platform Third

Every capability is reusable.

Don't build:

```
Business Plan Generator
```

Build:

```
Document Generator + Planning Engine + Knowledge Engine
```

Business plans become one use case. Fundraising timelines become another. Course outlines become a third.

**What This Means:**
- Primitives first, applications second
- When designing a feature, ask: "What reusable component does this require?"
- If a component solves only one problem, it's too specific

**In Architecture:**
- `DocumentGenerator` service is separate from `PlanningEngine`
- `KnowledgeEngine` is independent of any particular use case
- `TaskManager` works for projects, missions, and teams

**In Engineering:**
- Services are single-purpose but composable
- APIs expose primitives, not workflows
- Workflows layer on top of primitives

---

### 4. Ecosystem Fourth

Every component asks:

> **Can another developer extend this?**

If yes, it belongs.

If no, it's too coupled.

**What This Means:**
- APIs are public by default (even if not published)
- Configuration points replace hardcoded logic
- Plugins and extensions are first-class, not afterthoughts

**In Architecture:**
- Diana's reasoning engine is extensible
- Document templates are user-definable
- Workspace configurations are shareable
- Knowledge engine sources are pluggable

**In Code:**
- No hardcoded strings or logic
- Configuration files define behavior
- Extension points are documented
- Third-party developers can build on top

---

## The Three Rings

The platform is organized into three concentric rings, each with distinct stability characteristics:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ▪ OUTER RING                            │
│          Marketplace, SDK, Payments, Ecosystem             │
│     (Extends rapidly, high churn, most experimentation)    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   ▪ MIDDLE RING                            │
│    Organizations, Goals, Missions, Workspaces, Documents  │
│        (Evolves with product, moderate stability)          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ▪ INNER RING                            │
│     Diana, Memory, Reasoning, Planning, Execution, Learn  │
│      (Highly stable, rarely changes, foundational)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ring Characteristics

**Inner Ring (Most Stable)**
- Core intelligence architecture
- Rarely changes once established
- Breaking changes require major version bumps
- Changes cascade outward to other rings
- Examples: Diana's reasoning model, memory system, execution engine

**Middle Ring (Moderate Stability)**
- Domain entities (Goal, Mission, Workspace)
- Evolves with product feedback
- Extensions are forward-compatible
- Changes here require careful migration paths
- Examples: Mission schema, workspace configuration, document structure

**Outer Ring (Most Fluid)**
- Ecosystem plugins and extensions
- High experimentation and churn expected
- Easy to add/remove without impact
- New ring elements shouldn't affect inner rings
- Examples: Marketplace listings, payment integrations, third-party templates

### Design Discipline

- **Inbound Coupling:** Outer rings depend on inner rings (✓ good)
- **Outbound Coupling:** Inner rings depend on outer rings (✗ forbidden)
- **Same-Ring Coupling:** Peer rings coordinate but don't strongly depend (⚠ acceptable with care)

---

## The Missing Layer: Trust Engine

Every AI action should produce a record. This record enables transparency, debugging, and user confidence.

### Trust Record Structure

```typescript
interface AIActionRecord {
  // What happened
  action: string;                    // "created_roadmap"
  
  // Why it happened
  reason: string;                    // "User asked for roadmap by June"
  
  // What information was used
  dataUsed: {
    sources: string[];               // ["mission.objective", "workspace.context"]
    confidence: number;              // 0.0 - 1.0
    assumptions: string[];           // ["market size is $2B", "customer has $50k budget"]
  };
  
  // What was the result
  result: {
    success: boolean;
    output: any;
    errors?: string[];
  };
  
  // Can the user control it
  controls: {
    editable: boolean;
    undoable: boolean;
    reversibleUntil?: timestamp;
  };
  
  // Metadata
  timestamp: timestamp;
  userId: string;
  dianaVersion: string;
}
```

### User Interaction Pattern

When Diana creates a roadmap, the user sees:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Diana created a 12-week roadmap

   Why?     [Show reasoning]      
   Using    [Show data sources]   
   Based on [Show assumptions]    
   
   ✎ Edit   ↶ Undo   ⓘ Learn More
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Every click reveals the model, not hides it.

### The First Principle of AI Governance

> **Diana never hides automation. She explains it.**

Every automated action should be visible.  
Every recommendation should be understandable.  
Every decision should be reversible (until it becomes history).

---

## The AIGINVEST Flywheel 2.0

The platform's network effects work through **completed work**, not just the AI model:

```
Users
  ↓
[Users have Goals]
  ↓
[Goals become Missions]
  ↓
[Missions generate Completed Work]
  ↓
[Work becomes Organizational Knowledge]
  ↓
[Knowledge improves Diana]
  ↓
[Better Diana produces Better Results]
  ↓
[Better Results attract More Users]
  ↓
[cycle repeats]
```

### The Key Insight

The flywheel is not built on "AI innovation."

It is built on **evidence of completed work**.

This means:
- A user completing 10 tasks with Diana's help matters more than Diana's underlying model
- The value to the next user comes from visibility into previous completions
- Knowledge compounds from missions completed, not from features added
- Network effects emerge when users can learn from others' completed missions

### Implication

This means AIGINVEST's competitive advantage is not "better AI" alone.

It is "better AI applied to completed work."

The platform that shows you evidence of completed missions beats the platform with better models but no track record.

---

## The 3-Minute Rule

If a feature cannot be demonstrated in under three minutes, it is probably too complicated.

Every capability should be explainable with a short, compelling demo.

**Why This Matters:**
- Complex features hide bad UX
- Simple features scale in understanding
- If you can't explain it quickly, the user can't use it quickly
- Simplicity compounds—each new feature is easier to learn if others are simple

**How to Apply:**
- Before building a feature: Can I demo it in 3 minutes?
- During development: Is the learning curve < 3 minutes?
- After launch: Do new users get it in < 3 minutes?

**What Qualifies:**
- "Create a mission" ✓ (< 30 seconds)
- "Ask Diana to generate a roadmap" ✓ (< 2 minutes)
- "Set up advanced workspace automation rules" ✗ (> 10 minutes)

---

## The Sprint Philosophy

**Wrong Question:**
> Did we add features?

**Right Question:**
> **What meaningful outcome can a user achieve this week that they couldn't achieve last week?**

This question aligns engineering, product, and design around user impact, not velocity.

### Measurement

- Feature count: ✗ (misleading)
- Lines of code: ✗ (vanity metric)
- User outcomes: ✓ (the only metric that matters)

Example:
- Week 1: "User can create mission" (1 new outcome)
- Week 2: "User can see mission progress in real-time" (1 new outcome)
- Week 3: "User can invite team to mission" (1 new outcome)

This is more valuable than "User can do 10 new things" because clarity > feature count.

---

## Roadmap Phases (Vision, Not Timeline)

These phases represent natural evolution points. They are **not** prerequisites for each other.

### Version 1.0 (Foundation)
- Single-user goal/mission/workspace management
- Diana core capabilities (planning, execution tracking)
- Document creation and editing
- Knowledge persistence
- Basic activity timeline

**Success Criteria:** User can define a goal, create a mission, work toward it with Diana's support, see progress

### Version 1.5 (Teams)
- Team collaboration on missions
- Shared workspaces
- Organization dashboards
- Permission models

**Success Criteria:** Teams of 2-5 can collaborate on a single mission with clear progress visibility

### Version 2.0 (Ecosystem)
- Marketplace for mission templates
- Developer SDK for extensions
- Industry-specific mission packs (startup, creator, investor, operator, career-changer)
- API-first architecture

**Success Criteria:** Developers can build on AIGINVEST, users can install templates, organizations can customize

### Version 3.0 (Intelligence)
- AIOS integration (deep reasoning across all user data)
- North Star ONE integration (strategic analysis)
- Offline AI capabilities
- Cross-mission pattern recognition

**Success Criteria:** Diana can reason about patterns across user's entire mission portfolio and provide strategic guidance

---

## What Comes Next

This doctrine is **conceptually complete**.

From here, the highest leverage comes from turning these principles into:

1. **Tangible Code**
2. **Working Demonstrations**
3. **Real User Feedback**
4. **Disciplined Iteration**

The next major engineering deliverables should be:

1. ✅ **AIGINVEST Technical Specification v1.0** (already exists)
2. ✅ **Production Engineering Backlog** (already exists)
3. ⏳ **Mission Engine Implementation** (Week 2-3)
4. ⏳ **Workspace Orchestrator Implementation** (Week 2-3)
5. ⏳ **End-to-End Demo: Goal → Mission → Workspace** (Week 4)

When these exist, AIGINVEST will no longer be primarily a vision.

It will be a **working platform** that can evolve through evidence, user feedback, and disciplined iteration.

That is where long-term products are built.

---

## Decision Log

### Why Four Principles (Not More, Not Less)?

Four is the minimum for completeness (Human, AI, Platform, Ecosystem), but not so many that they become diluted.

Additional principles would either:
- Restate one of the four
- Become so specific they're tactics, not doctrine

### Why Three Rings?

Three provides natural stability gradient:
- One ring = too rigid
- Two rings = false binary (core vs. everything else)
- Three rings = natural evolution (stable core, evolving middle, experimental outer)
- Four+ rings = too granular

### Why Trust Engine Now?

As AI capabilities expand, transparency becomes the competitive moat.

Platforms that explain their AI win user confidence.

Better to design this in from the start than retrofit it later.

---

## Amendment Process

This doctrine may be amended under these conditions:

1. A principle is proven incorrect by real user data
2. A new principle emerges that changes fundamental architecture
3. A principle becomes impossible to implement with current technology

Amendments require:
- Written justification
- Impact analysis on existing systems
- Approval from core architecture team
- Update to all affected documentation

Low-level changes to supporting details do NOT require amendment.

---

## Related Documents

- [AIGINVEST_STANDARD_v1.0.md](AIGINVEST_STANDARD_v1.0.md) — 20-year vision
- [AIGINVEST_TECHNICAL_SPECIFICATION_v1.0.md](AIGINVEST_TECHNICAL_SPECIFICATION_v1.0.md) — Implementation details
- [PRODUCTION_ENGINEERING_BACKLOG_v1.0.md](PRODUCTION_ENGINEERING_BACKLOG_v1.0.md) — Prioritized work
- [90_DAY_EXECUTION_PROGRAM_v1.0.md](90_DAY_EXECUTION_PROGRAM_v1.0.md) — Week-by-week roadmap
- [PROJECT_ONE_HUNDRED.md](PROJECT_ONE_HUNDRED.md) — Validation framework

---

**This doctrine is LOCKED.**

All future engineering decisions must be evaluated against these four principles.

When in doubt, return here.

This is the foundation. Everything else is implementation.
