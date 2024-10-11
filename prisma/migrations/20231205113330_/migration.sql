/*
  Warnings:

  - The values [CANCELED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'CANCELLED', 'FAILED', 'SUCCEEDED');
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Tip" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
COMMIT;
