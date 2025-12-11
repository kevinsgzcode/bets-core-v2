/*
  Warnings:

  - The `sport` column on the `Pick` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pick" DROP COLUMN "sport",
ADD COLUMN     "sport" TEXT NOT NULL DEFAULT 'NFL';
