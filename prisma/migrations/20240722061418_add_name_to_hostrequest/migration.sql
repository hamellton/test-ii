/*
  Warnings:

  - Added the required column `name` to the `HostRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HostRequest" ADD COLUMN     "name" TEXT NOT NULL;
