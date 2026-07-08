-- CreateEnum PackageType  
CREATE TYPE "PackageType" AS ENUM ('STARTER', 'STARTUP', 'PROFESSIONAL');

-- CreateEnum GiftCardStatus
CREATE TYPE "GiftCardStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- Drop old table and recreate with proper types
DROP TABLE IF EXISTS "GiftCard";

-- CreateTable GiftCard with proper enum types
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "valueEur" INTEGER NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimedBy" TEXT,
    "claimedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_code_key" ON "GiftCard"("code");

-- CreateIndex
CREATE INDEX "GiftCard_packageType_idx" ON "GiftCard"("packageType");

-- CreateIndex
CREATE INDEX "GiftCard_status_idx" ON "GiftCard"("status");

-- CreateIndex
CREATE INDEX "GiftCard_claimedBy_idx" ON "GiftCard"("claimedBy");

-- AddForeignKey
ALTER TABLE "GiftCard" ADD CONSTRAINT "GiftCard_claimedBy_fkey" FOREIGN KEY ("claimedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
