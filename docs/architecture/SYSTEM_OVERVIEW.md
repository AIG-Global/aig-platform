# AIG Platform - System Architecture

## Overview

The AIG Platform is a modern, scalable cloud-native application built with a microservices architecture. It's designed to support multiple customer-facing applications while maintaining a clean separation of concerns.

## System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Web (Next.js)  │ Mobile (RN) │ Admin Panel  │ Documentation    │
└──────────────┴──────────────┴──────────────┴────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │  API Gateway   │       │  Ask Diana     │
        │  (Nginx)       │       │  (AI Assistant)│
        └───────┬────────┘       └───────┬────────┘
                │                         │
    ┌───────────┴─────────────────────────┘
    │
┌───▼──────────────────────────────────────────────────────┐
│              Core Services (NestJS)                       │
├──────────────┬──────────────┬──────────────┬─────────────┤
│  Identity    │   Platform   │  Marketplace │ Notifications
└──────────────┴──────────────┴──────────────┴─────────────┘
    │                 │                 │
┌───┴─────────────┬───┴──────────┬───┴──────────┬────────┐
│                 │              │              │        │
▼                 ▼              ▼              ▼        ▼
PostgreSQL    Redis      Elasticsearch    S3      TimescaleDB
```

## Core Architecture

### Frontend Applications

| App | Purpose | Stack | Status |
|-----|---------|-------|--------|
| **web** | Main user-facing platform | Next.js 14, React, TypeScript | ✓ In Progress |
| **admin** | Admin dashboard | Next.js 14, React, TypeScript | 📋 Planned Q2 |
| **mobile** | iOS/Android app | React Native | 📋 Planned Q3 |
| **docs** | Public documentation | Next.js, MDX | 📋 Planned Q2 |
| **ask-diana** | AI assistant | Next.js, OpenAI | 📋 Planned Q2 |
| **northstar** | Analytics dashboard | Next.js, D3.js | 📋 Planned Q3 |

### Backend Services

All services use **NestJS** with **TypeScript** for type safety.

#### Identity Service (Phase 1 - Foundation)
- User authentication and management
- Organizations and teams
- Role-based access control (RBAC)
- Permissions management
- Session management
- Audit logging

**Depends on:** None (Foundation service)

#### Platform Core Service
- Business logic orchestration
- Configuration management
- Integration points
- Event coordination

**Depends on:** Identity Service

#### Marketplace Service
- Product/service listings
- Catalog management
- Search and filtering
- Reviews and ratings

**Depends on:** Identity Service, Platform Core

#### Additional Services (Future)
- Academy (Learning platform)
- Beam Me Up (Data transfer)
- Payments (Billing and subscriptions)
- Notifications (Multi-channel delivery)

### Shared Packages

Located in `packages/`:

| Package | Purpose |
|---------|---------|
| **@aig/auth** | Authentication and authorization library |
| **@aig/ai-sdk** | AI/ML integration and utilities |
| **@aig/events** | Event bus and messaging |
| **@aig/logging** | Structured logging |
| **@aig/notifications** | Multi-channel notifications |
| **@aig/storage** | Cloud storage abstraction |
| **@aig/utils** | Common utilities and helpers |
| **@aig/ui** | Shared UI components |
| **@aig/types** | Shared TypeScript types |
| **@aig/config** | Shared configuration |

## Data Layer

### Databases

- **PostgreSQL** - Primary OLTP database for all operational data
- **Redis** - Session store, caching, rate limiting
- **Elasticsearch** - Full-text search and log aggregation
- **TimescaleDB** - Time-series data for analytics
- **Vector DB** - Embeddings for AI/ML features

### Data Flow

1. Client → API Gateway (Nginx)
2. API Gateway → NestJS Services
3. Services → PostgreSQL (primary data)
4. Services → Redis (sessions, cache)
5. Services → Event Bus → Event Handlers
6. Async tasks → TimescaleDB (analytics)
7. Search → Elasticsearch

## Infrastructure

### Environments

- **Development** - Local + Docker Compose
- **Staging** - Cloud environment for QA
- **Production** - Kubernetes cluster
- **Disaster Recovery** - Multi-region failover

### Infrastructure Components (infra/)

- **Docker** - Containerization and local development
- **Nginx** - Reverse proxy and API gateway
- **Kubernetes** - Container orchestration (production)
- **Terraform** - Infrastructure as Code
- **Monitoring** - Prometheus, Grafana, AlertManager
- **Deployment** - GitHub Actions CI/CD
- **Backups** - Automated backups and DR

## Dependency Graph

```
Foundation:
  └─ Identity Service (users, orgs, permissions)

First Wave:
  ├─ Platform Core (depends: Identity)
  └─ Notifications (depends: Identity)

Second Wave:
  ├─ Marketplace (depends: Identity, Platform)
  ├─ Ask Diana (depends: Identity, Storage, AI-SDK)
  └─ Academy (depends: Identity, Platform)

Third Wave:
  ├─ Beam Me Up (depends: Identity, Storage)
  ├─ North Star (depends: all services, Analytics)
  └─ Payments (depends: Identity, Platform)
```

## Technology Stack

### Frontend
- **Runtime:** Node.js 24+
- **Framework:** Next.js 14
- **Language:** TypeScript
- **UI:** React 18
- **Package Manager:** pnpm
- **Task Runner:** Turbo

### Backend
- **Runtime:** Node.js 24+
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **API:** REST, GraphQL (optional)

### DevOps
- **Containers:** Docker
- **Orchestration:** Kubernetes
- **IaC:** Terraform
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus, Grafana
- **Logging:** ELK Stack / Loki

### AI/ML
- **LLMs:** OpenAI GPT-4, Claude 3
- **Embeddings:** OpenAI Embeddings
- **Vector Store:** Pinecone / Weaviate
- **ML Ops:** MLflow

## Security Architecture

- **Authentication:** OAuth 2.0 / OIDC
- **Authorization:** RBAC with permission scopes
- **Transport:** TLS 1.3+
- **Data at Rest:** AES-256 encryption
- **Secrets:** HashiCorp Vault
- **Compliance:** GDPR, SOC 2, HIPAA ready

## Scalability Considerations

- **Horizontal Scaling:** Stateless services on Kubernetes
- **Database:** Read replicas + connection pooling
- **Caching:** Redis for hot data
- **CDN:** CloudFront/Akamai for static assets
- **Rate Limiting:** Nginx + Redis-backed counters
- **Monitoring:** Real-time metrics and alerting

## Development Workflow

1. **Local Development:** Docker Compose + pnpm dev
2. **Code Changes:** Feature branches with PR reviews
3. **Testing:** Unit, integration, and E2E tests
4. **Staging:** Auto-deployed on PR merge to main
5. **Production:** Manual approval with canary releases

## Next Steps

1. **Phase 1:** Build Identity Service foundation
2. **Phase 2:** Platform Core + Notifications
3. **Phase 3:** First consumer app (Ask Diana)
4. **Phase 4:** Additional services and apps

See [Product Roadmap](../product/roadmap.md) for detailed timeline.
