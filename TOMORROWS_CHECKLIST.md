# Tomorrow's Checklist: Sprint 1 Begins

**When:** Next session  
**Duration:** 2 weeks  
**Goal:** AIGINVEST Alpha – "Meet Diana"  

---

## What Happened Today

✅ **Built:** Complete Diana MVP with streaming chat, markdown, code highlighting  
✅ **Decided:** AIGINVEST is the destination, Diana is primary interface, North Star ONE is premium hardware  
✅ **Locked:** Brand architecture, messaging guide, execution playbook, sprint roadmap  
✅ **Committed:** All decisions to git with clear commit messages

---

## What Needs to Happen Tomorrow

### Priority 1: Database (Day 1 - 5 minutes)

**Task:** Start PostgreSQL

```bash
docker run -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  postgres:16
```

**Verify:** Connection successful in API logs

**Slack:** "✅ PostgreSQL running"

---

### Priority 2: Persistence Testing (Day 1-2 - 1 hour)

**Test Full User Journey:**
1. Open http://localhost:3000
2. Login: demo@example.com
3. Chat with Diana
4. Refresh page
5. Verify conversation is still there
6. Create another conversation
7. Refresh again
8. Verify both conversations saved

**Expected:** All conversations persist and load

**Slack:** "✅ Full persistence working"

---

### Priority 3: Project Creation Endpoints (Day 2-3 - 2 hours)

**Build Backend:**
```typescript
// Add to chat.controller.ts
@Post('projects')
async createProject(@Body() dto: CreateProjectDto) {
  return this.chatService.createProject(dto);
}

// Add to chat.service.ts
async createProject(dto: CreateProjectDto) {
  // Save project to database
  // Return project with id
}
```

**Database:** Add Project model to schema.prisma

**Test:** POST /api/projects should create project

**Slack:** "✅ Project endpoints working"

---

### Priority 4: Diana Intent Detection (Day 3-4 - 2 hours)

**Goal:** Diana detects "create project" requests

**Simple Implementation:**
```typescript
// In diana.service.ts
detectCreateProjectIntent(message: string): boolean {
  const patterns = [
    /create.*project/i,
    /new.*project/i,
    /start.*project/i,
    /launch.*project/i
  ];
  return patterns.some(p => p.test(message));
}
```

**When detected:**
1. Parse project name from message
2. Call API to create project
3. Return success message with project details

**Slack:** "✅ Diana can detect project creation requests"

---

### Priority 5: UI for Projects (Day 4-5 - 3 hours)

**Frontend Tasks:**
- Add "Projects" section to sidebar
- Show created projects
- Click to navigate to project
- Display project conversations

**Test:** Create project through Diana, see it in sidebar

**Slack:** "✅ Projects appear in UI"

---

### Priority 6: Polish & Verify (Day 5-7)

**Checklist:**
- [ ] Zero TypeScript errors
- [ ] Zero console warnings
- [ ] Fast load times
- [ ] Smooth interactions
- [ ] Beautiful design
- [ ] All workflows work end-to-end
- [ ] Documentation updated

**Slack:** "✅ Feature complete and polished"

---

### Priority 7: Friday Review (Day 7)

**Answer The 5 Questions:**
1. Is Diana more helpful? YES/NO
2. Is the UI simpler? YES/NO
3. Is the platform faster? YES/NO
4. Is the architecture cleaner? YES/NO
5. Would we confidently demo this? YES/NO

**If all YES:** Proceed to next sprint  
**If any NO:** Identify what to fix, extend sprint

**Slack:** "✅ Weekly review complete"

---

## Files to Reference

Before you start, read these in order:

1. **[AIG_BRAND_ARCHITECTURE_v1.0.md](./AIG_BRAND_ARCHITECTURE_v1.0.md)** (10 min)
   - Why we're building AIGINVEST, not North Star ONE
   - Brand hierarchy locked

2. **[SPRINT_1_REVISED_ROADMAP.md](./SPRINT_1_REVISED_ROADMAP.md)** (15 min)
   - Exact scope for Sprint 1
   - Definition of done
   - Weekly review process

3. **[AIGINVEST_EXECUTION_PLAYBOOK.md](./AIGINVEST_EXECUTION_PLAYBOOK.md)** (20 min)
   - How we work together
   - Decision framework
   - Escalation path

4. **[AIGINVEST_MESSAGING_GUIDE.md](./AIGINVEST_MESSAGING_GUIDE.md)** (as reference)
   - Use correct terminology in all communications
   - AIGINVEST = ecosystem, Diana = companion, AIOS = OS, North Star ONE = hardware

---

## Current System State

### Running Services
- ✅ API (NestJS) on :3333
- ✅ Frontend (Next.js) on :3000
- ✅ Browser at http://localhost:3000/home

### What Works
- ✅ Login with email
- ✅ Diana home screen
- ✅ Chat with streaming
- ✅ Markdown rendering
- ✅ Code highlighting
- ✅ Conversation management

### What Needs Work
- ⏳ PostgreSQL persistence (setup needed)
- 🟡 Project creation (backend + UI)
- 🟡 Document saving (backend + UI)

### Code Quality
- ✅ 0 TypeScript errors
- ✅ 0 build errors
- ✅ All endpoints mapped
- ✅ Production ready

---

## Development Environment

### Start Backend
```bash
cd apps/api
npm start
```

### Start Frontend
```bash
cd apps/web
npm start
```

### Browser
```
http://localhost:3000
```

### Database (New Tomorrow)
```bash
docker run -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  postgres:16
```

---

## Key Files to Edit

### Frontend (UI for Projects)
- `apps/web/app/chat/page.tsx` — Add projects section to sidebar

### Backend (Project Creation)
- `apps/api/src/chat/chat.controller.ts` — Add project endpoints
- `apps/api/src/chat/chat.service.ts` — Add project logic
- `apps/api/src/chat/diana.service.ts` — Add intent detection
- `prisma/schema.prisma` — Add Project model

---

## Git Workflow

### Commit Format
```
git add .
git commit -m "feature: [Feature name]

Brief description of what changed.
- Bullet points for key changes
- Links to related decisions if applicable"
```

### Example
```
git commit -m "feat: Diana can create projects

Implemented project creation:
- Intent detection in diana.service.ts
- POST /api/projects endpoint
- Project model in Prisma schema
- UI updates in chat sidebar
- Full end-to-end working"
```

---

## Success Metrics (Daily)

### Day 1
- [ ] PostgreSQL running
- [ ] Persistence works
- [ ] Can demo "login → chat → refresh → see saved"

### Day 3
- [ ] Project creation endpoints built
- [ ] Diana can detect intent
- [ ] API tests passing

### Day 5
- [ ] Projects appear in UI
- [ ] Can create project from chat
- [ ] All workflows working

### Day 7
- [ ] All 5 review questions: YES
- [ ] Zero errors
- [ ] Ready for Alpha

---

## Communication During Sprint

### Daily (Morning)
**Quick standup:**
- What did I finish yesterday?
- What am I starting today?
- What's blocking me?

### Daily (Evening)
**Status update:**
- X% complete on project creation
- No blockers
- On track for Friday

### Friday (EOD)
**Weekly review:**
- The 5 Questions (each answered YES/NO)
- What we accomplished
- What we learned
- What's next

---

## Decision Log

### Locked Decisions (Don't Revisit)
✅ AIGINVEST is destination (not North Star ONE)  
✅ Diana is primary interface (not device-tied)  
✅ One tool in Sprint 1 (not two)  
✅ No feature creep (scope is locked)  
✅ 2-week sprint (hard deadline)  

### Things You Can Decide During Sprint
- UI/UX improvements
- Performance optimizations
- Code refactoring
- Documentation updates
- Test coverage additions
- Error handling edge cases

### Things That Require Escalation
- Scope changes (add/remove features)
- Timeline extension
- Brand messaging changes
- Major architecture changes
- Contradictions with roadmap

---

## Questions to Ask Before Starting

### Product Questions
- "Is this part of Sprint 1 scope?" → Check roadmap
- "Does this strengthen AIGINVEST?" → Check brand architecture
- "How do I message this?" → Check messaging guide

### Technical Questions
- "How do I structure this?" → Check existing patterns
- "What's the API response format?" → Check chat.dto.ts
- "How do I integrate with Diana?" → Check diana.service.ts

### Execution Questions
- "Is this the highest priority?" → Check sprint backlog
- "Should I escalate this?" → Check decision framework
- "How do I commit this?" → Check git workflow

---

## What NOT to Do

❌ Build North Star ONE  
❌ Build AIOS  
❌ Build Marketplace UI  
❌ Build Enterprise features  
❌ Build Mobile app  
❌ Change the scope  
❌ Extend the timeline  
❌ Add features without design  

---

## The Vision (Keep This Close)

A user sits down.

Opens AIGINVEST.

Meets Diana.

Chats with her.

Creates a project with one sentence.

Saves documentation.

Returns tomorrow.

Everything is there.

And they think:

> **"Wow… this is different."**

---

## Final Checklist Before Starting

- [ ] Read AIG_BRAND_ARCHITECTURE_v1.0.md
- [ ] Read SPRINT_1_REVISED_ROADMAP.md
- [ ] Read AIGINVEST_EXECUTION_PLAYBOOK.md
- [ ] Understand the brand hierarchy
- [ ] Understand the sprint scope
- [ ] Know how we work together
- [ ] PostgreSQL ready to start
- [ ] Both servers running
- [ ] Ready to build

---

## Ready?

Check list above.

Read the three strategy docs.

Start with Priority 1 (PostgreSQL).

You've got this.

Let's build AIGINVEST. 🚀

---

**Next Session:** Sprint 1 begins  
**Target:** AIGINVEST Alpha in 2 weeks  
**Mission:** "Wow… this is different."
