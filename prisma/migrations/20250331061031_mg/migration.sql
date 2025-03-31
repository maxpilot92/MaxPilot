-- CreateTable
CREATE TABLE "Stripe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "stripeCurrentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stripe_pkey" PRIMARY KEY ("id")
);
