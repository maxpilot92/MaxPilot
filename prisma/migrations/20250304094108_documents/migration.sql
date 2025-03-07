/*
  Warnings:

  - You are about to drop the column `noExpirationo` on the `Documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Documents" DROP COLUMN "noExpirationo",
ADD COLUMN     "noExpiration" BOOLEAN DEFAULT false;
