/*
  Warnings:

  - You are about to drop the `_WorkDetailsTeams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_WorkDetailsTeams" DROP CONSTRAINT "_WorkDetailsTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkDetailsTeams" DROP CONSTRAINT "_WorkDetailsTeams_B_fkey";

-- DropTable
DROP TABLE "_WorkDetailsTeams";

-- CreateTable
CREATE TABLE "_StaffTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StaffTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StaffTeams_B_index" ON "_StaffTeams"("B");

-- AddForeignKey
ALTER TABLE "_StaffTeams" ADD CONSTRAINT "_StaffTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StaffTeams" ADD CONSTRAINT "_StaffTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
