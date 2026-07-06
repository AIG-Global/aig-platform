# Daily Execution: One Question Framework

**Effective:** July 6, 2026  
**Cadence:** Every day  
**Purpose:** Focus on the single most important thing  

---

## The Daily Question

Every day at standup:

> **What is the single most important thing that moves AIGINVEST forward today?**

---

## How to Answer It

### Step 1: What Are We Building?
**Alpha 0.1 – Meet Diana**

The user journey with 7 steps:
1. Visit AIGINVEST
2. Create Account
3. Meet Diana
4. Start Conversation
5. Create Project
6. Persistence
7. Return Tomorrow

### Step 2: What's the Blocker?
What's preventing us from completing the next step?

Examples:
- "PostgreSQL isn't running" → Database setup is THE thing
- "Diana's intent detection isn't defined" → Define it is THE thing
- "Homepage mockup isn't approved" → Approve mockup is THE thing

### Step 3: What Moves That Forward?
What single action removes the blocker?

Examples:
- "Start PostgreSQL container"
- "Founder defines Diana's phrases"
- "Design presents homepage and founder approves"

### Step 4: Commit
"Today, we finish [ONE THING]. Everything else waits."

---

## Daily Standup (5 minutes)

### Who Speaks
- Track A (Founder/Product)
- Track B (Engineering Lead)
- Track C (Design Lead)

### What They Say

**Track A:**
"The single most important thing today is [THING].
[TRACK] is going to [ACTION].
I will [SUPPORT/DECISION NEEDED]."

**Track B:**
"The single most important thing today is [THING].
I'm removing the blocker: [BLOCKER].
By EOD, we'll have [RESULT]."

**Track C:**
"The single most important thing today is [THING].
I'm delivering [DELIVERABLE].
Ready for [NEXT STEP]."

### Example Monday Standup

**Founder:** "The single most important thing today is getting the database running. Without it, everything blocks. Track B, start the PostgreSQL container. I'll monitor progress. By EOD we need proof of connection."

**Track B:** "Got it. Starting Docker PostgreSQL. By lunch we'll have the container up. By EOD we'll run the first migration. By tomorrow morning, users table exists and we can test."

**Track C:** "I'm using today to finalize the homepage design based on founder feedback. By EOD I'll have mockup ready for approval. Not blocking anything critical today."

**Founder:** "Perfect. Let's do this."

---

## Weekly Review: Journey Progress

### Friday Afternoon (15 minutes)

| Journey Step | Status | Quality | Owner |
|--------------|--------|---------|-------|
| Visit AIGINVEST | — | — | — |
| Create Account | — | — | — |
| Meet Diana | — | — | — |
| Chat Works | — | — | — |
| Create Project | — | — | — |
| Persistence | — | — | — |
| Return Tomorrow | — | — | — |

### How to Fill It

**Status:**
- ⏳ Not started
- 🔨 In progress
- 🟡 Blocked by...
- 🟢 Complete

**Quality:**
- ❌ Has errors
- 🟡 Has issues
- 🟢 Polished
- ✅ Ship-ready

### The Three Questions

**Question 1: Would I show this to an investor?**
- YES if journey steps are visibly working
- NO if there are bugs or incomplete pieces

**Question 2: Would I let a customer use it today?**
- YES if user could complete journey without error
- NO if anything might confuse them

**Question 3: Would I be proud to put my name on it?**
- YES if it feels intentional and polished
- NO if there are hacks or shortcuts visible

---

## Daily Check (End of Day)

### For Each Track

**Track B (Engineering):** "Did we move the user journey forward today?"
- YES → What step?
- NO → What blocked us?

**Track C (Design):** "Did we create something the product can build?"
- YES → What's ready?
- NO → What do we need?

**Track A (Founder):** "Are we on track to ship Alpha 0.1 in 30 days?"
- YES → Continue
- NO → What needs to change?

---

## Weekly Planning (Monday Morning)

### Question: What's the Next Step?

If last Friday's status was:
- **Step 1 (Visit):** Complete → Focus on Step 2 (Account)
- **Step 2 (Account):** In Progress → Keep working, unblock if needed
- **Step 3 (Diana):** Blocked → What's blocking? Unblock or reroute.

### This Week's Question

> "What single step of the journey are we completing this week?"

**Example:** "This week we're completing Step 2: Create Account. By Friday, users can register reliably, beautifully, and quickly."

### This Week's Blocker

> "What would stop us from completing it?"

**Example:** 
- "Database connection" → Priority 1
- "UI polish" → Priority 2
- "Mobile testing" → Priority 3

### Daily Priority

Each day, ask: "What moves Step 2 forward today?"

- Monday: Database connection
- Tuesday: Registration API
- Wednesday: UI polish
- Thursday: Mobile testing
- Friday: Review + fix issues

---

## When Something New Comes Up

### If Someone Suggests a New Idea

**Founder asks:**

1. "Does this move Alpha 0.1 forward?"
   - If NO → "Park it in backlog"
   - If YES → "How does it fit this week?"

2. "Does this risk slowing the journey?"
   - If YES → "Let's do it after Alpha 0.1"
   - If NO → "Let's discuss timing"

3. "Is this more important than what we're doing?"
   - If YES → "Shift priorities"
   - If NO → "Keep going"

### Example Conversation

**Engineer:** "I have an idea for real-time sync between devices."

**Founder:** "Great idea. Does it move Alpha 0.1 forward?"

**Engineer:** "Not really. It's a future feature."

**Founder:** "Perfect. Let's document it in the backlog. We'll build it for Alpha 0.3 when we have multi-device. For now, let's finish single-device experience first."

**Engineer:** "Good call. Parking it."

---

## The Daily Dashboard (What We Track)

### Three Numbers

1. **Journey Completion:** X/7 steps complete
2. **Quality Score:** 3/3 questions = YES (or no)
3. **Days to Ship:** N days until Alpha 0.1 launches

### Example Dashboard

```
ALPHA 0.1 – MEET DIANA
══════════════════════════════════════

Week 1 (Today)
├─ Journey Complete: 0/7
├─ Quality Score: N/A
├─ Days to Ship: 28
└─ Daily Question: Database ready?

This Week's Focus
└─ Step 1 & 2: Homepage + Registration

Blockers
└─ PostgreSQL not running yet

Next Review
└─ Friday EOD
```

### Update Every Friday

```
Week 2
├─ Journey Complete: 2/7 ✅
├─ Quality Score: 2/3 (need UX polish)
├─ Days to Ship: 21
└─ Daily Question: Projects working?

This Week's Focus
└─ Step 5: Project Creation

Blockers
└─ Diana intent detection

Next Review
└─ Friday EOD
```

---

## Communication

### To Yourself (Founder)
Every morning: **"What's the single thing that matters today?"**

### To Tracks
Every day: **"What's the blocker preventing us from finishing the journey?"**

### To Everyone
Every Friday: **"How close are we to shipping?"**

---

## The Discipline

This framework works **only if:**
- We ask the one question daily
- We answer it honestly
- We focus on that one thing
- We don't add to the list
- We ship complete journey steps, not isolated features

**If we break this discipline,** we'll scatter focus and miss the 30-day timeline.

**If we keep this discipline,** Alpha 0.1 ships on time.

---

## Success Looks Like

### By End of Week 1
- Database running
- Registration smooth
- Diana greeting ready
- Homepage approved

**Status:** 4/7 journey steps started ✅

### By End of Week 2
- All of above
- Project creation working
- Persistence tested
- Real-time sidebar updates

**Status:** 6/7 journey steps complete ✅

### By End of Week 3
- All of above
- Polish pass complete
- Mobile responsive
- Zero errors

**Status:** 7/7 journey steps polish ✅

### By End of Week 4
- All of above
- Final review passed
- Ready to ship
- Partners invited

**Status:** 7/7 journey steps ship-ready ✅

---

## The Phrase You'll Hear Every Day

**Founder:** "What's the single most important thing today?"

**Track B:** "[THING]"

**Track A:** "Perfect. Do that. Everything else waits."

---

## When Fatigue Sets In

If around Week 3 someone says: "I have a great idea for [feature that's not in Alpha 0.1]"

**Founder replies:** "I believe you. It's brilliant. And it's also in the backlog. We finish Alpha 0.1 first. Then we build Alpha 0.2. We're shipping on time."

**Discipline is the whole game here.**

---

## The Output

30 days later:

✅ Alpha 0.1 ships  
✅ Users can complete "Meet Diana" journey  
✅ Everything works, nothing breaks  
✅ Founder is proud to demo it  
✅ Ready for Alpha 0.2  

**Because we asked one question every day.**

---

**Principle:** One question. One focus. Complete journey.

**Timeline:** 30 days to ship

**Status:** 🚀 Ready to begin

Let's do this. 🎯
