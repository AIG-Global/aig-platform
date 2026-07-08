import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  BadRequestException,
  Injectable,
  UseGuards,
  Req,
} from '@nestjs/common'
import { PaymentService } from './payment.service'

@Controller('api/payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * POST /api/payment/checkout-session
   * Create a Stripe checkout session for membership upgrade
   */
  @Post('checkout-session')
  async createCheckoutSession(
    @Body() body: { userId: string; packId: string; packPrice: number },
  ) {
    if (!body.userId || !body.packId || !body.packPrice) {
      throw new BadRequestException('Missing required fields: userId, packId, packPrice')
    }

    try {
      const result = await this.paymentService.createCheckoutSession(
        body.userId,
        body.packId,
        body.packPrice,
      )
      return {
        success: true,
        sessionId: result.sessionId,
        url: result.url,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * POST /api/payment/webhook
   * Stripe webhook handler
   */
  @Post('webhook')
  async handleWebhook(
    @Req() request: any,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature header')
    }

    try {
      const event = this.paymentService.verifyWebhookSignature(
        request.rawBody || JSON.stringify(request.body),
        signature,
      )

      await this.paymentService.handleWebhookEvent(event)

      return { received: true, eventType: event.type }
    } catch (error) {
      console.error('Webhook error:', error)
      throw new BadRequestException(`Webhook Error: ${error.message}`)
    }
  }

  /**
   * POST /api/payment/payment-intent
   * Create a payment intent for one-time payments
   */
  @Post('payment-intent')
  async createPaymentIntent(
    @Body() body: { userId: string; amount: number; description: string },
  ) {
    if (!body.userId || !body.amount || !body.description) {
      throw new BadRequestException('Missing required fields')
    }

    try {
      const result = await this.paymentService.createPaymentIntent(
        body.userId,
        body.amount,
        body.description,
      )
      return {
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * GET /api/payment/history/:userId
   * Get payment history for a user
   */
  @Get('history/:userId')
  async getPaymentHistory(@Param('userId') userId: string) {
    try {
      const history = await this.paymentService.getPaymentHistory(userId)
      return {
        success: true,
        history,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * GET /api/payment/subscription/:userId
   * Get subscription status
   */
  @Get('subscription/:userId')
  async getSubscriptionStatus(@Param('userId') userId: string) {
    try {
      const status = await this.paymentService.getSubscriptionStatus(userId)
      return {
        success: true,
        subscription: status,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}
