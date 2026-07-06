# Ecosystem Catalog
## Complete Application Specification

**Location:** `/architecture/ecosystem/APPS_CATALOG.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  

---

## Complete Application Roadmap

### TIER 0: Foundation (Required, Week 1-2)

#### Diana
- **Owner:** VP of AI
- **Status:** ✅ Core, in development
- **APIs:** 
  - `POST /api/diana/chat`
  - `GET /api/diana/suggestions`
  - `POST /api/diana/execute`
- **Events:** `diana.request`, `diana.response`, `diana.action`
- **Diana Capabilities:** Core orchestrator
- **UI:** Chat widget, persistent in all apps
- **Database:** Conversations, history, memory
- **Priority:** P0 (foundation)

#### Dashboard
- **Owner:** VP of Product
- **Status:** In development
- **APIs:** Dashboard query endpoints
- **Components:** Mission summary, quick actions, recent activity
- **Diana:** Shows progress, suggests next steps
- **UI:** Homepage after login
- **Database:** Dashboard cache, user preferences
- **Priority:** P0

#### Workspace
- **Owner:** VP of Engineering
- **Status:** In development
- **APIs:** Workspace CRUD
- **Contains:** Missions, tasks, documents, timeline
- **Diana:** Workspace context engine
- **UI:** Main navigation hub
- **Database:** Workspace schema with documents
- **Priority:** P0

---

### TIER 1: Core Productivity (Week 2-3)

#### Goals
- **Owner:** VP of Product
- **APIs:**
  - `POST /api/goals`
  - `GET /api/goals`
  - `PUT /api/goals/:id`
  - `PATCH /api/goals/:id/archive`
- **Events:** `goal.created`, `goal.updated`, `goal.converted_to_mission`
- **Diana:** "What's your main goal?"
- **Database:** Goals table
- **UI:** Goal creation, tracking, achievement celebration
- **Priority:** P0

#### Missions
- **Owner:** VP of Engineering
- **APIs:** Mission endpoints (create, list, update, complete, archive)
- **Events:** Mission lifecycle events
- **Diana:** Mission guidance, progress tracking, roadmap generation
- **UI:** Mission dashboard, creation wizard, progress view
- **Database:** Missions + workspace 1:1
- **Priority:** P0

#### Timeline
- **Owner:** VP of Engineering
- **APIs:** `GET /api/timeline/:workspaceId`
- **Events:** Every action appears in timeline
- **Diana:** Explains what happened and why
- **UI:** Chronological activity log with explanations
- **Database:** Event sourcing model
- **Priority:** P0

#### Files (Documents & Assets)
- **Owner:** VP of Engineering
- **APIs:**
  - `POST /api/files/upload`
  - `GET /api/files/:id`
  - `PUT /api/files/:id`
  - `GET /api/files/:id/versions`
- **Events:** `file.uploaded`, `file.updated`, `file.deleted`
- **Diana:** "Here are your documents", "Let me save this"
- **UI:** File explorer, document editor
- **Database:** File metadata + object storage
- **Priority:** P0

#### Calendar
- **Owner:** VP of Product
- **APIs:** 
  - `GET /api/calendar?date=...`
  - `POST /api/calendar/events`
- **Events:** `deadline.approaching`, `milestone.scheduled`
- **Diana:** Deadline awareness, time management
- **UI:** Calendar view of deadlines and milestones
- **Database:** Events with due dates
- **Integration:** Google Calendar (future)
- **Priority:** P1

---

### TIER 2: Business Apps (Week 4-5)

#### Projects
- **Owner:** VP of Engineering
- **APIs:** Project CRUD endpoints
- **Components:** Tasks, team, timeline
- **Diana:** Project coordination, blockers
- **Database:** Projects table, task hierarchy
- **Priority:** P1

#### Tasks
- **Owner:** VP of Engineering
- **APIs:**
  - `POST /api/tasks`
  - `GET /api/tasks?workspaceId=...`
  - `PATCH /api/tasks/:id/status`
- **Events:** `task.created`, `task.completed`, `task.blocked`
- **Diana:** Task suggestions, prioritization
- **Database:** Tasks with status, priority, assignee
- **Priority:** P1

#### CRM
- **Owner:** VP of Business Development
- **APIs:** Contacts, organizations, interactions
- **Events:** `contact.added`, `interaction.logged`
- **Diana:** "Who's your key contact?", relationship insights
- **Database:** Customers, interactions, pipeline
- **Priority:** P1

#### Accounting Lite
- **Owner:** VP of Finance
- **APIs:** Transactions, reports
- **Events:** `transaction.recorded`, `report.generated`
- **Diana:** Financial summary, P&L, cash position
- **Database:** Ledger, transactions
- **Priority:** P1

---

### TIER 3: AI & Automation (Week 3-4)

#### Prompt Studio
- **Owner:** VP of AI
- **APIs:** Prompt CRUD, version control
- **Features:** Prompt engineering UI, testing, versioning
- **Diana:** "Try this prompt", suggests improvements
- **Database:** Prompts with versions
- **Priority:** P1

#### Agent Builder
- **Owner:** VP of AI
- **APIs:** Agent CRUD, execution
- **Features:** No-code agent creation
- **Diana:** "Create an agent that...", configuration
- **Database:** Agent definitions, execution logs
- **Priority:** P2

#### Research Agent
- **Owner:** VP of AI
- **APIs:** Research task execution
- **Features:** Automated web research, summarization
- **Diana:** Specialist agent for research
- **Database:** Research results, sources
- **Priority:** P1

---

### TIER 4: Development Tools (Week 5-6)

#### Projects (Dev)
- **Owner:** VP of Engineering
- **APIs:** Same as Projects
- **Features:** Repos, pull requests, deployments
- **Integrations:** GitHub, GitLab
- **Database:** Project metadata
- **Priority:** P1

#### CI Dashboard
- **Owner:** VP of DevOps
- **APIs:** Build status, test results
- **Events:** `build.started`, `build.completed`, `test.failed`
- **Diana:** "Build is failing", deployment status
- **Database:** Build logs, test results
- **Priority:** P1

---

### TIER 5: Marketplace (Week 8-10)

#### Marketplace
- **Owner:** VP of Partnerships
- **APIs:**
  - `GET /api/marketplace/apps`
  - `POST /api/marketplace/apps/:id/install`
  - `GET /api/marketplace/ratings`
- **Events:** `app.installed`, `app.uninstalled`, `app.reviewed`
- **Diana:** "Here are recommended apps"
- **UI:** App discovery, ratings, reviews
- **Database:** Apps, ratings, install history
- **Priority:** P2

#### App Registry
- **Owner:** VP of Partnerships
- **APIs:** Internal registry, app metadata
- **Events:** `app.registered`, `app.verified`
- **Database:** App manifest, versions
- **Priority:** P2

---

### TIER 6: Finance & Payments (Week 6-7)

#### Billing
- **Owner:** VP of Finance
- **APIs:**
  - `GET /api/billing/invoices`
  - `GET /api/billing/subscriptions`
  - `POST /api/billing/upgrade`
- **Events:** `invoice.generated`, `subscription.changed`, `payment.processed`
- **Diana:** Billing status, upgrade recommendation
- **Database:** Invoices, subscriptions
- **Priority:** P1

#### Payments
- **Owner:** VP of Finance
- **APIs:** Payment processing (internal)
- **Providers:** Stripe, Link, PayPal
- **Events:** `payment.completed`, `payment.failed`, `refund.processed`
- **Database:** Transactions, receipts
- **Priority:** P0

---

### TIER 7: Future (Post-MVP)

#### Notes
- Simple note-taking per mission
- Rich text, collaboration
- Diana: "Here are your notes"

#### Whiteboard
- Visual planning, collaboration
- Real-time sync

#### Wiki
- Knowledge base per organization
- Full-text search

#### ERP Lite
- Inventory, supply chain basics

#### HR & Recruiting
- Job postings, applications
- Interview tracking

#### Banking Integration
- Account sync
- Transaction import

#### Investments
- Portfolio tracking
- Performance analysis

#### Learning Hub
- Course management
- Progress tracking

#### Health Journal
- Personal health tracking
- Insights

---

## App Registry Manifest

Every app must declare:

```json
{
  "appId": "com.aiginvest.missions",
  "displayName": "Missions",
  "version": "1.0.0",
  "category": "Productivity",
  "owner": {
    "team": "Product Engineering",
    "lead": "VP of Engineering"
  },
  "dependencies": {
    "services": ["Identity", "Events", "Storage"],
    "apis": ["/api/missions", "/api/workspaces"]
  },
  "permissions": [
    {"resource": "Mission", "action": "create"},
    {"resource": "Mission", "action": "read"},
    {"resource": "Mission", "action": "update"},
    {"resource": "Mission", "action": "delete"}
  ],
  "dianaCapabilities": [
    "GetMissionContext",
    "SuggestNextStep",
    "GenerateRoadmap"
  ],
  "apis": [
    {"path": "/api/missions", "method": "POST"},
    {"path": "/api/missions", "method": "GET"},
    {"path": "/api/missions/:id", "method": "GET"}
  ],
  "events": [
    "mission.created",
    "mission.updated",
    "mission.completed"
  ],
  "ui": {
    "navigation": "main-sidebar",
    "order": 2,
    "icon": "Target"
  }
}
```

---

## Deployment Order

**Phase 1 (Weeks 1-2):**
1. Diana
2. Dashboard
3. Workspace
4. Goals
5. Missions
6. Timeline
7. Files

**Phase 2 (Weeks 3-5):**
8. Calendar
9. Projects
10. Tasks
11. CRM
12. Accounting Lite
13. Prompt Studio
14. Research Agent

**Phase 3 (Weeks 6-8):**
15. CI Dashboard
16. Billing
17. Agent Builder
18. Marketplace

**Post-MVP:**
All future apps follow same pattern.

---

## Success Metrics per App

Every app must achieve by Week 6:
- ✅ >50% adoption (users accessing)
- ✅ >40% weekly return rate
- ✅ <2 min to first value
- ✅ >90% technical health
- ✅ >3.5/5.0 rating

---

**Status:** 🔒 Locked  
**Last Updated:** July 7, 2026  
**Next Review:** When adding new app category
