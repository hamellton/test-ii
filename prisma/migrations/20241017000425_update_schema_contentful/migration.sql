-- CreateTable
CREATE TABLE "HomePage" (
    "id" SERIAL NOT NULL,
    "heroSectionId" INTEGER,
    "partnersSectionId" INTEGER,
    "aboutUsSectionId" INTEGER,
    "joinCommunitySectionId" INTEGER,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContenfulButton" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "heroSectionId" INTEGER,
    "joinCommunitySectionId" INTEGER,

    CONSTRAINT "ContenfulButton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnersSection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "PartnersSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsSection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "aboutUsImgUrl" TEXT NOT NULL,

    CONSTRAINT "AboutUsSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinCommunitySection" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,

    CONSTRAINT "JoinCommunitySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MostOfInterintellectCard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "buttonTitle" TEXT NOT NULL,
    "buttonUrl" TEXT NOT NULL,
    "cardImg" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "homePageId" INTEGER NOT NULL,

    CONSTRAINT "MostOfInterintellectCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "homePageId" INTEGER NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "homePageId" INTEGER NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "annualPrice" DOUBLE PRECISION NOT NULL,
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "perks" TEXT[],
    "buttonText" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "homePageId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_heroSectionId_key" ON "HomePage"("heroSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_partnersSectionId_key" ON "HomePage"("partnersSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_aboutUsSectionId_key" ON "HomePage"("aboutUsSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_joinCommunitySectionId_key" ON "HomePage"("joinCommunitySectionId");

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_heroSectionId_fkey" FOREIGN KEY ("heroSectionId") REFERENCES "HeroSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_partnersSectionId_fkey" FOREIGN KEY ("partnersSectionId") REFERENCES "PartnersSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_aboutUsSectionId_fkey" FOREIGN KEY ("aboutUsSectionId") REFERENCES "AboutUsSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePage" ADD CONSTRAINT "HomePage_joinCommunitySectionId_fkey" FOREIGN KEY ("joinCommunitySectionId") REFERENCES "JoinCommunitySection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenfulButton" ADD CONSTRAINT "ContenfulButton_heroSectionId_fkey" FOREIGN KEY ("heroSectionId") REFERENCES "HeroSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContenfulButton" ADD CONSTRAINT "ContenfulButton_joinCommunitySectionId_fkey" FOREIGN KEY ("joinCommunitySectionId") REFERENCES "JoinCommunitySection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MostOfInterintellectCard" ADD CONSTRAINT "MostOfInterintellectCard_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
