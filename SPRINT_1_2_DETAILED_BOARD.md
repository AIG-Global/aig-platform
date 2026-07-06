# Phase 1 Sprint 1-2 Task Board

**Project:** North Star ONE - Diana MVP  
**Phase:** Phase 1 (MVP Definition)  
**Duration:** 4 weeks (2 sprints × 2 weeks)  
**Dates:** Week 1-4 (Monday-Friday)  
**Status:** Ready for Execution  

---

## Sprint Overview

### Sprint 1: Foundation & Authentication (Week 1-2)

**Goal:** Build the foundation layer—secure infrastructure, authentication, and basic APIs

| Week | Focus | Deliverable |
|------|-------|-------------|
| Week 1 | Setup & Authentication | Users can sign in via email/password |
| Week 2 | Conversations API | Streaming endpoint ready for frontend |

**Sprint 1 Velocity Target:** 40-50 points  
**Alpha Coverage:** 0% (foundational only)

---

### Sprint 2: Core Conversations & Memory (Week 3-4)

**Goal:** Ship the core user experience—conversations, memory, documents

| Week | Focus | Deliverable |
|------|-------|-------------|
| Week 3 | Conversations & Memory | Chat UI streaming responses |
| Week 4 | Documents & Sync | Users can create and save documents |

**Sprint 2 Velocity Target:** 50-60 points  
**Alpha Coverage:** 60% (all core flows)

---

## Sprint 1: Week 1 (Setup & Authentication)

### Monday - Setup & Infrastructure

**Epic:** Bootstrap Development Environment

#### Task 1.1: GitHub Organization Setup
**Owner:** DevOps Lead (when hired)  
**Points:** 5  
**Time:** 4 hours  
**Description:** Execute full GitHub organization setup per GITHUB_ORG_SETUP.md

**Subtasks:**
- [ ] Create GitHub organization (AIG-Global)
- [ ] Create 10 repositories
- [ ] Configure branch protection rules
- [ ] Set up teams and permissions
- [ ] Add organization secrets
- [ ] Test access control

**Acceptance Criteria:**
- All 10 repos created
- Branch protection on main (2 reviewers)
- Teams configured
- Secrets accessible in CI/CD

**Dependencies:** None (blocking everything else)

---

#### Task 1.2: Local Development Environment Setup
**Owner:** Backend Lead (when hired) + Each Team Member  
**Points:** 3  
**Time:** 2 hours per person  
**Description:** Each team member clones repo and runs locally

**Subtasks:**
- [ ] Clone aig-platform repository
- [ ] Install Node 24, pnpm, Docker
- [ ] Run `pnpm install`
- [ ] Run `pnpm build`
- [ ] Start services: `docker-compose up -d`
- [ ] Verify API on localhost:3333

**Acceptance Criteria:**
- All team members can run `npm run dev`
- All endpoints respond
- Zero build errors

**Dependencies:** GitHub setup complete

---

#### Task 1.3: CI/CD Pipeline Setup
**Owner:** DevOps Lead  
**Points:** 8  
**Time:** 6 hours  
**Description:** Configure GitHub Actions for build, test, lint, deploy

**Subtasks:**
- [ ] Create build.yml workflow
- [ ] Create test.yml workflow
- [ ] Create lint.yml workflow
- [ ] Create security-scan.yml workflow
- [ ] Configure Docker builds
- [ ] Test full pipeline on PR

**Acceptance Criteria:**
- All workflows trigger on push/PR
- Status checks required on main
- Build time <5 minutes
- Test coverage >80%

**Dependencies:** GitHub setup, local environment

---

**Monday Standup (4 PM):**
- Setup progress: 100% target
- Any blockers: Address immediately
- Tuesday readiness: confirm

---

### Tuesday - Authentication System

**Epic:** JWT Authentication & User Login

#### Task 1.4: Extend User Model & Database Schema
**Owner:** Backend Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Design and implement user table with auth fields

**Subtasks:**
- [ ] Design user schema (id, email, password_hash, salt, roles, created_at, etc.)
- [ ] Design role table (id, name, permissions)
- [ ] Design organization table (id, name, owner_id, created_at)
- [ ] Create TypeORM migrations
- [ ] Run migrations on local DB
- [ ] Add seeds for test data

**Database Schema:**

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  owner_id UUID NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  organization_id UUID NOT NULL,
  role_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Acceptance Criteria:**
- Schema designed per MVP spec
- Migrations run without errors
- Test data seeded
- Schema reviewed by team

**Dependencies:** Local environment, PostgreSQL up

---

#### Task 1.5: Signup Endpoint (Step 1 - Phase 1)
**Owner:** Backend Lead + Senior Backend  
**Points:** 8  
**Time:** 6 hours  
**Description:** Build `/auth/signup` endpoint with validation

**API Endpoint:**

```typescript
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "organization": {
    "id": "org-uuid",
    "name": "John Doe's Workspace"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh-uuid"
}

Error (400):
{
  "error": "Email already registered"
}
```

**Subtasks:**
- [ ] Create SignupDto with validation
- [ ] Implement password hashing (bcrypt)
- [ ] Generate auto-organization
- [ ] Generate JWT token
- [ ] Implement error handling
- [ ] Add rate limiting
- [ ] Write tests (80%+ coverage)
- [ ] Document endpoint in Postman

**Acceptance Criteria:**
- Endpoint returns 201 on success
- Password hashed with salt
- JWT token issued
- Organization auto-created
- Validation errors clear
- Tests pass

**Dependencies:** Database schema, Identity package

---

#### Task 1.6: Login Endpoint (Step 1 - Phase 1)
**Owner:** Backend Lead + Senior Backend  
**Points:** 5  
**Time:** 4 hours  
**Description:** Build `/auth/login` endpoint

**API Endpoint:**

```typescript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh-uuid",
  "expiresIn": 3600
}

Error (401):
{
  "error": "Invalid credentials"
}
```

**Subtasks:**
- [ ] Verify email exists
- [ ] Compare password hash
- [ ] Generate JWT tokens
- [ ] Implement refresh token logic
- [ ] Add session management
- [ ] Error handling (generic error for security)
- [ ] Write tests
- [ ] Add to Postman collection

**Acceptance Criteria:**
- Returns 200 + tokens on valid login
- Returns 401 on invalid credentials
- Refresh token working
- Rate limiting per IP

**Dependencies:** Signup endpoint, JWT service

---

#### Task 1.7: Token Refresh Endpoint
**Owner:** Backend Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Build `/auth/refresh` endpoint

**Subtasks:**
- [ ] Validate refresh token
- [ ] Issue new access token
- [ ] Implement rotation strategy
- [ ] Add tests

**Acceptance Criteria:**
- Returns new token with proper expiry

**Dependencies:** JWT service

---

**Tuesday Standup (4 PM):**
- Signup endpoint working? ✅
- Login endpoint working? ✅
- Database schema in place? ✅
- Tests passing? ✅

---

### Wednesday - API Layer & Health Check

**Epic:** API Gateway & Monitoring

#### Task 1.8: API Health Check Endpoint
**Owner:** DevOps Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Extend health endpoint with database checks

**Endpoint:**

```typescript
GET /api/health

Response (200):
{
  "status": "ok",
  "timestamp": "2026-07-06T14:00:00Z",
  "uptime": 3600,
  "services": {
    "postgres": "connected",
    "redis": "connected",
    "api": "healthy"
  }
}
```

**Acceptance Criteria:**
- Checks all service connections
- Returns proper status codes
- Used by load balancers

**Dependencies:** Services running

---

#### Task 1.9: API Info Endpoint
**Owner:** Backend Lead  
**Points:** 2  
**Time:** 1 hour  
**Description:** Endpoint for version and loaded modules

**Endpoint:**

```typescript
GET /api/info

Response (200):
{
  "name": "North Star ONE",
  "version": "0.1.0",
  "environment": "development",
  "loadedModules": [
    "identity",
    "health-check",
    "conversation-service"
  ]
}
```

---

#### Task 1.10: JWT Guard Implementation
**Owner:** Backend Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Implement @UseGuards(JwtGuard) for protected routes

**Subtasks:**
- [ ] Create JwtGuard (Passport strategy)
- [ ] Extract user from token
- [ ] Add user to request context
- [ ] Handle missing/invalid tokens
- [ ] Add to protected endpoints

**Acceptance Criteria:**
- Protected endpoints return 401 without token
- User data available in handler
- Refresh flow working

**Dependencies:** JWT service, login endpoint

---

**Wednesday Standup:**
- Authentication system complete? ✅
- Health checks working? ✅
- Ready for frontend? ✅

---

### Thursday - API Testing & Documentation

**Epic:** Quality & Documentation

#### Task 1.11: Postman Collection & Documentation
**Owner:** Backend Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Create complete Postman collection for all endpoints

**Deliverables:**
- Postman collection with auth, signup, login, refresh
- Environment variables (dev, staging, production)
- Documentation for each endpoint
- Example requests/responses
- Error scenarios

**Acceptance Criteria:**
- All endpoints documented
- Can run collection with one click
- Frontend team can test independently

---

#### Task 1.12: Unit & Integration Tests
**Owner:** Senior Backend  
**Points:** 8  
**Time:** 6 hours  
**Description:** Write tests for auth module (80%+ coverage)

**Test Scenarios:**
- Signup: valid email, invalid email, short password, already registered
- Login: valid credentials, wrong password, nonexistent email
- Refresh: valid token, expired token, invalid token
- Guards: protected routes, missing token, invalid token

**Acceptance Criteria:**
- 80%+ coverage on auth module
- All tests passing
- Coverage report generated

---

#### Task 1.13: API Performance Baseline
**Owner:** DevOps Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Measure baseline response times

**Benchmarks:**
- Signup: <500ms
- Login: <400ms
- Refresh: <200ms
- Health check: <100ms

**Acceptance Criteria:**
- All endpoints <500ms p95
- Baseline established for comparison

---

**Thursday Standup:**
- Documentation complete? ✅
- Tests passing? ✅
- Performance baseline set? ✅

---

### Friday - Integration & Sprint Retro

**Epic:** Integration & Learning

#### Task 1.14: End-to-End Auth Flow Test
**Owner:** Senior Backend + Frontend Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Manual end-to-end test of signup → login → refresh

**Scenarios:**
1. Signup new user → receive tokens
2. Use access token to access protected endpoint
3. Refresh token → get new access token
4. Logout and verify token revoked

**Acceptance Criteria:**
- All scenarios pass
- No errors in logs
- Response times acceptable

---

#### Task 1.15: Staging Deployment
**Owner:** DevOps Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Deploy to staging environment

**Subtasks:**
- [ ] Configure staging environment
- [ ] Deploy API to staging
- [ ] Configure PostgreSQL on staging
- [ ] Run migrations
- [ ] Verify endpoints live
- [ ] Test auth flow in staging

**Acceptance Criteria:**
- Staging environment live
- All endpoints responding
- Logs centralized

---

#### Task 1.16: Sprint 1 Retrospective
**Owner:** Engineering Lead  
**Points:** 2  
**Time:** 1 hour  
**Description:** Team retro meeting

**Agenda:**
- What went well? ✅
- What didn't go well? ⚠️
- What should we change? 🔄
- Sprint velocity: X points
- Week 2 planning: confirm sprint board

**Outcomes:**
- Retro notes documented
- Improvements identified
- Week 2 sprint board confirmed

---

**Friday EOD Summary:**
- ✅ Authentication system live on staging
- ✅ Signup, login, refresh working
- ✅ Tests passing (80%+ coverage)
- ✅ Documentation complete
- ✅ Team velocity: 40-50 points
- ✅ Ready for Week 2

---

## Sprint 1: Week 2 (Conversations API)

### Monday - Conversation Service Foundation

**Epic:** Real-time Conversation Streaming

#### Task 2.1: Conversation Service Module
**Owner:** Backend Lead  
**Points:** 8  
**Time:** 6 hours  
**Description:** Create conversation service with database schema

**Database Schema:**

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

**Subtasks:**
- [ ] Design conversation schema
- [ ] Create migrations
- [ ] Implement ConversationService
- [ ] Add message retrieval methods
- [ ] Write tests

**Acceptance Criteria:**
- Schema designed and migrated
- Service methods tested
- Performance queries optimized

---

#### Task 2.2: Streaming Conversation Endpoint
**Owner:** Backend Lead + Senior Backend  
**Points:** 13  
**Time:** 10 hours  
**Description:** Build streaming `/api/conversations/:id/chat` endpoint

**Endpoint:**

```typescript
POST /api/conversations/:id/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Tell me about AI"
}

Response (200): Server-Sent Events (streaming)
data: {"type":"token","content":"AI","timestamp":"..."}
data: {"type":"token","content":" is","timestamp":"..."}
data: {"type":"token","content":" amazing","timestamp":"..."}
data: {"type":"done","tokens":3,"conversationId":"..."}
```

**Subtasks:**
- [ ] Set up SSE (Server-Sent Events)
- [ ] Connect to LLM provider (OpenAI API)
- [ ] Implement streaming response
- [ ] Save messages to database
- [ ] Track token usage
- [ ] Error handling & retry logic
- [ ] Write integration tests
- [ ] Performance test streaming

**Acceptance Criteria:**
- Streaming working smoothly
- Messages saved correctly
- Token usage tracked
- Latency <2s to first token

**Dependencies:** Auth guard, conversation schema

---

### Tuesday - Conversation Management

#### Task 2.3: Create Conversation Endpoint
**Owner:** Backend Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Build `/api/conversations` POST endpoint

**Endpoint:**

```typescript
POST /api/conversations
Authorization: Bearer <token>

Response (201):
{
  "id": "conv-uuid",
  "title": "New Conversation",
  "createdAt": "..."
}
```

---

#### Task 2.4: List Conversations Endpoint
**Owner:** Backend Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Build `/api/conversations` GET endpoint with pagination

**Endpoint:**

```typescript
GET /api/conversations?page=1&limit=20

Response (200):
{
  "conversations": [
    {"id": "...", "title": "...", "createdAt": "..."}
  ],
  "pagination": {"page": 1, "limit": 20, "total": 42}
}
```

---

#### Task 2.5: Get Conversation History
**Owner:** Backend Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Build `/api/conversations/:id/messages` endpoint

**Endpoint:**

```typescript
GET /api/conversations/:id/messages

Response (200):
{
  "messages": [
    {"role": "user", "content": "...", "timestamp": "..."},
    {"role": "assistant", "content": "...", "timestamp": "..."}
  ]
}
```

---

#### Task 2.6: Conversation Frontend Integration (Parallel)
**Owner:** Frontend Lead  
**Points:** 13  
**Time:** 10 hours  
**Description:** Build chat UI component with streaming

**Subtasks:**
- [ ] Create ChatInterface component
- [ ] Implement SSE listener
- [ ] Stream tokens to screen
- [ ] Handle message display
- [ ] Add send message form
- [ ] Add loading states
- [ ] Test with API

**Acceptance Criteria:**
- Messages display as they stream
- User can send messages
- UI responsive
- Error handling visible

---

### Wednesday - Memory & Context

#### Task 2.7: Conversation Search (Vector DB Setup)
**Owner:** Backend Lead  
**Points:** 8  
**Time:** 6 hours  
**Description:** Set up vector embeddings for semantic search

**Subtasks:**
- [ ] Integrate vector DB (Pinecone/Weaviate)
- [ ] Create embedding model integration
- [ ] Index conversations
- [ ] Build search endpoint
- [ ] Add to context retrieval

**Endpoint:**

```typescript
POST /api/search
{
  "query": "AI opportunities",
  "limit": 5
}

Response:
{
  "results": [
    {"conversationId": "...", "similarity": 0.95, "snippet": "..."}
  ]
}
```

---

#### Task 2.8: Context Injection
**Owner:** Backend Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Retrieve relevant context for each conversation

**Implementation:**
- Search for relevant past conversations
- Include in system prompt
- Improve response quality

**Acceptance Criteria:**
- Context retrieved and injected
- Latency acceptable (<500ms)
- Response quality improved

---

### Thursday - Dashboard & Monitoring

#### Task 2.9: Conversation Metrics
**Owner:** DevOps Lead  
**Points:** 5  
**Time:** 4 hours  
**Description:** Add metrics for conversations

**Metrics:**
- Active conversations
- Messages per conversation
- Average response time
- Token usage
- Error rate

**Acceptance Criteria:**
- Metrics exposed to monitoring
- Dashboard displays data

---

#### Task 2.10: Staging Deployment (Week 2)
**Owner:** DevOps Lead  
**Points:** 3  
**Time:** 2 hours  
**Description:** Deploy Week 2 changes to staging

---

### Friday - Sprint 2 Retro & Planning

#### Task 2.11: Sprint 2 Retrospective
**Owner:** Engineering Lead  
**Points:** 2  
**Time:** 1 hour  
**Description:** Retro meeting

---

#### Task 2.12: Sprint 2 Planning (Week 3-4)
**Owner:** Engineering Lead + Team  
**Points:** 3  
**Time:** 2 hours  
**Description:** Plan Sprint 2 (Documents, Memory, Sync)

---

**Week 2 EOD Summary:**
- ✅ Conversation streaming working
- ✅ Chat UI functional
- ✅ Search indexing live
- ✅ Metrics collected
- ✅ Alpha coverage: 40%
- ✅ Team velocity: 50-60 points

---

## Task Estimation Guide

**Point System:**
- 1 point = 30 minutes (very small task)
- 2 points = 1 hour (small task)
- 3 points = 2 hours (simple task)
- 5 points = 4 hours (medium task)
- 8 points = 6 hours (complex task)
- 13 points = 10 hours (very complex task)

**Note:** Points don't translate directly to hours due to context switching, code review, testing.

---

## Team Assignments Template

```
Task 1.4 - Database Schema
└─ Owner: Backend Lead
   Time: 4 hours
   Estimat:  5 points
   Status: Not Started
   Blocked By: None
   Blocks: Tasks 1.5, 1.6

Task 1.5 - Signup Endpoint
└─ Owner: Backend Lead + Senior Backend
   Time: 6 hours
   Points: 8
   Status: Not Started
   Blocked By: 1.4
   Blocks: 1.8

Task 1.6 - Login Endpoint
└─ Owner: Backend Lead + Senior Backend
   Time: 4 hours
   Points: 5
   Status: Not Started
   Blocked By: 1.4
   Blocks: 1.8
```

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| LLM API rate limits | High | Medium | Implement queuing, fallback model |
| Vector DB latency | Medium | Medium | Use caching, pre-index common queries |
| Database migrations fail | High | Low | Test migrations locally first |
| Team member absent | Medium | Low | Pair programming for critical tasks |
| Streaming latency | High | Medium | Optimize token delivery, use CDN |

---

## Success Criteria: Sprint 1-2

**By end of Week 4:**

✅ Users can sign up via email/password  
✅ Users can log in and get JWT tokens  
✅ JWT refresh flow working  
✅ Conversations API accepting messages  
✅ Streaming responses working smoothly  
✅ Chat history saved and retrievable  
✅ Vector embeddings indexing conversations  
✅ Semantic search working  
✅ Staging environment stable  
✅ Tests passing (80%+ coverage)  
✅ Monitoring/metrics active  
✅ Team velocity: 90-110 points  
✅ Alpha coverage: 40-60%  

---

## Week 3-4 Preview (Sprint 2)

**Sprint 2 focuses on:**
- Document generation
- Memory system
- Cross-device sync
- Dashboard monitoring

Details in separate SPRINT_3_4_TASK_BREAKDOWN.md (created next sprint)

---

**Sprint Board Version:** 1.0  
**Status:** Ready for Execution  
**Created:** 2026-07-06
