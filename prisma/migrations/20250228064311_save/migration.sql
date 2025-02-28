/*
  Warnings:

  - You are about to drop the column `publicInformationId` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffId]` on the table `PublicInformation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `staffId` to the `PublicInformation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_publicInformationId_fkey";

-- DropIndex
DROP INDEX "Staff_publicInformationId_key";

-- AlterTable
ALTER TABLE "PublicInformation" ADD COLUMN     "staffId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "publicInformationId";

-- CreateIndex
CREATE UNIQUE INDEX "PublicInformation_staffId_key" ON "PublicInformation"("staffId");

-- AddForeignKey
ALTER TABLE "PublicInformation" ADD CONSTRAINT "PublicInformation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
