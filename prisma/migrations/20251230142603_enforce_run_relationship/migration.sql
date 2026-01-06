/*
  Warnings:

  - Made the column `runId` on table `Pick` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pick" ALTER COLUMN "runId" SET NOT NULL;
