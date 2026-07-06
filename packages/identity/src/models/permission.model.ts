/**
 * Permission Model
 * 
 * Fine-grained permission system with hierarchical scoping
 * Format: resource:action (e.g., org:manage, ask-diana:create)
 */

export interface Permission {
  id: string
  resource: string // 'org', 'members', 'ask-diana', 'knowledge', etc.
  action: string   // 'view', 'create', 'edit', 'delete', 'manage'
  description: string
  
  // Hierarchy
  scope: 'system' | 'organization' | 'team' | 'personal'
  
  // Status
  active: boolean
  
  // Audit
  createdAt: Date
  updatedAt: Date
}

/**
 * Standard permissions across the platform
 * Organized by resource
 */
export const STANDARD_PERMISSIONS: Record<string, Permission> = {
  // Organization permissions
  'org:view': {
    id: 'org:view',
    resource: 'org',
    action: 'view',
    description: 'View organization settings',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'org:manage': {
    id: 'org:manage',
    resource: 'org',
    action: 'manage',
    description: 'Manage organization settings',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'org:delete': {
    id: 'org:delete',
    resource: 'org',
    action: 'delete',
    description: 'Delete organization',
    scope: 'system',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Member management
  'members:view': {
    id: 'members:view',
    resource: 'members',
    action: 'view',
    description: 'View organization members',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'members:manage': {
    id: 'members:manage',
    resource: 'members',
    action: 'manage',
    description: 'Manage organization members',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Role management
  'roles:create': {
    id: 'roles:create',
    resource: 'roles',
    action: 'create',
    description: 'Create custom roles',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'roles:manage': {
    id: 'roles:manage',
    resource: 'roles',
    action: 'manage',
    description: 'Manage all roles',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Ask Diana permissions
  'ask-diana:view': {
    id: 'ask-diana:view',
    resource: 'ask-diana',
    action: 'view',
    description: 'View Ask Diana conversations',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'ask-diana:create': {
    id: 'ask-diana:create',
    resource: 'ask-diana',
    action: 'create',
    description: 'Create new conversations',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'ask-diana:edit': {
    id: 'ask-diana:edit',
    resource: 'ask-diana',
    action: 'edit',
    description: 'Edit conversations',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'ask-diana:delete': {
    id: 'ask-diana:delete',
    resource: 'ask-diana',
    action: 'delete',
    description: 'Delete conversations',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'ask-diana:share': {
    id: 'ask-diana:share',
    resource: 'ask-diana',
    action: 'share',
    description: 'Share conversations',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  'ask-diana:all': {
    id: 'ask-diana:all',
    resource: 'ask-diana',
    action: 'all',
    description: 'Full Ask Diana access',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Audit permissions
  'audit:view': {
    id: 'audit:view',
    resource: 'audit',
    action: 'view',
    description: 'View audit logs',
    scope: 'organization',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

/**
 * Check if user has permission
 */
export function hasPermission(permissions: Set<string>, resource: string, action: string): boolean {
  // Check exact permission
  if (permissions.has(`${resource}:${action}`)) {
    return true
  }

  // Check wildcard resource permissions
  if (permissions.has(`${resource}:*`)) {
    return true
  }

  // Check wildcard action permissions (special cases)
  if (permissions.has(`${resource}:all`)) {
    return true
  }

  return false
}

/**
 * Check if user has any of the required permissions
 */
export function hasAnyPermission(
  permissions: Set<string>,
  required: Array<[resource: string, action: string]>,
): boolean {
  return required.some(([resource, action]) => hasPermission(permissions, resource, action))
}

/**
 * Check if user has all of the required permissions
 */
export function hasAllPermissions(
  permissions: Set<string>,
  required: Array<[resource: string, action: string]>,
): boolean {
  return required.every(([resource, action]) => hasPermission(permissions, resource, action))
}
