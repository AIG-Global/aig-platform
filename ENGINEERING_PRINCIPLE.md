# Engineering Principle: Ship Small. Ship Complete. Ship Often.

**Date:** July 6, 2026  
**Status:** 🚀 LOCKED  
**Every developer reads this before contributing.**

---

## The Principle

> **Ship small. Ship complete. Ship often.**

This is how we maintain quality while moving fast.

---

## What It Means

### Ship Small

**Not:** Build a massive feature for weeks  
**But:** Build one small piece that works end-to-end

**Example:**
- ❌ "Build authentication system" (too big)
- ✅ "Build email + password registration" (small)

**Rule:** If a task takes > 3 days, break it into smaller pieces.

### Ship Complete

**Not:** "It's 80% done, ship it"  
**But:** "It's 100% done, tested, documented, shipped"

**Complete means:**
- ✅ Works end-to-end
- ✅ Tested (manually + automated)
- ✅ Documented
- ✅ No known bugs
- ✅ Beautiful UX
- ✅ Fits AIGINVEST vision

**Rule:** Don't move to the next task until this one is truly done.

### Ship Often

**Not:** Monthly releases  
**But:** Something ships every single day

**Example:**
- Monday: Registration working
- Tuesday: Streaming chat
- Wednesday: Conversation history
- Thursday: Memory integration
- Friday: Complete first journey

**Rule:** If a day ends with "nothing shipped," we didn't work well.

---

## The Philosophy

### Why This Works

**Speed without chaos:**
- Small scope keeps changes focused
- Complete work prevents technical debt
- Frequent shipping gives feedback quickly

**Quality without delays:**
- Small pieces are easier to test
- Complete work is higher quality
- Shipping often means catching bugs early

**Motivation without burnout:**
- Daily shipping provides wins
- Complete work feels good
- Frequent feedback energizes

### Why Other Approaches Fail

**"Ship big features monthly"**
- Unknown unknowns emerge late
- Bugs take longer to fix
- Difficult to course-correct
- Morale suffers waiting for release

**"Ship incomplete features fast"**
- Technical debt accumulates
- Quality suffers
- Users experience bugs
- Trust erodes

**"Ship rarely but perfectly"**
- Takes too long
- Market moves on
- Team burns out
- Feedback comes too late

---

## How to Work This Way

### Step 1: Define "Small"

**Before starting a task:**
- Can I ship this in 1-3 days? YES → Start
- Can I ship this in 1-3 days? NO → Break it smaller

**Example breakdown:**
- ❌ "Build chat" (1-2 weeks)
- ✅ "Build message input UI" (1 day)
- ✅ "Build message display" (1 day)
- ✅ "Connect to API" (1 day)
- ✅ "Make it beautiful" (1 day)

### Step 2: Make It Complete

**Before considering it done:**
- [ ] Works end-to-end
- [ ] Tested (no known bugs)
- [ ] Documented (code is clear)
- [ ] Beautiful (user would approve)
- [ ] Fits vision (passes VISION_GUARD check)

**Rule:** All five boxes must be checked.

### Step 3: Ship It

**Every day:**
- Commit the complete feature
- Demo the working feature
- Get feedback immediately
- Celebrate the win

---

## The Daily Rhythm

### Morning (Standup)

```
Lead: "What are you shipping today?"
Developer: "[One small, complete feature]"
Lead: "Ship it today?"
Developer: "Yes. See you at 5 PM demo."
```

### Evening (Demo)

```
Developer: "Here's what I shipped today."
[Shows working feature]
Lead: "Perfect. Commit and push."
Developer: "Done. What's tomorrow's task?"
```

---

## Real Examples

### Good (Ship Small. Ship Complete. Ship Often.)

**Monday:**
- Task: Email + password registration
- Status: Shipping
- Demo: User can register with email, password is hashed, session created
- Result: ✅ Shipped, complete, ready

**Tuesday:**
- Task: Streaming chat responses
- Status: Shipping
- Demo: Diana responds word-by-word, markdown renders
- Result: ✅ Shipped, complete, ready

**Wednesday:**
- Task: Conversation history in sidebar
- Status: Shipping
- Demo: Sidebar shows recent conversations, click loads them
- Result: ✅ Shipped, complete, ready

**Thursday:**
- Task: Database persistence
- Status: Shipping
- Demo: Close browser, reopen, all data restored
- Result: ✅ Shipped, complete, ready

**Friday:**
- Task: UI polish + demo
- Status: Shipped
- Demo: Complete first journey works flawlessly
- Result: ✅ Shipped, complete, ready

**Result after one week:** User can complete entire Alpha 0.1 journey. Feature-complete. Beautiful. Shipped.

### Bad (Violates the Principle)

**Monday-Friday:**
- Task: "Build complete chat system"
- Status: "Working on it"
- Demo: "Still building"
- Result: ❌ Nothing shipped, morale suffers, unclear if it works

**Result after one week:** Nothing demonstrable. Unclear progress. Team frustrated.

---

## The Questions for Each Task

Before starting:

1. **Is this small enough to ship in 1-3 days?** (NO? Break it smaller)
2. **Can I make it complete by end of day?** (NO? Reduce scope)
3. **What's the minimum viable piece?** (Focus on that)
4. **How will I demo this?** (Know before you start)

Before shipping:

5. **Does it work end-to-end?** (YES? Ship it)
6. **Is it tested?** (YES? Ship it)
7. **Is it documented?** (YES? Ship it)
8. **Is it beautiful?** (YES? Ship it)
9. **Does it fit the vision?** (YES? Ship it)

All YES? → Commit and push.

---

## What "Complete" Looks Like

### Code
✅ Compiles with zero errors  
✅ Tests pass (manual + automated)  
✅ Code is clean and readable  
✅ No shortcuts or hacks  
✅ Follows project standards  

### UX
✅ User can accomplish the goal  
✅ No confusing UI  
✅ Mobile responsive  
✅ Fast (no lag)  
✅ Beautiful (founder would approve)  

### Documentation
✅ Code is self-documenting  
✅ Complex logic explained  
✅ API documented  
✅ User flow documented  
✅ Decisions recorded  

### Testing
✅ Manual testing complete  
✅ Edge cases handled  
✅ Error handling in place  
✅ No known bugs  
✅ Automated tests if applicable  

### Vision Fit
✅ Passes VISION_GUARD check  
✅ Diana works naturally with it  
✅ Simplifies user experience  
✅ Moves AIGINVEST forward  
✅ Founder approves  

---

## The Discipline

### If a Task Isn't Complete by EOD

**Option 1:** The scope was too large. Tomorrow, break it smaller and ship the first piece.

**Option 2:** Something blocked it. Unblock it. Ship it tomorrow.

**Option 3 (rare):** The approach was wrong. Discuss with founder, pivot, ship a different piece.

**Never:** Ship incomplete work.

### If It Takes Longer Than 3 Days

**The task is too big.** Break it into smaller pieces and ship them one at a time.

**Example:**
- "Build complete Diana" (too big)
- Day 1: "Diana appears with animation" (small)
- Day 2: "Diana greets user personally" (small)
- Day 3: "Diana chat input ready" (small)

### If There Are Still Bugs at EOD

**The definition of "complete" wasn't met.** Don't ship. Keep working until it's truly complete.

---

## Why This Matters for AIGINVEST

### For Users
- Predictable, quality experiences
- Frequent improvements
- Trust through consistency
- Never broken features

### For Team
- Daily wins
- Clear progress
- Sustainable pace
- Proud of work

### For Company
- Fast feedback
- Market responsiveness
- Quality reputation
- Competitive advantage

---

## The Commitment

**Every developer commits to:**

✅ Shipping small pieces (not big features)  
✅ Making them complete (not partial)  
✅ Shipping often (daily when possible)  
✅ Never shipping incomplete work  
✅ Breaking large tasks into smaller ones  
✅ Demonstrating progress daily  

---

## The Measurement

**Every day, ask:**

1. **Did I ship something small?**
2. **Is it complete?**
3. **Can I demonstrate it?**

**All YES?** → Great day.  
**Any NO?** → Tomorrow, fix it.

---

## One More Thing

### "Ship Small" Doesn't Mean "Low Quality"

Small scope + complete execution = high quality.

It means:
- Focused features (easier to get right)
- Fully tested (no technical debt)
- Frequently validated (catch issues early)
- Always shippable (high bar maintained)

Not:
- Rushed work
- Quick hacks
- Partial features
- Broken code

---

## For New Team Members

**When you join AIGINVEST:**

1. Read VISION_GUARD.md (what we build)
2. Read this file (how we build)
3. Ask: "What's the small piece I can ship today?"
4. Ship it by EOD
5. Demo it
6. Repeat

**That's the culture.**

---

## Final Word

We're not shipping for the sake of shipping.

We're shipping because:
- Small scope ensures quality
- Complete execution builds trust
- Frequent feedback guides us
- Daily wins energize the team

**Ship small. Ship complete. Ship often.**

That's how we build AIGINVEST.

---

**Status:** 🚀 LOCKED  
**Every Commit:** References this principle  
**Every Standup:** Confirms we're following it  
**Every Demo:** Proves we shipped something small and complete  

This is not optional. This is how we work.
