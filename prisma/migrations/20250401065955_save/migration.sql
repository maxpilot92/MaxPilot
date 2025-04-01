-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "GenderStatus" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('Carer', 'Admin', 'Coordinator', 'HR', 'OfficeSupport', 'Ops', 'Kiosk', 'Others');

-- CreateEnum
CREATE TYPE "EmploymentTypeStatus" AS ENUM ('FullTime', 'PartTime', 'Casual', 'Contractor', 'Others');

-- CreateEnum
CREATE TYPE "SubscriptionPeriod" AS ENUM ('Monthly', 'Annually', 'Free_Trail');

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
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "subRoles" TEXT,
    "personalDetailsId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "workDetailsId" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionEnd" TIMESTAMP(3) NOT NULL,
    "subscriptionPeriod" "SubscriptionPeriod" NOT NULL DEFAULT 'Free_Trail',

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
    "worksAt" TEXT,
    "hiredOn" TIMESTAMP(3),
    "role" "RoleStatus" NOT NULL,
    "employmentType" "EmploymentTypeStatus",
    "teamId" TEXT,

    CONSTRAINT "WorkDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalDetails" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "emergencyContact" TEXT,
    "language" TEXT,
    "nationality" TEXT,
    "religion" TEXT,
    "gender" "GenderStatus",
    "unit" TEXT,
    "maritalStatus" "MaritalStatus",
    "clientStatus" TEXT,

    CONSTRAINT "PersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicInformation" (
    "id" TEXT NOT NULL,
    "generalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "needToKnowInfo" JSONB,
    "usefulInfo" JSONB,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "PublicInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Heading" (
    "id" TEXT NOT NULL,
    "needToKnowInfo" TEXT,
    "usefulInfo" TEXT,
    "needToKnowMandatory" BOOLEAN,
    "usefulInfoMandatory" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Heading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "carerId" TEXT,
    "payGroup" TEXT,
    "priceBook" TEXT,
    "funds" TEXT,
    "shiftType" TEXT,
    "additionalShiftType" TEXT,
    "allowance" TEXT,
    "data" TEXT,
    "shiftFinishesNextDay" BOOLEAN,
    "startTime" TEXT,
    "endTime" TEXT,
    "date" TEXT,
    "repeat" BOOLEAN,
    "address" TEXT,
    "unitNumber" TEXT,
    "instructions" TEXT,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "category" TEXT,
    "expires" TEXT,
    "staffVisibility" BOOLEAN DEFAULT false,
    "noExpiration" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "starts" TEXT,
    "expires" TEXT,
    "amount" DOUBLE PRECISION,
    "balance" DOUBLE PRECISION,
    "clientId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled',
    "documentType" TEXT NOT NULL DEFAULT 'Template',
    "type" TEXT NOT NULL DEFAULT 'General',
    "sentDate" TIMESTAMP(3),
    "responses" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "action" TEXT,
    "form" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stripe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeCurrentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stripe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_staffId_key" ON "NextOfKin"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_email_key" ON "NextOfKin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollSettings_staffId_key" ON "PayrollSettings"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Compliance_staffId_key" ON "Compliance"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_staffId_key" ON "Settings"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "WorkDetails_teamId_idx" ON "WorkDetails"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_email_key" ON "PersonalDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_phoneNumber_key" ON "PersonalDetails"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PublicInformation_staffId_key" ON "PublicInformation"("staffId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personalDetailsId_fkey" FOREIGN KEY ("personalDetailsId") REFERENCES "PersonalDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workDetailsId_fkey" FOREIGN KEY ("workDetailsId") REFERENCES "WorkDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkDetails" ADD CONSTRAINT "WorkDetails_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicInformation" ADD CONSTRAINT "PublicInformation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_carerId_fkey" FOREIGN KEY ("carerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fund" ADD CONSTRAINT "Fund_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
