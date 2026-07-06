# GitHub Organization Guide

**Date:** 2026-07-06  
**Purpose:** Repository structure and governance  
**Organization:** AIG-Global  

---

## Organization Overview

```
AIG-Global Organization
├── Core Platform (Primary Development)
│   └── aig-platform
├── Supporting Services
│   ├── aig-identity
│   ├── aig-memory
│   └── aig-beam-me-up
├── Feature Extensions
│   ├── aig-marketplace
│   └── aig-aios
├── Brand & Design
│   ├── aig-design
│   └── aig-diana
├── Documentation
│   ├── aig-docs
│   └── aig-product
└── Future
    └── [Additional services as platform grows]
```

---

## Repository Descriptions

### 🔹 **aig-platform** (Primary)
**Purpose:** Core platform and all services  
**Owner:** Platform Team  
**Language:** TypeScript, Node.js, React  

**Contains:**
```
aig-platform/
├── apps/
│   ├── api/                # NestJS API server
│   ├── web/                # React web application
│   └── [future apps]
├── packages/
│   ├── identity/           # Authentication & RBAC
│   ├── user-management/    # User service
│   ├── organization-management/  # Org service
│   ├── north-star-one/     # Core registry & orchestration
│   ├── registry/           # Registry data (JSON schemas)
│   └── [service packages]
├── docs/
│   └── [Architecture, guides]
├── .github/
│   └── workflows/          # CI/CD
└── [Config files]
```

**Responsibilities:**
- Core API development
- Service integration
- Registry implementation
- API endpoints
- Data models

**Development Workflow:**
- Main branch (production)
- Develop branch (staging)
- Feature branches (feature/*)
- Release branches (release/*)

---

### 🔹 **aig-identity**
**Purpose:** Identity and authentication service  
**Owner:** Security Team  
**Language:** TypeScript, Node.js  

**Contains:**
```
aig-identity/
├── src/
│   ├── jwt/                # JWT token generation
│   ├── oauth/              # OAuth2 implementation
│   ├── saml/               # SAML implementation
│   ├── ldap/               # LDAP integration
│   ├── mfa/                # Multi-factor auth
│   └── rbac/               # Role-based access
├── tests/
├── docs/
│   ├── API.md
│   ├── SSO_SETUP.md
│   └── RBAC_GUIDE.md
└── [Config files]
```

**Responsibilities:**
- User authentication
- Token management
- RBAC system
- SSO integration
- Security policies

**Status:** ✅ Core implementation complete

---

### 🔹 **aig-memory**
**Purpose:** AI memory and context engine  
**Owner:** AI/ML Team  
**Language:** TypeScript, Python  

**Contains:**
```
aig-memory/
├── src/
│   ├── embeddings/         # Vector embeddings
│   ├── retrieval/          # Semantic search
│   ├── context/            # Context management
│   ├── models/             # Memory models
│   └── persistence/        # Storage layer
├── ml/
│   ├── models/             # ML models
│   └── training/           # Training scripts
├── tests/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── ML_MODELS.md
└── [Config files]
```

**Responsibilities:**
- Conversation memory
- Long-term context
- Semantic search
- Vector embeddings
- Context retrieval

**Phase:** Phase 1

---

### 🔹 **aig-beam-me-up**
**Purpose:** Cross-device synchronization  
**Owner:** Sync/Infra Team  
**Language:** TypeScript, Node.js  

**Contains:**
```
aig-beam-me-up/
├── src/
│   ├── sync/               # Sync engine
│   ├── conflict/           # Conflict resolution
│   ├── transport/          # Network transport
│   ├── local/              # Local storage
│   └── cloud/              # Cloud sync
├── clients/
│   ├── desktop/            # Desktop client
│   ├── mobile/             # Mobile client
│   └── web/                # Web client
├── tests/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SYNC_PROTOCOL.md
│   └── OFFLINE_SUPPORT.md
└── [Config files]
```

**Responsibilities:**
- Device synchronization
- Context preservation
- Offline support
- Conflict resolution
- Cloud-device coordination

**Phase:** Phase 1

---

### 🔹 **aig-marketplace**
**Purpose:** Marketplace & SDK for extensions  
**Owner:** Marketplace Team  
**Language:** TypeScript, Node.js, React  

**Contains:**
```
aig-marketplace/
├── sdk/
│   ├── skill-builder/      # Build AI skills
│   ├── plugin-builder/     # Build plugins
│   ├── app-builder/        # Build apps
│   └── types/              # TypeScript types
├── marketplace/
│   ├── api/                # Marketplace API
│   ├── web/                # Marketplace UI
│   └── admin/              # Admin dashboard
├── templates/
│   ├── skill-template/
│   ├── plugin-template/
│   └── app-template/
├── examples/
│   ├── skill-examples/
│   ├── plugin-examples/
│   └── app-examples/
├── docs/
│   ├── SDK_GUIDE.md
│   ├── DEVELOPER_ONBOARDING.md
│   └── MONETIZATION.md
└── [Config files]
```

**Responsibilities:**
- SDK development
- Marketplace platform
- Developer tools
- Third-party support
- Revenue handling

**Phase:** Phase 3

---

### 🔹 **aig-aios**
**Purpose:** AI Operating System (AIOS) distribution  
**Owner:** Distribution Team  
**Language:** TypeScript, React Native, Electron, Swift, Kotlin  

**Contains:**
```
aig-aios/
├── desktop/
│   ├── windows/            # Windows app (Electron)
│   ├── macos/              # macOS app (native)
│   └── linux/              # Linux app (Electron)
├── mobile/
│   ├── ios/                # iOS app (React Native)
│   └── android/            # Android app (React Native)
├── web/
│   ├── app/                # Web app
│   └── extension/          # Browser extension
├── voice/
│   ├── smart-speaker/      # Smart speaker integration
│   ├── voice-engine/       # Voice I/O
│   └── voice-models/       # Speech recognition
├── ambient/
│   ├── notifications/      # Ambient notifications
│   ├── suggestions/        # Proactive suggestions
│   └── context/            # Context awareness
├── sync/
│   └── [Integration with aig-beam-me-up]
├── docs/
│   ├── DISTRIBUTION.md
│   ├── PLATFORM_GUIDES.md
│   └── DEPLOYMENT.md
└── [Config files]
```

**Responsibilities:**
- Desktop applications
- Mobile applications
- Web and browser
- Voice interface
- Cross-platform sync

**Phase:** Phase 5

---

### 🔹 **aig-design**
**Purpose:** UI/UX design system  
**Owner:** Design Team  
**Language:** Figma (source), React Storybook  

**Contains:**
```
aig-design/
├── design-system/
│   ├── foundations/        # Colors, typography, spacing
│   ├── components/         # Reusable components
│   ├── patterns/           # Design patterns
│   └── guidelines/         # Best practices
├── diana/
│   ├── avatar/             # Diana avatar
│   ├── icons/              # Diana-specific icons
│   ├── illustrations/      # Illustrations
│   └── brand/              # Brand guidelines
├── storybook/
│   ├── stories/            # Component stories
│   ├── themes/             # Theme definitions
│   └── docs/               # Component docs
├── figma/
│   └── [Figma file exports]
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   └── vectors/
└── docs/
    ├── DESIGN_SYSTEM.md
    ├── COMPONENT_GUIDE.md
    └── IMPLEMENTATION.md
```

**Responsibilities:**
- Design system
- Component library
- Figma maintenance
- Visual guidelines
- Asset management

---

### 🔹 **aig-diana**
**Purpose:** Diana identity and assets  
**Owner:** Product/Brand Team  
**Language:** Documentation, assets  

**Contains:**
```
aig-diana/
├── character/
│   ├── personality.md      # Character definition
│   ├── voice.md            # Voice guidelines
│   ├── behavior.md         # Behavioral patterns
│   └── values.md           # Core values
├── assets/
│   ├── avatars/            # Avatar variations
│   ├── illustrations/      # Diana illustrations
│   ├── animations/         # Animation specs
│   └── photography/        # Brand photography
├── prompts/
│   ├── system-prompts/     # Diana system prompts
│   ├── examples/           # Example conversations
│   └── tone/               # Tone variations
├── documentation/
│   ├── DESIGN_BIBLE.md     # Complete design bible
│   ├── BRAND_GUIDE.md      # Brand guidelines
│   └── CHARACTER_GUIDE.md  # Character guide
└── marketing/
    ├── positioning/        # Market positioning
    ├── messaging/          # Key messages
    └── stories/            # Brand stories
```

**Responsibilities:**
- Character definition
- Visual identity
- Brand guidelines
- Asset management
- Consistency across platforms

---

### 🔹 **aig-docs**
**Purpose:** Technical documentation  
**Owner:** Documentation Team  
**Language:** Markdown  

**Contains:**
```
aig-docs/
├── architecture/
│   ├── OVERVIEW.md
│   ├── MASTER_ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   └── DATA_MODEL.md
├── guides/
│   ├── GETTING_STARTED.md
│   ├── DEVELOPMENT_SETUP.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── api/
│   ├── conversations.md
│   ├── documents.md
│   ├── search.md
│   ├── registries.md
│   └── admin.md
├── services/
│   ├── identity/
│   ├── memory/
│   ├── beam-me-up/
│   └── [other services]
├── roadmap/
│   ├── MASTER_ROADMAP.md
│   ├── RELEASES.md
│   └── VISION.md
└── [Other docs]
```

**Responsibilities:**
- Technical documentation
- API reference
- Guides and tutorials
- Architecture documentation
- Release notes

---

### 🔹 **aig-product**
**Purpose:** Product strategy and roadmap  
**Owner:** Product Team  
**Language:** Markdown  

**Contains:**
```
aig-product/
├── strategy/
│   ├── NORTH_STAR_STATEMENT.md
│   ├── STRATEGIC_ROADMAP.md
│   ├── VISION.md
│   └── VALUES.md
├── roadmap/
│   ├── MASTER_ROADMAP.md
│   ├── RELEASES.md
│   ├── FEATURE_ROADMAP.md
│   └── TIMELINE.md
├── requirements/
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── USER_STORIES.md
│   └── ACCEPTANCE_CRITERIA.md
├── analytics/
│   ├── SUCCESS_METRICS.md
│   ├── KPIs.md
│   └── BENCHMARKS.md
├── market/
│   ├── MARKET_ANALYSIS.md
│   ├── COMPETITIVE_LANDSCAPE.md
│   ├── POSITIONING.md
│   └── MESSAGING.md
└── roadmap-board/
    └── [Issue tracking]
```

**Responsibilities:**
- Product strategy
- Roadmap planning
- Market research
- Competitive analysis
- Success metrics

---

## Repository Governance

### Branch Strategy

All repositories use consistent branching:

```
main
├── Stable production code
├── Protected (requires PR review)
└── Automated tests required

develop
├── Integration branch
├── Testing happens here
└── Features merged here

feature/*
├── Individual feature branches
├── One feature per branch
└─ PR to develop

release/*
├── Release preparation
├── Hot fixes only
└── Tags on main

hotfix/*
├── Critical bug fixes
├── PR to main + develop
└── Merged immediately
```

### Pull Request Requirements

All PRs require:
- ✅ Code review (2 approvals)
- ✅ Tests passing (100%+)
- ✅ Lint passing
- ✅ Documentation updated
- ✅ No breaking changes (unless release)

### Code Quality Standards

**Minimum Requirements:**
- Test coverage: 80%+
- Lint score: No errors
- TypeScript strict mode
- No security vulnerabilities
- Performance acceptable

### Release Cycle

**Weekly Releases:**
- Monday: Code freeze
- Tuesday: Testing
- Wednesday: Release candidate
- Thursday: Production release
- Friday: Monitoring

**Versioning:**
- Semantic versioning (MAJOR.MINOR.PATCH)
- v0.2.x for Phase 1
- v0.3.x for Phase 2
- etc.

---

## Access Control

### Organization Roles

| Role | Repos | Permissions |
|------|-------|-------------|
| **Owner** | All | Complete access |
| **Core Team** | All | Push to develop/feature |
| **Product Team** | aig-product, aig-diana | Full access |
| **Design Team** | aig-design, aig-diana | Full access |
| **Contributors** | All | PR only |
| **External Devs** | aig-marketplace | SDK + examples |

### Secrets Management

- API keys in GitHub Secrets
- Never commit secrets
- Rotate quarterly
- Audit access monthly

---

## Continuous Integration

Every repository has:

### Automated Tests
```
- Unit tests (Jest)
- Integration tests
- E2E tests (Cypress for web)
- Performance tests
```

### Automated Checks
```
- TypeScript compilation
- ESLint
- Prettier formatting
- Security scanning (Snyk)
- Dependency vulnerability scanning
```

### Automated Deployment
```
- Push to main → Production
- Push to develop → Staging
- Automated health checks
- Rollback on failure
```

---

## Documentation Standards

Every repository must have:

1. **README.md**
   - What this repo does
   - Quick start
   - Prerequisites
   - Installation
   - Usage examples

2. **CONTRIBUTING.md**
   - How to contribute
   - Development setup
   - Testing instructions
   - Submission guidelines

3. **CHANGELOG.md**
   - Version history
   - Breaking changes
   - Migration guides

4. **docs/** directory
   - Architecture documentation
   - API documentation
   - Guides and tutorials

---

## Repository Creation Checklist

When creating a new repository:

- [ ] Repository name follows `aig-*` pattern
- [ ] Repository description is clear
- [ ] Branch protection configured (main)
- [ ] PR review required (2 approvals)
- [ ] Require status checks to pass
- [ ] Require branches up to date
- [ ] Add topics (aig, phase-*, feature-*)
- [ ] Add description
- [ ] Add README.md
- [ ] Add CONTRIBUTING.md
- [ ] Add LICENSE (MIT)
- [ ] Configure branch rules
- [ ] Add CI/CD workflows
- [ ] Add repository to organization project board

---

## Future Repositories

As the platform grows, additional repositories may be created:

```
Possible Future Repos:

aig-analytics/         # Analytics engine
aig-payments/          # Payment processing
aig-compliance/        # Compliance framework
aig-security/          # Security tooling
aig-devops/            # Infrastructure
aig-ai-models/         # AI model training
aig-voice/             # Voice processing
aig-mobile/            # Shared mobile code
```

---

## Communication

### Repository-Specific

- Each repo has Discussions enabled
- Use issues for bugs/features
- Use PRs for code review
- Use releases for versioning

### Organization-Wide

- Slack #aig-platform for announcements
- Slack #engineering for technical discussion
- Weekly product meeting
- Monthly retrospective

---

**This structure scales as the organization grows.**

**Keep it simple. Each repo has a clear purpose.**

---

*GitHub Organization Guide*  
*Date: 2026-07-06*  
*Version: 1.0*
