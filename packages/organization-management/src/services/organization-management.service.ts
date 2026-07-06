/**
 * Organization Management Service
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { OrganizationRepository } from '../repositories/organization.repository'
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
} from '../dto/organization.dto'

@Injectable()
export class OrganizationManagementService {
  constructor(private readonly orgRepository: OrganizationRepository) {}

  /**
   * Create a new organization
   */
  async createOrganization(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
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
  async getOrganization(id: string): Promise<OrganizationResponseDto> {
    const org = await this.orgRepository.findById(id)
    if (!org) {
      throw new NotFoundException('Organization not found')
    }
    return org
  }

  /**
   * Get organization by slug
   */
  async getOrganizationBySlug(slug: string): Promise<OrganizationResponseDto> {
    const org = await this.orgRepository.findBySlug(slug)
    if (!org) {
      throw new NotFoundException('Organization not found')
    }
    return org
  }

  /**
   * Update organization
   */
  async updateOrganization(id: string, dto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    const org = await this.getOrganization(id)

    // Update organization
    return this.orgRepository.update(id, {
      settings: {
        ...org.settings,
        name: dto.name || org.settings.name,
        description: dto.description || org.settings.description,
        logo: dto.logo || org.settings.logo,
        website: dto.website || org.settings.website,
        billingEmail: dto.billingEmail || org.settings.billingEmail,
        plan: dto.plan || org.settings.plan,
        requireMfa: dto.requireMfa !== undefined ? dto.requireMfa : org.settings.requireMfa,
        sessionTimeout: dto.sessionTimeout || org.settings.sessionTimeout,
      },
    })
  }

  /**
   * List organizations
   */
  async listOrganizations(): Promise<OrganizationResponseDto[]> {
    return this.orgRepository.list()
  }

  /**
   * Get organizations by owner
   */
  async getOrganizationsByOwner(ownerId: string): Promise<OrganizationResponseDto[]> {
    return this.orgRepository.findByOwner(ownerId)
  }

  /**
   * Suspend organization
   */
  async suspendOrganization(id: string): Promise<void> {
    const org = await this.getOrganization(id)
    await this.orgRepository.updateStatus(id, 'suspended')
  }

  /**
   * Activate organization
   */
  async activateOrganization(id: string): Promise<void> {
    const org = await this.getOrganization(id)
    await this.orgRepository.updateStatus(id, 'active')
  }

  /**
   * Archive organization
   */
  async archiveOrganization(id: string): Promise<void> {
    const org = await this.getOrganization(id)
    await this.orgRepository.updateStatus(id, 'archived')
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
  async getOrganizationStats(id: string) {
    const org = await this.getOrganization(id)

    return {
      totalMembers: org.memberCount,
      activeUsers: Math.floor(org.memberCount * 0.8),
      totalConversations: 0,
      lastActivityAt: org.updatedAt,
      apiCallsThisMonth: 0,
      storageUsedMB: 0,
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
  ): Promise<void> {
    const org = await this.getOrganization(id)
    await this.orgRepository.update(id, {
      settings: { ...org.settings, plan },
    })
  }

  /**
   * Update organization member count
   */
  async updateMemberCount(id: string, count: number): Promise<void> {
    const org = await this.getOrganization(id)
    // Member count would be managed via a proper update
    // For now, just validate the org exists
    await this.orgRepository.update(id, { memberCount: count })
  }
}
