-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "starts" TEXT,
    "expires" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fund" ADD CONSTRAINT "Fund_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
