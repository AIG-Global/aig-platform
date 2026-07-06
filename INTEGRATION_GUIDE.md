# Phase 2 Integration Guide - Next Immediate Steps

**Objective:** Integrate Identity, User Management, and Organization Management services into the main NestJS API  
**Timeline:** 2-4 hours  
**Status:** Ready to begin

---

## 📋 Integration Checklist

### Step 1: Update Main API Module Imports ⏭️
**File:** `apps/api/src/app.module.ts`

**Current State:** Only imports AppController and AppService

**Changes Needed:**
```typescript
import { Module } from '@nestjs/common'
import { IdentityModule } from '@aig/identity'
import { UserManagementModule } from '@aig/user-management'
import { OrganizationManagementModule } from '@aig/organization-management'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    IdentityModule,
    UserManagementModule,
    OrganizationManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Outcome:** API will register all three services and their endpoints

---

### Step 2: Update API package.json Dependencies
**File:** `apps/api/package.json`

**Add Local Packages:**
```json
{
  "dependencies": {
    "@aig/identity": "workspace:*",
    "@aig/user-management": "workspace:*",
    "@aig/organization-management": "workspace:*"
  }
}
```

**Install:** `pnpm install` in workspace root

---

### Step 3: Configure TypeScript Path Aliases
**File:** `apps/api/tsconfig.json`

**Add Paths (if not exists):**
```json
{
  "compilerOptions": {
    "paths": {
      "@aig/*": ["../../packages/*/src"]
    }
  }
}
```

---

### Step 4: Test API Endpoints

**Start API:**
```bash
cd apps/api
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345   - 07/06/2026, 10:30:15 AM   LOG [NestFactory] Starting Nest application...
[Nest] 12345   - 07/06/2026, 10:30:15 AM   LOG [InstanceLoader] IdentityModule dependencies initialized
[Nest] 12345   - 07/06/2026, 10:30:15 AM   LOG [InstanceLoader] UserManagementModule dependencies initialized
[Nest] 12345   - 07/06/2026, 10:30:15 AM   LOG [InstanceLoader] OrganizationManagementModule dependencies initialized
[Nest] 12345   - 07/06/2026, 10:30:16 AM   LOG [RoutesResolver] AppController {/}:
[Nest] 12345   - 07/06/2026, 10:30:16 AM   LOG [RoutesResolver] UserManagementController {/users}:
[Nest] 12345   - 07/06/2026, 10:30:16 AM   LOG [RoutesResolver] OrganizationManagementController {/organizations}:
[Nest] 12345   - 07/06/2026, 10:30:16 AM   LOG [NestApplication] Nest application successfully started
```

---

### Step 5: Test Endpoints

**Health Check:**
```bash
curl http://localhost:3333/api/health
```

**Create Organization:**
```bash
curl -X POST http://localhost:3333/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Org",
    "slug": "test-org",
    "billingEmail": "billing@test.com",
    "ownerId": "user-123"
  }'
```

**Note:** Will fail with 401 (JWT required) - expected until auth endpoints created

**Create User (without JWT):**
```bash
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "roleIds": ["editor"]
  }'
```

---

## 🎯 Priority Order

### HIGH PRIORITY (Do First - 2 hours)
1. ✅ Update app.module.ts with service imports
2. ✅ Verify API starts without errors
3. ✅ Test endpoints respond with proper 200/401 codes
4. ✅ Verify package.json dependencies

### MEDIUM PRIORITY (Do Next - 1 hour)
1. Create JwtService (generate/verify tokens)
2. Create test authentication flow
3. Document API endpoints in Postman/Swagger

### LOWER PRIORITY (Later - v0.2.1)
1. Create auth endpoints (/auth/register, /auth/login)
2. Set up email verification
3. Add database persistence

---

## 🚨 Potential Issues & Solutions

### Issue 1: "Cannot find module '@aig/identity'"
**Solution:** Run `pnpm install` at workspace root to link packages

### Issue 2: "JwtService not provided"
**Solution:** Add `JwtService` provider to IdentityModule (check src/index.ts exports)

### Issue 3: API starts but endpoints return 404
**Solution:** Check that service modules are properly imported in app.module.ts imports array

### Issue 4: TypeScript errors with path aliases
**Solution:** Verify tsconfig.json has paths configured, restart TypeScript server

### Issue 5: "Port 3333 already in use"
**Solution:** Kill existing process or use different port with `PORT=3334 npm run start:dev`

---

## 📊 Success Criteria

✅ API starts without errors  
✅ All three modules initialize successfully  
✅ User endpoints respond to requests  
✅ Organization endpoints respond to requests  
✅ Unauthorized requests return 401  
✅ Invalid requests return validation errors  

---

## 🔄 After Integration

### Immediate (Same Day)
- Verify all endpoints working
- Test error responses
- Check module initialization
- Document any issues

### Short-term (Next Session)
- Create authentication endpoints
- Implement token generation
- Set up email verification
- Add rate limiting

### Medium-term (This Week)
- Create test suite
- Set up database connections
- Implement session persistence
- Add comprehensive logging

---

## 📚 Supporting Files

**Related Documentation:**
- `packages/identity/README.md` - Identity service details
- `packages/user-management/README.md` - User API docs
- `packages/organization-management/README.md` - Organization API docs
- `PHASE_2_COMPLETE.md` - Overall Phase 2 summary
- `MODULE_RESOLUTION_NOTES.md` - Previous deployment issues

**Key Files to Review:**
- `apps/api/src/app.module.ts` - Main module (needs update)
- `apps/api/package.json` - Dependencies (needs update)
- `packages/identity/src/index.ts` - Identity exports
- `packages/user-management/src/index.ts` - User service exports
- `packages/organization-management/src/index.ts` - Org service exports

---

## ⏱️ Time Estimates

| Task | Duration | Priority |
|------|----------|----------|
| Update imports | 5 min | HIGH |
| Run pnpm install | 2 min | HIGH |
| Start API | 2 min | HIGH |
| Verify startup logs | 5 min | HIGH |
| Test endpoints | 10 min | HIGH |
| Document results | 5 min | MEDIUM |
| Create auth endpoints | 45 min | MEDIUM |
| Set up email | 30 min | MEDIUM |
| **Total: First Phase** | **~30 min** | |
| **Total: Full Integration** | **~2 hours** | |

---

## 🎓 What We're Testing

1. **Module Loading** - Can NestJS load and initialize all three services?
2. **Dependency Injection** - Are services properly injected with their dependencies?
3. **Route Registration** - Are endpoints properly mapped to controllers?
4. **Request Handling** - Can controllers handle requests with DTOs?
5. **Error Handling** - Do validation errors return proper responses?
6. **Security** - Are JWT guards enforcing authentication?

---

## Next Steps After Integration

Once integrated and verified working:

1. **Phase 3 - Next Services**
   - Knowledge Management Service
   - Audit & Logging Service
   - Settings Service

2. **Authentication Endpoints**
   - POST /auth/register
   - POST /auth/login
   - POST /auth/refresh
   - POST /auth/logout

3. **Database Integration**
   - PostgreSQL setup
   - Prisma or TypeORM
   - Migration strategy

4. **Testing**
   - Unit tests for services
   - Integration tests for endpoints
   - E2E tests for workflows

---

**Ready to proceed?** Start with Step 1 and follow the checklist above.

**Status:** Ready for v0.2.0 integration  
**Date:** 2026-07-06
