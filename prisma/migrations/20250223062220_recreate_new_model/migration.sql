/*
  Warnings:

  - You are about to drop the `Compliance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayrollSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorced', 'Widowed', 'Separated');

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_personalDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_workDetailsId_fkey";

-- AlterTable
ALTER TABLE "PersonalDetails" ADD COLUMN     "maritalStatus" "MaritalStatus",
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "unit" TEXT;

-- DropTable
DROP TABLE "Compliance";

-- DropTable
DROP TABLE "PayrollSettings";

-- DropTable
DROP TABLE "Settings";

-- DropTable
DROP TABLE "Staff";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "personalDetailsId" TEXT NOT NULL,
    "workDetailsId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicInformation" (
    "id" TEXT NOT NULL,
    "generalInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "needToKnowInfo" TEXT NOT NULL,
    "usefulInfo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PublicInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicInformation_userId_key" ON "PublicInformation"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workDetailsId_fkey" FOREIGN KEY ("workDetailsId") REFERENCES "WorkDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicInformation" ADD CONSTRAINT "PublicInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
