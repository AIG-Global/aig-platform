/**
 * Organization Management Controller
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '@aig/identity'
import { OrganizationManagementService } from '../services/organization-management.service'
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  ListOrganizationsQueryDto,
} from '../dto/organization.dto'

@Controller('organizations')
export class OrganizationManagementController {
  constructor(private readonly orgService: OrganizationManagementService) {}

  /**
   * POST /organizations - Create new organization
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(@Body() dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    return this.orgService.createOrganization(dto) as any
  }

  /**
   * GET /organizations/:id - Get organization by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrganization(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.orgService.getOrganization(id) as any
  }

  /**
   * GET /organizations - List organizations
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async listOrganizations(@Query() query: ListOrganizationsQueryDto) {
    return this.orgService.listOrganizations({
      page: query.page,
      limit: query.limit,
      status: query.status,
      search: query.search,
    })
  }

  /**
   * PATCH /organizations/:id - Update organization
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOrganization(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ): Promise<OrganizationResponseDto> {
    return this.orgService.updateOrganization(id, dto) as any
  }

  /**
   * PATCH /organizations/:id/suspend - Suspend organization
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/suspend')
  async suspendOrganization(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.orgService.suspendOrganization(id) as any
  }

  /**
   * PATCH /organizations/:id/activate - Activate organization
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  async activateOrganization(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.orgService.activateOrganization(id) as any
  }

  /**
   * PATCH /organizations/:id/archive - Archive organization
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/archive')
  async archiveOrganization(@Param('id') id: string): Promise<OrganizationResponseDto> {
    return this.orgService.archiveOrganization(id) as any
  }

  /**
   * DELETE /organizations/:id - Delete organization
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrganization(@Param('id') id: string): Promise<void> {
    return this.orgService.deleteOrganization(id)
  }

  /**
   * GET /organizations/:id/stats - Get organization statistics
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  async getOrganizationStats(@Param('id') id: string) {
    return this.orgService.getOrganizationStats(id)
  }

  /**
   * GET /organizations/slug/:slug - Get organization by slug
   */
  @UseGuards(JwtAuthGuard)
  @Get('slug/:slug')
  async getOrganizationBySlug(@Param('slug') slug: string): Promise<OrganizationResponseDto> {
    return this.orgService.getOrganizationBySlug(slug) as any
  }
}
