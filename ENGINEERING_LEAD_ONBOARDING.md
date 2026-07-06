# Engineering Lead Onboarding Package

**Project:** North Star ONE  
**Date:** 2026-07-06  
**Duration:** 3-5 days (30-40 hours)  
**Prepared For:** Engineering Lead  

---

## Welcome to North Star ONE

You're joining at a critical moment: **all product decisions are locked, architecture is frozen, and execution begins this week.**

This package gives you everything needed to understand the vision, the product, the technical approach, and the team structure.

**Your immediate responsibilities:**
1. Complete this onboarding (3-5 days)
2. Hire remaining team members (1-2 weeks parallel)
3. Lead Sprint 1-2 execution (beginning Week 1)
4. Establish technical culture and standards

---

## Reading Order (Read in This Sequence)

### Day 1: Strategic Context (5 hours)

**Why we exist, where we're going**

1. **[NORTH_STAR_STATEMENT.md](NORTH_STAR_STATEMENT.md)** (10 min)
   - **What it is:** One-sentence purpose filter
   - **Why read:** Understand the north star
   - **Key insight:** Everything we build must align with this

2. **[PROJECT_CHARTER.md](PROJECT_CHARTER.md)** (30 min)
   - **What it is:** Formal governance charter
   - **Why read:** Understand decision framework and principles
   - **Key insight:** 5 pillars + 7 operating principles guide all decisions

3. **[FOUR_PHASE_STRATEGIC_ROADMAP.md](FOUR_PHASE_STRATEGIC_ROADMAP.md)** (30 min)
   - **What it is:** 3-year evolution roadmap
   - **Why read:** Understand multi-year trajectory
   - **Key insight:** Phase 1 MVP is foundation for $2M+ business

4. **[MINIMUM_LOVABLE_PRODUCT.md](MINIMUM_LOVABLE_PRODUCT.md)** (20 min)
   - **What it is:** 10 core experiences for Phase 1
   - **Why read:** Know the essential user experiences
   - **Key insight:** Focus is ruthless—only 10 capabilities matter

5. **[GETTING_STARTED_GUIDE.md](GETTING_STARTED_GUIDE.md)** (20 min)
   - **What it is:** 30-day action plan
   - **Why read:** Understand Week 1-4 execution path
   - **Key insight:** Clear milestones and blockers identified

**End of Day 1 Checkpoint:**
- [ ] You understand why Diana exists
- [ ] You know the 5 pillars and 7 principles
- [ ] You can articulate the 10 core experiences
- [ ] You understand the 3-year trajectory

---

### Day 2: Product & Design (6 hours)

**What we're building and how it works**

1. **[MASTER_PRODUCT_PLAN.md](MASTER_PRODUCT_PLAN.md)** (90 min)
   - **What it is:** Single source of truth (16 sections)
   - **Why read:** Complete product overview
   - **Sections to focus on:**
     - Vision & Pillars (10 min)
     - Architecture Overview (15 min)
     - Application Registry (10 min)
     - Service Catalog (15 min)
     - Technical Stack (10 min)
     - Roadmap (10 min)
     - Technical Decisions (15 min)
   - **Key insight:** This is your authority document for all decisions

2. **[DIANA_MVP_SPECIFICATION.md](DIANA_MVP_SPECIFICATION.md)** (90 min)
   - **What it is:** Exact 8-step user flow with full specs
   - **Why read:** This is THE blueprint your team builds
   - **Sections to focus on:**
     - 8-Step Flow Overview (15 min)
     - Each flow step with API specs (15 min each = 2 hours)
   - **Key insight:** Engineers build exactly this—no ambiguity

3. **[DIANA_ASSETS_LIBRARY.md](DIANA_ASSETS_LIBRARY.md)** (30 min)
   - **What it is:** 10 asset states with implementation specs
   - **Why read:** Understand design system requirements
   - **Key insight:** Designer will implement this; understand dependencies

4. **[PAYMENT_SERVICE_ARCHITECTURE.md](PAYMENT_SERVICE_ARCHITECTURE.md)** (30 min)
   - **What it is:** Multi-provider payment system design
   - **Why read:** Revenue is built in from day 1
   - **Key insight:** You need backend team member dedicated to this

**End of Day 2 Checkpoint:**
- [ ] You know the exact 8-step user flow
- [ ] You understand all API endpoints
- [ ] You know the payment architecture
- [ ] You understand Diana's design system

---

### Day 3: Execution Plan (5 hours)

**How we execute, who does what, when**

1. **[SPRINT_1_2_TASK_BREAKDOWN.md](SPRINT_1_2_TASK_BREAKDOWN.md)** (120 min)
   - **What it is:** Week-by-week Sprint 1-2 breakdown
   - **Why read:** This is your Week 1-2 execution blueprint
   - **Key sections:**
     - Sprint 1 Week 1: Setup & Authentication (30 min)
     - Sprint 1 Week 2: Conversations & APIs (30 min)
     - Sprint 2 Week 1: Documents & Memory (30 min)
     - Sprint 2 Week 2: Sync & Dashboard (30 min)
   - **Key insight:** Know day-by-day what your team needs to accomplish

2. **[NORTH_STAR_ONE_ALPHA.md](NORTH_STAR_ONE_ALPHA.md)** (60 min)
   - **What it is:** Alpha milestone definition
   - **Why read:** Know what "done" looks like at Week 12
   - **Key sections:**
     - 8 User Capabilities (15 min)
     - Success Criteria (15 min)
     - Demo Script (15 min)
     - Definition of Done (15 min)
   - **Key insight:** Concrete Alpha success criteria

3. **[RUNTIME_DASHBOARD_SPEC.md](RUNTIME_DASHBOARD_SPEC.md)** (60 min)
   - **What it is:** Operations monitoring dashboard
   - **Why read:** Understand operational requirements
   - **Key insight:** DevOps will need support; understand dependencies

4. **[TEAM_STRUCTURE_AND_HIRING.md](TEAM_STRUCTURE_AND_HIRING.md)** (30 min)
   - **What it is:** Complete org chart and hiring timeline
   - **Why read:** Understand who you're hiring and when
   - **Key insight:** You're hiring 4-5 people immediately

**End of Day 3 Checkpoint:**
- [ ] You know Week 1-2 execution plan
- [ ] You know Alpha success criteria
- [ ] You know who you're hiring
- [ ] You can brief new team members

---

### Day 4: Technical Deep Dive (8 hours)

**Architecture, code, deployment, standards**

1. **[PHASE_1_IMPLEMENTATION_GUIDE.md](PHASE_1_IMPLEMENTATION_GUIDE.md)** (90 min)
   - **What it is:** 6-sprint implementation roadmap
   - **Why read:** Technical architecture and dependencies
   - **Key sections:**
     - Tech Stack (15 min)
     - Architecture Diagram (10 min)
     - Service Dependencies (15 min)
     - Database Schema (20 min)
     - API Gateway (15 min)
     - Deployment Strategy (15 min)

2. **Codebase Review** (120 min)
   - Navigate to: C:\Users\PC\AIG-Global\aig-platform
   - Review file structure:
     ```
     ├── apps/
     │   ├── api/          (NestJS backend)
     │   └── web/          (React frontend)
     ├── packages/
     │   ├── identity/     (Auth service)
     │   ├── user-management/
     │   ├── organization-management/
     │   └── north-star-one/
     ├── .github/workflows/ (CI/CD)
     ├── docker/           (Containerization)
     └── package.json      (Workspace config)
     ```
   - Read key files:
     - [apps/api/src/main.ts](../../apps/api/src/main.ts) (10 min)
     - [apps/api/tsconfig.json](../../apps/api/tsconfig.json) (5 min)
     - [packages/identity/index.ts](../../packages/identity/index.ts) (10 min)
     - [packages/north-star-one/src/registry.service.ts](../../packages/north-star-one/src/registry.service.ts) (15 min)

3. **GitHub Organization Setup** (30 min)
   - **Action:** Review [GITHUB_ORG_SETUP.md](GITHUB_ORG_SETUP.md)
   - **Understand:** Repository structure, branch protection, team permissions
   - **Outcome:** Ready to execute GitHub setup script

4. **Deployment & DevOps** (30 min)
   - Review deployment strategy
   - Understand CI/CD pipeline requirements
   - Know infrastructure approach (Docker/Kubernetes)

**End of Day 4 Checkpoint:**
- [ ] You've reviewed all code architecture
- [ ] You understand tech stack decisions
- [ ] You know CI/CD pipeline
- [ ] You can discuss deployment strategy

---

### Day 5: Team Kickoff Prep (4 hours)

**Get ready to lead**

1. **Create Your Kickoff Briefing** (90 min)
   - Write your own 5-minute verbal summary covering:
     - Why Diana exists (north star)
     - What we're building (8-step MVP flow)
     - How we're building it (tech stack)
     - Who we're building it with (team roles)
     - When we launch (Week 12 Alpha)
   - This becomes your Monday standup speech

2. **Interview Preparation** (60 min)
   - Prepare interview questions for hiring
   - Understand required skills
   - Know compensation structure
   - Review [TEAM_STRUCTURE_AND_HIRING.md](TEAM_STRUCTURE_AND_HIRING.md)

3. **First Week Plan** (30 min)
   - Plan your Week 1 schedule:
     - Monday: Team kickoff + onboarding
     - Tuesday: GitHub setup + repo initialization
     - Wednesday: Development environment setup
     - Thursday: Sprint 1 task breakdown
     - Friday: Team retro + Week 2 planning

**End of Day 5 Checkpoint:**
- [ ] You can deliver the kickoff briefing
- [ ] You're ready to interview candidates
- [ ] You have your Week 1 plan
- [ ] You feel confident in the role

---

## Key Documents by Role

### Backend Lead (when hired)

**Required reading (8 hours):**
- DIANA_MVP_SPECIFICATION.md (90 min)
- PAYMENT_SERVICE_ARCHITECTURE.md (45 min)
- PHASE_1_IMPLEMENTATION_GUIDE.md (60 min)
- API Architecture section of MASTER_PRODUCT_PLAN.md (15 min)
- Code review: apps/api, packages/identity (60 min)

**First tasks:**
1. Design database schema
2. Set up PostgreSQL + migrations
3. Build API endpoints for Steps 1-3
4. Implement JWT authentication

### Frontend Lead (when hired)

**Required reading (8 hours):**
- DIANA_MVP_SPECIFICATION.md (90 min)
- DIANA_ASSETS_LIBRARY.md (45 min)
- Frontend Architecture section of MASTER_PRODUCT_PLAN.md (15 min)
- Code review: apps/web (60 min)
- RUNTIME_DASHBOARD_SPEC.md (30 min)

**First tasks:**
1. Set up React project structure
2. Build login page
3. Build dashboard layout
4. Implement Diana greeting animation

### DevOps Lead (when hired)

**Required reading (5 hours):**
- PHASE_1_IMPLEMENTATION_GUIDE.md (90 min)
- GITHUB_ORG_SETUP.md (60 min)
- RUNTIME_DASHBOARD_SPEC.md (45 min)
- Infrastructure section of MASTER_PRODUCT_PLAN.md (15 min)

**First tasks:**
1. Execute GitHub organization setup
2. Set up CI/CD pipeline
3. Configure PostgreSQL + Redis + Vector DB
4. Set up monitoring and alerts

### Designer (when hired)

**Required reading (5 hours):**
- DIANA_ASSETS_LIBRARY.md (60 min)
- DIANA_MVP_SPECIFICATION.md (focus on UI flows) (60 min)
- Design section of MASTER_PRODUCT_PLAN.md (15 min)
- PUBLIC_DEMO_SCRIPT.md (30 min)

**First tasks:**
1. Export 10 Diana assets in all formats
2. Create login page design
3. Create chat interface design
4. Build Figma design system

---

## Quick Reference

### Architecture at a Glance

```
┌─────────────────────────────────────────┐
│          React Web + Mobile              │
│    (apps/web - Chat, Documents, etc.)   │
└─────────────────┬───────────────────────┘
                  │ REST/WebSocket
┌─────────────────▼───────────────────────┐
│         NestJS API Gateway               │
│       (apps/api - Port 3333)             │
└────┬────────────┬────────────┬──────────┘
     │            │            │
  Identity     Payment      Conversations
  Service      Service      Service
  (JWT)        (Stripe)     (LLM + Stream)
     │            │            │
┌────▼────────────▼────────────▼──────────┐
│   PostgreSQL   │   Redis   │  Vector DB │
│  (Relational)  │ (Cache)   │ (Search)   │
└───────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 24.18.0 |
| Backend | NestJS | 10.3.0 |
| Frontend | React | 18.x |
| Language | TypeScript | 5.0+ |
| Package Manager | pnpm | 8.x |
| Build System | Turbo | Latest |
| Database | PostgreSQL | 16 |
| Cache | Redis | 7.x |
| Vector DB | Pinecone/Weaviate | TBD |
| Payments | Stripe | Latest API |
| Container | Docker | Latest |
| Orchestration | Kubernetes | 1.28+ |

### Key File Locations

```
C:\Users\PC\AIG-Global\aig-platform\
├── apps/api/src/main.ts              ← API entry point
├── apps/web/src/App.tsx              ← Frontend entry point
├── packages/identity/index.ts         ← Auth module
├── packages/north-star-one/           ← Registry & orchestrator
├── docker-compose.yml                 ← Local dev setup
├── pnpm-workspace.yaml                ← Monorepo config
└── .github/workflows/                 ← CI/CD pipelines
```

### Running Locally

```powershell
# Setup
cd C:\Users\PC\AIG-Global\aig-platform
pnpm install
pnpm build

# Start services
docker-compose up -d  # PostgreSQL, Redis

# Run API
cd apps/api
npm run dev           # Runs on localhost:3333

# Run Web (in new terminal)
cd apps/web
npm run dev           # Runs on localhost:3000

# Verify
curl http://localhost:3333/api/health
```

---

## Success Metrics for First 30 Days

### Week 1 (Team Onboarding & Setup)
- [ ] All team members onboarded
- [ ] GitHub organization configured
- [ ] Development environments working
- [ ] Sprint 1 tasks defined and assigned
- [ ] Daily standup established

### Week 2 (Sprint 1 Execution)
- [ ] Authentication system working
- [ ] Login page deployed to staging
- [ ] First API endpoints live
- [ ] CI/CD pipeline green
- [ ] Database migrations working

### Week 3-4 (Sprint 1 Continuation)
- [ ] Conversations API streaming
- [ ] Chat interface functional
- [ ] Memory system basic implementation
- [ ] Dashboard metrics visible
- [ ] Alpha checklist started

**Definition of Done for Day 30:**
- ✅ Team feels confident
- ✅ Sprint velocity established
- ✅ No critical blockers
- ✅ On track for Week 12 Alpha

---

## Support & Questions

### During Onboarding

If you need clarification on any document:

1. **Product Questions:** Reference MASTER_PRODUCT_PLAN.md
2. **Technical Questions:** Reference PHASE_1_IMPLEMENTATION_GUIDE.md
3. **Sprint Questions:** Reference SPRINT_1_2_TASK_BREAKDOWN.md
4. **Design Questions:** Reference DIANA_ASSETS_LIBRARY.md
5. **GitHub Questions:** Reference GITHUB_ORG_SETUP.md

### First Week

Schedule 1-hour syncs:
- **Monday:** Full product briefing (2 hours)
- **Tuesday:** Technical deep dive (1.5 hours)
- **Wednesday:** Team structure & hiring (1 hour)
- **Thursday:** Sprint 1 execution planning (1 hour)
- **Friday:** Retrospective & Week 2 prep (1 hour)

---

## Your First Monday

**Agenda: Team Kickoff**

9:00 AM - Welcome & Context (30 min)
- Why we exist (north star)
- What we're building (8-step MVP)
- Why now (market + timing)

9:30 AM - The Product (45 min)
- Diana's personality
- 8-step user flow walkthrough
- Success criteria

10:15 AM - The Team & Roadmap (30 min)
- Team structure
- Who's doing what
- 12-week Alpha timeline

10:45 AM - Sprint 1 Breakdown (30 min)
- Week 1-2 exact tasks
- Dependencies & risks
- Question answering

11:15 AM - Developer Setup (45 min)
- Clone repository
- Install dependencies
- Run locally
- Verify endpoints

12:00 PM - Standup Sync (15 min)
- Daily standup time (11 AM Pacific, 2 PM Eastern)
- Communication norms
- Slack channel setup

---

## Final Checklist Before Your First Day

- [ ] Read through this entire onboarding package
- [ ] Review all linked documents (reading order above)
- [ ] Clone the repository locally
- [ ] Set up development environment
- [ ] Verify API server runs on localhost:3333
- [ ] Review codebase structure
- [ ] Prepare your kickoff briefing
- [ ] Create your interview questions
- [ ] Plan your first week schedule
- [ ] Feel confident & excited

---

## You're Ready

When you've completed this onboarding, you'll have:

✅ Deep understanding of product vision  
✅ Complete knowledge of MVP specification  
✅ Clear technical architecture  
✅ Week 1-2 execution plan  
✅ Team hiring approach  
✅ Confidence in the opportunity  

Welcome to North Star ONE.

Let's build something meaningful.

---

**Onboarding Package Version:** 1.0  
**Duration:** 3-5 days, 30-40 hours  
**Status:** Ready for Engineering Lead  
**Created:** 2026-07-06
