/*
  Warnings:

  - You are about to drop the column `qualification` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `qualification`,
    ADD COLUMN `qualifications` JSON NULL;
