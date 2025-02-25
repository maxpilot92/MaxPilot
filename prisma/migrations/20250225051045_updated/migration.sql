/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personalDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_publicInformationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_workDetailsId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PayrollSettings" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "taxCode" TEXT NOT NULL,

    CONSTRAINT "PayrollSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compliance" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "theme" TEXT NOT NULL DEFAULT 'light',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "subRoles" TEXT DEFAULT 'carer',
    "personalDetailsId" TEXT NOT NULL,
    "workDetailsId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicInformationId" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PayrollSettings_staffId_key" ON "PayrollSettings"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_staffId_key" ON "Compliance"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_staffId_key" ON "Settings"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_publicInformationId_key" ON "Staff"("publicInformationId");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_workDetailsId_fkey" FOREIGN KEY ("workDetailsId") REFERENCES "WorkDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_publicInformationId_fkey" FOREIGN KEY ("publicInformationId") REFERENCES "PublicInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
