# North Star ONE: Master Architecture

**Version:** 1.0  
**Status:** Constitutional Document  
**Date:** 2026-07-06  
**Purpose:** Complete technical blueprint for the entire ecosystem  

---

## 📐 Architecture Overview

North Star ONE is built on a **registry-driven, capability-focused architecture** where Diana orchestrates platform services through natural language understanding.

```
┌─────────────────────────────────────────────────────────────┐
│                     Diana Interface                         │
│              (Natural Language Orchestration)               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
│  Intent      │  │  Capability │  │  Service   │
│  Parser      │  │  Matcher    │  │  Router    │
└───────┬──────┘  └─────┬───────┘  └─────┬──────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐
│   8 Core     │  │   Service  │  │  Data      │
│  Registries  │  │  Execution │  │  Persistence
└──────────────┘  └────────────┘  └────────────┘
```

---

## 🏗️ Core Principles

### 1. Diana-Centric
Everything exists to make Diana more capable. Services, APIs, and plugins are discovered and orchestrated through Diana's natural language understanding.

### 2. Registry-Driven
All platform capabilities are registered and queryable. This enables discovery, dependency management, and dynamic loading.

### 3. Capability-First
Think "capabilities Diana gains" not "features we build". Every service is defined as a capability that Diana can access.

### 4. Open Extensibility
Third-party developers can add new apps, plugins, and skills through the Marketplace SDK without modifying core platform.

### 5. Distributed Intelligence
Diana can reason about capabilities and route requests to appropriate services, either local or remote.

---

## 📚 Eight Core Registries

### Registry 1: App Registry

**Purpose:** All applications that exist in the ecosystem

**Structure:**
```typescript
interface RegistryApp {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  category: string;              // Category (e.g., "productivity", "learning")
  description: string;           // What it does
  version: string;               // Semantic version
  status: "active" | "beta" | "deprecated";
  requiredServices: string[];    // Which services it needs
  exposedCapabilities: string[]; // What it provides
  metadata: {
    author: string;
    url: string;
    icon: string;
    releaseDate: string;
  };
}
```

**Examples:**
- Documents (native)
- Notes (native)
- Calendar (native)
- Email (native)
- Kanban (native)
- Tasks (native)

### Registry 2: Capability Registry

**Purpose:** All capabilities Diana can access or enable

**Structure:**
```typescript
interface Capability {
  id: string;
  name: string;                  // "Generate Document", "Summarize Text"
  description: string;
  category: string;              // "creation", "learning", "automation", "collaboration"
  providedBy: string;            // App or service that provides it
  requiresAuthentication: boolean;
  requiresApproval: boolean;     // For sensitive capabilities
  intents: string[];             // User intents that match this
  examples: string[];            // Example user requests
  parameters: CapabilityParam[];
  output: CapabilityOutput;
}

interface CapabilityParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface CapabilityOutput {
  type: string;                  // "document", "text", "data", "action"
  schema: object;
}
```

**Categories:**
- **Creation:** Generate documents, write, design, code
- **Learning:** Find information, suggest resources, teach
- **Automation:** Schedule, trigger, process, integrate
- **Collaboration:** Share, comment, assign, organize

### Registry 3: Service Registry

**Purpose:** Backend services that Diana can invoke

**Structure:**
```typescript
interface RegistryService {
  id: string;
  name: string;
  type: "core" | "extension" | "third-party";
  version: string;
  endpoints: ServiceEndpoint[];
  authentication: "none" | "jwt" | "oauth2" | "api-key";
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  healthCheck: {
    endpoint: string;
    interval: number;
  };
  dependencies: string[];        // Other services it depends on
  capabilities: string[];        // Capabilities it provides
  metadata: {
    team: string;
    documentation: string;
    supportContact: string;
  };
}

interface ServiceEndpoint {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  parameters: EndpointParam[];
  response: EndpointResponse;
  requiredCapabilities: string[]; // User must have these
}
```

**Core Services:**
- Authentication Service
- User Management Service
- Organization Service
- Document Service
- Conversation Service
- Search Service
- Tool Execution Service
- Streaming Service

### Registry 4: Skill Registry

**Purpose:** Discrete, reusable AI skills that Diana can use

**Structure:**
```typescript
interface Skill {
  id: string;
  name: string;                  // "Summarization", "Code Generation"
  description: string;
  version: string;
  type: "ai-skill" | "tool" | "integration";
  aiModel: string;               // Which LLM or model
  systemPrompt: string;          // Instructions for this skill
  context: {
    maxTokens: number;
    temperature: number;
    topP: number;
  };
  trainingData?: string;         // For fine-tuned models
  examples: SkillExample[];       // Few-shot examples
  supportedLanguages: string[];
  costPerCall: number;           // In credits
  rateLimit: number;             // Calls per minute
  metadata: {
    author: string;
    trained: string;             // Training date
    accuracy?: number;
  };
}

interface SkillExample {
  input: string;
  output: string;
  explanation: string;
}
```

**Core Skills:**
- Conversational Understanding
- Document Summarization
- Code Generation
- Text Generation
- Translation
- Grammar Checking
- Image Understanding
- Data Analysis

### Registry 5: Plugin Registry

**Purpose:** Third-party integrations and extensions

**Structure:**
```typescript
interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  publisher: {
    name: string;
    verified: boolean;
    reputation: number;
  };
  targets: string[];             // Which apps this plugs into
  installationUrl: string;
  permissions: PluginPermission[];
  pricing: {
    model: "free" | "freemium" | "paid" | "subscription";
    cost?: number;
  };
  metadata: {
    github?: string;
    documentation?: string;
    supportUrl?: string;
    ratings: number;             // 1-5 stars
    reviewCount: number;
  };
}

interface PluginPermission {
  resource: string;              // "conversations", "documents", "calendar"
  access: "read" | "write" | "delete" | "execute";
  justification: string;         // Why the plugin needs this
}
```

**Examples:**
- Slack Integration
- GitHub Integration
- Salesforce Integration
- Zapier Integration
- Google Workspace Integration

### Registry 6: Payment Registry

**Purpose:** Monetization and billing capabilities

**Structure:**
```typescript
interface PaymentProvider {
  id: string;
  name: string;                  // "Stripe", "Square", "PayPal"
  type: "payment-processor" | "subscription" | "billing";
  status: "active" | "backup" | "inactive";
  endpoints: {
    charge: string;
    subscribe: string;
    webhook: string;
  };
  supportedCurrencies: string[];
  supportedMethods: string[];    // "card", "bank", "crypto"
  failoverTo?: string;           // Fallback provider
  commission: number;            // Platform commission
}

interface PricingModel {
  id: string;
  name: string;                  // "Pro Plan", "Per-Skill"
  type: "flat" | "usage-based" | "subscription";
  currency: string;
  amount: number;
  billingPeriod: "monthly" | "yearly" | "one-time";
  features: string[];
  appliesTo: "user" | "org" | "skill";
}
```

**Providers:**
- Stripe (primary)
- Square (backup)
- PayPal (regional)

### Registry 7: Health Registry

**Purpose:** System health, metrics, and monitoring

**Structure:**
```typescript
interface HealthMetric {
  serviceId: string;
  timestamp: string;
  status: "healthy" | "degraded" | "down";
  metrics: {
    responseTime: number;        // ms
    errorRate: number;           // percentage
    uptime: number;              // percentage
    queueLength?: number;
    activeConnections?: number;
  };
  alerts?: HealthAlert[];
}

interface HealthAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  acknowledgedBy?: string;
  autoResolved?: boolean;
}

interface SystemMetrics {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  activeUsers: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
}
```

**Monitored Metrics:**
- Service response times
- Error rates
- Database performance
- Cache hit rates
- API quota usage
- AI model latency
- Storage utilization

### Registry 8: Event Registry

**Purpose:** Platform-wide events for coordination and auditing

**Structure:**
```typescript
interface PlatformEvent {
  id: string;
  timestamp: string;
  source: string;                // Which service emitted this
  type: string;                  // "user.created", "document.generated"
  user?: string;                 // User ID if applicable
  organization?: string;         // Org ID if applicable
  data: object;
  severity: "info" | "warning" | "error";
  correlationId: string;         // Link related events
  metadata: {
    ip?: string;
    userAgent?: string;
    path?: string;
  };
}

interface EventSubscription {
  id: string;
  name: string;
  filters: {
    eventTypes: string[];
    sources: string[];
    severity: string[];
  };
  webhook: string;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  active: boolean;
}
```

**Event Categories:**
- User events (created, updated, deleted, signed in)
- Content events (created, modified, shared, deleted)
- System events (error, deployment, quota exceeded)
- Marketplace events (skill installed, review posted, purchase completed)
- Enterprise events (audit, compliance, access change)

---

## 🧠 Diana Orchestration Engine

### Intent Understanding

```typescript
interface UserIntent {
  raw: string;                   // User's exact words
  parsed: string;                // Normalized intent
  entity: string;                // What is the intent about
  action: string;                // What should happen
  context: {
    conversation: Conversation;
    user: UserProfile;
    organization?: Organization;
    currentDocument?: Document;
  };
  confidence: number;            // 0-1 confidence score
  alternatives: Intent[];        // Other possible interpretations
}
```

### Capability Matching

```typescript
interface CapabilityMatch {
  capability: Capability;
  confidence: number;            // How well it matches the intent
  requiredParameters: object;    // What Diana needs to ask for
  estimatedCost: number;         // In credits
  alternativeCapabilities: Capability[]; // Other options
}
```

### Service Routing

```typescript
interface ServiceRoute {
  service: RegistryService;
  endpoint: ServiceEndpoint;
  parameters: object;
  expectedResponse: object;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
}
```

---

## 🔄 Beam Me Up Architecture

**Purpose:** Seamless multi-device context preservation and synchronization

### Profile Synchronization

```typescript
interface BeamMeUpProfile {
  userId: string;
  lastSyncTime: string;
  devices: Device[];
  syncedData: {
    conversations: string[];      // Conversation IDs
    documents: string[];          // Document IDs
    settings: object;
    recentActivity: Activity[];
  };
  conflicts: ConflictResolution[]; // How to handle simultaneous edits
}

interface Device {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet" | "web";
  osVersion: string;
  appVersion: string;
  lastSeen: string;
  syncStatus: "synced" | "pending" | "error";
}

interface Activity {
  timestamp: string;
  type: string;                  // "conversation", "document", "search"
  description: string;
  deviceId: string;
}
```

### Sync Strategy

1. **Immediate Sync** (Real-time)
   - Conversations (streaming)
   - Notifications
   - User preferences

2. **Periodic Sync** (Every 5 minutes)
   - Document changes
   - Recent activity
   - Sync status

3. **On-Demand Sync** (User triggered)
   - Full device sync
   - Conflict resolution
   - Data restoration

4. **Fallback Sync** (Offline recovery)
   - Local queue during offline
   - Sync when back online
   - Conflict resolution

---

## 📊 Data Model

### Core Entities

```typescript
interface Conversation {
  id: string;
  userId: string;
  organizationId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  metadata: {
    topic?: string;
    tags: string[];
    summary?: string;
  };
  privacy: "private" | "organization" | "shared";
  sharedWith?: string[];         // User IDs or group IDs
}

interface Message {
  id: string;
  conversationId: string;
  role: "user" | "diana" | "system";
  content: string;
  timestamp: string;
  model?: string;                // Which AI model was used
  tokens: {
    input: number;
    output: number;
  };
  metadata?: object;
}

interface Document {
  id: string;
  userId: string;
  organizationId?: string;
  title: string;
  content: string;
  format: "markdown" | "html" | "pdf" | "docx";
  createdAt: string;
  updatedAt: string;
  generatedFrom?: string;        // Conversation ID if generated
  tags: string[];
  privacy: "private" | "organization" | "public";
  sharedWith?: string[];
}

interface SearchIndex {
  id: string;
  documentId: string;
  type: "conversation" | "document" | "note" | "task";
  content: string;
  embedding: number[];           // Vector for semantic search
  createdAt: string;
  updatedAt: string;
  keywords: string[];
}
```

---

## 🔐 Security Architecture

### Authentication
- JWT tokens with 24-hour expiration
- Refresh tokens with 90-day rotation
- Multi-factor authentication option
- OAuth2 for third-party integrations

### Authorization
- Role-based access control (RBAC)
- Capability-based security
- Organization-level isolation
- Audit logging for all access

### Data Protection
- End-to-end encryption for sensitive data
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Regular security audits

### Privacy
- GDPR compliance
- HIPAA compliance (when needed)
- Data retention policies
- Right to deletion support

---

## 🚀 Deployment Architecture

### Multi-Environment

```
Development (Local)
├─ All services local
├─ Mock databases
└─ Test data

Staging
├─ Production mirror
├─ Real databases (copy)
└─ Performance testing

Production
├─ Geo-distributed
├─ Auto-scaling
└─ Disaster recovery
```

### Service Deployment

```
Core Services
├─ Authentication (2-4 instances)
├─ Conversation (4-8 instances)
├─ Document (2-4 instances)
├─ Search (2 instances)
└─ User Management (2 instances)

Supporting Services
├─ Monitoring (1 instance)
├─ Events (2 instances)
├─ Cache (Redis 2-4 instances)
└─ Queue (RabbitMQ 2 instances)

Databases
├─ PostgreSQL (Primary + Standby)
├─ MongoDB (Search, Analytics)
└─ Vector DB (Embeddings)
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless services for easy scaling
- Load balancing across instances
- Database connection pooling
- Cache distribution

### Vertical Scaling
- Service resource limits
- Memory management
- CPU optimization
- Database query optimization

### Performance
- Target response times: <200ms for 95% of requests
- Streaming for long operations
- Pagination for large datasets
- Caching strategy (Redis, CDN)

---

## 🔌 Integration Points

### Third-Party Integration Categories

**Communication:**
- Slack, Teams, Discord
- Email providers
- SMS providers

**Productivity:**
- Google Workspace
- Microsoft 365
- Notion, Asana

**Data & Analytics:**
- Salesforce
- HubSpot
- Tableau, Looker

**Infrastructure:**
- AWS, Azure, GCP
- GitHub, GitLab
- DataDog, New Relic

---

## 🗺️ API Surface (26 Endpoints)

### Conversation Endpoints (5)
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/:id` - Get specific conversation
- `POST /api/conversations/:id/messages` - Add message
- `DELETE /api/conversations/:id` - Delete conversation

### Document Endpoints (5)
- `POST /api/documents` - Create document
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Search Endpoints (3)
- `POST /api/search` - Full-text search
- `POST /api/search/semantic` - Semantic search
- `GET /api/search/suggestions` - Search suggestions

### Capability Endpoints (4)
- `GET /api/capabilities` - List all capabilities
- `GET /api/capabilities/:id` - Get capability details
- `POST /api/capabilities/match` - Find matching capabilities
- `POST /api/capabilities/:id/invoke` - Invoke capability

### Registry Endpoints (5)
- `GET /api/registry/apps` - List apps
- `GET /api/registry/services` - List services
- `GET /api/registry/skills` - List skills
- `GET /api/registry/plugins` - List plugins
- `GET /api/registry/status` - System status

### Administration Endpoints (4)
- `GET /api/admin/health` - System health
- `GET /api/admin/metrics` - System metrics
- `GET /api/admin/audit-log` - Audit log
- `POST /api/admin/maintenance` - Maintenance operations

---

## 🎯 Architectural Decisions

### Why Registry-Driven?
- **Discoverability:** Diana can find capabilities dynamically
- **Flexibility:** Add new services without modifying core
- **Scalability:** Services can be added/removed based on demand
- **Monitoring:** Central place to check all system components

### Why Capability-Focused?
- **User-Centric:** Users think in terms of what they want to do
- **Coherent:** Diana remains the interface, not individual features
- **Extensible:** Easy to add new capabilities through marketplace
- **Measurable:** Track which capabilities drive value

### Why Event-Driven?
- **Decoupling:** Services don't depend on each other directly
- **Auditability:** Every change is logged
- **Integration:** Third-party systems can react to events
- **Analytics:** Rich event data for insights

---

## 📋 Implementation Roadmap

### v0.2 (Diana Alpha)
- Authentication & basic API
- Conversation persistence
- Document generation
- Basic search
- Beam Me Up (multi-device sync)
- 5 core skills

### v0.3 (Productivity Suite)
- Productivity service integrations
- Document app
- Notes app
- Task management
- Expanded skills

### v0.4 (Marketplace)
- Plugin registry
- Marketplace API
- Third-party skill support
- Billing integration

### v0.5 (Enterprise)
- Multi-tenancy
- RBAC system
- Audit logging
- Admin dashboard

### v1.0 (AIOS)
- Desktop application
- Mobile application
- Voice interface
- Ambient capabilities

---

## 🔗 Document References

This Master Architecture is referenced by:
- **DIANA_DESIGN_BIBLE.md** - How services present themselves to users
- **AIOS_TECHNICAL_SPECIFICATION.md** - How services work across devices
- **MARKETPLACE_SDK_GUIDE.md** - How third parties extend the architecture
- **ENTERPRISE_ARCHITECTURE_GUIDE.md** - How the architecture scales to enterprises

---

*North Star ONE: Master Architecture*  
*Constitutional Document for the Entire Ecosystem*  
*Date: 2026-07-06*
