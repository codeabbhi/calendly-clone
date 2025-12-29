/*
  Warnings:

  - Added the required column `mentorId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_userId_startTime_endTime_status_idx";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "additionalGuests" TEXT,
ADD COLUMN     "attendeeCompany" TEXT,
ADD COLUMN     "attendeePhone" TEXT,
ADD COLUMN     "meetingLocation" TEXT,
ADD COLUMN     "meetingTitle" TEXT,
ADD COLUMN     "meetingType" TEXT NOT NULL DEFAULT 'video',
ADD COLUMN     "mentorId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT;

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_mentorId_startTime_endTime_status_idx" ON "Booking"("userId", "mentorId", "startTime", "endTime", "status");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
