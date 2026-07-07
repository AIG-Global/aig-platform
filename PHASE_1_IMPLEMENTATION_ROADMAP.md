# PHASE 1 IMPLEMENTATION ROADMAP
## AIG Ecosystem - Monday 2026-07-07 to Friday 2026-07-25 (4 weeks)

**Status:** ✅ LOCKED - All foundational specifications finalized and committed to GitHub

---

## EXECUTIVE SUMMARY

Phase 1 transforms locked architectural specifications into production-ready core platform:
- **Week 1:** Database schema, authentication, core entities
- **Week 2:** Membership system, dual-account wallet, basic commissions
- **Week 3:** Advanced wallet features, marketplace order system
- **Week 4:** Investment services backend, API completion

**Critical Path:** Database → Auth → Accounts → Commissions → Everything else depends on these

---

## PHASE 1 CRITICAL SPECIFICATIONS REFERENCE

### Source Documents (All Locked)
1. [/architecture/COMPLETE_ECOSYSTEM_REFERENCE.md](architecture/COMPLETE_ECOSYSTEM_REFERENCE.md) - Master reference (17 parts, 2,000+ lines)
2. [/architecture/business/COMPENSATION_MEMBERSHIP_SPEC.md](architecture/business/COMPENSATION_MEMBERSHIP_SPEC.md) - Full business model (2,600+ lines)
3. [/architecture/ENGINEERING_HANDBOOK.md](architecture/ENGINEERING_HANDBOOK.md) - Code standards & PR checklist
4. [/architecture/README.md](architecture/README.md) - Architecture index

### Key Business Rules (NO EXCEPTIONS)
- ✅ Dual-account structure (exactly 2 accounts per member: Cash EUR + AIG$ - IMMUTABLE)
- ✅ Auto 80/20 commission split (80% Cash Account EUR, 20% AIG Cash Account AIG$)
- ✅ 5 membership tiers with variable commission depth (Free: 0, Starter: 6, Professional: 7, Business: 9, Platinum: 10)
- ✅ Unilevel MLM (unlimited width, variable depth by tier)
- ✅ Three currency conversion paths:
  1. External deposits → Cash Account EUR
  2. Manual 1:1 conversion Cash → AIG$ (fixed rate)
  3. Peer-to-peer marketplace AIG$ ↔ EUR (market prices, 2% seller fee)
- ✅ Complete transaction audit trail (30+ types, immutable, ACID compliant)

---

## WEEK 1: FOUNDATION (Database, Auth, Core Entities)

### Task 1.1: Expand Prisma Schema - Core Platform Tables
**Dependency:** None (parallel with Task 1.2)
**Estimated:** 8-12 hours
**Owner:** Database engineer

#### What to build:
```prisma
// 1. Membership & Account Tier System
model Tier
  - id, name, price_eur, commission_depth, features_json

model Member
  - id, email, tier_id, status (active/suspended/deleted)
  - downline_member_id (for MLM structure)
  - joined_at, suspended_at, created_at

// 2. Dual-Account Wallet (IMMUTABLE - exactly 2 per member)
model Account
  - id, member_id, currency (EUR/AIG), balance_decimal
  - account_type (cash_account/aig_cash_account)
  - created_at (never deleted, deactivated flag if needed)
  - CONSTRAINT: exactly 2 rows per member_id (one EUR, one AIG)

// 3. Commission Engine
model Commission
  - id, from_member_id, to_member_id, level, tier_at_time
  - amount_cash_account_eur, amount_aigcash_account, total_usd_equivalent
  - source_type (direct_sale, downline_commission, bonus)
  - created_at

// 4. Transaction Audit Trail (30+ types)
model AuditTransaction
  - id, member_id, transaction_type (enum: deposit, withdrawal, commission, conversion, transfer, marketplace_buy, marketplace_sell, etc.)
  - amount_eur, amount_aig, amount_usd_equivalent
  - from_account_id, to_account_id
  - reference_id (links to specific transaction), status (pending/completed/failed)
  - metadata_json, created_at

// 5. Marketplace (WDM)
model MarketplaceOrder
  - id, seller_member_id, buyer_member_id, pair (AIG_EUR or EUR_AIG)
  - price_per_unit_eur, quantity_aig, status (open/filled/cancelled)
  - created_at, filled_at

model MarketplaceTransaction
  - id, order_id, seller_member_id, buyer_member_id
  - amount_aig, amount_eur, seller_fee_aig (2%)
  - completed_at

// 6. Investment Services
model InvestmentPosition
  - id, member_id, asset_class (tag_markets/crypto/funds/aigphone_equity/aigio_tokens)
  - holdings_amount, cost_basis_eur, current_value_eur
  - last_updated

model AIGPhoneShares
  - id, member_id, shares_owned, cost_per_share_eur
  - vesting_status, cap_table_position

model AIGIOTokens
  - id, member_id, tokens_held, purchase_price_eur, staking_status
  - apy_percentage, last_staking_reward_at
```

**Deliverables:**
- [ ] 13+ normalized tables with proper indexes
- [ ] Foreign key constraints with cascade rules
- [ ] ACID compliance validation
- [ ] Migration scripts generated
- [ ] Database seeding scripts for testing data

---

### Task 1.2: Complete Authentication & Authorization Layer
**Dependency:** None (parallel with Task 1.1)
**Estimated:** 6-8 hours
**Owner:** Security/auth engineer

#### What to build:
- [ ] JWT token generation & validation (RS256 algorithm)
- [ ] Refresh token rotation mechanism
- [ ] Password hashing (bcrypt, min 12 rounds)
- [ ] 2FA setup (TOTP - Google Authenticator)
- [ ] Session management (Redis-backed)
- [ ] Role-based access control (RBAC):
  - `admin` - Full platform access
  - `member` - Personal account access only
  - `support` - Limited read/escalation access
- [ ] Guard decorators for NestJS routes
- [ ] Request logging & security monitoring

**Endpoints to create:**
- POST `/auth/register` - Create new account
- POST `/auth/login` - Generate JWT + refresh token
- POST `/auth/refresh` - Rotate refresh token
- POST `/auth/2fa/setup` - Enable 2FA
- POST `/auth/2fa/verify` - Verify TOTP code
- POST `/auth/logout` - Revoke tokens

**Deliverables:**
- [ ] Auth module fully functional
- [ ] 6 authentication endpoints
- [ ] Security tests (no SQLi, XSS, CSRF)
- [ ] Rate limiting on login (5 attempts/15min)

---

### Task 1.3: Member Registration & Onboarding Flow
**Dependency:** Tasks 1.1 + 1.2 complete
**Estimated:** 4-6 hours
**Owner:** Backend engineer

#### What to build:
```
Flow: POST /members/register → creates user + automatically creates 2 accounts
1. Validate email (unique)
2. Hash password (bcrypt)
3. Create Member record (status: active, tier: Free initially)
4. **CRITICAL**: Create exactly 2 Account records:
   - Account 1: type=cash_account, currency=EUR, balance=0
   - Account 2: type=aig_cash_account, currency=AIG, balance=0
5. Return JWT + member profile
```

**Endpoints:**
- POST `/members/register` - New member signup
- GET `/members/{id}` - Get member profile
- GET `/members/{id}/accounts` - Get both accounts (should always return exactly 2)
- PUT `/members/{id}` - Update profile

**Validation:**
- [ ] Email format validation
- [ ] Password strength (min 12 chars, mix of upper/lower/numbers/symbols)
- [ ] Downline member invitation (optional sponsor_member_id)
- [ ] Terms acceptance

**Deliverables:**
- [ ] Registration endpoint
- [ ] 4 member endpoints
- [ ] Automatic dual-account creation
- [ ] Email verification (optional for MVP)

---

### Task 1.4: Membership Tier & Upgrade System
**Dependency:** Tasks 1.1 + 1.2 complete
**Estimated:** 5-7 hours
**Owner:** Backend engineer

#### What to build:
Tiers (locked in specifications):
```
Free        - €0/month        - Commission depth: 0 (no commissions)
Starter     - €399/month      - Commission depth: 6 levels
Professional - €699/month     - Commission depth: 7 levels
Business    - €1,099/month    - Commission depth: 9 levels
Platinum    - €2,999/month    - Commission depth: 10 levels
```

**Endpoints:**
- GET `/tiers` - List all available tiers
- POST `/members/{id}/upgrade-tier` - Upgrade membership
- GET `/members/{id}/tier-benefits` - Show what's included
- POST `/members/{id}/downgrade-tier` - Downgrade (if allowed)

**Business Logic:**
- Tier changes effective immediately
- Commission depth applies retrospectively to new downlines
- Existing downlines keep their original commission rate
- Tier benefits stored in Tier.features_json

**Deliverables:**
- [ ] 4 tier endpoints
- [ ] Tier validation & availability
- [ ] Audit trail for tier changes

---

## WEEK 2: MEMBERSHIP & FINANCIAL SYSTEM

### Task 2.1: Commission Engine (Core MLM Algorithm)
**Dependency:** Tasks 1.1 + 1.4 complete
**Estimated:** 10-12 hours
**Owner:** Core algorithm engineer (CRITICAL PATH)

#### What to build:
**Formula per specification:**
```
For level N (1-10):
- Commission % by level: 30%, 20%, 15%, 10%, 3%, 2%, 1%, 0.5%, 0.5%, 0.5%
- Tier-specific depth limits:
  * Free: 0 levels (no commissions)
  * Starter: 6 levels
  * Professional: 7 levels
  * Business: 9 levels
  * Platinum: 10 levels

Auto 80/20 split (IMMUTABLE - NO EXCEPTIONS):
- 80% goes to Cash Account (EUR) → Cash Account balance
- 20% goes to AIG Cash Account (AIG$) → AIG Cash Account balance
- Conversion: EUR to AIG$ at market rate for accounting purposes
```

**Algorithm:**
```typescript
function calculateCommissions(transaction: Transaction) {
  1. Get member's downline structure (MLM tree)
  2. For each downline member at level 1-10:
     a. Check if member's tier allows commission at this level
     b. If yes: calculate commission % (see table above)
     c. Calculate total: transaction_amount * commission_percent
     d. Split: 80% EUR → Cash Account, 20% AIG → AIG$ Account
     e. Create Commission record
     f. Debit from Company AIG Cash Account (holds commissions)
     g. Create 2 AuditTransaction records (one per account affected)
  3. Handle tier changes mid-payout
  4. Return commission summary
}
```

**Endpoints:**
- POST `/commissions/calculate` - Calculate for test transaction
- GET `/members/{id}/commissions` - List member's received commissions
- GET `/members/{id}/downline-commissions` - Breakdown by downline level
- GET `/admin/commission-audit` - Verify all commissions calculated

**Testing:**
- [ ] Test with Free tier (0 commissions)
- [ ] Test with each tier (Starter through Platinum)
- [ ] Test tier changes mid-payout
- [ ] Test 80/20 split accuracy
- [ ] Test with 10-level deep tree
- [ ] Verify audit trail completeness

**Deliverables:**
- [ ] Commission calculation engine
- [ ] 4 commission endpoints
- [ ] 100% test coverage for algorithm
- [ ] Complete audit trail generation

---

### Task 2.2: Dual-Account Wallet Management
**Dependency:** Tasks 1.1 + 1.3 complete
**Estimated:** 8-10 hours
**Owner:** Backend engineer

#### What to build:
**Constraints (LOCKED):**
- Exactly 2 accounts per member (EUR + AIG$)
- Never delete accounts (deactivate if needed)
- Cash Account EUR: Fixed 1:1 exchange rate with deposits
- AIG Cash Account AIG$: Market-driven value (updated externally)

**Endpoints:**
- GET `/accounts/{id}` - Get single account balance
- GET `/members/{id}/accounts` - Get both accounts for member (should always return 2)
- GET `/members/{id}/accounts/summary` - Total EUR equivalent of both
- POST `/accounts/{id}/deposit` - Add EUR to Cash Account
- POST `/accounts/{id}/convert-cash-to-aig` - 1:1 manual conversion (Cash → AIG$)
- GET `/accounts/{id}/transactions` - Transaction history

**Business Logic:**
- Deposits → Cash Account only (EUR)
- Manual conversion: 1 EUR = 1 AIG$ (fixed, locked rate)
- Marketplace conversion: AIG$ ↔ EUR at market prices (Task 3.x)
- All transactions create AuditTransaction records

**Validation:**
- [ ] Prevent duplicate accounts per member
- [ ] Validate conversion amounts
- [ ] Check sufficient balance before debit
- [ ] Prevent negative balances

**Deliverables:**
- [ ] 6 account endpoints
- [ ] Balance calculation accuracy
- [ ] Transaction history
- [ ] Audit trail for all movements

---

### Task 2.3: Direct Sales & First Commission Flow
**Dependency:** Tasks 2.1 + 2.2 complete
**Estimated:** 6-8 hours
**Owner:** Backend engineer

#### What to build:
**Scenario:** Member A (Starter tier) recruits Member B and processes first sale

```
Flow:
1. POST /sales/create - Record sale transaction
2. System calculates commissions automatically:
   - Member A gets 30% of sale (level 1)
   - If Member A has sponsor (Member C), Member C gets 20% of sale (level 2)
   - Continue to level 6 (Starter tier limit)
3. 80/20 split applied automatically
4. All parties' accounts updated
5. AuditTransaction created for each account movement
```

**Endpoints:**
- POST `/sales/create` - Record sale transaction
- GET `/members/{id}/sales-history` - Member's sales as seller
- GET `/members/{id}/commission-history` - Commissions received
- GET `/admin/daily-commission-report` - Daily summary

**Test Case:**
```
Setup: 3 members (A: Platinum tier, B: Professional tier, C: Free tier)
A → B → C (MLM hierarchy)

Sale: C makes €100 purchase
Expected commissions:
- B gets: €100 × 20% = €20 (level 2)
  Split: €16 Cash EUR → B's Cash Account, €4 AIG$ → B's AIG Account
  But B is tier Professional (depth 7), so can receive from level 2
  
- A gets: €100 × 15% = €15 (level 3)
  Split: €12 Cash EUR → A's Cash Account, €3 AIG$ → A's AIG Account
  A is Platinum (depth 10), so can receive from level 3

- C gets: €100 (original purchase becomes commission if C is seller? or just member purchase)
```

**Deliverables:**
- [ ] 4 sales & commission endpoints
- [ ] Commission calculation verified
- [ ] Full audit trail
- [ ] Test scenarios passing

---

## WEEK 3: MARKETPLACE & ADVANCED WALLET

### Task 3.1: Marketplace Order System
**Dependency:** Tasks 1.1 + 2.2 complete
**Estimated:** 10-12 hours
**Owner:** Marketplace engineer

#### What to build:
**Order Types:**
1. **Sell AIG$ for EUR** - Member offers AIG$ at specific EUR price
2. **Buy AIG$ with EUR** - Member offers EUR for AIG$ at specific price

**Endpoints:**
- POST `/marketplace/orders/create` - Create buy/sell order
- GET `/marketplace/orders` - List all open orders
- GET `/marketplace/orders/{id}` - Get order details
- POST `/marketplace/orders/{id}/cancel` - Cancel order
- POST `/marketplace/orders/{id}/accept` - Accept/fill order
- GET `/members/{id}/orders` - Member's orders (open + history)

**Order Matching Algorithm:**
```
When new order created:
1. Check if any open orders match (opposite side, compatible price)
2. If match found:
   a. Calculate transaction: amount * price
   b. Transfer AIG$ from seller's AIG Account to buyer
   c. Transfer EUR from buyer's Cash Account to seller
   d. Calculate fee: 2% of amount paid (seller pays)
   e. Update both member balances
   f. Create MarketplaceTransaction record
   g. Create 4 AuditTransaction records (2 per member)
3. If no match, keep order open (market order book)
```

**Constraints:**
- Seller pays 2% fee on AIG$ amount
- No fees on EUR side
- Market prices set by supply/demand
- Members can place limit orders
- Minimum order size: 10 AIG$

**Test Cases:**
- [ ] Buy order matches with existing sell order
- [ ] Sell order matches with existing buy order
- [ ] Partial fill scenarios
- [ ] Fee calculation (2% seller)
- [ ] Cancelled orders
- [ ] Order history retrieval

**Deliverables:**
- [ ] 6 marketplace endpoints
- [ ] Order matching algorithm
- [ ] Fee calculation & tracking
- [ ] Complete transaction audit

---

### Task 3.2: Member-to-Member Instant Transfers
**Dependency:** Tasks 2.2 + 2.3 complete
**Estimated:** 4-6 hours
**Owner:** Backend engineer

#### What to build:
**Feature:** Members can send EUR or AIG$ directly to other members (free, no platform fee)

**Endpoints:**
- POST `/transfers/send-eur` - Send EUR from Cash Account to another member
- POST `/transfers/send-aig` - Send AIG$ from AIG Account to another member
- GET `/members/{id}/transfers-sent` - History of transfers sent
- GET `/members/{id}/transfers-received` - History of transfers received

**Business Logic:**
```
Transfer EUR:
1. Verify sender has sufficient EUR in Cash Account
2. Debit sender's Cash Account
3. Credit receiver's Cash Account
4. Create AuditTransaction (type: transfer)
5. No fee charged

Transfer AIG$:
Same as above but using AIG Cash Accounts
```

**Validation:**
- [ ] Sender has sufficient balance
- [ ] Receiver exists
- [ ] Minimum transfer: 1 EUR or 1 AIG$
- [ ] Maximum transfer: 100,000 per day (configurable)
- [ ] Prevent self-transfers

**Deliverables:**
- [ ] 4 transfer endpoints
- [ ] Balance validation
- [ ] Audit trail
- [ ] Transaction limits

---

### Task 3.3: Gift Cards & Special Promotions
**Dependency:** Tasks 2.2 + 3.1 complete
**Estimated:** 6-8 hours
**Owner:** Backend engineer (optional for Week 3 if time permits)

**Endpoints:**
- POST `/gift-cards/create` - Create gift card from member's account
- POST `/gift-cards/{code}/redeem` - Redeem gift card
- GET `/gift-cards/{code}` - Check gift card balance
- GET `/members/{id}/gift-cards-created` - Member's created cards
- GET `/members/{id}/gift-cards-received` - Member's received cards

**Features:**
- Send EUR or AIG$ as gift card
- Share code with anyone (redeemable by code alone)
- Expiry options (30/60/90 days)
- Recipient tracking

---

## WEEK 4: INVESTMENT SERVICES & API COMPLETION

### Task 4.1: Investment Services Backend Foundation
**Dependency:** Tasks 1.1 + 2.2 complete
**Estimated:** 12-16 hours
**Owner:** Investment platform engineer

#### What to build:
**5 Asset Classes:**

1. **Tag Markets** (Prediction markets)
   - Topics: Sports, Politics, Finance, Entertainment
   - Buy/sell YES/NO shares at market prices
   - Endpoint: GET `/investments/markets` - List available markets
   - Endpoint: POST `/investments/markets/{id}/buy` - Buy shares
   - Endpoint: GET `/members/{id}/investments` - Portfolio view

2. **Cryptocurrency** (via exchange APIs)
   - Bitcoin, Ethereum, 10+ altcoins
   - Deposit/withdraw crypto
   - Buy/sell via integrated exchange
   - Endpoints: GET `/crypto/prices`, POST `/crypto/buy`, GET `/members/{id}/crypto-holdings`

3. **Investment Funds** (Passive index funds)
   - AIGINVEST Global Fund (80/20 stocks/bonds)
   - AIGINVEST Growth Fund (95/5 growth focus)
   - AIGINVEST Emerging Fund (EM focused)
   - Monthly rebalancing
   - Endpoints: GET `/funds`, POST `/funds/{id}/invest`, GET `/funds/{id}/holdings`

4. **AIGPHONE Equity** (Startup shares)
   - Cap table: 30% members, 25% team, 35% VCs, 10% employees
   - Members can buy shares (vesting: 4 years)
   - Quarterly updates on company valuation
   - Endpoints: GET `/aigphone/shares`, POST `/aigphone/buy-shares`, GET `/members/{id}/aigphone-holdings`

5. **AIGIO Tokens** (Platform token)
   - Token economics: 1B total supply, members hold 30%
   - Staking: 10-15% APY
   - Rewards: Weekly staking rewards
   - Endpoints: GET `/aigio/stats`, POST `/aigio/stake`, GET `/members/{id}/aigio-holdings`

**Endpoints (15 total):**
```
Markets:
GET    /investments/markets
POST   /investments/markets/{id}/buy
POST   /investments/markets/{id}/sell
GET    /investments/markets/{id}/portfolio

Crypto:
GET    /crypto/prices
POST   /crypto/buy
POST   /crypto/sell
GET    /members/{id}/crypto-holdings

Funds:
GET    /funds
POST   /funds/{id}/invest
GET    /funds/{id}/portfolio
GET    /members/{id}/fund-holdings

Equity:
GET    /aigphone/shares
POST   /aigphone/buy-shares
GET    /members/{id}/aigphone-holdings

Tokens:
GET    /aigio/stats
POST   /aigio/stake
GET    /members/{id}/aigio-holdings
POST   /aigio/claim-rewards
```

**External Integrations (to implement):**
- Tag Markets API
- Cryptocurrency exchange (Kraken, Binance, Coinbase)
- Fund data provider

**Deliverables:**
- [ ] 20+ investment endpoints
- [ ] Portfolio calculation
- [ ] Price feed integration
- [ ] Transaction history
- [ ] Full audit trail

---

### Task 4.2: WDM Marketplace Backend
**Dependency:** Tasks 1.1 + 3.1 complete
**Estimated:** 10-12 hours
**Owner:** Marketplace engineer

#### What to build:
**18 Product Categories:**
- Physical goods (electronics, books, home)
- Digital products (courses, software, ebooks)
- Services (consulting, design, development)
- Crypto/investments (trading pairs, NFTs)
- Experiences (events, travel, dining)

**Seller Program (5 tiers):**
- New Seller: 0-10 products
- Active: 11-100 products
- Pro: 101-500 products
- Platinum: 500+ products
- Enterprise: Custom

**Endpoints:**
- GET `/wdm/categories` - List 18 categories
- POST `/wdm/products/create` - List product for sale
- GET `/wdm/products` - Browse marketplace
- POST `/wdm/products/{id}/buy` - Purchase product
- GET `/wdm/orders/{id}` - Order status
- GET `/members/{id}/seller-dashboard` - Sales history
- POST `/wdm/sellers/{id}/affiliate-link` - Generate affiliate link
- GET `/wdm/sellers/{id}/stats` - Seller performance

**Features:**
- Product reviews/ratings
- Seller verification
- Dispute resolution
- Affiliate commissions (5% of sale)
- Fulfillment tracking

**Deliverables:**
- [ ] 8+ marketplace endpoints
- [ ] Category management
- [ ] Product listing & search
- [ ] Order fulfillment
- [ ] Seller dashboard

---

### Task 4.3: Comprehensive API Testing & Documentation
**Dependency:** All Week 1-4 tasks complete
**Estimated:** 6-8 hours
**Owner:** QA engineer

**Test Coverage:**
- [ ] All 100+ endpoints functional
- [ ] Happy path scenarios
- [ ] Error scenarios (invalid input, insufficient balance, etc.)
- [ ] Authorization checks (can't access other member's data)
- [ ] Audit trail verification (all transactions logged)
- [ ] Commission calculation accuracy (multiple test trees)
- [ ] Database integrity (no orphaned records)
- [ ] Performance (response time < 200ms for 95th percentile)

**Documentation:**
- [ ] OpenAPI/Swagger schema for all endpoints
- [ ] Request/response examples
- [ ] Error codes & meanings
- [ ] Rate limiting documentation
- [ ] Authentication flow diagram

**Load Testing:**
- [ ] 1,000 concurrent members
- [ ] Commission calculations for 10-level trees
- [ ] Marketplace order matching (10+ orders/sec)

---

### Task 4.4: Integration & Deployment Readiness
**Dependency:** Tasks 4.1-4.3 complete
**Estimated:** 4-6 hours
**Owner:** DevOps engineer

**Pre-deployment checklist:**
- [ ] Database backups automated (daily)
- [ ] Error logging & monitoring (Sentry)
- [ ] Performance monitoring (New Relic or similar)
- [ ] Security scan (OWASP Top 10)
- [ ] Load testing passed
- [ ] Disaster recovery plan
- [ ] Rollback strategy documented
- [ ] Production environment configured
- [ ] SSL/TLS certificates
- [ ] CDN configured
- [ ] Email service configured (SendGrid)
- [ ] SMS service (Twilio) for 2FA

---

## DEPENDENCIES & CRITICAL PATH

```
Critical Path (must complete in order):
1.1 (Database) → 1.3 (Registration)
           ↓
1.2 (Auth) → 1.4 (Tiers)
           ↓
2.1 (Commission Engine) ← CRITICAL PATH BLOCKER
           ↓
2.2 (Wallet) → 2.3 (Direct Sales)
           ↓
3.1 (Marketplace) → 3.2 (Transfers) → 3.3 (Gift Cards)
           ↓
4.1 (Investments) ← Week 4 start
4.2 (WDM)
4.3 (Testing)
4.4 (Deployment)
```

---

## DAILY STANDUPS (Mon-Fri, 4 weeks)

**Format:** 15 minutes, same time daily (9:00 AM)

**Questions:**
1. What did you complete yesterday?
2. What are you working on today?
3. What blockers do you have?

**Friday Review:** Demo completed work to team

---

## SUCCESS CRITERIA FOR PHASE 1 COMPLETION

✅ **Week 1 Exit Criteria:**
- [ ] 13+ database tables created & migrated
- [ ] Auth system operational (register/login/2FA)
- [ ] Members can create accounts (auto dual-account creation)
- [ ] Membership tiers visible & upgradeable

✅ **Week 2 Exit Criteria:**
- [ ] Commission engine calculating correctly (verified with test scenarios)
- [ ] Wallet shows correct balances
- [ ] Transfers working (no fees)
- [ ] Basic MLM tree structure working

✅ **Week 3 Exit Criteria:**
- [ ] Marketplace orders matching correctly
- [ ] 2% seller fee calculated accurately
- [ ] Instant transfers between members working
- [ ] Transaction history complete

✅ **Week 4 Exit Criteria (Friday End-of-Day)**
- [ ] All 100+ API endpoints implemented
- [ ] Investment services backend complete
- [ ] WDM marketplace backend complete
- [ ] Complete test coverage (unit + integration)
- [ ] Ready for Phase 2 (frontend UI development)

---

## TEAM ALLOCATION

**Recommended Team Size: 6-8 developers**

- **Database/Infrastructure:** 1 person (Tasks 1.1, 4.4)
- **Authentication/Security:** 1 person (Task 1.2)
- **Core Platform (Accounts/Members):** 2 people (Tasks 1.3-1.4, 2.2-2.3)
- **Commission Engine:** 1 person (Task 2.1 - CRITICAL)
- **Marketplace:** 2 people (Tasks 3.1-3.3, 4.2)
- **Investment Services:** 1 person (Task 4.1)
- **QA/Testing:** 1 person (concurrent, Task 4.3 full-time end of week)

---

## RESOURCES & REFERENCES

**Locked Specifications:**
- [COMPLETE_ECOSYSTEM_REFERENCE.md](architecture/COMPLETE_ECOSYSTEM_REFERENCE.md)
- [COMPENSATION_MEMBERSHIP_SPEC.md](architecture/business/COMPENSATION_MEMBERSHIP_SPEC.md)
- [ENGINEERING_HANDBOOK.md](architecture/ENGINEERING_HANDBOOK.md)

**Code Standards:**
- 10-point PR checklist (ENGINEERING_HANDBOOK.md)
- API versioning (v1, v2 planned)
- Database naming conventions (camelCase columns, snake_case tables)
- TypeScript strict mode enabled
- 100% type coverage (no `any`)

**External APIs to Integrate:**
- Tag Markets prediction market API
- Cryptocurrency exchange (TBD: Kraken/Binance/Coinbase)
- Fund data provider
- Email service (SendGrid)
- SMS service (Twilio)

---

## NOTES FOR ENGINEERING TEAM

1. **The 80/20 split is non-negotiable** - Hard-coded into commission engine with no exceptions
2. **Dual-account structure is immutable** - Exactly 2 accounts per member, never delete
3. **Audit trail is compliance-critical** - Every transaction must create AuditTransaction record
4. **Database is source of truth** - Redis is only for sessions & caching
5. **Specification updates are locked** - No changes to Phase 1 work without Architecture approval
6. **Test everything with real money scenarios** - Use realistic EUR amounts in tests
7. **Performance matters** - Marketplace order matching must handle 100+ orders/sec

---

**Phase 1 Ready to Launch: Monday 2026-07-07, 9:00 AM**
**All Specifications Locked as of: 2026-07-07**
**Last Updated:** 2026-07-07 (Commit: d2db4ad)
