-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED');

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    "address" VARCHAR(255),
    "state" VARCHAR(100),
    "city" VARCHAR(100),
    "church" VARCHAR(200),
    "phone" VARCHAR(20),
    "notes" TEXT,
    "status" "GuestStatus" NOT NULL DEFAULT 'PENDING',
    "isPastor" BOOLEAN NOT NULL DEFAULT false,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_history" (
    "id" SERIAL NOT NULL,
    "guestId" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "field" VARCHAR(50),
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedBy" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guests_status_idx" ON "guests"("status");

-- CreateIndex
CREATE INDEX "guests_church_idx" ON "guests"("church");

-- CreateIndex
CREATE INDEX "guests_city_idx" ON "guests"("city");

-- CreateIndex
CREATE INDEX "guests_isPastor_idx" ON "guests"("isPastor");

-- CreateIndex
CREATE INDEX "guests_firstName_lastName_idx" ON "guests"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "guests_deletedAt_idx" ON "guests"("deletedAt");

-- CreateIndex
CREATE INDEX "guest_history_guestId_idx" ON "guest_history"("guestId");

-- CreateIndex
CREATE INDEX "guest_history_createdAt_idx" ON "guest_history"("createdAt");

-- AddForeignKey
ALTER TABLE "guest_history" ADD CONSTRAINT "guest_history_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
