# AIGINVEST Complete Ecosystem Reference
## Unified Architecture Overview with Financial Model & Roadmap

**Date:** 2026-07-07  
**Status:** 🔒 LOCKED FOR PHASE 1  
**Location:** Master reference for all ecosystem, platform, and financial architecture

---

## PART 1: Ecosystem Overview

### What is AIGINVEST?

AIGINVEST is a **platform company** delivering three integrated products:

1. **AIGINVEST Platform** (Web) — The primary interface
2. **AIOS** (Operating System) — The foundation for future devices
3. **North Star ONE** (Device) — The flagship phone powered by AIOS

All three are coordinated by **Diana**, an AI assistant integrated everywhere.

---

## PART 1.5: Core Entities & Terminology

### Key Definitions

Understanding the AIGINVEST ecosystem requires clarity on four core entities:

---

#### **AIGINVEST** – The Company & Ecosystem

**What it is:**
- The parent company and technology platform
- Complete membership ecosystem (web-based, initially)
- All-in-one financial and services platform
- Built on Next.js (frontend) + NestJS (backend)
- Global reach, multi-currency support (EUR primary)

**What it does:**
- Membership management (5 tiers: Free, Starter, Professional, Business, Platinum)
- Dual-account wallet (Cash EUR + AIG Cash)
- MLM commission engine (unilevel, 6-10 levels by tier)
- Marketplace (WDM - World Domination Market, 18 categories)
- Investment services (Tag Markets, Crypto, Funds, AIGPHONE equity, AIGIO tokens)
- AI assistant integration (Diana)
- User authentication & security

**Who owns it:**
- AIG Global team (founders + early investors)
- Members collectively own 30% of AIGPHONE Ltd (the device company)

**Where to access:**
- Web: www.aiginvest.io (or similar domain)
- Future: AIOS devices (2028+)

---

#### **North Star ONE** – The AI Smartphone

**What it is:**
- A premium AI smartphone (flagship device)
- Developed by AIGPHONE Ltd (startup, partially funded by AIGINVEST members)
- Target release: 2028
- Custom hardware: proprietary AI accelerator chip
- Custom OS: AIOS (see below)

**What makes it unique:**
- Runs AIOS (custom operating system)
- Diana AI runs on-device (not just cloud)
- Privacy-first architecture (local processing)
- Synchronization with AIGINVEST account via "Beam Me Up"
- Custom hardware acceleration for LLM inference
- Designed to be the "ultimate personal AI assistant"

**Who is building it:**
- AIGPHONE Ltd (the startup company)
- 30% owned by AIGINVEST members collectively
- 25% owned by founders/early team
- 35% owned by institutional VCs
- 10% allocated for employee options

**When is it launching:**
- 2026: R&D phase (complete)
- 2027: Prototype + developer edition (beta testing)
- 2028: Commercial launch (public availability)
- Target: 1M+ units/year by 2030

**How much will it cost:**
- Not yet announced (likely €800-1,200 range, speculation)
- AIGINVEST members get early access + discounts (25-50% off)
- Financing available through AIGINVEST platform

---

#### **AIOS** – The Operating System

**What it is:**
- Custom operating system for North Star ONE phone
- Built on open-source foundations (Sailfish OS base)
- Privacy-first, AI-native architecture
- Developed by AIGPHONE Ltd engineering team
- Future: May be licensed to other manufacturers

**Key features:**
- **Diana integration:** On-device LLM execution (not reliant on cloud)
- **Privacy:** Local data processing, optional cloud sync
- **AI acceleration:** Hardware accelerator chip support
- **Beam Me Up:** Sync protocol with AIGINVEST account
- **App ecosystem:** Native AIOS apps + access to AIGINVEST services
- **Voice control:** Natural language interface
- **Offline capable:** Works without internet connection

**Technical details:**
- Language: C/C++ (kernel + core services)
- SDK: Available for developer community
- Licensing: Proprietary (but may open-source components)
- Hardware: Optimized for custom AI accelerator chip
- Release: Developer edition 2027, Commercial 2028

**Future licensing:**
- AIGPHONE Ltd can license AIOS to other phone manufacturers
- Projected revenue: €50/unit × 10M units/year
- Would make AIOS a major revenue source post-2030

---

#### **Diana** – The AI Companion

**What it is:**
- AI assistant/personality available everywhere
- NOT a traditional chatbot (highly context-aware, multi-modal)
- Runs on: AIGINVEST web platform, AIOS devices, potentially other services
- Personality: Direct, helpful, action-oriented

**Where Diana appears:**
- **AIGINVEST web:** Chat interface (Diana helps with platform features, advice, task automation)
- **North Star ONE phone:** Default AI assistant (always available, on-device)
- **AIOS devices:** Core OS feature (handles system tasks, voice commands)
- **Future:** May be available on other platforms/devices

**What Diana can do:**
- Answer questions (knowledge base + real-time information)
- Help manage AIGINVEST account (create projects, documents, tasks)
- Provide investment advice (not personal financial advice, educational)
- Assist with marketplace (product recommendations, seller support)
- Control AIOS phone functions (voice commands, automation)
- Execute tools (create documents, set reminders, manage calendar)
- Learn from conversation history (context engine)
- Remember facts about the user (memory engine)

**How Diana works:**
```
Diana Architecture:
User Input
    ↓
Context Engine (last 20 messages + memories + system prompt)
    ↓
Memory Engine (extract facts, save to database)
    ↓
Tool Runner (intent detection, decide what action to take)
    ↓
Provider Router (select best LLM: OpenAI/Anthropic/Ollama/Local)
    ↓
LLM Generation (word-by-word streaming via SSE)
    ↓
Tool Executor (actually run the tools, update database)
    ↓
SSE Events (stream response to user in real-time)
    ↓
User sees Diana typing...
```

**Personality traits:**
- Direct (not overly polite, gets to the point)
- Helpful (genuinely tries to solve problems)
- Action-oriented (does things, not just talks)
- Curious (asks clarifying questions)
- Transparent (explains reasoning)
- Boundary-aware (knows what it can/can't do)

**Available in:**
- ✅ AIGINVEST web platform (v0.2 released)
- ✅ AIOS phone (on-device version, 2028)
- 🔵 Future: Other partner platforms

---

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    AIGINVEST ECOSYSTEM                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AIGINVEST Platform (Web)                                  │ │
│  │  ├─ Diana AI Assistant (cloud-based)                       │ │
│  │  ├─ Membership Management                                  │ │
│  │  ├─ Dual-Account Wallet                                    │ │
│  │  ├─ MLM Commission Engine                                  │ │
│  │  ├─ WDM Marketplace                                        │ │
│  │  └─ Investment Services                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↕ (Beam Me Up)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AIOS (Operating System)                                   │ │
│  │  ├─ Diana AI Assistant (on-device)                         │ │
│  │  ├─ Hardware Acceleration                                  │ │
│  │  ├─ Privacy-First Architecture                             │ │
│  │  ├─ Voice Control                                          │ │
│  │  └─ Sync with AIGINVEST Account                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          ↕                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  North Star ONE (Smartphone Device)                        │ │
│  │  ├─ Runs AIOS                                              │ │
│  │  ├─ Custom AI Accelerator Chip                             │ │
│  │  ├─ Diana runs locally (on-device LLM)                     │ │
│  │  ├─ Members get 25-50% discount + early access            │ │
│  │  └─ Sync with AIGINVEST account                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Ownership Structure:
├─ AIGINVEST company (AIG Global)
│  └─ Owns & operates: AIGINVEST platform + Diana (web)
├─ AIGPHONE Ltd (startup)
│  ├─ 30% owned by AIGINVEST members (collective)
│  ├─ 25% owned by founders/team
│  ├─ 35% owned by institutional VCs
│  ├─ 10% allocated for employee options
│  └─ Builds & launches: North Star ONE + AIOS

Revenue Model:
├─ AIGINVEST platform
│  ├─ Membership fees (€399-€2,999/month by tier)
│  ├─ WDM marketplace commissions (5% + 0.5% processing)
│  ├─ Investment service fees (0.5%-2% annually)
│  └─ Advertising/premium features
├─ AIGPHONE Ltd
│  ├─ Device sales (North Star ONE)
│  ├─ Licensing AIOS (€50/unit to other manufacturers)
│  ├─ AI services subscriptions (€15/month)
│  └─ Hardware components (OEM sales)
```

---

## PART 2: Core Components (Four Elements)

### 🤖 **Diana: The AI Assistant**

The central intelligence of AIGINVEST. Present on:
- ✓ Web (chatbot interface)
- ✓ AIOS (native app on device)
- ✓ North Star ONE (hardware integration)
- ✓ Every surface inside ecosystem

**Diana does:**
- Conversational reasoning
- Tool execution (create projects, documents, tasks)
- Persistent memory (remembers user preferences, context)
- Provider switching (OpenAI / Anthropic / Ollama)
- Intent detection (understands what user wants to do)

**Diana's personality:**
- Direct and precise
- Genuinely helpful
- Action-oriented
- Honest about limitations

---

### 🌐 **AIGINVEST Platform (Web)**

The primary web application (Next.js 14 + React 18)

**Core Modules:**
- Identity — User registration, authentication, SSO
- Ask Diana — AI interface, streaming responses, memory
- Projects — Project creation from conversation
- Documents — Generated documents with versioning
- Tasks — Task management and tracking
- Workspace — Team collaboration features
- Marketplace — Skills, templates, third-party integrations (future)
- Payments — Billing and subscription management (future)

**URL Structure:**
```
/login          — Email authentication
/chat           — Main Diana interface
/projects       — Project management
/documents      — Document library
/workspace      — Team collaboration
/marketplace    — Skills and integrations
```

---

### 🖥️ **AIOS: Operating System Layer**

A software layer that prepares AIGINVEST for hardware (future North Star ONE device)

**AIOS Capabilities:**
- Native device integration
- Offline AI capabilities
- Beam Me Up synchronization (sync web ↔ device)
- Hardware optimization
- Privacy-first design
- Sailfish OS foundation (future)

**Current Status:** Foundation laid, Ollama support (local LLM running offline)

**Future:** Custom AI accelerator chip for on-device inference

---

### 📱 **North Star ONE: Flagship Device**

The first AIGINVEST hardware product (future)

**Specifications:**
- Sailfish OS foundation
- Diana built-in and always available
- Privacy-first design
- AIOS operating system
- Custom AI accelerator (future)
- Synchronization with web via Beam Me Up

**Status:** Prototype phase, 2028 target launch

---

## PART 3: Platform Architecture

### System Layers

```
┌─────────────────────────────────────────────────────┐
│            CLIENT LAYER                             │
│  Browser (Next.js 14)     North Star ONE (Future)   │
│  ├── Diana UI             ├── AIOS Native App       │
│  ├── Projects             └── Beam Me Up Sync       │
│  └── Documents                                      │
└────────────────┬──────────────────────────────────┘
                 │ HTTPS / SSE
┌────────────────▼──────────────────────────────────┐
│            API LAYER (NestJS 10)                    │
│  Port 3333                                         │
│  ├── AuthController       — Login/Register         │
│  ├── ChatController       — /stream (SSE)          │
│  ├── ProjectController    — CRUD operations        │
│  ├── DocumentController   — Generation/Versioning  │
│  ├── TaskController       — Task management        │
│  └── HealthController     — Monitoring             │
│                                                    │
│  AI LAYER                                          │
│  ├── LLMService           — Provider router        │
│  │   (OpenAI/Anthropic/Ollama/Mock)               │
│  ├── ContextEngine        — Build prompts          │
│  ├── MemoryEngine         — Persistence            │
│  ├── ToolRunner           — Intent detection       │
│  └── StreamingLayer       — SSE events             │
└────────────────┬──────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────┐
│            DATA LAYER                              │
│                                                    │
│  PostgreSQL 16 (Port 5432)                         │
│  ├── users                — Identity               │
│  ├── conversations        — Chat threads           │
│  ├── messages             — Chat history           │
│  ├── projects             — User projects          │
│  ├── project_tasks        — Tasks per project      │
│  ├── documents            — Generated docs         │
│  ├── diana_memories       — Long-term memory       │
│  ├── accounts             — Dual-wallet model      │
│  ├── commissions          — MLM commissions        │
│  └── tiers                — Membership tiers       │
│                                                    │
│  Redis 7 (Port 6379)                               │
│  ├── Sessions             — User sessions          │
│  ├── Rate limiting        — API throttling         │
│  └── Real-time events     — WebSocket broker       │
└─────────────────────────────────────────────────────┘
```

---

## PART 4: Ask Diana Architecture (Core Intelligence)

### Data Flow

```
User Message
     ↓
┌─────────────────────────────────────┐
│     CONTEXT ENGINE                   │
│  • Last 20 messages                 │
│  • User memories                    │
│  • Diana system prompt              │
│  • User preferences                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     MEMORY ENGINE                    │
│  • Extract facts from message       │
│  • Save to DianaMemory (async)      │
│  • Categories:                      │
│    - user_preference                │
│    - technical_constraint           │
│    - project_context                │
│    - working_style                  │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     TOOL RUNNER                      │
│  • Intent detection                 │
│  • create_project → ProjectService  │
│  • create_document → DocumentService│
│  • create_task → TaskService        │
│  • search_memory → MemoryService    │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     PROVIDER ROUTER                  │
│  • Selects best AI model            │
│  • OpenAI (general chat)            │
│  • Anthropic (long reasoning)       │
│  • Ollama (local/private)           │
│  • Mock (dev/testing)               │
│  • Auto-fallback on error           │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     LLM (Generate Response)          │
│  • Streams word-by-word              │
│  • Tools can be called mid-stream    │
│  • Cancellable via AbortController   │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     TOOL EXECUTOR                    │
│  • Actually runs the tools           │
│  • ProjectService.create()           │
│  • DocumentService.create()          │
│  • Updates database                 │
└─────────────────┬───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│     SSE STREAMING LAYER              │
│  Events:                            │
│  • chunk {content: string}          │
│  • action {action, result}          │
│  • title {title: string}            │
│  • done {response: string}          │
└─────────────────┬───────────────────┘
                  ↓
         User sees Diana typing
```

### Diana's Tools (Current)

| Tool | Trigger | Action | Status |
|------|---------|--------|--------|
| `create_project` | "create a project called X" | ProjectService.create() | ✅ v0.2 |
| `create_document` | "write a document called X" | DocumentService.create() | ✅ v0.2 |
| `create_task` | "add a task to X project" | TaskService.create() | 🔵 v0.3 |
| `search_memory` | "do you remember..." | MemoryService.search() | 🔵 v0.3 |
| `schedule_event` | "schedule a meeting" | CalendarService.create() | ⏳ v0.4 |
| `search_knowledge` | "search for X" | SearchService.search() | ⏳ v0.4 |

---

## PART 5: Database Schema (Dual-Account Model)

### Core Tables

#### Users & Identity
```sql
users
├── id (UUID)
├── email (unique)
├── name
├── preferences (JSON)
├── created_at
└── tier_id (links to membership tier)

tiers
├── id (tier_starter, tier_professional, etc.)
├── name (Starter, Professional, Business, Platinum)
├── price (EUR)
├── commission_depth (6, 7, 9, 10)
├── benefits (JSON array)
└── updated_at
```

#### Dual-Account Wallet (NEW)
```sql
accounts
├── id (UUID)
├── user_id
├── account_type ENUM('cash_account', 'aig_cash_account')
├── currency VARCHAR (EUR or AIG$)
├── balance DECIMAL(18, 8)
├── exchange_rate DECIMAL(10, 6)
│   (1.0 for cash_account, market rate for aig_cash_account)
├── daily_withdrawal_limit
└── created_at

Key Rule: Every user has EXACTLY 2 rows in this table
- Row 1: cash_account (EUR, 1:1 fixed)
- Row 2: aig_cash_account (AIG$, market-driven)

account_conversions
├── id (UUID)
├── user_id
├── from_account_id
├── to_account_id
├── from_amount DECIMAL
├── to_amount DECIMAL
├── exchange_rate DECIMAL
├── conversion_type ENUM
│   ('cash_to_aigcash_manual', 'aigcash_to_cash_marketplace')
├── status ENUM('pending', 'completed', 'failed')
└── created_at
```

#### MLM Commissions (with 80/20 Split)
```sql
commissions
├── id (UUID)
├── source_user_id (who made the purchase)
├── recipient_user_id (who gets commission)
├── recipient_tier_id (level at which recipient gets paid)
├── commission_level (1-10)
├── percentage (30%, 20%, 15%, 10%, 3%, 2%, 1%, 0.5%)
├── gross_amount (total earned)
├── amount_cash_account (80% in EUR)
├── amount_aigcash_account (20% in AIG$)
├── source_type ENUM
│   ('purchase', 'bonus', 'achievement', 'team_volume', 'leadership')
├── recipient_account_id_cash
├── recipient_account_id_aigcash
├── status ENUM('pending', 'approved', 'paid')
└── created_at

Key Rule: Every commission AUTOMATICALLY splits 80/20
- 80% goes to Cash Account (real money holding)
- 20% goes to AIG Cash Account (spending power)
```

#### Marketplace (AIG$ ↔ EUR Exchange)
```sql
marketplace_orders
├── id (UUID)
├── seller_user_id
├── buyer_user_id (NULL if open)
├── order_type ENUM('buy', 'sell')
├── selling_currency VARCHAR(AIG$)
├── buying_currency VARCHAR(EUR)
├── selling_quantity DECIMAL
├── price_per_unit DECIMAL
├── status ENUM('open', 'partially_filled', 'filled', 'cancelled')
├── filled_quantity DECIMAL
└── created_at

marketplace_transactions
├── id (UUID)
├── order_id
├── seller_user_id
├── buyer_user_id
├── seller_amount (AIG$)
├── buyer_amount (EUR)
├── exchange_rate DECIMAL
├── platform_fee DECIMAL (2% on seller)
└── completed_at

Key: Peer-to-peer AIG$ → EUR at market prices
```

#### Diana Memory
```sql
diana_memories
├── id (UUID)
├── user_id
├── key VARCHAR (indexed for retrieval)
├── value TEXT (the actual memory)
├── category VARCHAR ENUM
│   ('user_preference', 'technical_constraint',
│    'project_context', 'working_style')
├── source_conversation_id
└── created_at
```

---

## PART 6: Financial Model (LOCKED)

### Dual-Account System

Every member has exactly **TWO accounts** (immutable):

#### 1. Cash Account (EUR)
- **Currency:** EUR with 1:1 fixed exchange rate
- **Purpose:** Real money holding vault
- **Receives:** 80% of ALL commissions, bonuses, rewards
- **Cannot:** Be spent directly on ecosystem purchases
- **Can:** Be manually converted to AIG Cash (1:1)
- **Protections:** Full KYC, withdrawal limits
- **Governance:** Regulatory-compliant, segregated

#### 2. AIG Cash Account (AIG$)
- **Currency:** AIG$ with market-driven value
- **Purpose:** Only spending account inside AIGINVEST
- **Receives:** 20% of ALL commissions, bonuses, rewards
- **Can:** Buy apps, services, invest, upgrade tiers, create gifts
- **Exchange:** Back to Cash via peer-to-peer marketplace
- **Market:** Price determined by member supply/demand
- **Governance:** Transparent price discovery

### Automatic 80/20 Distribution

**EVERY earning event splits automatically:**

```
Event: User earns €100 commission
├─ €80 → Cash Account (80%, real money value)
└─ €20 → AIG Cash Account (20%, spending power in AIG$)

Event: User earns €50 bonus
├─ €40 → Cash Account (80%)
└─ €10 → AIG Cash Account (20%)

Event: User wins €25 game prize
├─ €20 → Cash Account (80%)
└─ €5 → AIG Cash Account (20%)
```

**No exceptions.** This is hard-coded into the commission engine.

### Conversion Flows

#### Manual: Cash → AIG Cash (1:1)
```
User Action: "Convert €100 to spending"
    ↓
System debits €100 from Cash Account
    ↓
System credits 100 AIG$ to AIG Cash Account
    ↓
Transaction recorded (conversion_cash_to_aigcash_manual)
    ↓
Completed immediately
```

#### Marketplace: AIG Cash → Cash (Market-Driven)
```
Seller: Lists 1,000 AIG$ at €0.92 each = €920 total
    ↓
Buyer: Sees order, purchases with €920 from Cash Account
    ↓
Platform: Takes 2% fee = €18.40
    ↓
Seller receives: €920 - €18.40 = €901.60 in Cash Account
    ↓
Buyer receives: 1,000 AIG$ in AIG Cash Account
    ↓
Exchange rate: Self-corrects via supply/demand
```

### Membership Tiers & Commission Depth

| Tier | Price | Width | Depth | Rates | Upside |
|------|-------|-------|-------|-------|--------|
| Free | €0 | None | 0 levels | N/A | 0% |
| Starter | €399 | Unlimited | 6 levels | 30/20/15/10/3/2 | 80% network share |
| Professional | €699 | Unlimited | 7 levels | +1% L7 | 80% network share |
| Business | €1,099 | Unlimited | 9 levels | +0.5% L8-9 | 80% network share |
| Platinum | €2,999 | Unlimited | 10 levels | +0.5% L10 | 80% + leadership |

**Key:** Width is unlimited (no cap on recruits), depth varies by tier (6-10 levels). Higher tier = deeper reach into upline organization.

---

## PART 6.5: Wallet Operations & Member Transfers (LOCKED)

### Member Wallet Architecture

Every member has **exactly two accounts** (immutable):

#### 1. Cash Account (EUR)
**Purpose:** Holding account for real money

**Functions:**
- Receives 80% of all commissions, bonuses, prizes, and rewards
- Receives money members transfer into the ecosystem (deposits)
- Holds funds until member decides what to do with them
- **Cannot** be used directly for purchases or investments

**Key Constraint:** Must first convert to AIG Cash before spending inside ecosystem

#### 2. AIG Cash Account (AIG$)
**Purpose:** Only spending account inside AIGINVEST

**Functions:**
- Receives 20% of all commissions, bonuses, prizes, and rewards
- Used for all ecosystem purchases (apps, services, marketplace, investments)
- Used for membership upgrades
- Used for gift cards
- Spendable only inside AIGINVEST ecosystem

---

### Joining Process

When a new member joins AIGINVEST:

```
Step 1: Fiat Payment
├─ Credit card, bank transfer, or other payment method
├─ Joins as Free/Starter/Professional/Business/Platinum
└─ Membership activated immediately

Step 2: Wallet Creation
├─ Cash Account created (EUR, 1:1 fixed)
├─ AIG Cash Account created (AIG$, market-driven)
└─ Both active and ready to use

Key Point: Membership fee is NOT debited from either account
(Member doesn't yet have ecosystem funds to spend)
```

---

### Rewards Distribution (Automatic 80/20 Split)

Every earning event automatically divides into Cash Account and AIG Cash Account:

```
Commission/Bonus/Prize Example:
├─ Total earned: €100
├─ → 80% to Cash Account: €80 (real money value)
├─ → 20% to AIG Cash Account: €20 (spending power)
└─ Automatic, no manual split required

Examples:
├─ €100 commission → €80 Cash + €20 AIG$
├─ €50 bonus → €40 Cash + €10 AIG$
├─ €25 game prize → €20 Cash + €5 AIG$
└─ €1,000 leadership bonus → €800 Cash + €200 AIG$
```

**Rule:** No exceptions. Automatic 80/20 split hard-coded into commission engine.

---

### Depositing Fiat Currency

Members can deposit real money (EUR) into their Cash Account:

```
Bank Transfer / Credit Card
    ↓
  EUR Deposit
    ↓
Cash Account (EUR)
    ↓
Cannot spend directly (must convert first)
    ↓
Convert to AIG Cash
    ↓
Ready to spend in ecosystem
```

**Key Point:** Money in Cash Account is NOT immediately spendable. Conversion to AIG Cash is required.

---

### Converting Cash → AIG Cash (Manual)

Members manually convert Cash Account balance to AIG Cash at **1:1 fixed rate**:

```
Member Action: "Convert €100 to AIG Cash"
    ↓
System debits €100 from Cash Account
    ↓
System credits 100 AIG$ to AIG Cash Account
    ↓
Transaction recorded (conversion_cash_to_aigcash_manual)
    ↓
Completed immediately (no delay)
```

**Use Cases:**
- Convert just enough for a specific purchase
- Convert in bulk for monthly spending
- Convert incrementally to manage exposure

---

### Internal Transfers (Member to Member)

One of the platform's core strengths: **members can transfer AIG Cash directly to each other**.

#### Transfer Mechanics

```
Member A (Sender)
    ↓
Initiates Transfer of X AIG$
    ↓
Platform validates:
├─ Sender has sufficient balance
├─ Recipient exists and is active
└─ Transfer amount is valid

    ↓
Transaction created + recorded
    ↓
AIG Cash debited from Member A
    ↓
AIG Cash credited to Member B
    ↓
Complete audit trail stored
```

#### Transfer Features

- **Instant settlement** (real-time)
- **No fees** (member-to-member transfers are free)
- **Full traceability** (complete transaction history)
- **Reversible by support** (only for fraud/error resolution)
- **Optional memo** (message from sender to recipient)

#### Transfer Use Cases

```
Team Commissions
├─ Leader transfers AIG$ to team members
├─ No intermediary payment processor needed
└─ Direct value distribution

Gifts & Bonuses
├─ Member sends AIG$ as thank you
├─ Member sends as team incentive
└─ Member sends as prize distribution

Marketplace Liquidation
├─ Buyer pays seller via AIG$ transfer
├─ No marketplace intermediary takes fee
└─ P2P marketplace transactions

Informal Lending
├─ Member loans AIG$ to another member
├─ Recorded in blockchain for transparency
└─ Community trust mechanism
```

---

### Gift Cards (AIG Cash Only)

Gift cards are purchased using AIG Cash and can be sent to members or non-members:

```
Member A: Has 100 AIG$
    ↓
Purchases gift card for 50 AIG$
    ↓
AIG$ debited from Account A
    ↓
Gift card created (recipient TBD)
    ↓
Can be sent to:
├─ Another member (by email/username)
├─ Non-member (by email only)
└─ Recipient receives code to redeem

    ↓
Recipient redeems → 50 AIG$ added to their account
```

**Features:**
- Denominations: 10, 25, 50, 100, 500 AIG$
- Recipient doesn't need account to receive
- Expires if not redeemed in 12 months
- Can be purchased with personal AIG$ or from seller commissions

---

### Marketplace: AIG Cash ↔ EUR Conversion (Peer-to-Peer)

Unlike manual Cash→AIG Cash conversion (fixed 1:1), the **peer-to-peer marketplace determines AIG$ price dynamically** based on supply and demand.

#### How It Works

```
Member A (Seller): Lists 1,000 AIG$ at €0.92/unit = €920 total
    ↓
Order visible in marketplace (open)
    ↓
Member B (Buyer): Sees order, wants to buy
    ↓
Member B purchases: 1,000 AIG$ for €920
    ↓
Platform transfers AIG$ to Member B
    ↓
Platform transfers EUR to Member A (minus 2% fee)
    ↓
Seller receives: €920 - €18.40 = €901.60
    ↓
Buyer receives: 1,000 AIG$
```

#### Pricing Mechanics

- **Market-driven:** Price determined by all buyers/sellers, not by platform
- **Supply/demand:** Price rises when demand > supply, falls when supply > demand
- **Self-correcting:** Members naturally arbitrage price discrepancies
- **Transparent:** All orders visible, everyone sees current market price

#### Platform Fee Structure

- **Seller pays 2%** (buyer pays nothing)
- **EUR transfers only** (not AIG$ transfers)
- **Example:**
  - Seller lists 1,000 AIG$ at €1.00 = €1,000
  - Buyer purchases
  - Seller receives: €1,000 - €20 (2% fee) = €980
  - Buyer receives: 1,000 AIG$ (free)

#### Marketplace Order Types

```
Sell Orders (I want to convert AIG$ → EUR)
├─ Create: "Sell 500 AIG$ at €0.95/unit"
├─ Status: Open (waiting for buyer)
├─ Settlement: When buyer accepts
└─ Fee: 2% to platform (seller pays)

Buy Orders (I want to convert EUR → AIG$)
├─ Create: "Buy 500 AIG$ at €0.97/unit"
├─ Status: Open (waiting for seller)
├─ Settlement: When seller accepts
└─ Fee: 0% (buyer pays nothing)

Market Orders (Accept current best price)
├─ Instant execution
├─ No waiting for match
├─ Slight price premium/discount vs limit orders
└─ Fast conversion when needed
```

---

### Gift Cards & Membership Upgrades

#### Gift Cards (Repeat)
- Purchased with AIG Cash (no EUR option)
- Can be sent to members or non-members
- Recipient gets AIG$ when redeemed
- 12-month expiration

#### Membership Upgrades
- Always purchased with AIG Cash (not Cash Account EUR)
- Instant activation
- Can downgrade anytime (pro-rata refund to AIG Cash Account)

**Upgrade Flow:**
```
Member: Current Tier = Starter (€399/month)
    ↓
Purchases Professional tier upgrade (€699/month)
    ↓
AIG Cash debited: 699 AIG$ (equivalent to €699)
    ↓
Tier upgraded immediately
    ↓
Additional benefits activated
    ↓
Can downgrade anytime (receives pro-rata refund)
```

---

### Wallet Conversion Summary

```
THREE conversion paths:

1. EXTERNAL → CASH ACCOUNT (Fiat deposits)
   EUR fiat → Deposited to Cash Account
   └─ User initiated, via bank/card

2. CASH → AIG CASH (Manual conversion, 1:1 fixed)
   EUR from Cash Account → AIG$ to AIG Cash Account
   └─ User initiated, anytime, immediate, fee-free

3. AIG CASH ↔ EUR (Peer-to-peer marketplace, market prices)
   AIG$ ↔ EUR at market rate (2% fee on seller)
   └─ User initiated, order matching, price discovery

These three paths give members complete flexibility:
├─ Deposit fiat at any time
├─ Convert to AIG$ at fixed 1:1 rate whenever ready
├─ Exchange AIG$ back to EUR at market prices
├─ Transfer AIG$ directly to other members (free, instant)
└─ Full control over cash flow
```

---

### Wallet APIs

```
Account Information
GET /api/v1/accounts
  Returns: Both accounts with balances
  Response: {
    accounts: [
      {accountType: "cash_account", balance: €5,000},
      {accountType: "aig_cash_account", balance: €1,200}
    ]
  }

GET /api/v1/accounts/{accountType}/transactions
  Returns: Transaction history (deposits, conversions, transfers)
  Response: [transaction records with timestamps]

Deposits
POST /api/v1/accounts/deposits
  Params: amount, paymentMethod (card|bank|crypto)
  Returns: {depositId, status: "pending"|"completed"}
  Webhook: deposit.completed

Manual Conversion (Cash → AIG$, 1:1)
POST /api/v1/accounts/convert
  Params: fromAccountType, toAccountType, amount
  Returns: {conversionId, fromAmount, toAmount, status}
  Example: Convert 100 EUR → 100 AIG$ (fixed 1:1)

Internal Transfers (Member to Member)
POST /api/v1/transfers
  Params: recipientId, amount (AIG$), memo (optional)
  Returns: {transferId, status: "pending"|"completed"}
  Webhook: transfer.completed

GET /api/v1/transfers
  Returns: [all transfers sent and received]
  Response: [{sender, recipient, amount, timestamp, memo}]

Gift Cards
POST /api/v1/giftcards
  Params: amount (AIG$), recipientEmail (optional)
  Returns: {giftcardCode, balance}

POST /api/v1/giftcards/{code}/redeem
  Returns: {balance, status: "redeemed"}

Marketplace (AIG$ ↔ EUR)
GET /api/v1/marketplace/orders
  Params: orderType (buy|sell), status, limit
  Returns: [all open orders with prices]

POST /api/v1/marketplace/orders
  Params: orderType (buy|sell), quantity, pricePerUnit
  Returns: {orderId, status: "open"}

POST /api/v1/marketplace/orders/{orderId}/accept
  Returns: {transactionId, status: "completed"}

GET /api/v1/marketplace/price
  Returns: {currentMarketPrice: €0.95, high24h: €0.98, low24h: €0.91}
```

---

### Member Dashboard - Account Overview

Every member sees a simple, unified dashboard showing only the essential information:

```
┌─────────────────────────────────────────┐
│           MY ACCOUNTS                   │
├─────────────────────────────────────────┤
│                                         │
│  Cash Account              €1,245.80    │
│  (Real money, holding)                  │
│                                         │
│  AIG Cash Account          3,820 AIG$   │
│  (Spending power)                       │
│                                         │
├─────────────────────────────────────────┤
│  Available Commission      €487.50      │
│  (Pending earnings)                     │
│                                         │
└─────────────────────────────────────────┘

Quick Actions:
├─ Deposit Money (to Cash Account)
├─ Convert to AIG Cash (at 1:1 fixed)
├─ Send to Member (instant transfer)
├─ View Marketplace (P2P exchange)
├─ Transaction History
└─ Settings
```

**Key Design Principle:** Simplicity. Members see only what they need:
- How much real money (EUR) they're holding
- How much spending power (AIG$) they have
- How much commission is pending

**Available Commission (Pending Earnings):**
- Earned but not yet approved/paid
- Shows when it will be approved (usually 24-48 hours)
- Automatically splits 80/20 when paid
- Can see breakdown by tier/level

---

### Wallet Operations UI Components

#### Account Card
```
Cash Account                  €1,245.80
├─ Balance type: Real money
├─ Purpose: Holding vault
├─ Action: [Deposit Money] [Convert to AIG$]
└─ Last transaction: Deposit +€500 (2 hours ago)

AIG Cash Account             3,820 AIG$
├─ Balance type: Spending power
├─ Purpose: Ecosystem only
├─ Action: [Send to Member] [Marketplace]
└─ Last transaction: Purchase -€25 (30 mins ago)
```

#### Quick Transfer Widget
```
Send AIG Cash to a Member

Recipient: [Search by name/email ▼]
Amount: [_______] AIG$
Memo: [Optional message...]

[Send] [Cancel]

Recent Recipients:
├─ John Smith
├─ Jane Doe
└─ Team Lead
```

#### Conversion Tool (Manual 1:1)
```
Convert Cash to AIG Cash

From: Cash Account (EUR)
Available: €1,245.80

To: AIG Cash Account (AIG$)
Current holdings: 3,820 AIG$

Amount to convert: [_______] EUR
├─ Minimum: €1
├─ Maximum: €1,245.80
└─ Rate: 1 EUR = 1 AIG$ (fixed)

[Convert] [Cancel]

Note: Conversion is immediate and permanent.
```

#### Transaction History
```
Recent Transactions (Last 30 Days)

Date          Type               Amount      Balance
─────────────────────────────────────────────────────
Today         Commission paid    +€80        €1,245.80
              (80% to Cash)      +€20 AIG$
Today         Deposit            +€500       €1,165.80
2 days ago    Marketplace sale   -€25        €665.80
2 days ago    Transfer sent      -€100 AIG$  3,820 AIG$
              to Jane Doe
3 days ago    Membership paid    -€399 AIG$  3,920 AIG$

[Filter] [Export CSV] [View Details]
```

#### Marketplace Browser
```
AIG$ to EUR Conversion (P2P Marketplace)

Current Market Price: €0.95 per AIG$

Buy Orders (I want EUR, they want AIG$)
├─ 500 AIG$ at €0.94 (lowest price)
├─ 1,000 AIG$ at €0.95 (market)
└─ 2,000 AIG$ at €0.96 (premium)

Sell Orders (I want AIG$, they want EUR)
├─ 1,000 AIG$ at €0.96 (highest price)
├─ 2,000 AIG$ at €0.95 (market)
└─ 5,000 AIG$ at €0.94 (discount)

[Create Sell Order] [Create Buy Order]

Price Chart (Last 7 days)
└─ High: €0.98 | Low: €0.91 | Avg: €0.94
```

---

### Account Security Features

**Two-Factor Authentication:**
- SMS or authenticator app
- Required for: deposits, transfers >1,000 AIG$, marketplace orders >€500

**Transaction Limits:**
- Daily withdrawal: €5,000 (adjustable)
- Daily transfer: 50,000 AIG$ (adjustable)
- Monthly deposit: €50,000 (adjustable)

**Fraud Protection:**
- All transfers reviewed by machine learning
- Suspicious activity flags for manual review
- Reversible transfers within 24 hours (if flagged)
- Full transaction audit trail

**Account Recovery:**
- Email-based account recovery
- Backup codes (10 one-time recovery codes)
- Support team manual recovery (KYC verification required)

---

### Complete Transaction Audit Trail

Every financial movement is recorded with full details, providing complete transparency and auditability:

#### Transaction Record Fields

```
Every transaction captures:

├─ Transaction ID: Unique UUID (immutable)
├─ Timestamp: ISO 8601 UTC (immutable)
├─ Source Account: From (user + account type)
├─ Destination Account: To (user + account type)
├─ Amount: Quantity moved
├─ Currency: EUR or AIG$
├─ Exchange Rate: If conversion (e.g., 1.00 for Cash→AIG$, market rate for marketplace)
├─ Fee (if applicable): Platform/payment processor fee
├─ Net Amount: Amount after fees
├─ Transaction Type: (see list below)
├─ Status: pending | completed | failed | reversed
├─ Reference ID: External reference (if applicable)
├─ Memo/Description: User-provided context
├─ IP Address: Source IP for security
├─ Device: Device type/ID (web, mobile, etc.)
├─ User Agent: Browser/app info
├─ Approval Status: auto | manual_approved | manual_rejected
├─ Approved By: User ID (if manual)
├─ Metadata: JSON blob for future extensibility
└─ Created At: When record was created

Example Transaction:
{
  "id": "txn_abc123def456",
  "timestamp": "2026-07-07T14:32:15Z",
  "sourceAccount": {
    "userId": "user_123",
    "accountType": "cash_account",
    "balanceBefore": 1500.00,
    "balanceAfter": 1400.00
  },
  "destinationAccount": {
    "userId": "user_456",
    "accountType": "aig_cash_account",
    "balanceBefore": 2500.00,
    "balanceAfter": 2600.00
  },
  "amount": 100.00,
  "currency": "EUR",
  "exchangeRate": 1.00,
  "fee": 0.00,
  "netAmount": 100.00,
  "transactionType": "marketplace_purchase",
  "status": "completed",
  "referenceId": "marketplace_order_xyz789",
  "memo": "Payment for premium software",
  "ipAddress": "192.168.1.100",
  "device": "web",
  "approvalStatus": "auto",
  "approvedBy": null,
  "metadata": {
    "marketplace_item_id": "item_999",
    "seller_id": "user_456"
  }
}
```

#### All Transaction Types

```
Deposits & Withdrawals:
├─ deposit_bank_transfer (EUR → Cash Account)
├─ deposit_credit_card (EUR → Cash Account)
├─ deposit_crypto (Crypto → Cash Account, value in EUR)
├─ withdrawal_bank_transfer (Cash Account → EUR, external bank)
├─ withdrawal_crypto (EUR value → external crypto wallet)
└─ withdrawal_cancelled (Withdrawal rejected/cancelled)

Conversions:
├─ conversion_cash_to_aigcash (Cash → AIG$, 1:1 fixed)
├─ conversion_aigcash_to_cash (AIG$ → EUR, marketplace executed)
└─ conversion_error_reversal (Failed conversion reversed)

Commissions:
├─ commission_direct_sale (Direct commission paid, auto 80/20 split)
├─ commission_mlm_level_1 to _10 (MLM commission by level, auto 80/20)
├─ commission_team_volume (Team volume bonus, auto 80/20)
├─ commission_leadership_bonus (Leadership bonus, auto 80/20)
├─ commission_achievement_reward (Achievement/game prize, auto 80/20)
├─ commission_adjustment (Manual correction by admin)
└─ commission_reversal (Commission reversed)

Transfers:
├─ transfer_sent (Send AIG$ to another member)
├─ transfer_received (Receive AIG$ from another member)
├─ transfer_failed (Transfer failed, reversed)
└─ transfer_cancelled (Sender cancelled transfer)

Marketplace:
├─ marketplace_purchase (Buy on marketplace, AIG$ → seller)
├─ marketplace_sale (Sell on marketplace, AIG$ ← buyer)
├─ marketplace_aig_to_eur (Convert AIG$ to EUR via marketplace)
├─ marketplace_eur_to_aig (Convert EUR to AIG$ via marketplace)
├─ marketplace_fee (Platform fee deducted from seller)
└─ marketplace_order_refunded (Buyer refund issued)

Gift Cards:
├─ giftcard_purchased (Create gift card with AIG$)
├─ giftcard_redeemed (Recipient claims gift card value)
└─ giftcard_expired (Unused gift card expired)

Purchases:
├─ purchase_application (Buy application, AIG$ spent)
├─ purchase_service (Buy service/subscription, AIG$ spent)
├─ purchase_membership_upgrade (Upgrade membership tier, AIG$ spent)
├─ purchase_investment (Invest in fund/crypto/stock, AIG$ spent)
└─ purchase_other (Other purchase type)

Investments:
├─ investment_aigphone_buy (Purchase AIGPHONE equity)
├─ investment_aigphone_sell (Sell AIGPHONE shares)
├─ investment_fund_buy (Invest in fund)
├─ investment_fund_dividend (Receive fund dividend)
├─ investment_aigio_buy (Purchase AIGIO tokens)
├─ investment_aigio_stake (Lock up AIGIO for staking)
├─ investment_aigio_unstake (Unlock staked AIGIO)
├─ investment_aigio_dividend (Receive AIGIO dividend)
└─ investment_return (ROI/return distributed)

Administrative:
├─ admin_adjustment (Manual balance adjustment)
├─ admin_reversal (Admin reversed transaction)
├─ admin_manual_transfer (Admin initiated transfer)
└─ admin_dispute_resolution (Dispute resolved, funds adjusted)

System:
├─ system_fee_monthly (Monthly platform fee)
├─ system_promotional_credit (Promotional credit issued)
├─ system_bonus_distribution (Automatic bonus payout)
└─ system_correction (System correction applied)
```

#### Transaction History Display

```
Member Dashboard - Transaction History

Show Last 50 Transactions (Paginated, 100 per page download)

Date/Time              Type                Amount    Currency  Status    Account
─────────────────────────────────────────────────────────────────────────────────
2026-07-07 14:32:15   Marketplace Sale    +€100     AIG$      ✓ Done    AIG Cash
2026-07-07 12:15:40   Commission Paid     +€40      EUR       ✓ Done    Cash
                      (MLM Level 2)       +€10      AIG$
2026-07-06 18:50:22   Transfer Sent       -€500     AIG$      ✓ Done    AIG Cash
                      to John Smith
2026-07-05 09:22:10   Conversion          -€100     EUR       ✓ Done    Cash → AIG$
                      (1:1 rate)          +€100     AIG$
2026-07-04 16:45:33   Deposit             +€1,000   EUR       ✓ Done    Cash
                      (Bank Transfer)
2026-07-03 11:20:15   Purchase            -€50      AIG$      ✓ Done    AIG Cash
                      (Software License)
2026-07-02 07:55:44   Investment          -€500     AIG$      ✓ Done    AIG Cash
                      (Balanced Fund)
2026-06-30 20:10:30   Gift Card           -€25      AIG$      ✓ Done    AIG Cash
                      Sent to Mom (external)

[Filter by type] [Search by date] [Export as CSV] [View Details]
```

#### Transaction Details View

```
Transaction ID: txn_abc123def456
Reference ID: marketplace_order_xyz789

┌─────────────────────────────────────────────┐
│ Transaction Details                          │
├─────────────────────────────────────────────┤
│                                             │
│ Type:           Marketplace Purchase        │
│ Date/Time:      2026-07-07 14:32:15 UTC    │
│ Status:         Completed ✓                │
│                                             │
│ From Account:   AIG Cash Account            │
│ To Account:     Seller's AIG Cash Account   │
│                                             │
│ Amount:         100 AIG$                    │
│ Fee:            0 AIG$ (buyer fee-free)    │
│ Net Paid:       100 AIG$                    │
│                                             │
│ Source IP:      192.168.1.100               │
│ Device:         Web Browser                 │
│ User Agent:     Chrome/126.0                │
│                                             │
│ Approval:       Auto-approved               │
│ Approved At:    2026-07-07 14:32:16 UTC    │
│                                             │
│ Item:           Premium AI Assistant        │
│ Seller:         TechVendor Inc              │
│ Seller Rating:  4.9/5.0 (1,247 reviews)    │
│                                             │
│ Actions: [Report] [Dispute] [View Seller]   │
│                                             │
└─────────────────────────────────────────────┘
```

#### Database Schema (audit_transactions table)

```sql
audit_transactions
├── id (UUID, primary key)
├── transaction_id (VARCHAR unique, indexed)
├── timestamp (TIMESTAMP UTC, indexed)
├── source_user_id (UUID, indexed)
├── source_account_type (ENUM: cash_account | aig_cash_account)
├── source_balance_before (DECIMAL)
├── source_balance_after (DECIMAL)
├── destination_user_id (UUID, indexed)
├── destination_account_type (ENUM: cash_account | aig_cash_account)
├── destination_balance_before (DECIMAL)
├── destination_balance_after (DECIMAL)
├── amount (DECIMAL, indexed)
├── currency (VARCHAR: EUR | AIG$)
├── exchange_rate (DECIMAL)
├── fee (DECIMAL)
├── net_amount (DECIMAL)
├── transaction_type (VARCHAR, indexed)
├── status (ENUM: pending | completed | failed | reversed, indexed)
├── reference_id (VARCHAR, indexed)
├── memo (TEXT)
├── ip_address (VARCHAR)
├── device_type (VARCHAR)
├── user_agent (TEXT)
├── approval_status (ENUM: auto | manual_approved | manual_rejected)
├── approved_by (UUID)
├── approved_at (TIMESTAMP UTC)
├── metadata (JSON)
├── created_at (TIMESTAMP UTC, indexed)
├── updated_at (TIMESTAMP UTC)
└── deleted_at (TIMESTAMP UTC, soft delete)

Indexes:
├─ (transaction_id) - UNIQUE, for lookups
├─ (source_user_id, timestamp) - For member history
├─ (destination_user_id, timestamp) - For member history
├─ (transaction_type, timestamp) - For reports
├─ (status, timestamp) - For pending transaction queries
└─ (timestamp DESC) - For dashboard queries
```

#### Transaction History APIs

```
Transaction History
GET /api/v1/transactions
  Params: limit=50, offset=0, filter (optional)
  Returns: [transactions paginated]
  Response: {
    transactions: [...],
    total: 1,247,
    limit: 50,
    offset: 0
  }

GET /api/v1/transactions/{transactionId}
  Returns: Complete transaction details
  Response: {full transaction record}

GET /api/v1/transactions?filter=type:commission
  Params: filter (complex filter)
  Examples:
    ?filter=type:commission
    ?filter=status:pending
    ?filter=date_from:2026-07-01&date_to:2026-07-31
    ?filter=type:commission,status:completed
  Returns: [filtered transactions]

GET /api/v1/transactions/export
  Params: format (csv|json), date_from, date_to
  Returns: File download (CSV or JSON)
  Columns (CSV): TransactionID, Date, Type, Amount, Currency, 
                 Status, Reference, Source, Destination

Transaction Search
GET /api/v1/transactions/search
  Params: q (search query), type (optional)
  Searchable fields: memo, reference_id, device_type, ip_address
  Returns: [matching transactions]

Balance History
GET /api/v1/accounts/{accountType}/balance_history
  Params: date_from, date_to
  Returns: Daily balance snapshots
  Response: [{date, opening_balance, closing_balance, transactions}]

Reports
GET /api/v1/reports/transaction_summary
  Params: period (day|week|month|year)
  Returns: {
    period: "2026-07",
    deposits: €5,000,
    withdrawals: €2,500,
    conversions: €1,200,
    commissions: €800,
    marketplace: €300,
    net_change: +€1,300
  }

GET /api/v1/reports/transaction_breakdown
  Returns: Breakdown by transaction type
  Response: {
    by_type: [{type, count, total_amount}],
    by_status: [{status, count, total_amount}],
    by_currency: [{currency, count, total_amount}]
  }
```

#### Audit Trail Guarantees

```
Immutability:
├─ Once created, transactions cannot be modified
├─ Corrections done via new reversal transaction
├─ Original transaction remains visible
├─ Complete history preserved forever

Completeness:
├─ Every financial movement recorded
├─ No transactions off-books
├─ All fees visible
├─ All exchanges logged

Compliance:
├─ GDPR compliant (data retention policies)
├─ AML/KYC compliant (suspicious activity flagged)
├─ Tax compliant (transaction data exportable for tax reporting)
├─ Audit compliant (full audit trail for external auditors)

Access Control:
├─ Members see only their own transactions
├─ Admins can see all transactions (with audit logging)
├─ Support can see customer transactions (with manager approval)
├─ Compliance team can access for investigations

Export & Reporting:
├─ CSV export for accounting software
├─ PDF statement generation
├─ Tax reporting summaries (by country)
├─ Custom date range queries
```

---

## PART 7: Investment Services & Equity Access

### Investment Opportunities for Members

AIGINVEST members can invest AIG Cash into multiple asset classes and opportunities:

#### 1. **Tag Markets** (Real-Time Market Trading)
```
Access to:
├─ Commodities (gold, oil, agriculture)
├─ Forex (currency pairs)
├─ Indices (stock market indices)
├─ CFDs (contracts for difference)
└─ Managed funds

Trading:
├─ Minimum: 10 AIG$ per position
├─ Leverage: 1:1 to 1:100 (tiered by membership)
├─ Hours: 24/5 (Mon-Fri, 23:00 UTC Sun to 22:00 UTC Fri)
└─ Costs: Spread + commission (transparent pricing)

Available to:
├─ Starter (€399): Basic markets, 1:10 leverage
├─ Professional (€699): All markets, 1:25 leverage
├─ Business (€1,099): All markets, 1:50 leverage
└─ Platinum (€2,999): All markets, 1:100 leverage
```

#### 2. **Crypto Exchanges** (Digital Asset Trading)
```
Supported Assets:
├─ Bitcoin (BTC)
├─ Ethereum (ETH)
├─ Ripple (XRP)
├─ Litecoin (LTC)
├─ Stablecoins (USDT, USDC, DAI)
└─ 100+ altcoins

Trading Pairs:
├─ AIG$ ↔ BTC/ETH/etc.
├─ EUR ↔ BTC/ETH/etc. (via Cash Account)
└─ Cross-pairs (BTC/ETH, etc.)

Wallet Integration:
├─ Non-custodial (self-custody with backup)
├─ Hardware wallet support (Ledger, Trezor)
├─ Hot wallet for active trading
└─ Cold storage for long-term hold

Available to:
├─ Starter: Spot trading only
├─ Professional: Spot + margin trading (2x)
├─ Business: Spot + margin (5x) + futures
└─ Platinum: All features + API access
```

#### 3. **Long-Term Investment Funds** (Managed Portfolios)
```
Fund Types:
├─ Conservative (60% bonds, 40% dividend stocks)
│  └─ Annual return: 4-6%
├─ Balanced (40% bonds, 50% stocks, 10% crypto)
│  └─ Annual return: 8-10%
├─ Growth (20% bonds, 60% stocks, 20% crypto)
│  └─ Annual return: 12-15%
├─ Aggressive (10% bonds, 40% stocks, 50% crypto)
│  └─ Annual return: 20-30% (high volatility)
└─ AI-Curated (Diana selects based on preference)
   └─ Annual return: Variable

Features:
├─ Monthly rebalancing
├─ Automatic dividend reinvestment
├─ Tax optimization
├─ Performance tracking
├─ Tiered fees (0.5%-2% annually by AUM)

Minimum Investment:
├─ Starter: 100 AIG$ minimum
├─ Professional: 50 AIG$ minimum
├─ Business/Platinum: 10 AIG$ minimum

Withdrawal:
├─ Anytime (no lock-up period)
├─ Settlement: 2-5 business days
└─ No penalties or surrender charges
```

#### 4. **AIGPHONE Ltd - Start-up Equity** (Core Investment Opportunity)

**What is AIGPHONE Ltd?**

AIGPHONE Ltd is the startup company developing:
- **AIOS** (proprietary operating system)
- **North Star ONE** (flagship phone running AIOS)
- **AI hardware acceleration** (custom chip design)
- **Diana on-device** (private LLM execution)

**Business Model:**

```
Revenue Sources:
├─ Device Sales (North Star ONE phones)
│  └─ Target: 2028-2030 launch, 1M units/year
├─ Licensing (AIOS to other manufacturers)
│  └─ Target: €50/unit × 10M units/year
├─ AI Services (on-device and cloud)
│  └─ Target: €15/month × 5M subscribers
└─ Hardware Components (chips, sensors)
   └─ Target: OEM sales to other phone makers

Projected Financials (Conservative):
├─ 2026: R&D phase (pre-revenue, -€5M)
├─ 2027: Prototype + developer edition (-€2M)
├─ 2028: Commercial launch (€50M revenue)
├─ 2029: €200M revenue
├─ 2030: €500M revenue (breakeven)
└─ 2031+: €1B+ revenue (scale phase)
```

**How to Invest:**

```
Investment Structure:
├─ Equity Rounds: Series A, B, C, D (future IPO)
├─ Minimum Investment: 1,000 AIG$ (≈€950 at current rate)
├─ Maximum: Unlimited (accredited tier limits apply)
├─ Valuation: Transparent, updated quarterly
└─ Voting Rights: 1 share = 1 vote (democratic cap table)

Payment Method:
├─ Exclusively AIG Cash (no EUR accepted)
├─ Funds transferred to AIGPHONE Ltd operating account
├─ Certificates issued (blockchain-backed)
└─ Dividend distributions paid in AIG Cash

Return Potential:
├─ Conservative projection: 5-10x in 5 years
├─ Moderate projection: 10-25x in 5 years (2028-2033)
├─ Optimistic projection: 50x+ if IPO succeeds
└─ Risk: Startup risk (no guarantee of success)

Available to:
├─ Starter (€399): Qualified investor status required
├─ Professional/Business/Platinum: Unlimited access
└─ All tiers: Accredited investor verification (KYC Level 3)
```

**Governance & Transparency:**

```
Member Protections:
├─ Annual financial audits (big 4 accounting firm)
├─ Quarterly performance reports
├─ Board observer rights (for investors >10k AIG$)
├─ Secondary market (trade shares with other members)
└─ Liquidation preference (1x non-participating)

Cap Table (Post-Series A):
├─ AIG Members: 30% (collective)
├─ AIG Founder/Early Team: 25%
├─ Institutional VCs: 35%
├─ Employee Options Pool: 10%
└─ Total: 100%

Exit Scenarios:
├─ IPO (target: 2030-2032)
│  └─ Likely: €5-10B valuation
├─ Acquisition (possible: Apple, Samsung, Google)
│  └─ Potential: €2-5B price
├─ Going Private (later stage buyout)
│  └─ Possible: €1-2B price
└─ Secondary market buybacks (quarterly)
```

#### 5. **AIGIO Tokens - Dividend Securities** (Passive Income)

**What are AIGIO Tokens?**

Ownership tokens in AIGINVEST ecosystem with:
- Base price: €0.90
- Dynamic pricing: €0.90 × (1 + revenue_millions / 100)
- Quarterly dividends: 2% of earnings
- Staking rewards: 5-12% APY by lock-up period
- Governance voting: 1 token = 1 vote

**Staking Programs:**

```
3-Month Lock: 5% APY
├─ Compounds quarterly
├─ Early withdrawal penalty: 0.5%
└─ Ideal for: Testing

6-Month Lock: 7% APY
├─ Compounds quarterly
├─ Early withdrawal penalty: 1%
└─ Ideal for: Short-term hold

1-Year Lock: 10% APY
├─ Compounds quarterly
├─ Early withdrawal penalty: 2%
└─ Ideal for: Medium-term

2-Year Lock: 12% APY
├─ Compounds quarterly
├─ Early withdrawal penalty: 3%
└─ Ideal for: Long-term believers

Perpetual Staking (Unlimited):
├─ 12% APY forever
├─ No withdrawal capability (locked in)
├─ Highest security tier
└─ Ideal for: True believers
```

**How AIGIO Prices Work:**

```
Base Price: €0.90

Dynamic Formula:
Price = €0.90 × (1 + AIGINVEST_Revenue_Millions / 100)

Examples:
├─ Revenue €0M (startup): Price = €0.90
├─ Revenue €100M (scale): Price = €1.80
├─ Revenue €500M (mature): Price = €5.90
├─ Revenue €1,000M (large): Price = €10.90

Dividend Calculation:
Quarterly dividend per token = (AIGINVEST_Net_Income / Tokens_Outstanding) × 25%

Example:
├─ Net income: €100M
├─ Tokens outstanding: 100M
├─ Profit per token: €1.00
├─ Dividend (25%): €0.25 per token per quarter = €1.00 annual
```

**Available to:**
- All members (minimum: 1 token)
- No accredited investor requirement
- Unlimited staking allowed

---

### Investment Dashboard (UI/UX)

Member view:

```
Investment Portfolio
├─ Tag Markets
│  ├─ Current positions: €50,000 (AIG$)
│  ├─ Unrealized P&L: +€5,200 (+10.4%)
│  └─ 30-day return: +2.1%
├─ Crypto Holdings
│  ├─ Bitcoin: 0.5 BTC @ €35,000 = €17,500
│  ├─ Ethereum: 5 ETH @ €2,000 = €10,000
│  └─ Unrealized: +€3,500 (+11.2%)
├─ Managed Funds
│  ├─ Balanced Fund: €25,000 (started 2026-01)
│  ├─ Unrealized: +€2,100 (+8.4%)
│  └─ Dividend received: €50 (quarterly)
├─ AIGPHONE Ltd Equity
│  ├─ Shares: 50 (from 10,000 AIG$ investment)
│  ├─ Current valuation: €85,000 (Series A)
│  ├─ Unrealized gain: +€75,000 (+750%)
│  └─ Board updates: View latest investor memo
└─ AIGIO Tokens
   ├─ Holdings: 500 staked (2-year lock)
   ├─ Value: €465 (500 × €0.93)
   ├─ Annual dividend: €31.20 (12% APY)
   ├─ Next staking reward: 2026-07-15
   └─ Voting power: 500 tokens in DAO votes

Total Portfolio Value: €192,000 AIG$
Total Unrealized Gains: +€85,800 (+44.7%)
Annual Passive Income: €31.20 + dividends
```

---

### Investment API Endpoints

```
Markets & Trading
GET /api/v1/markets/prices
  Returns: Real-time prices for tag markets
  Response: {bid, ask, spread, lastTrade, volume}

POST /api/v1/trading/positions
  Params: symbol, type (buy|sell), amount, leverage
  Returns: Position confirmation
  Events: trade.opened, order.filled

GET /api/v1/trading/positions
  Returns: All open positions with P&L
  Response: [{symbol, quantity, entryPrice, currentPrice, unrealizedPL}]

Crypto
GET /api/v1/crypto/exchanges
  Returns: Available exchanges (Binance, Kraken, etc.)
  Response: [{name, fees, liquidity}]

POST /api/v1/crypto/orders
  Params: exchange, pair, type (buy|sell), amount
  Returns: Order ID and confirmation

GET /api/v1/crypto/wallet
  Returns: Crypto holdings with values

Investment Funds
GET /api/v1/funds/available
  Returns: List of managed investment funds
  Response: [{name, type, apy, riskLevel, allocation}]

POST /api/v1/funds/invest
  Params: fundId, amount
  Returns: Investment confirmation

AIGPHONE Equity
GET /api/v1/aigphone/equity
  Returns: Current cap table and share price
  Response: {sharesHeld, currentValuation, unrealizedGain, boardUpdates}

POST /api/v1/aigphone/invest
  Params: amount (AIG$), round
  Returns: Share certificate (blockchain)

AIGIO Tokens
GET /api/v1/aigio/price
  Returns: Current AIGIO price with dividend info
  Response: {price, 24hChange, dividendPerShare, stakingAPY}

POST /api/v1/aigio/stake
  Params: quantity, lockupMonths
  Returns: Staking confirmation
  Events: tokens.staked

GET /api/v1/aigio/dividends
  Returns: Dividend history and next distribution
  Response: [dividend records]
```

---

## PART 8: WDM - World Domination Market (Product Marketplace)

### What is WDM?

**WDM** (World Domination Market) is AIGINVEST's comprehensive e-commerce and services marketplace. Members can browse, purchase, and sell physical products, digital goods, and services using AIG Cash.

### Product Categories

```
Physical Products
├─ Electronics (phones, tablets, computers)
├─ Home & Garden (furniture, appliances)
├─ Fashion & Accessories (clothing, shoes, jewelry)
├─ Sports & Outdoors (equipment, gear)
├─ Health & Wellness (supplements, fitness equipment)
├─ Beauty & Personal Care (cosmetics, skincare)
├─ Toys & Games (games, collectibles)
└─ Other (miscellaneous items)

Digital Goods
├─ Software & Apps (applications, plugins, extensions)
├─ E-books & Publications (books, magazines, guides)
├─ Courses & Training (online courses, tutorials)
├─ Templates & Designs (UI kits, graphics, themes)
├─ Music & Audio (songs, albums, sound effects)
├─ Video Content (movies, tutorials, webcasts)
├─ Data & Analytics (reports, datasets, research)
└─ Licenses & Subscriptions (software licenses, premium access)

Services
├─ Consulting & Advice (expert consultations)
├─ Design & Creative (graphic design, copywriting, web design)
├─ Development & Programming (custom code, app development)
├─ Marketing & Promotion (SEO, social media, advertising)
├─ Writing & Translation (content writing, translation)
├─ Virtual Assistance (admin support, scheduling)
├─ Training & Coaching (personalized training, mentoring)
└─ Other Services (task-based services)

Investments (Secondary)
├─ AIGPHONE Ltd Shares (resale of equity stakes)
├─ AIGIO Tokens (trading of staked tokens)
├─ Fund Shares (resale of investment fund holdings)
└─ Crypto Assets (peer-to-peer crypto trading)
```

### Seller Dashboard

Members can become sellers on WDM:

```
Seller Activation:
├─ Any member (all tiers)
├─ KYC Level 1 required (for withdrawals)
├─ Seller agreement acceptance
├─ Bank account verification (for payouts)
└─ 24-hour activation time

Store Creation:
├─ Store name (custom URL: wdm.aiginvest.io/store/[name])
├─ Store description & branding
├─ Category selection (max 5 primary)
├─ Payment methods accepted
├─ Shipping options (if physical goods)
└─ Return policy

Listing Features:
├─ Product title (max 200 chars)
├─ Description (max 5,000 chars)
├─ Category & tags
├─ Price (in AIG$)
├─ Discount options (percentage or fixed)
├─ Inventory tracking
├─ Images (up to 20, auto-optimized)
├─ Video preview (optional)
└─ Variants (size, color, etc.)

Commission Structure:
├─ Standard commission: 5% to WDM platform
├─ Payment processing: 0.5% (Stripe/PayPal)
├─ Total cost to seller: 5.5%
├─ Seller receives: 94.5% of sale price
└─ Settlement: Weekly to AIG Cash Account

Example:
├─ Product price: 100 AIG$
├─ Platform commission: 5 AIG$
├─ Payment fee: 0.5 AIG$
├─ Seller net: 94.5 AIG$
```

### Buyer Experience

```
Browse & Search:
├─ Category browsing (18 main categories)
├─ Full-text search (product names, descriptions)
├─ Filters (price, rating, seller tier, delivery time)
├─ Sorting (popularity, newest, price, rating)
├─ Saved items list
└─ Wish list functionality

Product Details:
├─ High-quality images (carousel view)
├─ Video preview (if available)
├─ Detailed description
├─ Seller reputation & reviews
├─ Price & availability
├─ Shipping information
├─ Return policy
├─ Similar products
└─ Q&A section (ask seller questions)

Checkout Process:
├─ Review cart
├─ Select delivery method (instant download, shipping, etc.)
├─ Shipping address (if applicable)
├─ Payment (AIG Cash only)
├─ Order confirmation
├─ Tracking number (if physical goods)
└─ Delivery/fulfillment tracking

Protection:
├─ 30-day money-back guarantee (standard)
├─ Seller dispute resolution
├─ Escrow payment holding
├─ Buyer protection insurance (for orders >1,000 AIG$)
└─ Fraud protection (chargeback rights)

Rating & Reviews:
├─ 5-star rating system
├─ Text review (max 5,000 chars)
├─ Photo/video in review
├─ Verified purchase badge
├─ Seller response section
├─ Review moderation (spam/abuse removal)
└─ Review aggregation (average rating, distribution)
```

### Fulfillment Options

```
Digital Goods (Instant):
├─ Immediate delivery upon purchase
├─ Automatic download link sent
├─ No shipping required
├─ Resale/redistribution controls (seller setting)
└─ License key delivery (if applicable)

Physical Goods (Shipping):
├─ Integration with major couriers (DHL, FedEx, UPS)
├─ Domestic & international shipping
├─ Tracked delivery
├─ Insurance available (seller option)
├─ Return shipping label generation
└─ Real-time tracking updates

Services (Custom):
├─ Scheduled delivery (Zoom calls, consultations)
├─ Project-based delivery (Jira, Asana integration)
├─ Time-based delivery (hourly, daily, weekly)
├─ Gig-style delivery (task-based)
└─ Recurring delivery (subscription services)

Print-on-Demand (Future):
├─ Automatic fulfillment partner integration
├─ No inventory needed
├─ Custom products (mugs, t-shirts, posters)
├─ Product photography (automated)
└─ Margin-based pricing
```

### Affiliate Program

Members can earn commissions promoting other sellers' products:

```
Affiliate Setup:
├─ Any seller product can be promoted
├─ Commission rate: 10-25% (seller configurable)
├─ Affiliate links generated automatically
├─ Tracking via unique referral codes
└─ Real-time dashboard

Promotion Tools:
├─ Product link (short URL)
├─ Banners & graphics (pre-made templates)
├─ Email templates (swipe files)
├─ Social media posts (copywriting suggestions)
├─ Landing page builder (for campaigns)
└─ Diana suggestion engine ("promote products similar to X")

Affiliate Dashboard:
├─ Campaign tracking (impressions, clicks, conversions)
├─ Commission earned (daily/weekly/monthly)
├─ Top-performing products
├─ Payout history
├─ Payment schedule (weekly to AIG Cash Account)
└─ Performance analytics

Payment:
├─ Earned commissions: Direct to AIG Cash Account
├─ Weekly settlement
├─ 100% transparent tracking
└─ No minimum payout threshold
```

### WDM Analytics & Trending

```
Seller Metrics:
├─ Total sales (all-time, monthly, weekly)
├─ Average order value
├─ Customer count
├─ Repeat purchase rate
├─ Avg rating/reviews
├─ Response time to inquiries
├─ Return rate
└─ Seller tier/badge eligibility

Marketplace Trending:
├─ Top-selling categories
├─ New trending products
├─ Best-performing sellers
├─ Most-reviewed items
├─ Highest-rated products
├─ Most-saved items
├─ Price trends (category-based)
└─ Seasonal trends

Seller Tiers & Badges:
├─ New Seller (first 30 days)
├─ Rising Star (10+ sales, 4.5+ rating)
├─ Top Seller (100+ sales, 4.7+ rating)
├─ Elite Seller (500+ sales, 4.8+ rating)
├─ Premium Seller (1,000+ sales, 4.9+ rating)
└─ Verified Expert (domain expertise verified)

Benefits by Tier:
├─ Featured listing placement (top tier)
├─ Badge display (seller profile)
├─ Fee reduction (top tier: 3% instead of 5%)
├─ Dedicated support access
├─ Early access to new features
└─ Exclusive promotions
```

### WDM API Endpoints

```
Products
GET /api/v1/wdm/products
  Params: category, search, filter, sort, page
  Returns: [products with details, seller info, ratings]

GET /api/v1/wdm/products/:id
  Returns: Complete product details + seller + reviews

POST /api/v1/wdm/products
  Params: title, description, category, price, images
  Returns: Product listing confirmation
  Required: Seller status verified

GET /api/v1/wdm/categories
  Returns: [category list with product count]

Shopping Cart
GET /api/v1/wdm/cart
  Returns: Current cart items

POST /api/v1/wdm/cart/items
  Params: productId, quantity
  Returns: Updated cart

DELETE /api/v1/wdm/cart/items/:itemId
  Returns: Updated cart

Orders
POST /api/v1/wdm/orders
  Params: cartItems, shippingAddress, paymentMethod
  Returns: Order confirmation
  Debits AIG Cash Account

GET /api/v1/wdm/orders
  Returns: [all orders (buy & sell history)]

GET /api/v1/wdm/orders/:id
  Returns: Complete order details + tracking

POST /api/v1/wdm/orders/:id/cancel
  Returns: Cancellation confirmation (if allowed)

Seller Operations
POST /api/v1/wdm/store
  Params: storeName, description, categories
  Returns: Store created

GET /api/v1/wdm/seller/dashboard
  Returns: {totalSales, avgRating, newOrders, analytics}

POST /api/v1/wdm/seller/analytics
  Params: dateRange, metric
  Returns: Analytics data (CSV export)

Reviews
POST /api/v1/wdm/reviews
  Params: orderId, rating, text, images
  Returns: Review posted

GET /api/v1/wdm/products/:id/reviews
  Returns: [all reviews for product]

Affiliates
POST /api/v1/wdm/affiliate/link
  Params: productId
  Returns: {affiliateLink, trackingCode}

GET /api/v1/wdm/affiliate/dashboard
  Returns: {commissionsEarned, topProducts, conversions}

GET /api/v1/wdm/affiliate/payouts
  Returns: [payout history to AIG Cash Account]
```

### WDM Economics

```
Total Market Size Projection:
├─ Year 1 (2026): €5M GMV (Gross Merchandise Value)
├─ Year 2 (2027): €50M GMV
├─ Year 3 (2028): €200M GMV
├─ Year 4 (2029): €500M GMV
└─ Year 5 (2030): €1B GMV

Revenue Model:
├─ Platform commission: 5% of GMV
├─ Payment processing (pass-through): 0.5%
├─ Featured listings (premium seller): €50/month
├─ Advertising (display ads): €1,000-50,000/month
└─ Logistics (if platform offers): 10% of shipping

Platform Revenue (at Year 3):
├─ Commission (5% × €200M): €10M
├─ Advertising & premium: €2M
├─ Total: €12M annual
└─ Operating expenses: €6M (50% of revenue)
└─ Net profit margin: 50% on WDM operations

Member Economics:
├─ Average seller: €10,000 annual sales → €9,450 net (after 5.5% fees)
├─ Top 1% seller: €1M annual sales → €945,000 net
├─ Average affiliate: €5,000 annual referrals → €750-1,250 earned (15-25%)
└─ Buyer: Prices ~10-20% lower than retail competitors
```

---

## PART 9: Technology Stack

### Frontend
- **Framework:** Next.js 14 (React 18, TypeScript)
- **Styling:** Tailwind CSS
- **State:** React Context + Hooks
- **Components:** Headless UI, Radix UI
- **Streaming:** SSE (Server-Sent Events)

### Backend
- **Framework:** NestJS 10 (TypeScript, ESM)
- **Database ORM:** Prisma 5
- **Authentication:** JWT + bcrypt
- **HTTP:** Express.js
- **Streaming:** Node.js SSE

### Data
- **Primary DB:** PostgreSQL 16 (source of truth)
- **Cache:** Redis 7 (sessions, rate limiting)
- **Search:** Full-text (PostgreSQL native)

### AI
- **Providers:** OpenAI GPT-4 / Anthropic Claude / Ollama (local)
- **Router:** In-process (LLMService)
- **Streaming:** SSE with AbortController

### DevOps
- **Container:** Docker, Docker Compose
- **Monorepo:** pnpm workspaces + Turbo
- **Package Manager:** pnpm v8+
- **Cloud:** Hetzner (primary), edge CDN
- **Monitoring:** Prometheus, Grafana (planned)

---

## PART 10: Development Roadmap

### Current Status (v0.2 Released)

| Version | Name | Status | Release |
|---------|------|--------|---------|
| v0.1 | Meet Diana | ✅ | 2026-07-06 |
| v0.2 | Real Diana | ✅ | 2026-07-06 |
| v0.3 | Diana Works | 🔵 Next | Q3 2026 |
| v0.4 | Connectivity | ⏳ Planned | Q4 2026 |
| v0.5 | AIOS Prep | ⏳ Planned | Q1 2027 |
| v1.0 | Public Launch | ⏳ Planned | Q4 2026/Q1 2027 |

### v0.2 (Complete) — Real Diana ✅

**Features:**
- ✅ LLM provider router (OpenAI/Anthropic/Ollama/Mock)
- ✅ SSE streaming (word-by-word responses)
- ✅ Cancel generation (AbortController)
- ✅ Long-term memory (DianaMemory table)
- ✅ Context engine (system prompt + history + memories)
- ✅ Tool framework (create_project, create_document)
- ✅ Backend auto-titling
- ✅ Redis infrastructure
- ✅ E2E tests: 17/17 passing

### v0.3 (Next) — Diana Works 🔵

**Features:**
- [ ] Tasks (create from chat, status, priority)
- [ ] Notes (capture and organize)
- [ ] Kanban (visual project board)
- [ ] Full-text search
- [ ] Mobile optimization
- [ ] Error states and offline indicator

**Definition of Done:** User can manage complete project lifecycle via conversation.

### v0.4 (Planned) — Connectivity ⏳

**Features:**
- [ ] Team workspaces
- [ ] Shared projects and documents
- [ ] Role-based access (owner/editor/viewer)
- [ ] Real-time collaboration (WebSockets)
- [ ] Activity feed
- [ ] Notifications

### v0.5 (Planned) — AIOS Prep ⏳

**Features:**
- [ ] Offline queue (messages sent when reconnected)
- [ ] Beam Me Up sync protocol design
- [ ] Sailfish OS integration research
- [ ] Device API abstraction layer
- [ ] Local model optimization

### v1.0 (Target) — Public Launch ⏳

**Features:**
- [ ] All Alpha features polished
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] GDPR compliance
- [ ] Marketplace foundation
- [ ] Payments integration
- [ ] Public documentation
- [ ] Support system
- [ ] 99.9% uptime SLA

---

## PART 11: Codebase Structure

### Repository Layout

```
aig-platform/
├── apps/
│   ├── api/                          NestJS backend
│   │   ├── src/
│   │   │   ├── ai/                   LLMService, ContextEngine
│   │   │   ├── auth/                 AuthController, AuthModule
│   │   │   ├── chat/                 ChatController, streaming
│   │   │   ├── projects/             ProjectController, ProjectService
│   │   │   ├── documents/            DocumentController
│   │   │   ├── tasks/                TaskController (future)
│   │   │   ├── memories/             DianaMemory service
│   │   │   └── main.ts               NestJS bootstrap
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── dist/                     Compiled JavaScript
│   │
│   └── web/                          Next.js frontend
│       ├── app/
│       │   ├── chat/                 Diana UI
│       │   ├── projects/             Project management
│       │   ├── documents/            Document library
│       │   ├── login/                Authentication
│       │   ├── layout.tsx            Root layout
│       │   └── page.tsx              Home page
│       ├── components/               Reusable components
│       ├── lib/                      Utilities
│       ├── package.json
│       └── next.config.js
│
├── packages/
│   └── identity/                     Shared auth package
│       ├── jwt.ts                    JWT utilities
│       ├── bcrypt.ts                 Password hashing
│       └── index.ts                  Exports
│
├── prisma/
│   ├── schema.prisma                 Database schema (13 models)
│   ├── migrations/                   All applied migrations
│   └── seed.ts                       Seed script (future)
│
├── infra/
│   └── docker/
│       ├── Dockerfile.api            NestJS Dockerfile
│       ├── Dockerfile.web            Next.js Dockerfile
│       └── docker-compose.yml        Local dev setup
│
├── docker-compose.yml                PostgreSQL + Redis
├── .env.example                      Environment template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Key Files

**Backend (apps/api/):**
- `src/main.ts` — NestJS bootstrap, 3333 port
- `src/ai/llm.service.ts` — Provider router, model selection
- `src/ai/context.engine.ts` — Prompt building + memory loading
- `src/chat/chat.controller.ts` — POST /stream endpoint (SSE)
- `src/projects/project.service.ts` — Project CRUD
- `src/documents/document.service.ts` — Document generation

**Frontend (apps/web/):**
- `app/chat/page.tsx` — Main Diana interface
- `components/ChatMessage.tsx` — Message display
- `components/ChatInput.tsx` — User input
- `lib/api.ts` — API client for streaming

**Database (prisma/):**
- `schema.prisma` — 13 Prisma models (users, conversations, projects, etc.)
- `migrations/` — All schema changes version-controlled

---

## PART 12: API Reference (Key Endpoints)

### Authentication

```
POST /api/auth/register
  Params: email, name
  Returns: {user, token}

POST /api/auth/login
  Params: email
  Returns: {user, token}

GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Returns: {user, tier, accounts}
```

### Chat & Diana

```
POST /api/chat/stream
  Headers: Authorization: Bearer <token>
  Params: message, conversationId (optional)
  Returns: SSE stream (text/event-stream)
  Events:
    - chunk {content: string}
    - action {action, result}
    - title {title}
    - done {response}
    - error {message}

POST /api/chat/conversations
  Returns: [{id, title, createdAt}]

GET /api/chat/conversations/:id/messages
  Returns: [{role, content, createdAt}]
```

### Account Management (Dual-Wallet)

```
GET /api/accounts
  Returns: Both accounts (Cash + AIG Cash)
  Response: {
    accounts: [
      {accountType: "cash_account", currency: "EUR", balance: ...},
      {accountType: "aig_cash_account", currency: "AIG$", balance: ...}
    ]
  }

POST /api/accounts/deposit
  Params: amount, paymentMethod
  Note: EUR only → Cash Account

POST /api/accounts/convert
  Params: fromAccountType, toAccountType, amount
  Note: Cash → AIG$ at 1:1 (manual)

GET /api/commissions/breakdown
  Returns: How last commission split 80/20
```

### Marketplace (AIG$ ↔ EUR)

```
GET /api/marketplace/orders
  Params: orderType (buy|sell), status
  Returns: [orders with prices and volumes]

POST /api/marketplace/orders
  Params: orderType, quantity, pricePerUnit
  Returns: Order confirmation

POST /api/marketplace/orders/:id/accept
  Params: acceptQuantity
  Returns: Transaction confirmation
```

### Projects & Documents

```
POST /api/projects
  Params: name, description
  Returns: {id, name, createdAt}

GET /api/projects
  Returns: [projects]

POST /api/documents
  Params: projectId, title, content
  Returns: {id, title, version}

GET /api/documents/:id/versions
  Returns: [all versions with timestamps]
```

---

## PART 13: Deployment & Operations

### Local Development

```bash
# Start infrastructure
docker-compose up -d postgres redis

# Apply migrations
npx prisma migrate dev

# Start API (dev mode)
cd apps/api && npm run dev

# Start Web (dev mode)
cd apps/web && npm run dev

# Both running: http://localhost:3001 (web), http://localhost:3333 (API)
```

### Environment Variables

```env
# Database
DATABASE_URL=postgres://aig:aig@localhost:5432/aig
REDIS_URL=redis://localhost:6379

# API
PORT=3333
NODE_ENV=development

# LLM Provider
LLM_PROVIDER=openai|anthropic|ollama|mock
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_URL=http://localhost:11434

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Production Deployment

- **Container Registry:** Docker images built and pushed
- **Orchestration:** (Kubernetes planned)
- **Database:** Managed PostgreSQL (Heroku, AWS RDS, etc.)
- **Cache:** Managed Redis
- **CDN:** Hetzner edge CDN
- **Monitoring:** Prometheus + Grafana
- **Logging:** (Centralized logging planned)

---

## PART 14: Quality Standards

### Before Every Release

- [ ] Build: TypeScript compiles without errors
- [ ] Lint: No lint errors
- [ ] Tests: All E2E tests pass (17/17 currently)
- [ ] Product: Product Acceptance Test completed
- [ ] Performance: Response time < 200ms (non-streaming)
- [ ] Security: No new OWASP Top 10 issues

### Product Acceptance Test

1. Can a new user register?
2. Does Diana greet them naturally?
3. Can they create a project?
4. Is generated content useful?
5. Can they continue later?
6. Would we show this to a customer?

If any "no" → fix before release.

---

## PART 15: Key Architectural Decisions

### ADR-001: Email-only authentication (MVP)
**Decision:** No password required initially. Email = identity.  
**Status:** Active (v0.1+)

### ADR-002: In-process LLM routing
**Decision:** Provider selection via env vars in LLMService, not separate gateway.  
**Status:** Active

### ADR-003: SSE over WebSockets
**Decision:** Use Server-Sent Events for streaming.  
**Status:** Active

### ADR-004: PostgreSQL primary + Redis cache
**Decision:** PostgreSQL is source of truth. Redis for ephemeral data.  
**Status:** Active

### ADR-005: Monorepo with pnpm
**Decision:** All code in one repository.  
**Status:** Active

### ADR-006: Dual-Account Financial Model
**Decision:** Two accounts per member (Cash + AIG Cash) with automatic 80/20 split.  
**Status:** LOCKED for Phase 1+

### ADR-007: Unilevel MLM (Unlimited Width, Variable Depth)
**Decision:** Width unlimited (no cap on recruits), depth 6-10 levels by tier.  
**Status:** LOCKED for Phase 1+

---

## PART 16: Three Repositories

### 1. aig-platform (Source Code)
- Apps: API, Web
- Services: All business logic
- Database: Prisma schemas
- Tests: E2E coverage
- Docker: Deployment configs

### 2. aig-product (Product Design)
- Chapters 01-13: Complete vision
- Program definitions
- Core services layer
- Sprint planning
- Marketing materials

### 3. ai-docs (Engineering Playbook)
- Architecture decisions
- API documentation
- Deployment guides
- Best practices
- Troubleshooting

---

## PART 17: Timeline 2026-2028

### Q2 2026 (Current)
- ✅ v0.1 — Meet Diana
- ✅ v0.2 — Real Diana
- 🔵 v0.3 — Diana Works (Sprint 3+)

### Q3 2026
- Production stability
- Partner integration
- North Star prototype planning

### Q4 2026
- v1.0 public release
- First paying customers
- Marketplace seed creators

### 2027
- International expansion
- Mobile app launch
- AIOS developer preview
- North Star developer edition

### 2028
- North Star ONE device launch
- Public marketplace launch
- Global scale operations

---

## LOCKED SPECIFICATIONS (Phase 1-4 Immutable)

🔒 **LOCKED:**
- Dual-Account Financial Model (Cash EUR + AIG Cash with 80/20 split)
- Unilevel MLM Structure (Unlimited width, variable 6-10 depth by tier)
- Commission Rates (30/20/15/10/3/2 + 1/0.5/0.5/0.5 for levels 7-10)
- Database Schema (accounts, commissions, marketplace tables)
- API Contracts (all endpoints documented and versioned)
- Technology Stack (Next.js, NestJS, PostgreSQL, Redis, Ollama)
- Diana Personality (direct, helpful, action-oriented)
- Marketplace Mechanism (peer-to-peer, market-driven pricing)

**Any deviation requires:**
- Architecture Council approval
- CFO sign-off (financial impact)
- Legal review (compliance)
- Database migration (data integrity)

---

**Status:** 🔒 LOCKED FOR PHASE 1  
**Last Updated:** 2026-07-07  
**Next Review:** 2026-07-15 (Phase 1 Check-in)  
**Compliance Review:** 2026-07-22 (Quarterly Audit)
