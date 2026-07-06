# Working Roles & Rhythm: How We Build AIGINVEST

**Date:** July 6, 2026  
**Effective:** July 7, 2026  
**Status:** 🚀 READY

---

## The Three Complementary Roles

### Role 1: Founder (You)

**Your Job:** Drive vision. Make decisions. Remove blockers.

#### Daily Responsibilities
- **8:00 AM Standup** (15 min)
  - Ask: "What's the one priority today?"
  - Listen to the answer
  - Say: "Perfect. Everything else waits."

- **Throughout the day** (as needed)
  - Review progress if asked
  - Unblock immediately if something stops the team
  - Make YES/NO decisions on scope

- **5:00 PM Demo** (15 min)
  - See what shipped
  - Decide if it fits the vision
  - Approve or request changes
  - Plan next day's priority

#### Weekly Responsibility
- **Friday EOD** (30 min)
  - Review the three questions:
    1. Would I show this to an investor?
    2. Would I let a customer use today?
    3. Would I put my name on it?
  - All YES = on track
  - Any NO = identify what to fix next week

#### Your Decision Authority
- YES to features (in or out of Alpha 0.1)
- YES to design decisions
- YES to when something ships
- YES to changes in priority
- NO to scope creep without discussion

### Role 2: Development Agent (Me)

**My Job:** Build working features. Ask smart questions. Implement the vision.

#### Daily Responsibilities
- **8:00 AM Standup** (15 min)
  - Deliver the priority for the day
  - Alert to any blockers
  - Confirm understanding

- **Throughout the day** (focus time)
  - Implement the priority
  - Write tests
  - Document as I go
  - Flag any architectural concerns
  - Ask permission before major changes

- **5:00 PM Demo** (15 min)
  - Show working code
  - Explain what was built
  - Demonstrate the feature
  - Ask for feedback

#### Engineering Discipline
- ✅ Every feature must be tested
- ✅ Every feature must be documented
- ✅ Every feature must satisfy the engineering rule
- ✅ Every commit moves Alpha 0.1 forward
- ✅ Every demo proves something works

#### My Responsibility
- Implementation quality
- Technical decisions (within bounds)
- Asking for clarity when needed
- Blocking on bad decisions (if I see them)
- Shipping on time

### Role 3: Technical Reviewer (You, in this capacity)

**Your Job:** Challenge architecture before it becomes expensive. Ensure vision fit.

#### When You Review

**Before decisions become expensive:**
- Database schema design
- API architecture
- Authentication approach
- Major library choices
- Integration patterns

**Questions to ask:**
- Does this fit our vision?
- Will this scale to the full AIGINVEST experience?
- Is this the simplest solution?
- Can we change it later if we're wrong?
- Does Diana work well with this?

**Your decision:**
- YES (approve, move forward)
- NO (send back, explain why)
- MODIFY (ask for changes, then YES)

---

## The Daily Rhythm

### 8:00 AM Standup (15 minutes)

**Format:**
```
Founder: "Good morning. What's the priority today?"

Agent: "[P1 item from sprint board]"

Founder: "Perfect. That's the one thing. Everything else waits."

Agent: "Any blockers from yesterday: [yes/no]"

Founder: "[Remove blocker if exists]"

Founder: "See you at 5 PM with working code."

Agent: "Done."
```

**Output:** Clear priority, no ambiguity

### 9:00 AM - 5:00 PM Build (8 hours)

**How it works:**
- Agent focuses on the one priority
- No context switching
- No meetings
- No distractions
- Write code, write tests, write docs

**Agent asks questions asynchronously if needed:**
- Slack/async: "Quick decision needed on X"
- Founder responds within 30 min if possible

**Blockers:**
- If blocked, Agent raises immediately
- Founder unblocks same day or explains timeline
- Code continues while waiting if possible

### 5:00 PM Demo (15 minutes)

**Format:**
```
Agent: "Here's what I built today."

[Shows working code in action]

Agent: "It does X, Y, and Z."

Founder: "Does it fit the vision?" [YES / NO / MODIFY]

Agent: "What's tomorrow's priority?"

Founder: "[Next P1 item from sprint board]"

Agent: "Got it. See you tomorrow."
```

**Outcome:** 
- Shipped feature approved
- Next day's priority clear
- Plan updated
- Everyone knows the status

### At End of Day

**Agent updates the sprint board:**
- Move item from "In Progress" → "Done" or "Blocked"
- Add new item to "In Progress"
- Note any blockers

**Status is visible for tomorrow:**
- Founder knows where we are
- No surprises at standup

---

## The Weekly Rhythm

### Monday-Thursday (Build Days)

Same standup → build → demo rhythm every single day.

### Friday (Review Day)

**Morning:** Same standup, same priority (the last P1 item or polish)

**5:00 PM:** Extended review instead of demo

```
Agent: "Here's what we shipped this week."

[Shows all work, all completed features]

Founder: Three-question review:
1. Would I show this to an investor? [YES/NO]
2. Would I let a customer use today? [YES/NO]
3. Would I put my name on it? [YES/NO]

If all YES:
  Founder: "We're on track. Great work."
  
If any NO:
  Founder: "Let's fix X next week."
  
Agent: "Here's the plan for next week..."
```

---

## Decision Framework

### Decisions That Need Founder Approval

**Before being built:**
- Scope (in or out of Alpha 0.1?)
- Major technical approach (database strategy, auth system, etc.)
- Design direction (which mockup?)
- Timeline impact (will this delay Alpha 0.1?)

**Answer:** YES / NO / MODIFY (with clarity on what to change)

**When:** Within 24 hours (goal: same day)

### Decisions Agent Can Make

**During implementation:**
- How to structure code
- Which libraries (within reason)
- Refactoring approach
- Performance optimization
- Test strategy

**Rule:** If you'd explain it at standup and it doesn't block the priority, just do it.

### Decisions That Can't Be Made

**Must be discussed:**
- Anything that changes the vision
- Anything that delays Alpha 0.1
- Anything that reduces quality
- Anything that breaks the engineering rule

**Process:** Ask immediately, get clarity, move forward

---

## Communication Protocol

### Real-time Communication (For Blockers)

**If the agent needs a quick decision:**
- Send message: "Quick decision needed on X. [Context]. Deadline: [time]"
- Founder responds within 30 min if possible
- If no response by deadline, Agent proceeds with best judgment and flags at standup

### Standup Communication

**The one synchronous meeting per day**
- 8:00 AM every morning
- 15 minutes max
- One priority, one blocker status, one plan

### Demo Communication

**5:00 PM every day**
- 15 minutes max
- Show working code
- Get feedback
- Plan next day

### Weekly Communication

**Friday EOD review**
- 30 minutes
- See all week's work
- Three-question evaluation
- Plan next week

---

## The Commitment

### Founder Commits To

✅ Being available for 8 AM standup  
✅ Making decisions same-day if possible  
✅ Removing blockers  
✅ Giving feedback at demos  
✅ Protecting focus time for agent  
✅ Saying YES or NO clearly  

### Agent Commits To

✅ Being ready for 8 AM standup  
✅ Shipping something by 5 PM demo  
✅ Writing tests  
✅ Documenting as I go  
✅ Following the engineering rule  
✅ Asking questions before making expensive changes  

### Both Commit To

✅ One priority per day  
✅ No scope creep mid-week  
✅ Quality (no hacks)  
✅ The vision (everything fits AIGINVEST)  
✅ Shipping on time (Aug 3)  

---

## If Something Goes Wrong

### If Agent Gets Blocked

**Process:**
1. Agent identifies the blocker
2. Agent messages founder: "[Blocker]. Need [solution]. Deadline: [time]"
3. Founder unblocks within 24 hours
4. Agent resumes build

**Example:**
- "Can't test database without credentials. Need database connection. Deadline: 10 AM"
- Founder: "Use this connection string"
- Agent resumes

### If Decision Needs to Be Made

**Process:**
1. Agent asks: "Should we do X or Y? Context: [explain]. Deadline: [time]"
2. Founder responds: "Do X because [reason]"
3. Agent implements
4. Mention at standup if important

**Example:**
- "Should auth be session-based or token-based? We need this for chat persistence. Deadline: 9 AM"
- Founder: "Token-based so Diana works across devices"
- Agent implements

### If Priority Changes

**Process:**
1. Founder identifies urgent change
2. Founder asks: "Can we shift to priority X instead?"
3. Agent responds: "Yes / No / Only if we push Y to tomorrow"
4. Both agree
5. New priority is built today

**Rule:** Only happens if truly urgent. Otherwise, it goes in next week's backlog.

---

## The Daily Report

**Every EOD, Agent provides one-sentence status:**

```
Monday: "Authentication working. Users can register and login."

Tuesday: "Streaming chat implemented. Diana responds word-by-word."

Wednesday: "Conversation history visible in sidebar. Persistence working."

Thursday: "Memory integration complete. User data restored after browser close."

Friday: "All P1 complete. First demo ready. Quality review passed."
```

---

## What Success Looks Like

### By End of Week 1

- ✅ User can register
- ✅ User can login
- ✅ Diana greets them
- ✅ Chat streams beautifully
- ✅ Conversations persist
- ✅ History is visible
- ✅ Zero TypeScript errors
- ✅ Zero console warnings
- ✅ Founder would show to partner

### By August 3

- ✅ Complete AIGINVEST experience shipped
- ✅ All three Friday questions = YES
- ✅ Users can: visit → register → chat → create → return
- ✅ Proud of quality
- ✅ Ready for feedback

---

## The Golden Rule

**Everything exists to answer one question:**

> **"What working feature did we ship today?"**

Not processes. Not meetings. Not planning.

But: **Working features. Every day.**

---

**Status:** 🚀 READY FOR MONDAY  
**First Standup:** 8:00 AM Monday  
**First Priority:** Authentication + Diana Welcome  
**First Demo:** 5:00 PM Monday  

Let's ship AIGINVEST. 🎯
