-- AlterTable
ALTER TABLE `employee` ADD COLUMN `accountNumber` VARCHAR(191) NULL,
    ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `branchName` VARCHAR(191) NULL,
    ADD COLUMN `ifscCode` VARCHAR(191) NULL,
    ADD COLUMN `qualification` VARCHAR(191) NULL;
