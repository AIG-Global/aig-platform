-- CreateEnum
CREATE TYPE "FundType" AS ENUM ('LONG_TERM_3Y', 'LONG_TERM_5Y', 'LONG_TERM_7Y', 'LONG_TERM_10Y', 'NORTH_STAR');

-- CreateEnum
CREATE TYPE "InvestmentFundStatus" AS ENUM ('ACTIVE', 'MATURED', 'REINVESTED', 'RELEASED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TokenPositionStatus" AS ENUM ('HOLDING', 'SOLD_OUT', 'TRADING', 'FROZEN');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FGTStatus" AS ENUM ('UNRELEASED', 'IN_DISTRIBUTION', 'FULLY_DISTRIBUTED');

-- CreateEnum
CREATE TYPE "PhoneProductStatus" AS ENUM ('COMING_SOON', 'AVAILABLE', 'DISCONTINUED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "geo_continent" TEXT;

-- CreateTable
CREATE TABLE "AppUsageEvent" (
    "id" TEXT NOT NULL,
    "app_slug" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT,
    "duration_seconds" INTEGER,
    "geo_country" TEXT,
    "geo_continent" TEXT,
    "geo_city" TEXT,
    "user_tier" "MembershipTier" NOT NULL,
    "is_general" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "period_date" TIMESTAMP(3) NOT NULL,
    "metric_type" TEXT NOT NULL,
    "dimension" TEXT,
    "dimension_value" TEXT,
    "value" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceInterest" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "interest_level" INTEGER NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentFund" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "fund_type" "FundType" NOT NULL,
    "duration_months" INTEGER,
    "principal_eur" BIGINT NOT NULL,
    "current_balance_eur" BIGINT NOT NULL,
    "accrued_interest_eur" BIGINT NOT NULL DEFAULT 0,
    "investment_month" TIMESTAMP(3) NOT NULL,
    "maturity_month" TIMESTAMP(3),
    "reinvest_on_maturity" BOOLEAN NOT NULL DEFAULT true,
    "status" "InvestmentFundStatus" NOT NULL DEFAULT 'ACTIVE',
    "commission_eur" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "matured_at" TIMESTAMP(3),
    "released_at" TIMESTAMP(3),

    CONSTRAINT "InvestmentFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentRelease" (
    "id" TEXT NOT NULL,
    "investment_fund_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "principal_eur" BIGINT NOT NULL,
    "interest_eur" BIGINT NOT NULL,
    "total_release_eur" BIGINT NOT NULL,
    "released_to_account_id" TEXT NOT NULL,
    "released_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStarTokenPosition" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tokens_owned" BIGINT NOT NULL,
    "average_cost_per_token_eur" DOUBLE PRECISION NOT NULL,
    "total_invested_eur" BIGINT NOT NULL,
    "freeze_1_active" BOOLEAN NOT NULL DEFAULT false,
    "freeze_1_locked_price_eur" DOUBLE PRECISION,
    "freeze_1_locked_at" TIMESTAMP(3),
    "freeze_1_expires_at" TIMESTAMP(3),
    "freeze_2_active" BOOLEAN NOT NULL DEFAULT false,
    "freeze_2_locked_price_eur" DOUBLE PRECISION,
    "freeze_2_locked_at" TIMESTAMP(3),
    "freeze_2_expires_at" TIMESTAMP(3),
    "status" "TokenPositionStatus" NOT NULL DEFAULT 'HOLDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NorthStarTokenPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStarPurchase" (
    "id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price_per_token_eur" DOUBLE PRECISION NOT NULL,
    "total_cost_eur" BIGINT NOT NULL,
    "purchased_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NorthStarPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStarTrade" (
    "id" TEXT NOT NULL,
    "seller_position_id" TEXT NOT NULL,
    "buyer_user_id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price_per_token_eur" DOUBLE PRECISION NOT NULL,
    "total_value_eur" BIGINT NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "NorthStarTrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStarTokenMarketValue" (
    "id" TEXT NOT NULL,
    "month_number" INTEGER NOT NULL,
    "price_per_token_eur" DOUBLE PRECISION NOT NULL,
    "monthly_appreciation_percent" DOUBLE PRECISION NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NorthStarTokenMarketValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FGTToken" (
    "id" TEXT NOT NULL,
    "total_supply" BIGINT NOT NULL DEFAULT 200000000,
    "starting_price_eur" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "tokens_distributed" BIGINT NOT NULL DEFAULT 0,
    "tokens_remaining" BIGINT NOT NULL DEFAULT 200000000,
    "status" "FGTStatus" NOT NULL DEFAULT 'UNRELEASED',

    CONSTRAINT "FGTToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FGTAllocation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tokens_allocated" BIGINT NOT NULL,
    "allocation_reason" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FGTAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStarPhoneProduct" (
    "id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specs" TEXT,
    "base_price_eur" BIGINT NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "pre_orders" INTEGER NOT NULL DEFAULT 0,
    "expected_launch" TIMESTAMP(3),
    "status" "PhoneProductStatus" NOT NULL DEFAULT 'COMING_SOON',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NorthStarPhoneProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppUsageEvent_app_slug_idx" ON "AppUsageEvent"("app_slug");

-- CreateIndex
CREATE INDEX "AppUsageEvent_user_id_idx" ON "AppUsageEvent"("user_id");

-- CreateIndex
CREATE INDEX "AppUsageEvent_created_at_idx" ON "AppUsageEvent"("created_at");

-- CreateIndex
CREATE INDEX "AppUsageEvent_geo_country_idx" ON "AppUsageEvent"("geo_country");

-- CreateIndex
CREATE INDEX "AppUsageEvent_user_tier_idx" ON "AppUsageEvent"("user_tier");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_period_date_idx" ON "AnalyticsSnapshot"("period_date");

-- CreateIndex
CREATE INDEX "AnalyticsSnapshot_metric_type_idx" ON "AnalyticsSnapshot"("metric_type");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSnapshot_period_period_date_metric_type_dimension__key" ON "AnalyticsSnapshot"("period", "period_date", "metric_type", "dimension", "dimension_value");

-- CreateIndex
CREATE INDEX "ServiceInterest_user_id_idx" ON "ServiceInterest"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceInterest_user_id_service_key" ON "ServiceInterest"("user_id", "service");

-- CreateIndex
CREATE INDEX "InvestmentFund_user_id_idx" ON "InvestmentFund"("user_id");

-- CreateIndex
CREATE INDEX "InvestmentFund_fund_type_idx" ON "InvestmentFund"("fund_type");

-- CreateIndex
CREATE INDEX "InvestmentFund_maturity_month_idx" ON "InvestmentFund"("maturity_month");

-- CreateIndex
CREATE INDEX "InvestmentFund_status_idx" ON "InvestmentFund"("status");

-- CreateIndex
CREATE INDEX "InvestmentRelease_user_id_idx" ON "InvestmentRelease"("user_id");

-- CreateIndex
CREATE INDEX "InvestmentRelease_investment_fund_id_idx" ON "InvestmentRelease"("investment_fund_id");

-- CreateIndex
CREATE INDEX "NorthStarTokenPosition_user_id_idx" ON "NorthStarTokenPosition"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "NorthStarTokenPosition_user_id_key" ON "NorthStarTokenPosition"("user_id");

-- CreateIndex
CREATE INDEX "NorthStarPurchase_position_id_idx" ON "NorthStarPurchase"("position_id");

-- CreateIndex
CREATE INDEX "NorthStarTrade_seller_position_id_idx" ON "NorthStarTrade"("seller_position_id");

-- CreateIndex
CREATE INDEX "NorthStarTrade_buyer_user_id_idx" ON "NorthStarTrade"("buyer_user_id");

-- CreateIndex
CREATE INDEX "NorthStarTrade_status_idx" ON "NorthStarTrade"("status");

-- CreateIndex
CREATE INDEX "NorthStarTokenMarketValue_month_number_idx" ON "NorthStarTokenMarketValue"("month_number");

-- CreateIndex
CREATE UNIQUE INDEX "NorthStarTokenMarketValue_month_number_key" ON "NorthStarTokenMarketValue"("month_number");

-- CreateIndex
CREATE INDEX "FGTToken_status_idx" ON "FGTToken"("status");

-- CreateIndex
CREATE INDEX "FGTAllocation_user_id_idx" ON "FGTAllocation"("user_id");

-- CreateIndex
CREATE INDEX "FGTAllocation_claimed_idx" ON "FGTAllocation"("claimed");

-- CreateIndex
CREATE UNIQUE INDEX "NorthStarPhoneProduct_model_name_key" ON "NorthStarPhoneProduct"("model_name");

-- CreateIndex
CREATE INDEX "NorthStarPhoneProduct_model_name_idx" ON "NorthStarPhoneProduct"("model_name");

-- AddForeignKey
ALTER TABLE "AppUsageEvent" ADD CONSTRAINT "AppUsageEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceInterest" ADD CONSTRAINT "ServiceInterest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentFund" ADD CONSTRAINT "InvestmentFund_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentRelease" ADD CONSTRAINT "InvestmentRelease_investment_fund_id_fkey" FOREIGN KEY ("investment_fund_id") REFERENCES "InvestmentFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NorthStarTokenPosition" ADD CONSTRAINT "NorthStarTokenPosition_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NorthStarPurchase" ADD CONSTRAINT "NorthStarPurchase_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "NorthStarTokenPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NorthStarTrade" ADD CONSTRAINT "NorthStarTrade_seller_position_id_fkey" FOREIGN KEY ("seller_position_id") REFERENCES "NorthStarTokenPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NorthStarTrade" ADD CONSTRAINT "NorthStarTrade_buyer_user_id_fkey" FOREIGN KEY ("buyer_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FGTAllocation" ADD CONSTRAINT "FGTAllocation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
