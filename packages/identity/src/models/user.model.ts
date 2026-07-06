/**
 * User Model
 * 
 * Represents a user account in the AIG Platform
 * Includes personal information, preferences, and account status
 */

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  timezone?: string
  locale?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  language: string
}

export interface User {
  id: string
  organizationId: string
  profile: UserProfile
  preferences: UserPreferences
  
  // Authentication
  passwordHash: string
  passwordChangedAt?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  
  // MFA
  mfaEnabled: boolean
  mfaSecret?: string
  
  // Status
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  emailVerified: boolean
  emailVerificationToken?: string
  
  // Roles and Permissions
  roleIds: string[]
  directPermissions: string[]
  
  // Audit
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  lastActivityAt?: Date
  deletedAt?: Date
}

export interface CreateUserRequest {
  organizationId: string
  profile: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    timezone?: string
    locale?: string
  }
  password: string
  roleIds?: string[]
}

export interface UpdateUserRequest {
  profile?: Partial<UserProfile>
  preferences?: Partial<UserPreferences>
  status?: User['status']
}

export interface UserWithoutPassword extends Omit<User, 'passwordHash' | 'passwordResetToken' | 'mfaSecret'> {
  // Stripped down user for API responses
}
