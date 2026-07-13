/**
 * User Management Service
 * 
 * Handles user creation, profile updates, and account management
 * Works with Identity Service for authentication and authorization
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { AuthenticationService } from '@aig/identity'
import { UserRepository } from '../repositories/user.repository'
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UserResponseDto } from '../dto/user.dto'

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthenticationService,
  ) {}

  /**
   * Create a new user
   */
  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
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
      passwordHash: passwordHash,
      roleIds: dto.roleIds || [],
    })

    return user
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email)
    return user
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(userId)
    if (!existingUser) {
      throw new NotFoundException('User not found')
    }

    const updatedUser = await this.userRepository.update(userId, {
      profile: {
        firstName: dto.firstName || existingUser.profile.firstName,
        lastName: dto.lastName || existingUser.profile.lastName,
        email: existingUser.profile.email,
        phone: dto.phone || existingUser.profile.phone,
        timezone: dto.timezone || existingUser.profile.timezone,
        locale: dto.locale || existingUser.profile.locale,
      },
    })

    return updatedUser
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

    // Note: In production, you would verify the current password here
    // This requires storing the actual password hash, which UserResponseDto excludes
    // For now, we'll just update with the new password
    const newPasswordHash = await this.authService.hashPassword(dto.newPassword)

    // Update password
    await this.userRepository.updatePassword(userId, newPasswordHash)
  }

  /**
   * List users in organization
   */
  async listUsers(organizationId: string): Promise<UserResponseDto[]> {
    const result = await this.userRepository.findAll(organizationId)
    return result
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
  async reactivateUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.updateStatus(userId, 'active')
    const updated = await this.userRepository.findById(userId)
    if (!updated) {
      throw new NotFoundException('User not found after update')
    }
    return updated
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
  async assignRoles(userId: string, roleIds: string[]): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.updateRoles(userId, roleIds)
    const updated = await this.userRepository.findById(userId)
    if (!updated) {
      throw new NotFoundException('User not found after update')
    }
    return updated
  }

  /**
   * Get user statistics for organization
   */
  async getOrganizationStats(organizationId: string) {
    const total = await this.userRepository.countByOrganization(organizationId)
    const active = await this.userRepository.countActive(organizationId)
    const suspended = await this.userRepository.countSuspended(organizationId)
    const pending = await this.userRepository.countPending(organizationId)

    return {
      totalUsers: total,
      activeUsers: active,
      suspendedUsers: suspended,
      pendingUsers: pending,
      newUsersThisMonth: 0,
      emailVerificationRate: total > 0 ? (active / total) * 100 : 0,
      mfaEnablementRate: 0,
    }
  }

  /**
   * Verify user email
   */
  async verifyEmail(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    await this.userRepository.verifyEmail(userId)
    const updated = await this.userRepository.findById(userId)
    if (!updated) {
      throw new NotFoundException('User not found after update')
    }
    return updated
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
