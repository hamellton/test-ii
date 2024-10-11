-- CreateTable
CREATE TABLE "SpecialGuest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,

    CONSTRAINT "SpecialGuest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpecialGuest" ADD CONSTRAINT "SpecialGuest_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
