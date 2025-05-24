/*
  Warnings:

  - Added the required column `features` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "features" JSONB NOT NULL;
