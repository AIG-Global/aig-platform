/**
 * Organization Management Service
 */

import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common'
import type { Organization } from '@aig/identity'
import { OrganizationRepository } from '../repositories/organization.repository'
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationStatsDto,
} from '../dto/organization.dto'

@Injectable()
export class OrganizationManagementService {
  constructor(private readonly orgRepository: OrganizationRepository) {}

  /**
   * Create a new organization
   */
  async createOrganization(dto: CreateOrganizationDto): Promise<Organization> {
    // Check if slug is available
    const slugAvailable = await this.orgRepository.isSlugAvailable(dto.slug)
    if (!slugAvailable) {
      throw new ConflictException('Organization slug already in use')
    }

    // Create organization
    return this.orgRepository.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      billingEmail: dto.billingEmail,
      ownerId: dto.ownerId,
    })
  }

  /**
   * Get organization by ID
   */
  async getOrganization(id: string): Promise<Organization> {
    const org = await this.orgRepository.findById(id)
    if (!org) {
      throw new NotFoundException('Organization not found')
    }
    return org
  }

  /**
   * Get organization by slug
   */
  async getOrganizationBySlug(slug: string): Promise<Organization> {
    const org = await this.orgRepository.findBySlug(slug)
    if (!org) {
      throw new NotFoundException('Organization not found')
    }
    return org
  }

  /**
   * Update organization
   */
  async updateOrganization(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.getOrganization(id)

    // Check slug availability if changing it
    if (dto.name && dto.name !== org.settings.name) {
      const slugAvailable = await this.orgRepository.isSlugAvailable(
        dto.name?.toLowerCase().replace(/\s+/g, '-') || org.settings.slug,
        id,
      )
      if (!slugAvailable) {
        throw new ConflictException('Organization slug already in use')
      }
    }

    // Update settings
    const updatedOrg: Organization = {
      ...org,
      settings: {
        ...org.settings,
        name: dto.name || org.settings.name,
        description: dto.description !== undefined ? dto.description : org.settings.description,
        logo: dto.logo || org.settings.logo,
        website: dto.website || org.settings.website,
        billingEmail: dto.billingEmail || org.settings.billingEmail,
        plan: dto.plan || org.settings.plan,
        requireMfa: dto.requireMfa !== undefined ? dto.requireMfa : org.settings.requireMfa,
        sessionTimeout: dto.sessionTimeout || org.settings.sessionTimeout,
      },
      updatedAt: new Date(),
    }

    return this.orgRepository.update(id, updatedOrg)
  }

  /**
   * List organizations
   */
  async listOrganizations(options?: {
    page?: number
    limit?: number
    status?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    return this.orgRepository.list(options)
  }

  /**
   * Get organizations by owner
   */
  async getOrganizationsByOwner(ownerId: string): Promise<Organization[]> {
    return this.orgRepository.findByOwner(ownerId)
  }

  /**
   * Suspend organization
   */
  async suspendOrganization(id: string): Promise<Organization> {
    const org = await this.getOrganization(id)
    return this.orgRepository.updateStatus(id, 'suspended')
  }

  /**
   * Activate organization
   */
  async activateOrganization(id: string): Promise<Organization> {
    const org = await this.getOrganization(id)
    return this.orgRepository.updateStatus(id, 'active')
  }

  /**
   * Archive organization
   */
  async archiveOrganization(id: string): Promise<Organization> {
    const org = await this.getOrganization(id)
    return this.orgRepository.updateStatus(id, 'archived')
  }

  /**
   * Delete organization (soft delete)
   */
  async deleteOrganization(id: string): Promise<void> {
    const org = await this.getOrganization(id)
    await this.orgRepository.delete(id)
  }

  /**
   * Get organization statistics
   */
  async getOrganizationStats(id: string): Promise<OrganizationStatsDto> {
    const org = await this.getOrganization(id)

    return {
      totalMembers: org.memberCount,
      activeUsers: Math.floor(org.memberCount * 0.8), // Assume 80% active
      totalConversations: 0, // Would come from Ask Diana service
      lastActivityAt: org.updatedAt,
      apiCallsThisMonth: 0, // Would come from analytics
      storageUsedMB: 0, // Would come from storage service
      plan: org.settings.plan,
      daysUntilTrialExpires: org.settings.plan === 'free' ? 14 : undefined,
    }
  }

  /**
   * Update organization plan
   */
  async updatePlan(
    id: string,
    plan: 'free' | 'pro' | 'enterprise',
  ): Promise<Organization> {
    const org = await this.getOrganization(id)
    const updated = { ...org, settings: { ...org.settings, plan } }
    return this.orgRepository.update(id, updated)
  }

  /**
   * Update organization member count
   */
  async updateMemberCount(id: string, count: number): Promise<Organization> {
    const org = await this.getOrganization(id)
    const updated = { ...org, memberCount: count }
    return this.orgRepository.update(id, updated)
  }
}
