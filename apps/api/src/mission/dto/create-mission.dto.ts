export class CreateMissionDto {
  title: string
  description?: string
  objective?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  deadline?: Date
}
