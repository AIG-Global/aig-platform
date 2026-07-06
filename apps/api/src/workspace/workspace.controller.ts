import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { WorkspaceService } from './workspace.service.js'
import { WorkspaceOrchestrator } from './workspace.orchestrator.js'
import type { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto.js'

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly orchestrator: WorkspaceOrchestrator,
  ) {}

  /**
   * POST /api/workspaces
   * Create a blank workspace manually
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Headers('x-user-id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.create(userId, dto)
  }

  /**
   * POST /api/workspaces/from-goal
   * Create a full workspace from a natural-language goal (the core flow)
   */
  @Post('from-goal')
  @HttpCode(HttpStatus.CREATED)
  async createFromGoal(@Headers('x-user-id') userId: string, @Body() body: { goal: string }) {
    return this.orchestrator.createFromGoal(userId, body.goal)
  }

  /**
   * GET /api/workspaces
   * List all workspaces for the current user
   */
  @Get()
  async findAll(@Headers('x-user-id') userId: string) {
    return this.workspaceService.findAllForUser(userId)
  }

  /**
   * GET /api/workspaces/:id
   * Get a workspace with all its children (projects, documents, conversations)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.workspaceService.findOne(id)
    } catch {
      throw new NotFoundException(`Workspace ${id} not found`)
    }
  }

  /**
   * PATCH /api/workspaces/:id
   * Update workspace metadata
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspaceService.update(id, dto)
  }

  /**
   * DELETE /api/workspaces/:id
   * Archive workspace (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async archive(@Param('id') id: string) {
    return this.workspaceService.archive(id)
  }
}
