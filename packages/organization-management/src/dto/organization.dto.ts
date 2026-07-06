import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator'

/**
 * Create Organization DTO
 */
export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  name: string

  @IsString()
  @MinLength(2)
  slug: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEmail()
  billingEmail: string

  @IsString()
  ownerId: string
}

/**
 * Update Organization DTO
 */
export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  logo?: string

  @IsOptional()
  @IsString()
  website?: string

  @IsOptional()
  @IsEmail()
  billingEmail?: string

  @IsOptional()
  @IsEnum(['free', 'pro', 'enterprise'])
  plan?: 'free' | 'pro' | 'enterprise'

  @IsOptional()
  requireMfa?: boolean

  @IsOptional()
  sessionTimeout?: number
}

/**
 * Organization Settings DTO
 */
export class OrganizationSettingsDto {
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  billingEmail: string
  plan: 'free' | 'pro' | 'enterprise'
  requireMfa: boolean
  ssoEnabled: boolean
  sessionTimeout: number
}

/**
 * Organization Response DTO
 */
export class OrganizationResponseDto {
  id: string
  settings: OrganizationSettingsDto
  ownerId: string
  memberCount: number
  status: 'active' | 'suspended' | 'archived'
  createdAt: Date
  updatedAt: Date
}

/**
 * Add Organization Member DTO
 */
export class AddOrganizationMemberDto {
  @IsString()
  userId: string

  @IsString({ each: true })
  roleIds: string[]
}

/**
 * Remove Organization Member DTO
 */
export class RemoveOrganizationMemberDto {
  @IsString()
  userId: string
}

/**
 * Organization Member DTO
 */
export class OrganizationMemberDto {
  userId: string
  firstName: string
  lastName: string
  email: string
  roleIds: string[]
  joinedAt: Date
  status: string
}

/**
 * List Organizations Query DTO
 */
export class ListOrganizationsQueryDto {
  @IsOptional()
  @IsString()
  status?: 'active' | 'suspended' | 'archived'

  @IsOptional()
  plan?: 'free' | 'pro' | 'enterprise'

  @IsOptional()
  page?: number = 1

  @IsOptional()
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
 * Organization Statistics DTO
 */
export class OrganizationStatsDto {
  totalMembers: number
  activeUsers: number
  totalConversations: number
  lastActivityAt: Date
  apiCallsThisMonth: number
  storageUsedMB: number
  plan: string
  daysUntilTrialExpires?: number
}
