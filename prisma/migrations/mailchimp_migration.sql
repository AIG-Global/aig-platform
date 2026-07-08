-- This migration adds Mailchimp integration tables to the database
-- Add these models to prisma/schema.prisma

-- First, add these fields to the existing User model:
-- mailchimpContactId String? @unique
-- Add relation: emailLogs EmailLog[] @relation("emailLogs")

-- Then add these new models:

-- ============================================================================
-- EMAIL CAMPAIGNS (Mailchimp Integration)
-- ============================================================================

model EmailCampaign {
  id              String    @id @default(cuid())
  
  -- Campaign info
  name            String    // e.g., "Weekly Digest 2026-07-08"
  type            String    // WEEKLY_DIGEST, COUNTRY_OPENED, VAULT_WARNING, etc.
  
  -- Statistics
  recipientCount  Int       // Total recipients
  successCount    Int       // Successfully sent
  failureCount    Int       // Failed sends
  
  -- Status
  status          String    @default("PENDING") // PENDING, COMPLETED, FAILED
  
  -- Metadata
  sentAt          DateTime?
  errors          String?   // JSON array of error objects: [{memberId, error}]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([type])
  @@index([status])
  @@index([sentAt])
}

model EmailLog {
  id              String    @id @default(cuid())
  
  -- Recipient
  userId          String
  user            User      @relation("emailLogs", fields: [userId], references: [id], onDelete: Cascade)
  recipient       String    // Email address
  
  -- Email info
  subject         String
  type            String    // WEEKLY_DIGEST, COUNTRY_OPENED, VAULT_WARNING, etc.
  
  -- Status tracking
  status          String    @default("SENT") // SENT, FAILED, BOUNCED, OPENED, CLICKED
  sentAt          DateTime?
  openedAt        DateTime?
  clickedAt       DateTime?
  
  -- Metadata (JSON for campaign-specific data)
  metadata        String?   // e.g., {"countryName": "Germany", "continentName": "Europe"}
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
  @@index([type])
  @@index([status])
  @@index([sentAt])
  @@index([recipient])
}

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Migration Steps:
-- 1. Copy the field additions to User model
-- 2. Copy the new models (EmailCampaign and EmailLog) to schema.prisma
-- 3. Run: npx prisma migrate dev --name add_mailchimp_integration
-- 4. Verify tables created: psql -d aig_platform -c "\dt" | grep email
-- 5. Verify columns: psql -d aig_platform -c "\d+ email_campaign"
