# Registry Quick Reference

**North Star ONE - Ecosystem Registry API Quick Guide**

---

## 🚀 Quick Start

### 1. Load Registry
```bash
cd packages/north-star-one
npm run build
npm start
```

### 2. Access Registry

```bash
# Get ecosystem overview
curl http://localhost:3333/registry/ecosystem

# Get all apps
curl http://localhost:3333/registry/apps

# Get all services
curl http://localhost:3333/registry/services

# Get stats
curl http://localhost:3333/registry/stats
```

---

## 📱 Common Queries

### Find Apps
```bash
# All apps
GET /registry/apps
Response: { "total": 6, "apps": [...] }

# Testing apps only
GET /registry/apps?status=testing
Response: { "total": 1, "apps": [{id: "ask-diana", ...}] }

# Core category
GET /registry/apps?category=core
Response: { "total": 1, "apps": [{id: "ask-diana", ...}] }

# Single app
GET /registry/apps/admin
Response: {id: "admin", name: "Admin Panel", ...}
```

### Find Services
```bash
# All services
GET /registry/services
Response: { "total": 4, "services": [...] }

# Service details
GET /registry/services/identity
Response: {
  id: "identity",
  endpoints: [
    {path: "/auth/login", method: "POST"},
    {path: "/auth/register", method: "POST"}
  ],
  ...
}

# Service dependencies
GET /registry/services/user-management/dependencies
Response: {
  "serviceId": "user-management",
  "total": 1,
  "dependencies": [{id: "identity", ...}]
}
```

### Find Skills
```bash
# All skills
GET /registry/skills
Response: { "total": 8, "skills": [...] }

# AI skills
GET /registry/skills?category=ai
Response: { "total": 1, "skills": [{id: "conversation-engine", ...}] }

# Skill details
GET /registry/skills/authentication
Response: {
  id: "authentication",
  name: "Authentication Skill",
  capabilities: ["JWT token generation", "Password hashing", ...],
  ...
}
```

### Find Plugins
```bash
# All plugins
GET /registry/plugins
Response: { "total": 8, "plugins": [...] }

# Auth plugins
GET /registry/plugins?category=auth
Response: { "total": 2, "plugins": [{id: "passport-jwt", ...}, ...] }

# AI plugins
GET /registry/plugins?category=ai
Response: { "total": 2, "plugins": [{id: "openai-api", ...}, ...] }

# Plugins for service
GET /registry/plugins/identity/integrations
Response: {
  "target": "identity",
  "total": 2,
  "plugins": [{id: "passport-jwt", ...}, {id: "bcryptjs", ...}]
}
```

---

## 🎛️ Orchestration Commands

### Load Apps
```bash
# Load ask-diana (with dependencies)
POST /orchestrator/apps/ask-diana/load
Response: {
  appId: "ask-diana",
  status: "loaded",
  version: "0.1.1",
  loadedAt: "2026-07-06T14:49:44.699Z"
}

# Check load status
GET /orchestrator/apps/ask-diana
Response: {...}

# View all loaded apps
GET /orchestrator/apps
Response: { "total": 1, "apps": [...] }
```

### Unload Apps
```bash
# Unload ask-diana
POST /orchestrator/apps/ask-diana/unload
Response: {
  appId: "ask-diana",
  action: "unloaded",
  timestamp: "..."
}
```

### Health Monitoring
```bash
# Orchestrator status
GET /orchestrator/status
Response: {
  status: "online",
  registry: {...stats...},
  loadedApps: 1,
  totalApps: 6,
  queue: []
}

# Full health check
GET /orchestrator/health/check
Response: {
  orchestrator: "healthy",
  apps: {
    "ask-diana": true,
    "admin": false
  }
}
```

---

## 📊 Current Registry Contents

### Apps (6 total)
| ID | Name | Version | Status | Category |
|----|------|---------|--------|----------|
| ask-diana | Ask Diana | 0.1.1 | testing | core |
| admin | Admin Panel | 0.1.0 | development | admin |
| academy | Academy | 0.1.0 | development | learning |
| marketplace | Marketplace | 0.1.0 | development | commerce |
| beam-me-up | Beam Me Up | 0.1.0 | development | devops |
| mobile | Mobile App | 0.1.0 | development | mobile |

### Services (4 total)
| ID | Name | Version | Status | Port |
|----|------|---------|--------|------|
| identity | Identity Service | 0.2.0 | stable | 3001 |
| user-management | User Management | 0.2.0 | stable | 3002 |
| organization-management | Organization Mgmt | 0.2.0 | stable | 3003 |
| ask-diana-core | Ask Diana Core | 0.1.1 | testing | 3004 |

### Skills (8 total)
- project-setup-info (devops)
- get-search-view-results (editor)
- agent-customization (agent)
- authentication (security)
- user-management (users)
- organization-management (organizations)
- conversation-engine (ai)
- (more categories available)

### Plugins (8 total)
- passport-jwt (auth)
- bcryptjs (security)
- typeorm (database)
- nestjs-passport (framework)
- redis (cache)
- stripe (payments)
- openai-api (ai)
- anthropic-api (ai)

---

## 🔗 Dependency Graph

### ask-diana App Dependencies
```
ask-diana
├── @aig/identity
└── @aig/ask-diana-core
    ├── @aig/identity
    └── [memory service - future]

Loading Order:
1. identity (0 dependencies)
2. ask-diana-core (depends on identity)
3. ask-diana (depends on all above)
```

### admin App Dependencies
```
admin
├── @aig/identity
├── @aig/user-management
│   └── @aig/identity (already loaded)
└── @aig/organization-management
    └── @aig/identity (already loaded)

Loading Order:
1. identity
2. user-management
3. organization-management
4. admin
```

---

## 🛠️ Common Patterns

### Check if App is Ready
```bash
# 1. Check registry has app
GET /registry/apps/my-app
# Status 200 = app exists

# 2. Load app
POST /orchestrator/apps/my-app/load

# 3. Poll status
GET /orchestrator/apps/my-app
# Keep polling until status = "loaded"

# 4. Full health check
GET /orchestrator/health/check
# apps.my-app === true
```

### Get All AI Capabilities
```bash
# Find AI plugins
GET /registry/plugins?category=ai
# Returns: openai-api, anthropic-api

# Find AI skills
GET /registry/skills?category=ai
# Returns: conversation-engine

# Find apps using AI
GET /registry/apps/ask-diana
# Check permissions for "chat", "ai", etc.
```

### Find Service Ports
```bash
# Get all services with ports
GET /registry/services
# Iterate through response:
# - identity: port 3001
# - user-management: port 3002
# - organization-management: port 3003
# - ask-diana-core: port 3004
```

---

## 📝 Adding New Components

### Add New App
1. Create directory: `apps/my-app/`
2. Edit `packages/registry/apps.json`:
```json
{
  "id": "my-app",
  "name": "My App",
  "version": "0.1.0",
  "status": "development",
  "entry": "/apps/my-app",
  "permissions": ["identity"],
  "dependencies": {"@aig/identity": "workspace:*"}
}
```
3. Restart North Star ONE: `npm start`

### Add New Service
1. Create package: `packages/my-service/`
2. Edit `packages/registry/services.json`:
```json
{
  "id": "my-service",
  "name": "My Service",
  "version": "0.1.0",
  "port": 3005,
  "dependencies": ["identity"],
  "endpoints": [...]
}
```

### Add New Skill
1. Create skill implementation
2. Edit `packages/registry/skills.json`:
```json
{
  "id": "my-skill",
  "name": "My Skill",
  "version": "0.1.0",
  "category": "custom",
  "capabilities": ["Do something", "Do something else"]
}
```

### Add New Plugin
1. Add to dependencies
2. Edit `packages/registry/plugins.json`:
```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "type": "custom",
  "integration": {
    "target": "@aig/identity",
    "method": "strategy"
  }
}
```

---

## 🔍 Troubleshooting

### Registry not loading
```bash
# Check registry files exist
ls -la packages/registry/
# Should see: apps.json, services.json, skills.json, plugins.json

# Check file format
cat packages/registry/apps.json | jq .
# Should be valid JSON

# Check North Star ONE logs
npm start
# Look for "Registry loaded" message
```

### App not found
```bash
# Verify app in registry
GET /registry/apps/app-id

# Check app entry path is correct
# Should be: /apps/app-id

# Check permissions array is valid
# Each permission should match a service prefix
```

### Dependency resolution failed
```bash
# Check service dependencies
GET /registry/services/my-service/dependencies

# Ensure all dependencies exist
GET /registry/services/{dependency-id}

# Check loading order
# No circular dependencies allowed
```

---

## 📞 Support

**Registry Not Found:** Check `packages/registry/` directory exists  
**Port Already in Use:** Change port in `.env` or tsconfig  
**App Won't Load:** Check dependencies in registry, ensure services loaded first  
**Status Always "Pending":** Check logs in North Star ONE startup  

---

**Last Updated:** 2026-07-06  
**Registry Version:** 1.0.0
