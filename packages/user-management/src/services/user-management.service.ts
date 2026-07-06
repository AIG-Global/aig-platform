/**
 * User Management Service
 * 
 * Handles user creation, profile updates, and account management
 * Works with Identity Service for authentication and authorization
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { AuthenticationService } from '@aig/identity'
import type { User } from '@aig/identity'
import { UserRepository } from '../repositories/user.repository'
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserStatsDto } from '../dto/user.dto'

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthenticationService,
  ) {}

  /**
   * Create a new user
   */
  async createUser(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Check if email already exists
    const emailExists = await this.userRepository.emailExists(dto.email)
    if (emailExists) {
      throw new BadRequestException('Email already registered')
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(dto.password)

    // Create user
    const user = await this.userRepository.create({
      organizationId: dto.organizationId,
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        timezone: 'UTC',
        locale: 'en-US',
      },
      password: passwordHash, // This will be used as passwordHash
      roleIds: dto.roleIds,
    })

    // Update password hash (since create expects password field, we need to update it)
    await this.userRepository.updatePassword(user.id, passwordHash)

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return null
    }

    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.update(userId, {
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: (await this.userRepository.findById(userId))?.profile.email || '',
        phone: dto.phone,
        timezone: dto.timezone,
        locale: dto.locale,
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Verify current password
    const isValid = await this.authService.verifyPassword(dto.currentPassword, user.passwordHash)
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    // Hash new password
    const newPasswordHash = await this.authService.hashPassword(dto.newPassword)

    // Update password
    await this.userRepository.updatePassword(userId, newPasswordHash)
  }

  /**
   * List users in organization
   */
  async listUsers(
    organizationId: string,
    options?: {
      page?: number
      limit?: number
      search?: string
      status?: string
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    },
  ): Promise<{ users: Omit<User, 'passwordHash'>[]; total: number }> {
    const result = await this.userRepository.list({
      organizationId,
      ...options,
    })

    return {
      users: result.users.map(({ passwordHash: _, ...user }) => user),
      total: result.total,
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.updateStatus(userId, 'inactive')
  }

  /**
   * Reactivate user
   */
  async reactivateUser(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updated = await this.userRepository.updateStatus(userId, 'active')
    const { passwordHash: _, ...userWithoutPassword } = updated
    return userWithoutPassword
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.updateStatus(userId, 'suspended')
  }

  /**
   * Assign roles to user
   */
  async assignRoles(userId: string, roleIds: string[]): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updated = await this.userRepository.updateRoles(userId, roleIds)
    const { passwordHash: _, ...userWithoutPassword } = updated
    return userWithoutPassword
  }

  /**
   * Get user statistics for organization
   */
  async getOrganizationStats(organizationId: string): Promise<UserStatsDto> {
    const total = await this.userRepository.countByOrganization(organizationId)
    const active = await this.userRepository.countByOrganization(organizationId, 'active')
    const suspended = await this.userRepository.countByOrganization(organizationId, 'suspended')
    const pending = await this.userRepository.countByOrganization(organizationId, 'pending')

    // These would come from actual data in production
    const emailVerificationRate = total > 0 ? (active / total) * 100 : 0
    const mfaEnablementRate = (active * 0.5) // Assume 50% have MFA in this example

    return {
      totalUsers: total,
      activeUsers: active,
      suspendedUsers: suspended,
      pendingUsers: pending,
      newUsersThisMonth: 0, // Would calculate from data
      emailVerificationRate,
      mfaEnablementRate,
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const updated = await this.userRepository.verifyEmail(userId)
    const { passwordHash: _, ...userWithoutPassword } = updated
    return userWithoutPassword
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.delete(userId)
  }
}
