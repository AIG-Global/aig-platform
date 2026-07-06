/**
 * User Repository
 * 
 * Abstract repository interface for user persistence
 * Implementations can use MongoDB, PostgreSQL, etc.
 */

import { User, CreateUserRequest, UpdateUserRequest } from '@aig/identity'

export interface IUserRepository {
  /**
   * Create a new user
   */
  create(data: CreateUserRequest): Promise<User>

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * Find users by organization
   */
  findByOrganization(organizationId: string, options?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<{ users: User[]; total: number }>

  /**
   * Update user
   */
  update(id: string, data: UpdateUserRequest): Promise<User>

  /**
   * Delete user (soft delete)
   */
  delete(id: string): Promise<void>

  /**
   * Restore deleted user
   */
  restore(id: string): Promise<User>

  /**
   * Update user status
   */
  updateStatus(id: string, status: User['status']): Promise<User>

  /**
   * Update user password
   */
  updatePassword(id: string, passwordHash: string): Promise<User>

  /**
   * Verify user email
   */
  verifyEmail(id: string): Promise<User>

  /**
   * List all users (with pagination)
   */
  list(options?: {
    page?: number
    limit?: number
    organizationId?: string
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ users: User[]; total: number }>

  /**
   * Count users in organization
   */
  countByOrganization(organizationId: string, status?: string): Promise<number>

  /**
   * Check if email exists
   */
  emailExists(email: string): Promise<boolean>

  /**
   * Bulk update user roles
   */
  updateRoles(id: string, roleIds: string[]): Promise<User>
}

/**
 * In-memory implementation for testing
 */
export class InMemoryUserRepository implements IUserRepository {
  private users = new Map<string, User>()

  async create(data: CreateUserRequest): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      organizationId: data.organizationId,
      profile: data.profile,
      preferences: {
        theme: 'auto',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      passwordHash: '', // Will be set by service
      mfaEnabled: false,
      status: 'pending',
      emailVerified: false,
      roleIds: data.roleIds || [],
      directPermissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.profile.email === email && !user.deletedAt) {
        return user
      }
    }
    return null
  }

  async findByOrganization(
    organizationId: string,
    options?: { page?: number; limit?: number; search?: string; status?: string },
  ): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values()).filter(
      (u) => u.organizationId === organizationId && !u.deletedAt,
    )

    if (options?.status) {
      users = users.filter((u) => u.status === options.status)
    }

    if (options?.search) {
      const search = options.search.toLowerCase()
      users = users.filter(
        (u) =>
          u.profile.firstName.toLowerCase().includes(search) ||
          u.profile.lastName.toLowerCase().includes(search) ||
          u.profile.email.toLowerCase().includes(search),
      )
    }

    const page = options?.page || 1
    const limit = options?.limit || 20
    const start = (page - 1) * limit
    const paginated = users.slice(start, start + limit)

    return { users: paginated, total: users.length }
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')

    if (data.profile) {
      user.profile = { ...user.profile, ...data.profile }
    }
    if (data.preferences) {
      user.preferences = { ...user.preferences, ...data.preferences }
    }
    if (data.status) {
      user.status = data.status
    }
    user.updatedAt = new Date()

    this.users.set(id, user)
    return user
  }

  async delete(id: string): Promise<void> {
    const user = this.users.get(id)
    if (user) {
      user.deletedAt = new Date()
      this.users.set(id, user)
    }
  }

  async restore(id: string): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    user.deletedAt = undefined
    this.users.set(id, user)
    return user
  }

  async updateStatus(id: string, status: User['status']): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    user.status = status
    user.updatedAt = new Date()
    this.users.set(id, user)
    return user
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    user.passwordHash = passwordHash
    user.passwordChangedAt = new Date()
    user.updatedAt = new Date()
    this.users.set(id, user)
    return user
  }

  async verifyEmail(id: string): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    user.emailVerified = true
    user.updatedAt = new Date()
    this.users.set(id, user)
    return user
  }

  async list(options?: {
    page?: number
    limit?: number
    organizationId?: string
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values()).filter((u) => !u.deletedAt)

    if (options?.organizationId) {
      users = users.filter((u) => u.organizationId === options.organizationId)
    }
    if (options?.status) {
      users = users.filter((u) => u.status === options.status)
    }
    if (options?.search) {
      const search = options.search.toLowerCase()
      users = users.filter(
        (u) =>
          u.profile.firstName.toLowerCase().includes(search) ||
          u.profile.lastName.toLowerCase().includes(search) ||
          u.profile.email.toLowerCase().includes(search),
      )
    }

    const page = options?.page || 1
    const limit = options?.limit || 20
    const start = (page - 1) * limit
    const paginated = users.slice(start, start + limit)

    return { users: paginated, total: users.length }
  }

  async countByOrganization(organizationId: string, status?: string): Promise<number> {
    let users = Array.from(this.users.values()).filter(
      (u) => u.organizationId === organizationId && !u.deletedAt,
    )
    if (status) {
      users = users.filter((u) => u.status === status)
    }
    return users.length
  }

  async emailExists(email: string): Promise<boolean> {
    return !!(await this.findByEmail(email))
  }

  async updateRoles(id: string, roleIds: string[]): Promise<User> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    user.roleIds = roleIds
    user.updatedAt = new Date()
    this.users.set(id, user)
    return user
  }
}
