/*
  Warnings:

  - You are about to drop the column `paymentId` on the `purchases` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[purchaseId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_paymentId_fkey";

-- DropIndex
DROP INDEX "purchases_paymentId_key";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "purchaseId" TEXT;

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "paymentId",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- CreateIndex
CREATE UNIQUE INDEX "payments_purchaseId_key" ON "payments"("purchaseId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
