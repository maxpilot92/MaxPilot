/*
  Warnings:

  - Added the required column `role` to the `Documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "role" "RoleStatus" NOT NULL;
