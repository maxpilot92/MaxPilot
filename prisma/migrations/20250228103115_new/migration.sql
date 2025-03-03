-- CreateTable
CREATE TABLE "Heading" (
    "id" TEXT NOT NULL,
    "needToKnow" TEXT,
    "usefulInfo" TEXT,
    "needToKnowMandatory" BOOLEAN,
    "usefulInfoMandatory" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mandatory" BOOLEAN,
    "staffId" TEXT NOT NULL,

    CONSTRAINT "Heading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Heading_staffId_key" ON "Heading"("staffId");

-- AddForeignKey
ALTER TABLE "Heading" ADD CONSTRAINT "Heading_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
