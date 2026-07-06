/**
 * User Management Controller
 * 
 * REST endpoints for user management
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
import { JwtAuthGuard } from '../../../identity/src/guards/jwt-auth.guard.js'
import { UserManagementService } from '../services/user-management.service'
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserResponseDto,
  ListUsersQueryDto,
  AssignRolesDto,
} from '../dto/user.dto'

@Controller('users')
export class UserManagementController {
  constructor(private readonly userService: UserManagementService) {}

  /**
   * POST /users - Create new user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(dto) as any
  }

  /**
   * GET /users/:id - Get user by ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id) as any
  }

  /**
   * GET /users - List users in organization
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async listUsers(@Query() query: ListUsersQueryDto, @Request() req: any) {
    const organizationId = req.user?.organizationId || query.organizationId
    return this.userService.listUsers(organizationId)
  }

  /**
   * PATCH /users/:id - Update user profile
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.updateUser(id, dto) as any
  }

  /**
   * PATCH /users/:id/password - Change user password
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(id, dto)
  }

  /**
   * PATCH /users/:id/roles - Assign roles to user
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/roles')
  async assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto): Promise<UserResponseDto> {
    return this.userService.assignRoles(id, dto.roleIds) as any
  }

  /**
   * PATCH /users/:id/deactivate - Deactivate user
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateUser(@Param('id') id: string): Promise<void> {
    return this.userService.deactivateUser(id)
  }

  /**
   * PATCH /users/:id/reactivate - Reactivate user
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reactivate')
  async reactivateUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.reactivateUser(id) as any
  }

  /**
   * PATCH /users/:id/suspend - Suspend user
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async suspendUser(@Param('id') id: string): Promise<void> {
    return this.userService.suspendUser(id)
  }

  /**
   * PATCH /users/:id/verify-email - Verify user email
   */
  @Patch(':id/verify-email')
  async verifyEmail(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.verifyEmail(id) as any
  }

  /**
   * DELETE /users/:id - Delete user
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id)
  }

  /**
   * GET /users/organizations/:orgId/stats - Get organization user statistics
   */
  @UseGuards(JwtAuthGuard)
  @Get('organizations/:orgId/stats')
  async getOrgStats(@Param('orgId') orgId: string) {
    return this.userService.getOrganizationStats(orgId)
  }
}
