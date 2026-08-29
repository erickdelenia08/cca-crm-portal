/*
  Warnings:

  - The values [LEAVE] on the enum `leave_requests_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `channel` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(10))`.
  - You are about to alter the column `department` on the `staff_profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the `availability_slots` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[staffId,date]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consultantId,date]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[consultantId,startTime,endTime]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `availability_slots` DROP FOREIGN KEY `availability_slots_consultantId_fkey`;

-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `availabilityTemplateId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `leave_requests` MODIFY `type` ENUM('PERMIT', 'ANNUAL_LEAVE', 'SICK', 'OVERTIME') NOT NULL;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `announcementId` VARCHAR(191) NULL,
    MODIFY `channel` ENUM('EMAIL', 'WHATSAPP', 'IN_APP') NOT NULL;

-- AlterTable
ALTER TABLE `staff_profiles` MODIFY `department` ENUM('HR', 'DOCUMENT_PROCESSING', 'MANAGEMENT') NOT NULL;

-- AlterTable
ALTER TABLE `student_profiles` ADD COLUMN `assignedConsultantId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `availability_slots`;

-- CreateTable
CREATE TABLE `availability_templates` (
    `id` VARCHAR(191) NOT NULL,
    `consultantId` VARCHAR(191) NOT NULL,
    `dayOfWeek` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `targetRole` ENUM('STUDENT', 'CONSULTANT', 'ADMIN_MANAGEMENT', 'DOCUMENT_PROCESSOR') NULL,
    `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `attendances_staffId_date_key` ON `attendances`(`staffId`, `date`);

-- CreateIndex
CREATE UNIQUE INDEX `attendances_consultantId_date_key` ON `attendances`(`consultantId`, `date`);

-- CreateIndex
CREATE UNIQUE INDEX `bookings_consultantId_startTime_endTime_key` ON `bookings`(`consultantId`, `startTime`, `endTime`);

-- AddForeignKey
ALTER TABLE `student_profiles` ADD CONSTRAINT `student_profiles_assignedConsultantId_fkey` FOREIGN KEY (`assignedConsultantId`) REFERENCES `consultant_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_templates` ADD CONSTRAINT `availability_templates_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `consultant_profiles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_availabilityTemplateId_fkey` FOREIGN KEY (`availabilityTemplateId`) REFERENCES `availability_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `announcements` ADD CONSTRAINT `announcements_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `announcements`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
