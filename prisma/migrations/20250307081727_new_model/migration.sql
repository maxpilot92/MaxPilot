-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "address" TEXT,
ADD COLUMN     "data" TEXT,
ADD COLUMN     "date" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "repeat" BOOLEAN,
ADD COLUMN     "shiftFinishesNextDay" BOOLEAN,
ADD COLUMN     "startTime" TEXT,
ADD COLUMN     "unitNumber" TEXT;
