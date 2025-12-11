/*
  Warnings:

  - You are about to drop the column `externalGameId` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `resultScore` on the `Pick` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pick" DROP COLUMN "externalGameId",
DROP COLUMN "notes",
DROP COLUMN "profit",
DROP COLUMN "resultScore",
ADD COLUMN     "eventDescription" TEXT,
ADD COLUMN     "isManual" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "league" DROP NOT NULL,
ALTER COLUMN "homeTeam" DROP NOT NULL,
ALTER COLUMN "awayTeam" DROP NOT NULL;
