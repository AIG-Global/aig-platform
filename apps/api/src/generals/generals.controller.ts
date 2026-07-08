import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common'
import { GeneralsService } from './generals.service.js'
import { PoolService } from './pool.service.js'

@Controller('generals')
export class GeneralsController {
  constructor(
    private readonly generalsService: GeneralsService,
    private readonly poolService: PoolService,
  ) {}

  // Admin dashboard stats
  @Get('admin/stats')
  getAdminStats() {
    return this.generalsService.getAdminDashboardStats()
  }

  // List all generals
  @Get()
  getAllGenerals() {
    return this.generalsService.getAllGenerals()
  }

  // Create root general (admin action)
  @Post()
  createRootGeneral(@Body() body: { user_id: string; allocated_percent: number }) {
    return this.generalsService.createRootGeneral(body.user_id, body.allocated_percent)
  }

  // Get single general
  @Get(':id')
  getGeneral(@Param('id') id: string) {
    return this.generalsService.getGeneral(id)
  }

  // Get general's org tree + geo points
  @Get(':id/organization')
  getOrganization(@Param('id') id: string) {
    return this.generalsService.getOrganizationTree(id)
  }

  // Check string capacity
  @Get(':id/string-capacity')
  getStringCapacity(@Param('id') id: string) {
    return this.generalsService.canAllocateInString(id, 0)
  }

  // Initiate appointment (Sharing is Caring)
  @Post(':id/appoint')
  initiateAppointment(
    @Param('id') generalId: string,
    @Body() body: { receiver_user_id: string; percent_to_give: number },
  ) {
    return this.generalsService.initiateAppointment(generalId, body.receiver_user_id, body.percent_to_give)
  }

  // Sign contract
  @Patch('contracts/:contractId/sign')
  signContract(
    @Param('contractId') contractId: string,
    @Body() body: { signer_user_id: string; document_url?: string },
  ) {
    return this.generalsService.signContract(contractId, body.signer_user_id, body.document_url)
  }

  // Request revocation
  @Post('appointments/:appointmentId/revoke-request')
  requestRevocation(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { requester_user_id: string; notes?: string },
  ) {
    return this.generalsService.requestRevocation(appointmentId, body.requester_user_id, body.notes)
  }

  // Admin approve revocation
  @Post('appointments/:appointmentId/revoke-approve')
  approveRevocation(
    @Param('appointmentId') appointmentId: string,
    @Body() body: { admin_user_id: string },
  ) {
    return this.generalsService.approveRevocation(appointmentId, body.admin_user_id)
  }

  // Pool endpoints
  @Get('pool/summary')
  getPoolSummary(@Query('year') year?: string, @Query('month') month?: string) {
    return this.poolService.getPoolSummary(year ? Number(year) : undefined, month ? Number(month) : undefined)
  }

  @Post('pool/record-income')
  recordIncome(@Body() body: { source_type: string; source_id: string; total_amount_eur_cents: string; description?: string }) {
    return this.poolService.recordIncome(body.source_type as any, body.source_id, BigInt(body.total_amount_eur_cents), body.description)
  }

  @Post('pool/:transactionId/distribute')
  distributePool(@Param('transactionId') transactionId: string) {
    return this.poolService.distributePoolTransaction(transactionId)
  }

  @Get('pool/general/:generalId/earnings')
  getGeneralEarnings(@Param('generalId') generalId: string) {
    return this.poolService.getGeneralEarnings(generalId)
  }

  @Post('pool/general/:generalId/pay')
  markPaid(@Param('generalId') generalId: string) {
    return this.poolService.markEarningsPaid(generalId)
  }
}
