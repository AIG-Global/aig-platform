# Week 1 Friday Demo Script (20 min)

## Pre-Demo Checklist (10 min before)
```bash
# Terminal 1: Start API
cd apps/api
npm run build
node dist/main.js

# Terminal 2: Start Web
cd apps/web
npm run dev
```

- [ ] API running on http://localhost:3333
- [ ] Web running on http://localhost:3001
- [ ] Open two browser windows: one for demo capture
- [ ] Clear browser cache/localStorage for clean state

---

## Demo Flow (20 min total)

### SEGMENT 1: Sign Up & Onboarding (3 min)

**[1:00-1:30]** Go to http://localhost:3001
- Shows login page
- Enter email: `demo+friday@test.com`
- Click "Create account"
- ✅ Redirects to /onboarding

**[1:30-2:00]** Outcome-first onboarding
- Shows "What are you trying to achieve?"
- 6 goal tiles: Launch startup, Grow business, Build software, Learn, Personal, Other
- Click "Launch startup"
- Type in textarea: `"Build an AI company that helps businesses automate their workflows"`
- Click "Continue"
- ✅ Redirects to /chat with ?goal= param

**[2:00-3:00]** Chat creates workspace
- Shows Diana greeting (no mission yet)
- User message appears: "Build an AI company..."
- Diana responds and creates workspace
- Workspace auto-provisions with projects and documents
- ✅ First message creates complete workspace

---

### SEGMENT 2: Create First Mission (3 min)

**[3:00-3:30]** Navigate to /missions
- Click "Missions" in nav
- Shows "Create New Mission" form
- Enter title: `"Launch Alpha"`
- Enter objective: `"Ship MVP to first 100 users"`
- Click "Create Mission"
- ✅ Mission appears in list with "planning" status

**[3:30-4:00]** Mission auto-provisions workspace
- Click "Open Workspace" on mission card
- Shows workspace with new project "General"
- ✅ Mission workspace fully functional

---

### SEGMENT 3: Diana Context Awareness (4 min)

**[4:00-4:30]** Diana greets with mission context
- Go back to /chat
- Start new conversation
- Click greet (or POST /api/chat/greet)
- ✅ Diana says: "Welcome back. You're working on **Launch Alpha**."
- Shows: Goal, Progress, Timeline
- "What should we focus on next?"

**[4:30-5:00]** Mission affects all responses
- User asks: "What's the first thing I should do?"
- Diana's response mentions mission objective
- Suggests tasks that align with "ship MVP to first 100 users"
- ✅ All Diana responses now mission-aware

**[5:00-5:30]** Activity timeline visible
- Go to workspace dashboard
- Scroll down to see activity timeline
- Shows: "🚀 Mission 'Launch Alpha' created"
- Shows: "💬 Conversation started with Diana"
- ✅ Activity tracking proves Diana's autonomous actions

---

### SEGMENT 4: Progress Tracking (3 min)

**[5:30-6:00]** View mission progress
- Go to /missions
- Mission card shows progress bar
- Currently 0% (no tasks completed)
- Description: "Get first 100 users"
- Timeline: 30 days (deadline visible)
- ✅ Mission tracking functional

**[6:00-6:30]** Complete a task
- Open workspace
- Check first task: "Define MVP scope"
- Mark as complete (click checkbox)
- ✅ Activity logs task completion
- ✅ Mission progress updates

---

### SEGMENT 5: Summary (2 min)

**[6:30-7:00]** Show operating model alignment
- Explain: "This demo shows Week 1 of the 90-day execution plan"
- Mission CRUD: ✅ Complete
- Auto-provision workspace: ✅ Complete
- Diana mission-aware: ✅ Complete
- Activity tracking: ✅ Complete

**[7:00-7:30]** Next week preview
- "Week 2: Milestone scheduling + dashboard graphs"
- "Week 3: Real-time collaboration + team workspaces"
- "Week 4: Production release: Alpha 0.3"

---

## API Endpoints Tested During Demo

```bash
# 1. Authentication
POST /api/auth/login
Request: { "email": "demo+friday@test.com" }
Response: { "id": "user-123", "email": "...", "createdAt": "..." }

# 2. Create Mission
POST /api/missions
Headers: x-user-id, x-org-id
Request: {
  "title": "Launch Alpha",
  "objective": "Ship MVP to first 100 users",
  "priority": "high"
}
Response: { "data": { "id": "mission-123", ... } }

# 3. List Missions
GET /api/missions
Headers: x-user-id, x-org-id
Response: [{ id, title, status, workspace, progress }, ...]

# 4. Diana Greet (Mission-Aware)
POST /api/chat/greet
Headers: x-user-id
Response: {
  "greeting": "Welcome back. You're working on **Launch Alpha**.\n\nGoal: Ship MVP...\n\nWhat should we focus on next?"
}

# 5. Chat Stream (Mission Context)
POST /api/chat/stream
Request: { conversationId, userMessage, userId }
Response: SSE stream with mission context in system prompt
```

---

## Key Talking Points

1. **Mission CRUD Works**: Created, read, listed missions successfully
2. **Auto-provision**: Single mission creation spun up:
   - Workspace with title
   - Default project
   - Can be extended to documents
3. **Diana Aware**: All responses include mission context:
   - Title: "Launch Alpha"
   - Objective: "Ship MVP"
   - Progress: 0/6 tasks
   - Timeline: 30 days
4. **Activity Logged**: Every action Diana helps with appears in timeline
5. **End-to-End Works**: Login → Create mission → Chat → Tasks → Complete

---

## Troubleshooting

**API won't start**
```bash
cd apps/api
npm run build  # Verify TypeScript compiles
node dist/main.js  # Check for runtime errors
```

**Web won't load**
```bash
cd apps/web
npm run dev  # Check Next.js compilation
# Should see "compiled client and server successfully"
```

**Database errors**
```bash
# Check PostgreSQL running
# Verify .env DATABASE_URL
npx prisma migrate dev  # Apply pending migrations
```

**Mission endpoint 404**
- Verify API started: `curl http://localhost:3333/api/health`
- Check MissionModule imported in main.ts
- Rebuild: `npm run build`

---

## Demo Success Criteria ✅

- [x] User can sign up with outcome-first onboarding
- [x] First goal creates workspace automatically
- [x] User can navigate to /missions
- [x] Create mission button works
- [x] Mission creates workspace auto-provision
- [x] Diana greeting includes mission context
- [x] All Diana responses aware of mission
- [x] Activity timeline shows Diana's work
- [x] Progress bar tracks mission completion
- [x] End-to-end: Login → Mission → Chat → Complete
