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
      "values": {
        "free": "None",
        "tier_starter": "Personal sales only",
        "tier_professional": "Up to 5 direct recruits",
        "tier_business": "Up to 25 direct recruits",
        "tier_platinum": "Unlimited recruits + leadership bonuses"
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
    "levels": 6,
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
        "minimumQualification": "Active + €25k monthly volume"
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
├─ Level 1 (Sponsor): 30% × €399 = €119.70
├─ Level 2 (Sponsor's sponsor): 20% × €399 = €79.80
├─ Level 3: 15% × €399 = €59.85
├─ Level 4: 10% × €399 = €39.90
├─ Level 5: 3% × €399 = €11.97
├─ Level 6: 2% × €399 = €7.98
└─ Total commissions: €319.20 (80% of €399)
    Dev fund: €79.80 (20%)
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

## Part 3: AIG Cash Economy

### 3.1 Currency Definition

```json
{
  "aigCash": {
    "symbol": "AIG$",
    "name": "AIG Cash",
    "baseUnit": 1,
    "precision": 2,
    "status": "Internal currency - convertible to fiat",
    "exchangeRates": {
      "EUR_to_AIGC": 1.0,
      "USD_to_AIGC": 1.10,
      "GBP_to_AIGC": 0.85,
      "CHF_to_AIGC": 0.92,
      "CAD_to_AIGC": 1.35,
      "AUD_to_AIGC": 1.65
    },
    "rateUpdateFrequency": "Daily at 00:00 UTC",
    "sourceRates": "CoinGecko + OpenExchangeRates"
  }
}
```

### 3.2 AIG Cash Sources & Uses

#### Sources (How to Earn)
```json
{
  "sources": [
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

-- Commission Records
CREATE TABLE commissions (
  id VARCHAR(36) PRIMARY KEY,
  source_user_id VARCHAR(36) REFERENCES users(id),
  recipient_user_id VARCHAR(36) REFERENCES users(id),
  level INT (1 to 6),
  percentage DECIMAL(5, 2),
  amount DECIMAL(12, 2),
  currency VARCHAR(3),
  source_type ENUM('purchase', 'bonus', 'achievement'),
  status ENUM('pending', 'approved', 'paid', 'disputed'),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  paid_at TIMESTAMP
);

-- Wallets
CREATE TABLE wallets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES users(id),
  wallet_type ENUM('aig_cash_account', 'aig_cash_bonus', 'aig_cash_gaming', 'aig_cash_dividend'),
  balance DECIMAL(18, 8) DEFAULT 0,
  pending DECIMAL(18, 8) DEFAULT 0,
  frozen DECIMAL(18, 8) DEFAULT 0,
  daily_limit DECIMAL(12, 2),
  monthly_limit DECIMAL(12, 2),
  last_transaction TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  from_user_id VARCHAR(36) REFERENCES users(id),
  to_user_id VARCHAR(36) REFERENCES users(id),
  wallet_type VARCHAR(50),
  amount DECIMAL(18, 8),
  currency VARCHAR(10),
  transaction_type ENUM('topup', 'purchase', 'transfer', 'payout', 'commission', 'bonus'),
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

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

### 9.3 Wallet APIs

```
GET /api/v1/wallet/balance
  Returns: All wallet balances
  Response: {aig_cash_account, aig_cash_bonus, pending, frozen}

POST /api/v1/wallet/topup
  Params: amount, paymentMethodId, currency
  Returns: Transaction object
  Events: wallet.topped_up, payment.processed

POST /api/v1/wallet/transfer
  Params: toUserId, amount, memo
  Returns: Transaction object
  Events: wallet.transferred

GET /api/v1/wallet/transactions
  Params: startDate, endDate, type, limit
  Returns: Transaction history with details
  Response: [transaction objects]

POST /api/v1/wallet/cashout
  Params: amount, payoutMethod, bankDetails
  Returns: Payout object
  Events: payout.requested

GET /api/v1/wallet/cashout/status/:payoutId
  Returns: Current payout status
  Response: {status, amount, method, estimatedDelivery}
```

### 9.4 Token APIs

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

**Status:** 🔒 LOCKED — Changes require Architecture Council + CFO + Legal approval  
**Last Review:** 2026-07-07  
**Next Review:** 2026-07-15 (Phase 1 Implementation Check-in)  
**Compliance Review:** 2026-07-22 (Quarterly audit)
