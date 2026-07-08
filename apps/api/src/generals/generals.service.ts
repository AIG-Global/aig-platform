import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'
import { GeneralStatus, AppointmentStatus, ContractStatus } from '@prisma/client'
import * as crypto from 'crypto'

export const POOL_PERCENT = 20.0      // Management pool = 20% of all income
export const MAX_STRING_PERCENT = 20.0 // Max any single string can allocate

@Injectable()
export class GeneralsService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // GENERAL MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Create a root General (admin-appointed, no parent)
   */
  async createRootGeneral(userId: string, allocatedPercent: number): Promise<any> {
    if (allocatedPercent <= 0 || allocatedPercent > MAX_STRING_PERCENT) {
      throw new BadRequestException(`Allocated percent must be between 0 and ${MAX_STRING_PERCENT}`)
    }

    const existing = await this.prisma.general.findUnique({ where: { user_id: userId } })
    if (existing) throw new BadRequestException('User is already a General')

    return this.prisma.general.create({
      data: {
        user_id: userId,
        allocated_percent: allocatedPercent,
        distributed_percent: 0,
        status: GeneralStatus.ACTIVE,
        // string_root_id is null = self is root
      },
      include: { user: { select: { id: true, first_name: true, last_name: true, email: true } } },
    })
  }

  /**
   * Get all generals with stats
   */
  async getAllGenerals(): Promise<any[]> {
    const generals = await this.prisma.general.findMany({
      include: {
        user: { select: { id: true, first_name: true, last_name: true, email: true, geo_city: true, geo_country: true } },
        appointed_by: { include: { user: { select: { id: true, first_name: true, last_name: true } } } },
        _count: { select: { appointees: true } },
      },
      orderBy: { allocated_percent: 'desc' },
    })

    return generals.map(g => ({
      ...g,
      effective_percent: g.allocated_percent - g.distributed_percent,
    }))
  }

  /**
   * Get a single general with full details
   */
  async getGeneral(generalId: string): Promise<any> {
    const g = await this.prisma.general.findUnique({
      where: { id: generalId },
      include: {
        user: true,
        appointed_by: { include: { user: { select: { id: true, first_name: true, last_name: true, email: true } } } },
        appointees: {
          include: { user: { select: { id: true, first_name: true, last_name: true, email: true, geo_lat: true, geo_lng: true, geo_city: true, geo_country: true } } },
        },
        appointments_given: {
          include: {
            receiver_user: { select: { id: true, first_name: true, last_name: true, email: true } },
            contract: true,
          },
        },
        pool_earnings: {
          orderBy: { created_at: 'desc' },
          take: 20,
        },
      },
    })

    if (!g) throw new NotFoundException('General not found')

    const totalEarned = g.pool_earnings
      .filter(e => e.status === 'PAID')
      .reduce((sum, e) => sum + Number(e.amount_eur), 0)

    const pendingEarnings = g.pool_earnings
      .filter(e => e.status === 'PENDING')
      .reduce((sum, e) => sum + Number(e.amount_eur), 0)

    return {
      ...g,
      effective_percent: g.allocated_percent - g.distributed_percent,
      total_earned_eur: totalEarned,
      pending_earnings_eur: pendingEarnings,
    }
  }

  /**
   * Get organization tree (downline) for a general with geo data
   */
  async getOrganizationTree(generalId: string): Promise<any> {
    const general = await this.prisma.general.findUnique({
      where: { id: generalId },
      include: { user: true },
    })
    if (!general) throw new NotFoundException('General not found')

    // BFS to get all members in this general's string
    const tree = await this.buildOrgTree(general.user_id)
    const geoPoints = await this.getGeoPoints(general.user_id)

    return { tree, geoPoints }
  }

  private async buildOrgTree(userId: string, depth = 0, maxDepth = 10): Promise<any> {
    if (depth >= maxDepth) return null

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, first_name: true, last_name: true, email: true,
        geo_lat: true, geo_lng: true, geo_city: true, geo_country: true,
        memberships: { where: { status: 'ACTIVE' }, select: { tier: true }, take: 1 },
        general: { select: { id: true, allocated_percent: true, effective_percent: false, distributed_percent: true, status: true } },
        referrals_made: { where: { status: 'ACTIVE' }, select: { referred_id: true } },
      },
    })

    if (!user) return null

    const children = await Promise.all(
      user.referrals_made.map(r => this.buildOrgTree(r.referred_id, depth + 1, maxDepth))
    )

    return {
      id: user.id,
      name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
      email: user.email,
      tier: user.memberships[0]?.tier ?? 'FREE',
      geo: user.geo_lat ? { lat: user.geo_lat, lng: user.geo_lng, city: user.geo_city, country: user.geo_country } : null,
      isGeneral: !!user.general,
      generalData: user.general ? { ...user.general, effective_percent: user.general.allocated_percent - user.general.distributed_percent } : null,
      depth,
      children: children.filter(Boolean),
    }
  }

  private async getGeoPoints(rootUserId: string): Promise<any[]> {
    // Get all users in network who have geo data
    const visited = new Set<string>()
    const points: any[] = []

    const collect = async (userId: string, level: number) => {
      if (visited.has(userId) || level > 10) return
      visited.add(userId)

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, first_name: true, last_name: true,
          geo_lat: true, geo_lng: true, geo_city: true, geo_country: true,
          general: { select: { id: true } },
          referrals_made: { where: { status: 'ACTIVE' }, select: { referred_id: true } },
        },
      })

      if (!user) return

      if (user.geo_lat && user.geo_lng) {
        points.push({
          userId: user.id,
          name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          lat: user.geo_lat,
          lng: user.geo_lng,
          city: user.geo_city,
          country: user.geo_country,
          isGeneral: !!user.general,
          level,
        })
      }

      for (const ref of user.referrals_made) {
        await collect(ref.referred_id, level + 1)
      }
    }

    await collect(rootUserId, 0)
    return points
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STRING CAPACITY CHECK
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Calculate total allocated % in a string (chain of generals)
   * Starting from the root of the string up through all appointees.
   * The sum must never exceed MAX_STRING_PERCENT (20%).
   */
  async getStringTotalAllocation(generalId: string): Promise<number> {
    const general = await this.prisma.general.findUnique({ where: { id: generalId } })
    if (!general) throw new NotFoundException('General not found')

    // Find the string root
    const rootId = general.string_root_id ?? general.id

    // Sum all allocated_percent for generals in this string
    const stringMembers = await this.prisma.general.findMany({
      where: {
        OR: [
          { id: rootId },
          { string_root_id: rootId },
        ],
      },
      select: { allocated_percent: true },
    })

    return stringMembers.reduce((sum, m) => sum + m.allocated_percent, 0)
  }

  /**
   * Check if adding a new allocation to a string would exceed capacity
   */
  async canAllocateInString(generalId: string, additionalPercent: number): Promise<{ allowed: boolean; current: number; remaining: number }> {
    const current = await this.getStringTotalAllocation(generalId)
    const remaining = MAX_STRING_PERCENT - current
    return {
      allowed: additionalPercent <= remaining,
      current,
      remaining,
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SHARING IS CARING - APPOINTMENTS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initiate a "Sharing is Caring" appointment.
   * The giver general shares a % of their effective allocation with a user.
   * Both parties must sign a contract before the appointment activates.
   */
  async initiateAppointment(giverGeneralId: string, receiverUserId: string, percentToGive: number): Promise<any> {
    const giver = await this.prisma.general.findUnique({ where: { id: giverGeneralId } })
    if (!giver) throw new NotFoundException('Giver General not found')
    if (giver.status !== GeneralStatus.ACTIVE) throw new ForbiddenException('General is not active')

    const effectivePercent = giver.allocated_percent - giver.distributed_percent
    if (percentToGive <= 0 || percentToGive > effectivePercent) {
      throw new BadRequestException(
        `Cannot give ${percentToGive}%. Effective available: ${effectivePercent}%`
      )
    }

    // Check string capacity
    const capacity = await this.canAllocateInString(giverGeneralId, percentToGive)
    if (!capacity.allowed) {
      throw new BadRequestException(
        `String capacity exceeded. Current: ${capacity.current}%, Remaining: ${capacity.remaining}%, Requested: ${percentToGive}%`
      )
    }

    // Check receiver is not already a general
    const existingGeneral = await this.prisma.general.findUnique({ where: { user_id: receiverUserId } })
    if (existingGeneral) throw new BadRequestException('Receiver is already a General')

    // Create appointment + contract in transaction
    const appointment = await this.prisma.$transaction(async (tx) => {
      const appt = await tx.generalAppointment.create({
        data: {
          giver_general_id: giverGeneralId,
          giver_user_id: giver.user_id,
          receiver_user_id: receiverUserId,
          percent_given: percentToGive,
          status: AppointmentStatus.PENDING_CONTRACT,
        },
      })

      const termsSnapshot = JSON.stringify({
        appointment_id: appt.id,
        giver_general_id: giverGeneralId,
        receiver_user_id: receiverUserId,
        percent_given: percentToGive,
        pool_total_percent: POOL_PERCENT,
        created_at: new Date().toISOString(),
        policy: 'Sharing is Caring Policy — percent cannot be reclaimed without admin approval.',
      })

      const contract = await tx.generalContract.create({
        data: {
          appointment_id: appt.id,
          percent_given: percentToGive,
          terms_snapshot: termsSnapshot,
          status: ContractStatus.PENDING_GIVER_SIGNATURE,
        },
      })

      // Reserve the percent from giver
      await tx.general.update({
        where: { id: giverGeneralId },
        data: { distributed_percent: { increment: percentToGive } },
      })

      return { ...appt, contract }
    })

    return appointment
  }

  /**
   * Sign the contract (giver or receiver)
   */
  async signContract(contractId: string, signerUserId: string, documentUrl?: string): Promise<any> {
    const contract = await this.prisma.generalContract.findUnique({
      where: { id: contractId },
      include: { appointment: { include: { giver_general: true } } },
    })
    if (!contract) throw new NotFoundException('Contract not found')

    const appt = contract.appointment
    const isGiver = appt.giver_user_id === signerUserId
    const isReceiver = appt.receiver_user_id === signerUserId

    if (!isGiver && !isReceiver) throw new ForbiddenException('You are not a party to this contract')

    return this.prisma.$transaction(async (tx) => {
      const now = new Date()
      let updatedContract = contract

      if (isGiver && !contract.giver_signed_at) {
        updatedContract = await tx.generalContract.update({
          where: { id: contractId },
          data: {
            giver_signed_at: now,
            document_url: documentUrl,
            status: ContractStatus.PENDING_RECEIVER_SIGNATURE,
          },
        })
        await tx.generalAppointment.update({
          where: { id: appt.id },
          data: { status: AppointmentStatus.PENDING_CONTRACT },
        })
      }

      if (isReceiver && !contract.receiver_signed_at) {
        const giverSigned = contract.giver_signed_at || (isGiver ? now : null)
        const fullySignedNow = !!giverSigned

        // Generate document hash from terms
        const docHash = crypto.createHash('sha256').update(contract.terms_snapshot).digest('hex')

        updatedContract = await tx.generalContract.update({
          where: { id: contractId },
          data: {
            receiver_signed_at: now,
            document_hash: docHash,
            status: fullySignedNow ? ContractStatus.FULLY_SIGNED : ContractStatus.PENDING_GIVER_SIGNATURE,
          },
        })

        if (fullySignedNow) {
          // Create the General record for receiver
          const stringRootId = appt.giver_general.string_root_id ?? appt.giver_general.id

          const newGeneral = await tx.general.create({
            data: {
              user_id: appt.receiver_user_id,
              appointed_by_id: appt.giver_general_id,
              allocated_percent: appt.percent_given,
              distributed_percent: 0,
              string_root_id: stringRootId,
              status: GeneralStatus.ACTIVE,
            },
          })

          await tx.generalAppointment.update({
            where: { id: appt.id },
            data: {
              status: AppointmentStatus.ACTIVE,
              receiver_general_id: newGeneral.id,
            },
          })
        }
      }

      return updatedContract
    })
  }

  /**
   * Request revocation of an appointment (giver requests, admin approves)
   */
  async requestRevocation(appointmentId: string, requesterUserId: string, notes?: string): Promise<any> {
    const appt = await this.prisma.generalAppointment.findUnique({ where: { id: appointmentId } })
    if (!appt) throw new NotFoundException('Appointment not found')
    if (appt.giver_user_id !== requesterUserId) throw new ForbiddenException('Only the giver can request revocation')
    if (appt.status !== AppointmentStatus.ACTIVE) throw new BadRequestException('Appointment is not active')

    return this.prisma.generalAppointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.REVOKE_REQUESTED,
        revoke_requested_at: new Date(),
        revoke_notes: notes,
      },
    })
  }

  /**
   * Admin approves revocation
   */
  async approveRevocation(appointmentId: string, adminUserId: string): Promise<any> {
    const appt = await this.prisma.generalAppointment.findUnique({
      where: { id: appointmentId },
      include: { receiver_general: true },
    })
    if (!appt) throw new NotFoundException('Appointment not found')
    if (appt.status !== AppointmentStatus.REVOKE_REQUESTED) throw new BadRequestException('No revocation pending')

    return this.prisma.$transaction(async (tx) => {
      // Remove the receiver's General status
      if (appt.receiver_general_id) {
        // Return their distributed percent back to giver
        const receiverGeneral = appt.receiver_general!
        await tx.general.update({
          where: { id: appt.giver_general_id },
          data: { distributed_percent: { decrement: appt.percent_given } },
        })

        // Cascade: also return any sub-allocations (mark sub-generals as revoked)
        await tx.general.updateMany({
          where: { string_root_id: receiverGeneral.string_root_id ?? receiverGeneral.id },
          data: { status: GeneralStatus.REVOKED },
        })

        await tx.general.update({
          where: { id: appt.receiver_general_id },
          data: { status: GeneralStatus.REVOKED },
        })
      }

      await tx.generalContract.update({
        where: { appointment_id: appointmentId },
        data: { status: ContractStatus.VOIDED, admin_reviewer_id: adminUserId, admin_reviewed_at: new Date() },
      })

      return tx.generalAppointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.REVOKED,
          revoke_approved_at: new Date(),
        },
      })
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN STATS
  // ─────────────────────────────────────────────────────────────────────────

  async getAdminDashboardStats(): Promise<any> {
    const [
      totalUsers,
      activeMembers,
      totalGenerals,
      totalPoolTransactions,
      pendingContracts,
      recentAppointments,
      membersByTier,
    ] = await Promise.all([
      this.prisma.user.count({ where: { status: 'ACTIVE', deleted_at: null } }),
      this.prisma.membership.count({ where: { status: 'ACTIVE' } }),
      this.prisma.general.count({ where: { status: 'ACTIVE' } }),
      this.prisma.poolTransaction.aggregate({ _sum: { pool_amount_eur: true, total_amount_eur: true }, _count: true }),
      this.prisma.generalContract.count({ where: { status: { in: ['PENDING_GIVER_SIGNATURE', 'PENDING_RECEIVER_SIGNATURE'] } } }),
      this.prisma.generalAppointment.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
          giver_user: { select: { first_name: true, last_name: true } },
          receiver_user: { select: { first_name: true, last_name: true } },
        },
      }),
      this.prisma.membership.groupBy({
        by: ['tier'],
        _count: { id: true },
        where: { status: 'ACTIVE' },
      }),
    ])

    return {
      users: { total: totalUsers, active_members: activeMembers },
      generals: { total: totalGenerals },
      pool: {
        total_income_eur: Number(totalPoolTransactions._sum.total_amount_eur ?? 0),
        total_pool_eur: Number(totalPoolTransactions._sum.pool_amount_eur ?? 0),
        transaction_count: totalPoolTransactions._count,
      },
      pending_contracts: pendingContracts,
      recent_appointments: recentAppointments,
      members_by_tier: membersByTier.reduce((acc, t) => ({ ...acc, [t.tier]: t._count.id }), {}),
    }
  }
}
