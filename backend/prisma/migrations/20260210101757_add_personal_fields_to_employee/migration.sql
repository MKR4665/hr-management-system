-- AlterTable
ALTER TABLE `employee` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `alternativePhone` VARCHAR(191) NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL;
