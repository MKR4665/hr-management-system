-- AlterTable
ALTER TABLE `document` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'GENERATED',
    ADD COLUMN `rejectionReason` TEXT NULL,
    MODIFY `fileUrl` TEXT NULL;
