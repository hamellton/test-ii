/*
  Warnings:

  - A unique constraint covering the columns `[contentPageListId]` on the table `HomePage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `HomePage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "HomePage" DROP CONSTRAINT "HomePage_aboutUsSectionId_fkey";

-- DropForeignKey
ALTER TABLE "HomePage" DROP CONSTRAINT "HomePage_heroSectionId_fkey";

-- DropForeignKey
ALTER TABLE "HomePage" DROP CONSTRAINT "HomePage_joinCommunitySectionId_fkey";

-- DropForeignKey
ALTER TABLE "HomePage" DROP CONSTRAINT "HomePage_partnersSectionId_fkey";

-- AlterTable
ALTER TABLE "HomePage" ADD COLUMN     "contentPageListId" INTEGER;

-- CreateTable
CREATE TABLE "ContentPageList" (
    "id" SERIAL NOT NULL,
    "homePageId" INTEGER,

    CONSTRAINT "ContentPageList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentPageList_homePageId_key" ON "ContentPageList"("homePageId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_contentPageListId_key" ON "HomePage"("contentPageListId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_id_key" ON "HomePage"("id");

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_heroSectionId_fkey" FOREIGN KEY ("heroSectionId") REFERENCES "HeroSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_partnersSectionId_fkey" FOREIGN KEY ("partnersSectionId") REFERENCES "PartnersSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_aboutUsSectionId_fkey" FOREIGN KEY ("aboutUsSectionId") REFERENCES "AboutUsSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_joinCommunitySectionId_fkey" FOREIGN KEY ("joinCommunitySectionId") REFERENCES "JoinCommunitySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPageList" ADD CONSTRAINT "ContentPageList_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
