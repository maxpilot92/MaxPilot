-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "GenderStatus" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('Carer', 'Admin', 'Coordinator', 'HR', 'OfficeSupport', 'Ops', 'Kiosk', 'Others');

-- CreateEnum
CREATE TYPE "EmploymentTypeStatus" AS ENUM ('FullTime', 'PartTime', 'Casual', 'Contractor', 'Others');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorced', 'Widowed', 'Separated');

-- CreateTable
CREATE TABLE "NextOfKin" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "NextOfKin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "personalDetailsId" TEXT NOT NULL,
    "workDetailsId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicInformationId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkDetails" (
    "id" TEXT NOT NULL,
    "worksAt" TEXT NOT NULL,
    "hiredOn" TIMESTAMP(3) NOT NULL,
    "role" "RoleStatus" NOT NULL,
    "employmentType" "EmploymentTypeStatus" NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "WorkDetails_pkey" PRIMARY KEY ("id")
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
    "nationality" TEXT,
    "religion" TEXT,
    "gender" "GenderStatus",
    "unit" TEXT,
    "maritalStatus" "MaritalStatus",

    CONSTRAINT "PersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicInformation" (
    "id" TEXT NOT NULL,
    "generalInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "needToKnowInfo" TEXT NOT NULL,
    "usefulInfo" TEXT NOT NULL,

    CONSTRAINT "PublicInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_staffId_key" ON "NextOfKin"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_email_key" ON "NextOfKin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicInformationId_key" ON "User"("publicInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "WorkDetails_teamId_idx" ON "WorkDetails"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_email_key" ON "PersonalDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_phoneNumber_key" ON "PersonalDetails"("phoneNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workDetailsId_fkey" FOREIGN KEY ("workDetailsId") REFERENCES "WorkDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_publicInformationId_fkey" FOREIGN KEY ("publicInformationId") REFERENCES "PublicInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
