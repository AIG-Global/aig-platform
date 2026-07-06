import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common'
import { TaskService } from './task.service.js'
import type { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from './task.service.js'

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.taskService.createTask(dto)
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId') projectId: string): Promise<TaskResponseDto[]> {
    return this.taskService.getProjectTasks(projectId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<TaskResponseDto> {
    return this.taskService.updateTask(id, dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id)
  }
}
