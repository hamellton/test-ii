-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "PublicTicket" ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'PENDING';
