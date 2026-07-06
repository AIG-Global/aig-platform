import { Organization } from '@aig/identity'

/**
 * Organization Repository Interface
 */
export interface IOrganizationRepository {
  /**
   * Create a new organization
   */
  create(data: {
    name: string
    slug: string
    description?: string
    billingEmail: string
    ownerId: string
  }): Promise<Organization>

  /**
   * Find organization by ID
   */
  findById(id: string): Promise<Organization | null>

  /**
   * Find organization by slug
   */
  findBySlug(slug: string): Promise<Organization | null>

  /**
   * List organizations
   */
  list(options?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<{ organizations: Organization[]; total: number }>

  /**
   * Update organization
   */
  update(id: string, data: Partial<Organization>): Promise<Organization>

  /**
   * Delete organization (soft delete)
   */
  delete(id: string): Promise<void>

  /**
   * Check if slug is available
   */
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>

  /**
   * Get organizations by owner
   */
  findByOwner(ownerId: string): Promise<Organization[]>

  /**
   * Update organization status
   */
  updateStatus(id: string, status: Organization['status']): Promise<Organization>
}

/**
 * In-memory Organization Repository
 */
export class InMemoryOrganizationRepository implements IOrganizationRepository {
  private organizations = new Map<string, Organization>()

  async create(data: {
    name: string
    slug: string
    description?: string
    billingEmail: string
    ownerId: string
  }): Promise<Organization> {
    const org: Organization = {
      id: Math.random().toString(36).substring(7),
      settings: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        billingEmail: data.billingEmail,
        plan: 'free',
        requireMfa: false,
        ssoEnabled: false,
        sessionTimeout: 60,
      },
      ownerId: data.ownerId,
      memberCount: 1,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.organizations.set(org.id, org)
    return org
  }

  async findById(id: string): Promise<Organization | null> {
    return this.organizations.get(id) || null
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    for (const org of this.organizations.values()) {
      if (org.settings.slug === slug && !org.deletedAt) {
        return org
      }
    }
    return null
  }

  async list(options?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<{ organizations: Organization[]; total: number }> {
    let orgs = Array.from(this.organizations.values()).filter((o) => !o.deletedAt)

    if (options?.status) {
      orgs = orgs.filter((o) => o.status === options.status)
    }

    if (options?.search) {
      const search = options.search.toLowerCase()
      orgs = orgs.filter((o) => o.settings.name.toLowerCase().includes(search))
    }

    const page = options?.page || 1
    const limit = options?.limit || 20
    const start = (page - 1) * limit
    const paginated = orgs.slice(start, start + limit)

    return { organizations: paginated, total: orgs.length }
  }

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    const org = this.organizations.get(id)
    if (!org) throw new Error('Organization not found')

    const updated = { ...org, ...data, updatedAt: new Date() }
    this.organizations.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    const org = this.organizations.get(id)
    if (org) {
      org.deletedAt = new Date()
      this.organizations.set(id, org)
    }
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    for (const org of this.organizations.values()) {
      if (org.settings.slug === slug && org.id !== excludeId && !org.deletedAt) {
        return false
      }
    }
    return true
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    return Array.from(this.organizations.values()).filter(
      (o) => o.ownerId === ownerId && !o.deletedAt,
    )
  }

  async updateStatus(id: string, status: Organization['status']): Promise<Organization> {
    const org = this.organizations.get(id)
    if (!org) throw new Error('Organization not found')

    org.status = status
    org.updatedAt = new Date()
    this.organizations.set(id, org)
    return org
  }
}
