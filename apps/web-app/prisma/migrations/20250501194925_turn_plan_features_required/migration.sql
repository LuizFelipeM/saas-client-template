/*
  Warnings:

  - Made the column `features` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "features" SET NOT NULL;
