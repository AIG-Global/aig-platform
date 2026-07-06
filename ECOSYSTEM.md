# AIG Platform Ecosystem Architecture v0.2.0

**Status:** 🟢 Phase 2 | Registry System Implemented  
**Last Updated:** 2026-07-06

---

## 🌟 Overview: North Star ONE

The AIG Platform uses a **three-stage ecosystem model** with **North Star ONE** as the central orchestration system:

```
┌─────────────────────────────────────────────────────────┐
│                   NORTH STAR ONE                         │
│  Central Service Discovery & Orchestration System        │
│                                                         │
│  • Registry-based app discovery                         │
│  • Dependency resolution & service coordination         │
│  • Health monitoring & lifecycle management             │
│  • Dynamic plugin integration                           │
└─────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
    │  Stage  │  │ Stage 1 │  │ Stage 2 │  │ Plugins │
    │ Infra   │  │  Apps   │  │Registry │  │         │
    └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

---

## 📦 Ecosystem Stages

### Stage 0: Infrastructure (Backend Services)
Core backend services that power the platform:

```
packages/
├── identity/                      ← Authentication & Authorization
├── user-management/               ← User CRUD & Profiles
├── organization-management/       ← Organization & Teams
├── ask-diana-core/               ← AI Chat Engine (future)
└── north-star-one/               ← Service Discovery
```

**Key Characteristics:**
- NestJS-based backend services
- TypeScript with strict type safety
- Shared dependencies (@nestjs/*, @aig/identity)
- REST/HTTP protocol
- Health check endpoints on `/health`

---

### Stage 1: Development (Active Applications)
Applications under active development in the AIG ecosystem:

```
apps/
├── admin/                   ← Administrative Dashboard
├── ask-diana/              ← AI Assistant Interface  
├── academy/                ← Learning Platform
├── marketplace/            ← Plugin/Extension Store
├── beam-me-up/            ← Deployment Tool
└── mobile/                ← Mobile Applications
```

**Characteristics:**
- Frontend or specialized services
- Separate concerns from backend
- Configurable permissions system
- Dynamic loading capability
- Version tracking and status management

**Registry Entry Example:**
```json
{
  "id": "ask-diana",
  "name": "Ask Diana",
  "version": "0.1.1",
  "status": "testing",
  "category": "core",
  "entry": "/apps/ask-diana",
  "permissions": ["memory", "identity", "documents", "chat"],
  "dependencies": {
    "@aig/identity": "workspace:*",
    "@aig/ask-diana-core": "workspace:*"
  }
}
```

---

### Stage 2: Registry (Ecosystem Discovery)
Centralized registry for all ecosystem components:

```
packages/registry/
├── apps.json              ← Registered applications (6 apps)
├── services.json          ← Backend services (4 services)
├── skills.json            ← Agent skills (8 skills)
└── plugins.json           ← Extensions/plugins (8 plugins)
```

**Registry Features:**
- **Apps Registry:** Application metadata, permissions, dependencies
- **Services Registry:** Backend service endpoints, health checks, dependencies
- **Skills Registry:** Reusable capabilities for agents and tools
- **Plugins Registry:** Third-party integrations and extensions

**Registry Schema:**
- All entries include: `id`, `name`, `version`, `status`, `description`
- Searchable by: `category`, `tags`, `status`, `permissions`
- Dependency tracking for safe loading order
- Health check configuration

---

## 🔍 Registry System

### apps.json - Application Registry
Tracks all Stage 1 applications with:
- **Metadata:** Name, version, category, icons
- **Permissions:** Required capabilities (memory, identity, documents, etc.)
- **Dependencies:** Required packages and services
- **Scripts:** Build, dev, preview commands
- **Status Tracking:** development, testing, stable

**Query Examples:**
```bash
# Get all apps
GET /registry/apps

# Get testing apps
GET /registry/apps?status=testing

# Get core category apps
GET /registry/apps?category=core

# Get specific app
GET /registry/apps/ask-diana
```

### services.json - Service Registry
Backend service discovery with:
- **Endpoints:** Full REST API mapping
- **Dependencies:** Service-to-service dependencies
- **Health Checks:** Monitoring configuration
- **Port Allocation:** Service networking
- **Status:** Development/testing/stable

**Query Examples:**
```bash
# Get all services
GET /registry/services

# Get service dependencies
GET /registry/services/user-management/dependencies
# Returns: [identity]

# Get services required by app
GET /registry/apps/admin/services
# Returns: [identity, user-management, organization-management]
```

### skills.json - Skills Registry
Agent capabilities and reusable tools:
- **Capabilities:** Specific functions (authenticate, list-users, create-org)
- **Use Cases:** Real-world applications
- **Tags:** Searchable metadata
- **Categories:** Security, users, organizations, ai, devops, etc.

**Query Examples:**
```bash
# Get all skills
GET /registry/skills

# Get security skills
GET /registry/skills?category=security

# Get skill details
GET /registry/skills/authentication
```

### plugins.json - Plugins Registry
Third-party and first-party extensions:
- **Type:** Authentication, database, cache, payment, ai
- **Integration:** Target service and method
- **Configuration:** API keys, settings, connection details
- **Status:** stable, optional, experimental

**Integration Methods:**
- `strategy` - Passport.js strategies
- `provider` - Service providers (Redis, Stripe, OpenAI)
- `module` - NestJS modules
- `utility` - Helper libraries

**Query Examples:**
```bash
# Get all plugins
GET /registry/plugins

# Get AI plugins
GET /registry/plugins?category=ai

# Get plugins for identity service
GET /registry/plugins/identity/integrations
```

---

## 🚀 North Star ONE: Service Discovery & Orchestration

### RegistryService
Central registry access and querying:

```typescript
// Load and access registry
await registryService.loadRegistry()

// Query methods
registryService.getApps()              // All apps
registryService.getApp(id)             // Specific app
registryService.getAppsByStatus('stable')
registryService.getAppsByCategory('core')

registryService.getServices()          // All services
registryService.getRequiredServices(appId)
registryService.getServiceDependencies(serviceId)

registryService.getSkills()
registryService.getSkillsByCategory('ai')

registryService.getPlugins()
registryService.getPluginIntegrations('identity')

registryService.getStats()             // Registry statistics
```

### OrchestratorService
App lifecycle management and coordination:

```typescript
// Initialize
await orchestratorService.initialize()

// Load apps with dependency resolution
await orchestratorService.loadApp('ask-diana')
// Automatically loads: identity → user-management → ask-diana

// Check status
orchestratorService.getLoadedApps()
orchestratorService.getAppStatus('ask-diana')

// Health monitoring
await orchestratorService.checkHealth()

// Unload
orchestratorService.unloadApp('ask-diana')
```

---

## 🔌 Plugin Integration System

### Plugin Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **auth** | Authentication mechanisms | Passport JWT, OAuth, SAML |
| **security** | Security utilities | bcryptjs, helmet, rate-limiter |
| **database** | Data persistence | TypeORM, MongoDB, PostgreSQL |
| **cache** | Performance optimization | Redis, Memcached |
| **payments** | Transaction processing | Stripe, PayPal |
| **ai** | AI/ML integrations | OpenAI, Anthropic, Hugging Face |
| **framework** | Core frameworks | NestJS modules, Express middleware |

### Plugin Integration Pattern

```json
{
  "id": "passport-jwt",
  "name": "Passport JWT Strategy",
  "type": "authentication",
  "integration": {
    "target": "@aig/identity",
    "method": "strategy"
  },
  "configuration": {
    "secretOrPublicKey": "process.env.JWT_SECRET",
    "algorithms": ["HS256"]
  }
}
```

---

## 🔄 Dependency Resolution

North Star ONE automatically resolves dependencies:

```
User requests: admin app

↓ Fetch app entry from registry
↓ Identify permissions: identity, user-management, organization-management
↓ Get required services
↓ Resolve service dependencies recursively:
  - organization-management → [identity]
  - user-management → [identity]
  - identity → []
↓ Load order:
  1. identity (no dependencies)
  2. user-management (after identity)
  3. organization-management (after identity)
  4. admin (after all services)
```

---

## 📊 Registry Statistics

Example output from `GET /registry/ecosystem`:

```json
{
  "name": "AIG Platform Ecosystem",
  "version": "0.2.0",
  "stage": "Phase 2",
  "registry": {
    "apps": {
      "total": 6,
      "byStatus": {
        "stable": 1,
        "testing": 1,
        "development": 4
      }
    },
    "services": {
      "total": 4
    },
    "skills": {
      "total": 8
    },
    "plugins": {
      "total": 8
    }
  },
  "stats": {
    "totalApps": 6,
    "stableApps": 1,
    "testingApps": 1,
    "devApps": 4,
    "totalServices": 4,
    "totalSkills": 8,
    "totalPlugins": 8
  }
}
```

---

## 🏗️ Current Implementation Status

### ✅ Completed
- [x] Registry JSON schemas (apps, services, skills, plugins)
- [x] RegistryService with full query capabilities
- [x] RegistryController REST API endpoints
- [x] OrchestratorService with dependency resolution
- [x] OrchestratorController app lifecycle endpoints
- [x] North Star ONE NestJS module
- [x] Ecosystem documentation

### 📋 Next Steps (v0.2.1+)
- [ ] Integrate North Star ONE into main API
- [ ] Implement actual app loading (dynamic imports)
- [ ] Add real health checks with HTTP requests
- [ ] Database persistence for registry cache
- [ ] Plugin hot-loading capability
- [ ] Admin UI for registry management
- [ ] GraphQL API for ecosystem queries
- [ ] Web Dashboard for ecosystem visualization

---

## 🔗 API Endpoints

### Registry API
```
GET  /registry/health                    - Health check
GET  /registry/stats                     - Registry statistics
GET  /registry/ecosystem                 - Full ecosystem overview

GET  /registry/apps                      - List all apps
GET  /registry/apps?status=testing       - Filter by status
GET  /registry/apps/:id                  - Get app details

GET  /registry/services                  - List all services
GET  /registry/services/:id              - Get service details
GET  /registry/services/:id/dependencies - Get service dependencies
GET  /registry/apps/:id/services         - Get app's services

GET  /registry/skills                    - List all skills
GET  /registry/skills?category=ai        - Filter by category
GET  /registry/skills/:id                - Get skill details

GET  /registry/plugins                   - List all plugins
GET  /registry/plugins?category=auth     - Filter by category
GET  /registry/plugins/:id               - Get plugin details
GET  /registry/plugins/:target/integrations - Get plugins for target
```

### Orchestrator API
```
GET  /orchestrator/health                - Health check
GET  /orchestrator/status                - Orchestration status
GET  /orchestrator/apps                  - List loaded apps
GET  /orchestrator/apps/:id              - Get app status

POST /orchestrator/apps/:id/load         - Load application
POST /orchestrator/apps/:id/unload       - Unload application

GET  /orchestrator/health/check          - Full health check
```

---

## 📝 Configuration

### Registry Configuration
Located in `packages/registry/`:

```json
{
  "$schema": "https://aig-global.dev/schemas/apps-registry-v1.json",
  "version": "1.0.0",
  "registry": "aig-platform-ecosystem",
  "metadata": {
    "ecosystem": "aig-platform",
    "version": "0.2.0",
    "discoveryMethod": "registry-based",
    "loadingStrategy": "lazy",
    "maxConcurrentApps": 10
  }
}
```

### Adding New Applications

1. **Create app directory** under `apps/`
2. **Update** `packages/registry/apps.json` with:
   ```json
   {
     "id": "new-app",
     "name": "New App",
     "version": "0.1.0",
     "status": "development",
     "entry": "/apps/new-app",
     "permissions": ["identity"],
     "dependencies": { "@aig/identity": "workspace:*" }
   }
   ```
3. **Restart** North Star ONE to discover

---

## 🎯 Design Principles

1. **Discoverability** - All ecosystem components are queryable
2. **Dependency Safety** - Automatic dependency resolution prevents conflicts
3. **Extensibility** - Plugin system for third-party integrations
4. **Health Awareness** - Continuous health monitoring
5. **Lazy Loading** - Apps load on-demand, not all at startup
6. **Version Tracking** - Semantic versioning for all components
7. **Permission Control** - Fine-grained permission system
8. **Status Management** - Clear lifecycle tracking (dev → testing → stable)

---

## 📚 Related Documentation

- [ROADMAP.md](../ROADMAP.md) - 5-phase project timeline
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [BUILD_STATUS_2026_07_06.md](../BUILD_STATUS_2026_07_06.md) - Build details
- [North Star ONE Module](../packages/north-star-one/src/north-star-one.module.ts) - Source code

---

**North Star ONE: Guiding the AIG Platform Ecosystem** 🌟
