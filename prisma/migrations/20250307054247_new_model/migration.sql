/*
  Warnings:

  - You are about to drop the column `additionalCost` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `breakTime` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `confirmationRequired` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `declineAccepted` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `dropOffAddress` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `ignoreStaffCount` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `notifyCarer` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `repeat` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the `Instruction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Instruction" DROP CONSTRAINT "Instruction_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_shiftId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "additionalCost",
DROP COLUMN "breakTime",
DROP COLUMN "confirmationRequired",
DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "declineAccepted",
DROP COLUMN "dropOffAddress",
DROP COLUMN "endTime",
DROP COLUMN "ignoreStaffCount",
DROP COLUMN "mileage",
DROP COLUMN "notifyCarer",
DROP COLUMN "repeat",
DROP COLUMN "startTime",
DROP COLUMN "unit",
DROP COLUMN "updatedAt",
ADD COLUMN     "funds" TEXT,
ADD COLUMN     "paygroup" TEXT,
ADD COLUMN     "priceBook" TEXT;

-- DropTable
DROP TABLE "Instruction";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Task";
