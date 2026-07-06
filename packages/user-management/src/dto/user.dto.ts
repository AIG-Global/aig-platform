import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Create User DTO
 */
export class CreateUserDto {
  @IsString()
  organizationId: string

  @IsString()
  @MinLength(2)
  firstName: string

  @IsString()
  @MinLength(2)
  lastName: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsString()
  @MinLength(8)
  password: string

  @IsOptional()
  @IsString({ each: true })
  roleIds?: string[]
}

/**
 * Update User DTO
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  timezone?: string

  @IsOptional()
  @IsString()
  locale?: string
}

/**
 * Update User Preferences DTO
 */
export class UpdateUserPreferencesDto {
  @IsOptional()
  theme?: 'light' | 'dark' | 'auto'

  @IsOptional()
  @Type(() => Object)
  notifications?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }

  @IsOptional()
  @IsString()
  language?: string
}

/**
 * Change Password DTO
 */
export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  currentPassword: string

  @IsString()
  @MinLength(8)
  newPassword: string

  @IsString()
  @MinLength(8)
  confirmPassword: string
}

/**
 * User Response DTO
 */
export class UserResponseDto {
  id: string
  organizationId: string
  profile: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    avatar?: string
    timezone?: string
    locale?: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      email: boolean
      push: boolean
      inApp: boolean
    }
    language: string
  }
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  emailVerified: boolean
  mfaEnabled: boolean
  roleIds: string[]
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

/**
 * List Users Query DTO
 */
export class ListUsersQueryDto {
  @IsOptional()
  @IsString()
  organizationId?: string

  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive' | 'suspended' | 'pending'

  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc'
}

/**
 * Assign Roles DTO
 */
export class AssignRolesDto {
  @IsString({ each: true })
  roleIds: string[]
}

/**
 * User Statistics DTO
 */
export class UserStatsDto {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  pendingUsers: number
  newUsersThisMonth: number
  emailVerificationRate: number
  mfaEnablementRate: number
}
