# Competition & Growth Engine System
## Monthly Challenges, Fast Tracker Leaderboards, Analytics & Monitoring

**Location:** `/architecture/COMPETITION_AND_GROWTH_ENGINE.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  
**Date:** 2026-07-07  

---

## Executive Summary

AIOS includes a sophisticated **Competition & Growth Engine** that:

- Drives member engagement through monthly competitive challenges
- Visualizes all platform activity with real-time charts and graphs
- Highlights high-performers via public "Fast Tracker" leaderboards
- Enables memberships to be won through achievement, not just purchased
- Creates FOMO (fear of missing out) and community spirit
- Measures everything, making data visible to all stakeholders

---

## Part 1: Monthly Competition System

### 1.1 Competition Types

```
MEMBERSHIP TIER COMPETITIONS (Monthly):

Fast Track Tier Rise
├─ Challenge: Recruit 10 new direct affiliates (minimum 1 tier higher than you)
├─ Duration: Calendar month (1st-last day)
├─ Reward: FREE membership tier upgrade for next month
├─ Frequency: Monthly (only 1 upgrade possible per month per person)
├─ Qualification Rules:
│  ├─ All 10 must join within calendar month
│  ├─ All 10 must be at least 1 tier higher than recruiter
│  ├─ Must maintain membership during competition month
│  ├─ Cannot have upgraded tier in previous month
│  └─ Transfers don't count (must be new recruits)
├─ Impact:
│  ├─ If Free → Starter = 1-month Starter free (€399 value)
│  ├─ If Starter → Professional = 1-month Professional free (€699 value)
│  ├─ If Professional → Business = 1-month Business free (€1,099 value)
│  └─ And so on up the tier ladder
└─ Reset: Each month new competition starts fresh

NETWORK GROWTH COMPETITIONS:

Direct Recruit Challenge
├─ Challenge: Recruit X new affiliates (varies by tier)
├─ Rewards: Achievement badges, bonus AIG$ (20-100), leaderboard ranking
├─ Tiers:
│  ├─ Starter: 5 recruits = 50 AIG$ bonus
│  ├─ Professional: 10 recruits = 100 AIG$ bonus
│  ├─ Business: 20 recruits = 200 AIG$ bonus
│  └─ Platinum: 50 recruits = 500 AIG$ bonus

Downline Volume Challenge
├─ Challenge: Generate X team volume (all downline sales/activity)
├─ Rewards: Team bonus acceleration (5% → 7%), priority support
├─ Targets:
│  ├─ €10,000 volume = €50 AIG$ bonus
│  ├─ €50,000 volume = €250 AIG$ bonus
│  └─ €100,000 volume = €500 AIG$ bonus

Sales Challenge (Marketplace)
├─ Challenge: Achieve X in WDM marketplace sales
├─ Rewards: Vendor fee waiver (1-3 months), featured listing
├─ Targets:
│  ├─ €5,000 sales = 1-month fee waiver
│  ├─ €25,000 sales = 3-month fee waiver
│  └─ Badge: "Top Seller" on profile

ENGAGEMENT COMPETITIONS:

Course Completion Race
├─ Challenge: Complete X courses in AIG Academy
├─ Rewards: Certificate fast-track, bonus points, leaderboard ranking
├─ Targets:
│  ├─ 5 courses completed = 50 points
│  ├─ 10 courses completed = 150 points
│  └─ Professional Certificate achieved = 500 points + special badge

Investment Achievement
├─ Challenge: Invest €X total across portfolio
├─ Rewards: Portfolio badge, AIG$ bonus, marketplace discount
├─ Targets:
│  ├─ €10,000 invested = 100 AIG$ bonus
│  ├─ €50,000 invested = 500 AIG$ bonus
│  └─ €100,000 invested = Elite Investor badge + 1,000 AIG$

Health & Wellness Challenge
├─ Challenge: Achieve X wellness goals (if on AI Phone ONE)
├─ Rewards: Health badges, wellness points, team bonuses
├─ Targets:
│  ├─ 7-day streak (sleep, steps, recovery) = 25 AIG$
│  ├─ 30-day wellness streak = 100 AIG$
│  └─ Quarterly goal achievement = 500 AIG$
```

### 1.2 Fast Tracker Leaderboard

**Public Leaderboard (Updated Real-Time):**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FAST TRACKERS - JULY 2026                    │
│          Members on Tier Upgrade Path (Top Performers)          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🏆 CURRENT MONTH PROGRESS (Tier Rise Challenge)                │
│                                                                 │
│ Rank │ Username          │ Tier      │ Recruits │ Goal │ Prize │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  1   │ @AlexanderLead    │ Starter   │ 10/10    │ ✅   │ FREE  │
│      │ Location: Germany │ Upgrade   │ COMPLETE │      │ PROF  │
│      │ Revenue: €50k/mo  │ Earned!   │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  2   │ @SarahNetworks    │ Starter   │ 9/10     │ 90%  │ Pending
│      │ Location: UK      │ 1 away!   │ 1 more!  │      │       │
│      │ Revenue: €35k/mo  │           │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  3   │ @MarcusGrowing    │ Starter   │ 8/10     │ 80%  │ Pending
│      │ Location: France  │ 2 away!   │          │      │       │
│      │ Revenue: €28k/mo  │           │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  4   │ @LiuAmbitious     │ Prof      │ 7/10     │ 70%  │ Pending
│      │ Location: China   │ On track  │          │      │       │
│      │ Revenue: €42k/mo  │           │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  5   │ @EmiliaBuilding   │ Prof      │ 6/10     │ 60%  │ Pending
│      │ Location: Spain   │ Half way  │          │      │       │
│      │ Revenue: €31k/mo  │           │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│  ...  │ (More listed)     │           │          │      │       │
│──────┼───────────────────┼───────────┼──────────┼──────┼───────│
│ 100  │ @JavierStarting   │ Free      │ 2/10     │ 20%  │ Pending
│      │ Location: Mexico  │ Just start│          │      │       │
│      │ Revenue: €5k/mo   │           │          │      │       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

LEADERBOARD FEATURES:
├─ Real-time updates (refreshes every 5 minutes)
├─ Click to view member profile
├─ Filter by tier, region, revenue, activity
├─ Sort by progress %, recruits count, or revenue
├─ See their last 5 recruits (with join dates)
└─ Send message to competitor (built-in chat)
```

### 1.3 Competition Rules & Mechanics

**Verification & Fraud Prevention:**

```
NEW AFFILIATE VERIFICATION:
├─ Recruit joins via unique link (tracked to recruiter)
├─ Email verification required (prevents dummy accounts)
├─ Phone verification required (prevents mass creation)
├─ 48-hour holding period (can cancel if fraudulent)
├─ Tier verification: New affiliate tier confirmed ≥ recruiter +1
├─ Minimum activity required: 1 verified action within 7 days
│  ├─ Action options: Complete profile, fund wallet, join competition
│  └─ If no action: Recruit removed from count
└─ Monthly reset: Unverified recruits don't carry over

TIER LEVEL VERIFICATION:
├─ System automatically checks new affiliate tier at join time
├─ If recruit tier < (recruiter tier + 1): Challenge progress NOT incremented
├─ If recruit downgrades after joined: Removal from count
├─ If recruiter upgrades: Previous recruits still count (locked in)
└─ Exception rule: Organizations can recruit other organizations (special case)

MONTHLY RESET:
├─ On first day of each month at 00:00 UTC:
│  ├─ Challenge counter resets to 0/10
│  ├─ Previous month completed challenges archived
│  ├─ Free tier upgrade applied (if earned)
│  ├─ New competition begins
│  └─ Leaderboard refreshes with new rankings
├─ Member cannot compete twice in same month
├─ Can only win one tier upgrade per month max
└─ Prevents gaming the system

FRAUD DETECTION:
├─ Flag if same person recruits from multiple devices in 24 hours
├─ Flag if recruits join but show zero activity
├─ Flag if recruits from same location (mass recruitment pattern)
├─ Flag if recruits tier suddenly changes (possible collusion)
├─ Manual review for suspicious patterns
└─ Penalty: Disqualification from competition + temp ban if caught
```

---

## Part 2: Real-Time Analytics & Monitoring

### 2.1 Dashboard Metrics (All with Charts)

```
MEMBER DASHBOARD (Personal):

├─ Recruitment Progress
│  ├─ Chart: Pie chart (Progress to 10 recruits)
│  ├─ Shows: 7/10 (70% complete this month)
│  ├─ Trend: Line chart (monthly recruits last 3 months)
│  └─ Breakdown: Bar chart by recruit tier level
│
├─ Revenue Overview
│  ├─ Chart: Area chart (monthly revenue last 12 months)
│  ├─ Shows: €35,000 this month (+12% vs last month)
│  ├─ Breakdown: Pie chart (commission % vs sales % vs investment %)
│  └─ Trend: Forecasted revenue next month
│
├─ Wallet Activity
│  ├─ Chart: Stacked bar (deposits, withdrawals, conversions)
│  ├─ Shows: €10,000 cash + 5,000 AIG$ current balance
│  ├─ Trend: Line chart (balance history last 6 months)
│  └─ Transactions: Log with filter options
│
├─ Investment Portfolio
│  ├─ Chart: Donut chart (allocation across products)
│  ├─ Shows: €50,000 invested (€45k in products, €5k waiting)
│  ├─ Returns: Line chart (cumulative gains last 12 months)
│  └─ Timeline: When next investment matures
│
├─ App Usage
│  ├─ Chart: Horizontal bar (apps by usage time)
│  ├─ Shows: CRM (25%), Marketplace (20%), AI (30%), Other (25%)
│  ├─ Daily heatmap: Activity by hour of day
│  └─ Engagement: Days active last 30 days
│
└─ Competition Status
   ├─ Chart: Progress gauge (visual bar to goal)
   ├─ Shows: 7/10 for tier rise, days remaining, rank
   ├─ Notifications: "You need 3 more recruits to earn free upgrade!"
   └─ Suggestions: "Add these 5 people who match your profile"

ORGANIZATION DASHBOARD (Company Admin):

├─ Company Metrics
│  ├─ Chart: KPI cards (active employees, revenue, growth)
│  ├─ Shows: 150 employees, €500k/month revenue, +15% growth
│  ├─ Trend: Quarterly revenue chart (4 quarters)
│  └─ Forecast: Revenue next quarter prediction
│
├─ Employee Performance
│  ├─ Chart: Scatter plot (activity vs revenue per employee)
│  ├─ Shows: Top performers, low performers, average performers
│  ├─ Breakdown: Sales team, support team, operations, etc.
│  └─ Drill-down: Click employee to see individual metrics
│
├─ Marketplace Sales
│  ├─ Chart: Time-series (sales by day last 30 days)
│  ├─ Shows: €50,000 revenue, average €1,667/day
│  ├─ Breakdown: By product, by employee, by region
│  └─ Trends: Best sellers, trending products
│
├─ Network Structure
│  ├─ Chart: Treemap (organization hierarchy visualization)
│  ├─ Shows: All departments, all employees, structure
│  ├─ Nodes sized by: Activity, revenue, or employee count
│  └─ Click to drill-down into department
│
└─ AI Usage & Insights
   ├─ Chart: AI tool usage (which company AIs used most)
   ├─ Shows: Finance AI (40%), Sales AI (35%), General (25%)
   ├─ Time-savings: Estimated hours saved by AI (calculated)
   └─ Recommendations: AI suggests which AI to use more
```

### 2.2 Platform-Wide Analytics

```
CEO/ADMIN DASHBOARD (Executive):

├─ Platform Health
│  ├─ Chart: Multi-metric card (total users, active users, retention)
│  ├─ Shows: 50,000 members, 12,000 active today (24%), 85% retention
│  ├─ Trend: Growth rate (10% MoM)
│  └─ Segments: By tier, by region, by age group
│
├─ Revenue Overview
│  ├─ Chart: Stacked area (revenue by source)
│  ├─ Sources:
│  │  ├─ Membership fees: €200k/month (40%)
│  │  ├─ Marketplace sales (AIG cut): €150k/month (30%)
│  │  ├─ Investment platform fees: €80k/month (16%)
│  │  ├─ Premium apps/services: €50k/month (10%)
│  │  └─ Other: €20k/month (4%)
│  ├─ Trend: 12-month revenue trajectory
│  └─ Forecast: Next 3 months revenue prediction
│
├─ Member Engagement
│  ├─ Chart: Funnel chart (visitor → free → paid → active)
│  ├─ Shows: Conversion rates at each stage
│  ├─ Heatmap: Activity by day of week, hour of day
│  └─ Engagement score: Calculated across all activities
│
├─ Network Performance
│  ├─ Chart: Network growth curve (all-time member count)
│  ├─ Shows: 50k members, 25k direct recruits, geometric growth
│  ├─ Breakdown: By tier (Free 20%, Starter 35%, Professional 30%, Biz 10%, Plat 5%)
│  └─ Trends: Average network size per member
│
├─ Competition Leaderboards
│  ├─ Chart: Top 20 fast trackers (leaderboard)
│  ├─ Shows: Public ranking visible to all members
│  ├─ Animation: Real-time updates when progress changes
│  └─ Archive: Previous month's top performers
│
├─ Marketplace Health
│  ├─ Chart: Vendor performance (top 50 sellers)
│  ├─ Shows: Sales volume, rating, product count
│  ├─ Trends: Growth rate per vendor
│  └─ New vendors: Products added this month
│
├─ System Health
│  ├─ Chart: Uptime (99.99%), API latency (avg 50ms)
│  ├─ Shows: Current servers, database load, cache hit ratio
│  ├─ Alerts: Any issues flagged in real-time
│  └─ Recent incidents: History and resolution time
│
└─ Investments Overview
   ├─ Chart: Assets under management (AUM)
   ├─ Shows: €10M invested across all products
   ├─ Breakdown: By product type (crypto, tagmarkets, AIG Phone shares, managed funds)
   ├─ Returns: Weighted average return (8.5% annually)
   └─ Risk: Portfolio risk level distribution
```

---

## Part 3: Data Visualization Requirements

### 3.1 Chart Library Integration

```
RECOMMENDED CHARTING LIBRARIES:

Primary: Apache ECharts
├─ Rich 5000+ chart types
├─ Real-time updates
├─ Mobile responsive
├─ Fast performance
└─ Used for: Competition progress, revenue trends, heatmaps

Secondary: D3.js (Complex)
├─ Network diagrams (org structure, downline tree)
├─ Custom treemaps
├─ Animated transitions
└─ Used for: Organization hierarchy, network visualization

Tertiary: Recharts (React-specific)
├─ Simple line, bar, pie charts
├─ Good defaults
├─ Works with React
└─ Used for: Personal dashboard cards

CHART TYPES BY USE CASE:

Progress/Goals:
├─ Gauge chart (7/10 recruits)
├─ Progress bar (80% complete)
├─ Radial bar (visual progress ring)

Time-Series:
├─ Line chart (revenue over time)
├─ Area chart (stacked revenues by source)
├─ Candlestick (investment prices)

Comparisons:
├─ Bar chart (members by tier)
├─ Horizontal bar (app usage comparison)
├─ Grouped bar (year-over-year)

Distributions:
├─ Pie chart (wallet composition)
├─ Donut chart (revenue breakdown)
├─ Treemap (organization structure)

Correlations:
├─ Scatter plot (activity vs revenue)
├─ Bubble chart (3-variable analysis)
├─ Heatmap (activity by time)

Rankings:
├─ Leaderboard table with sorting
├─ Top 20 visual ranking
├─ Trend arrows (up/down)
```

### 3.2 Real-Time Updates

```
UPDATE FREQUENCY:

Fast-Moving Metrics (Live):
├─ Fast Tracker leaderboard: Every 5 minutes
├─ Wallet balance: Instant (when transaction occurs)
├─ Order activity: Real-time (WebSocket)
└─ API usage: Every 30 seconds

Normal Metrics (Regular):
├─ Revenue figures: Every 1 hour
├─ Member count: Every 6 hours
├─ Trends: Daily overnight
└─ Forecasts: Weekly recalculation

Slow-Moving Metrics (Batch):
├─ Annual reports: Monthly
├─ Growth analysis: Quarterly
├─ Strategic metrics: Quarterly
└─ Archive: After month-end

IMPLEMENTATION:
├─ WebSocket for real-time (leaderboard, wallet, orders)
├─ Server-Sent Events (SSE) for one-way updates
├─ Polling for non-critical metrics (1-hour + interval)
└─ GraphQL subscriptions for specific metric updates
```

---

## Part 4: Database Models

```prisma
model Competition {
  id                String   @id @default(cuid())
  organizationId    String?  // null = platform-wide
  organization      Organization? @relation(fields: [organizationId], references: [id])
  
  name              String   // e.g., "Fast Track Tier Rise - July 2026"
  type              String   // "tier_rise", "recruit_challenge", "sales_challenge"
  description       String?
  
  startDate         DateTime
  endDate           DateTime
  
  goalType          String   // "recruits", "volume", "sales", "courses"
  goalTarget        Int      // 10 for recruits, €50000 for volume, etc
  
  reward            Json     // { type: "tier_upgrade", tier: "professional", ... }
  
  active            Boolean  @default(true)
  
  entries           CompetitionEntry[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model CompetitionEntry {
  id                String   @id @default(cuid())
  competitionId     String
  competition       Competition @relation(fields: [competitionId], references: [id], onDelete: Cascade)
  
  userId            String
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  currentProgress   Int      @default(0)
  targetGoal        Int      // copied from competition
  
  rank              Int?     // null until competition ends
  
  completed         Boolean  @default(false)
  completedAt       DateTime?
  
  rewardClaimed     Boolean  @default(false)
  rewardClaimedAt   DateTime?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([competitionId, userId])
}

model Leaderboard {
  id                String   @id @default(cuid())
  competitionId     String
  
  userId            String
  user              User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  rank              Int      // 1, 2, 3, etc
  progress          Int      // 7 for 7/10, etc
  progressPercent   Int      // 70 for 70%
  
  displayName       String?  // username
  location          String?  // country
  tier              String?  // member tier
  
  score             Int      // for tie-breaking
  
  completedAt       DateTime?
  
  createdAt         DateTime @default(now())
  
  @@index([competitionId, rank])
  @@index([rank])
}

model Analytics {
  id                String   @id @default(cuid())
  
  userId            String?
  user              User? @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  organizationId    String?
  organization      Organization? @relation(fields: [organizationId], references: [id], onDelete: SetNull)
  
  metric            String   // "revenue", "recruits", "app_usage", etc
  value             Float    // numeric value
  
  dimension         String?  // "monthly", "tier", "region", etc
  dimensionValue    String?  // "2026-07", "Professional", "Germany"
  
  timestamp         DateTime @default(now())
  
  @@index([userId, metric, timestamp])
  @@index([organizationId, metric])
  @@index([metric, timestamp])
}
```

---

**Status:** 🔒 LOCKED for Phase 1 Implementation

**Related:**
- [EVENT_DRIVEN_ARCHITECTURE.md](EVENT_DRIVEN_ARCHITECTURE.md) - Competition events
- [AIOS_MODULE_SYSTEM_ARCHITECTURE.md](AIOS_MODULE_SYSTEM_ARCHITECTURE.md) - Reports module
