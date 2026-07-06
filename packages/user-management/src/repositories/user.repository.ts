import { Injectable } from '@nestjs/common'
import { UserResponseDto } from '../dto/user.dto'

@Injectable()
export class UserRepository {
  async findById(id: string): Promise<UserResponseDto | null> {
    return null
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return null
  }

  async emailExists(email: string): Promise<boolean> {
    return false
  }

  async create(data: any): Promise<UserResponseDto> {
    return {} as UserResponseDto
  }

  async update(id: string, data: any): Promise<UserResponseDto> {
    return {} as UserResponseDto
  }

  async delete(id: string): Promise<void> {}

  async findAll(organizationId: string): Promise<UserResponseDto[]> {
    return []
  }

  async list(organizationId: string): Promise<UserResponseDto[]> {
    return []
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {}

  async updateStatus(id: string, status: string): Promise<void> {}

  async updateRoles(id: string, roleIds: string[]): Promise<void> {}

  async countByOrganization(organizationId: string): Promise<number> {
    return 0
  }

  async countActive(organizationId: string): Promise<number> {
    return 0
  }

  async countSuspended(organizationId: string): Promise<number> {
    return 0
  }

  async countPending(organizationId: string): Promise<number> {
    return 0
  }

  async verifyEmail(id: string): Promise<void> {}
}

// Alias for compatibility
export const InMemoryUserRepository = UserRepository
