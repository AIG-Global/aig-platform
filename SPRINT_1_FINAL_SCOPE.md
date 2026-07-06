# Sprint 1: Final Scope (LOCKED)

**Version:** 1.0  
**Duration:** 2 weeks  
**Owner:** Track B (Engineering)  
**Status:** 🔒 SCOPE LOCKED  

---

## The Rule

**Sprint 1 builds exactly these five things. Nothing else.**

When Sprint 1 is complete, we assess. Then we decide on Sprint 2.

---

## The Five Things

### 1. Diana Chat ✅ (Already Done, Polish This Week)

**What exists:**
- Streaming SSE responses (word-by-word)
- Markdown rendering (headings, lists, emphasis, code, blockquotes)
- Code syntax highlighting (20+ languages)
- Copy buttons on code blocks
- Conversation history display
- Auto-scroll

**What to polish:**
- [ ] Confirm all markdown renders correctly
- [ ] Confirm code highlighting works for all languages
- [ ] Copy buttons work reliably
- [ ] No console errors during chat
- [ ] Smooth animations and transitions
- [ ] Mobile responsive

**Definition of Done:**
- Chat feels polished and intentional
- Zero TypeScript errors
- Zero console warnings
- Users can have natural conversations with proper formatting

**Acceptance Criteria:**
- Stream responses work 100% of the time
- All markdown renders beautifully
- Code blocks have working copy buttons
- Mobile view is polished
- No accessibility issues

---

### 2. Memory (Persistence)

**What to build:**
Users should be able to close their browser and return tomorrow with everything saved.

**Scope:**
- [ ] All conversations persisted to database (Prisma)
- [ ] All messages in conversations persisted
- [ ] User can see conversation list on /home
- [ ] User can click conversation to resume
- [ ] Conversation titles are editable (already endpoint exists)
- [ ] All data soft-deleted (deletedAt field, not hard delete)

**API Endpoints (Already defined, just need to work):**
- POST /api/chat/create — Create conversation
- POST /api/chat/message — Save message
- GET /api/chat/user/:userId — List conversations
- GET /api/chat/:id — Get conversation with messages
- PATCH /api/chat/:id/title — Update title

**Database Setup:**
- PostgreSQL running locally (Docker or native)
- Prisma migrations applied
- User, Conversation, Message tables created

**Definition of Done:**
- User creates account
- User chats with Diana
- User closes browser
- User returns next day
- All conversations are there

**Acceptance Criteria:**
- All conversations persisted
- All messages persisted
- No data loss
- Quick retrieval (< 500ms)
- Soft delete working
- Zero errors on persistence

---

### 3. Documents

**What to build:**
Users can save documents related to their projects/conversations.

**Scope:**
- [ ] Users can upload/paste documents
- [ ] Documents associated with conversations or projects
- [ ] Document list in sidebar (optional, can be simple)
- [ ] Retrieve documents for a conversation
- [ ] Edit document title/metadata
- [ ] Soft delete documents

**API Endpoints (Already defined):**
- POST /api/documents — Create document
- GET /api/documents/:id — Get one document
- GET /api/documents/user/:userId — Get user's documents
- GET /api/documents/conversation/:id — Get conversation's documents
- PATCH /api/documents/:id — Update document
- DELETE /api/documents/:id — Soft delete

**UI:**
- Simple upload button in chat
- Or paste text directly
- Show list of documents below conversation

**Definition of Done:**
- User can save a document
- Document is persisted
- User can retrieve and view document
- Can be used for the demo scenario

**Acceptance Criteria:**
- Document upload works
- Document retrieval works
- Documents associated correctly
- All endpoints tested
- Zero errors

**Priority:** Medium (Not critical for first demo, but foundation for future)

---

### 4. One Tool (Diana Can Create Projects)

**What to build:**
Diana can do something, not just respond. This is the proof point.

**Scope:**
- [ ] Diana detects "create project" intent (pattern matching for now)
- [ ] Diana extracts project details from user message
- [ ] Backend creates project in database
- [ ] Sidebar shows new project immediately
- [ ] User can click project to see details

**API Endpoints (New, needs building):**
- POST /api/projects — Create project
- GET /api/projects/:id — Get one project
- GET /api/projects/user/:userId — Get user's projects
- PATCH /api/projects/:id — Update project
- DELETE /api/projects/:id — Soft delete project

**Database:**
- New Project model in Prisma
  - id, userId, name, description, createdAt, updatedAt, deletedAt

**Diana's Behavior:**
User: "Help me build a todo app"
Diana: "Great! I'll help you build a todo app. I've created:
        ✓ Project: Todo App
        ✓ Starter structure
        ✓ Initial tasks
        Everything is saved to your workspace."

**Definition of Done:**
- Diana recognizes project creation requests
- Projects are created in database
- Sidebar shows projects
- User can interact with project
- This is the ONE TOOL that proves Diana works

**Acceptance Criteria:**
- Intent detection works for "create project"
- Project creation API works
- Sidebar real-time update works
- Demo scenario works end-to-end
- Zero errors

**Priority:** HIGH (Critical for first demo)

---

### 5. Authentication Polish

**What to build:**
Make the login/logout experience perfect.

**Scope:**
- [ ] Email registration works smoothly
- [ ] Password validation clear
- [ ] Login errors are helpful (not cryptic)
- [ ] Logout works cleanly
- [ ] Session persistence works
- [ ] Redirect logic is correct
- [ ] Mobile responsive
- [ ] Beautiful loading states

**Existing Endpoints:**
- POST /api/auth/register (if exists, or use localStorage hack)
- POST /api/auth/login (if exists, or use localStorage hack)
- GET /api/auth/logout

**Current State:**
- Uses localStorage for demo (good enough for Sprint 1)
- No backend auth yet (PostgreSQL users table, auth service)

**Definition of Done:**
- User can register and login reliably
- No errors or confusing messages
- Experience feels polished
- Mobile works perfectly
- Demo scenario starts smoothly from here

**Acceptance Criteria:**
- Registration works 100%
- Login works 100%
- No cryptic errors
- Beautiful UI
- Mobile responsive
- Zero bugs

---

## Development Priorities

### Week 1
1. **Persistence (Database + API)** — Get PostgreSQL working, save/retrieve conversations
2. **Home Screen** — Show recent conversations, beautiful welcome
3. **Documents** — Basic upload and retrieve

### Week 2
1. **Projects API** — Build POST/GET projects endpoints
2. **Diana Intent** — Add pattern matching for "create project"
3. **Sidebar Updates** — Real-time project list updates
4. **Polish Everything** — Auth, chat, UX, mobile, errors
5. **End-to-end Demo** — Verify full user journey works

---

## Technical Checklist

### Database
- [ ] PostgreSQL running (Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`)
- [ ] Connection string in `.env`
- [ ] Prisma schema has Project model
- [ ] Migrations applied
- [ ] All tables created

### Backend
- [ ] NestJS running on :3333
- [ ] All 12 chat endpoints working
- [ ] New project endpoints working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] CORS working

### Frontend
- [ ] Next.js running on :3000
- [ ] /login → /home → /chat flow works
- [ ] Sidebar shows conversations and projects
- [ ] Real-time updates when Diana creates project
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Mobile responsive

### Code Quality
- [ ] Zero TypeScript errors across all files
- [ ] Zero console warnings
- [ ] All API responses properly typed
- [ ] Error handling for all edge cases
- [ ] No dead code
- [ ] Git history is clean

---

## Definition of Done (For Sprint 1)

Sprint 1 is done when:

✅ All five items complete  
✅ Demo scenario works end-to-end  
✅ Zero TypeScript errors  
✅ Zero console warnings  
✅ Zero bugs in critical path  
✅ All endpoints tested  
✅ Database persisting all data  
✅ Mobile responsive  
✅ Friday questions all = YES  

---

## Friday Acceptance Questions

**Every Friday, answer:**

1. **Would I show this to an investor?**
   - Does it demonstrate AIGINVEST's value?
   - Is it impressive?
   - Is it bug-free?

2. **Would I let a customer use it today?**
   - Is it reliable?
   - Does it work as expected?
   - Would they feel confident?

3. **Would I be proud to put my name on it?**
   - Is the code clean?
   - Is the UX polished?
   - Is it intentional?

**If all three = YES:** ✅ On track  
**If any = NO:** 🟡 Identify what to fix

---

## What's NOT in Sprint 1

❌ Mobile app (comes later)  
❌ Advanced AI (comes later)  
❌ AIOS integration (comes later)  
❌ North Star ONE (comes later)  
❌ Marketplace (comes later)  
❌ Team features (comes later)  
❌ Advanced analytics (comes later)  
❌ Webhooks or integrations (comes later)  

**Just these five things. In two weeks. Polished.**

---

## Success Looks Like

After Sprint 1:
- Users can create accounts
- Users can chat with Diana
- Diana can create projects (proof of action)
- Everything persists
- Everything is beautiful
- Zero errors
- Ready to demo to customers
- Ready to get first feedback

---

## Communication

### Track A (Product) Needs to Approve:
- [ ] Diana's intent detection patterns
- [ ] Diana's response when project is created
- [ ] Sidebar design and project display
- [ ] Home screen design
- [ ] Any UX questions

### Track C (Design) Needs to Approve:
- [ ] Sidebar layout
- [ ] Project display in sidebar
- [ ] Home screen with conversation history
- [ ] Mobile responsive layouts

### Track B (Engineering) Commits To:
- [ ] All five items complete and polished
- [ ] Zero TypeScript errors
- [ ] Zero console warnings
- [ ] Demo scenario works
- [ ] Friday submission quality

---

## Git Workflow

Every commit should be one of these:

```
feat: [Feature name] - [What it does]
fix: [Bug name] - [How it's fixed]
refactor: [Code name] - [How it's improved]
chore: [Task name] - [Why it matters]
```

Keep commits small and focused. Each commit should move toward one of the five items.

---

## Definition of "Done" for Each Item

### Diana Chat
- Streaming works reliably
- Markdown renders correctly
- Code highlighting on all languages
- Copy buttons work
- No errors
- Mobile responsive

### Memory
- Conversations persisted
- Messages persisted
- Retrieval works
- Soft delete working
- Database queries optimized

### Documents
- Upload works
- Retrieval works
- Associated correctly
- API all tested
- No errors

### One Tool (Projects)
- Intent detection works
- Project creation works
- Sidebar updates real-time
- User can interact
- Demo scenario complete

### Authentication
- Registration smooth
- Login smooth
- Logout works
- Errors helpful
- Mobile perfect
- Beautiful UX

---

## Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Database + Persistence + Auth Polish | Users can return tomorrow |
| 2 | Projects + Intent + UI Polish | Demo scenario works end-to-end |
| Friday | Final Polish + Verification | All questions = YES |

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| TypeScript Errors | 0 | ⏳ TBD |
| Console Warnings | 0 | ⏳ TBD |
| API Endpoints Tested | 12/12 | ⏳ TBD |
| Demo Scenario Works | 100% | ⏳ TBD |
| Friday Questions = YES | 3/3 | ⏳ TBD |

---

## The Commitment

**Track B commits to shipping** Sprint 1 with all five items complete, polished, and production-ready.

**Track A commits to providing** clear requirements and quick feedback.

**Track C commits to designing** beautiful, responsive, intentional UI.

**We commit to shipping something users can actually use.**

---

**Status:** 🔒 SCOPE LOCKED  
**Duration:** 2 weeks  
**Owner:** Track B  
**Target:** End-to-end demo scenario complete  

Let's build. 🚀
