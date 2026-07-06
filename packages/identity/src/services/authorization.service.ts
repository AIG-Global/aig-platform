/**
 * Authorization Service
 * 
 * Manages roles, permissions, and access control
 * Provides utilities for checking permissions across the platform
 */

import { Injectable } from '@nestjs/common'
import { Role, hasPermission, hasAnyPermission, hasAllPermissions, User } from '../models/index.js'

@Injectable()
export class AuthorizationService {
  /**
   * Get user's effective permissions
   * Combines permissions from all assigned roles
   */
  getUserPermissions(user: User, roles: Role[]): Set<string> {
    const permissions = new Set<string>()

    // Add direct permissions
    for (const permission of user.directPermissions) {
      permissions.add(permission)
    }

    // Add permissions from roles
    for (const roleId of user.roleIds) {
      const role = roles.find((r) => r.id === roleId)
      if (role) {
        role.permissions.forEach((perm) => permissions.add(perm))
      }
    }

    return permissions
  }

  /**
   * Check if user has permission
   */
  hasPermission(
    userPermissions: Set<string>,
    resource: string,
    action: string,
  ): boolean {
    return hasPermission(userPermissions, resource, action)
  }

  /**
   * Check if user has any of required permissions
   */
  hasAnyPermission(
    userPermissions: Set<string>,
    required: Array<[resource: string, action: string]>,
  ): boolean {
    return hasAnyPermission(userPermissions, required)
  }

  /**
   * Check if user has all required permissions
   */
  hasAllPermissions(
    userPermissions: Set<string>,
    required: Array<[resource: string, action: string]>,
  ): boolean {
    return hasAllPermissions(userPermissions, required)
  }

  /**
   * Get role hierarchy level
   */
  getRoleLevel(role: Role): number {
    return role.level
  }

  /**
   * Check if user can manage another user
   * Users can only manage users below their hierarchy level
   */
  canManageUser(managerRole: Role, targetRole: Role): boolean {
    return managerRole.level < targetRole.level
  }

  /**
   * Check if user can perform action on resource
   */
  canPerformAction(userRole: Role, userPermissions: Set<string>, resource: string, action: string): boolean {
    // Check explicit permission
    if (this.hasPermission(userPermissions, resource, action)) {
      return true
    }

    // Check wildcard permissions based on role level
    if (resource === 'ask-diana') {
      // Viewers can only view
      if (userRole.level >= 3 && action === 'view') {
        return userPermissions.has('ask-diana:view')
      }
      // Editors can create, edit, delete
      if (userRole.level >= 2 && ['create', 'edit', 'delete', 'share'].includes(action)) {
        return this.hasPermission(userPermissions, 'ask-diana', action)
      }
    }

    return false
  }
}
