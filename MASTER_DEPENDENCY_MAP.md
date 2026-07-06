# AIGINVEST Master Dependency Map
## Complete System Dependencies & Relationships

**Version:** 1.0  
**Last Updated:** July 7, 2026  
**Status:** 🟢 Living Reference  
**Audience:** All engineers, architects  

---

## How to Use This Map

Before implementing **ANY** feature:

1. **Find your feature** in the map
2. **List all dependencies** (what must exist first)
3. **List all dependents** (what breaks if you change this)
4. **Check which APIs** you expose and consume
5. **List which events** you publish and subscribe
6. **Map Diana capabilities** that use your feature
7. **List applications** that depend on you

---

## Master Dependency Structure

```
LAYER 1: INFRASTRUCTURE
    ↓
LAYER 2: PLATFORM
    ├─ Identity
    ├─ Events
    ├─ Storage
    ├─ Search
    ├─ Payments
    └─ Security
    ↓
LAYER 3: MISSION
    ├─ Mission Engine
    ├─ Workspace Engine
    ├─ Progress Engine
    └─ Trust Engine
    ↓
LAYER 4: DIANA
    ├─ Orchestrator
    ├─ Context Engine
    ├─ Memory
    ├─ Planning
    ├─ Tools
    └─ Avatar System
    ↓
LAYER 5: EXPERIENCE
    ├─ Web
    ├─ Mobile
    ├─ AIOS
    ├─ North Star ONE
    └─ Admin
```

---

## LAYER 1: INFRASTRUCTURE

### PostgreSQL Database

**Purpose:** Primary datastore for all mission-critical data

**Dependencies:** None (foundation)

**Dependents:**
- ✅ All platform services (100% dependent)
- ✅ All mission services (100% dependent)
- ✅ Diana services (100% dependent)
- ✅ All applications (100% dependent)

**Exposed APIs:**
- Prisma Client (internal)
- SQL queries (internal)

**Events Published:**
- None directly (via application services)

**Diana Capabilities:**
- Can query data indirectly (through services)

**Schema Changes Impact:**
- 🔴 CRITICAL: Breaking changes affect entire platform
- Migrations must be backward-compatible
- Old schema version supported minimum 3 years

**Upgrade Path:**
1. Write migration
2. Test on staging
3. Run migration (zero-downtime if possible)
4. Deploy new code
5. Monitor 24h before public celebration

---

### Redis Cache Layer

**Purpose:** Session storage, caching, real-time features

**Dependencies:**
- PostgreSQL (persistence)

**Dependents:**
- ✅ All services using sessions
- ✅ Real-time features
- ✅ WebSocket connections

**Cache Keys Pattern:**
- `session:${sessionId}`
- `user:${userId}:preferences`
- `mission:${missionId}:cache`
- `rate-limit:${userId}`

**TTL Strategy:**
- Sessions: 7 days
- Preferences: 24 hours
- Temp data: 1 hour
- Rate limits: 60 seconds

---

### Kubernetes Cluster

**Purpose:** Container orchestration, scaling, resilience

**Dependencies:**
- Docker images
- ConfigMaps/Secrets (configuration)
- PersistentVolumes (stateful storage)

**Dependents:**
- All containerized services
- All microservices

**Node Requirements:**
- Minimum 3 nodes (high availability)
- Auto-scaling enabled
- Health checks on all pods

---

### Monitoring Stack (Prometheus + Grafana)

**Purpose:** Observability, alerting, metrics

**Dependencies:**
- All services must expose metrics
- OpenTelemetry instrumentation

**Dependents:**
- Operations team (dashboards)
- On-call engineers (alerts)
- Diana (health monitoring)

**Key Metrics:**
- Request latency (p50, p95, p99)
- Error rate (per service, per endpoint)
- Throughput (requests/sec)
- Database query time
- Cache hit rate

---

### CI/CD Pipeline (GitHub Actions)

**Purpose:** Automated testing, deployment

**Dependencies:**
- GitHub repository
- Test suite
- Build scripts
- Deployment scripts

**Dependents:**
- Every deployment
- Every PR merge
- Every hotfix

**Build Stages:**
1. Checkout code
2. Install dependencies
3. Run tests
4. Build artifacts
5. Security scan
6. Deploy to staging
7. Integration tests
8. Deploy to production
9. Health checks
10. Smoke tests

---

## LAYER 2: PLATFORM

### Identity Service

**Purpose:** Authentication, authorization, permissions

**Dependencies:**
- PostgreSQL
- Redis (sessions)

**Dependents:**
- 🔴 **EVERYTHING** (100%)
- All other services require auth
- All endpoints require identity

**Exposed APIs:**
```
POST   /api/identity/login
POST   /api/identity/logout
POST   /api/identity/refresh
GET    /api/identity/me
POST   /api/identity/verify-email
POST   /api/identity/2fa
GET    /api/permissions/:resource/:action
```

**Events Published:**
- `user.created`
- `user.login`
- `user.logout`
- `permission.granted`
- `permission.revoked`
- `organization.membership_changed`

**Diana Capabilities:**
- `VerifyUserIdentity` (confirm who's asking)
- `CheckPermissions` (can user do this?)
- `GetCurrentUser` (who am I?)

**Applications Using This:**
- ✅ Every application (100%)

**Security Boundaries:**
- 🔐 Sessions isolated per user
- 🔐 HTTPS enforced
- 🔐 CORS configured
- 🔐 Rate limiting enabled
- 🔐 2FA optional

---

### Events Service

**Purpose:** Audit trail, event sourcing, compliance

**Dependencies:**
- PostgreSQL
- Message queue (future: Kafka)

**Dependents:**
- Trust Engine
- Analytics
- Compliance
- All services (for audit)

**Exposed APIs:**
```
POST   /api/events
GET    /api/events?filter=...
GET    /api/events/:id
GET    /api/timeline/:resourceId
```

**Event Types Published:**
- `*.created` (any resource created)
- `*.updated` (any resource updated)
- `*.deleted` (any resource deleted)
- `*.status_changed` (state transition)
- `*.permission_changed` (access change)
- `*.ai_action` (Diana action)

**Diana Capabilities:**
- `ExplainAction` (why did I do this?)
- `ShowTimeline` (what happened?)
- `AuditTrail` (complete history)

**Applications Using This:**
- ✅ Every application (required)

**Retention Policy:**
- Hot data (30 days): PostgreSQL
- Warm data (1 year): Archive storage
- Cold data (7 years): Legal hold

---

### Storage Service

**Purpose:** File storage, versioning, access control

**Dependencies:**
- PostgreSQL (metadata)
- Object storage (S3, GCS)
- Redis (cache)

**Dependents:**
- Document management
- File uploads
- Asset management
- Backup system

**Exposed APIs:**
```
POST   /api/storage/upload
GET    /api/storage/:fileId
PUT    /api/storage/:fileId
DELETE /api/storage/:fileId
GET    /api/storage/:fileId/versions
POST   /api/storage/:fileId/share
```

**Events Published:**
- `file.uploaded`
- `file.updated`
- `file.deleted`
- `file.version_created`
- `file.shared`

**Diana Capabilities:**
- `SaveDocument` (store user work)
- `RetrieveFile` (find stored file)
- `ListFiles` (show what exists)

**Applications Using This:**
- ✅ Documents
- ✅ Tasks (attachment support)
- ✅ Projects (file management)

**File Versioning:**
- Keep 5 versions per file
- 30-day retention for deleted files
- Metadata includes editor, timestamp

---

### Search Service

**Purpose:** Full-text search, semantic search

**Dependencies:**
- PostgreSQL
- Elasticsearch (for advanced search)
- Vector database (for semantic search - future)

**Dependents:**
- Web UI (search bar)
- Diana (find relevant information)
- Analytics (trend analysis)

**Exposed APIs:**
```
POST   /api/search?q=:query&type=:type
GET    /api/search/suggestions?q=:partial
POST   /api/search/semantic?query=:text
```

**Search Types:**
- Full-text (keyword search)
- Semantic (meaning-based)
- Filter (type, date, owner)
- Advanced (complex queries)

**Diana Capabilities:**
- `SearchDocuments` (find information)
- `FindSimilarMissions` (find patterns)
- `RecommendResources` (suggest content)

**Applications Using This:**
- ✅ Web search bar
- ✅ Diana context gathering
- ✅ Marketplace browsing

---

### Payments Service

**Purpose:** Payment processing, subscriptions, billing

**Dependencies:**
- PostgreSQL
- Stripe/Link/PayPal (payment providers)
- Email service (receipts)

**Dependents:**
- Marketplace
- Subscriptions
- Invoicing
- Revenue reporting

**Exposed APIs:**
```
POST   /api/payments/create
POST   /api/payments/process
GET    /api/payments/invoices
POST   /api/payments/refund
GET    /api/subscriptions/:id
POST   /api/subscriptions/:id/update
```

**Events Published:**
- `payment.created`
- `payment.completed`
- `payment.failed`
- `subscription.activated`
- `subscription.cancelled`
- `subscription.upgraded`
- `refund.issued`

**Diana Capabilities:**
- `CheckBalance` (user credit)
- `ProcessPayment` (charge user)
- `GetBillingInfo` (account status)

**Applications Using This:**
- ✅ Marketplace (app purchases)
- ✅ Premium tiers (subscriptions)
- ✅ Enterprise (billing)

**Payment Flow:**
1. Create payment intent
2. Return to payment provider
3. Provider calls webhook
4. Process result
5. Emit payment event
6. Send receipt

---

### Security Service

**Purpose:** Encryption, secrets management, compliance

**Dependencies:**
- PostgreSQL
- HashiCorp Vault (secret management - future)
- Encryption keys (AWS KMS)

**Dependents:**
- All services (for encryption)
- Compliance (GDPR, SOC2)
- Data protection

**Exposed APIs:**
```
POST   /api/security/encrypt
POST   /api/security/decrypt
GET    /api/security/secrets/:key
POST   /api/security/audit/:resource
```

**Encryption:**
- 🔐 Data at rest: AES-256
- 🔐 Data in transit: TLS 1.3
- 🔐 PII fields: Tokenized
- 🔐 Sensitive data: Double-encrypted

**Diana Capabilities:**
- `EncryptSensitiveData` (protect info)
- `CheckCompliance` (legal requirements)
- `GenerateAuditReport` (compliance)

---

## LAYER 3: MISSION

### Mission Engine

**Purpose:** Mission lifecycle, state machine, business logic

**Dependencies:**
- ✅ Identity Service
- ✅ Events Service
- ✅ Storage Service
- ✅ PostgreSQL

**Dependents:**
- ✅ Workspace Engine
- ✅ Progress Engine
- ✅ Trust Engine
- ✅ Diana (context)
- ✅ Web UI
- ✅ Mobile UI

**Exposed APIs:**
```
POST   /api/missions
GET    /api/missions
GET    /api/missions/:id
PUT    /api/missions/:id
PATCH  /api/missions/:id/status
DELETE /api/missions/:id
GET    /api/missions/active
GET    /api/missions/:id/progress
GET    /api/missions/:id/timeline
```

**Events Published:**
- `mission.created`
- `mission.updated`
- `mission.status_changed` (planning → active → paused → completed)
- `mission.completed`
- `mission.archived`
- `mission.owner_changed`

**Diana Capabilities:**
- `GetCurrentMission` (what am I working on?)
- `ListActiveMissions` (all open projects)
- `GetMissionContext` (full details)
- `SuggestNextStep` (what should we do?)
- `GenerateRoadmap` (break down mission)
- `UpdateProgress` (reflect changes)

**Applications Using This:**
- ✅ Missions (core)
- ✅ Tasks (subtasks)
- ✅ Calendar (deadlines)
- ✅ Projects (planning)

**State Machine:**
```
planning ──start──> active ──pause──> paused
  │                   │                  │
  │                   └────complete─────→ completed
  │
  └──────────────────────archive────────→ archived
```

---

### Workspace Engine

**Purpose:** Execution container, auto-provisioning, collaboration

**Dependencies:**
- ✅ Mission Engine (1:1 relationship)
- ✅ Identity Service
- ✅ Events Service
- ✅ PostgreSQL

**Dependents:**
- ✅ Progress Engine
- ✅ All applications (workspace-scoped)
- ✅ Diana (context)

**Exposed APIs:**
```
GET    /api/workspaces/:id
PUT    /api/workspaces/:id
GET    /api/workspaces/:id/settings
PUT    /api/workspaces/:id/settings
GET    /api/workspaces/:id/members
POST   /api/workspaces/:id/members/:userId/invite
```

**Auto-Provisioning:**
When mission is created:
1. Create workspace (1:1)
2. Create default project
3. Create default sections
4. Add workspace to user's org
5. Grant user full permissions

**Events Published:**
- `workspace.created` (auto with mission)
- `workspace.settings_changed`
- `workspace.member_added`
- `workspace.member_removed`
- `workspace.shared`

**Diana Capabilities:**
- `GetWorkspaceContext` (current container)
- `ListWorkspaceMembers` (collaboration)
- `GetPermissions` (what can people do?)

**Applications Using This:**
- ✅ Every app (workspace-scoped)

**Workspace Structure:**
```
Workspace
├─ Mission (1:1)
├─ Projects (1:many)
├─ Documents (1:many)
├─ Tasks (1:many)
├─ Timeline (events)
└─ Members (permissions)
```

---

### Progress Engine

**Purpose:** Calculate mission progress, milestones, metrics

**Dependencies:**
- ✅ Mission Engine
- ✅ Workspace Engine
- ✅ Events Service
- ✅ PostgreSQL

**Dependents:**
- ✅ Dashboard (progress bars)
- ✅ Diana (metrics)
- ✅ Analytics (tracking)
- ✅ Notifications (milestones)

**Exposed APIs:**
```
GET    /api/progress/:missionId
GET    /api/progress/:missionId/breakdown
GET    /api/progress/:missionId/timeline
GET    /api/progress/:missionId/milestones
```

**Events Published:**
- `progress.updated` (percentage changed)
- `progress.milestone_reached` (25%, 50%, 75%, 100%)
- `progress.at_risk` (falling behind)
- `progress.accelerating` (ahead of schedule)

**Diana Capabilities:**
- `GetProgress` (how far along?)
- `GetMilestones` (what's next?)
- `GetTimelineStatus` (on track?)
- `RecommendAcceleration` (how to speed up)

**Progress Calculation:**
```
total_progress = (
  (completed_tasks / total_tasks) * 0.40 +
  (time_elapsed / time_budgeted) * 0.30 +
  (documents_completed / documents_planned) * 0.30
)
```

**Milestones:**
- 25% - First quarter
- 50% - Halfway point
- 75% - Final stretch
- 100% - Completion

---

### Trust Engine

**Purpose:** AI action audit, explainability, accountability

**Dependencies:**
- ✅ Events Service
- ✅ Identity Service
- ✅ PostgreSQL

**Dependents:**
- ✅ Diana (every action logged)
- ✅ Timeline (explain decisions)
- ✅ Compliance (audit trail)

**Exposed APIs:**
```
POST   /api/trust/log-action
GET    /api/trust/:actionId/explanation
GET    /api/trust/timeline/:missionId
GET    /api/trust/confidence/:actionId
```

**Events Published:**
- `ai_action.logged` (Diana did something)
- `ai_action.questioned` (user questioned action)
- `ai_action.confirmed` (user approved)
- `ai_action.reversed` (user undid action)

**For Every Diana Action:**
- ✅ Record the action
- ✅ Record the reasoning
- ✅ Record confidence level
- ✅ Record data used
- ✅ Record outcome
- ✅ Allow user to reverse

**Diana Capabilities:**
- `LogAction` (record what I did)
- `ExplainDecision` (show my reasoning)
- `GetConfidence` (how sure am I?)
- `AllowReversal` (user can undo)

**Trust Record Structure:**
```
TrustRecord {
  id: string
  action: string (what Diana did)
  confidence: number (0-1)
  reasoning: string[] (why)
  dataUsed: string[] (what data)
  outcome: 'pending' | 'success' | 'failed'
  userReaction: 'confirmed' | 'questioned' | 'reversed'
  timestamp: date
}
```

---

## LAYER 4: DIANA

### Diana Orchestrator

**Purpose:** Central coordinator, request routing, state management

**Dependencies:**
- ✅ Mission Engine (context)
- ✅ Workspace Engine (context)
- ✅ Events Service (logging)
- ✅ Identity Service (who's asking?)
- ✅ All other Diana services

**Dependents:**
- ✅ Chat interface
- ✅ All Diana features
- ✅ Context Engine
- ✅ Memory
- ✅ Planning

**Exposed APIs:**
```
POST   /api/diana/chat
GET    /api/diana/suggestions
POST   /api/diana/execute
GET    /api/diana/capabilities
```

**Diana Request Flow:**
```
User Input
  ↓
Orchestrator (route to right agent)
  ├─ Mission context? → Context Engine
  ├─ Need memory? → Memory Engine
  ├─ Need planning? → Planning Engine
  ├─ Need to execute? → Tools Runner
  ├─ Need to reason? → Reasoning Engine
  └─ Need to learn? → Learning Engine
  ↓
Response (with reasoning visible)
  ↓
Trust Engine (log action)
  ↓
Return to user
```

**Events Published:**
- `diana.request_received`
- `diana.request_processed`
- `diana.action_suggested`
- `diana.action_executed`
- `diana.error_occurred`

---

### Context Engine

**Purpose:** Gather relevant context for every Diana request

**Dependencies:**
- ✅ Mission Engine
- ✅ Workspace Engine
- ✅ Storage Service
- ✅ Search Service

**Dependents:**
- ✅ Diana Orchestrator
- ✅ All reasoning

**Exposed APIs:**
```
GET    /api/diana/context/:missionId
GET    /api/diana/context/user/:userId
GET    /api/diana/context/relevant?query=:text
```

**Context Gathering:**
For every request, gather:
- Current mission (title, goal, progress)
- Current workspace (members, documents, tasks)
- User history (past actions, preferences)
- Recent events (what just happened)
- Related documents (background knowledge)
- Time context (deadline, time spent)

**Result:**
```
{
  mission: { ... },
  workspace: { ... },
  user: { ... },
  recentEvents: [ ... ],
  relevantDocuments: [ ... ],
  timeline: { ... }
}
```

---

### Memory Engine

**Purpose:** Short-term, long-term, and episodic memory

**Dependencies:**
- ✅ PostgreSQL
- ✅ Vector database (future)

**Dependents:**
- ✅ Diana Orchestrator
- ✅ All reasoning

**Three Types of Memory:**

**1. Short-term (conversation context)**
- Current chat session
- Last 10 messages
- Immediate context
- TTL: 1 hour

**2. Long-term (learned patterns)**
- User preferences
- Historical patterns
- AI profile
- TTL: Permanent

**3. Episodic (specific events)**
- Mission milestones
- Important decisions
- User achievements
- TTL: Permanent

---

### Planning Engine

**Purpose:** Generate roadmaps, break down missions

**Dependencies:**
- ✅ Mission Engine
- ✅ Context Engine
- ✅ Memory Engine

**Dependents:**
- ✅ Diana Orchestrator
- ✅ Roadmap generation

**Exposed APIs:**
```
POST   /api/diana/roadmap
POST   /api/diana/breakdown
POST   /api/diana/estimate
```

**Planning Outputs:**
- Phase breakdown
- Timeline estimate
- Milestone identification
- Risk assessment
- Resource requirements
- Success criteria

---

### Tool Runner

**Purpose:** Execute API calls, create objects, take actions

**Dependencies:**
- ✅ All Layer 2-3 services

**Dependents:**
- ✅ Diana Orchestrator
- ✅ Automation

**Exposed APIs:**
```
POST   /api/diana/execute
GET    /api/diana/tools
```

**Available Tools:**
- Create task
- Create document
- Update mission
- Send notification
- Share workspace
- Archive document
- Many more

**Safety Checks:**
- User approval required
- Permission check
- Audit logged
- Reversible

---

### Reasoning Engine

**Purpose:** Make decisions, generate explanations

**Dependencies:**
- ✅ Context Engine
- ✅ Memory Engine
- ✅ All relevant data

**Dependents:**
- ✅ Diana Orchestrator
- ✅ All recommendations

**Reasoning Process:**
1. Gather context
2. Apply rules/models
3. Consider alternatives
4. Generate explanation
5. Assign confidence
6. Present to user

---

### Avatar System

**Purpose:** Visual representation, emotional state

**Dependencies:**
- ✅ Diana services (state)

**Dependents:**
- ✅ UI (display)
- ✅ All interfaces

See **Volume 4B: Diana Avatar System** for complete details.

---

## LAYER 5: EXPERIENCE

### Web Application

**Purpose:** Dashboard, missions, collaboration, settings

**Dependencies:**
- ✅ Identity Service (auth)
- ✅ Mission Engine (data)
- ✅ Diana Orchestrator (chat)
- ✅ Storage Service (files)
- ✅ Search Service (search)

**Exposed to Diana:**
- Mission editing
- Task creation
- Document management
- Settings access

**Applications Within:**
- Mission dashboard
- Task manager
- Document editor
- Calendar
- Chat interface
- Settings

---

### Mobile Application (Future)

**Purpose:** Mobile-first experience, offline support

**Dependencies:**
- Same as web (+ offline support)

**Unique Capabilities:**
- Offline mode
- Push notifications
- Native gesture support
- Camera/microphone access

---

### AIOS (Future)

**Purpose:** Native operating system integration

**Dependencies:**
- All Layer 2-4 services
- Device OS APIs

**Unique Capabilities:**
- Deep OS integration
- Widget support
- System notifications
- File system integration

---

## DEPENDENCY VERIFICATION CHECKLIST

Before shipping ANY feature, answer:

### ✅ Direct Dependencies
- [ ] What services must exist before this?
- [ ] Are they on the same roadmap?
- [ ] Do they have APIs ready?
- [ ] Are they stable?

### ✅ Dependents
- [ ] What services depend on this?
- [ ] Will they break if this changes?
- [ ] Do they need to be updated?
- [ ] Is there a migration plan?

### ✅ APIs
- [ ] What APIs do I expose?
- [ ] Are they versioned?
- [ ] Are they documented?
- [ ] Can Diana use them?

### ✅ Events
- [ ] What events do I publish?
- [ ] Who subscribes to them?
- [ ] Are event schemas documented?
- [ ] Do subscribers have test data?

### ✅ Diana Integration
- [ ] Can Diana access this?
- [ ] What capabilities does Diana need?
- [ ] Is reasoning explainable?
- [ ] Is it logged in Trust Engine?

### ✅ Applications
- [ ] Which apps use this?
- [ ] Are they affected by changes?
- [ ] Do they have fallback plans?

---

## Updating This Map

This map evolves with the platform.

**When to Update:**
- ✅ New service added
- ✅ New dependency discovered
- ✅ API changes
- ✅ Events added/removed
- ✅ Diana capabilities expanded
- ✅ Breaking change planned

**Update Process:**
1. Create PR with changes
2. All architects review
3. Stakeholders sign off
4. Merge to main
5. Publish updated map
6. Announce changes to teams

---

**Published:** July 7, 2026  
**Status:** 🟢 Living Reference  
**Last Verified:** July 7, 2026  
**Next Review:** Every sprint  

This map prevents architectural chaos.  
Keep it current.
