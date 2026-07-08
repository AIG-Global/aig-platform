# Payment Integration Implementation Guide

## Overview
This guide documents the Stripe payment integration for AIGINVEST membership upgrades.

## Components

### 1. Backend - NestJS Payment Service
**File**: `apps/api/src/payment/payment.service.ts`

**Key Features**:
- Create Stripe checkout sessions for monthly subscriptions
- Handle webhook events (checkout, payments, cancellations)
- Create one-time payment intents
- Track payment history and subscription status
- Validate webhook signatures

**Main Methods**:
- `createCheckoutSession()` - Initiate subscription
- `handleWebhookEvent()` - Process Stripe events
- `getPaymentHistory()` - Retrieve user payments
- `getSubscriptionStatus()` - Check current subscription

### 2. Backend - Payment Controller
**File**: `apps/api/src/payment/payment.controller.ts`

**Endpoints**:
```
POST /api/payment/checkout-session
Body: { userId, packId, packPrice }
Response: { success, sessionId, url }

POST /api/payment/webhook
Headers: stripe-signature
Body: Raw Stripe webhook payload

POST /api/payment/payment-intent
Body: { userId, amount, description }

GET /api/payment/history/:userId
Response: { success, history }

GET /api/payment/subscription/:userId
Response: { success, subscription }
```

### 3. Frontend - Payment Button Component
**File**: `apps/web/components/PaymentButton.tsx`

**Features**:
- Handles checkout session creation
- Integrates with Stripe.js
- Redirects to Stripe checkout
- Error handling and loading states

**Usage**:
```tsx
import PaymentButton from '@/components/PaymentButton'

<PaymentButton
  userId={user.id}
  packId="starter"
  packName="Starter Pack"
  price={399}
  onSuccess={() => console.log('Payment success')}
  onError={(err) => console.error(err)}
/>
```

## Setup Instructions

### 1. Install Stripe Dependencies

```bash
# Backend
cd apps/api
npm install stripe

# Frontend  
cd apps/web
npm install @stripe/react-stripe-js @stripe/js
```

### 2. Add Environment Variables

**.env.hetzner.template** or **.env**:
```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Database Migration

Create and apply migration with payment tables:
```bash
npx prisma migrate dev --name add_payment_models
```

The migration includes:
- `PaymentSession` - Stripe checkout sessions
- `PaymentRecord` - Transaction history
- `Subscription` - Active subscriptions

### 4. Configure Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payment/webhook`
3. Events to listen:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Update User Model

Ensure User model includes payment fields:
```prisma
model User {
  // ... existing fields
  
  // Payment/Subscription
  membershipPackage    String?      // remittance, starter, startup, professional
  membershipStatus     String?      // active, cancelled, pending
  membershipStartDate  DateTime?
  membershipEndDate    DateTime?
  stripeCustomerId     String?      @unique
  stripeSubscriptionId String?      @unique
  
  // Relations
  paymentSessions      PaymentSession[]  @relation("paymentSessions")
  paymentRecords       PaymentRecord[]   @relation("paymentRecords")
  subscription         Subscription?     @relation("subscription")
}
```

## Integration Flows

### Upgrade Membership Flow
```
1. User clicks "Upgrade" button on dashboard
2. Frontend calls POST /api/payment/checkout-session
3. Backend creates Stripe session
4. Frontend redirects to Stripe checkout with sessionId
5. User completes payment on Stripe
6. Stripe redirects to success URL
7. Webhook confirms payment → Updates user membership
8. User redirected to dashboard with success message
```

### Recurring Payment Flow
```
1. Checkout session created with mode: 'subscription'
2. Subscription runs monthly automatically
3. Monthly invoices created by Stripe
4. Webhook processes invoice.payment_succeeded
5. Payment record logged
6. User receives renewal confirmation
```

### Failed Payment Handling
```
1. Payment fails
2. Webhook receives invoice.payment_failed
3. Payment record logged with failed status
4. User notified (email/in-app)
5. Retry scheduled by Stripe (configurable)
```

## Testing

### Test Stripe Cards
```
Success: 4242 4242 4242 4242
Failure: 4000 0000 0000 0002
```

### Test Webhook Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe account
stripe login

# Forward webhook to local server
stripe listen --forward-to localhost:3333/api/payment/webhook

# Trigger test events
stripe trigger checkout.session.completed
```

## Security Considerations

1. **Signature Verification**: All webhooks must verify Stripe signature
2. **Rate Limiting**: Implement rate limits on payment endpoints
3. **PCI Compliance**: Never handle card data directly - use Stripe
4. **Secrets**: Store `STRIPE_SECRET_KEY` and `WEBHOOK_SECRET` securely
5. **HTTPS**: Always use HTTPS in production
6. **Idempotency**: Handle webhook retries with idempotency keys

## Troubleshooting

### Webhook not received
- Check webhook signing secret
- Verify endpoint is publicly accessible
- Check firewall/security rules
- Review Stripe dashboard logs

### Payment intent fails
- Verify amount is in cents
- Check currency matches
- Ensure userId exists
- Review Stripe API error responses

### Subscription not created
- Verify mode: 'subscription' in checkout
- Check interval_count is valid
- Ensure billing cycle setup

## Support & Resources

- Stripe Docs: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

## Next Steps

1. Install dependencies
2. Add environment variables
3. Create database migration
4. Deploy payment service
5. Test with Stripe test cards
6. Set up webhook forwarding
7. Enable production mode
