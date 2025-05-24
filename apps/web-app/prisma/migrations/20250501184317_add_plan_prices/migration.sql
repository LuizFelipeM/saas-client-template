/*
  Warnings:

  - You are about to drop the column `billingCycle` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `plans` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "plans_stripePriceId_key";

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "billingCycle",
DROP COLUMN "stripePriceId";

-- CreateTable
CREATE TABLE "plan_prices" (
    "id" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "plan_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_prices_stripePriceId_key" ON "plan_prices"("stripePriceId");

-- AddForeignKey
ALTER TABLE "plan_prices" ADD CONSTRAINT "plan_prices_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
