-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "category" TEXT,
    "expires" TIMESTAMP(3),
    "staffVisibility" BOOLEAN DEFAULT false,
    "noExpirationo" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);
