# Monday Standup Template & First Week Plan

**Date:** July 7, 2026  
**Time:** 8:00 AM  
**Duration:** 15 minutes  
**Location:** Standup (Daily)  

---

## The Monday Standup Format

### Every Monday (First of the Week)

**Founder:** "What are we shipping this week?"

**Track B:** "[Week's priority]"

**Track C:** "[Week's design priority]"

**All:** Confirm no blockers, commit to delivery

---

## First Week: July 7-13, 2026

### Sprint Goal

> **Finish the first complete Diana experience.**

Specifically:
- Database working
- Registration smooth
- Chat streaming
- Diana greeting perfect
- Homepage approved

### Top Priority

**The single most important thing this week:**

> Get PostgreSQL running, migrations applied, and prove that conversations persist to the database.

**Everything else depends on this.**

---

## Monday Standup Script (July 7)

### Founder Opens

"Welcome. We're now in execution phase. Today we start building Alpha 0.1 — Meet Diana.

Our goal this week is simple: Get the database working so we can save conversations.

Track B, what's your priority today?"

### Track B Responds

"PostgreSQL setup. We're starting the Docker container this morning. By lunch we'll have it running locally. By end of day, we'll verify the connection works and run our first Prisma migration.

We'll test saving a conversation to the database by EOD."

### Founder Confirms

"Perfect. That's the one thing. Everything else waits. Track C, what are you doing?"

### Track C Responds

"I'm finalizing the homepage design. By Tuesday I'll have mockups ready for your approval. Not critical for today, but I want to be ready for implementation."

### Founder Closes

"Excellent. We have clear focus. Let's reconvene at end of day to see the database working. Any blockers right now?"

**All:** "None. Ready to go."

**Founder:** "Let's ship it."

---

## Daily Cadence This Week

### Monday (Today)
**Focus:** PostgreSQL running  
**Deliverable:** Database connection verified  
**EOD Demo:** "Database is up and talking to the app"

### Tuesday
**Focus:** Database migrations  
**Deliverable:** All Prisma migrations applied  
**EOD Demo:** "User table, Conversation table, Message table all created"

### Wednesday
**Focus:** Chat persistence API  
**Deliverable:** Conversations save to database  
**EOD Demo:** "User creates conversation, closes browser, reopens, conversation is still there"

### Thursday
**Focus:** Message persistence API  
**Deliverable:** Messages save and retrieve  
**EOD Demo:** "User chats with Diana, refreshes browser, all messages are there"

### Friday
**Focus:** Quality review  
**Deliverable:** Zero errors, home page approved  
**EOD Demo:** "Complete journey from login to chat working. Homepage design approved."

### Friday Standup (Review)

**Founder asks:**
1. "Would I show this to an investor?" (Database working, registration smooth)
2. "Would I let a customer use today?" (Chat persisting perfectly)
3. "Would I put my name on it?" (Polished, no hacks)

**If all YES:** ✅ Ready for Week 2  
**If any NO:** 🟡 What needs to change?

---

## Week 1 Success Criteria

### Functional
- [ ] PostgreSQL running locally
- [ ] Prisma migrations applied
- [ ] User registration creates account
- [ ] Conversations save to database
- [ ] Messages save to database
- [ ] Conversations retrieve correctly
- [ ] User sees history on /home
- [ ] Zero data loss

### Quality
- [ ] Zero TypeScript errors
- [ ] Zero console warnings
- [ ] Zero unhandled database errors
- [ ] Mobile registration works
- [ ] Smooth user experience
- [ ] No confusing error messages

### Demo-Ready
- [ ] User can login, chat, close browser, return, continue
- [ ] Everything looks intentional
- [ ] Founder would show to partner
- [ ] No hacks or shortcuts visible

---

## The First Day (Monday) in Detail

### 8:00 AM - Standup (15 min)
- Review the goal
- Confirm priorities
- Check for blockers
- Commit to EOD demo

### 8:15 AM - Track B Begins
**Goal:** PostgreSQL running

**Steps:**
1. Start Docker PostgreSQL container
   ```
   docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
   ```

2. Verify connection
   ```
   psql -U postgres -c "SELECT 1"
   ```

3. Test Prisma connection
   ```
   cd apps/api
   npx prisma generate
   ```

4. Take a screenshot: "Database is running"

### 9:00 AM - Track C Begins
**Goal:** Homepage mockup ready

**Steps:**
1. Review founder's feedback (if any)
2. Finalize design
3. Create mockup (Figma, Sketch, or even detailed Miro board)
4. Get founder feedback by noon

### Noon - First Check-in
**Track B:** "Database running. Moving to migrations next."  
**Track C:** "Mockup ready for approval."

### 3:00 PM - Second Check-in
**Track B:** "Migrations applied. Tables created. Testing now."  
**Track C:** "Founder approved design. Implementation plan ready."

### 5:00 PM - EOD Standup (15 min)

**Track B demonstrates:**
"Here's PostgreSQL running. Here's the tables Prisma created. Here's the connection working. By tomorrow, we'll save and retrieve a conversation."

**Founder:** "Perfect. Week 1 is launched. See you tomorrow."

---

## What We're Doing Each Day

### Monday: Foundation
Get the database layer working.  
Remove the main blocker.  
Prove database → API → frontend works.

### Tuesday: Expansion
All database tables created.  
All migrations applied.  
Schema is locked.

### Wednesday: Integration
Chat persistence working.  
Conversations save.  
Conversations retrieve.

### Thursday: Completion
All persistence working.  
All data saves.  
All data retrieves.
Zero errors.

### Friday: Review
Polish everything.  
Get founder approval.  
Plan Week 2.

---

## If Something Breaks

### Approach
1. **Identify the blocker** — What's stopping us?
2. **Find the fix** — What's the fastest solution?
3. **Ask for help** — Do we need founder input?
4. **Unblock immediately** — Don't let it sit
5. **Move forward** — Continue today's priority

### Example
**Track B:** "PostgreSQL container won't start on Windows."

**Founder:** "What's the error?"

**Track B:** "Port 5432 already in use. Let me try 5433."

**Founder:** "Do that. Keep going."

**Track B:** "Got it. Trying now."

(No long debate, just unblock and continue.)

---

## Daily Commitment

### Track B Commits To:
- Focus on the one thing
- Remove blockers
- Deliver something visible by EOD
- Communicate any issues immediately
- All code is tested and quality

### Track C Commits To:
- Beautiful, thoughtful design
- Responsive on all devices
- Answers the three questions (on homepage)
- Implementation-ready
- Founder can approve and we ship it

### Founder Commits To:
- Clear, one-thing priority
- Fast decisions
- Unblock immediately
- Honest feedback by EOD
- Clear what's next

---

## The Rule for New Ideas

**If something new comes up:**

**Founder:** "Does it move this week's priority forward?"

**If YES:** "Let's do it. How much time?"

**If NO:** "Write it down. It's in the backlog for Week 2 or later."

**No debate. No ambiguity.**

---

## Measures of Success This Week

| Metric | Start | Friday |
|--------|-------|--------|
| Database running | ❌ | ✅ |
| Migrations applied | ❌ | ✅ |
| Chat persists | ❌ | ✅ |
| Messages persist | ❌ | ✅ |
| History visible | ❌ | ✅ |
| User journey: 0/7 | 0/7 | 4/7 |
| TypeScript errors | ? | 0 |
| Demo ready | ❌ | ✅ |

---

## Friday Review Framework

### By Friday EOD, We Should See

**Journey Progress:**
- ✅ Visit AIGINVEST (homepage approved)
- ✅ Create Account (registration smooth)
- ✅ Meet Diana (greeting ready)
- ✅ Chat Works (persistence proven)
- ⏳ Create Project (next week)
- ⏳ Persistence (done, but next week projects persist)
- ⏳ Return Tomorrow (next week)

**Quality:**
- ✅ Zero TypeScript errors
- ✅ Zero console warnings
- ✅ Database working perfectly
- ✅ No edge cases hit

**Friday Questions:**
1. "Would I show to investor?" — Database works, journey 50% visible
2. "Would I let customer use today?" — Registration and chat work
3. "Would I put my name on it?" — Everything feels intentional

**Answer:** Likely YES on all three if we hit targets

---

## The Excitement

Week 1 is about proving the database layer works.

Once we can save and retrieve conversations, we unlock Week 2 (projects and real-time updates).

If Week 1 is solid, Week 2 will be smooth.

---

## One Final Principle for Week 1

**Don't over-engineer.**

We need:
- PostgreSQL running ✅
- Prisma migrations ✅
- Save/retrieve working ✅
- Zero errors ✅

We don't need:
- Optimization (comes in Week 3)
- Advanced features (comes in Alpha 0.2)
- Enterprise hardening (comes later)

**Just solid, working, tested code.**

---

## Monday, July 7 at 8:00 AM

The moment execution begins.

The moment planning closes.

The moment we start shipping.

---

**Status:** 🚀 READY FOR EXECUTION  
**First Standup:** Monday 8:00 AM  
**First Deliverable:** Database running (EOD Monday)  
**First Week Goal:** Persistence working (EOD Friday)  

Let's go. 🎯
