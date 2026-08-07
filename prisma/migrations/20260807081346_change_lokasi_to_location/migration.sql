/*
  Warnings:

  - You are about to drop the column `lokasi` on the `devices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "devices" DROP COLUMN "lokasi",
ADD COLUMN     "location" VARCHAR(100);
