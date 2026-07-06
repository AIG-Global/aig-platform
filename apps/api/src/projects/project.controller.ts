import { Controller, Post, Get, Body, Param } from '@nestjs/common'
import { ProjectService } from './project.service.js'
import type { CreateProjectDto, ProjectResponseDto } from './project.service.js'

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectResponseDto> {
    return this.projectService.createProject(dto)
  }

  @Get('user/:userId')
  async getUserProjects(@Param('userId') userId: string): Promise<ProjectResponseDto[]> {
    return this.projectService.getUserProjects(userId)
  }

  @Get(':id')
  async getProject(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectService.getProject(id)
  }
}
