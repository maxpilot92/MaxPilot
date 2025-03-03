/*
  Warnings:

  - You are about to drop the column `needToKnow` on the `Heading` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Heading" DROP COLUMN "needToKnow",
ADD COLUMN     "needToKnowInfo" TEXT;
