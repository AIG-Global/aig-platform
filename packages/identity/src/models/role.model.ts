/**
 * Role Model
 * 
 * Defines hierarchical roles with granular permissions
 * System roles include Owner, Admin, Editor, Viewer
 */

export type BuiltInRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'

export interface Role {
  id: string
  organizationId: string
  name: string
  description?: string
  
  // Hierarchy
  level: number // 0=owner, 1=admin, 2=editor, 3=viewer, 4+=guest
  isBuiltIn: boolean
  
  // Permissions
  permissions: Set<string>
  
  // Status
  active: boolean
  
  // Audit
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface CreateRoleRequest {
  organizationId: string
  name: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[]
  active?: boolean
}

/**
 * Built-in role definitions
 * These are predefined roles with standard permission sets
 */
export const BUILT_IN_ROLES: Record<BuiltInRole, { level: number; permissions: string[] }> = {
  owner: {
    level: 0,
    permissions: [
      'org:manage',
      'org:delete',
      'members:manage',
      'roles:manage',
      'settings:manage',
      'billing:manage',
      'ask-diana:all',
      'audit:view',
    ],
  },
  admin: {
    level: 1,
    permissions: [
      'members:manage',
      'roles:create',
      'settings:view',
      'ask-diana:all',
      'audit:view',
    ],
  },
  editor: {
    level: 2,
    permissions: [
      'ask-diana:create',
      'ask-diana:edit',
      'ask-diana:delete',
      'ask-diana:share',
      'knowledge:manage',
    ],
  },
  viewer: {
    level: 3,
    permissions: [
      'ask-diana:view',
      'ask-diana:comment',
      'knowledge:view',
    ],
  },
  guest: {
    level: 4,
    permissions: [
      'ask-diana:view',
      'knowledge:view',
    ],
  },
}
