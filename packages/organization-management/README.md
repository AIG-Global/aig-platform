# Organization Management Service

**Version:** 0.2.0  
**Status:** v0.2.0 - Foundation  
**Phase:** 2 - Identity & Knowledge Foundation

REST API for organization (tenant) management including creation, configuration, member management, and statistics.

## Overview

The Organization Management Service provides:
- **Organization Creation** - Create new tenants with custom configuration
- **Organization Settings** - Manage plan, billing, security settings
- **Membership Management** - Add/remove members, track organization stats
- **Status Management** - Activate, suspend, or archive organizations
- **Multi-tenant Support** - Complete isolation between organizations
- **Organization Statistics** - Track member count, usage metrics

## Endpoints

### Organization CRUD

**POST /organizations** - Create organization (requires auth)
```json
{
  "name": "Acme Corp",
  "slug": "acme-corp",
  "description": "Leading company",
  "billingEmail": "billing@acme.com",
  "ownerId": "user-123"
}
```

**GET /organizations/:id** - Get organization details (requires auth)
```
GET /organizations/org-123
Authorization: Bearer <token>
```

**GET /organizations/slug/:slug** - Get organization by slug (requires auth)
```
GET /organizations/slug/acme-corp
Authorization: Bearer <token>
```

**GET /organizations** - List organizations (requires auth)
```
GET /organizations?page=1&limit=20&status=active&search=acme
Authorization: Bearer <token>
```

**PATCH /organizations/:id** - Update organization settings (requires auth)
```json
{
  "name": "Acme Corp Inc",
  "description": "Updated description",
  "billingEmail": "billing@acme.com",
  "plan": "pro",
  "requireMfa": true
}
```

### Organization Status

**PATCH /organizations/:id/suspend** - Suspend organization (requires auth)
**PATCH /organizations/:id/activate** - Activate organization (requires auth)
**PATCH /organizations/:id/archive** - Archive organization (requires auth)
**DELETE /organizations/:id** - Delete organization (requires auth)

### Statistics

**GET /organizations/:id/stats** - Get organization statistics (requires auth)
```json
{
  "totalMembers": 50,
  "activeUsers": 45,
  "totalConversations": 250,
  "lastActivityAt": "2026-07-06T12:00:00Z",
  "apiCallsThisMonth": 15000,
  "storageUsedMB": 512,
  "plan": "pro",
  "daysUntilTrialExpires": null
}
```

## DTOs

### CreateOrganizationDto
```typescript
{
  name: string              // min 2 chars
  slug: string             // min 2 chars, must be unique
  description?: string
  billingEmail: string     // valid email
  ownerId: string          // user ID of owner
}
```

### UpdateOrganizationDto
```typescript
{
  name?: string
  description?: string
  logo?: string (URL)
  website?: string (URL)
  billingEmail?: string
  plan?: 'free' | 'pro' | 'enterprise'
  requireMfa?: boolean
  sessionTimeout?: number  // in minutes
}
```

### ListOrganizationsQueryDto
```typescript
{
  status?: 'active' | 'suspended' | 'archived'
  plan?: 'free' | 'pro' | 'enterprise'
  page?: number          // default 1
  limit?: number         // default 20
  search?: string
  sortBy?: string        // default 'createdAt'
  sortOrder?: 'asc' | 'desc'  // default 'desc'
}
```

## Features

✅ **Organization Management**
- Create organizations with unique slugs
- Update settings and configuration
- Change billing plan (free, pro, enterprise)
- Track member counts

✅ **Status Management**
- Active/Suspended/Archived states
- Soft deletion for recovery
- Status-based filtering

✅ **Multi-tenant Support**
- Complete data isolation
- Per-organization settings
- Slug-based routing support

✅ **Security**
- JWT authentication on protected endpoints
- Owner-based access control
- MFA enforcement options
- Session timeout configuration

✅ **Statistics & Monitoring**
- Member count tracking
- Activity timestamp tracking
- Plan management
- Trial period tracking (for free tier)

## Service Architecture

```
OrganizationManagementController
    ↓
OrganizationManagementService
    ↓
IOrganizationRepository (abstract)
    ├── InMemoryOrganizationRepository (for development)
    └── [PostgreSQL/MongoDB implementation]
```

## Repository Pattern

The service uses a repository pattern for data access, allowing different implementations:

```typescript
interface IOrganizationRepository {
  create(data): Promise<Organization>
  findById(id): Promise<Organization | null>
  findBySlug(slug): Promise<Organization | null>
  list(options): Promise<{ organizations, total }>
  update(id, data): Promise<Organization>
  delete(id): Promise<void>
  // ... and more
}
```

**Current Implementation:** InMemoryOrganizationRepository (for testing)
**Production Implementation:** PostgreSQL/MongoDB (planned for v0.2.1)

## Plans

### Free Plan
- Up to 5 members
- 1GB storage
- Basic features
- Community support

### Pro Plan
- Up to 100 members
- 100GB storage
- Advanced features
- Priority support
- Custom branding

### Enterprise Plan
- Unlimited members
- Unlimited storage
- All features
- Dedicated support
- SSO/SAML
- Custom SLA

## Response Format

### Success Response
```json
{
  "id": "org-123",
  "settings": {
    "name": "Acme Corp",
    "slug": "acme-corp",
    "description": "Leading company",
    "plan": "pro",
    "billingEmail": "billing@acme.com",
    "requireMfa": true,
    "ssoEnabled": false,
    "sessionTimeout": 60
  },
  "ownerId": "user-123",
  "memberCount": 50,
  "status": "active",
  "createdAt": "2026-07-01T12:00:00Z",
  "updatedAt": "2026-07-06T12:00:00Z"
}
```

## Error Handling

Common errors:
- **400 BadRequestException** - Invalid input
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 NotFoundException** - Organization not found
- **409 ConflictException** - Slug already in use
- **500 InternalServerError** - Server error

## Features for v0.2.1+

- [ ] Member invitation system
- [ ] Billing integration
- [ ] Invoice management
- [ ] Usage analytics
- [ ] Custom branding
- [ ] SAML/SSO configuration
- [ ] Audit logging
- [ ] Organization transfer
- [ ] API rate limiting
- [ ] Webhook support

## Integration Points

- Depends on @aig/identity for JWT guards
- Integrates with User Management service for member management
- Ready for Ask Diana integration for conversation tracking
- Ready for billing service integration

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Multi-tenant Architecture Patterns](https://en.wikipedia.org/wiki/Multitenancy)
- [SaaS Best Practices](https://www.typescriptlang.org/)
