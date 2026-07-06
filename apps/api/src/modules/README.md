# Modules

This directory contains all NestJS feature modules for the AIG Platform API.

## Current Modules

### ask-diana/
AI-powered conversational assistant with:
- Multi-provider AI support (OpenAI, Anthropic, Ollama)
- Real-time streaming responses
- Tool/function calling
- Conversation management and memory
- Context-aware responses

See [ask-diana/README.md](./ask-diana/README.md) for detailed documentation.

## Module Structure

Each module follows this pattern:

```
module-name/
├── controllers/          # Request handlers
├── services/            # Business logic
├── providers/           # External service adapters
├── dto/                 # Data transfer objects
├── models/              # Database models
├── tests/               # Unit & integration tests
├── streaming/           # Streaming handlers (if needed)
├── prompts/             # Template managers (if needed)
├── memory/              # In-memory stores (if needed)
├── tools/               # Tool executors (if needed)
├── module-name.module.ts    # NestJS module definition
├── README.md            # Documentation
└── ARCHITECTURE.md      # Detailed architecture
```

## Planned Modules

- **identity** - User authentication, organizations, permissions
- **notifications** - Email, SMS, push notifications
- **marketplace** - Feature and plugin marketplace
- **analytics** - Event tracking and analytics engine
- **payments** - Billing and subscription management

## Adding a New Module

1. Create module directory under `modules/`
2. Follow the structure pattern above
3. Implement `module-name.module.ts` with `@Module()` decorator
4. Export in `modules/index.ts`
5. Import in `app.module.ts`
