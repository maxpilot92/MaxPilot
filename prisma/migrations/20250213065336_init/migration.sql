-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "GenderStatus" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('Carer', 'Admin', 'Coordinator', 'HR', 'OfficeSupport', 'Ops', 'Kiosk', 'Others');

-- CreateEnum
CREATE TYPE "EmploymentTypeStatus" AS ENUM ('FullTime', 'PartTime', 'Casual', 'Contractor', 'Others');

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "personalDetailsId" TEXT NOT NULL,
    "workDetailsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "language" TEXT,
    "nationality" TEXT NOT NULL,
    "gender" "GenderStatus" NOT NULL,

    CONSTRAINT "PersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkDetails" (
    "id" TEXT NOT NULL,
    "worksAt" TEXT NOT NULL,
    "hiredOn" TIMESTAMP(3) NOT NULL,
    "role" "RoleStatus" NOT NULL,
    "employmentType" "EmploymentTypeStatus" NOT NULL,

    CONSTRAINT "WorkDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "NextOfKin" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "contact" TEXT NOT NULL,

    CONSTRAINT "NextOfKin_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "_WorkDetailsTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkDetailsTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_email_key" ON "PersonalDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_phoneNumber_key" ON "PersonalDetails"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_staffId_key" ON "Compliance"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_staffId_key" ON "Settings"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_staffId_key" ON "NextOfKin"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollSettings_staffId_key" ON "PayrollSettings"("staffId");

-- CreateIndex
CREATE INDEX "_WorkDetailsTeams_B_index" ON "_WorkDetailsTeams"("B");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_workDetailsId_fkey" FOREIGN KEY ("workDetailsId") REFERENCES "WorkDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkDetailsTeams" ADD CONSTRAINT "_WorkDetailsTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkDetailsTeams" ADD CONSTRAINT "_WorkDetailsTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
