# Identity Service

**Version:** 0.1.0  
**Status:** Phase 2 - Foundation  
**Last Updated:** 2026-07-06

Core authentication, authorization, and multi-tenant identity management for the AIG Platform.

## Overview

The Identity Service provides:
- **User Authentication** - JWT-based authentication with password hashing
- **Multi-Tenant Support** - Isolated organizations with separate data contexts
- **Role-Based Access Control** - Hierarchical roles with granular permissions
- **Session Management** - Active session tracking for security and compliance
- **Permission Checking** - Flexible permission model supporting resource:action format

## Architecture

```
Identity Service
├── User Management
│   ├── User profiles and preferences
│   ├── Password hashing and verification
│   └── Email verification and MFA support
├── Organization Management
│   ├── Multi-tenant support
│   ├── Organization settings and configuration
│   └── Billing and plan management
├── Access Control
│   ├── Roles (Owner, Admin, Editor, Viewer, Guest)
│   ├── Permissions (resource:action based)
│   ├── Built-in role definitions
│   └── Permission hierarchy
├── Authentication
│   ├── JWT token generation and verification
│   ├── Password hashing (bcrypt)
│   ├── Session management
│   └── Refresh token support
└── Authorization
    ├── Permission checking
    ├── Role-based access control
    ├── Permission inheritance
    └── Scope-based enforcement
```

## Data Models

### User
```typescript
interface User {
  id: string
  organizationId: string
  profile: UserProfile
  preferences: UserPreferences
  passwordHash: string
  mfaEnabled: boolean
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  emailVerified: boolean
  roleIds: string[]
  directPermissions: string[]
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}
```

### Organization
```typescript
interface Organization {
  id: string
  settings: OrganizationSettings
  ownerId: string
  memberCount: number
  status: 'active' | 'suspended' | 'archived'
  createdAt: Date
  updatedAt: Date
}
```

### Role
```typescript
interface Role {
  id: string
  organizationId: string
  name: string
  level: number // Hierarchy: 0=owner, 1=admin, 2=editor, 3=viewer, 4+=guest
  permissions: Set<string>
  isBuiltIn: boolean
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Permission
```typescript
interface Permission {
  id: string
  resource: string // 'org', 'members', 'ask-diana', etc.
  action: string   // 'view', 'create', 'edit', 'delete', 'manage'
  description: string
  scope: 'system' | 'organization' | 'team' | 'personal'
  active: boolean
}
```

## Services

### AuthenticationService

Handles user authentication and JWT token management.

```typescript
// Hash password
const hash = await authService.hashPassword('password123')

// Verify password
const isValid = await authService.verifyPassword('password123', hash)

// Generate tokens
const accessToken = authService.generateAccessToken({
  userId: 'user-123',
  organizationId: 'org-456',
  roleIds: ['role-789'],
  permissions: ['ask-diana:view', 'ask-diana:create'],
})

// Verify token
const payload = authService.verifyToken(accessToken)
```

### AuthorizationService

Manages permissions and access control.

```typescript
// Get user's effective permissions
const permissions = authService.getUserPermissions(user, roles)

// Check single permission
if (authService.hasPermission(permissions, 'ask-diana', 'create')) {
  // User can create Ask Diana conversations
}

// Check multiple permissions
const canManage = authService.hasAllPermissions(permissions, [
  ['members', 'view'],
  ['members', 'manage'],
])
```

## Built-in Roles

### Owner (Level 0)
Full platform access, can manage organization and users.
- `org:manage`, `org:delete`
- `members:manage`
- `roles:manage`
- `ask-diana:all`
- `settings:manage`
- `billing:manage`
- `audit:view`

### Admin (Level 1)
Organizational management access.
- `members:manage`
- `roles:create`
- `settings:view`
- `ask-diana:all`
- `audit:view`

### Editor (Level 2)
Content creation and management.
- `ask-diana:create`
- `ask-diana:edit`
- `ask-diana:delete`
- `ask-diana:share`
- `knowledge:manage`

### Viewer (Level 3)
Read-only access.
- `ask-diana:view`
- `ask-diana:comment`
- `knowledge:view`

### Guest (Level 4)
Limited read-only access.
- `ask-diana:view`
- `knowledge:view`

## Permission Format

Permissions use the format: `resource:action`

**Standard Resources:**
- `org` - Organization management
- `members` - User management
- `roles` - Role management
- `ask-diana` - AI conversation access
- `knowledge` - Knowledge base access
- `audit` - Audit log access

**Standard Actions:**
- `view` - Read access
- `create` - Create new items
- `edit` - Modify existing items
- `delete` - Remove items
- `manage` - Full management
- `all` - All actions (wildcard)

## Scopes

Permissions can be scoped to different levels:

- **system** - Platform-wide (owner only)
- **organization** - Organization-level
- **team** - Team-level (for future team support)
- **personal** - Personal/individual level

## Integration Guide

### 1. Install Identity Service

```bash
npm install @aig/identity
```

### 2. Add to NestJS Module

```typescript
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import {
  AuthenticationService,
  AuthorizationService,
  JwtStrategy,
  JwtAuthGuard,
} from '@aig/identity'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthenticationService,
    AuthorizationService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthenticationService, AuthorizationService, JwtAuthGuard],
})
export class IdentityModule {}
```

### 3. Protect Routes

```typescript
@UseGuards(JwtAuthGuard)
@Get('/protected-resource')
async getProtected(@Request() req) {
  return { user: req.user }
}
```

## JWT Token Structure

```typescript
interface TokenPayload {
  userId: string
  organizationId: string
  roleIds: string[]
  permissions: string[]
  iat: number  // Issued at
  exp: number  // Expiration
  iss: 'aig-platform'  // Issuer
}
```

## Environment Variables

```bash
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

## Security Considerations

1. **Password Hashing** - All passwords are hashed with bcrypt (10 rounds)
2. **Token Expiration** - Access tokens expire after 24 hours
3. **Refresh Tokens** - Refresh tokens expire after 7 days
4. **Session Invalidation** - Sessions can be manually invalidated
5. **Permission Inheritance** - Permissions inherited from roles cannot be revoked at user level
6. **Role Hierarchy** - Users can only manage users with lower hierarchy levels

## Future Enhancements

- [ ] Multi-factor authentication (MFA) support
- [ ] OAuth 2.0 social login
- [ ] SAML support for enterprise SSO
- [ ] API key management for service-to-service auth
- [ ] Audit log persistence
- [ ] Rate limiting and brute-force protection
- [ ] Team-level access control
- [ ] Resource-level permissions

## Testing

```bash
npm test
```

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Passport.js Strategy](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [OWASP Authentication](https://owasp.org/www-project-authentication-cheat-sheet/)
