# Event-Driven Platform Architecture
## Central Event Bus with Multi-Module Reactions

**Location:** `/architecture/EVENT_DRIVEN_ARCHITECTURE.md`  
**Status:** 🔒 Locked  
**Version:** 1.0  
**Date:** 2026-07-07  

---

## Executive Summary

AIOS is fundamentally **event-driven**. Every significant action emits an event that other modules can react to independently. This architecture:

- Decouples modules from each other
- Enables real-time features (notifications, analytics, dashboards)
- Creates audit trail of all platform activity
- Allows new reactions to be added without changing existing code
- Scales naturally as platform grows

---

## Part 1: Core Event System

### 1.1 Event Hub Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   EVENT PRODUCER (Any Module)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   EVENT BUS (Redis)    │
            │  (Pub/Sub + Queue)     │
            └────────────────────────┘
                    │         │
        ┌───────────┼─────────┼───────────┐
        │           │         │           │
        ▼           ▼         ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │Notif.  │ │Analytics│ │Achieve.│ │Dashboard│
    │Service │ │Service  │ │Service │ │Service  │
    └────────┘ └────────┘ └────────┘ └────────┘
        │           │         │           │
        ▼           ▼         ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │Email   │ │Database│ │Badges  │ │WebSocket│
    │SMS     │ │Update  │ │Unlock  │ │Broadcast│
    └────────┘ └────────┘ └────────┘ └────────┘
```

### 1.2 Event Types (By Module)

```
IDENTITY EVENTS:
├─ identity:user_registered (new member)
├─ identity:user_verified (email/phone confirmed)
├─ identity:login_successful
├─ identity:login_failed
├─ identity:mfa_enabled
├─ identity:mfa_disabled
├─ identity:password_changed
├─ identity:permission_granted
└─ identity:permission_revoked

MEMBERSHIP EVENTS:
├─ membership:tier_upgraded (free → starter → professional)
├─ membership:tier_downgraded
├─ membership:tier_renewed (annual subscription)
├─ membership:tier_cancelled
├─ membership:fee_charged
├─ membership:trial_ended
├─ membership:trial_extended
└─ membership:feature_unlocked

WALLET EVENTS:
├─ wallet:deposit_initiated
├─ wallet:deposit_completed
├─ wallet:deposit_failed (insufficient funds)
├─ wallet:withdrawal_initiated
├─ wallet:withdrawal_completed
├─ wallet:conversion_executed (EUR → AIG$)
├─ wallet:conversion_failed
├─ wallet:balance_low (threshold alert)
├─ wallet:reconciliation_completed
└─ wallet:error (generic error event)

INVESTMENT EVENTS:
├─ investment:created (new investment)
├─ investment:updated
├─ investment:matured (reaches maturity date)
├─ investment:return_calculated
├─ investment:distribution_scheduled
├─ investment:distribution_sent
├─ investment:cancelled (early withdrawal)
├─ investment:locked (cannot withdraw)
└─ investment:tax_event (year-end reporting)

MARKETPLACE EVENTS:
├─ marketplace:product_listed (vendor creates)
├─ marketplace:product_delisted
├─ marketplace:product_approved (AI review)
├─ marketplace:product_rejected (fails compliance)
├─ marketplace:order_created (buyer purchases)
├─ marketplace:order_shipped
├─ marketplace:order_delivered
├─ marketplace:order_cancelled
├─ marketplace:order_refunded
├─ marketplace:review_submitted
├─ marketplace:seller_verified
└─ marketplace:vendor_tier_unlocked

COMPETITION EVENTS:
├─ competition:created (new contest)
├─ competition:leaderboard_updated
├─ competition:milestone_achieved (user reaches 5 sales)
├─ competition:winner_crowned
├─ competition:prizes_distributed
├─ competition:ended
└─ competition:new_season_started

LEARNING EVENTS:
├─ learning:course_started
├─ learning:lesson_completed
├─ learning:course_completed
├─ learning:certification_earned
├─ learning:certification_verified (employer check)
├─ learning:achievement_unlocked
├─ learning:badge_awarded
├─ learning:mentor_assigned
└─ learning:skill_endorsed

AI EVENTS:
├─ ai:training_started
├─ ai:training_completed
├─ ai:memory_updated
├─ ai:tool_executed
├─ ai:recommendation_generated
├─ ai:context_switched
├─ ai:decision_overridden
└─ ai:error_detected

HEALTH EVENTS:
├─ health:data_synced (wearable data received)
├─ health:metric_updated (sleep, heart rate, etc)
├─ health:trend_detected (42% decrease in sleep)
├─ health:alert_triggered (extreme value)
├─ health:emergency_detected (fall, collision, etc)
├─ health:emergency_contacts_notified
├─ health:goal_achieved
└─ health:wellness_recommendation_generated

NETWORK EVENTS:
├─ network:member_recruited
├─ network:downline_updated
├─ network:commission_paid
├─ network:bonus_awarded
├─ network:rank_upgraded
├─ network:team_volume_updated
└─ network:incentive_triggered

ORGANIZATION EVENTS:
├─ organization:created
├─ organization:member_joined
├─ organization:member_left
├─ organization:department_created
├─ organization:employee_onboarded
├─ organization:module_installed
├─ organization:module_disabled
├─ organization:upgrade_completed
└─ organization:budget_allocated

ADMIN EVENTS:
├─ admin:user_flagged (suspicious activity)
├─ admin:compliance_alert (AML/KYC)
├─ admin:support_ticket_created
├─ admin:refund_processed
├─ admin:dispute_escalated
├─ admin:ban_issued
├─ admin:content_moderated
└─ admin:system_health_alert
```

### 1.3 Event Data Structure

```json
{
  "eventId": "evt-a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
  "eventType": "investment:matured",
  "version": 1,
  "timestamp": "2026-07-07T14:30:00.000Z",
  
  "organizationId": "org-abc-123",
  "userId": "user-xyz-789",
  "source": "investment-service",
  "sourceVersion": "1.5.2",
  
  "payload": {
    "investmentId": "inv-456",
    "memberId": "mem-789",
    "productName": "Growth Fund",
    "principalAmount": 5000,
    "currency": "EUR",
    "returnAmount": 512.50,
    "totalValue": 5512.50,
    "distribution": {
      "cashAccount": 4410,
      "aigCashEquivalent": 1102.50,
      "aigCashAmount": 1050,
      "exchangeRate": 1.05
    },
    "maturityDate": "2027-07-07"
  },
  
  "metadata": {
    "correlationId": "corr-xyz-789",
    "traceId": "trace-abc-def",
    "userId": "user-xyz-789",
    "userRole": "member",
    "ipAddress": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "requestId": "req-123-456"
  },
  
  "status": "published",
  "retryCount": 0,
  "deadLetterReason": null
}
```

---

## Part 2: Event Reactions

### 2.1 Single Event, Multiple Reactions

**Event: `investment:matured`**

```
When investment reaches maturity and returns distributed:

Listeners:
├─ NOTIFICATION SERVICE
│  └─ Create notification
│     ├─ Type: "success"
│     ├─ Title: "Your investment matured!"
│     ├─ Body: "€5,512.50 distributed (€4,410 EUR + 1,050 AIG$)"
│     ├─ Send via: Email + In-app + SMS
│     └─ Action: Link to portfolio
│
├─ ANALYTICS SERVICE
│  └─ Record metric
│     ├─ Increment: "investments_matured" counter
│     ├─ Add value: €5,512.50 to "returns_paid"
│     ├─ Update dashboard: Real-time
│     ├─ Track: User segment performance
│     └─ Report: Monthly returns summary
│
├─ ACHIEVEMENT SERVICE
│  └─ Check milestone
│     ├─ If first investment matured: Unlock "First Harvest" badge
│     ├─ If 10 maturities: Unlock "Patient Investor" achievement
│     ├─ If €50k total returned: Unlock "Wealth Builder" milestone
│     ├─ Award points: 100 achievement points
│     └─ Update profile: Display badge
│
├─ COMPETITION SERVICE
│  └─ Update leaderboard
│     ├─ If in "August Returns" competition: +€5,512.50 points
│     ├─ Update rank: User position in leaderboard
│     ├─ Check: Did user reach new milestone?
│     ├─ Trigger: "Milestone achieved" event if true
│     └─ Broadcast: Real-time leaderboard update
│
├─ AI SERVICE
│  └─ Update memory & generate insight
│     ├─ Memory: "Last investment matured 2026-07-07"
│     ├─ Memory: "Total matured investments: 5"
│     ├─ Memory: "Average return: 10.2%"
│     ├─ Insight: "You've earned €500+ from investments"
│     └─ Recommendation: "Consider diversifying into Real Estate Fund"
│
├─ WALLET SERVICE
│  └─ Verify balance update
│     ├─ Check: Cash Account increased by €4,410?
│     ├─ Check: AIG Cash Account increased by 1,050?
│     ├─ Reconciliation: Balances match expected?
│     └─ Alert if: Mismatch detected (critical error)
│
├─ DASHBOARD SERVICE
│  └─ Update real-time display
│     ├─ Portfolio page: New balance displayed
│     ├─ Transactions: New transaction logged
│     ├─ Performance chart: Returns updated
│     ├─ Broadcast: WebSocket push to browser
│     └─ Timeline: New event in activity feed
│
├─ CAMPAIGN SERVICE
│  └─ Update marketing automation
│     ├─ Check: User in "Investment Referral" campaign?
│     ├─ Action: Add €100 bonus if refers friend
│     ├─ Check: Qualified for "VIP Investor" tier?
│     ├─ Action: Trigger upgrade email
│     └─ Track: Lifecycle stage progression
│
└─ REPORTING SERVICE
   └─ Generate records
      ├─ Tax: Add to annual investment income report
      ├─ Ledger: Create accounting entries
      ├─ Audit: Log event in compliance trail
      ├─ Export: Include in member statement
      └─ Compliance: Flag if suspicious pattern
```

### 2.2 Event Subscriptions

```prisma
model EventSubscription {
  id                String   @id @default(cuid())
  organizationId    String?  // null = platform-wide
  organization      Organization? @relation(fields: [organizationId], references: [id])
  
  module            String   // "notifications", "analytics", "achievements"
  eventType         String   // "investment:matured", "membership:upgraded"
  pattern           String?  // regex pattern if complex matching
  
  handlerUrl        String   // webhook destination
  handlerModule     String   // "notification-service"
  
  active            Boolean  @default(true)
  priority          Int      @default(100) // higher = faster
  
  retryPolicy       Json     // { maxAttempts: 3, backoffMs: 1000 }
  timeout           Int      @default(5000) // ms to wait
  
  filters           Json?    // { userId: "user-123", status: "active" }
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([eventType, active])
}

model EventLog {
  id                String   @id @default(cuid())
  eventId           String   // reference to original event
  subscriptionId    String
  subscription      EventSubscription @relation(fields: [subscriptionId], references: [id])
  
  status            String   // "pending", "sent", "delivered", "failed"
  attempt           Int      @default(1)
  
  response          String?  // webhook response body
  error             String?  // error message if failed
  
  sentAt            DateTime?
  deliveredAt       DateTime?
  failedAt          DateTime?
  
  nextRetryAt       DateTime?
  
  createdAt         DateTime @default(now())
  
  @@index([subscriptionId, status])
  @@index([eventId])
}

model DeadLetterEvent {
  id                String   @id @default(cuid())
  eventId           String   // reference to original event
  eventType         String
  payload           Json
  
  failureReason     String   // why it ended up here
  attempts          Int      // how many times tried
  lastAttemptAt     DateTime?
  
  resolved          Boolean  @default(false)
  resolvedAt        DateTime?
  resolution        String?  // admin notes
  
  createdAt         DateTime @default(now())
  
  @@index([resolved, eventType])
}
```

---

## Part 3: Event Processing Guarantees

### 3.1 Delivery Guarantees

```
AT-LEAST-ONCE DELIVERY (Default):
├─ Event published, subscriber attempts to process
├─ If subscriber crashes: Event retried (max 3 times)
├─ If subscriber never ACKs: Moved to dead letter queue
├─ Consequence: Subscriber may see same event twice
├─ Handling: Subscribers must be idempotent
└─ Example: "Create notification" is idempotent (duplicate = same notification)

EXACTLY-ONCE DELIVERY (For Critical):
├─ Requires distributed transaction coordination (2PC)
├─ Slower but guarantees: Event processed exactly once
├─ Use for: Financial transactions, inventory changes
├─ Not used for: Notifications, analytics, recommendations
└─ Configuration: Per subscription, opt-in

IDEMPOTENCY KEYS:
├─ Each event has unique eventId
├─ Subscribers check: Have I processed this eventId before?
├─ If yes: Return cached response
├─ If no: Process and cache result
├─ Duration: Cache for 24 hours
└─ Example:
   Event: investment:matured (eventId: evt-123)
   Sub 1 processes at 14:30:00 → creates notification
   Event re-delivery at 14:35:00 (retry)
   Sub 1 sees same eventId → returns cached notification (no duplicate)
```

### 3.2 Error Handling

```
SUBSCRIBER FAILS:
├─ First attempt: Failed
├─ Wait: 1 second (backoff factor)
├─ Retry 1: Failed
├─ Wait: 2 seconds
├─ Retry 2: Failed
├─ Wait: 4 seconds
├─ Retry 3: Failed
├─ Action: Move to dead letter queue
└─ Result: Manual review required

DEAD LETTER QUEUE MONITORING:
├─ Alert: Admin notified of dead letter event
├─ Dashboard: Shows failed event details
├─ Action: Admin can retry manually
├─ Resolution: Admin provides reason (e.g., "Fixed service, retrying")
├─ Redeliver: Event republished to subscribers
└─ Documentation: Added to incident log
```

---

## Part 4: Event Bus Implementation

### 4.1 Technology Stack

```
MESSAGE BROKER:
├─ Primary: Redis Streams (in-process, fast)
├─ Backup: Apache Kafka (distributed, highly available)
├─ Fallback: Database + polling (slow, reliable)

SERIALIZATION:
├─ Format: JSON
├─ Schema validation: JSON Schema v7
├─ Versioning: eventType:v1, eventType:v2 if changed
└─ Compression: gzip for large payloads

ORDERING:
├─ Per organization: Events ordered by timestamp
├─ Per user: Events ordered by timestamp
├─ Global: Best effort, no guarantee
└─ Consumer must handle: Events delivered out of order

RETENTION:
├─ Event bus: Keep for 24 hours (streaming)
├─ Event log: Keep for 7 years (compliance)
├─ Dead letter: Keep for 30 days (manual review)
└─ Archival: Move to S3 after 1 year
```

### 4.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│         AIOS Event-Driven Platform                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Event Producer (Any Module)                        │
│  └─ Publish event to event bus                      │
│                                                     │
│  Redis Streams (Event Hub)                          │
│  ├─ Subscribers: Multiple consumer groups           │
│  ├─ Retention: 24 hours                             │
│  └─ Speed: ~100k events/second                      │
│                                                     │
│  Subscribers (Parallel Processing):                 │
│  ├─ Notification Service (instant)                  │
│  ├─ Analytics Service (batched)                     │
│  ├─ Achievement Service (sync)                      │
│  ├─ Competition Service (sync)                      │
│  ├─ AI Service (batched)                            │
│  ├─ Dashboard Service (real-time)                   │
│  └─ Reporting Service (batched)                     │
│                                                     │
│  Dead Letter Queue (PostgreSQL)                     │
│  └─ Failed events for manual review                 │
│                                                     │
│  Event Log (PostgreSQL)                             │
│  └─ Complete audit trail (7 years)                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Part 5: Developer Guide

### 5.1 Publishing an Event

```typescript
// In any service (e.g., InvestmentService)

async publishInvestmentMatured(investment: Investment) {
  const event = {
    eventType: 'investment:matured',
    organizationId: investment.organizationId,
    userId: investment.userId,
    payload: {
      investmentId: investment.id,
      principalAmount: investment.amount,
      returnAmount: calculatedReturn,
      totalValue: investment.amount + calculatedReturn,
      // ... other fields
    },
    metadata: {
      userId: getCurrentUser().id,
      ipAddress: request.ip,
      timestamp: new Date().toISOString()
    }
  };
  
  // Publish to event bus
  await eventBus.publish('investment:matured', event);
  
  // Event automatically distributed to all subscribers
}
```

### 5.2 Subscribing to Events

```typescript
// In Notification Service

eventBus.subscribe('investment:matured', async (event) => {
  // Check idempotency
  const cached = await cache.get(`processed:${event.eventId}`);
  if (cached) return cached; // Already processed
  
  // Process event
  const notification = {
    userId: event.userId,
    type: 'success',
    title: 'Your investment matured!',
    body: `€${event.payload.totalValue} distributed`,
    link: `/portfolio/${event.payload.investmentId}`
  };
  
  await notificationService.create(notification);
  
  // Cache result (idempotency)
  await cache.set(`processed:${event.eventId}`, notification, 86400);
  
  return notification;
});
```

---

**Status:** 🔒 LOCKED for Phase 1 Implementation

**Related:**
- [AIOS_MODULE_SYSTEM_ARCHITECTURE.md](AIOS_MODULE_SYSTEM_ARCHITECTURE.md#L35) - Event Bus Module
- [ORGANIZATION_HIERARCHY_AND_COMPANY_AI.md](ORGANIZATION_HIERARCHY_AND_COMPANY_AI.md) - Event examples
