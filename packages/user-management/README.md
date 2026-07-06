# User Management Service

**Version:** 0.2.0  
**Status:** v0.2.0 - Foundation  
**Phase:** 2 - Identity & Knowledge Foundation

REST API for user account management, profile updates, and user administration.

## Overview

The User Management Service provides:
- **User Creation** - Sign up new user accounts
- **Profile Management** - Update user information
- **Password Management** - Change passwords securely
- **Account Status** - Activate, deactivate, suspend users
- **Role Assignment** - Manage user roles and permissions
- **Email Verification** - Verify user email addresses
- **User Statistics** - Track organization user metrics

## Endpoints

### User CRUD Operations

**POST /users** - Create new user
```json
{
  "organizationId": "org-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePassword123!",
  "roleIds": ["editor"]
}
```

**GET /users/:id** - Get user profile (requires auth)
```
GET /users/user-123
Authorization: Bearer <token>
```

**GET /users** - List organization users (requires auth)
```
GET /users?page=1&limit=20&status=active&search=john
Authorization: Bearer <token>
```

**PATCH /users/:id** - Update user profile (requires auth)
```json
{
  "firstName": "Jonathan",
  "phone": "+9876543210",
  "timezone": "America/New_York"
}
```

**PATCH /users/:id/password** - Change password (requires auth)
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

### Role Management

**PATCH /users/:id/roles** - Assign roles (requires auth)
```json
{
  "roleIds": ["admin", "editor"]
}
```

### Account Status

**PATCH /users/:id/deactivate** - Deactivate user (requires auth)
**PATCH /users/:id/reactivate** - Reactivate user (requires auth)
**PATCH /users/:id/suspend** - Suspend user (requires auth)
**PATCH /users/:id/verify-email** - Verify email
```json
{
  "verificationToken": "token123"
}
```

### Account Deletion

**DELETE /users/:id** - Delete user account (requires auth)

### Statistics

**GET /users/organizations/:orgId/stats** - Get user statistics (requires auth)
```json
{
  "totalUsers": 150,
  "activeUsers": 120,
  "suspendedUsers": 5,
  "pendingUsers": 25,
  "newUsersThisMonth": 30,
  "emailVerificationRate": 92.5,
  "mfaEnablementRate": 85.0
}
```

## DTOs

### CreateUserDto
```typescript
{
  organizationId: string
  firstName: string        // min 2 chars
  lastName: string         // min 2 chars
  email: string           // valid email
  phone?: string
  password: string        // min 8 chars
  roleIds?: string[]
}
```

### UpdateUserDto
```typescript
{
  firstName?: string
  lastName?: string
  phone?: string
  timezone?: string
  locale?: string
}
```

### ChangePasswordDto
```typescript
{
  currentPassword: string  // min 8 chars
  newPassword: string     // min 8 chars
  confirmPassword: string // must match newPassword
}
```

### ListUsersQueryDto
```typescript
{
  organizationId?: string
  status?: 'active' | 'inactive' | 'suspended' | 'pending'
  page?: number          // default 1
  limit?: number         // default 20
  search?: string
  sortBy?: string        // default 'createdAt'
  sortOrder?: 'asc' | 'desc'  // default 'desc'
}
```

## Security Features

✅ **Password Security**
- Minimum 8 characters
- bcrypt hashing
- Current password verification for changes

✅ **Email Verification**
- Token-based email verification
- Prevents spam registrations

✅ **Access Control**
- JWT authentication on protected endpoints
- Organization-scoped data access
- User can only modify own profile

✅ **Account Status Management**
- Multiple status levels (active, inactive, suspended, pending)
- Soft deletion support
- Easy reactivation

## Service Architecture

```
UserManagementController
    ↓
UserManagementService
    ↓
IUserRepository (abstract)
    ├── InMemoryUserRepository (for development)
    └── [PostgreSQL/MongoDB implementation]
    ↓
AuthenticationService (from @aig/identity)
```

## Repository Pattern

The service uses a repository pattern for data access, allowing different implementations:

```typescript
interface IUserRepository {
  create(data: CreateUserRequest): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  update(id: string, data: UpdateUserRequest): Promise<User>
  delete(id: string): Promise<void>
  // ... and more
}
```

**Current Implementation:** InMemoryUserRepository (for testing)
**Production Implementation:** PostgreSQL/MongoDB (planned for v0.2.1)

## Response Format

### Success Response
```json
{
  "id": "user-123",
  "organizationId": "org-456",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "status": "active",
  "emailVerified": true,
  "mfaEnabled": false,
  "roleIds": ["editor"],
  "createdAt": "2026-07-06T12:00:00Z",
  "updatedAt": "2026-07-06T12:00:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Email already registered",
  "error": "BadRequestException"
}
```

## Integration

### Basic Integration
```typescript
import { Module } from '@nestjs/common'
import { UserManagementController, UserManagementService, InMemoryUserRepository } from '@aig/user-management'
import { AuthenticationService } from '@aig/identity'

@Module({
  controllers: [UserManagementController],
  providers: [
    UserManagementService,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
    AuthenticationService,
  ],
  exports: [UserManagementService],
})
export class UserManagementModule {}
```

## Validation

All DTOs use class-validator decorators:
- Email validation
- String length validation
- Custom error messages
- Type transformation via class-transformer

## Error Handling

Common errors:
- **400 BadRequestException** - Invalid input, email exists, passwords don't match
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Insufficient permissions
- **404 NotFoundException** - User not found
- **500 InternalServerError** - Server error

## Features for v0.2.1+

- [ ] Email verification flow
- [ ] Password reset
- [ ] MFA/TOTP support
- [ ] Session management API
- [ ] User activity logging
- [ ] Batch operations
- [ ] Export/import users
- [ ] SSO integration
- [ ] API key management
- [ ] Audit trail

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [Class Validator](https://github.com/typestack/class-validator)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
