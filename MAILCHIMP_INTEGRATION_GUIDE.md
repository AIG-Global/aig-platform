# Mailchimp Integration Guide

## Overview
Complete Mailchimp integration for AIGINVEST providing:
- Automated member email synchronization
- Weekly personalized member digest emails
- Gamification emails (country/continent opened)
- Segmentation by membership package
- Campaign statistics and reporting

## Architecture

### Components

1. **MailchimpService** - Core Mailchimp API integration
2. **EmailTemplateService** - HTML email template generation
3. **WeeklyDigestService** - Weekly digest orchestration
4. **MailchimpController** - REST API endpoints

### Data Flow

```
User Registration
    ↓
Auto-Subscribe to Mailchimp
    ↓
Weekly Digest Process
    ├→ Fetch member data (commissions, investments, tokens, network)
    ├→ Generate personalized HTML
    ├→ Send via Mailchimp
    └→ Log in database
    ↓
Country Opened Event
    ├→ Detect new member from new country
    ├→ Send gamification email
    ├→ Warn about vault capacity
    └→ Log event
```

## Setup

### 1. Install Dependencies

```bash
cd apps/api
npm install axios mailchimp-marketing
```

### 2. Environment Variables

```env
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_api_key_here          # From mailchimp.com/account/api
MAILCHIMP_LIST_ID=your_list_id_here          # From Lists > Settings > List ID
MAILCHIMP_FROM_EMAIL=noreply@aiginvest.com
MAILCHIMP_FROM_NAME=AIGINVEST

# For notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 3. Database Schema

Add to `prisma/schema.prisma`:

```prisma
model EmailCampaign {
  id            String   @id @default(cuid())
  name          String
  type          String   // WEEKLY_DIGEST, COUNTRY_OPENED, etc.
  recipientCount Int
  successCount  Int
  failureCount  Int
  status        String   // PENDING, COMPLETED, FAILED
  sentAt        DateTime?
  errors        String?  // JSON array of errors
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([type])
  @@index([status])
}

model EmailLog {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation("emailLogs", fields: [userId], references: [id])
  recipient     String
  subject       String
  type          String   // WEEKLY_DIGEST, COUNTRY_OPENED, etc.
  status        String   // SENT, FAILED, BOUNCED, etc.
  sentAt        DateTime?
  openedAt      DateTime?
  clickedAt     DateTime?
  metadata      String?  // JSON for campaign-specific data
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([type])
  @@index([status])
}
```

Update User model:
```prisma
model User {
  // ... existing fields
  
  // Mailchimp
  mailchimpContactId String?  @unique
  
  // Relations
  emailLogs          EmailLog[] @relation("emailLogs")
}
```

Run migration:
```bash
npx prisma migrate dev --name add_email_campaign_and_logs
```

### 4. Import Module

In `apps/api/src/app.module.ts`:

```typescript
import { MailchimpModule } from './mailchimp/mailchimp.module'

@Module({
  imports: [
    // ... other modules
    MailchimpModule,
  ],
})
export class AppModule {}
```

## API Endpoints

### Subscribe User
```bash
POST /api/mailchimp/subscribe/:userId
Response: { success: true, contactId: "..." }
```

### Sync All Users
```bash
POST /api/mailchimp/subscribe-all
Response: { success: true, results: [...] }
```

### Send Weekly Digest
```bash
POST /api/mailchimp/weekly-digest
Response: { success: true, success: 1000, failed: 5 }
```

### Send Country Opened Email
```bash
POST /api/mailchimp/country-opened
Body: {
  userId: "user_id",
  countryName: "Germany",
  continentName: "Europe"
}
Response: { success: true }
```

### Get Statistics
```bash
GET /api/mailchimp/stats?days=7
Response: {
  campaigns: { total: 4, totalRecipients: 4000, ... },
  emails: { total: 3950, byType: { WEEKLY_DIGEST: 3950 } }
}
```

### Update User Tags
```bash
POST /api/mailchimp/update-tags/:userId
Body: { tags: ["professional", "active"] }
Response: { success: true }
```

## Cron Jobs

### Setup Weekly Digest

Add to `apps/api/src/cron/cron.service.ts`:

```typescript
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WeeklyDigestService } from '../mailchimp/weekly-digest.service'

@Injectable()
export class CronService {
  constructor(private weeklyDigest: WeeklyDigestService) {}

  /**
   * Send weekly digest every Monday at 9 AM UTC
   */
  @Cron('0 9 * * 1') // Monday 09:00
  async sendWeeklyDigest() {
    console.log('[Cron] Starting weekly digest send...')
    try {
      const result = await this.weeklyDigest.sendWeeklyDigestToAll()
      console.log(`[Cron] Weekly digest sent: ${result.success} success, ${result.failed} failed`)
    } catch (error) {
      console.error('[Cron] Weekly digest failed:', error)
    }
  }
}
```

## Weekly Digest Email Features

### What's Included

1. **Personalization**
   - Member's first name
   - Membership package level
   - Country/location

2. **Performance Metrics**
   - Upcoming commissions (€)
   - Investment value growth (€)
   - Token value increase (%)
   - Network new members count

3. **Gamification**
   - New countries opened by network members
   - Continent achievement badges
   - Income increase warnings
   - Vault capacity alerts

4. **Call to Action**
   - Dashboard link
   - Upgrade membership option
   - Network expansion opportunities

### Template Variables

```
${member.firstName}
${member.upcomingCommissions}
${member.investmentValueIncrease}
${member.tokenValueIncrease}
${member.networkNewMembers}
${member.newCountriesOpened}
${member.vaultSize}
${member.vaultCapacity}
${member.membershipPackage}
```

## Country Opening Detection

### Implementation Steps

1. **Track Referrals**
   - Create Referral model linking referrer to referred
   - Store on signup via invitation code

2. **Geotagging**
   - Capture country from IP on signup
   - Store in User.nationality

3. **New Country Detection**
   ```typescript
   // Check if this is first member from country in network
   const existingFromCountry = await prisma.user.findMany({
     where: {
       referredBy: userId,
       nationality: newMemberCountry
     }
   })
   
   if (existingFromCountry.length === 1) {
     // First member from this country!
     await weeklyDigest.sendCountryOpenedEmail(...)
   }
   ```

## Segmentation Tags

Members are tagged automatically:

### Membership Package Tags
- `remittance`
- `starter`
- `startup`
- `professional`

### Activity Tags
- `active`
- `inactive`
- `high-earner`
- `new-member`
- `network-builder`

### Geographic Tags
- Continent names (Europe, Asia, etc.)
- Country codes (DE, FR, US, etc.)

### Campaign Tags
- `weekly-digest`
- `country-opened`
- `vault-warning`

## Testing

### Test Email in Mailchimp

```bash
# Using API key to send test
curl -X POST https://us1.api.mailchimp.com/3.0/lists/LIST_ID/members \
  -u "apikey:YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "status": "subscribed",
    "merge_fields": {"FNAME":"Test","LNAME":"User"}
  }'
```

### Send Test Digest

```bash
# Trigger manually
curl -X POST http://localhost:3333/api/mailchimp/weekly-digest \
  -H "Content-Type: application/json"
```

### Monitor Campaign

```typescript
// Check stats
const stats = await weeklyDigest.getCampaignStats(7)
console.log(stats)
// {
//   campaigns: { total: 4, totalSuccess: 3980, totalFailed: 20 },
//   emails: { total: 3980, byType: { WEEKLY_DIGEST: 3980 } }
// }
```

## Troubleshooting

### Users Not Subscribing

```bash
# Check API key
echo $MAILCHIMP_API_KEY

# Test Mailchimp connectivity
curl -I https://us1.api.mailchimp.com/3.0/ \
  -u "apikey:YOUR_API_KEY"

# Check list ID
curl https://us1.api.mailchimp.com/3.0/lists \
  -u "apikey:YOUR_API_KEY"
```

### Emails Not Sending

```typescript
// Check email templates
const campaigns = await prisma.emailCampaign.findMany({
  where: { status: 'FAILED' },
  orderBy: { sentAt: 'desc' },
  take: 10
})

campaigns.forEach(c => {
  console.log(c.name, JSON.parse(c.errors || '[]'))
})
```

### Webhook Issues

Mailchimp webhooks for opens/clicks:
- Set webhook URL in Mailchimp settings
- Endpoint: `/api/mailchimp/webhooks`
- Events: opens, clicks, bounces

## Security

1. **API Key Protection**
   - Never commit API key
   - Use environment variables
   - Rotate keys regularly

2. **Email Privacy**
   - Emails encrypted in transit (HTTPS)
   - PII handled per GDPR
   - Unsubscribe links required

3. **Rate Limiting**
   - 500ms delay between sends
   - Mailchimp API rate limits
   - Monitor for throttling

## Performance

### Optimization Tips

- **Batch sending**: Send 50-100 emails per batch
- **Time distribution**: Spread sends over 2-3 hours
- **Template caching**: Cache generated HTML
- **Database indexing**: Index emailLogs by userId and sentAt
- **Compression**: Gzip HTML before sending

### Monitoring

```bash
# Monitor weekly digest performance
SELECT 
  type,
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (sentAt - createdAt))) as avg_send_time
FROM email_log
WHERE createdAt > now() - interval '7 days'
GROUP BY type, status
```

## Support

- **Mailchimp Docs**: https://mailchimp.com/developer/
- **API Reference**: https://mailchimp.com/developer/api/marketing/lists/
- **Status Page**: https://status.mailchimp.com/
