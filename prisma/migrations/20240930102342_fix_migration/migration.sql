-- AlterEnum
ALTER TYPE "SALON_STATE" ADD VALUE 'PENDING_APPROVAL';

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SalonHistory" (
    "id" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalonHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SalonHistory" ADD CONSTRAINT "SalonHistory_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
