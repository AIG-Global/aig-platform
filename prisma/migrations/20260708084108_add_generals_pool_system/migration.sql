-- CreateEnum
CREATE TYPE "GeneralStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING_CONTRACT', 'CONTRACT_SIGNED', 'ACTIVE', 'REVOKE_REQUESTED', 'REVOKED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_GIVER_SIGNATURE', 'PENDING_RECEIVER_SIGNATURE', 'FULLY_SIGNED', 'CANCELLED', 'VOIDED');

-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('PENDING', 'DISTRIBUTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "geo_city" TEXT,
ADD COLUMN     "geo_country" TEXT,
ADD COLUMN     "geo_lat" DOUBLE PRECISION,
ADD COLUMN     "geo_lng" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "General" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "appointed_by_id" TEXT,
    "allocated_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distributed_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "string_root_id" TEXT,
    "status" "GeneralStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "General_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralAppointment" (
    "id" TEXT NOT NULL,
    "giver_general_id" TEXT NOT NULL,
    "giver_user_id" TEXT NOT NULL,
    "receiver_user_id" TEXT NOT NULL,
    "receiver_general_id" TEXT,
    "percent_given" DOUBLE PRECISION NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING_CONTRACT',
    "revoke_requested_at" TIMESTAMP(3),
    "revoke_approved_at" TIMESTAMP(3),
    "revoke_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralContract" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "document_url" TEXT,
    "document_hash" TEXT,
    "secure_sign_ref" TEXT,
    "giver_signed_at" TIMESTAMP(3),
    "receiver_signed_at" TIMESTAMP(3),
    "admin_reviewed_at" TIMESTAMP(3),
    "admin_reviewer_id" TEXT,
    "percent_given" DOUBLE PRECISION NOT NULL,
    "terms_snapshot" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolTransaction" (
    "id" TEXT NOT NULL,
    "source_type" "CommissionSource" NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_description" TEXT,
    "total_amount_eur" BIGINT NOT NULL,
    "pool_amount_eur" BIGINT NOT NULL,
    "period_month" INTEGER NOT NULL,
    "period_year" INTEGER NOT NULL,
    "status" "PoolStatus" NOT NULL DEFAULT 'PENDING',
    "distributed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolEarning" (
    "id" TEXT NOT NULL,
    "general_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "effective_percent" DOUBLE PRECISION NOT NULL,
    "amount_eur" BIGINT NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolEarning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "General_user_id_key" ON "General"("user_id");

-- CreateIndex
CREATE INDEX "General_user_id_idx" ON "General"("user_id");

-- CreateIndex
CREATE INDEX "General_appointed_by_id_idx" ON "General"("appointed_by_id");

-- CreateIndex
CREATE INDEX "General_string_root_id_idx" ON "General"("string_root_id");

-- CreateIndex
CREATE INDEX "GeneralAppointment_giver_general_id_idx" ON "GeneralAppointment"("giver_general_id");

-- CreateIndex
CREATE INDEX "GeneralAppointment_receiver_user_id_idx" ON "GeneralAppointment"("receiver_user_id");

-- CreateIndex
CREATE INDEX "GeneralAppointment_status_idx" ON "GeneralAppointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralContract_appointment_id_key" ON "GeneralContract"("appointment_id");

-- CreateIndex
CREATE INDEX "GeneralContract_appointment_id_idx" ON "GeneralContract"("appointment_id");

-- CreateIndex
CREATE INDEX "GeneralContract_status_idx" ON "GeneralContract"("status");

-- CreateIndex
CREATE INDEX "PoolTransaction_source_type_source_id_idx" ON "PoolTransaction"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "PoolTransaction_period_year_period_month_idx" ON "PoolTransaction"("period_year", "period_month");

-- CreateIndex
CREATE INDEX "PoolTransaction_status_idx" ON "PoolTransaction"("status");

-- CreateIndex
CREATE INDEX "PoolEarning_general_id_idx" ON "PoolEarning"("general_id");

-- CreateIndex
CREATE INDEX "PoolEarning_transaction_id_idx" ON "PoolEarning"("transaction_id");

-- CreateIndex
CREATE INDEX "PoolEarning_status_idx" ON "PoolEarning"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PoolEarning_general_id_transaction_id_key" ON "PoolEarning"("general_id", "transaction_id");

-- AddForeignKey
ALTER TABLE "General" ADD CONSTRAINT "General_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General" ADD CONSTRAINT "General_appointed_by_id_fkey" FOREIGN KEY ("appointed_by_id") REFERENCES "General"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "General" ADD CONSTRAINT "General_string_root_id_fkey" FOREIGN KEY ("string_root_id") REFERENCES "General"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralAppointment" ADD CONSTRAINT "GeneralAppointment_giver_general_id_fkey" FOREIGN KEY ("giver_general_id") REFERENCES "General"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralAppointment" ADD CONSTRAINT "GeneralAppointment_giver_user_id_fkey" FOREIGN KEY ("giver_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralAppointment" ADD CONSTRAINT "GeneralAppointment_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralAppointment" ADD CONSTRAINT "GeneralAppointment_receiver_general_id_fkey" FOREIGN KEY ("receiver_general_id") REFERENCES "General"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralContract" ADD CONSTRAINT "GeneralContract_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "GeneralAppointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolEarning" ADD CONSTRAINT "PoolEarning_general_id_fkey" FOREIGN KEY ("general_id") REFERENCES "General"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoolEarning" ADD CONSTRAINT "PoolEarning_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "PoolTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
