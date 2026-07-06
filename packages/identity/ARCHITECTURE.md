# Identity Service Architecture

**Phase:** 2 - Identity & Knowledge Foundation  
**Status:** Foundation (v0.1.0)  
**Stability:** Pre-release

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway / App                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Request Flow:                                               │
│  1. User sends request with JWT token in Authorization       │
│  2. JwtAuthGuard validates token                             │
│  3. Request context enriched with user identity              │
│  4. Route-level PermissionGuard checks authorization         │
│  5. Business logic executes with user context                │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Identity Service                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Authentication Layer:                                       │
│  ├─ JwtStrategy (Passport)                                   │
│  │  └─ Validates JWT tokens on each request                 │
│  ├─ AuthenticationService                                    │
│  │  ├─ Hash/verify passwords                                │
│  │  ├─ Generate/verify tokens                               │
│  │  └─ Manage sessions                                      │
│  └─ Session Management                                       │
│     └─ Track active sessions, invalidation                  │
│                                                               │
│  Authorization Layer:                                        │
│  ├─ AuthorizationService                                     │
│  │  ├─ Resolve user permissions                             │
│  │  ├─ Check permission rules                               │
│  │  └─ Enforce role hierarchy                               │
│  ├─ Permission Model                                         │
│  │  ├─ resource:action format                               │
│  │  ├─ Permission inheritance                               │
│  │  └─ Scope enforcement                                    │
│  └─ Role Hierarchy                                           │
│     ├─ Owner (Level 0)                                       │
│     ├─ Admin (Level 1)                                       │
│     ├─ Editor (Level 2)                                      │
│     ├─ Viewer (Level 3)                                      │
│     └─ Guest (Level 4+)                                      │
│                                                               │
│  Data Models:                                                │
│  ├─ User (profile, preferences, auth data)                  │
│  ├─ Organization (settings, configuration)                  │
│  ├─ Role (permissions, hierarchy level)                     │
│  ├─ Permission (resource, action, scope)                    │
│  └─ Session (JWT, expiration, device tracking)              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. Login Request
   ├─ Username/password → AuthenticationService
   ├─ Verify password against hash
   └─ Create session

2. Token Generation
   ├─ Generate JWT payload with:
   │  ├─ userId
   │  ├─ organizationId
   │  ├─ roleIds
   │  └─ permissions
   ├─ Sign token with secret
   └─ Return access + refresh tokens

3. Request with Token
   ├─ Client includes: Authorization: Bearer <token>
   ├─ JwtStrategy validates signature
   ├─ JwtAuthGuard confirms valid token
   └─ Request context populated with user info

4. Token Refresh
   ├─ Client sends refresh token
   ├─ Verify refresh token validity
   ├─ Generate new access token
   └─ Return fresh JWT
```

## Authorization Flow

```
1. Permission Lookup
   ├─ Get user's assigned roles
   ├─ Get user's direct permissions
   └─ Combine into effective permission set

2. Permission Check
   ├─ Request specifies required permission
   ├─ Check if in effective permission set
   ├─ Check for wildcard permissions
   └─ Allow/deny based on result

3. Role Hierarchy Check (for user management)
   ├─ Manager's role level
   ├─ Target user's role level
   └─ Allow management only if manager > target
```

## Data Model Relationships

```
Organization (tenant)
    ├── Members (Users)
    │   ├── userId
    │   ├── organizationId
    │   ├── roleIds (many)
    │   └── directPermissions (many)
    └── Roles
        ├── roleId
        ├── organizationId
        ├── level (hierarchy)
        ├── permissions (many)
        └── isBuiltIn

User
    ├── profile (UserProfile)
    │   ├── firstName
    │   ├── lastName
    │   ├── email
    │   └── avatar
    ├── preferences (UserPreferences)
    │   ├── theme
    │   ├── notifications
    │   └── language
    └── auth
        ├── passwordHash
        ├── mfaEnabled
        ├── emailVerified
        └── status

Role
    ├── permissions (Set<string>)
    │   └── "resource:action"
    ├── level (0=owner, 1=admin, 2=editor, 3=viewer, 4+=guest)
    └── isBuiltIn

Permission
    ├── resource (org, members, roles, ask-diana, etc.)
    ├── action (view, create, edit, delete, manage, all)
    └── scope (system, organization, team, personal)
```

## Security Architecture

### Password Security
- **Algorithm:** bcrypt with 10 salt rounds
- **Storage:** Hashed only, never plaintext
- **Verification:** Constant-time comparison
- **Reset:** Token-based with expiration

### Token Security
- **Algorithm:** JWT with HS256
- **Secret:** Environment-based, never committed
- **Expiration:** 24 hours for access, 7 days for refresh
- **Revocation:** Session invalidation on logout
- **Scope:** Confined to organization context

### Session Security
- **Tracking:** Device ID, IP address, user agent
- **Expiration:** Automatic invalidation after period
- **Invalidation:** Manual logout/sign-out capability
- **Auditing:** All auth events can be logged

### Permission Security
- **Hierarchy:** Users cannot elevate their own permissions
- **Scoping:** Permissions scoped to organization
- **Inheritance:** Can only add/remove role assignments (not direct perms)
- **Validation:** Permission checks on every protected request

## Component Details

### JwtStrategy (Passport)
- Validates JWT signature on each request
- Extracts user payload from token
- Populates request.user with decoded token
- Called by JwtAuthGuard

### JwtAuthGuard
- Automatically validates JWT token presence
- Returns 401 Unauthorized if missing/invalid
- Passes to next middleware if valid
- Applied via @UseGuards(JwtAuthGuard)

### PermissionGuard
- Checks specific permission requirements
- Compares user permissions against required
- Returns 403 Forbidden if insufficient
- Metadata-driven via @SetMetadata('permission', 'resource:action')

### AuthenticationService
- Password hashing/verification (bcrypt)
- JWT generation with custom payloads
- Token verification and decoding
- Session lifecycle management

### AuthorizationService
- Effective permission calculation
- Permission checking (exact, wildcard, wildcard action)
- Role hierarchy enforcement
- User management authorization

## Scalability Considerations

### Current (v0.1.0)
- In-memory session storage
- Single-process deployment
- Direct service invocation

### Planned (v0.2.0+)
- Redis-based session cache
- JWT token blacklist for revocation
- Distributed permission cache
- Event-driven invalidation
- Rate limiting and DDoS protection

## Testing Strategy

### Unit Tests
- AuthenticationService (password, token generation)
- AuthorizationService (permission checking)
- Permission model functions
- Role hierarchy logic

### Integration Tests
- JwtStrategy with actual tokens
- AuthGuards with real requests
- Permission resolution with role combinations
- Session lifecycle

### Scenario Tests
- Multi-role user permissions
- Hierarchical user management
- Token refresh flow
- Session invalidation

## Future Enhancements

### Phase 2.1
- MFA support (TOTP, SMS)
- Password reset flow
- Email verification
- Session management API

### Phase 2.2
- OAuth 2.0 integration
- OIDC support
- API key authentication
- Service account management

### Phase 2.3
- SAML SSO
- Audit log persistence
- Rate limiting
- Risk-based authentication

### Phase 3+
- Team-level RBAC
- Resource-level permissions
- Dynamic policy engine
- Attribute-based access control (ABAC)
