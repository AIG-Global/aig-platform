# AIG Platform

A modern, scalable cloud-native platform built with microservices architecture. The AIG Platform powers intelligent business applications with AI-first capabilities.

**Status:** 🚀 In active development  
**Version:** 0.1.0

---

## 📖 Quick Start

### Prerequisites
- Node.js 24+
- pnpm 11+
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/AIG-Global/aig-platform.git
cd aig-platform

# Install dependencies
pnpm install

# Start development environment
pnpm dev:web      # Frontend (http://localhost:3000)
pnpm dev:api      # Backend API
```

---

## 🏗️ Project Structure

```
aig-platform/
├── apps/                       # Applications
│   ├── web/                    # Next.js frontend (✓ active)
│   ├── api/                    # NestJS backend (✓ active)
│   ├── admin/                  # Admin dashboard (📋 Q2)
│   ├── docs/                   # Public documentation (📋 Q2)
│   ├── ask-diana/              # AI assistant (📋 Q2)
│   ├── mobile/                 # React Native app (📋 Q3)
│   └── northstar/              # Analytics platform (📋 Q3)
│
├── packages/                   # Shared libraries
│   ├── ai-sdk/                 # AI/ML integration
│   ├── auth/                   # Authentication & RBAC
│   ├── config/                 # Configuration management
│   ├── events/                 # Event bus & messaging
│   ├── logging/                # Structured logging
│   ├── notifications/          # Multi-channel notifications
│   ├── storage/                # Cloud storage abstraction
│   ├── types/                  # Shared TypeScript types
│   ├── ui/                     # React UI components
│   └── utils/                  # Common utilities
│
├── infra/                      # Infrastructure & DevOps
│   ├── docker/                 # Docker configurations
│   ├── nginx/                  # Reverse proxy setup
│   ├── monitoring/             # Observability stack
│   ├── terraform/              # Infrastructure as Code
│   ├── deployment/             # CI/CD pipelines
│   └── backups/                # Backup & DR procedures
│
├── docs/                       # Technical documentation
│   ├── architecture/           # System design & ADRs
│   ├── api/                    # API specifications
│   ├── database/               # Schema & migrations
│   ├── deployment/             # Deployment guides
│   ├── security/               # Security policies
│   ├── product/                # Product documentation
│   └── adr/                    # Architecture decisions
│
├── prisma/                     # Database schema
├── scripts/                    # Utility scripts
├── .github/                    # GitHub Actions workflows
├── docker-compose.yml          # Local development environment
├── pnpm-workspace.yaml         # Monorepo configuration
├── tsconfig.json               # TypeScript configuration
├── turbo.json                  # Turbo build configuration
└── package.json                # Root workspace config
```

---

## 🚀 Features

### Current (Phase 1)
- ✅ Monorepo setup with Turbo & pnpm
- ✅ Next.js 14 frontend with TypeScript
- ✅ NestJS API backend
- ✅ Shared package infrastructure
- ✅ Docker development environment
- ✅ TypeScript everywhere

### Planned (Phase 2-3)
- 📋 Identity Service (foundation)
- 📋 Platform Core Service
- 📋 Ask Diana (AI Assistant)
- 📋 Admin Dashboard
- 📋 Public Documentation Site
- 📋 Notification Service
- 📋 Marketplace

### Roadmap (Phase 4+)
- 🗺️ Mobile Application
- 🗺️ North Star Analytics
- 🗺️ Academy (Learning)
- 🗺️ Beam Me Up (Data Transfer)
- 🗺️ Payment System

---

## 🔧 Available Commands

```bash
# Development
pnpm dev:web                   # Run web frontend
pnpm dev:api                   # Run API backend
pnpm dev:web --filter=admin    # Run specific app

# Building & Testing
pnpm build                     # Build all packages
pnpm test                      # Run tests
pnpm lint                      # Lint code
pnpm format                    # Format code

# Monorepo
turbo run dev                  # Run all dev servers
turbo run build --filter=web   # Build specific package
turbo graph                    # Visualize dependency graph
```

---

## 📚 Documentation

- **[System Architecture](./docs/architecture/SYSTEM_OVERVIEW.md)** - High-level system design
- **[API Documentation](./docs/api/)** - REST API specifications
- **[Database Schema](./docs/database/)** - Database design and migrations
- **[Deployment Guide](./docs/deployment/)** - How to deploy the platform
- **[Security Policies](./docs/security/)** - Security architecture and compliance
- **[ADRs](./docs/adr/)** - Architecture decision records
- **[Product Documentation](./docs/product/)** - Product roadmap and features

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe development
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **React Query** - Data fetching

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **PostgreSQL** - Primary database
- **Prisma** - ORM
- **Redis** - Caching & sessions

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Kubernetes** - Production orchestration
- **GitHub Actions** - CI/CD
- **Terraform** - Infrastructure as Code

### Development
- **pnpm** - Fast, disk-efficient package manager
- **Turbo** - High-performance build system
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing

---

## 🏃 Development Workflow

### 1. Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev:web

# Open http://localhost:3000
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature
```

### 3. Make Changes
```bash
# Edit code, run tests
pnpm lint
pnpm test
```

### 4. Submit Pull Request
```bash
git push origin feature/your-feature
```

### 5. Automated Tests & Deployment
- Tests run on PR
- Staging deployment on main merge
- Production after approval

---

## 🔐 Security

- OAuth 2.0 / OIDC authentication
- Role-based access control (RBAC)
- TLS 1.3+ encryption
- AES-256 data encryption
- Secrets management via environment variables
- Regular security audits

See [Security Documentation](./docs/security/) for details.

---

## 📊 Dependency Graph

The platform uses a clean dependency hierarchy:

```
Identity Service (Foundation)
  ↓
Core Platform Service
  ↓
├─ Marketplace
├─ Ask Diana (AI)
├─ Academy
├─ Beam Me Up
└─ North Star (Analytics)
```

This ensures:
- ✅ Clear separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable architecture
- ✅ Team autonomy

---

## 📝 Contributing

1. Follow the [Development Workflow](#development-workflow)
2. Ensure code quality: `pnpm lint && pnpm test`
3. Write clear commit messages
4. Create descriptive pull requests
5. Link relevant issues

---

## 📄 License

MIT

---

## 📞 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Documentation:** See [docs/](./docs/)

---

## 🎯 Milestones

| Phase | Timeline | Focus | Status |
|-------|----------|-------|--------|
| **Phase 1** | Q1 2026 | Foundation setup | ✅ In Progress |
| **Phase 2** | Q2 2026 | Identity + Core services | 📋 Planned |
| **Phase 3** | Q3 2026 | Consumer apps | 🗺️ Planned |
| **Phase 4** | Q4 2026 | Advanced features | 🗺️ Planned |

See [Product Roadmap](./docs/product/roadmap.md) for details.
