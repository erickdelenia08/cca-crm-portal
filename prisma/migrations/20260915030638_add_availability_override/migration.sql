-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `availabilityOverrideId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `availability_overrides` (
    `id` VARCHAR(191) NOT NULL,
    `consultantId` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `availability_overrides_consultantId_idx`(`consultantId`),
    INDEX `availability_overrides_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `availability_overrides` ADD CONSTRAINT `availability_overrides_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `consultant_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_availabilityOverrideId_fkey` FOREIGN KEY (`availabilityOverrideId`) REFERENCES `availability_overrides`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
