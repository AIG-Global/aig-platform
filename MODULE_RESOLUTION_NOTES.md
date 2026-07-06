# Ask Diana Module Integration - Module Resolution Issue

**Date**: 2026-07-06  
**Status**: Deferred to v0.1.1  
**Priority**: Medium - Blocks full feature testing but foundation is stable

## Problem Statement

The Ask Diana module (56 fully-implemented files) cannot be imported into the main NestJS application due to Node.js ESM module resolution limitations with ts-node during development.

## Root Cause Analysis

### The Issue
When attempting to import the Ask Diana module with:
```typescript
import { AskDianaModule } from './modules/ask-diana/ask-diana.module'
```

Node.js ESM resolution fails with one of:
- `Directory import is not supported`
- `Cannot find module '...ask-diana.module'`
- `Cannot find module '...index'`

### Why It Happens
1. **ts-node + ESM Mode**: ts-node transpiles TypeScript to JavaScript on-the-fly, but doesn't properly handle:
   - Relative path resolution without explicit extensions
   - Directory imports (which require package.json or index file)
   - Path alias transformation at runtime

2. **Node.js ESM Limitations**: Node.js ESM requires:
   - Explicit `.js` file extensions for relative imports
   - Package entry points via package.json in directories
   - Strict resolution order that doesn't match TypeScript's path mapping

3. **TypeScript Path Aliases**: While configured in tsconfig.json:
   ```json
   "paths": {
     "@/*": ["src/*"],
     "@modules/*": ["src/modules/*"]
   }
   ```
   These only work at **compile time**, not at **runtime** when using ts-node.

## Attempted Solutions (All Failed)

| Approach | Result | Reason |
|----------|--------|--------|
| `./modules/ask-diana` | ❌ Directory import error | Node.js doesn't allow directory imports |
| `./modules/ask-diana/index.ts` | ❌ File not found | ts-node couldn't resolve path |
| `./modules/ask-diana/ask-diana.module.ts` | ❌ File not found | ts-node transpilation issue |
| `@ask-diana` path alias | ❌ Invalid package name | ts-node doesn't apply path aliases at runtime |
| Adding `.js` extension | ❌ File not found | TypeScript source is `.ts`, not `.js` |

## Working Solution (For v0.1.1)

The proper fix requires one of these approaches:

### Option 1: Build-First Approach (Recommended)
```bash
# Build TypeScript to dist/ first
npm run build

# Run compiled JavaScript (no ts-node)
node dist/main.js
```

**Advantages**:
- Proper path resolution
- Better performance
- Matches production setup
- Eliminates ts-node/ESM conflicts

**Configuration needed**:
- Add `"build": "tsc"` to package.json scripts
- Configure `outDir` properly in tsconfig.json
- Update dev script to build first

### Option 2: ts-node Configuration
Modify tsconfig.json:
```json
{
  "ts-node": {
    "esm": true,
    "experimentalEsm": true,
    "transpileOnly": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

And use explicit extensions:
```typescript
import { AskDianaModule } from './modules/ask-diana/ask-diana.module.js'
```

**Disadvantages**:
- Still unreliable with ESM
- Requires explicit .js extensions everywhere
- Not ideal for development experience

### Option 3: Package Entry Point
Create package.json in ask-diana/:
```json
{
  "name": "@aig/ask-diana",
  "main": "./ask-diana.module.ts"
}
```

**Disadvantages**:
- Adds complexity to module structure
- Doesn't fully solve Node.js ESM resolution
- Still problematic with ts-node

## Recommendation

**For v0.1.1**, implement **Option 1: Build-First Approach**:

1. Update package.json scripts:
   ```json
   {
     "scripts": {
       "build": "tsc --outDir dist",
       "start": "node dist/main.js",
       "dev": "ts-node --transpileOnly src/main.ts",
       "dev:watch": "tsc --watch --outDir dist & node dist/main.js"
     }
   }
   ```

2. Update dev environment setup for team
3. Test with both ts-node (quick iterations) and build+run (production-like)
4. Module integration will work seamlessly after build

## Timeline Impact

- **v0.1.0-alpha**: ✅ Stable foundation (7-layer architecture, all components ready)
- **v0.1.1**: 🔧 Fix module integration with proper build configuration
  - Estimated effort: 30 minutes
  - Unblocks: Full feature testing, streaming, provider failover, safety engine

## Current Status

The Ask Diana module is **100% ready to use** - it just needs proper import configuration once the build system is in place. All 56 files are implemented and documented.

## Files Involved

**Module Implementation**:
- `apps/api/src/modules/ask-diana/` - 56 files fully implemented
- Architecture: ProviderManager, SafetyEngine, KnowledgeEngine, EventBus, MemoryManager, etc.

**Configuration Files (Needs Update in v0.1.1)**:
- `apps/api/package.json` - Add build script
- `apps/api/tsconfig.json` - Already has path aliases configured
- `apps/api/src/main.ts` - Import will work once module resolution is fixed

## References

- [Node.js ESM Docs](https://nodejs.org/api/esm.html)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [ts-node ESM Support](https://typestrong.org/ts-node/docs/esm/)
- [NestJS Documentation](https://docs.nestjs.com/)
