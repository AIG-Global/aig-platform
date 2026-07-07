# Investment Return Flow & Financial Rules
## Automated 80/20 Distribution at Maturity

**Location:** `/architecture/INVESTMENT_RETURN_FLOW.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  
**Date:** 2026-07-07  

---

## Overview

When any investment reaches maturity and returns principal + returns to member account, automatic distribution follows the 80/20 split model:

- **80% → Cash Account (EUR)** - Real money, withdrawable
- **20% → AIG Cash Account (AIG$)** - Internal currency, spendable or exchangeable

This rule applies to **all investment products** regardless of type.

---

## Investment Return Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INVESTMENT MATURITY                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Investment Reaches Maturity Date                           │
│  ├─ Principal: €5,000                                       │
│  ├─ Return: €500 (10% annual return)                        │
│  └─ Total Return Value: €5,500                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                  80/20 SPLIT APPLIED                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  80% → Cash Account (EUR)                                   │
│  ├─ Amount: €4,400 (€5,500 × 0.80)                         │
│  ├─ Credited to: Cash Account                              │
│  ├─ Status: Ready to spend or withdraw                     │
│  └─ Timeline: Instant (automated)                          │
│                                                             │
│  20% → AIG Cash Account (AIG$)                              │
│  ├─ Amount: €1,100 EUR equivalent                          │
│  ├─ Converted at: Current market rate (e.g., 1.05)         │
│  ├─ Credited as: ~1,048 AIG$ (@1.05 rate)                  │
│  ├─ Status: Spendable in ecosystem or exchangeable          │
│  └─ Timeline: Instant (automated)                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   MEMBER BALANCE UPDATE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Before Maturity:                                           │
│  ├─ Cash Account: €10,000                                   │
│  ├─ AIG Cash Account: 2,000 AIG$                            │
│  └─ Investment: €5,500 (in maturity process)                │
│                                                             │
│  After Maturity (Automatic):                                │
│  ├─ Cash Account: €14,400 (+€4,400 from investment)         │
│  ├─ AIG Cash Account: 3,048 AIG$ (+1,048 from investment)   │
│  └─ Investment: Closed/Completed                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Financial Rules

### Rule 1: Automatic Distribution at Maturity

**Trigger:** Investment reaches scheduled maturity date

**Process:**
1. System calculates total return value (principal + interest)
2. Calculate 80% amount (to Cash Account)
3. Calculate 20% amount (to AIG Cash Account)
4. Credit both accounts simultaneously
5. Generate receipt showing:
   - Original investment amount
   - Return earned
   - Total distributed
   - 80/20 breakdown
   - New account balances
6. Send notification to member

**Timing:** Automatic, no member action required

**Irreversible:** Member cannot choose alternative distribution

### Rule 2: Cash Account (80% of Returns)

**Account Type:** Real EUR currency

**Characteristics:**
- Fixed 1:1 exchange rate (never changes)
- Withdrawable to personal bank account
- No volatility
- Settles instantly into member's wallet

**Example:**
```
Investment Maturity: €5,000 + €500 return = €5,500 total
80% Distribution: €5,500 × 0.80 = €4,400 to Cash Account
Member receives: €4,400 EUR (real money)
Can withdraw: Anytime to bank account
Tax implications: Liable for investment income tax
```

### Rule 3: AIG Cash Account (20% of Returns)

**Account Type:** Internal ecosystem currency

**Characteristics:**
- Market-driven exchange rate (varies daily)
- Cannot be directly withdrawn as EUR
- Convertible only through internal marketplace
- Spendable in ecosystem (products, apps, services, competitions)

**Example:**
```
Investment Maturity: €5,000 + €500 return = €5,500 total
20% Distribution: €5,500 × 0.20 = €1,100 EUR equivalent
Current exchange rate: 1 AIG$ = €1.05
Amount credited: 1,100 ÷ 1.05 = ~1,048 AIG$
Member receives: 1,048 AIG$ (internal currency)
Can use for: Ecosystem purchases, competitions, apps
Can exchange: List on exchange to sell to other members
```

### Rule 4: No Member Override

**Policy:** Distribution cannot be overridden by member

**Why?**
- Ensures ecosystem health (20% keeps AIG$ circulating)
- Prevents currency drain
- Creates predictable internal economy
- Enforces business model consistency
- Eliminates support requests for alternate splits

**Enforcement:**
- UI shows "80/20 split (automatic)" - no selection option
- API rejects any custom distribution parameters
- Audit logs show no member-initiated override attempts

### Rule 5: Conversion Rules (Immutable)

```
ALLOWED:
├─ Cash Account (EUR) → AIG Cash Account (AIG$)
│  ├─ Direct conversion at current market rate
│  ├─ Member initiates via UI: "Convert EUR to AIG$"
│  ├─ Select amount in EUR
│  ├─ Receive equivalent in AIG$ at market rate
│  ├─ Settlement: Instant
│  └─ Example: €100 EUR → 105 AIG$ (if rate is 1.05)
│
└─ AIG Cash Account (AIG$) → Cash Account (EUR) VIA MARKETPLACE ONLY
   ├─ Create sell order on internal exchange
   ├─ Other members buy with Cash Account EUR
   ├─ Settlement: EUR to buyer, AIG$ to seller
   ├─ Platform fee: 2% on seller side
   └─ Example: Sell 100 AIG$ → €95 EUR received (after 2% fee)

NOT ALLOWED:
├─ AIG Cash Account (AIG$) → Cash Account (EUR) DIRECT
│  ├─ No "cash-out" feature
│  ├─ No direct withdrawal of AIG$ as EUR
│  ├─ System rejects: "Only through marketplace exchange"
│  └─ Enforces internal circulation requirement
│
└─ Market rate manipulation
   ├─ Rates set by supply/demand only
   ├─ AIG cannot artificially inflate/deflate rates
   ├─ Transparent order book for all trades
   └─ Fair market pricing enforced
```

---

## Investment Product Specifications

### 1.1 Product Types (All Follow 80/20)

```
FIXED RETURN PRODUCTS
├─ Conservative Fund (6% annual)
├─ Growth Fund (10% annual)
├─ Balanced Fund (8% annual)
└─ Tech Fund (12% annual, higher volatility)

VARIABLE RETURN PRODUCTS
├─ Market Index (tracks market, 4-12% annual)
├─ Peer-to-Peer Lending (6-9% annual)
└─ Real Estate Fund (7-11% annual)

LOCKED PRODUCTS
├─ 12-month lock-in (€1,000 minimum)
├─ 24-month lock-in (€5,000 minimum)
├─ 36-month lock-in (€10,000 minimum)
└─ Premium tier only

SUBSCRIPTION PRODUCTS
├─ Recurring monthly investment (€100-€5,000/month)
├─ Auto-reinvest option (compounds)
├─ Each distribution follows 80/20 split
└─ Can modify or cancel anytime
```

**Key Rule:** ALL products, regardless of type, follow 80/20 split on maturity

### 1.2 Return Calculation Examples

```
EXAMPLE 1: Basic Investment
Product: Growth Fund (10% annual)
Investment: €5,000
Term: 12 months
Expected Return: €500
Maturity Date: 2027-07-07

At Maturity:
├─ Total value: €5,500
├─ 80% to Cash: €4,400 EUR (real money)
├─ 20% to AIG$: €1,100 ÷ 1.05 rate = 1,048 AIG$
└─ Distribution status: ✅ Automatically processed

Member Balance Update:
├─ Cash Account before: €10,000
├─ Cash Account after: €14,400 (+€4,400)
├─ AIG Cash before: 2,000 AIG$
├─ AIG Cash after: 3,048 AIG$ (+1,048)
└─ Timestamp: Instant


EXAMPLE 2: Locked Investment
Product: 24-month lock-in (€10,000 minimum, 12% annual)
Investment: €15,000
Term: 24 months
Expected Returns:
├─ Year 1: €1,800
├─ Year 2: €1,800 + compounding
├─ Total: ~€3,792

Year 1 Distribution (Month 12):
├─ Maturity payout: €1,800
├─ 80% to Cash: €1,440
├─ 20% to AIG$: €360 ÷ rate = 343 AIG$
└─ Plus original principal remains locked

Year 2 Distribution (Month 24):
├─ Remaining return: ~€1,992
├─ 80% to Cash: €1,593
├─ 20% to AIG$: €399 ÷ rate = 380 AIG$
├─ PLUS: Original €15,000 principal (80/20):
│  ├─ €12,000 to Cash
│  └─ 3,000 AIG$ to AIG Cash
└─ Total disbursement: €15,033 EUR + 3,723 AIG$


EXAMPLE 3: Monthly Subscription Investment
Product: Auto-invest Balanced Fund (8% annual)
Monthly: €500/month
Duration: 12 months
Projected Returns: €240 total

Each Month Distribution (at month-end):
├─ Month 1 payout: €20 (8% annual ÷ 12)
│  ├─ 80%: €16 to Cash
│  └─ 20%: €4 to AIG$
├─ Month 2 payout: €20.13 (with 1-month compounding)
├─ ... (continues each month)
└─ Total after 12 months: €240 distributed in pieces

Final Balance (12 months):
├─ Original investments returned: €6,000
│  ├─ 80%: €4,800 to Cash
│  └─ 20%: 1,200 AIG$ to AIG Cash
├─ Accumulated returns: €240
│  ├─ 80%: €192 to Cash
│  └─ 20%: 228 AIG$ to AIG Cash
└─ Total received: €4,992 EUR + 1,428 AIG$
```

---

## Tax & Compliance

### Tax Treatment

**Cash Account Returns (80%):**
- Investment income tax applies (varies by jurisdiction)
- 1099 or equivalent reporting (EU: Annex sheets)
- Member responsible for declaring to tax authority
- AIG provides tax documentation annually

**AIG Cash Account Returns (20%):**
- Taxable as income when received
- Additional tax event when converted to EUR via exchange
- Member responsible for tracking basis
- AIG provides complete transaction history

### Audit Trail

**System Records:**
```
Investment {
  id: "inv-12345",
  memberId: "mem-67890",
  amount: 5000,
  currency: "EUR",
  product: "Growth Fund",
  startDate: "2026-07-07",
  maturityDate: "2027-07-07",
  expectedReturn: 500,
  actualReturn: 512.50, // May vary from estimate
  
  // Maturity Processing
  maturityProcessedAt: "2027-07-07T09:00:00Z",
  statusAtMaturity: "matured",
  
  // 80/20 Split
  distribution: {
    totalValue: 5512.50,
    cashAccountAmount: 4410, // 80%
    aigCashEquivalent: 1102.50, // 20% in EUR
    aigCashAmount: 1050, // 1102.50 ÷ 1.05 rate
    exchangeRateUsed: 1.05,
    processedAt: "2027-07-07T09:00:00Z",
    transactionIds: ["txn-c1", "txn-a1"]
  },
  
  // Ledger
  ledgerEntries: [
    {
      account: "cash_account",
      type: "credit",
      amount: 4410,
      description: "Investment maturity 80%"
    },
    {
      account: "aig_cash_account",
      type: "credit",
      amount: 1050,
      description: "Investment maturity 20%"
    }
  ],
  
  // Notification
  notificationSent: true,
  notificationAt: "2027-07-07T09:05:00Z"
}
```

---

## Member Communication

### Notification at Maturity

```
Subject: Your Investment Matured 🎉

Hi [Member Name],

Your investment has reached maturity!

Investment Details:
├─ Product: Growth Fund
├─ Original amount: €5,000
├─ Return: €512.50
├─ Total value: €5,512.50
└─ Maturity date: July 7, 2027

Automatic Distribution (80/20 Split):
├─ 💰 Cash Account: +€4,410 EUR
│  ├─ Real money, ready to withdraw
│  └─ Your new Cash balance: €14,410
│
└─ 💵 AIG Cash Account: +1,050 AIG$
   ├─ Internal currency (at rate 1.05)
   ├─ Spend in ecosystem or exchange to EUR
   └─ Your new AIG Cash balance: 3,050 AIG$

What's Next?
├─ Withdraw EUR to your bank account
├─ Reinvest in another product
├─ Spend AIG$ in the marketplace
├─ Exchange AIG$ back to EUR (on exchange)
└─ View full breakdown [View Details]

Questions? Contact support@aig.com
```

### Dashboard Display

```
Portfolio Overview
─────────────────────────────────────────
Investments: 3 active, 1 completed

COMPLETED (Today)
✅ Growth Fund
   Maturity: 2027-07-07
   Original: €5,000
   Return: €512.50
   Distribution: €4,410 EUR + 1,050 AIG$
   Status: Distributed ✅

ACTIVE
📈 Balanced Fund
   Amount: €2,000
   Expected return: €160 (8% annual)
   Maturity: 2027-12-31
   Status: Earning returns

📊 Market Index
   Amount: €10,000
   Current value: €10,450
   Expected maturity: 2028-07-07
   Status: On track

💰 Tech Fund (Locked)
   Amount: €15,000
   Expected return: €2,100 (14% annual)
   Maturity: 2028-07-07
   Lock expires: Cannot withdraw early
   Status: Locked - earning premium rates
```

---

## Implementation Checklist

- [ ] Investment maturity trigger (scheduled job)
- [ ] 80/20 calculation engine
- [ ] Dual-account credit logic (atomic transaction)
- [ ] Exchange rate lookup at maturity moment
- [ ] Transaction logging for audit trail
- [ ] Notification system (email + in-app)
- [ ] Dashboard update (real-time via event)
- [ ] Tax report generation
- [ ] Error handling (fund shortfall, system errors)
- [ ] Rollback capability (if needed)
- [ ] Testing (all product types, all edge cases)

---

**Status:** 🔒 LOCKED for Phase 1 Implementation

**Related Documents:**
- [COMPENSATION_MEMBERSHIP_SPEC.md](business/COMPENSATION_MEMBERSHIP_SPEC.md#L1254) - Wallet system
- [NETWORK_COMMISSION_REVENUE_MODEL.md](NETWORK_COMMISSION_REVENUE_MODEL.md) - Commission distribution
- [AIOS_MODULE_SYSTEM_ARCHITECTURE.md](AIOS_MODULE_SYSTEM_ARCHITECTURE.md) - Investment Module
