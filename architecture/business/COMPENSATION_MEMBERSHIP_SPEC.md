# AIGINVEST Compensation & Membership Master Specification
## Complete Business Model Definition & Implementation Blueprint

**Location:** `/architecture/business/COMPENSATION_MEMBERSHIP_SPEC.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  
**Last Updated:** 2026-07-07  

---

## Executive Summary

This document defines the complete business model of AIGINVEST:

- **4 membership tiers** with progressive capabilities
- **6-level unilevel commission** structure (80% network distribution)
- **AIG Cash economy** as internal currency
- **Ownership tokens** as equity stake mechanism
- **Configurable compensation plans** per jurisdiction
- **20+ API endpoints** for all business operations
- **Real-time analytics** for all stakeholders

**Single Source of Truth:** Every implementation (backend, frontend, mobile, reports) derives from this specification alone.

---

## Part 1: Membership System

### 1.1 Membership Tiers

```json
{
  "tiers": [
    {
      "id": "tier_free",
      "name": "Free",
      "price": 0,
      "currency": "EUR",
      "billingCycle": null,
      "description": "Explore with limited features",
      "targetUser": "Evaluator",
      "sortOrder": 1
    },
    {
      "id": "tier_starter",
      "name": "Starter",
      "price": 399,
      "currency": "EUR",
      "billingCycle": "annual",
      "description": "Full access to core apps",
      "targetUser": "Individual contributor",
      "sortOrder": 2,
      "tags": ["individual", "network_eligible"]
    },
    {
      "id": "tier_professional",
      "name": "Professional",
      "price": 699,
      "currency": "EUR",
      "billingCycle": "annual",
      "description": "Team capabilities unlocked",
      "targetUser": "Team leader",
      "sortOrder": 3,
      "tags": ["team", "network_eligible", "recruiting"]
    },
    {
      "id": "tier_business",
      "name": "Business",
      "price": 1099,
      "currency": "EUR",
      "billingCycle": "annual",
      "description": "Enterprise features",
      "targetUser": "Business owner",
      "sortOrder": 4,
      "tags": ["enterprise", "network_eligible", "recruiting", "resale"]
    },
    {
      "id": "tier_platinum",
      "name": "Platinum",
      "price": 2999,
      "currency": "EUR",
      "billingCycle": "annual",
      "description": "Complete platform access",
      "targetUser": "Executive/Investor",
      "sortOrder": 5,
      "tags": ["elite", "network_eligible", "recruiting", "resale", "executive"]
    }
  ]
}
```

### 1.2 Package Benefits Matrix

```json
{
  "packageBenefits": [
    {
      "benefitId": "app_access_tier1",
      "name": "Tier 1 App Access",
      "description": "Core communication & identity apps",
      "apps": ["ask", "translate", "me", "secure-sign", "record"],
      "includedIn": ["free", "tier_starter", "tier_professional", "tier_business", "tier_platinum"],
      "priority": 10
    },
    {
      "benefitId": "app_access_tier2",
      "name": "Tier 2 App Access",
      "description": "Business intelligence apps",
      "apps": ["business-weather", "news", "investor-alerts", "helo"],
      "includedIn": ["tier_starter", "tier_professional", "tier_business", "tier_platinum"],
      "priority": 20
    },
    {
      "benefitId": "app_access_tier3",
      "name": "Tier 3 App Access",
      "description": "Growth & engagement apps",
      "apps": ["moneygames"],
      "includedIn": ["tier_professional", "tier_business", "tier_platinum"],
      "priority": 30
    },
    {
      "benefitId": "storage_quota",
      "name": "Storage Quota",
      "values": {
        "free": "100 MB",
        "tier_starter": "1 GB",
        "tier_professional": "10 GB",
        "tier_business": "100 GB",
        "tier_platinum": "Unlimited"
      },
      "priority": 40
    },
    {
      "benefitId": "diana_access",
      "name": "Diana AI Assistant",
      "values": {
        "free": "Basic (3 queries/day)",
        "tier_starter": "Standard (50 queries/day)",
        "tier_professional": "Premium (500 queries/day)",
        "tier_business": "Enterprise (5,000 queries/day)",
        "tier_platinum": "Executive (Unlimited + API access)"
      },
      "priority": 50
    },
    {
      "benefitId": "support_level",
      "name": "Support",
      "values": {
        "free": "Community forum only",
        "tier_starter": "Email (48h response)",
        "tier_professional": "Email (24h response)",
        "tier_business": "Priority (8h response + phone)",
        "tier_platinum": "24/7 + dedicated manager"
      },
      "priority": 60
    },
    {
      "benefitId": "team_members",
      "name": "Team Members",
      "values": {
        "free": "1",
        "tier_starter": "1",
        "tier_professional": "5",
        "tier_business": "25",
        "tier_platinum": "Unlimited"
      },
      "priority": 70
    },
    {
      "benefitId": "api_access",
      "name": "API Access",
      "values": {
        "free": "None",
        "tier_starter": "Read-only",
        "tier_professional": "Basic (10k calls/month)",
        "tier_business": "Standard (100k calls/month)",
        "tier_platinum": "Unlimited + webhooks"
      },
      "priority": 80
    },
    {
      "benefitId": "marketplace_revenue_share",
      "name": "Marketplace Revenue Share",
      "values": {
        "free": "N/A",
        "tier_starter": "N/A",
        "tier_professional": "25% developer share (apps)",
        "tier_business": "30% developer share (apps)",
        "tier_platinum": "35% developer share (apps)"
      },
      "priority": 90
    },
    {
      "benefitId": "mlm_capabilities",
      "name": "MLM/Referral Capabilities",
      "description": "Unilevel system: unlimited width (recruits), variable depth (commission levels)",
      "values": {
        "free": "None (cannot recruit)",
        "tier_starter": "Unlimited recruits, 6-level commission depth",
        "tier_professional": "Unlimited recruits, 7-level commission depth",
        "tier_business": "Unlimited recruits, 9-level commission depth",
        "tier_platinum": "Unlimited recruits, 10-level commission depth + leadership bonuses"
      },
      "priority": 100
    },
    {
      "benefitId": "aios_access",
      "name": "AIOS Platform Access",
      "values": {
        "free": "Web only, limited",
        "tier_starter": "Web + mobile",
        "tier_professional": "Web + mobile + desktop",
        "tier_business": "All platforms",
        "tier_platinum": "All platforms + hardware (North Star ONE)"
      },
      "priority": 110
    },
    {
      "benefitId": "white_label",
      "name": "White Label / Resale",
      "values": {
        "free": "No",
        "tier_starter": "No",
        "tier_professional": "No",
        "tier_business": "Limited",
        "tier_platinum": "Full"
      },
      "priority": 120
    }
  ]
}
```

### 1.3 AIOS (AI Operating System) Access Levels

```json
{
  "aiosAccessLevels": {
    "free": {
      "platforms": ["web"],
      "features": ["essential_apps", "local_sync"],
      "storageQuota": "100MB",
      "offlineCapability": "Limited (current session only)",
      "voiceControl": false,
      "hardware": [],
      "monthlyApiCalls": 0
    },
    "tier_starter": {
      "platforms": ["web", "ios", "android"],
      "features": ["all_apps", "full_sync", "offline_mode", "push_notifications"],
      "storageQuota": "1GB",
      "offlineCapability": "Full (24hr sync)",
      "voiceControl": "Text-based suggestions",
      "hardware": [],
      "monthlyApiCalls": 10000
    },
    "tier_professional": {
      "platforms": ["web", "ios", "android", "desktop"],
      "features": ["all_apps", "full_sync", "offline_mode", "push_notifications", "hotkeys", "system_integration"],
      "storageQuota": "10GB",
      "offlineCapability": "Full (persistent)",
      "voiceControl": "Voice commands (US/EU)",
      "hardware": [],
      "monthlyApiCalls": 100000
    },
    "tier_business": {
      "platforms": ["web", "ios", "android", "desktop"],
      "features": ["all", "sso", "advanced_automation", "workflow_builder"],
      "storageQuota": "100GB",
      "offlineCapability": "Full (persistent)",
      "voiceControl": "Full voice interface (30 languages)",
      "hardware": ["apple_watch"],
      "monthlyApiCalls": 1000000
    },
    "tier_platinum": {
      "platforms": ["web", "ios", "android", "desktop", "hardware"],
      "features": ["everything", "white_label", "custom_branding"],
      "storageQuota": "Unlimited",
      "offlineCapability": "Full (persistent)",
      "voiceControl": "Full voice interface (all languages)",
      "hardware": ["north_star_one", "apple_watch", "android_watch"],
      "monthlyApiCalls": "Unlimited",
      "dedicatedInfrastructure": true
    }
  }
}
```

---

## Part 2: Compensation System

### 2.1 Unilevel Commission Structure

```json
{
  "compensationPlan": {
    "type": "Unilevel",
    "width": "Unlimited (no limit on direct recruits per person)",
    "depth": "Variable by membership tier (6-10 levels)",
    "depthByTier": {
      "free": {
        "maxLevels": 0,
        "description": "Cannot recruit or earn commissions"
      },
      "tier_starter": {
        "maxLevels": 6,
        "description": "6 levels of commission depth"
      },
      "tier_professional": {
        "maxLevels": 7,
        "description": "7 levels of commission depth"
      },
      "tier_business": {
        "maxLevels": 9,
        "description": "9 levels of commission depth"
      },
      "tier_platinum": {
        "maxLevels": 10,
        "description": "10 levels of commission depth (full unilevel)"
      }
    },
    "commissionRates": [
      {
        "level": 1,
        "percentage": 30,
        "description": "Direct sponsor commission",
        "minimumQualification": "Active (any tier)"
      },
      {
        "level": 2,
        "percentage": 20,
        "description": "Second level upline",
        "minimumQualification": "Active + €1k monthly volume"
      },
      {
        "level": 3,
        "percentage": 15,
        "description": "Third level upline",
        "minimumQualification": "Active + €2k monthly volume"
      },
      {
        "level": 4,
        "percentage": 10,
        "description": "Fourth level upline",
        "minimumQualification": "Active + €5k monthly volume"
      },
      {
        "level": 5,
        "percentage": 3,
        "description": "Fifth level upline",
        "minimumQualification": "Active + €10k monthly volume"
      },
      {
        "level": 6,
        "percentage": 2,
        "description": "Sixth level upline",
        "minimumQualification": "Active + €25k monthly volume",
        "applicableToTiers": ["tier_starter", "tier_professional", "tier_business", "tier_platinum"]
      },
      {
        "level": 7,
        "percentage": 1,
        "description": "Seventh level upline",
        "minimumQualification": "Active + €50k monthly volume",
        "applicableToTiers": ["tier_professional", "tier_business", "tier_platinum"]
      },
      {
        "level": 8,
        "percentage": 0.5,
        "description": "Eighth level upline",
        "minimumQualification": "Active + €100k monthly volume",
        "applicableToTiers": ["tier_business", "tier_platinum"]
      },
      {
        "level": 9,
        "percentage": 0.5,
        "description": "Ninth level upline",
        "minimumQualification": "Active + €150k monthly volume",
        "applicableToTiers": ["tier_business", "tier_platinum"]
      },
      {
        "level": 10,
        "percentage": 0.5,
        "description": "Tenth level upline",
        "minimumQualification": "Active + €200k monthly volume",
        "applicableToTiers": ["tier_platinum"]
      }
    ],
    "bonusDistribution": {
      "totalNetworkShare": 0.80,
      "levelsShare": 0.80,
      "teamBonusPool": 0.05,
      "achievementBonusPool": 0.05,
      "developmentFund": 0.20
    }
  }
}
```

### 2.2 Bonus Types & Calculations

#### Direct Sales Commission
```
When User A (€399 Starter) purchases:

SCENARIO 1 - Sponsor has Starter tier (6-level depth limit):
├─ Level 1 (Sponsor): 30% × €399 = €119.70
├─ Level 2 (Sponsor's sponsor): 20% × €399 = €79.80
├─ Level 3: 15% × €399 = €59.85
├─ Level 4: 10% × €399 = €39.90
├─ Level 5: 3% × €399 = €11.97
├─ Level 6: 2% × €399 = €7.98
├─ Level 7+: €0 (Starter tier only goes 6 levels deep)
└─ Total commissions: €319.20 (80% of €399)
    Dev fund: €79.80 (20%)

SCENARIO 2 - Sponsor has Professional tier (7-level depth):
├─ Levels 1-6: €319.20 (same as above)
├─ Level 7: 1% × €399 = €3.99
└─ Total commissions: €323.19

SCENARIO 3 - Sponsor has Platinum tier (10-level depth):
├─ Levels 1-6: €319.20 (same as above)
├─ Level 7: 1% × €399 = €3.99
├─ Level 8: 0.5% × €399 = €1.99
├─ Level 9: 0.5% × €399 = €1.99
├─ Level 10: 0.5% × €399 = €1.99
└─ Total commissions: €329.16 (additional €9.96 from extra depth)

KEY: Higher membership tier = deeper commission reach up the organization
```

#### Team Volume Bonus
```
For users ranked Ambassador or higher:
├─ Monthly calculation: 5% of team's total purchases
├─ Example: User has €5,000 team volume
├─ Team bonus: 5% × €5,000 = €250/month
└─ Requires: Minimum monthly personal volume (varies by rank)
```

#### Leadership Bonus
```
Monthly bonus pool distributed by rank:
├─ Ambassador: €500 pool (shared by all ambassadors)
├─ Director: €2,000 pool (shared by all directors)
├─ Executive: €10,000 pool (shared by all executives)
├─ Platinum: €50,000 pool (shared by all platinum members)
└─ Qualification: Rank achievement + active status
```

#### Performance Bonus
```
Volume tier bonuses (additional to direct commission):
├─ €2,000-€4,999 monthly: +2% bonus
├─ €5,000-€9,999 monthly: +5% bonus
├─ €10,000-€24,999 monthly: +10% bonus
├─ €25,000+ monthly: +15% bonus
└─ Calculated as: bonus_percentage × total_monthly_commissions
```

### 2.3 Rank System & Qualifications

```json
{
  "ranks": [
    {
      "rankId": "rank_individual",
      "name": "Individual",
      "monthlyVolume": 0,
      "directRecruit": 0,
      "commissionBonus": 0,
      "teamBonus": 0,
      "leadershipBonus": false,
      "bonusPool": 0,
      "requirements": "Free or any paid tier"
    },
    {
      "rankId": "rank_ambassador",
      "name": "Ambassador",
      "monthlyVolume": 2000,
      "directRecruit": 2,
      "commissionBonus": 0.05,
      "teamBonus": 0.05,
      "leadershipBonus": true,
      "bonusPool": 500,
      "requirements": "€2k monthly volume + 2 active direct recruits",
      "benefits": ["Leadership status", "Team badge", "Bonus pool share"]
    },
    {
      "rankId": "rank_director",
      "name": "Director",
      "monthlyVolume": 5000,
      "directRecruit": 5,
      "commissionBonus": 0.10,
      "teamBonus": 0.10,
      "leadershipBonus": true,
      "bonusPool": 2000,
      "requirements": "€5k monthly volume + 5 active direct recruits at ambassador+",
      "benefits": ["Director status", "Leadership team", "Bonus pool share", "Custom reporting"]
    },
    {
      "rankId": "rank_executive",
      "name": "Executive",
      "monthlyVolume": 10000,
      "directRecruit": 10,
      "commissionBonus": 0.15,
      "teamBonus": 0.15,
      "leadershipBonus": true,
      "bonusPool": 10000,
      "requirements": "€10k monthly volume + 10 active direct recruits at director+",
      "benefits": ["Executive status", "C-suite access", "Bonus pool share", "Company shares"]
    },
    {
      "rankId": "rank_platinum",
      "name": "Platinum",
      "monthlyVolume": 25000,
      "directRecruit": 25,
      "commissionBonus": 0.20,
      "teamBonus": 0.20,
      "leadershipBonus": true,
      "bonusPool": 50000,
      "requirements": "€25k monthly volume + 25 active direct recruits at executive+",
      "benefits": ["Platinum status", "Board access", "Bonus pool share", "Company shares", "Profit sharing"]
    }
  ]
}
```

---

## Part 3: Dual-Account Financial Model

### 3.0 Core Principle: Separation of Holding Value vs. Spending Power

AIGINVEST operates a **two-wallet system** where:

- **Cash Account** = Holding account (real fiat money, 1:1 EUR)
- **AIG Cash Account** = Spending account (ecosystem token, market value)

**Key Rule:** Fiat currency enters the ecosystem ONLY at membership join. After that, **everything inside AIGINVEST is tokens**. No direct fiat purchases of apps, services, or investments.

### 3.1 Account Structure

Every member has exactly **two accounts**:

```json
{
  "accounts": [
    {
      "accountId": "cash_account",
      "name": "Cash Account",
      "purpose": "Holding account for real money",
      "currency": "EUR",
      "exchangeRate": 1.0,
      "rateType": "Fixed 1:1",
      "balance": 0,
      "functions": [
        "Receive 80% of commissions",
        "Receive 80% of bonuses",
        "Receive 80% of rewards",
        "Receive deposited fiat",
        "Hold real money value",
        "Initiate conversion to AIG Cash"
      ],
      "cannotDo": [
        "Buy applications",
        "Buy services",
        "Make investments",
        "Purchase marketplace items",
        "Fund membership upgrades"
      ],
      "canTransferTo": ["aig_cash_account"],
      "isSpendingAccount": false,
      "isHoldingAccount": true
    },
    {
      "accountId": "aig_cash_account",
      "name": "AIG Cash Account",
      "purpose": "Spending account inside ecosystem",
      "currency": "AIG$",
      "exchangeRate": "Market-driven",
      "rateType": "Variable (member marketplace sets price)",
      "balance": 0,
      "functions": [
        "Receive 20% of commissions",
        "Receive 20% of bonuses",
        "Receive 20% of rewards",
        "Receive converted Cash",
        "Buy applications",
        "Buy services",
        "Make investments",
        "Purchase marketplace items",
        "Fund membership upgrades",
        "Create gift cards",
        "List for sale on marketplace"
      ],
      "cannotDo": [
        "Be deposited with fiat directly",
        "Be withdrawn to bank"
      ],
      "canTransferTo": ["cash_account (via marketplace)"],
      "isSpendingAccount": true,
      "isHoldingAccount": false
    }
  ]
}
```

### 3.2 Reward Distribution (80/20 Split)

**EVERY commission, bonus, prize, or reward is automatically divided 80/20:**

```
Event: User purchases €399 Starter package

Level 1 commission (30% × €399 = €119.70):
├─ 80% → Cash Account: €95.76 (real money value)
└─ 20% → AIG Cash Account: €23.94 (spending power)

Team volume bonus (5% × €5,000 = €250):
├─ 80% → Cash Account: €200 (real money value)
└─ 20% → AIG Cash Account: €50 (spending power)

Achievement bonus (€50):
├─ 80% → Cash Account: €40 (real money value)
└─ 20% → AIG Cash Account: €10 (spending power)

Referral bonus (€50):
├─ 80% → Cash Account: €40 (real money value)
└─ 20% → AIG Cash Account: €10 (spending power)

Key insight:
Members get real money safety (Cash Account)
+ ecosystem participation incentive (AIG Cash Account)
```

### 3.3 Membership Join Flow

```
New Member
    ↓
Choose Tier (€399, €699, €1,099, €2,999)
    ↓
Pay with Fiat (Stripe, PayPal, Link.com, crypto, bank transfer)
    ↓
✓ Membership activated
✓ Cash Account created (€0 initially)
✓ AIG Cash Account created (€0 initially)
    ↓
Join complete - ready to earn and spend inside ecosystem
```

**Important:** The membership payment is fiat-only and doesn't populate either account. It's a one-time onboarding fee.

### 3.4 Money Deposit Flow

```
Member wants to add real money:
    ↓
Deposits fiat (€1,000) via supported method
    ↓
€1,000 received in Cash Account
    ↓
Member still cannot spend inside ecosystem
    ↓
Member converts Cash to AIG Cash
    ↓
Now can purchase apps, services, investments
```

**Flow Diagram:**
```
Bank/Card ─→ Deposit ─→ Cash Account ─→ Conversion ─→ AIG Cash Account ─→ Spend
                              ↑                              ↓
                              └──────── Marketplace ────────┘
```

### 3.5 Conversion Mechanism

#### Cash → AIG Cash (User-Initiated Manual Conversion)
```json
{
  "conversionType": "cash_to_aig_cash",
  "initiatedBy": "member",
  "source": "Cash Account",
  "destination": "AIG Cash Account",
  "exchangeRate": "1:1 (fixed at join)",
  "example": {
    "cashInput": 100,
    "aigcashOutput": 100,
    "rate": "1.0"
  },
  "transactionTime": "Instant",
  "reversible": false,
  "minimumAmount": 1,
  "maximumAmount": "Account balance"
}
```

#### AIG Cash → Cash (Marketplace-Driven Exchange)
```json
{
  "conversionType": "aig_cash_to_cash",
  "mechanism": "Internal peer-to-peer marketplace",
  "exchangeRate": "Market-driven (member-determined)",
  "howItWorks": {
    "step1": "Member lists AIG Cash for sale (selects price per AIG$)",
    "step2": "Another member sees the offer",
    "step3": "If interested, buyer accepts the price",
    "step4": "AIG Cash transfers to buyer",
    "step5": "Cash transfers to seller",
    "step6": "Both parties' accounts updated"
  },
  "example": {
    "seller": "User A",
    "sellerHas": "1,000 AIG$",
    "sellerPrice": "€0.85 per AIG$",
    "buyer": "User B",
    "buyerPays": "€850 from Cash Account",
    "buyerReceives": "1,000 AIG$ to AIG Cash Account",
    "effectiveRate": "0.85"
  },
  "priceDiscovery": "Market-driven (supply/demand)",
  "platformRole": "Marketplace infrastructure only (does not set price)",
  "fee": "2% on seller (€17 of €850 payment)"
}
```

---

## Part 3 (Revised): AIG Cash Economy

### 3.6 AIG Cash: Definition & Market Value

```json
{
  "aigCash": {
    "symbol": "AIG$",
    "name": "AIG Cash",
    "type": "Internal ecosystem token/currency",
    "origin": "Minted on-demand when members convert Cash → AIG Cash",
    "value": "Market-driven on internal marketplace",
    "baseValue": "1:1 to EUR at member's initial conversion",
    "marketValue": "Determined by member buy/sell orders in marketplace",
    "volatility": "Member-controlled (reflection of supply/demand)",
    "examples": {
      "day1": "All members exchange at 1:1 (high supply of AIG Cash)",
      "week2": "Demand exceeds supply, market price rises to 1.05 EUR/AIG$",
      "month3": "Many cashing out, price drops to 0.90 EUR/AIG$",
      "steady": "Equilibrium around 0.95-1.05 EUR/AIG$"
    }
  }
}
```

### 3.7 AIG Cash Sources (How to Get Spending Power)

```json
{
  "sources": [
    {
      "sourceId": "source_reward_split",
      "name": "Reward Distribution Split",
      "description": "20% of all commissions, bonuses, achievements",
      "percentage": 20,
      "automatic": true,
      "frequency": "Upon earning event",
      "examples": [
        "Earn €100 commission → €20 AIG$ automatic",
        "Earn €50 bonus → €10 AIG$ automatic",
        "Win €25 game prize → €5 AIG$ automatic"
      ]
    },
    {
      "sourceId": "source_cash_conversion",
      "name": "Convert from Cash Account",
      "description": "User-initiated conversion from holding to spending",
      "rate": "1:1",
      "manual": true,
      "minimumAmount": 1,
      "maximumAmount": "Account balance",
      "example": "Member has €500 in Cash, converts €300 → get 300 AIG$"
    },
    {
      "sourceId": "source_marketplace_purchase",
      "name": "Marketplace Purchase",
      "description": "Buy AIG$ from another member",
      "rate": "Market-driven",
      "peer": true,
      "exampleRate": "0.85 EUR per AIG$"
    },
    {
      "sourceId": "source_referral",
      "name": "Referral Bonus",
      "description": "Friend joins and upgrades",
      "amount": "50 AIG$ per referral (if upgrade within 30 days)",
      "automatic": true,
      "taxable": false
    }
  ]
}
```

### 3.8 AIG Cash Uses (How to Spend)

```json
{
  "uses": [
    {
      "useId": "use_app_purchase",
      "category": "Marketplace",
      "description": "Buy applications and plugins",
      "example": "Purchase €49 app using 49 AIG$",
      "walletDebit": "aig_cash_account",
      "developerCredit": "cash_account (80%) + aig_cash_account (20%)"
    },
    {
      "useId": "use_skill_purchase",
      "category": "Marketplace",
      "description": "Buy skills and templates",
      "example": "Buy €15 template using 15 AIG$",
      "walletDebit": "aig_cash_account"
    },
    {
      "useId": "use_service_purchase",
      "category": "Services",
      "description": "Purchase AI services, Diana features",
      "example": "Diana Pro for 1 month: 5 AIG$",
      "walletDebit": "aig_cash_account"
    },
    {
      "useId": "use_membership_upgrade",
      "category": "Membership",
      "description": "Upgrade to higher tier",
      "example": "Upgrade from Starter (€399) to Professional (€699) using 699 AIG$",
      "walletDebit": "aig_cash_account"
    },
    {
      "useId": "use_investment",
      "category": "Investing",
      "description": "Invest in company funds or dividend funds",
      "example": "Invest 500 AIG$ in growth fund",
      "walletDebit": "aig_cash_account",
      "walletCredit": "investment_account"
    },
    {
      "useId": "use_gift_card",
      "category": "Transfer",
      "description": "Create gift card to send to member or non-member",
      "example": "Create 100 AIG$ gift card",
      "walletDebit": "aig_cash_account",
      "recipient": "Any member or email address"
    },
    {
      "useId": "use_marketplace_sell",
      "category": "Marketplace Exchange",
      "description": "List AIG$ for sale to other members",
      "example": "Sell 1,000 AIG$ at 0.90 EUR per AIG$",
      "walletDebit": "aig_cash_account (transferred to buyer)",
      "walletCredit": "cash_account (payment received)"
    }
  ]
}
```

### 3.9 Gift Cards

```json
{
  "giftCards": {
    "currency": "AIG$",
    "fundingSource": "AIG Cash Account only",
    "creationFlow": {
      "step1": "Member selects AIG$ amount",
      "step2": "Confirms debit from AIG Cash Account",
      "step3": "Gift card code generated",
      "step4": "Send to recipient (email or member ID)",
      "step5": "Recipient redeems into their AIG Cash Account"
    },
    "recipientTypes": [
      "Existing members (sends to member ID)",
      "Non-members (sends to email, code redeemable after join)"
    ],
    "examples": [
      {
        "scenario": "Member gifts to friend",
        "amount": "50 AIG$",
        "flow": "50 AIG$ debits from sender → Code generated → Friend receives code → Redeems as 50 AIG$ in their account"
      },
      {
        "scenario": "Company gives to employee",
        "amount": "250 AIG$",
        "flow": "250 AIG$ debits from company account → Code generated → Employee receives code → Can redeem after creating account"
      }
    ]
  }
}
```

---

## Part 4: Account Management Workflows
    {
      "sourceId": "source_direct_topup",
      "name": "Direct Top-Up",
      "description": "Buy AIG$ directly with fiat currency",
      "rate": "1:1 (e.g., €10 = AIG$10)",
      "minimumAmount": 10,
      "maximumAmount": 50000,
      "processingTime": "Instant to 24 hours",
      "fee": 0,
      "supportedMethods": ["stripe", "paypal", "link_com", "crypto"]
    },
    {
      "sourceId": "source_mlm_commission",
      "name": "MLM Commission",
      "description": "Earned from network sales",
      "frequency": "Monthly",
      "minimumThreshold": 50,
      "depositsTo": "aig_cash_account",
      "taxable": true
    },
    {
      "sourceId": "source_team_bonus",
      "name": "Team Volume Bonus",
      "description": "5% bonus on team's monthly purchases",
      "frequency": "Monthly",
      "minimumThreshold": 0,
      "depositsTo": "aig_cash_account",
      "taxable": true
    },
    {
      "sourceId": "source_leadership_bonus",
      "name": "Leadership Bonus",
      "description": "Share of leadership bonus pool",
      "frequency": "Monthly",
      "minimumThreshold": 0,
      "depositsTo": "aig_cash_bonus_pool",
      "taxable": true
    },
    {
      "sourceId": "source_moneygames",
      "name": "MoneyGames Earnings",
      "description": "Win AIG$ from gaming activities",
      "frequency": "Per game",
      "minimumThreshold": 0,
      "depositsTo": "aig_cash_gaming",
      "taxable": false
    },
    {
      "sourceId": "source_referral_bonus",
      "name": "Referral Bonus",
      "description": "Sign-up bonus when referred friend joins",
      "amount": 50,
      "frequency": "Per referral",
      "requirements": "Friend upgrades to paid tier within 30 days",
      "taxable": false
    },
    {
      "sourceId": "source_achievement",
      "name": "Achievements",
      "description": "Complete platform milestones",
      "examples": ["First app launch", "100 network members", "1-year anniversary"],
      "frequency": "Variable",
      "taxable": false
    }
  ]
}
```

#### Uses (How to Spend)
```json
{
  "uses": [
    {
      "useId": "use_app_purchase",
      "category": "Marketplace",
      "description": "Purchase apps from marketplace",
      "example": "Buy premium skill pack for AIG$99",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_tier_upgrade",
      "category": "Membership",
      "description": "Upgrade membership tier",
      "example": "Upgrade from Starter (€399) using AIG$399",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_ownership_tokens",
      "category": "Investment",
      "description": "Purchase ownership tokens",
      "example": "Buy AIGIO tokens at current price",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_feature_unlock",
      "category": "Features",
      "description": "Unlock premium features temporarily",
      "example": "Unlock Diana Pro for AIG$5",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_inter_user_payment",
      "category": "Transfer",
      "description": "Send AIG$ to other users",
      "minimumAmount": 1,
      "maximumAmount": "Account balance",
      "fee": "2% (capped at AIG$50)",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_cashout",
      "category": "Withdrawal",
      "description": "Withdraw AIG$ to fiat currency",
      "minimumAmount": 100,
      "maximumAmount": "Account balance",
      "fee": "2% + bank fees",
      "eligibility": "Platinum tier or approved via support",
      "processingTime": "5-10 business days",
      "walletType": "aig_cash_account"
    },
    {
      "useId": "use_investment",
      "category": "Investing",
      "description": "Invest in company funds",
      "availableFunds": ["growth_fund", "dividend_fund", "venture_fund"],
      "minimumAmount": 500,
      "walletType": "aig_cash_account"
    }
  ]
}
```

### 3.3 Wallet Architecture

```json
{
  "wallets": [
    {
      "walletId": "aig_cash_account",
      "name": "Main AIG Cash Account",
      "description": "Primary wallet for earnings and spending",
      "balance": 0,
      "subWallets": {
        "available": "Ready to spend",
        "pending": "Awaiting confirmation",
        "frozen": "Under review/dispute"
      },
      "operations": ["receive", "send", "spend", "cashout"]
    },
    {
      "walletId": "aig_cash_bonus_pool",
      "name": "Bonus Pool Reserve",
      "description": "Leadership bonuses pending distribution",
      "balance": 0,
      "autoDistribute": true,
      "distributionDay": 1,
      "operations": ["receive", "distribute"]
    },
    {
      "walletId": "aig_cash_gaming",
      "name": "Gaming Earnings",
      "description": "Winnings from MoneyGames",
      "balance": 0,
      "dailyWithdrawalLimit": 1000,
      "monthlyWithdrawalLimit": 10000,
      "operations": ["receive", "transfer_to_main"]
    },
    {
      "walletId": "aig_cash_dividend",
      "name": "Dividend Account",
      "description": "Ownership token dividends",
      "balance": 0,
      "autoDistribute": true,
      "distributionDay": 15,
      "operations": ["receive"]
    }
  ]
}
```

---

## Part 4: Ownership Tokens (AIGIO)

### 4.1 Token Definition

```json
{
  "ownershipToken": {
    "symbol": "AIGIO",
    "name": "AIG Ownership Token",
    "type": "Digital security + utility token",
    "basePrice": 0.90,
    "currency": "EUR (primary), USD (secondary)",
    "precision": 8,
    "totalSupply": 1000000000,
    "circulatingSupply": 100000000,
    "reserveSupply": 900000000,
    "priceUpdateFrequency": "Real-time",
    "tradingPlatforms": ["Internal DEX", "Uniswap (future)", "Binance (roadmap)"]
  }
}
```

### 4.2 Token Pricing Model

```json
{
  "pricing": {
    "basePrice": 0.90,
    "priceMultiplier": {
      "formula": "base_price × (1 + (revenue_millions / 100))",
      "examples": [
        {
          "monthlyRevenue": "€0M (early)",
          "price": "€0.90"
        },
        {
          "monthlyRevenue": "€100M",
          "price": "€1.80"
        },
        {
          "monthlyRevenue": "€1,000M",
          "price": "€10.90"
        }
      ]
    },
    "priceFloor": 0.50,
    "priceCeiling": "No limit (market-driven)",
    "adjustmentFrequency": "Daily at 00:00 UTC"
  }
}
```

### 4.3 Token Acquisition

```json
{
  "acquisition": [
    {
      "method": "Direct Purchase",
      "description": "Buy with AIG$ or fiat",
      "minimumAmount": 10,
      "maximumAmount": 1000000,
      "fee": "1%",
      "immediateOwnership": true
    },
    {
      "method": "Dividend Reinvestment",
      "description": "Auto-buy with dividend payouts",
      "minimum": 0,
      "fee": "0%",
      "optIn": true
    },
    {
      "method": "Network Milestone",
      "description": "Earned at network achievements",
      "examples": [
        "1st person joins: 100 AIGIO",
        "100th person joins: 500 AIGIO",
        "1,000th person joins: 2,000 AIGIO"
      ],
      "cumulativeMaximum": 100000
    },
    {
      "method": "Team Bonus",
      "description": "10% of leadership bonus as tokens",
      "calculation": "leadership_bonus_amount × 10% / current_price",
      "requiresRank": "Ambassador+"
    }
  ]
}
```

### 4.4 Token Utilities

```json
{
  "utilities": [
    {
      "utility": "Dividend Rights",
      "description": "Quarterly share of company profits",
      "rate": "2% of quarterly net profit / total AIGIO",
      "distribution": "Monthly",
      "taxable": true
    },
    {
      "utility": "Governance Voting",
      "description": "Vote on platform decisions",
      "votingWeight": "1 vote per AIGIO",
      "voteOnTopics": ["feature_priority", "compensation_changes", "policy_updates"],
      "minimumTokens": 1000
    },
    {
      "utility": "Staking Rewards",
      "description": "Earn additional tokens by staking",
      "minimumStake": 10000,
      "lockupPeriod": "3/6/12 months",
      "apy": {
        "3mo": 0.05,
        "6mo": 0.08,
        "12mo": 0.12
      }
    },
    {
      "utility": "Premium Features",
      "description": "Unlock features by holding threshold",
      "thresholds": {
        "100_tokens": "Priority support",
        "1000_tokens": "Exclusive research access",
        "10000_tokens": "Board observer status"
      }
    },
    {
      "utility": "Marketplace Discount",
      "description": "Marketplace purchases discounted by holdings",
      "discount": {
        "10_tokens": 0.01,
        "100_tokens": 0.05,
        "1000_tokens": 0.10,
        "10000_tokens": 0.20
      }
    }
  ]
}
```

---

## Part 5: Internal Marketplace

### 5.1 Marketplace Structure

```json
{
  "marketplace": {
    "name": "AIG Marketplace",
    "assetTypes": [
      {
        "assetId": "type_apps",
        "name": "Applications",
        "description": "Full-featured apps extending platform",
        "developerCommission": 0.30,
        "minPrice": 0,
        "maxPrice": 10000,
        "reviewProcess": true,
        "estimatedApps": "50+",
        "monthlyRevenue": 5000
      },
      {
        "assetId": "type_skills",
        "name": "Skills & Templates",
        "description": "Reusable workflows and templates",
        "creatorCommission": 0.50,
        "minPrice": 1,
        "maxPrice": 1000,
        "reviewProcess": false,
        "estimatedItems": "200+",
        "monthlyRevenue": 2000
      },
      {
        "assetId": "type_packs",
        "name": "Content Packs",
        "description": "Curated collections and bundles",
        "creatorCommission": 0.25,
        "minPrice": 5,
        "maxPrice": 100,
        "reviewProcess": true,
        "estimatedPacks": "50+",
        "monthlyRevenue": 1000
      },
      {
        "assetId": "type_learning",
        "name": "Courses & Learning",
        "description": "Educational content and certifications",
        "creatorCommission": 0.40,
        "minPrice": 10,
        "maxPrice": 5000,
        "reviewProcess": true,
        "estimatedCourses": "100+",
        "monthlyRevenue": 3000
      },
      {
        "assetId": "type_agents",
        "name": "AI Agents",
        "description": "Custom Diana personalities",
        "creatorCommission": 0.35,
        "minPrice": 10,
        "maxPrice": 1000,
        "reviewProcess": true,
        "estimatedAgents": "50+",
        "roadmap": "2026-Q4"
      }
    ]
  }
}
```

### 5.2 Marketplace Seller Program

```json
{
  "sellerTiers": [
    {
      "tierId": "seller_individual",
      "name": "Individual",
      "monthlyRevenue": 0,
      "requirements": "Any membership tier",
      "commission": 0.30,
      "benefits": ["Listing", "Support"],
      "supportLevel": "Email"
    },
    {
      "tierId": "seller_verified",
      "name": "Verified Seller",
      "monthlyRevenue": 100,
      "requirements": "Verified reviews (4.5+ stars), 10+ sales",
      "commission": 0.32,
      "benefits": ["Badge", "Featured listing", "Analytics"],
      "supportLevel": "Priority email"
    },
    {
      "tierId": "seller_premium",
      "name": "Premium Seller",
      "monthlyRevenue": 1000,
      "requirements": "Verified + Business tier subscription",
      "commission": 0.35,
      "benefits": ["All verified + custom page", "Advanced analytics", "Marketing support"],
      "supportLevel": "Phone + email"
    },
    {
      "tierId": "seller_enterprise",
      "name": "Enterprise Partner",
      "monthlyRevenue": 10000,
      "requirements": "Premium + Platinum tier",
      "commission": 0.40,
      "benefits": ["All premium + co-marketing", "Revenue share", "API access"],
      "supportLevel": "Dedicated manager"
    }
  ]
}
```

---

## Part 6: Payments & Integrations

### 6.1 Supported Payment Methods

```json
{
  "paymentMethods": [
    {
      "methodId": "stripe",
      "name": "Stripe",
      "paymentTypes": ["card_visa", "card_mastercard", "card_amex", "sepa_debit"],
      "supportedCountries": "EU, US, UK, CA (150+ countries)",
      "processingTime": "Instant to 3 business days",
      "fee": "2.9% + 0.30 EUR (cards), 1% (SEPA)",
      "currency": ["EUR", "USD", "GBP", "CAD", "CHF"]
    },
    {
      "methodId": "paypal",
      "name": "PayPal",
      "paymentTypes": ["paypal_balance", "paypal_credit", "bank_transfer"],
      "supportedCountries": "200+ countries",
      "processingTime": "1-3 business days",
      "fee": "2.99% + 0.35 EUR",
      "currency": ["EUR", "USD", "GBP", "CAD"]
    },
    {
      "methodId": "link_com",
      "name": "Link.com",
      "paymentTypes": ["open_banking", "instant_transfer"],
      "supportedCountries": "EU (SEPA region)",
      "processingTime": "Instant",
      "fee": "0.5%",
      "currency": ["EUR"]
    },
    {
      "methodId": "cryptocurrency",
      "name": "Cryptocurrency",
      "paymentTypes": ["bitcoin", "ethereum", "usdc", "usdt"],
      "supportedCountries": "Global",
      "processingTime": "15-30 minutes",
      "fee": "1%",
      "minAmount": 50,
      "maxAmount": 100000,
      "provider": "Coinbase Commerce"
    },
    {
      "methodId": "bank_transfer",
      "name": "Bank Transfer",
      "paymentTypes": ["sepa_transfer", "swift_transfer"],
      "supportedCountries": "Worldwide",
      "processingTime": "1-5 business days",
      "fee": "0% to 1% (varies by bank)",
      "minAmount": 100,
      "currency": ["EUR", "USD", "GBP", "CAD", "CHF"]
    },
    {
      "methodId": "aig_cash",
      "name": "AIG Cash",
      "paymentTypes": ["wallet_balance"],
      "supportedCountries": "All (internal)",
      "processingTime": "Instant",
      "fee": "0%",
      "currency": ["AIGC"]
    },
    {
      "methodId": "gift_card",
      "name": "Gift Cards",
      "paymentTypes": ["prepaid_code"],
      "supportedCountries": "All",
      "processingTime": "Instant",
      "fee": "0%",
      "denominations": [10, 25, 50, 100, 250, 500]
    }
  ]
}
```

### 6.2 Payout Methods

```json
{
  "payoutMethods": [
    {
      "methodId": "bank_transfer",
      "name": "Direct Bank Transfer",
      "minimumPayout": 100,
      "maximumPayout": "Unlimited",
      "processingTime": "3-5 business days",
      "fee": "0% (platform covers)",
      "supportedCountries": "150+ (via local banks)",
      "frequency": "Weekly or monthly"
    },
    {
      "methodId": "paypal",
      "name": "PayPal",
      "minimumPayout": 50,
      "maximumPayout": 50000,
      "processingTime": "1-3 business days",
      "fee": "0% (platform covers for >€100)",
      "supportedCountries": "200+",
      "frequency": "Weekly or monthly"
    },
    {
      "methodId": "cryptocurrency",
      "name": "Cryptocurrency",
      "minimumPayout": 100,
      "maximumPayout": "Unlimited",
      "processingTime": "15-60 minutes",
      "fee": "1% (network fee)",
      "supportedCoins": ["bitcoin", "ethereum", "usdc", "usdt"],
      "frequency": "Daily or weekly"
    },
    {
      "methodId": "aig_cash",
      "name": "AIG Cash Wallet",
      "minimumPayout": 1,
      "maximumPayout": "Unlimited",
      "processingTime": "Instant",
      "fee": "0%",
      "frequency": "Instant (on-demand)",
      "requiresVerification": "KYC Level 1"
    }
  ]
}
```

---

## Part 7: Compliance & Regulations

### 7.1 FTC Compliance Checklist

```json
{
  "ftcCompliance": {
    "productFocus": {
      "requirement": "Focus on product sales, not recruitment",
      "implementation": [
        "Track all sales to non-recruits",
        "Track all purchases vs. recruitment",
        "Report ratio >50% external sales",
        "Annual third-party audit"
      ]
    },
    "incomeDisclosure": {
      "requirement": "Publish real earning data",
      "implementation": [
        "Publish annual earnings report",
        "Show average earnings per tier",
        "Show percentage earning >threshold",
        "Public at platform.example.com/earnings"
      ]
    },
    "noIncomeClaims": {
      "requirement": "Never promise specific earnings",
      "implementation": [
        "Marketing copy review process",
        "Automated content scanner",
        "Sales team training",
        "Penalty system for violations"
      ]
    },
    "moneyBackGuarantee": {
      "requirement": "30-day refund policy",
      "implementation": [
        "Full refund within 30 days",
        "No questions asked",
        "Automatic processing",
        "Return to original payment method"
      ]
    },
    "transparentStructure": {
      "requirement": "Clear commission visibility",
      "implementation": [
        "Dashboard shows live commissions",
        "Payment statements detailed",
        "Network tree visualization",
        "API for transparency tools"
      ]
    },
    "affidavitFiling": {
      "requirement": "FTC affidavit (US)",
      "implementation": [
        "Annual filing required",
        "Legal department owns",
        "Third-party audit",
        "Published on website"
      ]
    }
  }
}
```

### 7.2 Regional Compliance Plans

```json
{
  "regionalPlans": {
    "US": {
      "classification": "Multi-level marketing (FTC regulated)",
      "keyRequirements": ["FTC affidavit", "Income disclosure", "Product focus", "No income claims"],
      "taxReporting": "1099-NEC for contractors",
      "documentation": "Complete audit trail",
      "annualAudit": true,
      "specialRules": ["MLM statutes per state vary", "Some states restrict MLM structure"]
    },
    "EU": {
      "classification": "Network marketing (allowed with restrictions)",
      "keyRequirements": ["Consumer protection", "Data privacy (GDPR)", "Fair trading"],
      "taxReporting": "VAT per country + income tax",
      "documentation": "GDPR-compliant data handling",
      "annualAudit": true,
      "specialRules": ["Germany (GWB) strict", "France allows with limits", "GDPR mandatory"]
    },
    "UK": {
      "classification": "Direct selling (regulated)",
      "keyRequirements": ["Consumer Contracts Regulations", "Competition Act", "Fair trading"],
      "taxReporting": "HMRC reporting + corporation tax",
      "documentation": "Consumer protection compliance",
      "annualAudit": true,
      "specialRules": ["14-day withdrawal right", "Clear cancellation", "No auto-renewal"]
    },
    "Canada": {
      "classification": "Multi-level marketing (allowed)",
      "keyRequirements": ["Competition Act", "Provincial regulations", "Income disclosure"],
      "taxReporting": "Income tax + GST/HST",
      "documentation": "Transparent payout structure",
      "annualAudit": true,
      "specialRules": ["No pyramid scheme definition violation", "Affiliate-like structure preferred"]
    }
  }
}
```

### 7.3 KYC/AML Requirements

```json
{
  "kyc": {
    "level1": {
      "name": "Basic Verification",
      "requirements": ["Email verification", "Phone verification"],
      "limit": "€1,000 monthly",
      "purpose": "Free/Starter tier",
      "processingTime": "Instant"
    },
    "level2": {
      "name": "Intermediate Verification",
      "requirements": ["ID document scan", "Address verification", "Selfie"],
      "limit": "€25,000 monthly",
      "purpose": "Professional+ tiers, cashout",
      "processingTime": "1-2 hours",
      "provider": "Veriff or Onfido"
    },
    "level3": {
      "name": "Enhanced Verification",
      "requirements": ["Full KYC", "Source of funds", "Business documents (if applicable)"],
      "limit": "Unlimited",
      "purpose": "Platinum tier, large payouts",
      "processingTime": "1-2 business days",
      "provider": "Veriff or Onfido + manual review"
    }
  }
}
```

---

## Part 8: Database Schema

### 8.1 Core Tables

```sql
-- Membership Management
CREATE TABLE tiers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  billing_cycle VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Accounts
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  tier_id VARCHAR(50) REFERENCES tiers(id),
  sponsor_id VARCHAR(36) REFERENCES users(id),
  rank_id VARCHAR(50) REFERENCES ranks(id),
  kycLevel INT DEFAULT 1,
  member_code VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  upgraded_at TIMESTAMP,
  last_active TIMESTAMP
);

-- Membership Subscriptions
CREATE TABLE subscriptions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  tier_id VARCHAR(50) REFERENCES tiers(id),
  price DECIMAL(10, 2),
  billing_cycle VARCHAR(50),
  status ENUM('active', 'paused', 'cancelled', 'expired'),
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_method_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Commission Records: 80/20 Split Tracking
-- CRITICAL: Every commission is split automatically 80% Cash / 20% AIG Cash
CREATE TABLE commissions (
  id VARCHAR(36) PRIMARY KEY,
  source_user_id VARCHAR(36) REFERENCES users(id),
  recipient_user_id VARCHAR(36) REFERENCES users(id),
  recipient_tier_id VARCHAR(50),
  commission_level INT,
  percentage DECIMAL(5, 2),
  gross_amount DECIMAL(12, 2),
  currency_purchased VARCHAR(3),
  amount_cash_account DECIMAL(12, 2),
  amount_aigcash_account DECIMAL(12, 2),
  source_type ENUM('purchase', 'bonus', 'achievement', 'team_volume', 'leadership', 'referral'),
  source_transaction_id VARCHAR(100),
  status ENUM('pending', 'approved', 'paid', 'disputed'),
  recipient_account_id_cash VARCHAR(36) REFERENCES accounts(id),
  recipient_account_id_aigcash VARCHAR(36) REFERENCES accounts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  INDEX (source_user_id, created_at),
  INDEX (recipient_user_id, created_at),
  INDEX (status),
  INDEX (source_type)
);

-- Split calculation example:
-- Purchase amount: €100
-- Level 1 commission: 30% × €100 = €30 gross
-- Cash Account credit: 30 × 0.80 = €24.00
-- AIG Cash Account credit: 30 × 0.20 = €6.00 (as 6 AIG$)

-- Wallets: Two-Account Model (Cash Account + AIG Cash Account)
-- Every member has exactly 2 accounts (1 EUR holding + multiple AIG$ spending)
CREATE TABLE accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  account_type ENUM('cash_account', 'aig_cash_account') NOT NULL,
  account_name VARCHAR(100),
  currency VARCHAR(3),
  balance DECIMAL(18, 8) DEFAULT 0,
  pending DECIMAL(18, 8) DEFAULT 0,
  frozen DECIMAL(18, 8) DEFAULT 0,
  exchange_rate DECIMAL(10, 6),
  daily_withdrawal_limit DECIMAL(12, 2),
  monthly_withdrawal_limit DECIMAL(12, 2),
  last_transaction TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_account (user_id, account_type),
  INDEX (user_id, account_type)
);

-- Account Types Reference:
-- cash_account: Holding account (EUR, 1:1), receives 80% of all commissions/bonuses
--   - Cannot be spent directly
--   - Can be converted to AIG Cash manually
--   - Can receive fiat deposits
--   - Primary account for real money safety
--
-- aig_cash_account: Spending account (AIG$, market value), receives 20% of commissions/bonuses
--   - Only account used for ecosystem purchases
--   - Can be converted to Cash via marketplace
--   - Market-driven exchange rate
--   - Primary account for ecosystem participation

-- Account Conversions: Cash ←→ AIG Cash
CREATE TABLE account_conversions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  from_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
  to_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
  from_currency VARCHAR(3),
  to_currency VARCHAR(3),
  from_amount DECIMAL(18, 8),
  to_amount DECIMAL(18, 8),
  exchange_rate DECIMAL(10, 6),
  conversion_type ENUM('cash_to_aigcash_manual', 'aigcash_to_cash_marketplace'),
  transaction_id VARCHAR(100),
  status ENUM('pending', 'completed', 'failed', 'cancelled'),
  marketplace_order_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX (user_id, created_at),
  INDEX (status)
);

-- Legacy Wallets Table (if needed for backward compatibility)
CREATE TABLE wallets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  wallet_type ENUM('aig_cash_bonus', 'aig_cash_gaming', 'aig_cash_dividend'),
  balance DECIMAL(18, 8) DEFAULT 0,
  pending DECIMAL(18, 8) DEFAULT 0,
  frozen DECIMAL(18, 8) DEFAULT 0,
  daily_limit DECIMAL(12, 2),
  monthly_limit DECIMAL(12, 2),
  last_transaction TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions: Dual-Account Aware
-- All transactions must specify source and destination accounts
-- Handles Cash Account (EUR) and AIG Cash Account (AIG$) transfers
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  from_user_id VARCHAR(36) REFERENCES users(id),
  from_account_id VARCHAR(36) REFERENCES accounts(id),
  to_user_id VARCHAR(36) REFERENCES users(id),
  to_account_id VARCHAR(36) REFERENCES accounts(id),
  from_currency VARCHAR(3),
  to_currency VARCHAR(3),
  from_amount DECIMAL(18, 8),
  to_amount DECIMAL(18, 8),
  exchange_rate DECIMAL(10, 6),
  transaction_type ENUM('deposit', 'withdrawal', 'purchase', 'transfer', 'commission_split', 'conversion', 'marketplace_order'),
  transaction_category ENUM('topup', 'purchase', 'transfer', 'payout', 'commission', 'bonus', 'conversion'),
  related_transaction_id VARCHAR(36),
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'disputed'),
  metadata JSON,
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX (from_user_id, created_at),
  INDEX (to_user_id, created_at),
  INDEX (status),
  INDEX (transaction_type)
);

-- Transaction Type Reference:
-- deposit: Fiat → Cash Account
-- withdrawal: Cash Account → Bank (Platinum only)
-- purchase: AIG Cash Account → Seller for apps/services
-- transfer: Account → Another user's account
-- commission_split: Auto-split commission to both accounts
-- conversion: Cash Account ↔ AIG Cash Account
-- marketplace_order: Peer-to-peer AIG$ ↔ Cash conversion

-- Marketplace Orders: Internal Exchange (AIG$ ↔ Cash)
-- Members trade AIG$ and Cash with each other at market-determined prices
CREATE TABLE marketplace_orders (
  id VARCHAR(36) PRIMARY KEY,
  seller_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  buyer_user_id VARCHAR(36) REFERENCES users(id),
  seller_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
  buyer_account_id VARCHAR(36) REFERENCES accounts(id),
  order_type ENUM('buy', 'sell') NOT NULL,
  selling_currency VARCHAR(3),
  buying_currency VARCHAR(3),
  selling_quantity DECIMAL(18, 8) NOT NULL,
  price_per_unit DECIMAL(10, 6) NOT NULL,
  total_selling_amount DECIMAL(18, 8) NOT NULL,
  total_buying_amount DECIMAL(18, 8) NOT NULL,
  status ENUM('open', 'partially_filled', 'filled', 'cancelled', 'expired'),
  filled_quantity DECIMAL(18, 8) DEFAULT 0,
  minimum_order_size DECIMAL(18, 8),
  expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  filled_at TIMESTAMP,
  INDEX (seller_user_id, status),
  INDEX (status, created_at),
  INDEX (price_per_unit)
);

-- Marketplace Transactions: Individual matched trades
CREATE TABLE marketplace_transactions (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL REFERENCES marketplace_orders(id),
  seller_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  buyer_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  seller_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
  buyer_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
  seller_currency VARCHAR(3),
  buyer_currency VARCHAR(3),
  seller_amount DECIMAL(18, 8),
  buyer_amount DECIMAL(18, 8),
  exchange_rate DECIMAL(10, 6),
  platform_fee DECIMAL(18, 8),
  status ENUM('pending', 'completed', 'failed', 'disputed'),
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX (seller_user_id, completed_at),
  INDEX (buyer_user_id, completed_at),
  INDEX (status)
);

-- Key Rules for Marketplace:
-- 1. Sellers list AIG Cash, buyers purchase with EUR from Cash Account
-- 2. Exchange rate is market-driven (set by sellers, competed for by buyers)
-- 3. Platform charges 2% fee on seller side
-- 4. All trades are instantly settled (no escrow)
-- 5. Buyers can only buy with Cash Account EUR balance
-- 6. Sellers can only sell AIG Cash Account balance
-- 7. Matches occur in price order (lowest asking price first for buyers)

-- Ranks
CREATE TABLE ranks (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  min_monthly_volume DECIMAL(12, 2),
  min_direct_recruits INT,
  commission_bonus DECIMAL(5, 2),
  team_bonus DECIMAL(5, 2),
  leadership_bonus BOOLEAN,
  bonus_pool DECIMAL(12, 2),
  created_at TIMESTAMP
);

-- Ownership Tokens
CREATE TABLE ownership_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  quantity DECIMAL(18, 8),
  acquisition_method VARCHAR(50),
  purchase_price DECIMAL(10, 6),
  current_value DECIMAL(10, 6),
  staked_quantity DECIMAL(18, 8) DEFAULT 0,
  staking_period_months INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payouts
CREATE TABLE payouts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  amount DECIMAL(12, 2),
  currency VARCHAR(3),
  payout_method VARCHAR(50),
  status ENUM('pending', 'processing', 'completed', 'failed', 'rejected'),
  requested_at TIMESTAMP,
  processed_at TIMESTAMP,
  bank_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Trail
CREATE TABLE audit_log (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id VARCHAR(36),
  changes JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id, created_at),
  INDEX (entity_type, entity_id)
);
```

---

## Part 9: API Reference

### 9.1 Membership APIs

```
GET /api/v1/memberships/tiers
  Returns: All available membership tiers
  Response: [tier objects with benefits]

POST /api/v1/memberships/upgrade
  Params: userId, targetTierId, paymentMethodId
  Returns: Subscription object + receipt
  Events: user.tier_changed, payment.completed

GET /api/v1/memberships/benefits/:tierId
  Returns: Complete benefits matrix for tier
  Response: [benefit objects]

GET /api/v1/memberships/:userId/status
  Returns: Current subscription status
  Response: {tier, expiresAt, autoRenew, nextBilling}
```

### 9.2 Commission APIs

```
GET /api/v1/commissions/summary
  Returns: User's total commissions to date
  Response: {totalEarned, totalPending, thisMonth, lastMonth}

GET /api/v1/commissions/downline
  Params: limit, offset, sortBy
  Returns: Complete downline with commission status
  Response: [user objects with volumes]

GET /api/v1/commissions/history
  Params: startDate, endDate, status
  Returns: Detailed commission transaction history
  Response: [commission objects]

GET /api/v1/commissions/rank/forecast
  Returns: Projection to next rank based on current volume
  Response: {currentRank, nextRank, volumeNeeded, monthsEstimate}
```

### 9.3 Account Management APIs (Dual-Account Model)

```
GET /api/v1/accounts
  Returns: Both user accounts (Cash Account + AIG Cash Account)
  Response: {
    accounts: [
      {
        accountId: "...",
        accountType: "cash_account",
        name: "Cash Account (EUR)",
        currency: "EUR",
        balance: 1500.50,
        pending: 250.00,
        frozen: 0,
        exchangeRate: 1.0,
        dailyWithdrawalLimit: 10000,
        monthlyWithdrawalLimit: 100000
      },
      {
        accountId: "...",
        accountType: "aig_cash_account",
        name: "AIG Cash Account (AIG$)",
        currency: "AIG$",
        balance: 750.00,
        pending: 100.00,
        frozen: 0,
        exchangeRate: 0.95,
        dailyWithdrawalLimit: null,
        monthlyWithdrawalLimit: null
      }
    ]
  }

GET /api/v1/accounts/:accountType/balance
  Params: accountType (cash_account | aig_cash_account)
  Returns: Single account balance and limits
  Response: {accountId, accountType, balance, pending, frozen, limits}

POST /api/v1/accounts/deposit
  Params: accountType, amount, paymentMethod, currency
  Description: Deposit fiat into Cash Account (EUR only)
  Returns: Transaction object
  Events: account.deposited, payment.processed
  Note: Fiat only deposits to Cash Account. Cannot deposit to AIG Cash directly.

POST /api/v1/accounts/convert
  Params: fromAccountType, toAccountType, amount
  Description: Convert between Cash Account ↔ AIG Cash Account
  Returns: Conversion confirmation
  Events: account.conversion_initiated, account.conversion_completed
  Conversions:
    - Cash → AIG Cash: 1:1 rate (€100 → 100 AIG$)
    - AIG Cash → Cash: Marketplace only (see marketplace APIs)

GET /api/v1/accounts/transactions
  Params: accountType, startDate, endDate, limit, offset
  Returns: Transaction history for specific account
  Response: [transaction objects with detailed split info]

GET /api/v1/accounts/conversions
  Returns: All conversion history (Cash ↔ AIG Cash)
  Response: [conversion objects with rates and amounts]
```

### 9.4 Commission Distribution API

```
GET /api/v1/commissions/breakdown
  Description: See how commissions are split 80/20
  Response: {
    grossAmount: 100,
    cashAccountCredit: 80,
    aigcashAccountCredit: 20,
    distribution: {
      cashAccount: {amount: 80, percentage: 80, currency: "EUR"},
      aigcashAccount: {amount: 20, percentage: 20, currency: "AIG$"}
    }
  }

POST /api/v1/commissions/auto-approve
  Description: Auto-approve pending commissions to Cash + AIG Cash
  Returns: Approved commission count
  Events: commissions.approved, accounts.updated
```

### 9.5 Marketplace APIs (AIG$ ↔ Cash Exchange)

```
GET /api/v1/marketplace/orders
  Params: orderType (buy|sell), status, priceRange, limit
  Returns: List of open marketplace orders
  Response: [
    {
      orderId: "...",
      seller: {userId, username},
      orderType: "sell",
      sellingCurrency: "AIG$",
      buyingCurrency: "EUR",
      sellingQuantity: 1000,
      pricePerUnit: 0.92,
      totalValue: 920,
      status: "open",
      filledQuantity: 0,
      createdAt: "2026-07-07T10:00:00Z"
    }
  ]

POST /api/v1/marketplace/orders/create
  Params: orderType, quantity, pricePerUnit, minimumOrderSize
  Description: Create buy or sell order on marketplace
  Returns: Order object
  Events: marketplace.order_created
  Rules:
    - Sellers: list AIG Cash from their AIG Cash Account
    - Buyers: purchase with EUR from their Cash Account
    - Platform takes 2% fee from seller

POST /api/v1/marketplace/orders/:orderId/cancel
  Returns: Cancellation confirmation
  Events: marketplace.order_cancelled

POST /api/v1/marketplace/orders/:orderId/accept
  Params: acceptQuantity (for partial fill)
  Description: Match (accept) an existing order
  Returns: Transaction object
  Events: marketplace.transaction_completed
  Note: Instantly transfers AIG$ to buyer, EUR to seller

GET /api/v1/marketplace/price-history
  Params: currency, days
  Returns: Historical AIG$ to EUR exchange rates
  Response: [{timestamp, price, volume, bidAsk}]

GET /api/v1/marketplace/stats
  Returns: Market statistics
  Response: {
    currentPrice: 0.93,
    24hHigh: 0.95,
    24hLow: 0.88,
    24hVolume: 50000,
    bidPrice: 0.92,
    askPrice: 0.94,
    spreadPercentage: 0.22
  }
```

### 9.6 Token APIs

```
GET /api/v1/tokens/price
  Returns: Current AIGIO token price
  Response: {price, priceUSD, 24hChange, basePrice}

POST /api/v1/tokens/buy
  Params: quantity, paymentMethod, currency
  Returns: Purchase confirmation
  Events: token.purchased, wallet.debited

GET /api/v1/tokens/holdings
  Returns: User's token holdings and staking info
  Response: {total, staked, unstaked, stakingYield, value}

POST /api/v1/tokens/stake
  Params: quantity, lockupMonths
  Returns: Staking confirmation
  Events: token.staked

GET /api/v1/tokens/dividends
  Returns: Dividend history and next distribution
  Response: [dividend records]

POST /api/v1/tokens/governance/vote
  Params: proposalId, vote
  Returns: Vote confirmation
  Events: governance.voted
```

### 9.5 Analytics APIs

```
GET /api/v1/analytics/dashboard
  Returns: Personal analytics dashboard
  Response: {commissions, volume, rank, downline, network}

GET /api/v1/analytics/downline
  Params: depth, metrics[]
  Returns: Downline organization chart with metrics
  Response: Tree structure with volume data

GET /api/v1/analytics/marketplace
  Params: startDate, endDate
  Returns: Marketplace earnings and sales
  Response: {totalEarned, itemsSold, topProducts, trends}

GET /api/v1/analytics/reports/monthly
  Params: year, month
  Returns: Comprehensive monthly report
  Response: PDF or JSON with all metrics

POST /api/v1/analytics/export
  Params: format (csv|json|pdf), dateRange
  Returns: Data export
  Response: File download
```

---

## Part 10: Commission Calculation Examples

### Example 1: Single Tier Upgrade

```
Scenario: Sarah (free user) upgrades to Professional (€699)

Payment: €699

Network Distribution (80%):
├─ Sarah's sponsor (Level 1): 30% × €699 = €209.70
├─ Sponsor's sponsor (Level 2): 20% × €699 = €139.80
├─ Level 3: 15% × €699 = €104.85
├─ Level 4: 10% × €699 = €69.90
├─ Level 5: 3% × €699 = €20.97
├─ Level 6: 2% × €699 = €13.98
└─ Total to network: €559.20

Dev Fund (20%): €139.80

Commission Events Generated:
1. commission.created (level 1-6)
2. wallet.credited (for each upline)
3. user.upgraded (for Sarah)
4. payment.completed
5. network_bonus.triggered
```

### Example 2: Team Volume Bonus

```
Scenario: Bob (Ambassador) has team volume

Monthly downline purchases:
├─ Direct recruit 1: €3,000 (Starter tier)
├─ Direct recruit 2: €5,000 (Professional tier)
├─ Their recruits: €2,000
└─ Total team volume: €10,000

Team Bonus (5%): 5% × €10,000 = €500

Plus direct commissions from recruits:
├─ Recruit 1 upgrade: 30% × €399 = €119.70
└─ Recruit 2 upgrade: 30% × €699 = €209.70

Total earnings: €500 + €120 + €210 = €829.70

Deposits to: aig_cash_account (€500) + aig_cash_bonus (€329.70)
```

### Example 3: Rank Advancement & Leadership Bonus

```
Scenario: Maria reaches Director rank

Requirements met:
├─ Monthly volume: €5,500 ✓
├─ Direct recruits at Ambassador+: 6 ✓
└─ Qualifies for: Director rank

Monthly earnings as Director:
├─ Direct commissions: €2,500
├─ Team volume bonus (10%): €1,000
├─ Leadership bonus pool share: Director pool (€2,000) ÷ 50 directors = €40
└─ Total: €3,540

Plus quarterly token grant:
├─ Volume tier: €5,500 → +2% bonus
├─ Bonus amount: 2% × €2,500 = €50
└─ Converted to AIGIO: €50 ÷ €0.90 = ~55.56 AIGIO
```

---

## Part 11: Fraud Prevention & Security

```json
{
  "fraudPrevention": {
    "accountCreation": [
      "Email verification required",
      "Phone verification for payouts",
      "IP geolocation tracking",
      "Duplicate account detection",
      "24-hour cooldown for new accounts"
    ],
    "commissioning": [
      "Tier verification before commission",
      "Manual review for >€10k commission",
      "Blockchain audit trail (immutable)",
      "Duplicate purchase detection",
      "Velocity checks (purchases per hour)"
    ],
    "payouts": [
      "KYC Level 2+ required",
      "Withdrawal limits per tier",
      "Monthly payout caps",
      "Bank verification for first transfer",
      "Chargeback monitoring"
    ],
    "monitoring": [
      "Real-time anomaly detection",
      "Machine learning for fraud patterns",
      "Manual review queue",
      "Automated suspension triggers",
      "72-hour investigation window"
    ]
  }
}
```

---

## Part 12: Configuration Model

### 12.1 Configurable Parameters

```json
{
  "configuration": {
    "namespace": "compensation.settings",
    "parameters": [
      {
        "key": "membership.tier.starter.price",
        "type": "decimal",
        "value": 399,
        "currency": "EUR",
        "updatable": true,
        "requiresApproval": "CFO",
        "lastUpdated": "2026-07-01",
        "changeHistory": [
          {"value": 349, "date": "2026-06-01"},
          {"value": 399, "date": "2026-07-01"}
        ]
      },
      {
        "key": "commission.level.1.percentage",
        "type": "percentage",
        "value": 0.30,
        "updatable": true,
        "requiresApproval": "Architecture Council",
        "affectsCompliance": true
      },
      {
        "key": "network.distribution.percentage",
        "type": "percentage",
        "value": 0.80,
        "locked": true,
        "reason": "FTC compliance"
      },
      {
        "key": "aig_cash.exchange_rate.eur",
        "type": "decimal",
        "value": 1.0,
        "updatable": false,
        "automaticUpdate": true,
        "updateFrequency": "daily"
      },
      {
        "key": "token.price.base",
        "type": "decimal",
        "value": 0.90,
        "currency": "EUR",
        "formula": "base_price * (1 + (revenue_millions / 100))",
        "automaticUpdate": true
      }
    ]
  }
}
```

---

## Part 13: Implementation Roadmap

### Phase 1 (Weeks 1-2): Foundation
- [ ] Database schema migration
- [ ] Tier management system
- [ ] Subscription management
- [ ] Basic commission engine

### Phase 2 (Weeks 3-4): Commissions
- [ ] Level 1-6 commission calculations
- [ ] Wallet system
- [ ] Direct commission payouts
- [ ] Commission dashboard

### Phase 3 (Weeks 5-6): Advanced Features
- [ ] Team volume bonuses
- [ ] Rank system
- [ ] Leadership bonuses
- [ ] Marketplace integration

### Phase 4 (Weeks 7-8): Monetization
- [ ] AIG Cash economy
- [ ] Token system
- [ ] Staking mechanism
- [ ] Dividend distribution

### Phase 5 (Weeks 9+): Scale
- [ ] Advanced analytics
- [ ] Multi-currency support
- [ ] Regional compliance
- [ ] Automated payouts

---

## Part 14: Dual-Account Financial Model - Technical Workflows

### 14.1 Core Separation Principle

```
HOLDING VALUE (Cash Account - EUR)
├─ Purpose: Real money safety vault
├─ Currency: EUR (1:1 fixed)
├─ Interest: Earning source (80% of all rewards)
├─ Usage: Not spendable directly
├─ Governance: Protected by KYC/regulatory
└─ Flow: Bank → Cash Account → Manual conversion → AIG Cash

SPENDING POWER (AIG Cash Account - AIG$)
├─ Purpose: Ecosystem transaction currency
├─ Currency: AIG$ (market value)
├─ Interest: Earning source (20% of all rewards)
├─ Usage: Only spending account inside AIGINVEST
├─ Governance: Market-driven exchange rates
└─ Flow: Purchase → AIG Cash debit → Seller receives cash/aig split
```

### 14.2 80/20 Distribution Logic

**Every single earning event splits automatically:**

```
Event: User Purchase or Achievement
    ↓
Calculate gross earning
    ↓
Apply 80/20 split:
    ├─ 80% → Cash Account (EUR, real money value)
    └─ 20% → AIG Cash Account (AIG$, spending power)
    ↓
Record commission split in database
    ↓
Debit transaction from sources
    ↓
Credit both accounts simultaneously
```

**Implementation rules:**
- No member can "opt-out" of the split (it's mandatory)
- Both accounts credit at same timestamp
- If member has insufficient balance for AIG split, still process cash portion
- Decimal precision: EUR to 2 places, AIG$ to 8 places

### 14.3 Deposit Flow

```
New Member Join:
├─ Pays €399-€2,999 (fiat only)
├─ Membership activated
├─ Both accounts created (Cash: €0, AIG$: €0)
└─ Ready to earn

Member Deposits Fiat Later:
├─ Chooses amount (€10-€50,000)
├─ Selects payment method (Stripe, PayPal, Link.com, crypto, bank)
├─ Funds arrive in Cash Account only
├─ Now has real money holding value
└─ Can manually convert to AIG$ for spending

Key: Fiat is gate-kept to Cash Account. Cannot directly buy AIG$.
```

### 14.4 Conversion Workflows

#### Manual Conversion: Cash → AIG Cash (User-Initiated)

```
Member Action: "Convert €100 to spending"
    ↓
Click "Convert" on Cash Account
    ↓
UI shows: "€100 EUR → 100 AIG$ (1:1 rate)"
    ↓
Member confirms
    ↓
System debits €100 from Cash Account
    ↓
System credits 100 AIG$ to AIG Cash Account
    ↓
Transaction recorded:
  - Type: "conversion_cash_to_aigcash"
  - From: cash_account (EUR)
  - To: aig_cash_account (AIG$)
  - Rate: 1.0
  - Status: completed
```

#### Marketplace Exchange: AIG Cash → Cash (Peer-to-Peer)

```
Seller wants real money:
├─ Lists 1,000 AIG$ at €0.85/AIG$ = €850 total
├─ Order posts to marketplace
└─ Status: OPEN, waiting for buyer

Buyer wants spending power:
├─ Sees sellers' order: "1,000 AIG$ @ €0.85 each"
├─ Has €850 in Cash Account
├─ Clicks "BUY"
└─ System matches order

Settlement (instant):
├─ Platform takes 2% fee from seller: €17
├─ Seller receives: €850 - €17 = €833 in Cash Account
├─ Buyer receives: 1,000 AIG$ in AIG Cash Account
├─ Marketplace transaction recorded
└─ Both balances updated in real-time
```

### 14.5 Purchase Workflows

#### Spending from AIG Cash Account

```
Member wants to buy app (€49):
    ↓
Has balance: 100 AIG$ in AIG Cash Account
    ↓
Clicks "Buy" on app
    ↓
System debits 49 AIG$ from AIG Cash Account
    ↓
Developer receives commission:
    ├─ 80% of €49 = €39.20 to developer's Cash Account
    └─ 20% of €49 = €9.80 to developer's AIG Cash Account
    ↓
Purchase transaction recorded
    ↓
Transaction status: completed
```

**Key Rule:** Only AIG Cash Account can be used for purchases. If member tries to use Cash Account, redirect to conversion UI.

### 14.6 Reward Distribution

```
Event: Level 1 commission earned (€119.70)
    ↓
Calculate split:
├─ 80% to Cash Account: €95.76 EUR
└─ 20% to AIG Cash Account: €23.94 AIG$
    ↓
Check accounts:
├─ Cash Account: automatically credited €95.76
└─ AIG Cash Account: automatically credited 23.94 AIG$
    ↓
Create commission_split transaction record:
{
  "commissionId": "comm_xxx",
  "recipientUserId": "user_yyy",
  "grossAmount": 119.70,
  "amountCashAccount": 95.76,
  "amountAigcashAccount": 23.94,
  "timestamp": "2026-07-07T10:00:00Z",
  "status": "completed"
}
    ↓
Events fired:
├─ commission.split
├─ account.cash_credited
├─ account.aigcash_credited
└─ wallet.updated
```

### 14.7 Business Intelligence

```
For Dashboard Display:
├─ Cash Account Balance: "€1,500.50" (real money, can hold/withdraw)
├─ AIG Cash Balance: "750.00 AIG$" (spending power, market value varies)
├─ Market Exchange Rate: "0.95" (current AIG$ to EUR rate)
├─ Equivalent USD Value of AIG Cash: "750 × 0.95 × 1.10 = $785.25"
├─ Total Ecosystem Value: "€1,500.50 + (750 × 0.95) = €2,212.50"
└─ Suggested Action: "Convert €100 to AIG$ for app purchases"

Key Insight:
Cash Account is "real" money (€1:€1 value)
AIG Cash value depends on marketplace exchange rate
Total wealth is real + (AIG × market_rate)
```

### 14.8 Compliance & Regulatory

```
Financial Reporting:
├─ Cash Account earnings: Reported as income (EUR-based)
├─ AIG Cash earnings: Reported as crypto-equivalent or staking income
├─ Currency conversion: EUR value = AIG amount × current exchange rate
├─ Tax implications: Calculate tax based on EUR values at time of receipt
└─ Audit trail: All 80/20 splits are immutable and tracked

KYC Requirements:
├─ Cash deposits: KYC Level 1 required (name, email)
├─ Cash withdrawals: KYC Level 2 required (ID verification)
├─ AIG Cash conversions: No KYC needed (internal transfer)
├─ Marketplace trades: KYC Level 1 (profile verification)
└─ Large trades (>€10k): Manual review required
```

---

**Status:** 🔒 LOCKED — Changes require Architecture Council + CFO + Legal approval  
**Last Review:** 2026-07-07  
**Next Review:** 2026-07-15 (Phase 1 Implementation Check-in)  
**Compliance Review:** 2026-07-22 (Quarterly audit)
