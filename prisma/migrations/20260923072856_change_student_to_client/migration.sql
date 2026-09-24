/*
  Warnings:

  - You are about to drop the `student_consultant_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_consultant_handovers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `student_consultant_assignments` DROP FOREIGN KEY `student_consultant_assignments_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `student_consultant_assignments` DROP FOREIGN KEY `student_consultant_assignments_consultantId_fkey`;

-- DropForeignKey
ALTER TABLE `student_consultant_handovers` DROP FOREIGN KEY `student_consultant_handovers_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `student_consultant_handovers` DROP FOREIGN KEY `student_consultant_handovers_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `student_consultant_handovers` DROP FOREIGN KEY `student_consultant_handovers_fromConsultantId_fkey`;

-- DropForeignKey
ALTER TABLE `student_consultant_handovers` DROP FOREIGN KEY `student_consultant_handovers_toConsultantId_fkey`;

-- DropTable
DROP TABLE `student_consultant_assignments`;

-- DropTable
DROP TABLE `student_consultant_handovers`;

-- CreateTable
CREATE TABLE `client_consultant_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `consultantId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isTemporary` BOOLEAN NOT NULL DEFAULT false,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `client_consultant_assignments_clientId_idx`(`clientId`),
    INDEX `client_consultant_assignments_consultantId_idx`(`consultantId`),
    INDEX `client_consultant_assignments_startDate_idx`(`startDate`),
    INDEX `client_consultant_assignments_endDate_idx`(`endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `client_consultant_handovers` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `fromConsultantId` VARCHAR(191) NULL,
    `toConsultantId` VARCHAR(191) NOT NULL,
    `reason` TEXT NOT NULL,
    `handoverDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `client_consultant_handovers_clientId_idx`(`clientId`),
    INDEX `client_consultant_handovers_fromConsultantId_idx`(`fromConsultantId`),
    INDEX `client_consultant_handovers_toConsultantId_idx`(`toConsultantId`),
    INDEX `client_consultant_handovers_createdById_idx`(`createdById`),
    INDEX `client_consultant_handovers_handoverDate_idx`(`handoverDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `client_consultant_assignments` ADD CONSTRAINT `client_consultant_assignments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_consultant_assignments` ADD CONSTRAINT `client_consultant_assignments_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_consultant_handovers` ADD CONSTRAINT `client_consultant_handovers_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_consultant_handovers` ADD CONSTRAINT `client_consultant_handovers_fromConsultantId_fkey` FOREIGN KEY (`fromConsultantId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_consultant_handovers` ADD CONSTRAINT `client_consultant_handovers_toConsultantId_fkey` FOREIGN KEY (`toConsultantId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_consultant_handovers` ADD CONSTRAINT `client_consultant_handovers_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
