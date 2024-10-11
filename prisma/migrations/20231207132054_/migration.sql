/*
  Warnings:

  - The values [CANCELLED,SUCCEEDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paymentIntentId` on the `Tip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checkoutSessionId]` on the table `Tip` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('CREATED', 'PENDING', 'FAILED', 'PAID');
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "paymentIntentId",
ADD COLUMN     "checkoutSessionId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "paymentStatus" SET DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tip_checkoutSessionId_key" ON "Tip"("checkoutSessionId");
