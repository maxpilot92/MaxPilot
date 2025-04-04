/*
  Warnings:

  - Added the required column `companyId` to the `Heading` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heading" ADD COLUMN     "companyId" TEXT NOT NULL;
