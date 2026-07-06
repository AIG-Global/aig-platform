export class UpdateMissionDto {
  title?: string
  description?: string
  objective?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  deadline?: Date
}
