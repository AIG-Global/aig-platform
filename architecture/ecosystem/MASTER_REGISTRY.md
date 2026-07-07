# Master Ecosystem Registry
## Complete Inventory of AIG Applications & Infrastructure

**Location:** `/architecture/ecosystem/MASTER_REGISTRY.md`  
**Status:** 🔒 Locked  
**Last Updated:** 2026-07-07

---

## Executive Summary

The AIG ecosystem consists of:
- **11 Production-Ready Applications** (completed, tested, ready to integrate)
- **1 Core Infrastructure Platform** (ONE Server - manages users, payments, analytics)
- **5 Core Platform Services** (Identity, Events, Storage, Payments, Diana)
- **20+ Additional Applications** in roadmap (Phases 1-4)

Total estimated **100+ applications** across all platforms by 2027.

---

## 🟢 PRODUCTION APPLICATIONS (Ready Now)

### Tier 0 — Core Platform (Week 1-2)

#### 1. ONE Server Bundle
**Purpose:** Central infrastructure, user management, payments, analytics  
**Status:** 🟢 Production Ready  
**Owner:** Infrastructure Team  

**Architecture:**
```
ONE-Server (Node.js, zero external dependencies)
├─ Admin Dashboard       (/admin/ - monitoring, user management)
├─ User PWA             (/ - end-user ONE app, installable)
├─ Public API           (/api/v1/* - external integrations)
└─ Services
    ├─ Users             (profiles, tier management, upgrades)
    ├─ Payments          (Stripe, NOWPayments integration)
    ├─ Analytics         (usage tracking, segmentation, daily reports)
    ├─ Events            (event ingestion, audit trail)
    └─ Auth              (API keys, admin auth, permissions)
```

**APIs Provided:**
- `GET /api/v1/health` - Service health check
- `GET /api/v1/analytics/overview` - Dashboard metrics
- `GET /api/v1/analytics/daily-usage` - Usage by day
- `GET /api/v1/analytics/top-topics` - Feature usage ranking
- `GET /api/v1/analytics/segmentation` - User cohorts
- `GET /api/v1/users/:id` - User lookup
- `POST /api/v1/events` - Event ingestion

**Events Published:**
- `user.created` - New user signup
- `user.upgraded` - Free → Paid conversion
- `user.tier_changed` - Tier upgrade/downgrade
- `payment.received` - Payment completed
- `network_bonus.generated` - Commission earned

**Database Schema:**
```
Tables:
├─ users (id, email, name, tier, sponsorId, createdAt, upgradedAt)
├─ usage_events (id, userId, type, topic, domain, meta, timestamp)
├─ network_bonus_events (id, userId, sponsorUserId, reason, bonusGenerated)
├─ admin_actions (id, adminId, actionType, targetUserId, reason, timestamp)
├─ api_keys (id, key, scope, createdAt, lastUsed)
└─ analytics_cache (id, metric, value, period, updatedAt)
```

**Membership Packages:**
```
┌──────────────────────────────────────────────────┐
│ Tier        │ Price    │ Expires  │ Capabilities │
├──────────────────────────────────────────────────┤
│ Free        │ €0       │ Never    │ Basic access │
│ Starter     │ €399     │ 1 year   │ All apps     │
│ Professional│ €699     │ 1 year   │ Premium +    │
│ Business    │ €1,099   │ 1 year   │ Resale +     │
│ Platinum    │ €2,999   │ 1 year   │ MLM +        │
└──────────────────────────────────────────────────┘
```

**Revenue Distribution:**
```
€1 paid membership:
├─ 80% distributed through network (sponsorship + team bonuses)
├─ 15% operational/dev fund
└─ 5% reserved

Per-app purchases:
├─ 80% distributed through network
└─ 20% operational fund
```

**Deployment:** Self-contained Node.js process, Linux systemd service, Docker ready  
**Performance Targets:** <100ms API response, <50MB memory, handles 1000+ concurrent users  
**Dependencies:** Node.js 18+, Linux/macOS, optional Stripe account  
**Roadmap:** Event streaming (Kafka), multi-region (k8s), webhook system  

---

### Tier 1 — Communication & Identity (Week 2-3)

#### 2. AIG Ask
**Purpose:** AI-powered chat and question answering  
**Status:** 🟢 Production Ready  
**Owner:** AI Team  
**Tech Stack:** JavaScript/HTML5, API-driven  

**Features:**
- Chat interface with AI backend
- Widget embeddable in other apps
- Demo page for testing
- Real-time conversation tracking

**APIs Exposed:**
- Chat completion endpoint
- Message history retrieval
- Session management

**Diana Integration:**
- Diana personality for chat responses
- Conversation context persistence
- User preference awareness

**Marketplace Category:** Productivity / AI  
**Monetization:** Free for Starter+, Premium features at Business tier  
**AIOS Compatibility:** Web, Mobile (React Native wrapper), Desktop (Electron)  

---

#### 3. AIG Translate
**Purpose:** Real-time language translation  
**Status:** 🟢 Production Ready  
**Owner:** AI Team  
**Tech Stack:** JavaScript/HTML5, AI backend  

**Features:**
- Multi-language translation
- Widget embeddable anywhere
- Demo page for testing
- Context preservation

**APIs Exposed:**
- Translation endpoint
- Supported languages list
- Quality metrics

**Diana Integration:**
- Diana explains translation nuances
- Cultural context notes
- Real-time suggestions

**Marketplace Category:** Productivity / Localization  
**Monetization:** Free Starter+, Per-translation cost at Business  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

#### 4. AIG Me
**Purpose:** Personal profile & digital identity management  
**Status:** 🟢 Production Ready  
**Owner:** Identity Team  
**Tech Stack:** JavaScript/HTML5, authentication layer  

**Features:**
- User profile management
- Identity verification
- Preference settings
- Data privacy controls

**APIs Exposed:**
- Profile CRUD
- Verification status
- Preference APIs
- Privacy settings

**Diana Integration:**
- Diana knows user preferences
- Personalized recommendations
- Privacy-aware messaging

**Marketplace Category:** Identity / Profile  
**Monetization:** Included with all tiers  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

#### 5. AIG Secure Sign
**Purpose:** Digital signature and certificate management  
**Status:** 🟢 Production Ready  
**Owner:** Security Team  
**Tech Stack:** JavaScript/HTML5, crypto utils, KYC flow  

**Features:**
- Digital signature creation
- Document certification
- KYC (Know Your Customer) integration
- Certificate management

**APIs Exposed:**
- Signature creation
- Certificate validation
- Document signing
- KYC status check

**Diana Integration:**
- Diana guides through KYC
- Explains signature requirements
- Document compliance checking

**Marketplace Category:** Security / Compliance  
**Monetization:** Free Starter+, Per-signature cost at Professional  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

### Tier 2 — Business Intelligence (Week 3-4)

#### 6. AIG Record
**Purpose:** Audio transcription and recording  
**Status:** 🟢 Production Ready  
**Owner:** Content Team  
**Tech Stack:** JavaScript/HTML5, transcription API, PDF export  

**Features:**
- Audio recording
- Real-time transcription
- PDF export
- Search in transcripts

**APIs Exposed:**
- Recording submission
- Transcription status
- PDF generation
- Transcript search

**Diana Integration:**
- Diana summarizes recordings
- Action items extraction
- Meeting notes generation

**Marketplace Category:** Productivity / Documentation  
**Monetization:** Free for recordings, premium transcription  
**AIOS Compatibility:** Web, Mobile (native recorder), Desktop  

---

#### 7. AIG Business Weather
**Purpose:** Business intelligence and market data  
**Status:** 🟢 Production Ready  
**Owner:** Analytics Team  
**Tech Stack:** JavaScript/HTML5, data aggregation  

**Features:**
- Market trends
- Business metrics
- Predictive analytics
- Custom dashboards

**APIs Exposed:**
- Market data endpoint
- Metrics retrieval
- Dashboard configuration
- Alert subscription

**Diana Integration:**
- Diana interprets data
- Alerts on anomalies
- Trend explanations
- Action recommendations

**Marketplace Category:** Business Intelligence / Analytics  
**Monetization:** Professional+ tier, per-dashboard premium features  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

#### 8. AIG News
**Purpose:** Curated, personalized news aggregation  
**Status:** 🟢 Production Ready  
**Owner:** Content Team  
**Tech Stack:** JavaScript/HTML5, news feed aggregation  

**Features:**
- Real-time news feeds
- Personalization engine
- Category filtering
- Digest generation

**APIs Exposed:**
- News feed endpoint
- Personalization config
- Digest generation
- Category management

**Diana Integration:**
- Diana curates feed
- Explains news relevance
- Generates executive briefing
- Alert system

**Marketplace Category:** News & Information  
**Monetization:** Free Starter+, premium sources at Business  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

#### 9. AIG Investor Alerts
**Purpose:** Investment monitoring and alerts  
**Status:** 🟢 Production Ready  
**Owner:** Finance Team  
**Tech Stack:** JavaScript/HTML5, market data integration  

**Features:**
- Portfolio tracking
- Price alerts
- Market notifications
- Investment recommendations

**APIs Exposed:**
- Portfolio management
- Alert configuration
- Market data
- Recommendation engine

**Diana Integration:**
- Diana analyzes portfolio
- Risk assessment
- Diversification suggestions
- Market timing insights

**Marketplace Category:** Finance / Investments  
**Monetization:** Professional+, premium signals at Business/Platinum  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

#### 10. AIG HELO
**Purpose:** Help & support system  
**Status:** 🟢 Production Ready  
**Owner:** Support Team  
**Tech Stack:** JavaScript/HTML5, support ticketing  

**Features:**
- Ticket management
- Knowledge base
- Chat support
- Escalation routing

**APIs Exposed:**
- Ticket creation
- Status tracking
- KB search
- Agent assignment

**Diana Integration:**
- Diana as first responder
- Issue categorization
- Solution suggestions
- Escalation decision

**Marketplace Category:** Support / Help  
**Monetization:** Included with all tiers (premium: 24/7 support)  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

### Tier 3 — Engagement & Growth (Week 4-5)

#### 11. AIG MoneyGames
**Purpose:** Gamified learning and engagement platform  
**Status:** 🟢 Production Ready  
**Owner:** Growth Team  
**Tech Stack:** JavaScript/HTML5, gamification engine  

**Features:**
- Educational games
- Achievement system
- Leaderboards
- Reward system (AIG Cash)

**APIs Exposed:**
- Game state management
- Achievement tracking
- Leaderboard queries
- Reward fulfillment

**Diana Integration:**
- Diana explains game concepts
- Performance feedback
- Personalized challenges
- Achievement celebrations

**Marketplace Category:** Entertainment / Learning  
**Monetization:** Free to play, premium game packs, cosmetics  
**AIOS Compatibility:** Web, Mobile, Desktop  

---

## 🔵 IN DEVELOPMENT (Active Engineering)

### Additional Infrastructure
- **Diana Core** - AI personality system (week 3-5)
- **Mission Engine** - Goal tracking and completion (week 2-3)
- **Workspace Orchestrator** - Team collaboration (week 3-4)
- **Trust Engine** - Action audit and explainability (week 4-5)
- **Event Hub** - Central event bus (Kafka/Redis) (week 5-6)

---

## 🟡 PLANNED (Architecture Complete, Engineering Queued)

### Phase 1 (Weeks 6-8)
- **Marketplace Registry** - App store system
- **Payment Gateway** - Multiple provider support
- **Analytics Dashboard** - Real-time metrics
- **Admin Console** - System management

### Phase 2 (Weeks 9-12)
- **Project Management** - Tasks, timelines, collaboration
- **CRM System** - Customer relationship management
- **Calendar** - Schedule management
- **Forms Builder** - Custom form creation

### Phase 3 (Weeks 13-18)
- **Video Conference** - Real-time collaboration
- **Document Editor** - Collaborative editing
- **Data Warehouse** - Business intelligence
- **API Gateway** - Rate limiting, versioning

### Phase 4 (Weeks 19-24)
- **Mobile App Suite** - iOS/Android optimizations
- **Desktop App** - Electron-based workstation
- **Hardware Integration** - North Star ONE support
- **Voice Interface** - Full voice control

---

## 📡 PLATFORM SERVICES (Cross-Cutting Concerns)

### Identity Service
- User authentication and authorization
- Permissions management
- Session handling
- MFA support

### Event Bus
- Event publishing and subscription
- Event sourcing
- Replay capability
- Dead letter handling

### Storage Service
- File storage
- Versioning
- Backup
- Disaster recovery

### Payment Service
- Multiple payment providers
- Subscription management
- Invoice generation
- Tax compliance

### Diana Service
- Personality engine
- Memory system
- Reasoning trace
- Interaction management

---

## 💼 BUSINESS MODEL SPECIFICATION

### Revenue Streams

#### 1. Membership Subscriptions
```json
{
  "streams": [
    {
      "name": "Starter",
      "price": 399,
      "currency": "EUR",
      "billingCycle": "annual",
      "includes": [
        "All tier-1 apps",
        "1 GB storage",
        "Basic Diana access",
        "Community support"
      ],
      "networkBonusEligible": true,
      "mlmCapabilities": "personal_only"
    },
    {
      "name": "Professional",
      "price": 699,
      "currency": "EUR",
      "billingCycle": "annual",
      "includes": [
        "All tier-2 apps",
        "10 GB storage",
        "Premium Diana",
        "Email support",
        "Custom integrations"
      ],
      "networkBonusEligible": true,
      "mlmCapabilities": "5_person_team"
    },
    {
      "name": "Business",
      "price": 1099,
      "currency": "EUR",
      "billingCycle": "annual",
      "includes": [
        "All tier-3 apps",
        "100 GB storage",
        "Enterprise Diana",
        "Priority support",
        "API access",
        "Team collaboration"
      ],
      "networkBonusEligible": true,
      "mlmCapabilities": "25_person_team"
    },
    {
      "name": "Platinum",
      "price": 2999,
      "currency": "EUR",
      "billingCycle": "annual",
      "includes": [
        "All features",
        "Unlimited storage",
        "White-label Diana",
        "24/7 support",
        "Dedicated account manager",
        "Revenue sharing program"
      ],
      "networkBonusEligible": true,
      "mlmCapabilities": "unlimited_team"
    }
  ]
}
```

#### 2. Network/MLM Commissions
```json
{
  "structure": "Unilevel",
  "levels": 6,
  "commissionPerLevel": [30, 20, 15, 10, 3, 2],
  "baseTrigger": "€399 minimum tier purchase",
  "bonus": {
    "teamVolume": "5% of sponsored team monthly purchases",
    "leadershipBonus": "Rank-based monthly bonus pool",
    "performanceBonus": "Volume tiers unlock additional %" 
  },
  "rankQualifications": {
    "ambassador": { "monthlyVolume": 2000, "directSponsors": 2 },
    "director": { "monthlyVolume": 5000, "directSponsors": 5 },
    "executive": { "monthlyVolume": 10000, "directSponsors": 10 },
    "platinum": { "monthlyVolume": 25000, "directSponsors": 25 }
  }
}
```

#### 3. Marketplace Revenue (Apps, Skills, Packs)
```json
{
  "appStore": {
    "commission": 0.30,
    "developerShare": 0.70,
    "monthlyRevenue": 5000,
    "topApps": 50
  },
  "skillMarketplace": {
    "commission": 0.50,
    "creatorShare": 0.50,
    "monthlyRevenue": 2000,
    "activeSkills": 100
  },
  "packStore": {
    "commission": 0.75,
    "creatorShare": 0.25,
    "monthlyRevenue": 1000,
    "packCount": 50
  }
}
```

#### 4. AIG Cash Economy
```json
{
  "currency": "AIG Cash",
  "exchangeRates": {
    "EUR_to_AIG": 1.0,
    "USD_to_AIG": 1.1,
    "GBP_to_AIG": 0.85
  },
  "sources": {
    "directTopUp": "1:1 EUR/AIG",
    "commissions": "Monthly from MLM",
    "achievements": "From MoneyGames",
    "bonuses": "From network activity"
  },
  "uses": {
    "appPurchases": "Buy from marketplace",
    "upgrades": "Premium features",
    "investments": "Investment platform",
    "trading": "Inter-user trading",
    "cashout": "Withdraw to bank (Platinum only)"
  }
}
```

### Compensation Model

#### Commission Structure
```
User A purchases €399 Starter package

Network Distribution (80%):
├─ Direct Sponsor (A's upline, level 1): 30% × €399 = €119.70
├─ Level 2 upline: 20% × €399 = €79.80
├─ Level 3 upline: 15% × €399 = €59.85
├─ Level 4 upline: 10% × €399 = €39.90
├─ Level 5 upline: 3% × €399 = €11.97
├─ Level 6 upline: 2% × €399 = €7.98
└─ Network reserve pool: 2% × €399 = €7.98 (for bonuses)

Operational Fund (20%):
└─ Development/Support: €79.80
```

#### Rank Advancement
```
Ambassador (5% team bonus):
├─ Monthly volume: €2,000+
└─ Direct recruits: 2+

Director (10% team bonus):
├─ Monthly volume: €5,000+
└─ Direct recruits: 5+

Executive (15% team bonus):
├─ Monthly volume: €10,000+
└─ Direct recruits: 10+

Platinum (20% team bonus):
├─ Monthly volume: €25,000+
└─ Direct recruits: 25+
```

#### Payout System
```
Monthly Commission Calculation:
├─ Direct level commissions: 30% to 2%
├─ Team bonuses: 5-20% based on rank
├─ Performance bonuses: Variable
├─ Achievement bonuses: From MoneyGames
└─ AIG Cash dividends: From company growth

Payout Rules:
├─ Minimum threshold: €50
├─ Processing time: 5-7 business days
├─ Methods: Bank transfer, PayPal, Crypto
├─ Frequency: Monthly (28-30 days)
└─ Tax reporting: 1099/VAT compliant per region
```

### Compliance & Safeguards

#### FTC Compliance
- ✅ Focus on product sales, not recruitment
- ✅ Income disclosure: Public commission charts
- ✅ Money-back guarantee: 30-day refund policy
- ✅ No income guarantees in marketing
- ✅ Transparent payout structure
- ✅ Audit trail for all transactions

#### Regional Compliance
```json
{
  "jurisdictions": {
    "US": {
      "type": "MLM regulated",
      "reporting": "FTC compliance + 1099",
      "restrictions": "Income claims prohibited"
    },
    "EU": {
      "type": "Network marketing allowed",
      "reporting": "VAT + local tax",
      "restrictions": "Consumer protection laws apply"
    },
    "UK": {
      "type": "Direct selling regulated",
      "reporting": "HMRC reporting required",
      "restrictions": "Consumer Contracts Regulations"
    },
    "Canada": {
      "type": "Multi-level marketing allowed",
      "reporting": "Provincial + federal tax",
      "restrictions": "Competition Act compliance"
    }
  }
}
```

#### Fraud Prevention
- ✅ Tier verification before commission
- ✅ Cooldown period on new accounts
- ✅ Geographic IP validation
- ✅ Duplicate account detection
- ✅ Commission audit trail immutable
- ✅ Chargeback handling

---

## 📊 ECOSYSTEM METRICS

### Current Status (July 2026)
```
Applications Ready:      11
In Development:         5
Planned (P1-P4):        20+
Total Users:            ~500 (pilot)
Active Tiers:           All 4 (Free, Starter, Pro, Biz, Platinum)
Monthly Recurring Rev:  €2,000 (pilot)
Commission Payouts:     €1,600
Network Bonus Events:   150
Average Session:        15 minutes
Feature Adoption:       60%
```

### Phase 1 Targets (End of August)
```
Applications Ready:      25+
Total Users:            5,000
Monthly Recurring Rev:  €500,000
Commission Payouts:     €300,000
App Installs:           10,000+
Daily Active Users:     2,000+
Feature Adoption:       85%
Net Promoter Score:     >50
```

### Year 1 Projection
```
Applications Ready:      50+
Total Users:            100,000+
Monthly Recurring Rev:  €5,000,000+
Commission Payouts:     €3,000,000+
App Ecosystem GMV:      €1,000,000+
Marketplace Earnings:   €500,000+
Global Coverage:        15+ countries
```

---

## 🔗 ECOSYSTEM DEPENDENCIES

### Service Dependencies
```
AIG Ask
├─ diana/core (AI responses)
├─ identity/auth (user verification)
├─ events/bus (chat events)
├─ storage/embeddings (context)
└─ payments/billing (premium features)

AIG Me
├─ identity/auth (user authentication)
├─ storage/profiles (user data)
├─ diana/preferences (personalization)
├─ events/bus (profile changes)
└─ compliance/gdpr (data privacy)

AIG Translate
├─ diana/core (response enhancement)
├─ storage/cache (translation models)
├─ events/bus (translation events)
└─ analytics/tracking (usage metrics)

ONE Server
├─ database/postgres (persistence)
├─ cache/redis (session/analytics)
├─ payments/stripe (billing)
├─ auth/jwt (token verification)
└─ events/pubsub (event distribution)
```

### Data Flow
```
User Action → Event Published → Event Bus → 
  ├─ Analytics Processor
  ├─ Diana Context Updater
  ├─ Commission Calculator
  └─ Dashboard Refresher
```

---

## ✅ NEXT STEPS (Phase 1)

### Week 1: Integration
- [ ] Migrate apps to ONE Server infrastructure
- [ ] Implement event publishing from each app
- [ ] Connect Diana to all app events
- [ ] Setup analytics pipeline

### Week 2: Platform Services
- [ ] Deploy Identity service (JWT + RBAC)
- [ ] Deploy Event Hub (Redis Streams or Kafka)
- [ ] Deploy Storage service (S3 or object storage)
- [ ] Activate payment routing

### Week 3: Marketplace
- [ ] Build App Registry UI
- [ ] Deploy app publishing pipeline
- [ ] Implement developer dashboard
- [ ] Launch marketplace frontend

### Week 4: Diana Integration
- [ ] Connect Diana to mission engine
- [ ] Enable Diana voice commands
- [ ] Activate Diana learning mode
- [ ] Deploy Diana dashboard

### Week 5: Analytics & Reporting
- [ ] Real-time commission dashboard
- [ ] User analytics pipeline
- [ ] Executive reporting
- [ ] Fraud detection system

---

**Status:** 🔒 LOCKED — No changes to registered apps without Architecture Council approval  
**Last Review:** 2026-07-07  
**Next Review:** 2026-07-15 (Phase 1 Integration Check-in)
