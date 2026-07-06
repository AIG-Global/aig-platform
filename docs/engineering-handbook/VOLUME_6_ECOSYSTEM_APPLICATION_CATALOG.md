# AIGINVEST Engineering Handbook
## Volume 6: Ecosystem Application Catalog

**Volume:** 6 of 18  
**Section:** 2 (Product Ecosystem)  
**Pages:** 80 (estimated)  
**Audience:** Product, Engineering, Marketplace team  
**Last Updated:** July 7, 2026  
**Status:** 🟢 Complete & Locked  

---

## Table of Contents

1. The Catalog Principle
2. Application Registry Specification
3. Initial Roadmap (6 Categories, 20+ Apps)
4. Marketplace Asset Types
5. Future Extensions
6. Quality Standards

---

## 1. The Catalog Principle

### What It Means

AIGINVEST doesn't grow organically.

Every application has a **planned place** in the ecosystem.

No application ships without:
- Clear category
- Declared version
- Listed dependencies
- Required permissions
- Diana capabilities exposed
- API contracts
- Event publications
- UI placement

This prevents:
- ❌ Chaotic growth
- ❌ Duplicate functionality
- ❌ Conflicting permissions
- ❌ Diana fragmentation
- ❌ Integration hell

---

### The Catalog is the Product Roadmap

The order of the catalog **IS** the product priority.

Not "build whatever's cool."  
But "build according to the master plan."

---

## 2. Application Registry Specification

Every application must declare:

### 2.1 Basic Metadata

```
{
  "appId": "com.aiginvest.tasks",
  "displayName": "Tasks",
  "category": "Productivity",
  "version": "1.0.0",
  "priority": "P0",
  "releaseWeek": 3,
  "owner": {
    "team": "Product Engineering",
    "lead": "VP of Engineering",
    "productManager": "PM for Tasks"
  }
}
```

---

### 2.2 Dependencies

```
{
  "dependencies": {
    "services": [
      { "service": "Identity", "minVersion": "1.0.0" },
      { "service": "Storage", "minVersion": "1.0.0" },
      { "service": "Events", "minVersion": "1.0.0" }
    ],
    "apis": [
      { "api": "/api/missions/:id", "minVersion": "1.0.0" },
      { "api": "/api/workspaces/:id", "minVersion": "1.0.0" }
    ],
    "dianaCapabilities": [
      "SuggestNextTask",
      "CreateTask",
      "UpdateTaskStatus"
    ]
  }
}
```

---

### 2.3 Permissions Required

```
{
  "permissions": [
    {
      "resource": "Task",
      "action": "create",
      "scope": "workspace",
      "requiresAudit": true
    },
    {
      "resource": "Task",
      "action": "read",
      "scope": "workspace"
    },
    {
      "resource": "Task",
      "action": "update",
      "scope": "workspace",
      "requiresAudit": true
    },
    {
      "resource": "Task",
      "action": "delete",
      "scope": "workspace",
      "requiresAudit": true
    }
  ]
}
```

---

### 2.4 Diana Capabilities Exposed

```
{
  "dianaCapabilities": [
    {
      "capability": "SuggestNextTask",
      "description": "Diana suggests the next task based on mission progress",
      "inputs": ["missionId", "currentProgress"],
      "output": "{ taskId, title, priority, reason }",
      "confidenceThreshold": 0.8
    },
    {
      "capability": "CreateTask",
      "description": "Diana creates a task in the current workspace",
      "inputs": ["title", "description", "priority", "dueDate"],
      "requiresUserApproval": true,
      "output": "{ taskId, createdAt, status }"
    },
    {
      "capability": "UpdateTaskStatus",
      "description": "Diana updates task status when user confirms completion",
      "inputs": ["taskId", "newStatus", "completionNotes"],
      "output": "{ taskId, updatedAt, newStatus }"
    }
  ]
}
```

---

### 2.5 APIs Exposed

```
{
  "apis": [
    {
      "path": "/api/tasks",
      "method": "POST",
      "description": "Create a task",
      "requestBody": { ... },
      "responseBody": { ... },
      "permissions": ["Task:create"],
      "version": "1.0.0"
    },
    {
      "path": "/api/tasks/:id",
      "method": "GET",
      "description": "Get a task",
      "permissions": ["Task:read"],
      "version": "1.0.0"
    },
    {
      "path": "/api/tasks/:id",
      "method": "PUT",
      "description": "Update a task",
      "requestBody": { ... },
      "permissions": ["Task:update"],
      "version": "1.0.0"
    },
    {
      "path": "/api/tasks/:id",
      "method": "DELETE",
      "description": "Delete a task",
      "permissions": ["Task:delete"],
      "version": "1.0.0"
    },
    {
      "path": "/api/tasks?workspaceId=:id",
      "method": "GET",
      "description": "List tasks in a workspace",
      "permissions": ["Task:read"],
      "version": "1.0.0"
    }
  ]
}
```

---

### 2.6 Events Published

```
{
  "events": [
    {
      "eventType": "task.created",
      "description": "Published when a task is created",
      "schema": {
        "taskId": "string",
        "title": "string",
        "workspaceId": "string",
        "createdBy": "string",
        "createdAt": "timestamp"
      }
    },
    {
      "eventType": "task.status_changed",
      "description": "Published when task status changes",
      "schema": {
        "taskId": "string",
        "oldStatus": "string",
        "newStatus": "string",
        "changedBy": "string",
        "changedAt": "timestamp"
      }
    },
    {
      "eventType": "task.completed",
      "description": "Published when task is marked complete",
      "schema": {
        "taskId": "string",
        "missionId": "string",
        "completionTime": "number",
        "completedBy": "string",
        "completedAt": "timestamp"
      }
    }
  ]
}
```

---

### 2.7 UI Placement

```
{
  "uiPlacement": {
    "navigation": {
      "location": "main-sidebar",
      "order": 3,
      "icon": "CheckSquare",
      "label": "Tasks"
    },
    "dashboard": {
      "location": "workspace-overview",
      "widget": "TasksSummary",
      "position": "right-column",
      "size": "medium"
    },
    "dianaChat": {
      "available": true,
      "quickActions": [
        "Create Task",
        "Show My Tasks",
        "Mark Complete"
      ]
    }
  }
}
```

---

## 3. Initial Roadmap (6 Categories, 20+ Apps)

Every application is planned. Priority tier shows build order.

### Category 1: Productivity

**P0 (Week 2-3) - Core**
- Tasks (mission-based task management)
- Calendar (deadline tracking)

**P1 (Week 5-6) - Extended**
- Notes (workspace documentation)
- Reminders (intelligent notifications)

**P2 (Week 8-9) - Polish**
- Whiteboard (visual planning)
- Wiki (knowledge base)

---

### Category 2: Business

**P1 (Week 4-5)**
- CRM (customer relationships)
- Accounting Lite (basic financials)

**P2 (Week 10-12)**
- ERP Lite (inventory + supply)
- Procurement (vendor management)

**P3 (Week 16-18)**
- Procurement Advanced
- Inventory Tracking

---

### Category 3: AI & Automation

**P0 (Week 1-2) - Core**
- Diana (mission-aware AI orchestrator)

**P1 (Week 3-4)**
- Prompt Studio (AI prompt engineering)
- Research Agent (automated research)

**P2 (Week 7-8)**
- Agent Builder (create custom agents)
- AI Lab (experimentation environment)

---

### Category 4: Development

**P1 (Week 5-6)**
- Projects (team management)
- CI Dashboard (deployment tracking)

**P2 (Week 9-10)**
- DevOps Console (infrastructure management)
- API Manager (endpoint lifecycle)

---

### Category 5: Finance

**P0 (Week 3-4) - Core**
- Payments (transaction processing)

**P1 (Week 6-7)**
- Billing (subscription management)

**P2 (Week 13-14)**
- Banking Integration (account sync)
- Investments (portfolio tracking)

---

### Category 6: HR & Organization

**P1 (Week 8-9)**
- Recruiting (hiring workflow)

**P2 (Week 14-16)**
- Payroll (compensation management)
- Performance (reviews + feedback)

---

### Category 7: Education (Future)

**P2 (Week 12-14)**
- Learning Hub (course management)

**P3 (Week 18-20)**
- Certification (credential tracking)

---

### Category 8: Healthcare (Future)

**P2 (Week 15-17)**
- Health Journal (personal health)

**P3 (Week 20-24)**
- Clinical Modules (healthcare providers)

---

## 4. Marketplace Asset Types

Beyond applications, the marketplace supports four asset types.

### Type 1: Applications (20+)
Described above.

---

### Type 2: Skills
Pre-built AI capabilities that Diana can invoke.

```
{
  "skillId": "skill.analyze-spreadsheet",
  "displayName": "Analyze Spreadsheet",
  "category": "Analytics",
  "version": "1.0.0",
  "author": "AIGINVEST Core",
  "price": "free",
  "description": "Diana can analyze CSV/Excel files and extract insights",
  "dianaCapability": {
    "inputs": ["file", "analysisType"],
    "output": "{ summary, insights, recommendations }",
    "confidenceThreshold": 0.85
  }
}
```

---

### Type 3: Mission Packs
Pre-built mission templates for common goals.

```
{
  "packId": "pack.startup-launch",
  "displayName": "Launch a Startup",
  "category": "Entrepreneurship",
  "version": "1.0.0",
  "author": "AIGINVEST Core",
  "price": "free",
  "description": "A guided 12-week mission to launch your startup",
  "contents": {
    "missions": [
      { "title": "Validate Idea", "weeks": 2 },
      { "title": "Build MVP", "weeks": 6 },
      { "title": "Find Customers", "weeks": 2 },
      { "title": "Raise Funding", "weeks": 2 }
    ],
    "tasks": 50,
    "documents": 20,
    "dianaGuidance": true
  }
}
```

---

### Type 4: Templates
Pre-built documents and assets.

```
{
  "templateId": "template.business-plan",
  "displayName": "Business Plan Template",
  "category": "Planning",
  "version": "1.0.0",
  "author": "AIGINVEST Core",
  "price": "free",
  "description": "Professional business plan document",
  "contents": {
    "sections": 10,
    "pages": 30,
    "aiCompletion": true
  }
}
```

---

## 5. Future Extensions

As the platform matures, add these asset types:

### Future Type 5: AI Agents
Full-fledged specialist agents (beyond Diana).

```
{
  "agentId": "agent.research",
  "displayName": "Research Agent",
  "capabilities": ["SemanticSearch", "SourceAnalysis", "SummaryGeneration"],
  "models": ["claude-3-opus", "gpt-4"],
  "trustLevel": "high"
}
```

---

### Future Type 6: Workflows
Automated business process definitions.

```
{
  "workflowId": "workflow.customer-onboarding",
  "displayName": "Customer Onboarding",
  "steps": 15,
  "automation": 0.80,
  "dianaCoordination": true
}
```

---

### Future Type 7: Industry Modules
Vertical solutions (healthcare, finance, manufacturing).

```
{
  "moduleId": "module.healthcare",
  "displayName": "Healthcare Module",
  "apps": ["HealthJournal", "ClinicalModules", "PatientPortal"],
  "compliance": ["HIPAA", "HL7"]
}
```

---

### Future Type 8: Themes
Visual design packages.

```
{
  "themeId": "theme.professional-dark",
  "displayName": "Professional Dark",
  "colors": { ... },
  "fonts": { ... },
  "compatibility": ["web", "mobile", "aios"]
}
```

---

### Future Type 9: Avatar Packs
Diana avatar variations.

```
{
  "avatarPackId": "avatar.premium-collection",
  "displayName": "Premium Collection",
  "avatars": 12,
  "formats": ["png", "svg", "animated"],
  "themes": ["light", "dark"]
}
```

---

## 6. Quality Standards

Every application must meet:

### 6.1 Technical Standards

- ✅ Follows 3 engineering rules (Diana understands, API-first, single responsibility)
- ✅ Exposes Diana capabilities
- ✅ Publishes events
- ✅ Declares permissions
- ✅ Uses event sourcing
- ✅ Zero security vulnerabilities
- ✅ >90% test coverage

### 6.2 Performance Standards

- ✅ <1s page load
- ✅ <100ms API latency (p95)
- ✅ <5MB total JS (gzipped)
- ✅ >90% Lighthouse score

### 6.3 UX Standards

- ✅ Onboarding <2 minutes
- ✅ No feature >3 clicks from dashboard
- ✅ Mobile responsive
- ✅ Dark + light themes
- ✅ Accessible (WCAG 2.1 AA)

### 6.4 Documentation Standards

- ✅ API fully documented
- ✅ Diana capabilities explained
- ✅ Events documented
- ✅ Sample code provided
- ✅ Video walkthrough (for P0 apps)

### 6.5 Analytics Standards

- ✅ Adoption tracked
- ✅ Success metrics defined
- ✅ User feedback collected
- ✅ Retention analyzed

---

## Catalog Maintenance

### Adding New Applications

1. **Proposal** - Team proposes new app
2. **Design Review** - Architecture review against catalog
3. **Dependency Check** - Verify dependencies exist
4. **Permission Review** - Security team reviews
5. **Integration Plan** - How it integrates with existing apps
6. **Diana Mapping** - How Diana will use it
7. **Approval** - Catalog steward approves placement

### Deprecating Applications

1. **Announcement** - 6-month notice period
2. **Migration** - Provide path to replacement
3. **Sunset** - Remove from default install
4. **Archival** - Keep code in legacy branch

---

## How This Powers the Organization

### Product Team
→ Uses catalog as roadmap  
→ Knows what ships when  
→ Can speak to dependencies  

### Engineering Team
→ Builds in planned order  
→ Knows what dependencies exist  
→ Can parallelize independent apps  

### Diana Team
→ Knows which capabilities will exist  
→ Can preload Diana capabilities  
→ Can plan coordinator logic  

### Marketplace Team
→ Knows what external developers can build  
→ Can plan certification paths  
→ Can recruit complementary apps  

---

## Success Metrics

By Week 6:
- ✅ All P0 applications shipped
- ✅ Zero dependency issues
- ✅ >65% app adoption
- ✅ <100 technical issues per app

By Week 12:
- ✅ All P1 applications shipped
- ✅ Marketplace live
- ✅ 10+ external apps approved
- ✅ >75% weekly return

---

**Published:** July 7, 2026  
**Status:** 🟢 Complete & Locked  
**Next:** Begin Phase 1B implementation  

This catalog IS the product roadmap.
