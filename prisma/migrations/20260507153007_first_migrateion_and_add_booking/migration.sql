-- CreateEnum
CREATE TYPE "BOOKING_STATUS" AS ENUM ('CONFIRMED', 'ATTENDED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "event_seat_config" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "venue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_seat_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "seatConfigId" TEXT NOT NULL,
    "seatCount" INTEGER NOT NULL DEFAULT 1,
    "bookingCode" TEXT NOT NULL,
    "status" "BOOKING_STATUS" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_seat_config_ideaId_key" ON "event_seat_config"("ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_bookingCode_key" ON "booking"("bookingCode");

-- CreateIndex
CREATE INDEX "booking_userId_idx" ON "booking"("userId");

-- CreateIndex
CREATE INDEX "booking_ideaId_idx" ON "booking"("ideaId");

-- AddForeignKey
ALTER TABLE "event_seat_config" ADD CONSTRAINT "event_seat_config_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_seatConfigId_fkey" FOREIGN KEY ("seatConfigId") REFERENCES "event_seat_config"("id") ON DELETE CASCADE ON UPDATE CASCADE;
