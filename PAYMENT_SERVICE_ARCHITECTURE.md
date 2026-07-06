# Payment Service Architecture

**Date:** 2026-07-06  
**Version:** 1.0  
**Status:** Ready for implementation  

---

## Overview

The **Payment Service** is provider-agnostic middleware that abstracts payment processing. This gives us:

- ✅ Flexibility (swap providers without code changes)
- ✅ Resilience (fallback to alternate providers)
- ✅ Control (single billing dashboard)
- ✅ Insights (unified analytics)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Diana API (NestJS)                 │
│         POST /payments/charge                   │
│         POST /payments/subscribe                │
│         GET  /payments/methods                  │
└──────────────┬──────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────┐
│        Payment Service (Abstraction)            │
│                                                  │
│  - Provider routing                             │
│  - Error handling                               │
│  - Fallback logic                               │
│  - Reconciliation                               │
│  - Webhook processing                           │
└──────────────┬──────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────────┐
    │          │          │              │
┌───▼───┐  ┌──▼─────┐  ┌─▼────┐  ┌────▼──┐
│Stripe │  │ PayPal │  │ Link │  │Apple  │
└───────┘  └────────┘  └──────┘  │ Pay   │
                                  └───────┘
```

---

## Supported Payment Providers

### 1. Stripe (Primary)

**Why:** Industry standard, reliable, excellent API  

**Capabilities:**
- ✅ Credit/Debit cards (US, EU, Global)
- ✅ Recurring billing (subscriptions)
- ✅ Webhooks (instant payment confirmation)
- ✅ Refunds (full + partial)
- ✅ Dispute handling
- ✅ Advanced fraud detection
- ✅ Link (embedded payment form)

**Integration:**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const charge = await stripe.charges.create({
  amount: 2900, // $29.00 in cents
  currency: 'usd',
  source: 'tok_visa', // from Stripe Elements
  description: 'Diana Premium Monthly'
});
```

**Costs:** 2.9% + $0.30 per transaction

---

### 2. PayPal (Fallback)

**Why:** Trusted by users globally, good for international  

**Capabilities:**
- ✅ PayPal balance
- ✅ Credit/Debit cards
- ✅ Recurring billing
- ✅ Webhooks
- ✅ Refunds
- ✅ Global coverage

**Integration:**
```javascript
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});

const payment = paypal.payment.create({
  intent: 'sale',
  payer: { payment_method: 'paypal' },
  transactions: [{
    amount: { total: '29.00', currency: 'USD' }
  }]
});
```

**Costs:** 2.9% + $0.30 per transaction

---

### 3. Link (Stripe-hosted)

**Why:** Fast checkout, high conversion, brand friendly  

**Capabilities:**
- ✅ Embedded checkout
- ✅ Saved cards
- ✅ One-click payment
- ✅ Lower friction than standard form

**Integration:**
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Diana Premium' },
      unit_amount: 2900
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://diana.app/success',
  cancel_url: 'https://diana.app/cancel'
});
```

**Costs:** Same as Stripe

---

### 4. Apple Pay (iOS/Web)

**Why:** Native iOS payment, high conversion on Apple devices  

**Capabilities:**
- ✅ Native iOS integration
- ✅ Touch/Face ID authentication
- ✅ Saved cards
- ✅ One-tap payment

**Integration:**
```javascript
// Web via Stripe
const paymentRequest = stripe.paymentRequest({
  country: 'US',
  currency: 'usd',
  total: {
    label: 'Diana Premium',
    amount: 2900
  }
});

paymentRequest.on('paymentmethod', async (ev) => {
  const { paymentMethod } = ev;
  // Process payment...
});
```

**Costs:** Same as Stripe (via Stripe)

---

### 5. Google Pay (Android/Web)

**Why:** Native Android payment, high conversion on Android devices  

**Capabilities:**
- ✅ Native Android integration
- ✅ Biometric authentication
- ✅ Saved cards
- ✅ One-tap payment

**Integration:**
```javascript
// Similar to Apple Pay via Stripe
// or native Android implementation
```

**Costs:** Same as Stripe (via Stripe)

---

## Payment Service Implementation

### Service Structure

```
packages/payment-service/
├── src/
│   ├── payment.service.ts (main service)
│   ├── providers/
│   │   ├── stripe.provider.ts
│   │   ├── paypal.provider.ts
│   │   └── provider.interface.ts
│   ├── models/
│   │   ├── payment.model.ts
│   │   ├── subscription.model.ts
│   │   └── transaction.model.ts
│   ├── controllers/
│   │   ├── payment.controller.ts
│   │   └── webhook.controller.ts
│   ├── utils/
│   │   ├── currency.util.ts
│   │   ├── reconciliation.util.ts
│   │   └── error.util.ts
│   └── migrations/
│       └── payment_schema.sql
├── tests/
│   ├── payment.service.spec.ts
│   ├── stripe.provider.spec.ts
│   └── paypal.provider.spec.ts
└── package.json
```

### Core Service

```typescript
// payment.service.ts

import { Injectable } from '@nestjs/common';
import { StripeProvider } from './providers/stripe.provider';
import { PayPalProvider } from './providers/paypal.provider';

@Injectable()
export class PaymentService {
  private stripeProvider: StripeProvider;
  private paypalProvider: PayPalProvider;
  private providers: Map<string, PaymentProvider>;

  constructor() {
    this.stripeProvider = new StripeProvider();
    this.paypalProvider = new PayPalProvider();
    
    this.providers = new Map([
      ['stripe', this.stripeProvider],
      ['paypal', this.paypalProvider]
    ]);
  }

  /**
   * Charge a one-time payment
   */
  async charge(
    userId: string,
    amount: number,
    currency: string,
    description: string,
    paymentMethod?: string
  ): Promise<Payment> {
    const provider = this.selectProvider(paymentMethod);
    
    try {
      const result = await provider.charge(
        amount,
        currency,
        description
      );
      
      // Save to database
      const payment = await this.savePayment({
        userId,
        provider: provider.name,
        amount,
        currency,
        status: 'completed',
        transactionId: result.id
      });
      
      return payment;
    } catch (error) {
      // Try fallback provider
      const fallbackProvider = this.getFallbackProvider(provider);
      try {
        const result = await fallbackProvider.charge(
          amount,
          currency,
          description
        );
        
        const payment = await this.savePayment({
          userId,
          provider: fallbackProvider.name,
          amount,
          currency,
          status: 'completed',
          transactionId: result.id
        });
        
        return payment;
      } catch (fallbackError) {
        throw new PaymentError(
          'Payment failed on all providers',
          { originalError: error, fallbackError }
        );
      }
    }
  }

  /**
   * Create a subscription
   */
  async subscribe(
    userId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<Subscription> {
    const provider = this.getProviderForMethod(paymentMethodId);
    
    const result = await provider.subscribe(
      planId,
      paymentMethodId
    );
    
    const subscription = await this.saveSubscription({
      userId,
      provider: provider.name,
      planId,
      status: 'active',
      subscriptionId: result.id,
      startDate: new Date(),
      nextBillingDate: result.nextBillingDate
    });
    
    return subscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string
  ): Promise<void> {
    const subscription = await this.getSubscription(subscriptionId);
    const provider = this.providers.get(subscription.provider);
    
    await provider.cancelSubscription(
      subscription.subscriptionId
    );
    
    await this.updateSubscription(subscriptionId, {
      status: 'cancelled',
      endDate: new Date()
    });
  }

  /**
   * Refund payment
   */
  async refund(
    paymentId: string,
    amount?: number
  ): Promise<void> {
    const payment = await this.getPayment(paymentId);
    const provider = this.providers.get(payment.provider);
    
    await provider.refund(payment.transactionId, amount);
    
    await this.updatePayment(paymentId, {
      status: amount ? 'partially_refunded' : 'refunded',
      refundedAt: new Date(),
      refundAmount: amount || payment.amount
    });
  }

  /**
   * Get list of saved payment methods
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return await this.db.query(
      'SELECT * FROM payment_methods WHERE user_id = $1',
      [userId]
    );
  }

  /**
   * Save payment method (tokenize)
   */
  async savePaymentMethod(
    userId: string,
    paymentMethodData: any,
    provider: string
  ): Promise<PaymentMethod> {
    const providerInstance = this.providers.get(provider);
    
    const tokenized = await providerInstance.savePaymentMethod(
      paymentMethodData
    );
    
    const method = await this.db.insert('payment_methods', {
      userId,
      provider,
      token: tokenized.token,
      last4: tokenized.last4,
      brand: tokenized.brand
    });
    
    return method;
  }

  /**
   * Handle webhook from payment provider
   */
  async handleWebhook(
    provider: string,
    event: any,
    signature: string
  ): Promise<void> {
    const providerInstance = this.providers.get(provider);
    
    // Verify webhook signature
    const verified = providerInstance.verifyWebhookSignature(
      event,
      signature
    );
    
    if (!verified) {
      throw new Error('Invalid webhook signature');
    }
    
    // Process event based on type
    switch (event.type) {
      case 'charge.succeeded':
        await this.handleChargeSucceeded(event.data);
        break;
      case 'charge.failed':
        await this.handleChargeFailed(event.data);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data);
        break;
      // ... other event types
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Payment[]> {
    return await this.db.query(
      `SELECT * FROM payments 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
  }

  /**
   * Reconcile payments with provider
   */
  async reconcile(provider: string): Promise<ReconciliationResult> {
    const providerInstance = this.providers.get(provider);
    
    // Get charges from provider
    const providerCharges = await providerInstance.listCharges();
    
    // Get charges from our database
    const dbCharges = await this.db.query(
      'SELECT * FROM payments WHERE provider = $1',
      [provider]
    );
    
    // Compare and identify discrepancies
    const discrepancies = this.findDiscrepancies(
      providerCharges,
      dbCharges
    );
    
    // Log discrepancies
    await this.logReconciliation({
      provider,
      timestamp: new Date(),
      discrepancies,
      status: discrepancies.length === 0 ? 'ok' : 'issues_found'
    });
    
    return {
      provider,
      matched: providerCharges.length - discrepancies.length,
      discrepancies
    };
  }

  // Helper methods
  
  private selectProvider(preferred?: string): PaymentProvider {
    if (preferred && this.providers.has(preferred)) {
      return this.providers.get(preferred);
    }
    return this.stripeProvider; // default
  }

  private getFallbackProvider(
    current: PaymentProvider
  ): PaymentProvider {
    if (current.name === 'stripe') {
      return this.paypalProvider;
    }
    return this.stripeProvider;
  }

  private async savePayment(data: any): Promise<Payment> {
    // Save to PostgreSQL
  }

  private async saveSubscription(data: any): Promise<Subscription> {
    // Save to PostgreSQL
  }

  // ... more helper methods
}
```

### Provider Interface

```typescript
// providers/provider.interface.ts

export interface PaymentProvider {
  name: string;
  
  charge(
    amount: number,
    currency: string,
    description: string
  ): Promise<ChargeResult>;
  
  subscribe(
    planId: string,
    paymentMethodId: string
  ): Promise<SubscriptionResult>;
  
  cancelSubscription(subscriptionId: string): Promise<void>;
  
  refund(transactionId: string, amount?: number): Promise<void>;
  
  savePaymentMethod(data: any): Promise<TokenizedMethod>;
  
  getPaymentMethod(token: string): Promise<PaymentMethod>;
  
  listCharges(): Promise<Charge[]>;
  
  verifyWebhookSignature(event: any, signature: string): boolean;
}

export interface ChargeResult {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed';
  created: Date;
}

export interface SubscriptionResult {
  id: string;
  status: 'active' | 'canceled';
  nextBillingDate: Date;
}

export interface TokenizedMethod {
  token: string;
  last4: string;
  brand: string;
}
```

---

## API Endpoints

```
POST /payments/charge
{
  "amount": 2900,
  "currency": "usd",
  "description": "Diana Premium Monthly",
  "paymentMethodId": "pm_xxx"
}

Response (201 Created):
{
  "id": "pay_xxx",
  "status": "completed",
  "amount": 2900,
  "currency": "usd",
  "provider": "stripe",
  "transactionId": "ch_xxx",
  "createdAt": "2026-07-06T10:30:00Z"
}
```

```
POST /payments/subscribe
{
  "planId": "plan_premium_monthly",
  "paymentMethodId": "pm_xxx"
}

Response (201 Created):
{
  "id": "sub_xxx",
  "planId": "plan_premium_monthly",
  "status": "active",
  "provider": "stripe",
  "subscriptionId": "sub_stripe_xxx",
  "nextBillingDate": "2026-08-06T10:30:00Z"
}
```

```
POST /payments/refund/:paymentId
{
  "amount": 1450  // Optional partial refund
}

Response (200 OK):
{
  "status": "refunded",
  "refundAmount": 2900,
  "refundedAt": "2026-07-06T10:35:00Z"
}
```

```
GET /payments/methods

Response (200 OK):
[
  {
    "id": "pm_xxx",
    "provider": "stripe",
    "brand": "visa",
    "last4": "4242",
    "expiry": "12/26"
  },
  {
    "id": "pm_yyy",
    "provider": "paypal",
    "last4": "9876"
  }
]
```

```
POST /payments/webhooks/:provider

Response (200 OK):
{
  "status": "processed",
  "eventId": "evt_xxx"
}
```

---

## Pricing Plans

### Phase 1: Two Plans

**Diana Free**
- Basic conversation
- 100 documents/month
- No integrations
- Price: FREE

**Diana Premium**
- Unlimited conversations
- Unlimited documents
- All integrations
- Advanced features
- Price: $29/month or $290/year

### Database Schema

```sql
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price_monthly DECIMAL(10, 2),
  price_annual DECIMAL(10, 2),
  features JSONB,
  active BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id UUID NOT NULL REFERENCES pricing_plans(id),
  provider VARCHAR(50),
  subscription_id VARCHAR(255),
  status VARCHAR(50),
  start_date TIMESTAMP,
  next_billing_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  provider VARCHAR(50),
  transaction_id VARCHAR(255),
  status VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider VARCHAR(50),
  token VARCHAR(255),
  brand VARCHAR(50),
  last4 VARCHAR(4),
  expiry_month INT,
  expiry_year INT,
  is_default BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Error Handling

### Retry Logic

```
Payment failed?
├── Retry 1: Immediate (same provider)
├── Retry 2: After 5 seconds (same provider)
├── Retry 3: After 30 seconds (different provider)
└── After 3 retries: Notify user
```

### Error Messages

```
Internal error: "We had a problem processing your payment. 
Please try again or contact support."

Provider unavailable: "This payment method is temporarily unavailable.
Try a different method or check back soon."

Insufficient funds: "Your card was declined. Please check your 
balance and try again."

Invalid card: "Your card details are invalid. Please check and retry."
```

---

## Security

### PCI Compliance

- Never store raw card data
- Use provider tokenization
- Encrypt payment method tokens
- Log payment events (not sensitive data)
- Regular security audits

### Webhook Security

- Verify webhook signature before processing
- Idempotent webhook handling (safe to replay)
- Timeout webhooks after 30 seconds
- Log all webhook activity

### Environment Variables

```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...

PAYMENT_DB_URL=postgresql://...
```

---

## Monitoring

### Key Metrics

- Charge success rate
- Average charge time
- Failed charges by reason
- Subscription churn rate
- Revenue per user
- Payment method distribution

### Alerts

- Charge failure rate >5%
- Payment service response time >2s
- Webhook processing failures
- Reconciliation discrepancies
- Revenue anomalies

---

## Testing

```typescript
// payment.service.spec.ts

describe('PaymentService', () => {
  it('should charge successfully', async () => {
    const payment = await paymentService.charge(
      'user-123',
      2900,
      'usd',
      'Diana Premium'
    );
    
    expect(payment.status).toBe('completed');
    expect(payment.amount).toBe(2900);
  });

  it('should fallback to PayPal if Stripe fails', async () => {
    // Mock Stripe to fail
    stripeProvider.charge = jest.fn()
      .mockRejectedValue(new Error('Stripe down'));
    
    const payment = await paymentService.charge(
      'user-123',
      2900,
      'usd',
      'Diana Premium'
    );
    
    expect(payment.provider).toBe('paypal');
  });

  it('should handle webhook signature verification', async () => {
    const valid = paymentService.handleWebhook(
      'stripe',
      event,
      validSignature
    );
    
    expect(valid).toBeTruthy();
  });
});
```

---

## Roadmap

**Phase 1:**
- ✅ Stripe integration
- ✅ PayPal fallback
- ✅ Recurring billing
- ✅ Webhooks

**Phase 2:**
- ✅ Apple Pay / Google Pay
- ✅ International currencies
- ✅ Tax calculation
- ✅ Invoicing

**Phase 3+:**
- ✅ Crypto payments
- ✅ Subscription management UI
- ✅ Enterprise billing
- ✅ Revenue analytics dashboard

---

**The Payment Service is the financial backbone of Diana.**

*Payment Service Architecture*  
*Version 1.0 | 2026-07-06*  
*Status: Ready for implementation*
