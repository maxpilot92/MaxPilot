/*
  Warnings:

  - You are about to drop the `_StaffTeams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StaffTeams" DROP CONSTRAINT "_StaffTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_StaffTeams" DROP CONSTRAINT "_StaffTeams_B_fkey";

-- AlterTable
ALTER TABLE "WorkDetails" ADD COLUMN     "teamId" TEXT;

-- DropTable
DROP TABLE "_StaffTeams";

-- CreateIndex
CREATE INDEX "WorkDetails_teamId_idx" ON "WorkDetails"("teamId");

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
