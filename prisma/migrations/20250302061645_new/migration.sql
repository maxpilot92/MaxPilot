-- DropForeignKey
ALTER TABLE "Heading" DROP CONSTRAINT "Heading_staffId_fkey";

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "headingId" TEXT;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_headingId_fkey" FOREIGN KEY ("headingId") REFERENCES "Heading"("id") ON DELETE SET NULL ON UPDATE CASCADE;
