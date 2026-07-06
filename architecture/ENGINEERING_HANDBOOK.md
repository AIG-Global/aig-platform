# Engineering Handbook
## Developer Rules & Practices

**Location:** `/architecture/ENGINEERING_HANDBOOK.md`  
**Status:** 🔒 Locked  

---

## The 10-Point Code Review Checklist

Every PR must answer YES to all 10 questions before merge.

### 1. Architecture Compliance ✅
- [ ] Does this follow the 5-layer model?
- [ ] Is it in the correct domain?
- [ ] Does it reference the Master Dependency Map?

**If NO:** Ask author to align with architecture first.

---

### 2. API Contracts ✅
- [ ] Are new APIs documented in `/architecture/api-contracts/`?
- [ ] Are request/response schemas defined?
- [ ] Are error codes specified?
- [ ] Is versioning strategy clear?

**If NO:** Block until API contract written.

---

### 3. Events Published ✅
- [ ] Are events added to `/architecture/event-catalog/`?
- [ ] Do events follow naming convention (`entity.action`)?
- [ ] Are event schemas defined?
- [ ] Is event ordering guaranteed where needed?

**If NO:** Block until events documented.

---

### 4. Database Changes ✅
- [ ] Is schema change in `/architecture/database-model/`?
- [ ] Is migration written?
- [ ] Is backward compatibility maintained?
- [ ] Are indexes considered?

**If NO:** Block until DB spec updated.

---

### 5. Diana Integration ✅
- [ ] Can Diana understand what this does?
- [ ] Are capabilities exposed to Diana?
- [ ] Are action outcomes logged to Trust Engine?
- [ ] Can users see Diana's reasoning?

**If NO:** Block until Diana integration added.

---

### 6. Testing ✅
- [ ] Is unit test coverage >80%?
- [ ] Are integration tests included?
- [ ] Is error handling tested?
- [ ] Are edge cases covered?

**If NO:** Block until tests added.

---

### 7. Security ✅
- [ ] Are inputs validated?
- [ ] Are permissions checked?
- [ ] Is sensitive data encrypted?
- [ ] Are SQL injections prevented?

**If NO:** Block until security reviewed.

---

### 8. Performance ✅
- [ ] Is database query optimized?
- [ ] Are N+1 queries prevented?
- [ ] Is caching used where appropriate?
- [ ] Does it meet performance targets?

**If NO:** Block until optimized.

---

### 9. Documentation ✅
- [ ] Is code commented where non-obvious?
- [ ] Are README/docs updated?
- [ ] Are examples provided?
- [ ] Is troubleshooting documented?

**If NO:** Block until documented.

---

### 10. Domain Rules ✅
- [ ] Are business rules enforced?
- [ ] Are data invariants maintained?
- [ ] Are all scenarios handled?
- [ ] Is error messaging clear?

**If NO:** Block until business logic complete.

---

## Naming Conventions

### Services
```
CamelCase + Service suffix
Example: MissionService, WorkspaceService, DianaService
```

### API Routes
```
/api/[resource]/[action]
Example: /api/missions/create, /api/missions/:id/update
```

### Events
```
entity.action (kebab case for compound words)
Example: mission.created, task.status_changed, user.permission_granted
```

### Database Tables
```
snake_case, plural
Example: missions, workspace_members, user_preferences
```

### Environment Variables
```
UPPER_SNAKE_CASE
Example: DATABASE_URL, STRIPE_SECRET_KEY, OPENAI_API_KEY
```

### Git Branches
```
[type]/[ticket]-[description]
Example: feat/AIG-123-mission-creation, fix/AIG-456-diana-error
```

### Commits
```
[type]: [description] ([ticket])

Types: feat, fix, docs, style, refactor, test, chore, perf
Example: feat: Add mission creation API (AIG-123)
```

---

## Code Standards

### TypeScript
- ✅ Strict mode enabled
- ✅ No `any` types
- ✅ Return types on functions
- ✅ Export types for public APIs

### React
- ✅ Functional components
- ✅ Hooks for state
- ✅ Memoize expensive components
- ✅ Extract logic to hooks

### Error Handling
- ✅ Try/catch for async
- ✅ Proper error logging
- ✅ User-friendly messages
- ✅ Fallback UI for errors

### Async/Await
- ✅ Preferred over promises
- ✅ Handle all errors
- ✅ No dangling promises
- ✅ Proper cleanup

---

## Testing Requirements

### Unit Tests
- ✅ Happy path tested
- ✅ Error cases tested
- ✅ Edge cases tested
- ✅ >80% coverage

### Integration Tests
- ✅ API works end-to-end
- ✅ Database changes persisted
- ✅ Events published
- ✅ Error flows tested

### E2E Tests (Critical User Journeys)
- ✅ Login flow
- ✅ Create first mission
- ✅ Complete mission
- ✅ Install app from marketplace

### Load Testing
- ✅ Database queries optimized
- ✅ Caching effective
- ✅ API responds in <100ms (p95)
- ✅ No memory leaks

---

## Git Workflow

### Branches
```
main              (production code, always deployable)
  ├─ feat/*       (new features)
  ├─ fix/*        (bug fixes)
  ├─ docs/*       (documentation)
  └─ refactor/*   (code improvements)
```

### Pull Requests
1. Create feature branch from main
2. Commit regularly with clear messages
3. Push to GitHub
4. Create PR with description
5. Pass all checks (tests, linting, review)
6. Merge to main (squash for clean history)

### Code Review
- At least 1 architect review
- Passes 10-point checklist
- All tests pass
- No performance regressions

---

## CI/CD Pipeline

### On Every Commit
1. Run linter (ESLint)
2. Run type checker (TypeScript)
3. Run unit tests
4. Run integration tests
5. Build artifacts

### Before Merge
1. E2E tests pass
2. Load test passes
3. Security scan passes
4. Code review approved

### On Merge to Main
1. Build Docker image
2. Deploy to staging
3. Run smoke tests
4. Build complete

### Production Deployment
1. Tag version (semantic versioning)
2. Deploy to production
3. Health checks pass
4. Monitor metrics

---

## Performance Standards

### API Response Times
```
p50: <50ms    (fast)
p95: <100ms   (acceptable)
p99: <500ms   (slow but okay)
p100 (max): <2s  (should not happen)
```

### Frontend Performance
```
<1s page load (web)
<2s app launch (mobile)
60fps scrolling
<5MB total JS (gzipped)
Lighthouse score >90
```

### Database Performance
```
<10ms queries (p95)
Proper indexes
N+1 queries prevented
Connection pooling used
```

---

## Security Guidelines

### Authentication
- ✅ JWT tokens (not session cookies)
- ✅ Refresh token rotation
- ✅ Expired token handling
- ✅ No sensitive data in JWT

### Authorization
- ✅ Check permissions on every API
- ✅ User can only access own data
- ✅ Role-based access control
- ✅ Audit all permission changes

### Data Protection
- ✅ PII encrypted at rest
- ✅ HTTPS for all traffic
- ✅ Secrets in environment variables
- ✅ No passwords in logs

### Input Validation
- ✅ Validate on backend (not frontend)
- ✅ Type checking
- ✅ Range checking
- ✅ Format validation (email, URL, etc.)

---

## Logging

### What to Log
- ✅ API requests/responses (non-sensitive)
- ✅ Errors with stack trace
- ✅ User actions (for audit)
- ✅ Performance metrics

### What NOT to Log
- ❌ Passwords
- ❌ API keys
- ❌ Credit cards
- ❌ Personal data (unless needed)

### Log Levels
```
DEBUG: Detailed tracing
INFO:  Normal operations
WARN:  Potential problems
ERROR: Failures requiring attention
```

---

## Deployment

### Staging
- Deploy every PR
- Test in staging before production
- Run full test suite
- Check performance metrics

### Production
- Deployed by CD pipeline
- Automated health checks
- Rollback capability
- Zero-downtime deployment

### Rollback
- 1-click rollback to previous version
- Database migrations must be reversible
- If rollback needed, incident review
- Document what went wrong

---

## Documentation

### Code Comments
- ✅ WHY, not WHAT
- ✅ Complex logic explained
- ✅ Gotchas documented
- ✅ Examples for non-obvious code

### API Documentation
- ✅ Endpoint description
- ✅ Request schema
- ✅ Response schema
- ✅ Error cases
- ✅ Example curl command

### README
- ✅ How to setup
- ✅ How to test
- ✅ How to deploy
- ✅ Troubleshooting

---

## Dependencies

### Adding Dependencies
- ✅ Justify why needed
- ✅ Check license compatibility
- ✅ Verify security record
- ✅ Check bundle size impact
- ✅ Get architecture approval

### Updating Dependencies
- ✅ Test after update
- ✅ Check changelog for breaking changes
- ✅ Update lockfile
- ✅ Monitor for issues

### Deprecated Features
- ✅ 6-month deprecation notice
- ✅ Clear migration path
- ✅ Automated tooling for migration
- ✅ Final removal with major version

---

**Status:** 🔒 Locked  
**Enforcement:** Required for all PRs  
**Review:** Quarterly for improvements
