/*
  Warnings:

  - You are about to drop the `plan_prices` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeProductId]` on the table `plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeProductId` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "plan_prices" DROP CONSTRAINT "plan_prices_planId_fkey";

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "stripeProductId" TEXT NOT NULL;

-- DropTable
DROP TABLE "plan_prices";

-- DropEnum
DROP TYPE "BillingCycle";

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripeProductId_key" ON "plans"("stripeProductId");
