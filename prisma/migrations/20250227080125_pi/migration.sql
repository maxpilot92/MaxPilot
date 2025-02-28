/*
  Warnings:

  - You are about to drop the column `needToKnowSetting` on the `PublicInformation` table. All the data in the column will be lost.
  - You are about to drop the column `usefulSetting` on the `PublicInformation` table. All the data in the column will be lost.
  - The `needToKnowInfo` column on the `PublicInformation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `usefulInfo` column on the `PublicInformation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PublicInformation" DROP COLUMN "needToKnowSetting",
DROP COLUMN "usefulSetting",
DROP COLUMN "needToKnowInfo",
ADD COLUMN     "needToKnowInfo" JSONB,
DROP COLUMN "usefulInfo",
ADD COLUMN     "usefulInfo" JSONB;
