# North Star ONE System Dashboard Specification

**Version:** 0.2.0  
**Status:** Design & Specification  
**Date:** 2026-07-06  
**Purpose:** Operational control center for platform administration and monitoring  

---

## 🎯 Vision

A **single unified dashboard** that gives developers, operators, and administrators complete visibility into:
- All running applications
- All backend services
- System health and metrics
- Real-time events
- Payment processing
- AI provider status
- Plugin availability
- Capability usage

**One dashboard to rule them all.** 📊

---

## 📐 Dashboard Architecture

```
┌─────────────────────────────────────────────────┐
│          North Star ONE Dashboard               │
│         (Real-Time System Control)              │
└──────────┬──────────────────────────────────────┘
           │
        ┌──┴──┬──────┬────────┬──────┬────────┐
        │     │      │        │      │        │
    ┌───▼┐ ┌─▼──┐ ┌─▼───┐ ┌─▼──┐ ┌─▼──┐ ┌──▼───┐
    │App │ │Svc │ │Hlth │ │Pay │ │AI  │ │Event │
    │Mgt │ │Mgt │ │Mgt  │ │Mgt │ │Mgt │ │Mgt  │
    └───┘ └────┘ └─────┘ └────┘ └────┘ └──────┘
      │     │       │       │      │      │
      ▼     ▼       ▼       ▼      ▼      ▼
    [Real-time data from all registries and services]
```

---

## 🏠 Dashboard Home View

### Top Section: System Status
```
╔════════════════════════════════════════════════════════════╗
║                  NORTH STAR ONE STATUS                      ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║  Overall Status: ✓ HEALTHY                                 ║
║  ├─ Services: 4/4 running                                  ║
║  ├─ Apps: 8/8 responsive                                   ║
║  ├─ Uptime: 99.98% (this month)                            ║
║  └─ Last Check: 2 seconds ago                              ║
║                                                             ║
║  Quick Stats:                                               ║
║  ├─ Total Users: 15,234                                    ║
║  ├─ Requests/sec: 234.5                                    ║
║  ├─ Errors/min: 0.5 (0.02%)                                ║
║  └─ Avg Response: 145ms                                    ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Quick Actions Row
```
┌────────────┬──────────────┬────────────┬──────────────┐
│ ▶ Start All │ ⏹ Stop All  │ 🔄 Restart │ 📊 View Logs │
│ Services   │ Services    │ All        │ & Metrics    │
└────────────┴──────────────┴────────────┴──────────────┘
```

### Key Metrics Cards
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  🚀 Throughput   │  │  📈 Performance  │  │  ⚠️ Alerts       │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ 234.5 req/s      │  │ 145ms avg        │  │ 0 critical       │
│ ↑ 12% vs hour    │  │ 98th: 456ms      │  │ 3 warnings       │
│                  │  │ 99th: 789ms      │  │ 12 info          │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 📱 Dashboard Panels (Main Views)

### Panel 1: Services Management

```
╔════════════════════════════════════════════════════════════╗
║                    BACKEND SERVICES                         ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ Identity Service                                            ║
║ ├─ Status: ✓ Healthy          Port: 3001                  ║
║ ├─ Uptime: 99.99%             Version: 0.2.0              ║
║ ├─ Response: 45ms             Connections: 234            ║
║ ├─ Requests: 1,234/s          Errors: 0.1%                ║
║ └─ Last Restart: 45 days ago  [Logs] [Metrics] [Config]  ║
║                                                             ║
║ Document Service                                            ║
║ ├─ Status: ✓ Healthy          Port: 3002                  ║
║ ├─ Uptime: 99.98%             Version: 1.0.0              ║
║ ├─ Response: 78ms             Connections: 189            ║
║ ├─ Requests: 456/s            Errors: 0.2%                ║
║ └─ Last Restart: 30 days ago  [Logs] [Metrics] [Config]  ║
║                                                             ║
║ Payment Service                                             ║
║ ├─ Status: ✓ Healthy          Port: 3003                  ║
║ ├─ Uptime: 99.97%             Version: 1.1.0              ║
║ ├─ Response: 234ms            Connections: 45             ║
║ ├─ Requests: 234/s            Errors: 0.3%                ║
║ └─ Last Restart: 22 days ago  [Logs] [Metrics] [Config]  ║
║                                                             ║
║ Event Bus                                                   ║
║ ├─ Status: ✓ Healthy          Port: 3004                  ║
║ ├─ Uptime: 99.99%             Version: 0.1.0              ║
║ ├─ Response: 12ms             Queue Depth: 0              ║
║ ├─ Requests: 2,345/s          Errors: 0.0%                ║
║ └─ Last Restart: 56 days ago  [Logs] [Metrics] [Config]  ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 2: Running Applications

```
╔════════════════════════════════════════════════════════════╗
║                    RUNNING APPLICATIONS                     ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ Academy                          ✓ Running                 ║
║ ├─ Status: Production            Users: 234                ║
║ ├─ Version: 1.0.0                Requests: 89/s            ║
║ ├─ Started: 23 hours ago         Uptime: 99.99%            ║
║ ├─ CPU: 12%  Memory: 234MB       Errors: 0.1%              ║
║ └─ [Details] [Logs] [Config] [Restart] [Stop]             ║
║                                                             ║
║ Marketplace                      ✓ Running                 ║
║ ├─ Status: Production            Users: 156                ║
║ ├─ Version: 0.9.2                Requests: 45/s            ║
║ ├─ Started: 18 hours ago         Uptime: 99.98%            ║
║ ├─ CPU: 8%   Memory: 178MB       Errors: 0.2%              ║
║ └─ [Details] [Logs] [Config] [Restart] [Stop]             ║
║                                                             ║
║ Ask Diana                        ✓ Running                 ║
║ ├─ Status: Production            Users: 2,340              ║
║ ├─ Version: 0.1.1                Requests: 234/s           ║
║ ├─ Started: 5 days ago           Uptime: 99.97%            ║
║ ├─ CPU: 45%  Memory: 567MB       Errors: 0.1%              ║
║ └─ [Details] [Logs] [Config] [Restart] [Stop]             ║
║                                                             ║
║ Beam Me Up                       ✓ Running                 ║
║ ├─ Status: Production            Jobs: 45                  ║
║ ├─ Version: 1.2.0                Active: 12                ║
║ ├─ Started: 2 days ago           Uptime: 99.99%            ║
║ ├─ CPU: 23%  Memory: 345MB       Errors: 0.0%              ║
║ └─ [Details] [Logs] [Config] [Restart] [Stop]             ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 3: System Health

```
╔════════════════════════════════════════════════════════════╗
║                      SYSTEM HEALTH                          ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ Infrastructure                                              ║
║ ├─ Database                    ✓ Healthy                   ║
║ │  ├─ Connections: 234/500                                │
║ │  ├─ Query time: 12ms (avg)                              │
║ │  ├─ Memory: 2.3GB / 8GB                                 │
║ │  └─ Uptime: 287 days                                    │
║ │                                                          ║
║ ├─ Cache (Redis)               ✓ Healthy                   ║
║ │  ├─ Memory: 1.2GB / 2GB                                 │
║ │  ├─ Hit Rate: 87%                                       │
║ │  ├─ Operations: 45k/s                                   │
║ │  └─ Uptime: 203 days                                    │
║ │                                                          ║
║ ├─ Message Queue               ✓ Healthy                   ║
║ │  ├─ Queue Depth: 0                                      │
║ │  ├─ Throughput: 2.3k msgs/s                             │
║ │  ├─ Latency: 45ms                                       │
║ │  └─ Uptime: 156 days                                    │
║ │                                                          ║
║ ├─ Storage                     ✓ Healthy                   ║
║ │  ├─ Used: 567GB / 2TB                                   │
║ │  ├─ I/O: 234MB/s                                        │
║ │  ├─ Latency: 8ms                                        │
║ │  └─ Backup: Last 24h ago                                ║
║ │                                                          ║
║ └─ Network                     ✓ Healthy                   ║
║    ├─ Bandwidth: 234 Mbps / 1 Gbps                        ║
║    ├─ Latency: 5ms                                        ║
║    ├─ Errors: 0                                           ║
║    └─ Uptime: 312 days                                    ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 4: AI Provider Status

```
╔════════════════════════════════════════════════════════════╗
║                   AI PROVIDER STATUS                        ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ OpenAI                                                      ║
║ ├─ Status: ✓ Healthy                                       ║
║ ├─ Model: gpt-4-turbo                                      ║
║ ├─ Avg Latency: 876ms                                      ║
║ ├─ Success Rate: 99.8%                                     ║
║ ├─ Requests Today: 12,345                                  ║
║ ├─ Tokens Used: 12.3M / 100M limit                         ║
║ ├─ Cost This Month: $2,345                                 ║
║ └─ Next Billing: 24 days                                   ║
║                                                             ║
║ Anthropic                                                   ║
║ ├─ Status: ✓ Healthy                                       ║
║ ├─ Model: claude-3-opus                                    ║
║ ├─ Avg Latency: 645ms                                      ║
║ ├─ Success Rate: 99.9%                                     ║
║ ├─ Requests Today: 8,234                                   ║
║ ├─ Tokens Used: 8.9M / 50M limit                           ║
║ ├─ Cost This Month: $1,456                                 ║
║ └─ Next Billing: 18 days                                   ║
║                                                             ║
║ Model Failover Strategy:                                    ║
║ ├─ Primary: OpenAI (gpt-4-turbo)                           ║
║ ├─ Secondary: Anthropic (claude-3-opus)                    ║
║ └─ Failover Triggers: Latency > 2s OR Error rate > 1%     ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 5: Capability Usage (Last Hour)

```
╔════════════════════════════════════════════════════════════╗
║            CAPABILITY USAGE (LAST HOUR)                    ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ learning                                                    ║
║ ████████████░░░░░░░░░░░░  234 invocations (25%)           ║
║ ├─ Success: 231 (98.7%)    Avg Time: 456ms                ║
║ └─ Errors: 3 (1.3%)        Users: 167                      ║
║                                                             ║
║ payment:process                                             ║
║ ██████░░░░░░░░░░░░░░░░░░   45 invocations (5%)            ║
║ ├─ Success: 45 (100%)      Avg Time: 1234ms               ║
║ └─ Errors: 0 (0%)          Users: 34                       ║
║                                                             ║
║ documents:search                                            ║
║ ████████░░░░░░░░░░░░░░░░   89 invocations (9%)            ║
║ ├─ Success: 87 (97.8%)     Avg Time: 234ms                ║
║ └─ Errors: 2 (2.2%)        Users: 56                       ║
║                                                             ║
║ backup:start                                                ║
║ ██░░░░░░░░░░░░░░░░░░░░░░   12 invocations (1%)            ║
║ ├─ Success: 12 (100%)      Avg Time: 5678ms               ║
║ └─ Errors: 0 (0%)          Users: 5                        ║
║                                                             ║
║ purchase                                                    ║
║ ██████████░░░░░░░░░░░░░░   156 invocations (17%)          ║
║ ├─ Success: 154 (98.7%)    Avg Time: 789ms                ║
║ └─ Errors: 2 (1.3%)        Users: 123                      ║
║                                                             ║
║ [Other capabilities: 464 total invocations this hour]     ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 6: Payment Status (Today)

```
╔════════════════════════════════════════════════════════════╗
║                 PAYMENT STATUS (TODAY)                      ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ Summary                                                     ║
║ ├─ Total Processed: $45,678.90                             ║
║ ├─ Transaction Count: 234                                  ║
║ ├─ Success Rate: 98.76%                                    ║
║ ├─ Failed: $567.80 (1.24%)                                 ║
║ └─ In Progress: $234.50 (0.51%)                            ║
║                                                             ║
║ By Provider                                                 ║
║ ├─ Stripe       $30,450.00 (66.6%)   ✓ 234 transactions   ║
║ │  └─ Success: 99.1% (232/234)                            ║
║ │                                                          ║
║ └─ PayPal       $15,228.90 (33.3%)   ✓ 234 transactions   ║
║    └─ Success: 98.3% (230/234)                            ║
║                                                             ║
║ By Transaction Type                                         ║
║ ├─ One-time: $28,456.78 (62.2%)                            ║
║ ├─ Subscription: $17,222.12 (37.7%)                        ║
║ └─ Refund: -$0.00 (0.0%)                                   ║
║                                                             ║
║ Recent Transactions                                         ║
║ ├─ 12:45 → $99.99 (Stripe) - Status: Complete            ║
║ ├─ 12:44 → $49.99 (PayPal) - Status: Complete            ║
║ ├─ 12:43 → $199.99 (Stripe) - Status: Complete           ║
║ └─ [View More] [Export Report]                            ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 7: Real-Time Events

```
╔════════════════════════════════════════════════════════════╗
║                    RECENT EVENTS                            ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ 12:47:23 ✓ app.launched        academy by user:u123       ║
║ 12:47:15 ✓ capability.invoked   learning search            ║
║ 12:47:10 ✓ payment.processed    $99.99 via stripe         ║
║ 12:47:05 ✓ user.authenticated   user:u456 login           ║
║ 12:46:58 ✓ document.uploaded    document:d789             ║
║ 12:46:52 ✓ notification.sent    email to user:u234        ║
║ 12:46:45 ✓ backup.completed    2.3GB backup              ║
║ 12:46:38 ⚠️ service.degraded    payment-service latency   ║
║ 12:46:32 ✓ plugin.loaded        stripe payment plugin     ║
║ 12:46:25 ✓ certificate.claimed  cert:c567 by user:u789   ║
║                                                             ║
║ [Filter by Type] [Export] [Clear]                         ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Panel 8: Alerts & Incidents

```
╔════════════════════════════════════════════════════════════╗
║               ALERTS & INCIDENTS                            ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║ Critical (0)                                                ║
║ └─ None                                                     ║
║                                                             ║
║ Warning (3)                                                 ║
║ ├─ ⚠️ Payment Service Latency                               ║
║ │  ├─ Duration: 45 seconds                                ║
║ │  ├─ Avg Latency: 456ms (normal: 234ms)                  ║
║ │  ├─ Started: 12:30                                      ║
║ │  └─ [Details] [Resolve]                                 ║
║ │                                                          ║
║ ├─ ⚠️ Cache Hit Rate Low                                    ║
║ │  ├─ Duration: 2 minutes                                 ║
║ │  ├─ Hit Rate: 76% (target: 85%)                         ║
║ │  ├─ Started: 12:28                                      ║
║ │  └─ [Details] [Resolve]                                 ║
║ │                                                          ║
║ └─ ⚠️ Disk Usage High                                       ║
║    ├─ Duration: 10 minutes                                ║
║    ├─ Usage: 85% (warning threshold: 80%)                 ║
║    ├─ Started: 12:20                                      ║
║    └─ [Details] [Cleanup] [Expand Storage]                ║
║                                                             ║
║ Info (12)                                                   ║
║ ├─ ℹ️ Scheduled Maintenance Tomorrow 2:00 AM              ║
║ ├─ ℹ️ Database Replication Lag: 45ms                      ║
║ ├─ ℹ️ Backup Started (automatic)                          ║
║ └─ [Show All]                                              ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🔧 Dashboard Features

### 1. Real-Time Monitoring
- Data refreshes every 5 seconds
- WebSocket connection for live updates
- Historical charts (6 hours, 24 hours, 7 days, 30 days)

### 2. Filtering & Search
- Filter services by status, type, owner
- Search for specific app/service/capability
- Save custom filter views

### 3. Quick Actions
- Start/stop individual services
- Restart failed components
- View logs and config files
- Update service configuration

### 4. Historical Analysis
- View metrics over time
- Identify trends and patterns
- Compare performance across periods
- Generate reports

### 5. Alerts & Notifications
- Set custom alert thresholds
- Email/Slack notifications
- Incident tracking
- Escalation workflows

### 6. Access Control
- Role-based dashboard access
- Admin view (all components)
- Developer view (limited to team)
- Read-only audit view

---

## 📊 Dashboard Data Sources

```
Dashboard ← North Star ONE Runtime
           ├─ App Registry (current apps)
           ├─ Service Registry (service status)
           ├─ Health Registry (metrics & uptime)
           ├─ Event Registry (real-time events)
           ├─ Capability Registry (usage stats)
           ├─ Payment Registry (transaction data)
           ├─ Plugin Registry (plugin status)
           └─ Infrastructure APIs (system metrics)
```

---

## 🏗️ Dashboard Architecture

```
┌──────────────────────────────────────────┐
│         Dashboard Frontend               │
│     (React/Vue + Real-time charting)     │
└────────────┬─────────────────────────────┘
             │
        ┌────▼─────────────┐
        │  WebSocket API   │
        │  (Live updates)  │
        └────┬─────────────┘
             │
┌────────────▼──────────────────────────────┐
│    Dashboard Service (NestJS)             │
│  ├─ Aggregates registry data              │
│  ├─ Computes metrics                      │
│  ├─ Tracks alerts                         │
│  └─ Serves REST + WebSocket               │
└────────────┬──────────────────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
 Health   Event    Payment
 Reg.     Reg.     Reg.
```

---

## 🚀 Implementation Plan

### Phase 1: Core Dashboard (Week 1)
- [ ] Build basic dashboard UI layout
- [ ] Implement service status panel
- [ ] Implement app status panel
- [ ] Add system health panel
- [ ] Connect to registries

### Phase 2: Advanced Monitoring (Week 2)
- [ ] Build real-time event stream
- [ ] Add payment status panel
- [ ] Add AI provider status
- [ ] Add capability usage charts
- [ ] Implement alerts system

### Phase 3: Interactive Features (Week 3)
- [ ] Add quick action buttons
- [ ] Implement service restart
- [ ] Add log viewer
- [ ] Add configuration editor
- [ ] Build search/filter

### Phase 4: Analytics & Reporting (Week 4)
- [ ] Historical metrics storage
- [ ] Advanced charts and graphs
- [ ] Report generation
- [ ] Export capabilities
- [ ] Performance optimization

---

## 💾 Dashboard Storage

```
Dashboard-DB
├── Metrics History
│   ├─ Service response times (hourly)
│   ├─ App performance (hourly)
│   ├─ Payment volume (daily)
│   └─ Event counts (daily)
│
├── Alerts
│   ├─ Alert definitions
│   ├─ Alert history
│   ├─ Incident tracking
│   └─ Escalations
│
└── User Preferences
    ├─ Dashboard layouts
    ├─ Favorite views
    ├─ Alert settings
    └─ Notification preferences
```

---

## 🔐 Dashboard Security

- **Authentication**: Required for all access
- **Authorization**: Role-based (admin, developer, viewer)
- **Audit Log**: All dashboard actions logged
- **Data Protection**: Sensitive data masked in UI
- **API Security**: Rate-limited, validates input

---

## 📱 Responsive Design

- **Desktop**: Full dashboard with all panels
- **Tablet**: Collapsible panels, touch-optimized
- **Mobile**: Essential metrics only, swipeable

---

## ✅ Success Criteria

- [ ] Dashboard loads in < 2 seconds
- [ ] Data updates in real-time (< 5s latency)
- [ ] All 8 panels functional
- [ ] Can control all services
- [ ] Alerts working correctly
- [ ] Mobile responsive
- [ ] No performance degradation
- [ ] 100% test coverage

---

## 🎯 Dashboard Usage Scenarios

### Scenario 1: Daily Health Check
Admin opens dashboard → Sees all green ✓ → Closes it. Done.

### Scenario 2: Performance Investigation
1. Developer notices slow response times
2. Opens Dashboard → Goes to Services panel
3. Sees payment-service latency is high
4. Clicks service → Views logs → Finds issue
5. Takes action (restart, scale, etc.)

### Scenario 3: Payment Reconciliation
1. Finance team opens payment panel
2. Reviews daily totals by provider
3. Exports transaction report
4. Reconciles with accounting system

### Scenario 4: Incident Response
1. Alert triggers for critical issue
2. Admin receives notification
3. Opens dashboard → Sees incident details
4. Views affected services/apps
5. Takes immediate action
6. Tracks resolution in dashboard

---

## 🔮 Future Enhancements

### AI-Powered Insights
- Diana analyzes dashboard data
- Proactively alerts about anomalies
- Recommends optimization actions

### Predictive Analytics
- ML models predict failures
- Capacity planning recommendations
- Seasonal trend analysis

### Multi-Tenant Dashboard
- Each tenant sees only their data
- Shared infrastructure metrics
- Usage-based billing dashboard

### Mobile App
- Native iOS/Android app
- Push notifications
- Quick action shortcuts

---

**One dashboard. Complete visibility. Full control.** 🎛️

The System Dashboard transforms North Star ONE from a collection of services into a coherent, manageable, observable system.
