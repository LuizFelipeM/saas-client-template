/*
  Warnings:

  - Added the required column `key` to the `addons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `subscription_addons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addons" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscription_addons" ADD COLUMN     "key" TEXT NOT NULL;
