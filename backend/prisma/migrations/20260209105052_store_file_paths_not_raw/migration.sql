/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `profilePicture`,
    ADD COLUMN `educationCertPath` TEXT NULL,
    ADD COLUMN `experienceCertPath` TEXT NULL,
    ADD COLUMN `idProofPath` TEXT NULL,
    ADD COLUMN `profilePicturePath` TEXT NULL;
