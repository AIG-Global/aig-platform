# Daily Development Cycle: The 5 Questions

**Status:** 🚀 LOCKED  
**Frequency:** Every day  
**Who answers:** Entire team  
**When:** End of day standup  

---

## The Principle

Every day should end with these five questions.

If all five are "YES," the day was successful.

If any are "NO," understand why and fix it tomorrow.

---

## The Five Questions

### 1. Did the User Experience Improve?

**Question:** Can a user do something today that they couldn't do yesterday?

**What this means:**
- New feature shipped
- Existing feature polished
- UX is better
- User journey is clearer
- Something tangible changed

**Examples of YES:**
- "User can now register" (was impossible yesterday)
- "Chat streaming is smoother" (user experience better)
- "Diana's greeting is more personal" (UX improved)
- "Conversation history loads faster" (experience improved)
- "Mobile layout is responsive" (UX better)

**Examples of NO:**
- "We refactored the database" (no user sees this)
- "We added a TypeScript utility" (no user benefit)
- "We discussed architecture" (nothing shipped)
- "We optimized a query" (user doesn't notice)

**How to measure:**
- Can you demo it to a user?
- Would a user care?
- Is something visibly/functionally different?

---

### 2. Is the Code Cleaner Than Yesterday?

**Question:** Did we improve code quality, not reduce it?

**What this means:**
- No new technical debt
- Ideally, reduced technical debt
- Code is more maintainable
- Tests pass
- No warnings/errors

**Examples of YES:**
- "Refactored chat component for clarity"
- "Removed dead code"
- "Improved error handling"
- "Added tests for critical path"
- "Documented complex logic"

**Examples of NO:**
- "Added 3 console.logs and didn't remove them"
- "Left TODO comments without tracking"
- "Copied code instead of reusing"
- "Tests are failing"
- "Added console.errors everywhere"

**How to measure:**
- Would you be proud showing this to a senior developer?
- Can the next person understand it easily?
- Are there any hacks or shortcuts?
- Do tests pass?

---

### 3. Did We Reduce Complexity?

**Question:** Is the system simpler to understand/use than yesterday?

**What this means:**
- Fewer lines (same functionality)
- Clearer logic
- Simpler user flow
- Fewer dependencies
- Better architecture

**Examples of YES:**
- "Consolidated 3 API endpoints into 1"
- "Simplified Diana's response logic"
- "Removed an unnecessary database query"
- "Combined two components into one"
- "Removed a third-party library we didn't need"

**Examples of NO:**
- "Added a new library for something we could do natively"
- "Made the code more complex to support 'future features'"
- "Added more configuration options"
- "Increased the number of API calls"

**How to measure:**
- Is it easier to understand than before?
- Did we remove something?
- Can we explain it in fewer sentences?
- Is the code shorter (same function)?

---

### 4. Is the Documentation Still Accurate?

**Question:** Can someone new understand the system from the docs?

**What this means:**
- README is updated
- Code comments are accurate
- API docs match reality
- User flows are documented
- Decisions are recorded

**Examples of YES:**
- "Updated README with new registration flow"
- "Added API documentation for new endpoints"
- "Explained complex logic with comments"
- "Documented Diana's intent detection"
- "Recorded architectural decision"

**Examples of NO:**
- "Changed code but didn't update comments"
- "Added new endpoint but no API docs"
- "Refactored logic but left old explanation"
- "Documentation says X but code does Y"

**How to measure:**
- Could a new team member get up to speed?
- Are code comments clear and accurate?
- Do API docs match?
- Is the vision documented?

---

### 5. Can We Demonstrate Today's Work?

**Question:** Can you show someone (founder, user, investor) what you built?

**What this means:**
- Feature is complete
- Feature is working
- Demo is clear and impressive
- No hacks or WIP code
- Ready for scrutiny

**Examples of YES:**
- "Watch how registration works" (demo it)
- "See Diana greet a new user" (demo it)
- "Here's the chat streaming" (demo it)
- "User can create a project" (demo it)

**Examples of NO:**
- "We're 80% done"
- "It works on my machine"
- "There's a bug we're investigating"
- "It's not quite finished"
- "The UI needs polish"

**How to measure:**
- Can you click through it without crashing?
- Can you explain what the user sees?
- Would you be proud showing this?
- Are there any visible bugs?

---

## The Daily Standup (5-Question Version)

### Morning Standup (Before Work)
```
Lead: "Good morning. What are you shipping today?"

Developer: "[Description of small, complete feature]"

Lead: "By 5 PM, can you answer YES to all five questions?"

Developer: "Yes, here's the plan: [steps to ensure all 5 are YES]"

Lead: "Perfect. Let's ship it."
```

### Evening Standup (Before Leaving)
```
Developer: "Here's what I shipped today."

[Demo the feature]

Lead: "Let's check the five questions:

1. Did user experience improve? [YES/NO]
2. Is code cleaner? [YES/NO]
3. Did we reduce complexity? [YES/NO]
4. Is documentation accurate? [YES/NO]
5. Can we demonstrate it? [YES/NO]"

Developer: "All YES because [explain each]"

Lead: "Great work. Push and commit."
```

---

## When One Answer is NO

### Question 1: User Experience DIDN'T Improve
**Action:** Was it worth shipping anyway?
- If YES (refactor, optimization, foundation): Document why
- If NO: Hold it back, combine with another feature
**Example:** "I optimized the database. It's invisible but critical for future scaling."

### Question 2: Code DIDN'T Get Cleaner
**Action:** Refactor it now before committing
**Example:** "I have console.logs everywhere. Let me clean those up."

### Question 3: Complexity DIDN'T Reduce
**Action:** Did we add necessary complexity?
- If YES (new feature requires it): Accept it
- If NO: Simplify before shipping
**Example:** "Chat now has 3 new APIs. That's required for streaming."

### Question 4: Documentation ISN'T Accurate
**Action:** Update it now
**Example:** "I changed the API response format. Let me update the docs."

### Question 5: Can't Demonstrate It
**Action:** It's not ready to ship
**Example:** "The feature crashes on edge cases. I'll finish it tomorrow."

---

## Weekly Review (5-Question Aggregate)

### Friday (5:00 PM)

```
Lead: "Looking at the whole week, let's answer the five questions:

1. Did USER EXPERIENCE improve? (Did all features ship well?)
2. Is CODE CLEANER? (Any tech debt introduced?)
3. Did we REDUCE COMPLEXITY? (Or add necessary complexity?)
4. Is DOCUMENTATION ACCURATE? (Can new hire understand?)
5. Can we DEMONSTRATE IT? (Will we show to founder?)

Overall: YES or NO?"

Team: "Overall: YES because..."

Lead: "Great week. Ready for next week?"

Team: "YES. Here's what we'll tackle Monday."
```

---

## Using This for Code Review

### Reviewer Checklist

Before approving a PR, check:

```
1. User experience - Will users care about this? [YES/NO]
2. Code quality - Is this cleaner than before? [YES/NO]
3. Complexity - Did we reduce/accept necessary complexity? [YES/NO]
4. Documentation - Are docs accurate? [YES/NO]
5. Demo-able - Can someone see this working? [YES/NO]

All YES? → APPROVE
Any NO? → Request changes
```

---

## Using This for Sprint Planning

### Monday Planning

```
For each task this week:

1. Will it improve user experience? [Should be YES]
2. Will code be cleaner? [Should be YES]
3. Will it reduce complexity? [Should be YES or neutral]
4. Will we update docs? [Should be YES]
5. Can we demonstrate it? [Should be YES]

All YES? → Task is well-scoped.
Any NO? → Redefine the task.
```

---

## The Discipline

### Every Single Day

These five questions must be asked and answered honestly.

No exceptions.

Not "we'll do it tomorrow."  
Not "it's close enough."  
Not "the deadline matters more."

**Every day, these five questions.**

### Every Single Week

Aggregate the daily answers into a weekly assessment.

Are we improving or declining?

Is quality being maintained?

Is the product better?

---

## Signs You're Doing It Right

✅ User experience improves daily  
✅ Code quality is increasing  
✅ Complexity is manageable  
✅ Documentation is accurate  
✅ Every day has a demo  
✅ Morale is high (wins every day)  
✅ Quality is excellent  
✅ Team is proud of the work  

---

## Signs You're Doing It Wrong

❌ Days with no user-visible improvement  
❌ Code quality declining  
❌ Complexity increasing  
❌ Documentation outdated  
❌ Nothing to demo  
❌ Morale is low  
❌ Shipping incomplete work  
❌ Team is frustrated  

**If you see these signs, pause and realign.**

---

## One More Thing

### These Questions Are Honest

There's no gaming them.

You can't say "YES" to question 5 if the feature crashes.

You can't say "YES" to question 4 if docs are wrong.

You can't say "YES" to question 1 if it's invisible infrastructure.

**Honest answers. Every day.**

---

## The Promise

If every day ends with five "YES" answers:

- User experience improves daily
- Code quality is high
- Complexity is managed
- Documentation is current
- Progress is visible
- Team is motivated
- Product is excellent

**That's how we build AIGINVEST.**

---

**Status:** 🚀 LOCKED  
**Frequency:** End of every day  
**Owner:** Everyone  
**Purpose:** Ensure quality and progress  

**Five questions. Every day. No exceptions.**
