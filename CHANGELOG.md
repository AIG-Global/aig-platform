# Changelog

All notable changes to the AIG Platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-06

### Foundation Release - Ask Diana Core

This is the first official release of the AIG Platform, establishing the foundation for all future development. It includes core infrastructure, the monorepo setup, and the complete Ask Diana AI assistant module with production-grade architecture.

### Added

#### Platform Infrastructure
- Monorepo structure using pnpm workspaces and Turbo orchestration
- NestJS backend framework with modular architecture
- Next.js 14 frontend with TypeScript support
- Docker containerization for local development
- Comprehensive TypeScript configuration with path aliases
- Development server setup (NestJS on 3333, Next.js on 3000)

#### Ask Diana Core Module
- **ProviderManager**: Intelligent multi-provider routing with failover chains
  - Support for OpenAI (GPT-4, GPT-3.5-Turbo)
  - Support for Anthropic (Claude 3 family)
  - Support for Ollama (local models)
  - Cost optimization and rate limiting
  - Provider health monitoring and automatic recovery

- **SafetyEngine**: Comprehensive threat detection
  - Prompt injection detection with NLP analysis
  - Jailbreak attempt identification
  - PII protection (email, phone, SSN, credit cards, IP addresses)
  - Blocked term filtering with configurable policies
  - Response content filtering and sanitization

- **KnowledgeEngine**: RAG and document search
  - Document indexing and metadata tracking
  - Semantic similarity search (Jaccard similarity)
  - Context extraction for RAG
  - Knowledge graph foundation (extensible to vector DB)

- **EventBus**: Pub/sub event system
  - 11 event types covering lifecycle (conversation, message, tool, response, error)
  - Event history tracking with configurable retention
  - Clean integration without tight coupling

- **Memory System**: Hierarchical memory architecture
  - ConversationMemory: Current session history with token counting
  - LongTermMemory: Persistent user facts and preferences
  - SemanticMemory: Concept relationships and cross-session knowledge
  - MemoryPruner: Intelligent cleanup with configurable strategies

- **ContextEngine**: Rich context assembly
  - User identity and organization tracking
  - Sentiment analysis (positive/negative/neutral)
  - Intent detection (question/request/explain/create/analyze)
  - Named entity extraction
  - Reference extraction (URLs, emails, IDs)
  - Topic classification
  - Permission and access control

- **LayeredPromptBuilder**: 7-layer prompt architecture
  - Base system prompt
  - Identity context (user role, preferences)
  - Organization context (company policies)
  - Conversation context (history, sentiment, intent)
  - Memory context (facts, concepts)
  - Tool instructions (available functions)
  - Current user prompt
  - Enables dynamic prompt adaptation per user/context

- **Unified Tool Interface**: Consistent tool integration
  - ITool interface for all tool implementations
  - Tool validation and execution tracking
  - BaseTool abstract class for easy implementation
  - Example implementations (Web Search, Calculator, Database)
  - Batch execution support
  - Tool health checks and categorization

- **StreamingResponseHandler**: Advanced SSE streaming
  - Server-Sent Events with keep-alive pings
  - Metrics tracking (token count, latency, bytes)
  - Client disconnect detection
  - Retry logic with exponential backoff
  - Token counting for cost estimation
  - Stream cancellation support

#### REST API Endpoints
- `POST /chat` - Non-streaming chat responses
- `POST /chat/stream` - Real-time streaming with SSE
- `GET /chat/conversations` - List user conversations with pagination
- `GET /chat/conversations/:id` - Get conversation with all messages
- `DELETE /chat/conversations/:id` - Delete conversation
- `POST /chat/tools` - Register tools (admin only)
- `GET /chat/tools` - List available tools
- `GET /chat/models` - List available AI models

#### Documentation
- [README.md](README.md) - Project overview and quick start
- [ROADMAP.md](ROADMAP.md) - 5-phase product roadmap
- [CHANGELOG.md](CHANGELOG.md) - Release notes and version history
- [apps/api/src/modules/ask-diana/README.md](apps/api/src/modules/ask-diana/README.md) - Ask Diana module documentation
- [apps/api/src/modules/ask-diana/ARCHITECTURE.md](apps/api/src/modules/ask-diana/ARCHITECTURE.md) - Detailed architecture documentation

#### Development Tools
- Turbo configuration for task orchestration
- Environment template (.env.example)
- Git repository structure (main, develop, feature branches)
- Semantic versioning scheme
- Development scripts for building, testing, and running

### Technical Details

#### Technology Stack
- **Runtime**: Node.js 24.18.0, npm 11.16.0, pnpm 11+
- **Backend**: NestJS 10.4.22 with TypeScript 5.9.3
- **Frontend**: Next.js 14.0.0 with React
- **Database**: Ready for PostgreSQL/Redis/Elasticsearch/TimescaleDB
- **Containerization**: Docker 29.6.1
- **Build**: Turbo 1.13.4

#### Architecture Patterns
- Monorepo with pnpm workspaces + Turbo orchestration
- NestJS modular architecture with dependency injection
- Provider abstraction pattern for pluggable AI models
- Event-driven architecture for clean component integration
- Memory hierarchy: Conversation (short-term) → LongTerm (persistent) → Semantic (concepts)
- Layered prompt engineering for context adaptation

#### Safety & Security
- Multi-layer threat detection system
- PII detection and sanitization
- Prompt injection prevention
- Jailbreak detection
- Configurable safety policies
- Audit logging ready

### File Structure
```
apps/
├── api/
│   └── src/modules/ask-diana/
│       ├── controllers/ (REST endpoints)
│       ├── services/ (business logic)
│       ├── providers/ (AI provider implementations)
│       ├── safety/ (threat detection)
│       ├── knowledge/ (RAG and search)
│       ├── memory/ (hierarchical memory)
│       ├── events/ (pub/sub system)
│       ├── tools/ (unified tool interface)
│       ├── prompts/ (prompt building)
│       ├── streaming/ (SSE handler)
│       ├── dto/ (request/response types)
│       ├── models/ (data models)
│       └── README.md (module documentation)
├── web/
│   └── (Next.js frontend - ready for development)
└── docs/
    ├── guides/
    ├── architecture/
    └── api/

packages/
├── core/
├── types/
├── utils/
└── (expandable for shared code)
```

### Known Limitations

- Memory storage is in-memory (ready for database integration)
- Vector embeddings use Jaccard similarity (ready for real embeddings)
- Tool system is interface-ready but core tools not fully implemented
- Authentication/authorization temporarily simplified (Identity service coming in v0.2.0)
- Frontend not yet connected to backend

### Breaking Changes

None - this is the first release.

### Migration Guide

N/A for v0.1.0 - this is the foundation release.

### Contributors

- AIG Platform Team - Foundation architecture and Ask Diana implementation

### What's Next

The v0.2.0 release will focus on:
- Identity Platform (authentication, RBAC, organizations)
- AI Memory System (personal, organizational, knowledge-based)
- Integration of Identity with Ask Diana
- Enhanced user management

See [ROADMAP.md](ROADMAP.md) for the complete 5-phase product vision.

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes or significant feature releases
- **MINOR**: New features, additions, enhancements
- **PATCH**: Bug fixes, minor improvements, documentation updates

### Branch Strategy

- **`main`**: Stable production branch, tagged with version releases
- **`develop`**: Integration branch for ongoing development
- **Feature branches**: `feature/feature-name` for new capabilities
- **Bug branches**: `bugfix/bug-name` for fixes
- **Release branches**: `release/v0.2.0` for release preparation

### Release Process

1. Development on feature branches and `develop`
2. Create release branch from `develop`
3. Version bump, CHANGELOG update, final testing
4. Merge to `main` and tag with version
5. Back-merge to `develop`
6. PyPI and npm package publication (when applicable)

---

*For detailed API documentation, see the [Ask Diana API Documentation](apps/api/src/modules/ask-diana/API.md).*
*For architecture details, see the [Architecture Guide](apps/api/src/modules/ask-diana/ARCHITECTURE.md).*
