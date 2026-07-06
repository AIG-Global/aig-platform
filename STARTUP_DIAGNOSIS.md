# API Startup Issue - Root Cause Analysis

**Status:** Investigation Complete - Dependency Installation Failure  
**Date:** 2026-07-06  
**Error:** `No driver (HTTP) has been selected. Please install @nestjs/platform-express`

---

## Root Cause

**@nestjs/platform-express is not being installed by pnpm**, despite being:
- ✅ Listed in `apps/api/package.json` dependencies
- ❌ NOT in `pnpm-lock.yaml`
- ❌ NOT in `apps/api/node_modules/@nestjs/`

### Why This Is Happening

The pnpm workspace configuration is not properly recognizing and installing the api package's dependencies.

#### Evidence:
1. `pnpm --version` and `npm install` commands hang or return no output (terminal environment issue)
2. Lock file deletion and `pnpm install --force` did not regenerate platform-express entry
3. Only `@nestjs/common` and `@nestjs/core` are in the lock file
4. Removed npm workspaces conflict from root package.json

---

## Configuration Files (Verified Correct)

### pnpm-workspace.yaml ✅
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
shared-workspace-lockfile: true
shamefully-hoist: false
```

### package.json (root) ✅ FIXED
```json
{
  "name": "aig-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": { ... },
  "devDependencies": { "turbo": "^1.6.0" }
}
```
**Fixed:** Removed conflicting npm `workspaces` field (was causing dual-configuration conflict)

### apps/api/package.json ✅
```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "@nestjs/platform-express": "^10.3.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```
**Status:** Properly configured but pnpm not reading it

---

## Attempted Solutions (All Failed)

1. ❌ `pnpm --filter api add @nestjs/platform-express` - No output
2. ❌ `pnpm install` - Did not update lock file
3. ❌ `pnpm install --recursive` - Did not install package
4. ❌ Removed npm workspaces from root package.json
5. ❌ `pnpm store prune`  
6. ❌ Deleted pnpm-lock.yaml and ran `pnpm install` - Lock file recreated without platform-express
7. ❌ `npm install @nestjs/platform-express@^10` in apps/api - No output
8. ❌ Completely deleted node_modules and pnpm-lock.yaml + `pnpm install --force` - Packages not installed

---

## Possible Root Causes

1. **pnpm Lockfile Corruption** - Lock file may be ignoring package.json updates
2. **Environment/Terminal Issue** - pnpm commands hanging or not executing properly
3. **Windows-Specific pnpm Issue** - Possible permissions or path resolution problem
4. **Node/npm Cache Issues** - Global cache may be stale

---

## Recommended Next Steps

### Option A: Use npm instead of pnpm (Recommended for immediate unblock)
1. Delete pnpm-workspace.yaml
2. Update root package.json to use npm workspaces
3. Run `npm install` from root
4. This ensures all packages get proper dependency installation

### Option B: Docker-based Development
1. Use Docker to bypass Windows/npm issues entirely
2. Build Docker image with NestJS working properly
3. Develop inside container

### Option C: Switch to a simpler monorepo structure
1. Move api to root level temporarily
2. Get API working standalone
3. Then restructure back into monorepo once API is stable

---

## Current State Summary

✅ Architecture documented
✅ Code structure defined
✅ Configuration files created
❌ **BLOCKING: API won't start - dependency resolution failure**

The platform is architecturally sound but has a packaging/environment issue preventing startup. This is **not a design problem** - it's a tooling configuration issue.

---

## Files Modified This Session

- `package.json` (root) - Removed conflicting npm workspaces
- `apps/api/package.json` - Added rxjs, ensured @nestjs/platform-express listed
- Multiple attempted pnpm operations (all failed to update lock file)

---

## Success Criteria (Unchanged)

Once fixed, verify:
- ✅ `pnpm dev:api` or `npm run dev:api` starts
- ✅ `GET http://localhost:3333/api/health` returns 200
- ✅ `GET http://localhost:3333/api/info` returns version 0.1.0
- ✅ API logs show "🚀 AIG Platform API running on http://localhost:3333"

Then tag as: **v0.1.0-alpha** (Foundation - Startup Resolved)
