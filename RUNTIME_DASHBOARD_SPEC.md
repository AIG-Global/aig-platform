# Runtime Dashboard Specification

**Date:** 2026-07-06  
**Version:** 1.0  
**Purpose:** Single unified view of entire ecosystem health  

---

## Overview

The **Runtime Dashboard** is Diana's operational command center. It shows:

1. **System Health** — Are all services running?
2. **Applications** — What's active, what's installed?
3. **Data** — Memory, embeddings, storage usage
4. **Operations** — Payments, events, errors
5. **Performance** — Latency, throughput, bottlenecks

**Target Users:** Operations team, developers, status page

---

## Dashboard Architecture

```
┌─────────────────────────────────────────────────────┐
│           Runtime Dashboard UI                      │
│                                                      │
│  Status | Apps | Services | Memory | Ops | Perf   │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Dashboard API  │
        │  (REST + SSE)   │
        └────────┬────────┘
                 │
   ┌─────────────┼─────────────┐
   │             │             │
┌──▼───┐    ┌───▼──┐    ┌────▼─┐
│ DB   │    │Redis │    │ Logs │
└──────┘    └──────┘    └──────┘
```

---

## Screen 1: System Health (Overview)

**Purpose:** 5-minute snapshot of system status  
**Refresh:** Real-time (SSE) or 10-second intervals  

### Layout

```
┌────────────────────────────────────────────────────┐
│  System Health Dashboard                   Updated 30s ago
│
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐
│  │ API Server      │  │ Database        │  │ Cache    │
│  │ ✅ 200ms p95    │  │ ✅ 50ms p95     │  │ ✅ READY │
│  │ 99.9% uptime    │  │ 5 connections   │  │ 8.2 GB   │
│  └─────────────────┘  └─────────────────┘  └──────────┘
│
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐
│  │ Vector DB       │  │ Message Queue   │  │ AI Model │
│  │ ✅ 120ms p95    │  │ ✅ 1.2K msgs/s  │  │ ✅ READY │
│  │ 2.3B embeddings │  │ 15K queue depth │  │ Online   │
│  └─────────────────┘  └─────────────────┘  └──────────┘
│
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐
│  │ Stripe          │  │ Error Rate      │  │ Requests │
│  │ ✅ Connected    │  │ ⚠️ 0.3% (low)   │  │ 12.4K    │
│  │ $2.3K today     │  │ 8 last hour     │  │ /min avg │
│  └─────────────────┘  └─────────────────┘  └──────────┘
└────────────────────────────────────────────────────┘
```

### Component Status Legend

| Status | Color | Meaning |
|--------|-------|---------|
| ✅ | Green | OK, running normally |
| ⚠️ | Orange | Degraded, needs attention |
| ❌ | Red | Down, critical issue |
| ⏱️ | Gray | Starting up, warming up |

### Key Metrics

| Component | Metric | Target | Alert |
|-----------|--------|--------|-------|
| API Server | Response time p95 | <200ms | >500ms |
| Database | Connection time | <50ms | >100ms |
| Vector DB | Query time p95 | <120ms | >300ms |
| Cache | Hit rate | >80% | <60% |
| Error rate | % of requests | <0.1% | >1% |
| Uptime | % availability | 99.9% | <99% |

### Alerts

**Critical (page on-call):**
- API Server down
- Database down
- Vector DB down

**Urgent (Slack alert):**
- Error rate >1%
- Response time p95 >1s
- Error queue >100

**Warning (dashboard notification):**
- Error rate >0.5%
- Response time p95 >500ms
- Cache hit <60%

---

## Screen 2: Applications

**Purpose:** Show installed and active applications  
**Refresh:** On-demand or 1-minute intervals  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Applications                              Add App +
│
│  ┌────────────────────────────────────────────────┐
│  │ Ask Diana                        v1.0.0  ACTIVE │
│  │                                                 │
│  │ Users: 234  Avg Response: 145ms  Uptime: 99.9% │
│  │ ┌──────────────────────────────────────────┐  │
│  │ │████████████████████░░░░  Messages Today: │  │
│  │ │                            1.2K sent     │  │
│  │ └──────────────────────────────────────────┘  │
│  │ [Logs] [Metrics] [Config] [Restart]            │
│  └────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────┐
│  │ Documents                        v1.0.0  ACTIVE │
│  │                                                 │
│  │ Users: 178  Avg Response: 89ms  Uptime: 99.8%  │
│  │ ┌──────────────────────────────────────────┐  │
│  │ │████████████████░░░░░░░░  Documents: 892  │  │
│  │ │                         PDF exports: 234  │  │
│  │ └──────────────────────────────────────────┘  │
│  │ [Logs] [Metrics] [Config] [Restart]            │
│  └────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────┐
│  │ Calendar Integration               v0.1.0 BETA │
│  │                                                 │
│  │ Users: 42  Avg Response: 234ms  Uptime: 95%   │
│  │ ┌──────────────────────────────────────────┐  │
│  │ │████████░░░░░░░░░░░░░░░░░  Events: 156   │  │
│  │ │                                           │  │
│  │ └──────────────────────────────────────────┘  │
│  │ [Logs] [Metrics] [Config] [Restart]            │
│  └────────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Application Metrics

**Per Application:**
- Active users
- Response time (p50, p95)
- Error rate
- Uptime percentage
- Version
- Status (ACTIVE, BETA, ALPHA, DOWN)

### Actions

- **[Logs]** — View application logs
- **[Metrics]** — Detailed performance graphs
- **[Config]** — Application settings
- **[Restart]** — Restart application
- **[Uninstall]** — Remove application

---

## Screen 3: Services

**Purpose:** Monitor backend services and performance  
**Refresh:** Real-time (SSE)  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Services                                          │
│
│  ┌────────────────────────────────────────────────┐
│  │ Identity Service                        ✅      │
│  │ Authentication & RBAC                          │
│  │ Response: 25ms p95 | Throughput: 1.2K/s       │
│  │ Requests today: 1.2M | Errors: 120 (0.01%)    │
│  │ Database: 98% | CPU: 12% | Memory: 256MB      │
│  └────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────┐
│  │ Conversation Service                    ✅      │
│  │ Message streaming & history                     │
│  │ Response: 145ms p95 | Throughput: 340/s       │
│  │ Requests today: 89K | Errors: 42 (0.05%)      │
│  │ Database: 56% | CPU: 28% | Memory: 512MB      │
│  └────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────┐
│  │ Memory Engine                            ✅      │
│  │ Embeddings & semantic search                    │
│  │ Response: 120ms p95 | Throughput: 200/s       │
│  │ Requests today: 45K | Errors: 5 (0.01%)       │
│  │ Vector DB: 78% | CPU: 34% | Memory: 1.2GB     │
│  └────────────────────────────────────────────────┘
│
│  ┌────────────────────────────────────────────────┐
│  │ Document Service                        ✅      │
│  │ Generation & storage                           │
│  │ Response: 89ms p95 | Throughput: 120/s        │
│  │ Requests today: 23K | Errors: 8 (0.03%)       │
│  │ Database: 34% | CPU: 15% | Memory: 384MB      │
│  └────────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Service Details

**Per Service:**
- Status (✅/⚠️/❌)
- Response time (p50, p95, max)
- Throughput (requests/sec)
- Error rate
- Daily stats (requests, errors)
- Resource usage (CPU, Memory, Disk, DB connections)

### Service Dependencies

```
Identity Service
  └── PostgreSQL

Conversation Service
  ├── PostgreSQL
  ├── Redis
  └── AI Provider

Memory Engine
  ├── Vector DB
  ├── PostgreSQL
  └── Redis

Document Service
  ├── PostgreSQL
  ├── Document storage (S3)
  └── PDF generation service
```

---

## Screen 4: Memory & Data

**Purpose:** Monitor AI memory system and data storage  
**Refresh:** 5-minute intervals  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Memory & Data                                     │
│
│  Embeddings Generated
│  ┌──────────────────────────────────────────────┐
│  │ Last 24h: 45.2K embeddings                   │
│  │ Daily rate: 1.8K embeddings/hour             │
│  │ Total stored: 2.3B                           │
│  │ Index size: 450GB                            │
│  │ ┌──────────────────────────────────────────┐│
│  │ │████████████████████████  Usage: 87%      ││
│  │ └──────────────────────────────────────────┘│
│  └──────────────────────────────────────────────┘
│
│  Conversation Storage
│  ┌──────────────────────────────────────────────┐
│  │ Total conversations: 45.3K                   │
│  │ Total messages: 892.4K                       │
│  │ Avg size per conv: 2.4 MB                    │
│  │ Total storage: 108 GB                        │
│  │ Growth rate: 2.3 GB/day                      │
│  └──────────────────────────────────────────────┘
│
│  Search Performance
│  ┌──────────────────────────────────────────────┐
│  │ Semantic search p95: 120ms                   │
│  │ Queries last hour: 2.4K                      │
│  │ Precision (top-1): 94%                       │
│  │ Cache hit rate: 68%                          │
│  └──────────────────────────────────────────────┘
│
│  Document Storage
│  ┌──────────────────────────────────────────────┐
│  │ Total documents: 23.4K                       │
│  │ Total size: 45 GB                            │
│  │ Avg size: 2.1 MB                             │
│  │ Growth rate: 380 MB/day                      │
│  └──────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Key Metrics

| Metric | Current | Target | Alert |
|--------|---------|--------|-------|
| Embeddings/hour | 1.8K | >1K | <500 |
| Search latency p95 | 120ms | <150ms | >300ms |
| Search precision | 94% | >90% | <80% |
| Cache hit rate | 68% | >70% | <50% |
| Storage utilization | 87% | <90% | >95% |

---

## Screen 5: Operations

**Purpose:** Monitor business/operational metrics  
**Refresh:** Real-time for revenue, 1-hour for other  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Operations                                        │
│
│  Revenue (Today)
│  ┌──────────────────────────────────────────────┐
│  │ Today: $2,340                                 │
│  │ This month: $45,230                           │
│  │ MRR (projected): $1.36M                       │
│  │ ┌──────────────────────────────────────────┐│
│  │ │ $$$$$$$$$  Active subscriptions: 234     ││
│  │ └──────────────────────────────────────────┘│
│  │ Top customers: Acme Corp ($890), Tech Inc    │
│  └──────────────────────────────────────────────┘
│
│  Payments
│  ┌──────────────────────────────────────────────┐
│  │ Stripe: $2.1K (89%) | PayPal: $180 (8%)     │
│  │ Apple Pay: $60 (3%)                          │
│  │ Failed transactions (retry): 3               │
│  │ Chargebacks: 0                               │
│  └──────────────────────────────────────────────┘
│
│  Events & Notifications
│  ┌──────────────────────────────────────────────┐
│  │ Events published (24h): 234.5K               │
│  │ Notifications sent: 45.2K                    │
│  │ Email delivery rate: 98.2%                   │
│  │ Active subscriptions: 3.2K                   │
│  │ Dead letter queue: 12 (review)               │
│  └──────────────────────────────────────────────┘
│
│  Integrations
│  ┌──────────────────────────────────────────────┐
│  │ Calendar: 234 connected (89% active)         │
│  │ Email: 156 connected (72% active)            │
│  │ Slack: 45 connected (91% active)             │
│  │ GitHub: 23 connected (61% active)            │
│  └──────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Business Metrics

| Metric | Today | This Month | MRR |
|--------|-------|-----------|-----|
| Revenue | $2,340 | $45,230 | $1.36M |
| Subscriptions | +12 | +89 | 234 |
| Active users | 1,234 | — | — |
| Churn | 0 | 2.1% | — |

---

## Screen 6: Errors & Logs

**Purpose:** Quickly identify and diagnose issues  
**Refresh:** Real-time  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Errors & Logs                     Last 1 hour     │
│
│  Critical Errors
│  None (good!)
│
│  High Priority
│  ┌──────────────────────────────────────────────┐
│  │ ⚠️  Document export failed (3 occurrences)   │
│  │   Service: Document Service                  │
│  │   Error: PDF generation timeout              │
│  │   First: 45 min ago                          │
│  │   Last: 2 min ago                            │
│  │   [View Details] [Retry] [Dismiss]           │
│  └──────────────────────────────────────────────┘
│
│  Recent Errors
│  ┌──────────────────────────────────────────────┐
│  │ • Identity Service: Invalid token (12)        │
│  │ • Calendar: Integration timeout (5)           │
│  │ • Memory: Vector DB connection reset (2)      │
│  │ • Conversation: Message queue overflow (1)    │
│  └──────────────────────────────────────────────┘
│
│  Error Distribution (Last 24h)
│  ┌──────────────────────────────────────────────┐
│  │ Document Service: 24 (40%)                    │
│  │ Calendar Integration: 18 (30%)                │
│  │ Identity Service: 12 (20%)                    │
│  │ Other: 6 (10%)                                │
│  └──────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Error Severity

| Level | Color | Action | Example |
|-------|-------|--------|---------|
| Critical | Red | Page on-call | API server down |
| High | Orange | Slack + dashboard | High error rate |
| Medium | Yellow | Dashboard notification | Degraded performance |
| Low | Blue | Log only | Non-critical warnings |

---

## Screen 7: Performance Metrics

**Purpose:** Deep dive into system performance  
**Refresh:** Real-time graphs  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Performance                                       │
│
│  API Response Time (Last 1h)
│  ┌──────────────────────────────────────────────┐
│  │                    /\     /\                  │
│  │  p99: 450ms       /  \   /  \                 │
│  │  p95: 200ms      /    \ /    \   /\_          │
│  │  p50: 85ms      /      V       \_/  \         │
│  │  min: 12ms                                    │
│  └──────────────────────────────────────────────┘
│
│  Throughput (Requests/sec)
│  ┌──────────────────────────────────────────────┐
│  │  12K ----                                     │
│  │  10K    ╱ ╲╱╲      ╱─────                     │
│  │  8K    ╱    ╲    ╱     ╲                      │
│  │  6K              Avg: 8.2K req/s              │
│  │  4K                                           │
│  └──────────────────────────────────────────────┘
│
│  Database Performance
│  ┌──────────────────────────────────────────────┐
│  │ Query time p95: 48ms | Connection pool: 45/50│
│  │ Cache hit rate: 78% | Slow queries: 2        │
│  └──────────────────────────────────────────────┘
│
│  Vector DB Performance
│  ┌──────────────────────────────────────────────┐
│  │ Query time p95: 120ms | Index size: 450GB    │
│  │ Recall: 94% | Index rebuild: 2h ago          │
│  └──────────────────────────────────────────────┘
└────────────────────────────────────────────────────┘
```

### Performance Graphs

- **Response time:** p50, p95, p99 over time
- **Throughput:** Requests per second
- **Error rate:** % of failed requests
- **Resource usage:** CPU, memory, disk I/O
- **Database:** Query times, connection pool
- **Cache:** Hit rate, evictions

---

## Screen 8: Alerts & Notifications

**Purpose:** Centralized alert management  
**Refresh:** Real-time  

### Layout

```
┌────────────────────────────────────────────────────┐
│  Alerts & Notifications                    All     │
│                                             ▼
│  Active Alerts (3)
│  ┌──────────────────────────────────────────────┐
│  │ 🔴 Database connection pool at 95%           │
│  │   Severity: HIGH | Triggered: 12 min ago     │
│  │   Action: Scale DB or investigate slow       │
│  │   [Acknowledge] [Investigate] [Resolve]      │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┐
│  │ 🟡 Vector DB query latency elevated (150ms)  │
│  │   Severity: MEDIUM | Triggered: 34 min ago   │
│  │   Action: Check index size, rebuild if needed│
│  │   [Acknowledge] [Investigate] [Resolve]      │
│  └──────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────┐
│  │ 🟡 Error rate above baseline (0.12%)         │
│  │   Severity: MEDIUM | Triggered: 2 min ago    │
│  │   Action: Review error logs                  │
│  │   [Acknowledge] [Investigate] [Resolve]      │
│  └──────────────────────────────────────────────┘
│
│  Resolved Alerts (Last 24h)
│  • Cache memory limit hit (resolved 4h ago)
│  • Stripe API timeout (resolved 8h ago)
│
│  Alert History
│  [View all] [Export] [Settings]
└────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Dashboard Data Endpoints

```
GET /dashboard/health
Response: Overall system status

GET /dashboard/apps
Response: List of installed applications with metrics

GET /dashboard/services
Response: Backend services status and performance

GET /dashboard/memory
Response: Data storage and embedding metrics

GET /dashboard/operations
Response: Revenue, payments, integrations

GET /dashboard/errors
Response: Error logs and incidents

GET /dashboard/metrics
Response: Performance graphs and time-series data

GET /dashboard/alerts
Response: Current alerts and notifications
```

### Server-Sent Events (Real-time)

```
GET /dashboard/stream/health
Streams: Health status updates every 10 seconds

GET /dashboard/stream/errors
Streams: New errors as they occur

GET /dashboard/stream/metrics
Streams: Real-time performance metrics
```

---

## Implementation Details

### Frontend Stack

- **Framework:** React 18+
- **State:** Redux or Zustand
- **Graphs:** Recharts or Chart.js
- **Real-time:** Server-Sent Events
- **Styling:** Tailwind CSS

### Update Frequency

| Data | Refresh Rate | Transport |
|------|--------------|-----------|
| Health | 10 seconds | SSE |
| Metrics | 30 seconds | SSE |
| Errors | Real-time | SSE |
| Apps | On-demand | REST |
| Services | 1 minute | REST |
| Operations | 5 minutes | REST |

### Access Control

- **Admins:** Full access to all screens
- **Operations:** Health, apps, services, errors
- **Developers:** Services, metrics, errors
- **Finance:** Operations, payments only

---

## Success Criteria

✅ All screens load in <2 seconds  
✅ Real-time updates within 100ms  
✅ Graphs render smoothly with 1000+ data points  
✅ Responsive design (works on tablet/mobile)  
✅ Error alerts trigger within 30 seconds  
✅ API endpoints available 99.9% uptime  
✅ Support 10+ concurrent users without lag  

---

**The Runtime Dashboard is the command center for operations.**

*Runtime Dashboard Specification*  
*Version 1.0 | 2026-07-06*  
*Status: Ready for implementation*
