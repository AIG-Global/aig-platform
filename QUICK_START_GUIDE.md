# Diana MVP — Quick Start Guide

**For developers joining the project or resuming work.**

---

## 30-Second Project Overview

Diana is an AI workspace companion built with Next.js (frontend) + NestJS (backend). Users sign in, see a beautiful welcome, then chat with Diana via streaming responses. Everything runs locally.

**Current Status:** ✅ Ready to run, feature-complete, zero build errors

---

## Getting Started (5 minutes)

### Prerequisites
- Node.js 24+ (ESM only)
- pnpm (or npm)
- Docker (for PostgreSQL)

### 1. Start Backend API
```bash
cd apps/api

# First time setup
npm install
npm run build

# Start server
npm start
# Expected: "Listening on http://localhost:3333"
```

### 2. Start Frontend
```bash
cd apps/web

# First time setup
npm install
npm run build

# Start server
npm start
# Expected: "- ready started server on 0.0.0.0:3000, url: http://localhost:3000"
```

### 3. Open Browser
```
http://localhost:3000

Login with: demo@example.com
```

### 4. Test the Flow
1. Login page appears
2. Click "Sign in"
3. Home page with Diana greeting
4. Click "Start a New Conversation"
5. Type: "Help me think about a product roadmap"
6. See streaming response with markdown

**✅ Done. Diana is working.**

---

## Architecture at a Glance

```
Diana MVP
├── apps/
│   ├── api/              # NestJS backend
│   │   ├── src/chat/     # Chat module (ChatController, ChatService)
│   │   ├── src/prisma/   # Database connection
│   │   ├── dist/         # Compiled JavaScript (build output)
│   │   └── main.ts       # Express bootstrap
│   │
│   └── web/              # Next.js frontend
│       ├── app/
│       │   ├── page.tsx        # Root (redirect to /home or /login)
│       │   ├── login/page.tsx  # Login page
│       │   ├── home/page.tsx   # Welcome screen with Diana
│       │   └── chat/page.tsx   # Conversation interface
│       └── tsconfig.json       # TypeScript config
│
└── prisma/
    ├── schema.prisma    # Database models
    └── migrations/      # Migration history
```

---

## Key Files to Know

### Frontend Files

| File | Purpose | Key Code |
|------|---------|----------|
| `apps/web/app/page.tsx` | Root entry point | Redirects authenticated users to `/home`, others to `/login` |
| `apps/web/app/login/page.tsx` | Email login | Saves `userEmail` to localStorage, redirects to `/home` |
| `apps/web/app/home/page.tsx` | Welcome screen | Diana greeting, recent conversations, start chat button |
| `apps/web/app/chat/page.tsx` | Chat interface | Streaming, markdown, code highlighting, sidebar |

### Backend Files

| File | Purpose | Key Code |
|------|---------|----------|
| `apps/api/src/main.ts` | Bootstrap | Creates NestFactory, enables CORS, listens on :3333 |
| `apps/api/src/chat/chat.controller.ts` | HTTP endpoints | 6 routes (POST create, POST stream, GET list, etc.) |
| `apps/api/src/chat/chat.service.ts` | Database ops | CRUD for conversations/messages using Prisma |
| `apps/api/src/chat/diana.service.ts` | AI responses | Generates streaming responses (word-by-word) |
| `apps/api/src/prisma.service.ts` | DB connection | Connects to PostgreSQL, handles connection errors gracefully |

### Database Schema

| Model | Fields | Purpose |
|-------|--------|---------|
| `User` | id, email, name | Authentication & profile |
| `Conversation` | id, userId, title | Chat session container |
| `Message` | id, conversationId, role, content | Individual messages |
| `Document` | id, conversationId, userId, title, content | Saved outputs |

---

## API Endpoints Reference

### Chat Endpoints

**Create Conversation**
```
POST /api/chat/create
Body: { userId: string, title: string }
Response: { id, userId, title, createdAt }
```

**Send Message**
```
POST /api/chat/message
Body: { conversationId, role: "user"|"assistant", content }
Response: { id, conversationId, role, content, createdAt }
```

**Stream Response** ⚡
```
POST /api/chat/stream
Body: { conversationId, userMessage }
Response: Server-Sent Events (text/event-stream)
Format: data: {"type":"text","content":"...","timestamp":"ISO"}
```

**Get Conversation**
```
GET /api/chat/:id
Response: { id, userId, title, messages: [...], createdAt, updatedAt }
```

**List User's Conversations**
```
GET /api/chat/user/:userId
Response: [{ id, userId, title, createdAt, updatedAt }, ...]
```

**Update Title**
```
PATCH /api/chat/:id/title
Body: { title: string }
Response: { id, userId, title, updatedAt }
```

### Document Endpoints

**Create Document**
```
POST /api/documents
Body: { conversationId?, userId, title, content, documentType, tags }
Response: { id, userId, title, createdAt }
```

**Get Document**
```
GET /api/documents/:id
Response: { id, userId, title, content, documentType, tags, createdAt }
```

**List User's Documents**
```
GET /api/documents/user/:userId
Response: [{ id, userId, title, createdAt }, ...]
```

**List Conversation Documents**
```
GET /api/documents/conversation/:conversationId
Response: [{ id, title, documentType, createdAt }, ...]
```

**Update Document**
```
PATCH /api/documents/:id
Body: { title?, content?, documentType?, tags? }
Response: { id, title, updatedAt }
```

**Delete Document** (soft delete)
```
DELETE /api/documents/:id
Response: { id, deletedAt }
```

---

## Common Tasks

### Run Tests
```bash
# Backend tests
cd apps/api
npm test

# Frontend tests
cd apps/web
npm test
```

### View API Logs
The API logs all requests to console. Check terminal where `npm start` is running.

### View Frontend Logs
Open browser DevTools (F12), check Console tab.

### Modify Chat Responses
File: `apps/api/src/chat/diana.service.ts`

Look for: `async *streamDianaResponse(userMessage)` method

---

## Database Setup (When Ready)

### Prerequisites
- Docker installed
- PostgreSQL 16

### 1. Start PostgreSQL
```bash
docker run \
  --name diana-postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -d postgres:16
```

### 2. Run Migrations
```bash
cd apps/api
npx prisma migrate deploy
```

### 3. Verify Connection
```bash
# In API terminal, should show:
# [Prisma] Established database connection
```

### 4. Create Sample Data
```bash
cd apps/api
npx prisma studio
# Opens web UI at http://localhost:5555
# Create User → Conversation → Message entries
```

---

## File Organization Strategy

### Frontend (Next.js App Router)
- `app/` contains all routes
- Each `page.tsx` = one route
- No `/pages` directory (using App Router, not Pages Router)
- CSS is inline (Tailwind + CSS-in-JS)

### Backend (NestJS Modules)
- `src/chat/` = ChatModule (contains Controller, Service, DTOs)
- `src/identity/` = IdentityModule (separate auth if needed)
- `main.ts` = Entry point (bootstrap Express)
- `prisma.service.ts` = Shared DB connection

### Database (Prisma)
- `prisma/schema.prisma` = Table definitions
- `prisma/migrations/` = Migration history
- `.env` = DATABASE_URL (local dev: postgresql://postgres:postgres@localhost:5432/diana_mvp)

---

## Development Workflow

### 1. Making Changes

**Frontend Change (add button)**
```typescript
// apps/web/app/home/page.tsx
<button onClick={newFunction}>Click me</button>
```

**Backend Change (add endpoint)**
```typescript
// apps/api/src/chat/chat.controller.ts
@Get('new-endpoint')
async newEndpoint() {
  return this.chatService.doSomething();
}
```

### 2. Build & Test
```bash
# Frontend
cd apps/web
npm run build  # Check for TypeScript errors
npm start

# Backend
cd apps/api
npm run build  # Check for TypeScript errors
npm start
```

### 3. Commit
```bash
git add .
git commit -m "feat: Add new feature description"
```

---

## Debugging

### Frontend Issues
1. Open http://localhost:3000
2. Press F12 for DevTools
3. Check Console for errors
4. Check Network tab for API calls

### Backend Issues
1. Check terminal where `npm start` is running
2. Look for `[Nest]` logs
3. API errors show with timestamp and stack trace

### TypeScript Issues
```bash
# Frontend
cd apps/web
npx tsc --noEmit  # Check for errors

# Backend
cd apps/api
npx tsc --noEmit  # Check for errors
```

### Database Issues
```bash
# Verify connection
docker ps | grep diana-postgres

# Check logs
docker logs diana-postgres

# Restart if needed
docker restart diana-postgres
```

---

## Environment Variables

### API `.env`
```
PORT=3333
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/diana_mvp
```

### Frontend `.env.local` (if needed)
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## Common Commands Reference

```bash
# Install dependencies (root)
pnpm install

# Build all apps
pnpm run build

# Start development
cd apps/api && npm start     # Terminal 1
cd apps/web && npm start     # Terminal 2

# TypeScript checking
npm run build                 # Shows type errors

# Database operations
npx prisma migrate dev       # Create new migration
npx prisma migrate reset     # Reset database to latest state
npx prisma studio           # Open web UI for database

# Git
git status                   # See changes
git add .                    # Stage all changes
git commit -m "message"      # Commit with message
git log                      # See commit history
```

---

## What NOT to Do

❌ Don't edit compiled `.js` files in `dist/` or `.next/`  
✅ Instead edit source `.ts` or `.tsx` files, then rebuild

❌ Don't use CommonJS (`require`) — Node.js is ESM-only  
✅ Instead use ES imports (`import`)

❌ Don't forget `.js` extensions in backend imports  
✅ Import like: `import x from './file.js'` (with .js)

❌ Don't start API/frontend in same terminal  
✅ Use separate terminals, one for each

---

## Quick Checklist

Before starting work:
- [ ] Run `pnpm install` (install dependencies)
- [ ] Start API: `cd apps/api && npm start`
- [ ] Start frontend: `cd apps/web && npm start`
- [ ] Open http://localhost:3000
- [ ] Test login with `demo@example.com`
- [ ] See home page with Diana greeting
- [ ] Send a chat message, see streaming response
- [ ] Check for TypeScript errors in terminal

After making changes:
- [ ] Save all files
- [ ] Rebuild: `npm run build` (check for errors)
- [ ] Test in browser
- [ ] Check terminal for runtime errors
- [ ] Commit with `git add .` && `git commit -m "..."`

---

## Need Help?

1. **Build error?** → Run `npm run build` and read the error message
2. **TypeScript error?** → Check the red underline in editor
3. **API not responding?** → Check terminal where API started
4. **Frontend not updating?** → Hard refresh (Ctrl+Shift+R)
5. **Database connection?** → Ensure PostgreSQL is running
6. **Can't login?** → Use `demo@example.com`, check browser console

---

## Next Phase Roadmap

- **Week 2:** Memory system (Diana remembers context)
- **Week 3:** Document export (save to PDF/markdown)
- **Week 4:** Diana actions (create projects, tasks)

---

**Last Updated:** July 6, 2026  
**Status:** ✅ Active Development  
**Lead:** You (presumably, since you're reading this!)
