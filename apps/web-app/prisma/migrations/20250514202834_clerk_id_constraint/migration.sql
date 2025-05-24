/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_clerkUserId_key";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clerkUserId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerkId_key" ON "organizations"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
