/**
 * Organization Model
 * 
 * Represents a tenant in the multi-tenant AIG Platform
 * Handles team structure, billing, and settings
 */

export interface OrganizationSettings {
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  
  // Billing
  plan: 'free' | 'pro' | 'enterprise'
  billingEmail: string
  
  // Customization
  theme?: {
    primary: string
    secondary: string
  }
  
  // Security
  requireMfa: boolean
  ssoEnabled: boolean
  ipWhitelist?: string[]
  sessionTimeout: number // minutes
}

export interface Organization {
  id: string
  settings: OrganizationSettings
  
  // Ownership
  ownerId: string
  
  // Members
  memberCount: number
  
  // Status
  status: 'active' | 'suspended' | 'archived'
  
  // Audit
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface CreateOrganizationRequest {
  name: string
  slug: string
  description?: string
  billingEmail: string
  ownerId: string
}

export interface UpdateOrganizationRequest {
  settings?: Partial<OrganizationSettings>
  status?: Organization['status']
}

export interface OrganizationStats {
  totalMembers: number
  activeUsers: number
  lastActivityAt: Date
  apiCallsThisMonth: number
  storageUsedMB: number
}
