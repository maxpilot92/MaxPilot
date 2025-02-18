-- DropForeignKey
ALTER TABLE "_WorkDetailsTeams" DROP CONSTRAINT "_WorkDetailsTeams_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkDetailsTeams" DROP CONSTRAINT "_WorkDetailsTeams_B_fkey";

-- AddForeignKey
ALTER TABLE "_WorkDetailsTeams" ADD CONSTRAINT "_WorkDetailsTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkDetailsTeams" ADD CONSTRAINT "_WorkDetailsTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
