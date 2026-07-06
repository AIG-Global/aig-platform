import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common'
import { MissionService } from './mission.service.js'
import { CreateMissionDto, UpdateMissionDto } from './dto/index.js'

@Controller('missions')
export class MissionController {
  private readonly logger = new Logger('MissionController')

  constructor(private missionService: MissionService) {}

  // Extract user and org from headers
  private extractUser(headers: any) {
    const userId = headers['x-user-id']
    const organizationId = headers['x-org-id']
    if (!userId || !organizationId) {
      throw new Error('Missing x-user-id or x-org-id header')
    }
    return { userId, organizationId }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateMissionDto, @Headers() headers: any) {
    try {
      const { userId, organizationId } = this.extractUser(headers)
      const result = await this.missionService.create(organizationId, userId, dto)
      this.logger.log(`✅ Mission created by ${userId}`)
      return {
        statusCode: 201,
        data: result,
      }
    } catch (error) {
      this.logger.error(`Failed to create mission: ${error.message}`)
      return {
        statusCode: 400,
        error: error.message,
      }
    }
  }

  @Get()
  async findAll(@Headers() headers: any) {
    try {
      const { organizationId } = this.extractUser(headers)
      const missions = await this.missionService.findAll(organizationId)
      return {
        statusCode: 200,
        data: missions,
      }
    } catch (error) {
      this.logger.error(`Failed to list missions: ${error.message}`)
      return {
        statusCode: 400,
        error: error.message,
      }
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const mission = await this.missionService.findOne(id)
      if (!mission) {
        return {
          statusCode: 404,
          error: 'Mission not found',
        }
      }
      return {
        statusCode: 200,
        data: mission,
      }
    } catch (error) {
      this.logger.error(`Failed to get mission ${id}: ${error.message}`)
      return {
        statusCode: 400,
        error: error.message,
      }
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMissionDto) {
    try {
      const mission = await this.missionService.update(id, dto)
      this.logger.log(`✅ Mission ${id} updated`)
      return {
        statusCode: 200,
        data: mission,
      }
    } catch (error) {
      this.logger.error(`Failed to update mission ${id}: ${error.message}`)
      return {
        statusCode: 400,
        error: error.message,
      }
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    try {
      const mission = await this.missionService.updateStatus(id, body.status)
      return {
        statusCode: 200,
        data: mission,
      }
    } catch (error) {
      this.logger.error(`Failed to update mission status: ${error.message}`)
      return {
        statusCode: 400,
        error: error.message,
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    try {
      await this.missionService.delete(id)
      this.logger.log(`✅ Mission ${id} deleted`)
    } catch (error) {
      this.logger.error(`Failed to delete mission ${id}: ${error.message}`)
      throw error
    }
  }
}
