# North Star ONE Runtime v0.2: The Capability-Driven Ecosystem

**Version:** 0.2.0 (Future State)  
**Status:** Architecture & Design  
**Date:** 2026-07-06  
**Phase:** Detailed Specification for next sprint  

---

## 🎯 Vision: From Platform to Runtime

### Today (v0.1)
```
User asks: "Open Academy"
System: Launches academy application
Flow: Hardcoded knowledge of Academy → App
```

**Problem:** User must know app names. System hardcodes app knowledge.

### Tomorrow (v0.2)
```
User asks: "Diana, I want to learn Kubernetes"
System: Searches capabilities for "learning"
Flow: Natural intent → Capability query → Service discovery → Diana orchestrates
Result: Academy opens transparently, conversation continues focused on goal
```

**Solution:** Apps describe what they do. Diana finds what's needed. System self-describes.

---

## 🏗️ North Star ONE Runtime Architecture (v0.2)

```
┌─────────────────────────────────────────────────────────────┐
│                    DIANA (Orchestrator)                      │
│              Natural Language Intent → Actions               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │   North Star ONE Runtime        │
        │   (Self-Describing Ecosystem)   │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐  ┌──────▼──────┐  ┌─────▼────┐
   │Registries │  │  Services   │  │Management│
   └────┬─────┘  └──────┬──────┘  └─────┬────┘
        │                │               │
   ┌────┴──────────────┬─┴───────────────┴────┐
   │                   │                      │
   ├─ App Registry     ├─ Identity Service    ├─ Validators
   ├─ Capability Reg.  ├─ Document Service   ├─ Health Check
   ├─ Service Reg.     ├─ Payment Service    ├─ Orchestration
   ├─ Plugin Registry  ├─ Event Bus          ├─ Dependency Mgmt
   ├─ Skill Registry   ├─ Notification Hub   └─ Error Handling
   ├─ Payment Registry ├─ AI Provider Layer
   ├─ Health Registry  └─ Plugin Manager
   └─ Event Registry
        │
        │ (Self-Describing)
        │
   All queries answered by registries
   All operations metadata-driven
   All scaling automatic
```

---

## 📋 The 8 Core Registries

### 1. App Registry (Enhanced)
Apps that run on the platform.

```json
{
  "id": "academy",
  "name": "Academy",
  "version": "1.0.0",
  "owner": "AIG",
  "status": "production",
  "category": "learning",
  
  "metadata": {
    "permissions": ["identity", "payments", "notifications"],
    "dependencies": ["identity", "documents"],
    "capabilities": ["learning", "certification"],
    "endpoints": ["/courses", "/certificates", "/learning-paths"],
    "exportedServices": []
  },
  
  "operations": {
    "install": { "requires": ["identity"], "timeout": 30000 },
    "update": { "requires": ["identity"], "timeout": 30000 },
    "uninstall": { "requires": ["identity"], "timeout": 10000 },
    "health": { "endpoint": "/health", "interval": 5000 }
  },
  
  "registry_entry": {
    "published_at": "2026-07-01T00:00:00Z",
    "last_updated": "2026-07-06T12:00:00Z",
    "maintainer": "engineering@aig.com",
    "support_url": "https://github.com/AIG-Global/aig-platform/issues"
  }
}
```

### 2. Capability Registry (NEW)
What each app can do. Enables intent-based discovery.

```json
{
  "id": "learning",
  "name": "Learning",
  "type": "capability",
  "provider": "academy",
  "version": "1.0.0",
  "description": "Access and manage learning content and courses",
  
  "sub_capabilities": [
    {
      "id": "courses",
      "name": "Courses",
      "description": "View, enroll, and manage courses",
      "endpoint": "/courses",
      "operations": ["list", "get", "enroll", "view-progress"]
    },
    {
      "id": "certifications",
      "name": "Certifications",
      "description": "Earn and manage certifications",
      "endpoint": "/certificates",
      "operations": ["list", "get", "claim", "view-transcript"]
    },
    {
      "id": "learning-paths",
      "name": "Learning Paths",
      "description": "Follow structured learning journeys",
      "endpoint": "/learning-paths",
      "operations": ["browse", "enroll", "get-progress"]
    },
    {
      "id": "quizzes",
      "name": "Quizzes",
      "description": "Take assessments and quizzes",
      "endpoint": "/quizzes",
      "operations": ["list", "take", "review-results"]
    }
  ],
  
  "keywords": ["education", "courses", "learning", "certification"],
  "requires": ["identity", "documents"],
  "permissions": ["identity:read", "documents:read", "documents:write"],
  
  "diana_queries": [
    "I want to learn {topic}",
    "What courses are available?",
    "Show me my certificates",
    "What's my learning progress?",
    "Take a quiz"
  ],
  
  "diana_prompts": [
    "I found {count} courses for {topic}. Shall I enroll you?"
  ]
}
```

### 3. Service Registry
Backend services and APIs.

```json
{
  "id": "identity-service",
  "name": "Identity Service",
  "version": "0.2.0",
  "type": "backend-service",
  "status": "production",
  "port": 3001,
  
  "metadata": {
    "owner": "engineering@aig.com",
    "team": "platform",
    "tier": "critical"
  },
  
  "endpoints": [
    {
      "path": "/auth/login",
      "method": "POST",
      "description": "User authentication",
      "auth": "public",
      "capabilities": []
    },
    {
      "path": "/auth/verify",
      "method": "GET",
      "description": "Verify JWT token",
      "auth": "bearer",
      "capabilities": []
    }
  ],
  
  "dependencies": [],
  "provides": ["authentication", "authorization", "rbac"],
  
  "health": {
    "endpoint": "/health",
    "interval": 5000,
    "timeout": 2000
  },
  
  "operations": {
    "start": "npm run start",
    "stop": "npm run stop",
    "restart": "npm run restart",
    "logs": "npm run logs"
  }
}
```

### 4. Skill Registry
AI agent capabilities and tools.

```json
{
  "id": "course-enrollment",
  "name": "Course Enrollment",
  "type": "skill",
  "category": "learning",
  "version": "1.0.0",
  
  "description": "Enable Diana to help users enroll in courses",
  
  "capabilities": {
    "search": {
      "description": "Search for courses",
      "input": { "query": "string", "category": "string?" },
      "output": { "courses": "Course[]", "count": "number" }
    },
    "enroll": {
      "description": "Enroll user in a course",
      "input": { "courseId": "string", "userId": "string" },
      "output": { "success": "boolean", "enrollmentId": "string" }
    },
    "get_progress": {
      "description": "Get user's course progress",
      "input": { "enrollmentId": "string" },
      "output": { "progress": "number", "completed": "boolean" }
    }
  },
  
  "permissions": ["identity:read", "academy:read", "academy:write"],
  "dependencies": ["learning", "identity"],
  
  "diana_integration": {
    "prompts": [
      "Help users find and enroll in courses",
      "Provide learning recommendations",
      "Track course progress"
    ],
    "example_interactions": [
      {
        "user": "I want to learn Kubernetes",
        "diana": "I found 5 courses on Kubernetes. The 'Kubernetes for Beginners' course has the best reviews. Would you like to enroll?"
      }
    ]
  }
}
```

### 5. Plugin Registry
Third-party integrations.

```json
{
  "id": "stripe",
  "name": "Stripe Payment Plugin",
  "type": "payment-provider",
  "version": "2.0.0",
  "status": "production",
  
  "integration": {
    "type": "provider",
    "method": "rest-api",
    "baseUrl": "https://api.stripe.com/v1",
    "auth": "bearer-token"
  },
  
  "capabilities": {
    "process_payment": {
      "endpoint": "/charges",
      "method": "POST",
      "description": "Process a payment"
    },
    "create_subscription": {
      "endpoint": "/subscriptions",
      "method": "POST",
      "description": "Create recurring subscription"
    },
    "get_invoice": {
      "endpoint": "/invoices/{id}",
      "method": "GET",
      "description": "Retrieve invoice"
    }
  },
  
  "configuration": {
    "required": ["STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET"],
    "optional": ["STRIPE_ACCOUNT_ID"]
  },
  
  "fallback_provider": "paypal",
  "max_retry_attempts": 3
}
```

### 6. Payment Registry
Payment methods and providers.

```json
{
  "id": "payment-orchestrator",
  "name": "Payment Orchestrator",
  "version": "1.0.0",
  
  "providers": [
    {
      "id": "stripe",
      "name": "Stripe",
      "priority": 1,
      "status": "production",
      "supported_methods": ["card", "bank_transfer", "apple_pay"],
      "health": { "status": "healthy", "last_check": "2026-07-06T12:00:00Z" }
    },
    {
      "id": "paypal",
      "name": "PayPal",
      "priority": 2,
      "status": "production",
      "supported_methods": ["paypal", "venmo"],
      "health": { "status": "healthy", "last_check": "2026-07-06T12:00:00Z" }
    }
  ],
  
  "transaction_registry": {
    "total_processed": 15234,
    "total_volume": "$456,789.00",
    "successful_rate": 0.9876,
    "avg_processing_time_ms": 2341
  }
}
```

### 7. Health Registry
System health and metrics.

```json
{
  "id": "system-health",
  "timestamp": "2026-07-06T12:00:00Z",
  
  "services": {
    "identity": { "status": "healthy", "uptime": 0.9999, "response_time_ms": 45 },
    "documents": { "status": "healthy", "uptime": 0.9998, "response_time_ms": 78 },
    "payments": { "status": "healthy", "uptime": 0.9997, "response_time_ms": 234 }
  },
  
  "apps": {
    "academy": { "status": "healthy", "uptime": 0.9999, "response_time_ms": 56 },
    "marketplace": { "status": "healthy", "uptime": 0.9998, "response_time_ms": 89 }
  },
  
  "ai_providers": {
    "openai": { "status": "healthy", "latency_ms": 876 },
    "anthropic": { "status": "healthy", "latency_ms": 645 }
  },
  
  "plugins": {
    "stripe": { "status": "healthy", "availability": 0.9999 },
    "redis": { "status": "healthy", "memory_usage": "45%" }
  },
  
  "infrastructure": {
    "database": { "status": "healthy", "connections": 234, "query_time_ms": 12 },
    "cache": { "status": "healthy", "hit_rate": 0.87 },
    "message_queue": { "status": "healthy", "queue_depth": 0 }
  },
  
  "system_status": "healthy",
  "incident_count": 0,
  "warning_count": 1
}
```

### 8. Event Registry
System events and audit trail.

```json
{
  "id": "event-registry",
  "description": "Real-time event stream for system activities",
  
  "event_types": [
    {
      "id": "app.launched",
      "description": "Application started",
      "schema": {
        "app_id": "string",
        "timestamp": "ISO8601",
        "user_id": "string",
        "intent": "string"
      }
    },
    {
      "id": "capability.invoked",
      "description": "A capability was used",
      "schema": {
        "capability": "string",
        "app_id": "string",
        "timestamp": "ISO8601",
        "user_id": "string"
      }
    },
    {
      "id": "service.health_changed",
      "description": "Service health status changed",
      "schema": {
        "service_id": "string",
        "old_status": "string",
        "new_status": "string",
        "timestamp": "ISO8601"
      }
    }
  ],
  
  "subscriptions": [
    {
      "id": "diana-event-stream",
      "events": ["app.launched", "capability.invoked", "error.occurred"],
      "handler": "diana-orchestrator"
    }
  ]
}
```

---

## 💡 How Diana Uses This

### Query Flow

```
User: "Diana, I want to learn Kubernetes"
       │
       ├─ Diana processes intent: "Learn + Kubernetes"
       │
       ├─ Diana queries Capability Registry:
       │   "Find capability where keywords contains 'learning'"
       │   Result: [learning, courses, learning-paths]
       │
       ├─ Diana queries App Registry:
       │   "Which app provides 'learning' capability?"
       │   Result: academy v1.0.0
       │
       ├─ Diana queries Capability Registry (detailed):
       │   "What operations in 'learning' match 'Kubernetes'?"
       │   Result: [courses.search, courses.enroll]
       │
       ├─ Diana calls Skill Registry:
       │   "Execute 'course-enrollment.search' with query='Kubernetes'"
       │   Result: 5 courses with ratings
       │
       ├─ Diana orchestrates:
       │   ├─ Launch: academy app
       │   ├─ Pre-load: Kubernetes course results
       │   ├─ Maintain: user context
       │   └─ Continue: conversation on learning goal
       │
       └─ Response to user:
           "I found 5 courses on Kubernetes. The 'Kubernetes for Beginners' 
            course has 4.9 stars and 2,300 reviews. Shall I enroll you?"
```

### Key Insight
Diana doesn't say "Opening Academy."
Diana says "I found Kubernetes courses" and maintains context around **the user's goal**, not the application.

---

## 🎛️ System Dashboard (New)

The operational control center for developers and administrators.

### Dashboard Overview
```
┌──────────────────────────────────────────────────────────────┐
│                 NORTH STAR ONE Dashboard                      │
│                   System Control Center                       │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
│  System Status  │  │   Key Metrics    │  │  Quick Actions │
├─────────────────┤  ├──────────────────┤  ├────────────────┤
│ ✓ Healthy       │  │ Uptime: 99.98%   │  │ ▶ Start All    │
│ Services: 4/4   │  │ Requests: 2.3M   │  │ ⏹ Stop All     │
│ Apps: 8/8       │  │ Errors: 0.02%    │  │ 🔄 Restart     │
│ Plugins: 6/6    │  │ Users: 15,234    │  │ 📊 View Logs   │
└─────────────────┘  └──────────────────┘  └────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      Services                                 │
├──────────────────────────────────────────────────────────────┤
│ Identity      ✓ Healthy  3001  Uptime 99.99%  Response 45ms  │
│ Documents     ✓ Healthy  3002  Uptime 99.98%  Response 78ms  │
│ Payments      ✓ Healthy  3003  Uptime 99.97%  Response 234ms │
│ Event Bus     ✓ Healthy  3004  Uptime 99.99%  Response 12ms  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    Running Apps                               │
├──────────────────────────────────────────────────────────────┤
│ Academy       ✓ Running  Users: 234    Requests: 89/s        │
│ Marketplace   ✓ Running  Users: 156    Requests: 45/s        │
│ Ask Diana     ✓ Running  Users: 2,340  Requests: 234/s       │
│ Beam Me Up    ✓Running  Jobs: 45      Active: 12            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  AI Provider Status                            │
├──────────────────────────────────────────────────────────────┤
│ OpenAI        ✓ Healthy  Latency: 876ms   Tokens: 12.3M     │
│ Anthropic     ✓ Healthy  Latency: 645ms   Tokens: 8.9M      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              Capability Usage (Last Hour)                     │
├──────────────────────────────────────────────────────────────┤
│ learning          ████████████░░  234 invocations            │
│ payment:process   ██████░░░░░░░░   45 invocations            │
│ documents:search  ████████░░░░░░   89 invocations            │
│ backup:start      ██░░░░░░░░░░░░   12 invocations            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                 Payment Status (Today)                        │
├──────────────────────────────────────────────────────────────┤
│ Processed: $45,678.90    Success Rate: 98.76%               │
│ Stripe: $30,450.00 (67%)  PayPal: $15,228.90 (33%)         │
│ Failed: $567 (1.24%)      In Progress: $234.50              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      Recent Events                            │
├──────────────────────────────────────────────────────────────┤
│ 12:15 → app.launched (academy) by user:u123               │
│ 12:14 → capability.invoked (learning) from academy        │
│ 12:13 → service.health_changed (documents) healthy→ok     │
│ 12:12 → payment.processed $499.99 via stripe              │
│ 12:11 → backup.completed (beam-me-up) 2.3GB               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Evolution Path: v0.1 → v0.2

### v0.1 (Current)
- ✅ App Registry (apps describe themselves)
- ✅ Service Registry (services registered)
- ✅ Basic plugin support
- ✅ Health monitoring

### v0.2 (Next Sprint)
- ✨ **Capability Registry** (apps publish what they can do)
- ✨ **Intent-Based Discovery** (find services by capability, not app name)
- ✨ **Metadata-Driven Operations** (install/update/uninstall automatically)
- ✨ **Diana Orchestration** (natural language control)
- ✨ **Event Registry** (audit trail and real-time events)
- ✨ **Payment Registry** (multi-provider with failover)
- ✨ **Health Registry** (comprehensive system metrics)
- ✨ **System Dashboard** (operational control center)

### v0.3 (Future)
- Machine learning-driven recommendations
- Autonomous app lifecycle management
- Advanced Diana personality traits
- Multi-tenant isolation
- Advanced security & audit logging

---

## 🚀 Implementation Priority (v0.2)

### Phase 1: Core Registries (Week 1-2)
1. Enhance App Registry with metadata
2. Create Capability Registry
3. Create Service Registry enhancements
4. Add Skill Registry structure

**Dependencies resolved:** Registries self-describing

### Phase 2: Diana Integration (Week 2-3)
1. Update Diana to query Capability Registry
2. Implement intent→capability matching
3. Add app lifecycle orchestration
4. Test natural language flows

**Dependencies resolved:** Diana can orchestrate

### Phase 3: Operational Infrastructure (Week 3-4)
1. Create Event Registry
2. Create Payment Registry
3. Create Health Registry
4. Build System Dashboard

**Dependencies resolved:** Platform is observable and manageable

### Phase 4: Testing & Refinement (Week 4-5)
1. End-to-end testing
2. Performance optimization
3. Documentation
4. Release v0.2.0

---

## 💎 Key Design Principles

### 1. Self-Description
Every component describes its own capabilities, requirements, and operations. No hardcoding.

### 2. Intent-Based
Users express goals, not app names. System finds implementation.

### 3. Metadata-Driven
Operations are determined by metadata, not hardcoded logic.

### 4. Event-Driven
Every significant action generates events for monitoring and audit.

### 5. Observable
Dashboard provides real-time visibility into all system components.

### 6. Resilient
Multiple AI providers, payment providers, automatic failover.

### 7. Scalable
New apps, services, capabilities can be added without code changes.

---

## 🎯 Success Criteria for v0.2

### Functional
- ✅ Capability Registry fully implemented
- ✅ Diana can execute user intent without app names
- ✅ All registries queryable via REST API
- ✅ Event stream working
- ✅ Dashboard displays all system metrics

### Performance
- ✅ Capability lookup < 50ms
- ✅ App launch < 2s (when not already running)
- ✅ Event processing < 100ms
- ✅ Dashboard update interval < 5s

### Reliability
- ✅ 99.9% system uptime
- ✅ Zero data loss in events
- ✅ Automatic failover working
- ✅ Health checks running every 5s

### User Experience
- ✅ Diana responds to 5+ natural language intent variations
- ✅ Users don't need to know app names
- ✅ Context maintained across app transitions
- ✅ Conversation feels seamless

---

## 📚 Registry Files to Update

```
packages/registry/
├── apps.json (enhanced with metadata)
├── capabilities.json (NEW)
├── services.json (enhanced with operations)
├── skills.json (updated with Diana integration)
├── plugins.json (enhanced with capabilities)
├── payments.json (NEW)
├── health.json (NEW - auto-generated)
└── events.json (NEW - real-time stream)
```

---

## 🔮 Why This Matters

This evolution **transforms the architecture from rigid to organic**:

**Before (v0.1):**
```
User → App Name → Application
Problem: User must know app names
```

**After (v0.2):**
```
User → Natural Intent → Capability Query → Service Discovery → Diana Orchestrates → Transparent
Benefit: User focuses on goals, system handles implementation
```

**Scaling Implication:**
```
v0.1: Adding a new app requires code changes
v0.2: Adding a new app = just register in AppRegistry
       Diana automatically discovers and offers it
```

This is how you build a truly extensible platform.

---

## 📖 Implementation Checklist for v0.2

### Week 1: Registries
- [ ] Update AppRegistry schema
- [ ] Design CapabilityRegistry
- [ ] Create Service Registry enhancements
- [ ] Create Skill Registry updates
- [ ] Implement all 4 registries

### Week 2: Diana Integration
- [ ] Add capability query method to Diana
- [ ] Implement intent→capability matching
- [ ] Update Diana orchestrator
- [ ] Test 10 natural language flows
- [ ] Create example interactions

### Week 3: Infrastructure
- [ ] Create EventRegistry
- [ ] Create PaymentRegistry
- [ ] Create HealthRegistry (auto-generating)
- [ ] Hook up health checks
- [ ] Test event streaming

### Week 4: Dashboard
- [ ] Design Dashboard UI
- [ ] Build system status view
- [ ] Build services panel
- [ ] Build metrics visualization
- [ ] Add real-time updates

### Week 5: Testing & Launch
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Documentation
- [ ] Team training
- [ ] Release v0.2.0

---

## 🎉 The Big Picture

By implementing v0.2, the AIG platform transforms from:

**Collection of Apps** → **Unified, Intelligent Ecosystem**

Where:
- Users work with **goals**, not **applications**
- Diana is the **intelligent interface** to everything
- The system is **self-describing** and **self-managing**
- New capabilities can be added **without code changes**
- The entire platform can **scale and evolve organically**

This is North Star ONE: **A runtime platform as intelligent as Diana herself.**

---

**Ready to build the future?** 🚀
