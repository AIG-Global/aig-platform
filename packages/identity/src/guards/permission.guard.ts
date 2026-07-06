/**
 * Permission Guard
 * 
 * Guard for checking user permissions on specific resources
 * Usage: @UseGuards(PermissionGuard('ask-diana:create'))
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler())
    if (!requiredPermission) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    const [resource, action] = requiredPermission.split(':')
    const userPermissions = new Set(user.permissions)

    // Check permission
    if (!userPermissions.has(requiredPermission) && !userPermissions.has(`${resource}:*`)) {
      throw new ForbiddenException(`User does not have permission: ${requiredPermission}`)
    }

    return true
  }
}
