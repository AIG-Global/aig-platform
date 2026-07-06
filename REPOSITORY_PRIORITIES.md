# Repository Priorities & Ownership

**Status:** 🚀 LOCKED  
**Last Updated:** July 6, 2026  
**For:** Clear ownership and priority focus  

---

## The Framework

Each repository has:
- **Owner:** Who's responsible
- **Purpose:** What it does
- **Priority:** 🔴 Critical / 🟡 High / 🟢 Later
- **Status:** Current readiness
- **Next Steps:** Immediate actions

---

## 🔴 CRITICAL PRIORITY

These three repositories **must** be perfect for Alpha 0.1 to ship.

---

### Repository: aig-platform

**Owner:** Track B (Engineering)

**Purpose:** Core platform and APIs  
- Backend (NestJS, ports 3333)
- Database (Prisma, PostgreSQL)
- Authentication
- API endpoints
- Memory/persistence layer
- Chat streaming

**Current Status:**
- ✅ Backend compiles, zero errors
- ✅ All 12 API endpoints mapped
- ✅ Database schema designed
- ✅ Authentication structure ready
- 🟡 PostgreSQL not running locally (expected)
- 🟡 Persistence not tested yet

**Priority:**
- **CRITICAL:** Database persistence must work 100%
- **CRITICAL:** All APIs tested and working
- **CRITICAL:** No data loss, ever

**This Week's Goal (Week 1):**
- PostgreSQL running locally
- All migrations applied
- Conversations persist
- Messages persist
- Zero errors

**Next Steps:**
1. Set up PostgreSQL (Docker recommended)
2. Run Prisma migrations
3. Test all CRUD operations
4. Verify no data loss
5. Document database setup

**Owner Accountability:**
- "By Friday EOD: Database persistence 100% working"

---

### Repository: aig-diana

**Owner:** Track A (Founder) + Track C (Design)

**Purpose:** Diana's personality, prompts, and UI  
- Diana's greeting messages
- Response patterns
- Intent detection logic
- Diana's Avatar/animation assets
- Welcome screen UI components
- Chat UI components

**Current Status:**
- ✅ Diana avatar implemented
- ✅ Greeting message in place
- ✅ Streaming working
- 🟡 Personality not fully locked
- 🟡 Intent detection minimal

**Priority:**
- **CRITICAL:** Diana feels premium and intelligent
- **CRITICAL:** Intent detection for "create project"
- **CRITICAL:** Diana's responses are contextual

**This Week's Goal (Week 1):**
- Diana greets users personally
- Diana responds naturally to chat
- Diana detects project creation requests
- Diana's UI is beautiful

**Next Steps:**
1. Founder defines Diana's core personality
2. Document key phrases for intent detection
3. Create response templates
4. Polish animation and transitions
5. Get founder approval

**Owner Accountability:**
- "By Friday EOD: Diana feels premium and intelligent"

---

### Repository: aig-product

**Owner:** Track A (Founder)

**Purpose:** Product roadmap, specs, releases  
- Product vision
- Release notes
- Feature specifications
- User stories
- Milestone definitions
- Success metrics

**Current Status:**
- ✅ Vision locked (AIGINVEST Constitution)
- ✅ Alpha 0.1 defined
- 🟡 Detailed specs not all written
- 🟡 Release process not documented

**Priority:**
- **CRITICAL:** Alpha 0.1 requirements locked
- **CRITICAL:** Acceptance criteria clear
- **CRITICAL:** Success metrics defined

**This Week's Goal (Week 1):**
- All 10 tasks documented
- Acceptance criteria clear
- Weekly goals documented
- Success metrics defined

**Next Steps:**
1. Create 10 GitHub issues
2. Define detailed acceptance criteria for each
3. Lock Alpha 0.1 definition
4. Document success metrics
5. Plan Alpha 0.2 backlog

**Owner Accountability:**
- "By Friday EOD: All 10 tasks have clear acceptance criteria"

---

## 🟡 HIGH PRIORITY

These repositories support the critical ones but can follow slightly behind.

---

### Repository: aig-design

**Owner:** Track C (Design)

**Purpose:** Design system and UI components  
- Component library (buttons, inputs, modals)
- Color palette, typography
- Spacing and layout systems
- Responsive grid
- Animation guidelines
- Accessibility standards

**Current Status:**
- ✅ Basic components exist
- 🟡 Not fully documented
- 🟡 Mobile not fully responsive
- 🟡 Animation guidelines not locked

**Priority:**
- **HIGH:** All screens mobile responsive
- **HIGH:** Design system consistent
- **HIGH:** Components well-documented

**Phase 1 (Week 1):**
- Mobile registration responsive
- Mobile Diana welcome responsive
- Mobile chat responsive

**Phase 2 (Weeks 2-4):**
- Complete component library
- Animation guidelines
- Accessibility improvements
- Responsive grid refinement

**Next Steps:**
1. Audit current components
2. Make all responsive
3. Document component library
4. Get founder design approval

**Owner Accountability:**
- "By Week 4: All screens beautiful and responsive"

---

### Repository: aig-docs

**Owner:** Track B (Engineering)

**Purpose:** Technical documentation  
- API documentation
- Database schema docs
- Architecture diagrams
- Setup instructions
- Deployment guides
- Contributing guidelines

**Current Status:**
- 🟡 Minimal documentation
- 🟡 No API docs
- 🟡 No deployment guide
- 🟡 No contributing guide

**Priority:**
- **HIGH:** API fully documented
- **HIGH:** Setup guide clear
- **HIGH:** Architecture explained

**Phase 1 (Week 1):**
- API documentation
- Database schema docs
- Quick start guide

**Phase 2 (Weeks 2-4):**
- Architecture diagrams
- Contributing guidelines
- Deployment guide
- Security guide

**Next Steps:**
1. Document all API endpoints
2. Document database schema
3. Create quick start guide
4. Add to-be-documented issues to aig-docs

**Owner Accountability:**
- "By Week 2: API and database fully documented"

---

## 🟢 LATER PRIORITY

These are important but come after Alpha 0.1 ships.

---

### Repository: aig-aios

**Owner:** TBD (Future team lead)

**Purpose:** Operating system integration  
- AIOS kernel
- Device integration layer
- Diana on AIOS
- Hardware drivers

**Current Status:**
- ⏳ Planned, not started
- ⏳ Architecture outlined
- ⏳ No code yet

**Priority:**
- **LATER:** Not needed for Alpha 0.1
- **LATER:** Needed for North Star ONE

**Timeline:**
- Start: After Alpha 0.1 ships (August 3+)
- Target: Ready for North Star ONE integration

**Next Steps:**
1. Define AIOS architecture
2. Plan integration points
3. Create prototype
4. Hardware partners engagement

**Owner Accountability:**
- "Owned by future platform lead"

---

### Repository: aig-marketplace

**Owner:** TBD (Future partnerships lead)

**Purpose:** SDK and ecosystem  
- API SDK
- Plugin framework
- Developer documentation
- Marketplace infrastructure

**Current Status:**
- ⏳ Planned, not started
- ⏳ No code

**Priority:**
- **LATER:** Not needed for Alpha 0.1
- **LATER:** Not needed for Beta

**Timeline:**
- Start: After Alpha 0.2
- Target: 6+ months away

**Next Steps:**
1. Define SDK architecture
2. Plan plugin framework
3. Design marketplace
4. Define partnerships strategy

**Owner Accountability:**
- "Owned by future partnerships lead"

---

## Priority Matrix

```
ALPHA 0.1 (By Aug 3)
├─ 🔴 aig-platform (Core)
├─ 🔴 aig-diana (Interface)
├─ 🔴 aig-product (Specs)
├─ 🟡 aig-design (Supporting)
└─ 🟡 aig-docs (Supporting)

ALPHA 0.2 (After Aug 3)
├─ 🟡 aig-design (Refinement)
├─ 🟡 aig-docs (Expansion)
└─ Features from backlog

FUTURE (6+ months)
├─ 🟢 aig-aios (AIOS integration)
└─ 🟢 aig-marketplace (Ecosystem)
```

---

## Ownership Clarity

### aig-platform
- **Owner:** Track B (Engineering Lead)
- **Reviewer:** Founder (product decisions)
- **Deadline:** ALL persistence must work by Week 2

### aig-diana
- **Owner:** Track A (Founder) + Track C (Design)
- **Reviewer:** Founder (UX decisions)
- **Deadline:** Diana feels premium by Week 1

### aig-product
- **Owner:** Track A (Founder)
- **Reviewer:** Founder (solo decision)
- **Deadline:** 10 tasks with clear specs by Week 1

### aig-design
- **Owner:** Track C (Design Lead)
- **Reviewer:** Founder (aesthetic decisions)
- **Deadline:** All screens responsive by Week 2

### aig-docs
- **Owner:** Track B (Engineering) + Track C
- **Reviewer:** Any new team member (clarity check)
- **Deadline:** API docs by Week 2

### aig-aios
- **Owner:** TBD (Future platform lead)
- **Timeline:** Starts after Alpha 0.1

### aig-marketplace
- **Owner:** TBD (Future partnerships lead)
- **Timeline:** Starts after Alpha 0.2

---

## Weekly Sync Schedule

### Monday (Sprint Planning)
- aig-platform: Discuss week's tasks
- aig-diana: Confirm personality/intent
- aig-product: Confirm specs
- aig-design: Confirm designs
- aig-docs: Plan docs for week

### Friday (Weekly Review)
- All repos: Report status
- All repos: Blockers identified
- All repos: Next week planned

---

## GitHub Labels (For Organization)

```
Critical / High / Later        (Priority)
aig-platform                   (Repo)
aig-diana
aig-product
aig-design
aig-docs
aig-aios
aig-marketplace

Week-1 / Week-2 / Week-3 / Week-4  (Timeline)
Alpha-0.1 / Alpha-0.2 / Future     (Phase)

Track-A / Track-B / Track-C        (Ownership)
```

---

## Resource Allocation

### Week 1 (Foundation)
- **Track B (Engineering):** 100% aig-platform
- **Track A + C:** 100% aig-diana + aig-design
- **Track A:** 50% aig-product + aig-platform review

### Weeks 2-3 (Expansion)
- **Track B:** 80% aig-platform + 20% aig-docs
- **Track C:** 70% aig-design + 30% aig-docs
- **Track A:** 40% aig-product + 60% review

### Week 4 (Polish)
- **Track B:** 60% aig-platform + 40% aig-docs
- **Track C:** 100% aig-design polish
- **Track A:** 20% aig-product + 80% review/testing

---

## If a Repository Gets Blocked

### Repo Blocked → Action

**aig-platform blocked**
- → Founder prioritizes unblocking immediately
- → It blocks everything else

**aig-diana blocked**
- → Founder decides immediately
- → Diana is critical to UX

**aig-product blocked**
- → Founder decides immediately
- → It guides everything

**aig-design blocked**
- → Founder approves immediately
- → It guides engineering

**aig-docs blocked**
- → Document as-is, update when possible
- → Lowest priority for blocking

---

## Success Definition (By August 3)

### aig-platform
✅ All persistence working  
✅ All APIs tested  
✅ Zero data loss  
✅ Database optimized  

### aig-diana
✅ Diana feels premium  
✅ Intent detection works  
✅ Responses contextual  
✅ Animation smooth  

### aig-product
✅ All specs clear  
✅ GitHub issues created  
✅ Success metrics defined  
✅ Backlog organized  

### aig-design
✅ All screens responsive  
✅ Beautiful UX  
✅ Components documented  
✅ Mobile works  

### aig-docs
✅ API documented  
✅ Setup guide clear  
✅ Architecture explained  
✅ Contributing guide ready  

---

**Status:** 🚀 LOCKED  
**For:** Clear ownership and focus  
**Update Frequency:** Weekly review, adjust as needed  

**Every team member knows their repo and their deadline.**
