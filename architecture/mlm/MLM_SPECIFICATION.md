# MLM & Growth Platform Specification
## Multi-Level Marketing & Referral System

**Location:** `/architecture/mlm/MLM_SPECIFICATION.md`  
**Status:** 🔒 Locked  
**Compliance:** Varies by jurisdiction - configuration required per market  

---

## Core Concepts

### Referral Tree
```
Sponsor (who referred me)
  └─ Me
      ├─ Downline 1
      ├─ Downline 2
      └─ Downline 3
```

Every user has exactly one sponsor (except root users).

### Rank System
```
Rank 0: Individual       (base level, $0 commission)
Rank 1: Ambassador       (3+ direct members, $X commission)
Rank 2: Director         (20+ total members, $Y commission)
Rank 3: Executive        (100+ total members, $Z commission)
Rank 4: Platinum         (500+ total members, 10% commission)
```

### Commission Structure

**Base Commission:** 10% of member purchases
- When: Every time someone you referred makes a purchase
- Amount: 10% of transaction value
- Frequency: Monthly payout
- Duration: Lifetime on referral

**Rank Bonus:** Additional commission tiers
```
Ambassador (Rank 1):    +5% (total 15%)
Director (Rank 2):      +10% (total 20%)
Executive (Rank 3):     +15% (total 25%)
Platinum (Rank 4):      +20% (total 30%)
```

**Team Bonus:** Group achievement commission
- Trigger: Team reaches monthly revenue target
- Bonus: 5% of team revenue (distributed to leaders)
- Frequency: Monthly if targets met

---

## Compensation Plans

### Plan Configuration
Every plan is parameterized:

```json
{
  "planId": "standard-us",
  "name": "Standard Plan - United States",
  "region": "US",
  "baseCommission": 0.10,
  "rankBonus": {
    "rank1": 0.05,
    "rank2": 0.10,
    "rank3": 0.15,
    "rank4": 0.20
  },
  "teamBonus": 0.05,
  "qualificationThreshold": {
    "rank1": 3,
    "rank2": 20,
    "rank3": 100,
    "rank4": 500
  },
  "compliance": {
    "maxLevels": 2,
    "requiresPersonalVolume": true,
    "limitedIncomeFromPassive": false
  }
}
```

### Plan Variants
- **US Plan** - FTC compliant
- **EU Plan** - GDPR compliant
- **UK Plan** - UK MLM regulations
- **Canada Plan** - Canadian consumer protection
- **Custom Plans** - Per jurisdiction as needed

---

## Wallet System

### User Wallet
```
Balance: $X.XX
├─ Available: $X.XX (can withdraw)
├─ Pending: $X.XX (next payout)
└─ Bonus Pool: $X.XX (team bonus allocation)
```

### Transaction Types
- Referral Commission
- Rank Bonus
- Team Bonus
- Bonus Pool Payout
- Withdrawal
- Reversal (disputed transaction)

### Payout Methods
- Bank transfer
- PayPal
- Stripe
- Check (if requested)

### Payout Schedule
- Monthly (after accounting close)
- Minimum threshold: $50
- Processing time: 5-7 business days

---

## Bonus Engine

### Bonus Types

**Monthly Rank Bonus**
- Trigger: Achieve rank threshold
- Amount: Based on rank
- Timing: Monthly first week
- Duration: While rank maintained

**Performance Bonus**
- Trigger: Team hits revenue target
- Amount: Configurable percentage
- Distributed: To rank leaders
- Frequency: Monthly

**Seasonal Bonus**
- Trigger: Calendar quarter
- Amount: Extra commission
- Dates: Q1, Q2, Q3, Q4
- Duration: Seasonal only

**Milestone Bonus**
- Trigger: Personal achievement
- Amount: One-time bonus
- Examples: First $1K, first 10 members
- Frequency: Once per milestone

---

## Rank Advancement

### Automatic Calculation
1. Count direct referrals
2. Count total organization
3. Calculate monthly volume
4. Check qualification thresholds
5. Update rank if qualified
6. Notify user of advancement
7. Adjust commission tier

### Demotion Policy
- Rank maintained if threshold drops below required
- Notification sent if at risk of demotion
- 30-day grace period before demotion
- Opportunity to re-qualify

---

## Compliance & Auditability

### Income Disclosure
- Publish average earnings by rank
- Show percentage reaching each rank
- Transparent about MLM reality
- Updated quarterly

### Anti-Fraud
- Transaction limits per day
- Verification for large payouts
- Dispute resolution process
- Chargeback handling

### Audit Trail
Every transaction:
- Sponsor ID
- Member ID
- Transaction type
- Amount
- Timestamp
- Status (pending, posted, reversed)

### Tax Reporting
- Generate 1099-NEC (1099-MISC in future)
- Send to IRS
- Available to user for tax planning

---

## Compliance Requirements

### US (FTC Compliance)
- ✅ Income must primarily from sales, not recruitment
- ✅ No purchase requirement to participate
- ✅ No inventory loading
- ✅ Easy exit/return policy
- ✅ Income disclosure statement

### EU (Varying)
- ✅ No "pyramid scheme" structure
- ✅ Transparent compensation
- ✅ No unsustainable promises
- ✅ Consumer protection

### Configuration
Compensation plans are **configurable per jurisdiction** to ensure compliance:
- Different commission rates
- Different rank requirements
- Different bonus structures
- Different income limits

---

## Growth Analytics

### Metrics Tracked
- Total members
- Active members (last 30 days)
- Referral tree depth
- Average team size
- Commission distribution
- Rank distribution
- Revenue per member
- Churn rate

### Dashboard
Affiliate can see:
- My earnings
- My team
- My rank progress
- Performance vs peers
- Growth opportunities

### Leaderboard
- Top earners
- Top recruiters
- Fastest growing
- Highest rated

---

## Anti-Abuse Measures

### Prohibited Behaviors
- ❌ Paying for recruitment (not sales)
- ❌ Inventory loading (buying unsellable stock)
- ❌ False income claims
- ❌ Misleading marketing
- ❌ Circular recruitment

### Detection
- Automated alerts for suspicious patterns
- Manual review if flagged
- Suspension for violations
- Permanent ban for fraud

### Enforcement
- Immediate suspension
- Investigation period
- Appeal process
- Refund policy

---

## Technical Implementation

### Database Schema
```
users
├─ sponsorId (who referred me)
├─ rank (current rank)
├─ joinDate
└─ status (active, suspended, banned)

commissions
├─ userId
├─ type (referral, rank, team, bonus)
├─ amount
├─ sourceId (who it came from)
├─ status (pending, posted, reversed)
└─ timestamp

wallet
├─ userId
├─ balance
├─ available
├─ pending
└─ bonusPool

payouts
├─ walletId
├─ amount
├─ method
├─ status (pending, processing, completed, failed)
└─ timestamp
```

### APIs
- `POST /api/referral/create-link` - Generate referral link
- `GET /api/referral/tree` - My referral tree
- `GET /api/commissions/history` - Commission history
- `GET /api/wallet/balance` - Current wallet
- `POST /api/wallet/request-payout` - Request payout
- `GET /api/rank/progress` - Rank advancement info

---

## Roadmap

### Phase 1 (Week 6-8)
- ✅ Basic referral system
- ✅ Commission calculation
- ✅ Wallet functionality
- ✅ Rank system
- ✅ US plan only

### Phase 2 (Week 9-12)
- ✅ Bonus engine
- ✅ Leaderboard
- ✅ Analytics dashboard
- ✅ Multi-jurisdiction support

### Phase 3 (Post-12)
- ✅ Automated payouts
- ✅ Advanced analytics
- ✅ Compliance automation

---

## Success Metrics

### Growth
- 100 affiliates by Week 12
- 10% of users referred by someone
- 50% affiliate retention

### Revenue
- $500 commission paid by Week 12
- $50K total affiliate payouts by Week 24
- 20% of platform revenue from referrals

### Compliance
- 100% plan compliance by market
- Zero FTC complaints
- Clean audit trail

---

**Status:** 🔒 Locked  
**Compliance Review Required:** Before Phase 1 launch  
**Jurisdiction:** Configuration per market
