/*
  Warnings:

  - You are about to drop the column `email` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `Tip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "email",
DROP COLUMN "stripePaymentIntentId",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "paymentIntentId" TEXT,
ALTER COLUMN "amount" DROP NOT NULL;
