/*
  Warnings:

  - The values [DS] on the enum `EngineeringBranch` will be removed. If these variants are still used in the database, this will fail.
  - The values [PART_TIME,CONTRACT,FREELANCE] on the enum `JobType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cover_letter` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_date` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interview_feedback` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `joining_date` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `offer_letter` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `offered_salary` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `residency_status` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `transport_mode` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the `event_attendees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schedule_events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_name` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('TRAINING_INTERNSHIP', 'INTERNSHIP', 'FTE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('JOB_POSTED', 'JOB_UPDATED', 'JOB_DEADLINE_REMINDER', 'JOB_DEADLINE_EXTENDED', 'APPLICATION_STATUS', 'INTERVIEW_SCHEDULED', 'KYC_UPDATE', 'EVENT_REMINDER', 'PLACEMENT_UPDATE', 'SYSTEM', 'SHORTLISTED');

-- CreateEnum
CREATE TYPE "InterviewMode" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "PlacementTier" AS ENUM ('TIER_3', 'TIER_2', 'TIER_1', 'DREAM');

-- AlterEnum
BEGIN;
CREATE TYPE "EngineeringBranch_new" AS ENUM ('CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'CIVIL');
ALTER TABLE "profiles" ALTER COLUMN "branch" TYPE "EngineeringBranch_new" USING ("branch"::text::"EngineeringBranch_new");
ALTER TYPE "EngineeringBranch" RENAME TO "EngineeringBranch_old";
ALTER TYPE "EngineeringBranch_new" RENAME TO "EngineeringBranch";
DROP TYPE "public"."EngineeringBranch_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobType_new" AS ENUM ('FULL_TIME', 'INTERNSHIP', 'INTERNSHIP_PLUS_FULL_TIME');
ALTER TABLE "profiles" ALTER COLUMN "job_type" TYPE "JobType_new" USING ("job_type"::text::"JobType_new");
ALTER TABLE "jobs" ALTER COLUMN "job_type" TYPE "JobType_new" USING ("job_type"::text::"JobType_new");
ALTER TYPE "JobType" RENAME TO "JobType_old";
ALTER TYPE "JobType_new" RENAME TO "JobType";
DROP TYPE "public"."JobType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_attendees" DROP CONSTRAINT "event_attendees_user_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_events" DROP CONSTRAINT "schedule_events_createdBy_fkey";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "cover_letter",
DROP COLUMN "interview_date",
DROP COLUMN "interview_feedback",
DROP COLUMN "joining_date",
DROP COLUMN "notes",
DROP COLUMN "offer_letter",
DROP COLUMN "offered_salary",
ADD COLUMN     "is_removed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "removal_reason" TEXT,
ADD COLUMN     "removed_at" TIMESTAMP(3),
ADD COLUMN     "removed_by" TEXT;

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "company",
ADD COLUMN     "category" "JobCategory" NOT NULL DEFAULT 'FTE',
ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "is_dream_offer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tier" "PlacementTier" NOT NULL DEFAULT 'TIER_3';

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "residency_status",
DROP COLUMN "transport_mode";

-- DropTable
DROP TABLE "event_attendees";

-- DropTable
DROP TABLE "schedule_events";

-- DropEnum
DROP TYPE "AttendeeStatus";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "ResidencyStatus";

-- DropEnum
DROP TYPE "TransportMode";

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "jobId" TEXT,
    "companyId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_schedules" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "mode" "InterviewMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "job_id" TEXT,
    "qr_code" TEXT NOT NULL,
    "scanned_at" TIMESTAMP(3),
    "scanned_by" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "tier" "PlacementTier" NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "company_name" TEXT NOT NULL,
    "is_exception" BOOLEAN NOT NULL DEFAULT false,
    "exception_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_updates" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deadline_reminders" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deadline_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_schedules_jobApplicationId_key" ON "interview_schedules"("jobApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_qr_code_key" ON "attendances"("qr_code");

-- CreateIndex
CREATE INDEX "attendances_student_id_idx" ON "attendances"("student_id");

-- CreateIndex
CREATE INDEX "attendances_job_id_idx" ON "attendances"("job_id");

-- CreateIndex
CREATE INDEX "attendances_qr_code_idx" ON "attendances"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE INDEX "placements_user_id_idx" ON "placements"("user_id");

-- CreateIndex
CREATE INDEX "placements_tier_idx" ON "placements"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "placements_user_id_job_id_key" ON "placements"("user_id", "job_id");

-- CreateIndex
CREATE INDEX "job_updates_job_id_idx" ON "job_updates"("job_id");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "deadline_reminders_job_id_key" ON "deadline_reminders"("job_id");

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_job_id_idx" ON "applications"("job_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_schedules" ADD CONSTRAINT "interview_schedules_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_schedules" ADD CONSTRAINT "interview_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_schedules" ADD CONSTRAINT "interview_schedules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_updates" ADD CONSTRAINT "job_updates_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
