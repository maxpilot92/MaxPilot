/*
  Warnings:

  - You are about to drop the column `staffId` on the `Heading` table. All the data in the column will be lost.
  - You are about to drop the column `headingId` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `adminId` to the `Heading` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_headingId_fkey";

-- AlterTable
ALTER TABLE "Heading" DROP COLUMN "staffId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "headingId";
