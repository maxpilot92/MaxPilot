/*
  Warnings:

  - You are about to drop the column `paygroup` on the `Shift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "paygroup",
ADD COLUMN     "payGroup" TEXT;
