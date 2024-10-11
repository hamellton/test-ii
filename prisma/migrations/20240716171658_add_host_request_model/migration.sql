/*
  Warnings:

  - The values [PENDING_APPROVAL,PUBLISHED] on the enum `SALON_STATE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `city` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `checkoutSessionId` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `salonId` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `zoomStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToSalon` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Salon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `Salon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationType` to the `Salon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostId` to the `Tip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `Tip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentId` to the `Tip` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `Tip` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SALON_TYPE" AS ENUM ('SALON', 'SUPER_SALON', 'SERIES_EPISODE');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('SCIENCE', 'TECH', 'LEGACY');

-- CreateEnum
CREATE TYPE "LOCATION_TYPE" AS ENUM ('IRL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('CREATED', 'PENDING', 'FAILED', 'PAID');

-- CreateEnum
CREATE TYPE "SERIES_STATE" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED');

-- AlterEnum
BEGIN;
CREATE TYPE "SALON_STATE_new" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED');
ALTER TABLE "Salon" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Salon" ALTER COLUMN "state" TYPE "SALON_STATE_new" USING ("state"::text::"SALON_STATE_new");
ALTER TYPE "SALON_STATE" RENAME TO "SALON_STATE_old";
ALTER TYPE "SALON_STATE_new" RENAME TO "SALON_STATE";
DROP TYPE "SALON_STATE_old";
ALTER TABLE "Salon" ALTER COLUMN "state" SET DEFAULT 'DRAFT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Salon" DROP CONSTRAINT "Salon_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Tip" DROP CONSTRAINT "Tip_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSalon" DROP CONSTRAINT "_CategoryToSalon_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSalon" DROP CONSTRAINT "_CategoryToSalon_B_fkey";

-- DropIndex
DROP INDEX "Tip_checkoutSessionId_key";

-- AlterTable
ALTER TABLE "Salon" DROP COLUMN "city",
DROP COLUMN "url",
DROP COLUMN "userId",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "category" "CATEGORY" NOT NULL,
ADD COLUMN     "hostId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "legacyHost" TEXT DEFAULT '',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "locationType" "LOCATION_TYPE" NOT NULL,
ADD COLUMN     "locationUrl" TEXT,
ADD COLUMN     "recordEvent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seriesId" TEXT,
ADD COLUMN     "type" "SALON_TYPE" NOT NULL DEFAULT 'SALON',
ADD COLUMN     "zoomJoinUrl" TEXT,
ADD COLUMN     "zoomStartUrl" TEXT;

-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "checkoutSessionId",
DROP COLUMN "created_at",
DROP COLUMN "message",
DROP COLUMN "paymentStatus",
DROP COLUMN "receiverId",
DROP COLUMN "salonId",
DROP COLUMN "senderId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hostId" TEXT NOT NULL,
ADD COLUMN     "senderEmail" TEXT NOT NULL,
ADD COLUMN     "stripePaymentId" TEXT NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "zoomStatus",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "fullname" TEXT,
ADD COLUMN     "instaLink" TEXT,
ADD COLUMN     "lastMemberTicket" TIMESTAMP(3),
ADD COLUMN     "profileImageUrl" TEXT,
ADD COLUMN     "quote" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "substackLink" TEXT,
ADD COLUMN     "webLink" TEXT,
ADD COLUMN     "xLink" TEXT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "_CategoryToSalon";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "zoomStatus";

-- CreateTable
CREATE TABLE "LegacyHost" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "profileImageUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "LegacyHost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "slug" TEXT,
    "state" "SERIES_STATE" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicTicket" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberTicket" (
    "id" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoHostSalons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SalonTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SeriesTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_label_key" ON "Tag"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Series_title_key" ON "Series"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CoHostSalons_AB_unique" ON "_CoHostSalons"("A", "B");

-- CreateIndex
CREATE INDEX "_CoHostSalons_B_index" ON "_CoHostSalons"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SalonTags_AB_unique" ON "_SalonTags"("A", "B");

-- CreateIndex
CREATE INDEX "_SalonTags_B_index" ON "_SalonTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SeriesTags_AB_unique" ON "_SeriesTags"("A", "B");

-- CreateIndex
CREATE INDEX "_SeriesTags_B_index" ON "_SeriesTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicTicket" ADD CONSTRAINT "PublicTicket_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTicket" ADD CONSTRAINT "MemberTicket_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberTicket" ADD CONSTRAINT "MemberTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoHostSalons" ADD CONSTRAINT "_CoHostSalons_A_fkey" FOREIGN KEY ("A") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoHostSalons" ADD CONSTRAINT "_CoHostSalons_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SalonTags" ADD CONSTRAINT "_SalonTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SalonTags" ADD CONSTRAINT "_SalonTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesTags" ADD CONSTRAINT "_SeriesTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesTags" ADD CONSTRAINT "_SeriesTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
