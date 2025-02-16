/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `NextOfKin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `NextOfKin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NextOfKin" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_email_key" ON "NextOfKin"("email");
