/*
  Warnings:

  - You are about to drop the `_OrganizationMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diana_memories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `milestones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mission_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `missions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `webhook_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED', 'DELETED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE', 'CONTRACTOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('ACTIVE', 'BETA', 'DEPRECATED', 'DISABLED');

-- CreateEnum
CREATE TYPE "SubStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH_ACCOUNT', 'AIG_CASH_ACCOUNT');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'FROZEN', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'AIG');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'COMMISSION', 'MEMBERSHIP_FEE', 'INVESTMENT', 'RETURN', 'CONVERSION', 'CORRECTION', 'BONUS');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "CommissionSource" AS ENUM ('REFERRAL', 'WDM_ORDER', 'INVESTMENT', 'MEMBERSHIP');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvestmentProduct" AS ENUM ('CRYPTO_MARKET', 'TAGMARKETS', 'AIG_PHONE_SHARES', 'MANAGED_3Y', 'MANAGED_5Y', 'MANAGED_7Y', 'MANAGED_10Y');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('ACTIVE', 'MATURE', 'RETURNED', 'CANCELLED', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "WDMCategory" AS ENUM ('LUXURY_VEHICLES', 'ELECTRONICS', 'TRAVEL', 'REAL_ESTATE', 'BUSINESS_SERVICES', 'INVESTMENTS', 'SOFTWARE_TOOLS', 'EXPERIENCES');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELISTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AIType" AS ENUM ('MASTER_AI', 'DEPARTMENT_AI', 'AUTONOMOUS_BOT', 'USER_ASSISTANT');

-- CreateEnum
CREATE TYPE "AIStatus" AS ENUM ('ACTIVE', 'TRAINING', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "EventLogStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RETRY');

-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('MONTHLY_TIER_RISE', 'FAST_TRACKER', 'QUARTERLY_RANKING', 'ANNUAL_AWARDS');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'CLOSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ModuleStatus" AS ENUM ('DEVELOPMENT', 'RELEASE', 'ADOPTION', 'OPERATION', 'UPGRADE', 'DISABLE', 'SUNSET');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'BILLING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "_OrganizationMembers" DROP CONSTRAINT "_OrganizationMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationMembers" DROP CONSTRAINT "_OrganizationMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_userId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "diana_memories" DROP CONSTRAINT "diana_memories_missionId_fkey";

-- DropForeignKey
ALTER TABLE "diana_memories" DROP CONSTRAINT "diana_memories_userId_fkey";

-- DropForeignKey
ALTER TABLE "diana_memories" DROP CONSTRAINT "diana_memories_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_missionId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_projectId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "milestones" DROP CONSTRAINT "milestones_missionId_fkey";

-- DropForeignKey
ALTER TABLE "mission_progress" DROP CONSTRAINT "mission_progress_missionId_fkey";

-- DropForeignKey
ALTER TABLE "missions" DROP CONSTRAINT "missions_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "missions" DROP CONSTRAINT "missions_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "project_tasks" DROP CONSTRAINT "project_tasks_milestoneId_fkey";

-- DropForeignKey
ALTER TABLE "project_tasks" DROP CONSTRAINT "project_tasks_missionId_fkey";

-- DropForeignKey
ALTER TABLE "project_tasks" DROP CONSTRAINT "project_tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_missionId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_missionId_fkey";

-- DropForeignKey
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_ownerId_fkey";

-- DropTable
DROP TABLE "_OrganizationMembers";

-- DropTable
DROP TABLE "_TeamMembers";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "conversations";

-- DropTable
DROP TABLE "diana_memories";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "messages";

-- DropTable
DROP TABLE "milestones";

-- DropTable
DROP TABLE "mission_progress";

-- DropTable
DROP TABLE "missions";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "project_tasks";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "teams";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "webhook_subscriptions";

-- DropTable
DROP TABLE "workspaces";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "phone_number" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "nationality" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "primary_org_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "company_size" TEXT,
    "vat_id" TEXT,
    "registration_num" TEXT,
    "founded_at" TIMESTAMP(3),
    "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "dept_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "team_id" TEXT,
    "dept_id" TEXT,
    "title" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT,
    "tier" "MembershipTier" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "billing_cycle" "BillingCycle" NOT NULL,
    "price_eur" INTEGER NOT NULL,
    "next_billing" TIMESTAMP(3) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "renewed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIApp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "color" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "status" "AppStatus" NOT NULL DEFAULT 'ACTIVE',
    "min_tier" "MembershipTier" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppFeature" (
    "id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AppFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSubscription" (
    "id" TEXT NOT NULL,
    "membership_id" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "status" "SubStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),

    CONSTRAINT "AppSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "org_id" TEXT,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" BIGINT NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance_after" BIGINT NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source_type" "CommissionSource" NOT NULL,
    "source_id" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "level_percent" DOUBLE PRECISION NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionPayout" (
    "id" TEXT NOT NULL,
    "commission_id" TEXT NOT NULL,
    "payout_period" TIMESTAMP(3) NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "amount_aig" BIGINT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionPayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionRule" (
    "id" TEXT NOT NULL,
    "tier" "MembershipTier" NOT NULL,
    "level" INTEGER NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_type" "InvestmentProduct" NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "currency_used" "Currency" NOT NULL,
    "lock_period" INTEGER,
    "expected_roi" DOUBLE PRECISION,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maturity_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    "status" "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentReturn" (
    "id" TEXT NOT NULL,
    "investment_id" TEXT NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "amount_eur_80pct" BIGINT NOT NULL,
    "amount_aig_20pct" BIGINT NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WDMProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price_eur" BIGINT NOT NULL,
    "category" "WDMCategory" NOT NULL,
    "seller_id" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WDMProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WDMOrder" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_eur" BIGINT NOT NULL,
    "commission_percent" DOUBLE PRECISION NOT NULL,
    "commission_eur" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "WDMOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WDMOrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" BIGINT NOT NULL,
    "total_price" BIGINT NOT NULL,

    CONSTRAINT "WDMOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WDMReview" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WDMReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WDMCommissionRedistribution" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "affiliate_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WDMCommissionRedistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInstance" (
    "id" TEXT NOT NULL,
    "org_id" TEXT,
    "dept_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ai_type" "AIType" NOT NULL,
    "status" "AIStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianConversation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ai_instance_id" TEXT,
    "title" TEXT,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DianConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianaMessage" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DianaMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianaPersonalMemory" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_id" TEXT,
    "key_topics" TEXT[],
    "summary" TEXT,
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DianaPersonalMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianaCompanyMemory" (
    "id" TEXT NOT NULL,
    "ai_instance_id" TEXT NOT NULL,
    "document_name" TEXT NOT NULL,
    "document_content" TEXT NOT NULL,
    "category" TEXT,
    "access_level" "AccessLevel" NOT NULL,
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DianaCompanyMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianaDocument" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "org_id" TEXT,
    "filename" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "extracted_text" TEXT,
    "embedding" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DianaDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DianaPlatformMemory" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DianaPlatformMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSubscription" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "status" "EventLogStatus" NOT NULL,
    "error_msg" TEXT,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeadLetterEvent" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "error_msg" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeadLetterEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "comp_type" "CompetitionType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "CompetitionStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionEntry" (
    "id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "entered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "org_id" TEXT,
    "metric_type" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "period_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "ModuleStatus" NOT NULL DEFAULT 'DEVELOPMENT',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleConfig" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "config_key" TEXT NOT NULL,
    "config_value" TEXT NOT NULL,

    CONSTRAINT "ModuleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "org_id" TEXT,
    "address_type" "AddressType" NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "from_currency" "Currency" NOT NULL,
    "to_currency" "Currency" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3),

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppRegistry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "color" TEXT,
    "free_access" BOOLEAN NOT NULL DEFAULT false,
    "starter_access" BOOLEAN NOT NULL DEFAULT false,
    "professional_access" BOOLEAN NOT NULL DEFAULT false,
    "status" "AppStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrer_id" TEXT NOT NULL,
    "referred_id" TEXT NOT NULL,
    "referral_code" TEXT,
    "tier" INTEGER NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'ACTIVE',
    "referred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateNetwork" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "direct_referrals_count" INTEGER NOT NULL DEFAULT 0,
    "total_network_size" INTEGER NOT NULL DEFAULT 0,
    "total_commissions_earned" BIGINT NOT NULL DEFAULT 0,
    "total_commissions_pending" BIGINT NOT NULL DEFAULT 0,
    "current_tier" "MembershipTier" NOT NULL,
    "fast_tracker_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_primary_org_id_idx" ON "User"("primary_org_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_token_key" ON "AuthToken"("token");

-- CreateIndex
CREATE INDEX "AuthToken_user_id_idx" ON "AuthToken"("user_id");

-- CreateIndex
CREATE INDEX "AuthToken_token_idx" ON "AuthToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_idx" ON "RefreshToken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- CreateIndex
CREATE INDEX "Department_org_id_idx" ON "Department"("org_id");

-- CreateIndex
CREATE INDEX "Department_parent_id_idx" ON "Department"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "Department_org_id_slug_key" ON "Department"("org_id", "slug");

-- CreateIndex
CREATE INDEX "Team_org_id_idx" ON "Team"("org_id");

-- CreateIndex
CREATE INDEX "Team_dept_id_idx" ON "Team"("dept_id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_org_id_slug_key" ON "Team"("org_id", "slug");

-- CreateIndex
CREATE INDEX "Employee_user_id_idx" ON "Employee"("user_id");

-- CreateIndex
CREATE INDEX "Employee_org_id_idx" ON "Employee"("org_id");

-- CreateIndex
CREATE INDEX "Employee_team_id_idx" ON "Employee"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_user_id_org_id_key" ON "Employee"("user_id", "org_id");

-- CreateIndex
CREATE INDEX "Membership_tier_idx" ON "Membership"("tier");

-- CreateIndex
CREATE INDEX "Membership_status_idx" ON "Membership"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_user_id_key" ON "Membership"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AIApp_name_key" ON "AIApp"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AIApp_slug_key" ON "AIApp"("slug");

-- CreateIndex
CREATE INDEX "AIApp_min_tier_idx" ON "AIApp"("min_tier");

-- CreateIndex
CREATE INDEX "AppFeature_app_id_idx" ON "AppFeature"("app_id");

-- CreateIndex
CREATE INDEX "AppSubscription_membership_id_idx" ON "AppSubscription"("membership_id");

-- CreateIndex
CREATE INDEX "AppSubscription_app_id_idx" ON "AppSubscription"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppSubscription_membership_id_app_id_key" ON "AppSubscription"("membership_id", "app_id");

-- CreateIndex
CREATE INDEX "Account_user_id_idx" ON "Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_id_type_key" ON "Account"("user_id", "type");

-- CreateIndex
CREATE INDEX "Wallet_org_id_idx" ON "Wallet"("org_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_account_id_key" ON "Wallet"("account_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_user_id_idx" ON "WalletTransaction"("user_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_wallet_id_idx" ON "WalletTransaction"("wallet_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_created_at_idx" ON "WalletTransaction"("created_at");

-- CreateIndex
CREATE INDEX "Commission_user_id_idx" ON "Commission"("user_id");

-- CreateIndex
CREATE INDEX "Commission_source_type_source_id_idx" ON "Commission"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "Commission_status_idx" ON "Commission"("status");

-- CreateIndex
CREATE INDEX "Commission_tier_idx" ON "Commission"("tier");

-- CreateIndex
CREATE INDEX "CommissionPayout_payout_period_idx" ON "CommissionPayout"("payout_period");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionPayout_commission_id_key" ON "CommissionPayout"("commission_id");

-- CreateIndex
CREATE INDEX "CommissionRule_tier_idx" ON "CommissionRule"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionRule_tier_level_key" ON "CommissionRule"("tier", "level");

-- CreateIndex
CREATE INDEX "Investment_user_id_idx" ON "Investment"("user_id");

-- CreateIndex
CREATE INDEX "Investment_product_type_idx" ON "Investment"("product_type");

-- CreateIndex
CREATE INDEX "Investment_status_idx" ON "Investment"("status");

-- CreateIndex
CREATE INDEX "Investment_maturity_at_idx" ON "Investment"("maturity_at");

-- CreateIndex
CREATE INDEX "InvestmentReturn_investment_id_idx" ON "InvestmentReturn"("investment_id");

-- CreateIndex
CREATE INDEX "WDMProduct_category_idx" ON "WDMProduct"("category");

-- CreateIndex
CREATE INDEX "WDMProduct_seller_id_idx" ON "WDMProduct"("seller_id");

-- CreateIndex
CREATE INDEX "WDMProduct_status_idx" ON "WDMProduct"("status");

-- CreateIndex
CREATE INDEX "WDMOrder_product_id_idx" ON "WDMOrder"("product_id");

-- CreateIndex
CREATE INDEX "WDMOrder_buyer_id_idx" ON "WDMOrder"("buyer_id");

-- CreateIndex
CREATE INDEX "WDMOrder_status_idx" ON "WDMOrder"("status");

-- CreateIndex
CREATE INDEX "WDMOrderItem_order_id_idx" ON "WDMOrderItem"("order_id");

-- CreateIndex
CREATE INDEX "WDMReview_product_id_idx" ON "WDMReview"("product_id");

-- CreateIndex
CREATE INDEX "WDMCommissionRedistribution_order_id_idx" ON "WDMCommissionRedistribution"("order_id");

-- CreateIndex
CREATE INDEX "WDMCommissionRedistribution_affiliate_id_idx" ON "WDMCommissionRedistribution"("affiliate_id");

-- CreateIndex
CREATE INDEX "AIInstance_org_id_idx" ON "AIInstance"("org_id");

-- CreateIndex
CREATE INDEX "AIInstance_dept_id_idx" ON "AIInstance"("dept_id");

-- CreateIndex
CREATE INDEX "DianConversation_user_id_idx" ON "DianConversation"("user_id");

-- CreateIndex
CREATE INDEX "DianConversation_ai_instance_id_idx" ON "DianConversation"("ai_instance_id");

-- CreateIndex
CREATE INDEX "DianaMessage_conversation_id_idx" ON "DianaMessage"("conversation_id");

-- CreateIndex
CREATE INDEX "DianaPersonalMemory_user_id_idx" ON "DianaPersonalMemory"("user_id");

-- CreateIndex
CREATE INDEX "DianaCompanyMemory_ai_instance_id_idx" ON "DianaCompanyMemory"("ai_instance_id");

-- CreateIndex
CREATE INDEX "DianaCompanyMemory_category_idx" ON "DianaCompanyMemory"("category");

-- CreateIndex
CREATE INDEX "DianaDocument_user_id_idx" ON "DianaDocument"("user_id");

-- CreateIndex
CREATE INDEX "DianaDocument_org_id_idx" ON "DianaDocument"("org_id");

-- CreateIndex
CREATE INDEX "DianaPlatformMemory_category_idx" ON "DianaPlatformMemory"("category");

-- CreateIndex
CREATE INDEX "DianaPlatformMemory_priority_idx" ON "DianaPlatformMemory"("priority");

-- CreateIndex
CREATE INDEX "Event_event_type_idx" ON "Event"("event_type");

-- CreateIndex
CREATE INDEX "Event_aggregate_type_idx" ON "Event"("aggregate_type");

-- CreateIndex
CREATE INDEX "Event_created_at_idx" ON "Event"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "EventSubscription_event_type_handler_key" ON "EventSubscription"("event_type", "handler");

-- CreateIndex
CREATE INDEX "EventLog_event_id_idx" ON "EventLog"("event_id");

-- CreateIndex
CREATE INDEX "EventLog_status_idx" ON "EventLog"("status");

-- CreateIndex
CREATE INDEX "DeadLetterEvent_event_type_idx" ON "DeadLetterEvent"("event_type");

-- CreateIndex
CREATE INDEX "Competition_comp_type_idx" ON "Competition"("comp_type");

-- CreateIndex
CREATE INDEX "Competition_status_idx" ON "Competition"("status");

-- CreateIndex
CREATE INDEX "CompetitionEntry_competition_id_idx" ON "CompetitionEntry"("competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionEntry_competition_id_user_id_key" ON "CompetitionEntry"("competition_id", "user_id");

-- CreateIndex
CREATE INDEX "Leaderboard_competition_id_idx" ON "Leaderboard"("competition_id");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_competition_id_rank_key" ON "Leaderboard"("competition_id", "rank");

-- CreateIndex
CREATE INDEX "Analytics_user_id_idx" ON "Analytics"("user_id");

-- CreateIndex
CREATE INDEX "Analytics_org_id_idx" ON "Analytics"("org_id");

-- CreateIndex
CREATE INDEX "Analytics_metric_type_idx" ON "Analytics"("metric_type");

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE INDEX "Module_status_idx" ON "Module"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleConfig_module_id_key" ON "ModuleConfig"("module_id");

-- CreateIndex
CREATE INDEX "ModuleConfig_module_id_idx" ON "ModuleConfig"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleConfig_module_id_config_key_key" ON "ModuleConfig"("module_id", "config_key");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_name_idx" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resource_action_key" ON "Permission"("resource", "action");

-- CreateIndex
CREATE INDEX "RolePermission_role_id_idx" ON "RolePermission"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_key" ON "RolePermission"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "Address_user_id_idx" ON "Address"("user_id");

-- CreateIndex
CREATE INDEX "Address_org_id_idx" ON "Address"("org_id");

-- CreateIndex
CREATE INDEX "ExchangeRate_valid_from_idx" ON "ExchangeRate"("valid_from");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_from_currency_to_currency_valid_from_key" ON "ExchangeRate"("from_currency", "to_currency", "valid_from");

-- CreateIndex
CREATE UNIQUE INDEX "AppRegistry_name_key" ON "AppRegistry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AppRegistry_slug_key" ON "AppRegistry"("slug");

-- CreateIndex
CREATE INDEX "AppRegistry_status_idx" ON "AppRegistry"("status");

-- CreateIndex
CREATE INDEX "Referral_referrer_id_idx" ON "Referral"("referrer_id");

-- CreateIndex
CREATE INDEX "Referral_referred_id_idx" ON "Referral"("referred_id");

-- CreateIndex
CREATE INDEX "Referral_tier_idx" ON "Referral"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrer_id_referred_id_key" ON "Referral"("referrer_id", "referred_id");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateNetwork_user_id_key" ON "AffiliateNetwork"("user_id");

-- CreateIndex
CREATE INDEX "AffiliateNetwork_user_id_idx" ON "AffiliateNetwork"("user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_primary_org_id_fkey" FOREIGN KEY ("primary_org_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppFeature" ADD CONSTRAINT "AppFeature_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "AIApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSubscription" ADD CONSTRAINT "AppSubscription_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppSubscription" ADD CONSTRAINT "AppSubscription_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "AIApp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionPayout" ADD CONSTRAINT "CommissionPayout_commission_id_fkey" FOREIGN KEY ("commission_id") REFERENCES "Commission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentReturn" ADD CONSTRAINT "InvestmentReturn_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WDMOrder" ADD CONSTRAINT "WDMOrder_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "WDMProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WDMOrderItem" ADD CONSTRAINT "WDMOrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "WDMOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WDMReview" ADD CONSTRAINT "WDMReview_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "WDMProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WDMReview" ADD CONSTRAINT "WDMReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "WDMOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WDMCommissionRedistribution" ADD CONSTRAINT "WDMCommissionRedistribution_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "WDMOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInstance" ADD CONSTRAINT "AIInstance_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInstance" ADD CONSTRAINT "AIInstance_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianConversation" ADD CONSTRAINT "DianConversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianConversation" ADD CONSTRAINT "DianConversation_ai_instance_id_fkey" FOREIGN KEY ("ai_instance_id") REFERENCES "AIInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianaMessage" ADD CONSTRAINT "DianaMessage_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "DianConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianaPersonalMemory" ADD CONSTRAINT "DianaPersonalMemory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianaCompanyMemory" ADD CONSTRAINT "DianaCompanyMemory_ai_instance_id_fkey" FOREIGN KEY ("ai_instance_id") REFERENCES "AIInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DianaDocument" ADD CONSTRAINT "DianaDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleConfig" ADD CONSTRAINT "ModuleConfig_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateNetwork" ADD CONSTRAINT "AffiliateNetwork_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
