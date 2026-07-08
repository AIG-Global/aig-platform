import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PaymentService {
  private stripe: Stripe

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    })
  }

  /**
   * Create a checkout session for membership upgrade
   */
  async createCheckoutSession(userId: string, packId: string, packPrice: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `AIGINVEST ${this.getPackName(packId)} Pack`,
              description: `Monthly subscription for ${this.getPackName(packId)} membership`,
            },
            unit_amount: Math.round(packPrice * 100), // Convert to cents
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        userId,
        packId,
        userEmail: user.email,
      },
    })

    // Store session in database for tracking
    await this.prisma.paymentSession.create({
      data: {
        stripeSessionId: session.id,
        userId,
        packId,
        amount: packPrice,
        status: 'pending',
        type: 'checkout',
      },
    })

    return {
      sessionId: session.id,
      url: session.url,
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhookEvent(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        return this.handleCheckoutSessionCompleted(event.data.object)
      case 'invoice.payment_succeeded':
        return this.handleInvoicePaymentSucceeded(event.data.object)
      case 'invoice.payment_failed':
        return this.handleInvoicePaymentFailed(event.data.object)
      case 'customer.subscription.deleted':
        return this.handleSubscriptionCancelled(event.data.object)
      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }
  }

  /**
   * Handle successful checkout session
   */
  private async handleCheckoutSessionCompleted(session: any) {
    const paymentSession = await this.prisma.paymentSession.findUnique({
      where: { stripeSessionId: session.id },
    })

    if (!paymentSession) {
      console.error(`Payment session not found for Stripe session: ${session.id}`)
      return
    }

    // Update user's membership
    const subscription = await this.stripe.subscriptions.retrieve(session.subscription)

    await this.prisma.user.update({
      where: { id: paymentSession.userId },
      data: {
        membershipPackage: paymentSession.packId,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        membershipStatus: 'active',
        membershipStartDate: new Date(),
      },
    })

    // Update payment session status
    await this.prisma.paymentSession.update({
      where: { id: paymentSession.id },
      data: {
        status: 'completed',
        stripeSubscriptionId: session.subscription,
        completedAt: new Date(),
      },
    })

    console.log(`Payment successful for user ${paymentSession.userId}`)
  }

  /**
   * Handle successful invoice payment (recurring)
   */
  private async handleInvoicePaymentSucceeded(invoice: any) {
    const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription)
    
    // Find user by Stripe customer ID
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer },
    })

    if (!user) {
      console.error(`User not found for Stripe customer: ${invoice.customer}`)
      return
    }

    // Log payment
    await this.prisma.paymentRecord.create({
      data: {
        userId: user.id,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency.toUpperCase(),
        status: 'succeeded',
        stripeInvoiceId: invoice.id,
        description: invoice.description || 'Monthly membership payment',
      },
    })

    console.log(`Invoice payment succeeded for user ${user.id}: €${invoice.amount_paid / 100}`)
  }

  /**
   * Handle failed invoice payment
   */
  private async handleInvoicePaymentFailed(invoice: any) {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: invoice.customer },
    })

    if (!user) {
      console.error(`User not found for Stripe customer: ${invoice.customer}`)
      return
    }

    // Log failed payment
    await this.prisma.paymentRecord.create({
      data: {
        userId: user.id,
        amount: invoice.amount_due / 100,
        currency: invoice.currency.toUpperCase(),
        status: 'failed',
        stripeInvoiceId: invoice.id,
        description: invoice.description || 'Failed payment attempt',
      },
    })

    // Send notification to user
    console.log(`Payment failed for user ${user.id}. Amount: €${invoice.amount_due / 100}`)
  }

  /**
   * Handle subscription cancellation
   */
  private async handleSubscriptionCancelled(subscription: any) {
    const user = await this.prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })

    if (!user) {
      console.error(`User not found for Stripe subscription: ${subscription.id}`)
      return
    }

    // Update user membership status
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        membershipStatus: 'cancelled',
        membershipEndDate: new Date(subscription.ended_at * 1000),
      },
    })

    console.log(`Subscription cancelled for user ${user.id}`)
  }

  /**
   * Create a payment intent for one-time payment
   */
  async createPaymentIntent(userId: string, amount: number, description: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'eur',
      description,
      metadata: {
        userId,
        userEmail: user.email,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): any {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      )
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`)
    }
  }

  /**
   * Get pack name for display
   */
  private getPackName(packId: string): string {
    const packs: Record<string, string> = {
      remittance: 'Remittance',
      starter: 'Starter',
      startup: 'Start-Up',
      professional: 'Professional',
    }
    return packs[packId] || 'Unknown'
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(userId: string, limit: number = 20) {
    return this.prisma.paymentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        membershipPackage: true,
        membershipStatus: true,
        membershipStartDate: true,
        membershipEndDate: true,
        stripeSubscriptionId: true,
      },
    })

    if (!user || !user.stripeSubscriptionId) {
      return null
    }

    const subscription = await this.stripe.subscriptions.retrieve(user.stripeSubscriptionId)

    return {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      package: user.membershipPackage,
    }
  }
}
