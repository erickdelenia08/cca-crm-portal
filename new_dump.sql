SET SESSION sql_require_primary_key = 0;  
-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: crm_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('79a36b48-5521-4a61-836f-e588e8e05007','8b26b382af955142e30f2157935daf10959c9ced40d1efc516776120b981d75f','2026-09-27 07:22:57.300','20260923072856_change_student_to_client',NULL,NULL,'2026-09-27 07:22:55.315',1),('b6337209-5d84-44b5-aaaf-2c85b82b84fd','d9eb383aa39dd4337e305ee061066b9da03ec35758b75d777462a3d06f82a1ac','2026-09-27 07:22:55.305','20260923070831_init',NULL,NULL,'2026-09-27 07:22:33.165',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providerAccountId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `access_token` text COLLATE utf8mb4_unicode_ci,
  `expires_at` int DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text COLLATE utf8mb4_unicode_ci,
  `session_state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `accounts_userId_idx` (`userId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetRole` enum('ALL','CLIENT','CONSULTANT','TEACHER','MANAGEMENT','PROCESSING_DEPARTMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ALL',
  `isPublished` tinyint(1) NOT NULL DEFAULT '0',
  `publishedAt` datetime(3) DEFAULT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `announcements_targetRole_idx` (`targetRole`),
  KEY `announcements_isPublished_idx` (`isPublished`),
  KEY `announcements_publishedAt_idx` (`publishedAt`),
  KEY `announcements_createdById_idx` (`createdById`),
  CONSTRAINT `announcements_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `staffId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recordedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `checkIn` datetime(3) DEFAULT NULL,
  `checkOut` datetime(3) DEFAULT NULL,
  `status` enum('ON_TIME','LATE','ABSENT','EXCUSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ON_TIME',
  `note` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendances_staffId_date_key` (`staffId`,`date`),
  KEY `attendances_staffId_idx` (`staffId`),
  KEY `attendances_recordedById_idx` (`recordedById`),
  KEY `attendances_date_idx` (`date`),
  CONSTRAINT `attendances_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `attendances_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `staff_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES ('26ca1337-c1a8-483b-8989-518abf38ee68','0b66d6fa-6518-44b5-9f4d-7f408076a2dc','USR-2026-000003','2026-10-01 17:00:00.000','2026-10-02 15:59:29.013',NULL,'ON_TIME',NULL,'2026-10-02 15:59:29.037','2026-10-02 15:59:29.037'),('84114376-d9fa-4960-a9cf-bc127b8afefd','b1a5da37-ae87-4e2a-8c04-f0d1cbfe7db1','USR-2026-000002','2026-10-01 17:00:00.000','2026-10-02 15:29:23.714',NULL,'ON_TIME',NULL,'2026-10-02 15:29:23.791','2026-10-02 15:29:23.791'),('c6106e4f-6af4-4a29-b242-de9ead82aa24','b1a5da37-ae87-4e2a-8c04-f0d1cbfe7db1','USR-2026-000002','2026-10-02 17:00:00.000','2026-10-03 00:23:14.232',NULL,'ON_TIME',NULL,'2026-10-03 00:23:14.265','2026-10-03 00:23:14.265'),('e0787379-6a4e-4fa6-93fc-21bf77811486','1f198272-9d5d-4b41-be62-8248435d36ce','USR-2026-000004','2026-10-02 17:00:00.000','2026-10-03 01:52:00.580',NULL,'ON_TIME',NULL,'2026-10-03 01:52:00.664','2026-10-03 01:52:00.664');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability_overrides`
--

DROP TABLE IF EXISTS `availability_overrides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability_overrides` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `availability_overrides_consultantId_idx` (`consultantId`),
  KEY `availability_overrides_date_idx` (`date`),
  CONSTRAINT `availability_overrides_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability_overrides`
--

LOCK TABLES `availability_overrides` WRITE;
/*!40000 ALTER TABLE `availability_overrides` DISABLE KEYS */;
/*!40000 ALTER TABLE `availability_overrides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `availability_templates`
--

DROP TABLE IF EXISTS `availability_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `availability_templates` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dayOfWeek` int NOT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `availability_templates_consultantId_idx` (`consultantId`),
  KEY `availability_templates_dayOfWeek_idx` (`dayOfWeek`),
  KEY `availability_templates_isActive_idx` (`isActive`),
  CONSTRAINT `availability_templates_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability_templates`
--

LOCK TABLES `availability_templates` WRITE;
/*!40000 ALTER TABLE `availability_templates` DISABLE KEYS */;
INSERT INTO `availability_templates` VALUES ('884bf47d-68bb-49df-81b3-34ab2768a35f','USR-2026-000002',2,'09:00','10:00',1,'2026-09-29 03:45:42.387','2026-09-29 03:45:42.387'),('cd9d318f-0ff0-4852-9e32-0458e0970db0','USR-2026-000002',2,'10:00','11:00',1,'2026-09-29 03:45:42.387','2026-09-29 03:45:42.387'),('cfe3f63b-4845-44f2-b50b-de67c3284e85','USR-2026-000002',2,'11:00','12:00',1,'2026-09-29 03:45:42.387','2026-09-29 03:45:42.387');
/*!40000 ALTER TABLE `availability_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_logs`
--

DROP TABLE IF EXISTS `backup_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `backup_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `backupName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cloudStorageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `googleDriveId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSizeBytes` bigint DEFAULT NULL,
  `status` enum('PENDING','RUNNING','SUCCESS','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `errorMessage` text COLLATE utf8mb4_unicode_ci,
  `triggeredById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `backup_logs_triggeredById_idx` (`triggeredById`),
  KEY `backup_logs_status_idx` (`status`),
  KEY `backup_logs_createdAt_idx` (`createdAt`),
  CONSTRAINT `backup_logs_triggeredById_fkey` FOREIGN KEY (`triggeredById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_logs`
--

LOCK TABLES `backup_logs` WRITE;
/*!40000 ALTER TABLE `backup_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `backup_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `availabilityTemplateId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availabilityOverrideId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduledAt` datetime(3) NOT NULL,
  `durationMinutes` int NOT NULL DEFAULT '60',
  `sessionType` enum('CONSULTATION','FOLLOW_UP','DOCUMENT_REVIEW','INTERVIEW','ORIENTATION','ACADEMIC','CAREER','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CONSULTATION',
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELLED','REJECTED','NO_SHOW') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `meetingUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_clientId_idx` (`clientId`),
  KEY `bookings_consultantId_idx` (`consultantId`),
  KEY `bookings_availabilityTemplateId_idx` (`availabilityTemplateId`),
  KEY `bookings_availabilityOverrideId_idx` (`availabilityOverrideId`),
  KEY `bookings_scheduledAt_idx` (`scheduledAt`),
  KEY `bookings_status_idx` (`status`),
  CONSTRAINT `bookings_availabilityOverrideId_fkey` FOREIGN KEY (`availabilityOverrideId`) REFERENCES `availability_overrides` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_availabilityTemplateId_fkey` FOREIGN KEY (`availabilityTemplateId`) REFERENCES `availability_templates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES ('5837bd4f-8720-48b5-94c5-22498c898d33','USR-2026-000001','USR-2026-000002','cd9d318f-0ff0-4852-9e32-0458e0970db0',NULL,'2026-09-29 03:00:00.000',60,'CONSULTATION','CONFIRMED',NULL,'gsdfgs','2026-09-29 03:46:37.594','2026-09-29 03:50:01.505'),('a00a3653-8a25-40ff-ac9e-80fcea8d9135','USR-2026-000001','USR-2026-000002','884bf47d-68bb-49df-81b3-34ab2768a35f',NULL,'2026-09-29 02:00:00.000',60,'CONSULTATION','CANCELLED',NULL,'asdfasdf','2026-09-29 03:47:21.622','2026-09-29 03:50:00.428');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_consultant_assignments`
--

DROP TABLE IF EXISTS `client_consultant_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_consultant_assignments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `isTemporary` tinyint(1) NOT NULL DEFAULT '0',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_consultant_assignments_clientId_idx` (`clientId`),
  KEY `client_consultant_assignments_consultantId_idx` (`consultantId`),
  KEY `client_consultant_assignments_startDate_idx` (`startDate`),
  KEY `client_consultant_assignments_endDate_idx` (`endDate`),
  CONSTRAINT `client_consultant_assignments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `client_consultant_assignments_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_consultant_assignments`
--

LOCK TABLES `client_consultant_assignments` WRITE;
/*!40000 ALTER TABLE `client_consultant_assignments` DISABLE KEYS */;
INSERT INTO `client_consultant_assignments` VALUES ('eba36240-5215-4fba-92d5-7004ca388c57','USR-2026-000001','USR-2026-000002','2026-09-27 12:26:34.424',NULL,0,'Assigned during enrollment b87db950-2755-45c4-a6e4-dab73a800ab8','2026-09-27 12:26:34.431','2026-09-27 12:26:34.431');
/*!40000 ALTER TABLE `client_consultant_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_consultant_handovers`
--

DROP TABLE IF EXISTS `client_consultant_handovers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_consultant_handovers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fromConsultantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `toConsultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `handoverDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `client_consultant_handovers_clientId_idx` (`clientId`),
  KEY `client_consultant_handovers_fromConsultantId_idx` (`fromConsultantId`),
  KEY `client_consultant_handovers_toConsultantId_idx` (`toConsultantId`),
  KEY `client_consultant_handovers_createdById_idx` (`createdById`),
  KEY `client_consultant_handovers_handoverDate_idx` (`handoverDate`),
  CONSTRAINT `client_consultant_handovers_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `client_consultant_handovers_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `client_consultant_handovers_fromConsultantId_fkey` FOREIGN KEY (`fromConsultantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `client_consultant_handovers_toConsultantId_fkey` FOREIGN KEY (`toConsultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_consultant_handovers`
--

LOCK TABLES `client_consultant_handovers` WRITE;
/*!40000 ALTER TABLE `client_consultant_handovers` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_consultant_handovers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_documents`
--

DROP TABLE IF EXISTS `client_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_documents` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objectKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSize` int DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `client_documents_clientId_idx` (`clientId`),
  KEY `client_documents_category_idx` (`category`),
  KEY `client_documents_expiresAt_idx` (`expiresAt`),
  CONSTRAINT `client_documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_documents`
--

LOCK TABLES `client_documents` WRITE;
/*!40000 ALTER TABLE `client_documents` DISABLE KEYS */;
INSERT INTO `client_documents` VALUES ('0dbed895-997f-4bba-9839-d21e800b2039','USR-2026-000001','foto 4x3',NULL,'students/USR-2026-000001/documents/5fbdf4f7-09a9-4386-b47d-43eaf07b7e1a.png','2371a3c7-8d79-4235-9996-48c91c953cdb.png','image/png',1852006,NULL,'2026-09-29 13:09:48.330','2026-09-29 13:09:48.330'),('1e94b544-fc91-418c-9ac7-adec9e99298a','USR-2026-000001','Student ID',NULL,'students/USR-2026-000001/documents/994a3953-0267-4b6f-b759-c4d7de242d06.jpg','625600375_18098304694911078_3072268115612588144_n.jpg','image/jpeg',311902,NULL,'2026-09-27 12:48:49.996','2026-09-27 12:48:49.996'),('300f76f9-4db4-4f47-b044-06f0f229269e','USR-2026-000001','foto 4x3',NULL,'students/USR-2026-000001/documents/7c15b457-d55a-4785-b934-dfd3acc024f0.png','2371a3c7-8d79-4235-9996-48c91c953cdb.png','image/png',1852006,NULL,'2026-09-27 12:48:18.690','2026-09-27 12:48:18.690'),('a02d595d-4f11-478c-9ab3-3aa9d884f38f','USR-2026-000001','ijazah',NULL,'students/USR-2026-000001/documents/28908d57-17ab-4792-900e-4027248db2ea.png','al2.png','image/png',259155,NULL,'2026-09-29 03:43:02.345','2026-09-29 03:43:02.345'),('cbccb885-ebbb-492a-b8d1-857e776ff14e','USR-2026-000001','ijazah',NULL,'students/USR-2026-000001/documents/b2e5713e-c912-411e-8c84-fbd385ac19b8.png','2371a3c7-8d79-4235-9996-48c91c953cdb.png','image/png',1852006,NULL,'2026-09-29 03:40:47.225','2026-09-29 03:40:47.225');
/*!40000 ALTER TABLE `client_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_profiles`
--

DROP TABLE IF EXISTS `client_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_profiles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postalCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `educationLevel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `major` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `graduationYear` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_profiles_userId_key` (`userId`),
  UNIQUE KEY `client_profiles_clientNumber_key` (`clientNumber`),
  KEY `client_profiles_fullName_idx` (`fullName`),
  KEY `client_profiles_email_idx` (`email`),
  KEY `client_profiles_phone_idx` (`phone`),
  CONSTRAINT `client_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_profiles`
--

LOCK TABLES `client_profiles` WRITE;
/*!40000 ALTER TABLE `client_profiles` DISABLE KEYS */;
INSERT INTO `client_profiles` VALUES ('15585d84-c245-4a65-8872-e8c4ba015d24','3fdf2a00-dff3-456f-980c-d22a7009dcd8','CLT-1931','erick delenia',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-01 15:30:57.571','2026-10-01 15:30:57.571'),('25fdeb1a-5e12-49fa-ae28-ec912d55d02a','USR-2026-000001','CCA-STU-2026-0001','Client','student@demo.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-27 07:23:48.228','2026-09-27 07:23:48.228');
/*!40000 ALTER TABLE `client_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_settings`
--

DROP TABLE IF EXISTS `company_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_settings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `logoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_settings`
--

LOCK TABLES `company_settings` WRITE;
/*!40000 ALTER TABLE `company_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultant_profiles`
--

DROP TABLE IF EXISTS `consultant_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultant_profiles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `consultant_profiles_userId_key` (`userId`),
  UNIQUE KEY `consultant_profiles_employeeNumber_key` (`employeeNumber`),
  KEY `consultant_profiles_fullName_idx` (`fullName`),
  KEY `consultant_profiles_isAvailable_idx` (`isAvailable`),
  CONSTRAINT `consultant_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultant_profiles`
--

LOCK TABLES `consultant_profiles` WRITE;
/*!40000 ALTER TABLE `consultant_profiles` DISABLE KEYS */;
INSERT INTO `consultant_profiles` VALUES ('dffc2446-9821-4500-9dee-4876f80f5ba0','USR-2026-000002','EMP-CNS-001','Consultant',NULL,NULL,1,'2026-09-27 07:23:48.583','2026-09-27 07:23:48.583');
/*!40000 ALTER TABLE `consultant_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_attendances`
--

DROP TABLE IF EXISTS `course_attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_attendances` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ON_TIME','LATE','ABSENT','EXCUSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ON_TIME',
  `note` text COLLATE utf8mb4_unicode_ci,
  `attachmentUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_attendances_sessionId_clientId_key` (`sessionId`,`clientId`),
  KEY `course_attendances_sessionId_idx` (`sessionId`),
  KEY `course_attendances_clientId_idx` (`clientId`),
  CONSTRAINT `course_attendances_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_attendances_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `course_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_attendances`
--

LOCK TABLES `course_attendances` WRITE;
/*!40000 ALTER TABLE `course_attendances` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_class_teachers`
--

DROP TABLE IF EXISTS `course_class_teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_class_teachers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseClassId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacherId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `isTemporary` tinyint(1) NOT NULL DEFAULT '0',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_class_teachers_courseClassId_idx` (`courseClassId`),
  KEY `course_class_teachers_teacherId_idx` (`teacherId`),
  KEY `course_class_teachers_startDate_idx` (`startDate`),
  KEY `course_class_teachers_endDate_idx` (`endDate`),
  CONSTRAINT `course_class_teachers_courseClassId_fkey` FOREIGN KEY (`courseClassId`) REFERENCES `course_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_class_teachers_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `staff_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_class_teachers`
--

LOCK TABLES `course_class_teachers` WRITE;
/*!40000 ALTER TABLE `course_class_teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_class_teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_classes`
--

DROP TABLE IF EXISTS `course_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_classes` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacherId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maxCapacity` int NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_classes_courseId_code_key` (`courseId`,`code`),
  KEY `course_classes_courseId_idx` (`courseId`),
  KEY `course_classes_teacherId_idx` (`teacherId`),
  KEY `course_classes_isActive_idx` (`isActive`),
  KEY `course_classes_startDate_idx` (`startDate`),
  KEY `course_classes_endDate_idx` (`endDate`),
  CONSTRAINT `course_classes_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_classes_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `staff_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_classes`
--

LOCK TABLES `course_classes` WRITE;
/*!40000 ALTER TABLE `course_classes` DISABLE KEYS */;
INSERT INTO `course_classes` VALUES ('0120934e-5dac-4f70-897c-4087f632e05b','3b2d3625-786d-441b-8338-0e958eaa2600','0b66d6fa-6518-44b5-9f4d-7f408076a2dc','INGGRIS','asdf',NULL,10,'2026-09-27 00:00:00.000','2026-09-27 00:00:00.000',1,'2026-09-27 12:23:12.473','2026-09-27 12:23:12.473');
/*!40000 ALTER TABLE `course_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_enrollments`
--

DROP TABLE IF EXISTS `course_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_enrollments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseClassId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programEnrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endedAt` datetime(3) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_enrollments_clientId_idx` (`clientId`),
  KEY `course_enrollments_courseClassId_idx` (`courseClassId`),
  KEY `course_enrollments_programEnrollmentId_idx` (`programEnrollmentId`),
  KEY `course_enrollments_status_idx` (`status`),
  CONSTRAINT `course_enrollments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_enrollments_courseClassId_fkey` FOREIGN KEY (`courseClassId`) REFERENCES `course_classes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `course_enrollments_programEnrollmentId_fkey` FOREIGN KEY (`programEnrollmentId`) REFERENCES `program_enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_enrollments`
--

LOCK TABLES `course_enrollments` WRITE;
/*!40000 ALTER TABLE `course_enrollments` DISABLE KEYS */;
INSERT INTO `course_enrollments` VALUES ('56655f4e-4b34-4121-82cd-75d35bf84008','USR-2026-000001','0120934e-5dac-4f70-897c-4087f632e05b','7b671487-f777-45c9-b308-c36ffca2702a','ACTIVE','2026-09-27 12:27:13.431',NULL,'Created via Wizard','2026-09-27 12:27:13.431','2026-09-27 12:27:13.431'),('f5c477a5-93c6-45d0-889e-4abe21bd0975','USR-2026-000001','0120934e-5dac-4f70-897c-4087f632e05b','7b8ffe06-40d4-4afe-ba15-d8cfd94189bd','ACTIVE','2026-09-27 12:27:12.381',NULL,'Created via Wizard','2026-09-27 12:27:12.381','2026-09-27 12:27:12.381');
/*!40000 ALTER TABLE `course_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_materials`
--

DROP TABLE IF EXISTS `course_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_materials` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseClassId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('DOCUMENT','VIDEO','LINK','ASSIGNMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DOCUMENT',
  `objectKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileSize` int DEFAULT NULL,
  `externalUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isVisibleToClient` tinyint(1) NOT NULL DEFAULT '1',
  `uploadedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_materials_courseClassId_idx` (`courseClassId`),
  KEY `course_materials_sessionId_idx` (`sessionId`),
  KEY `course_materials_type_idx` (`type`),
  KEY `course_materials_isVisibleToClient_idx` (`isVisibleToClient`),
  KEY `course_materials_uploadedById_fkey` (`uploadedById`),
  CONSTRAINT `course_materials_courseClassId_fkey` FOREIGN KEY (`courseClassId`) REFERENCES `course_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_materials_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `course_materials_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_materials`
--

LOCK TABLES `course_materials` WRITE;
/*!40000 ALTER TABLE `course_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_schedule_patterns`
--

DROP TABLE IF EXISTS `course_schedule_patterns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_schedule_patterns` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseClassId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dayOfWeek` int NOT NULL,
  `startTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `defaultMode` enum('ONLINE','OFFLINE','HYBRID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OFFLINE',
  `defaultLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_schedule_patterns_courseClassId_idx` (`courseClassId`),
  KEY `course_schedule_patterns_isActive_idx` (`isActive`),
  CONSTRAINT `course_schedule_patterns_courseClassId_fkey` FOREIGN KEY (`courseClassId`) REFERENCES `course_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_schedule_patterns`
--

LOCK TABLES `course_schedule_patterns` WRITE;
/*!40000 ALTER TABLE `course_schedule_patterns` DISABLE KEYS */;
INSERT INTO `course_schedule_patterns` VALUES ('13a44643-a93c-48f3-8e45-d8e2626c8956','0120934e-5dac-4f70-897c-4087f632e05b',1,'10:00','12:00','OFFLINE','',1,'2026-09-27 12:23:12.473','2026-09-27 12:23:12.473');
/*!40000 ALTER TABLE `course_schedule_patterns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_sessions`
--

DROP TABLE IF EXISTS `course_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseClassId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patternId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origin` enum('RECURRING','EXTRA','MAKEUP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RECURRING',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `mode` enum('ONLINE','OFFLINE','HYBRID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OFFLINE',
  `meetingUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `meetingProvider` enum('ZOOM','GOOGLE_MEET','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_sessions_courseClassId_idx` (`courseClassId`),
  KEY `course_sessions_patternId_idx` (`patternId`),
  KEY `course_sessions_startTime_idx` (`startTime`),
  KEY `course_sessions_origin_idx` (`origin`),
  CONSTRAINT `course_sessions_courseClassId_fkey` FOREIGN KEY (`courseClassId`) REFERENCES `course_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_sessions_patternId_fkey` FOREIGN KEY (`patternId`) REFERENCES `course_schedule_patterns` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_sessions`
--

LOCK TABLES `course_sessions` WRITE;
/*!40000 ALTER TABLE `course_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programTypeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('LANGUAGE','ACADEMIC','SKILL','ORIENTATION') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` enum('BASIC','INTERMEDIATE','ADVANCED','PREPARATION') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `durationHours` int DEFAULT NULL,
  `totalSessions` int DEFAULT NULL,
  `basePrice` decimal(12,2) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_code_key` (`code`),
  KEY `courses_programTypeId_idx` (`programTypeId`),
  KEY `courses_isActive_idx` (`isActive`),
  KEY `courses_category_idx` (`category`),
  KEY `courses_level_idx` (`level`),
  CONSTRAINT `courses_programTypeId_fkey` FOREIGN KEY (`programTypeId`) REFERENCES `program_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('3b2d3625-786d-441b-8338-0e958eaa2600','fae207f9-a6d4-412a-b6de-c6a67104b0f5','EN-BASIC','English Basic','ini kelas english basic','LANGUAGE','BASIC',2,30,3000000.00,1,'2026-09-27 07:28:05.982','2026-09-27 07:28:05.982');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_histories`
--

DROP TABLE IF EXISTS `document_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_histories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','REVISION_REQUIRED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `updatedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `document_histories_documentId_idx` (`documentId`),
  KEY `document_histories_updatedById_idx` (`updatedById`),
  CONSTRAINT `document_histories_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `document_histories_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_histories`
--

LOCK TABLES `document_histories` WRITE;
/*!40000 ALTER TABLE `document_histories` DISABLE KEYS */;
INSERT INTO `document_histories` VALUES ('06340805-4264-401a-a98b-64d1d6d839f1','13020ce0-8f30-45ff-bedd-a15bd312cbac','REVISION_REQUIRED','dokument apa ini, ganti','USR-2026-000004','2026-09-29 03:41:57.557'),('21df7152-8fc6-41fb-8101-013bf698d97f','19312812-ea7e-4a44-97a0-704327ca23b2','SUBMITTED','Document submitted','USR-2026-000001','2026-09-27 12:48:50.033'),('22e81e8b-76f9-4af9-ae7e-f37dfbe08713','13020ce0-8f30-45ff-bedd-a15bd312cbac','SUBMITTED','Document submitted','USR-2026-000001','2026-09-29 03:40:47.257'),('2408ed85-30a0-4721-860b-bf3ef73933ff','b0118425-3d19-4ff1-b82f-1fb0df6d2bf5','SUBMITTED','Document submitted','USR-2026-000001','2026-09-27 12:48:18.743'),('2ed847d6-708a-49a5-937d-b2a959694af0','b09aeb5f-cd14-4994-9809-9e614fe19ae1','SUBMITTED','Document submitted','USR-2026-000001','2026-09-29 13:09:48.375'),('413b8db6-0e97-4258-a391-687da8a5ccf6','13020ce0-8f30-45ff-bedd-a15bd312cbac','APPROVED','oke sip','USR-2026-000004','2026-09-29 03:43:50.033'),('89c48e11-5e0d-44da-a54e-33f99ea360f0','13020ce0-8f30-45ff-bedd-a15bd312cbac','SUBMITTED','Document revised and re-submitted','USR-2026-000001','2026-09-29 03:43:02.382');
/*!40000 ALTER TABLE `document_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_requirements`
--

DROP TABLE IF EXISTS `document_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_requirements` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programTypeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `isRequired` tinyint(1) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `document_requirements_programTypeId_code_key` (`programTypeId`,`code`),
  KEY `document_requirements_programTypeId_idx` (`programTypeId`),
  KEY `document_requirements_isActive_idx` (`isActive`),
  CONSTRAINT `document_requirements_programTypeId_fkey` FOREIGN KEY (`programTypeId`) REFERENCES `program_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_requirements`
--

LOCK TABLES `document_requirements` WRITE;
/*!40000 ALTER TABLE `document_requirements` DISABLE KEYS */;
INSERT INTO `document_requirements` VALUES ('58433267-4920-4fca-a850-82af8e6766d7','fae207f9-a6d4-412a-b6de-c6a67104b0f5','STUDENT_ID','Student ID','Kartu Pelajar / KTP',1,1,'2026-09-27 07:26:48.423','2026-09-27 07:26:48.423'),('849fd978-27a9-49ee-a464-d2e33d2b6268','40ffb159-d236-4752-9fb6-e3a65835c7cb','IJAZAH','ijazah','ijazah',1,1,'2026-09-27 12:26:06.590','2026-09-27 12:26:06.590'),('ad782cf0-a07c-4149-aaa7-7613033c648a','40ffb159-d236-4752-9fb6-e3a65835c7cb','STUDENT_ID','Student ID','Kartu Pelajar / KTP',1,1,'2026-09-27 12:26:06.590','2026-09-27 12:26:06.590'),('d7f5dc28-e8fd-4995-a117-ffa552fbd4ad','fae207f9-a6d4-412a-b6de-c6a67104b0f5','FOTO','foto 4x3','foto',1,1,'2026-09-27 07:26:48.423','2026-09-27 07:26:48.423');
/*!40000 ALTER TABLE `document_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentDocumentRequirementId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientDocumentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outcomeObjectKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','REVISION_REQUIRED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUBMITTED',
  `revisionNote` text COLLATE utf8mb4_unicode_ci,
  `uploadedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `documents_enrollmentDocumentRequirementId_key` (`enrollmentDocumentRequirementId`),
  KEY `documents_enrollmentId_idx` (`enrollmentId`),
  KEY `documents_clientDocumentId_idx` (`clientDocumentId`),
  KEY `documents_clientId_idx` (`clientId`),
  KEY `documents_uploadedById_idx` (`uploadedById`),
  KEY `documents_reviewedById_idx` (`reviewedById`),
  KEY `documents_status_idx` (`status`),
  CONSTRAINT `documents_clientDocumentId_fkey` FOREIGN KEY (`clientDocumentId`) REFERENCES `client_documents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `documents_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documents_enrollmentDocumentRequirementId_fkey` FOREIGN KEY (`enrollmentDocumentRequirementId`) REFERENCES `enrollment_document_requirements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documents_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `program_enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documents_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `documents_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES ('13020ce0-8f30-45ff-bedd-a15bd312cbac','b87db950-2755-45c4-a6e4-dab73a800ab8','0204b48a-3a2b-4139-bbb9-e681a7039654','USR-2026-000001','a02d595d-4f11-478c-9ab3-3aa9d884f38f',NULL,'APPROVED','oke sip','USR-2026-000001','USR-2026-000004','2026-09-29 03:43:50.000','2026-09-29 03:40:47.257','2026-09-29 03:43:50.009'),('19312812-ea7e-4a44-97a0-704327ca23b2','7b671487-f777-45c9-b308-c36ffca2702a','386331bc-1748-45c8-befb-747157fb936d','USR-2026-000001','1e94b544-fc91-418c-9ac7-adec9e99298a',NULL,'SUBMITTED',NULL,'USR-2026-000001',NULL,NULL,'2026-09-27 12:48:50.033','2026-09-27 12:48:50.033'),('b0118425-3d19-4ff1-b82f-1fb0df6d2bf5','7b671487-f777-45c9-b308-c36ffca2702a','cf97a36f-4f32-4a57-a25b-ed9487563d1b','USR-2026-000001','300f76f9-4db4-4f47-b044-06f0f229269e',NULL,'SUBMITTED',NULL,'USR-2026-000001',NULL,NULL,'2026-09-27 12:48:18.743','2026-09-27 12:48:18.743'),('b09aeb5f-cd14-4994-9809-9e614fe19ae1','7b8ffe06-40d4-4afe-ba15-d8cfd94189bd','8de23d7e-bb7e-4f4b-9f52-ee051095cd0e','USR-2026-000001','0dbed895-997f-4bba-9839-d21e800b2039',NULL,'SUBMITTED',NULL,'USR-2026-000001',NULL,NULL,'2026-09-29 13:09:48.375','2026-09-29 13:09:48.375');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment_document_requirements`
--

DROP TABLE IF EXISTS `enrollment_document_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment_document_requirements` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirementId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `isRequired` tinyint(1) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `source` enum('PROGRAM_DEFAULT','PROCESSOR_ADDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROGRAM_DEFAULT',
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollment_document_requirements_enrollmentId_code_key` (`enrollmentId`,`code`),
  KEY `enrollment_document_requirements_enrollmentId_idx` (`enrollmentId`),
  KEY `enrollment_document_requirements_requirementId_idx` (`requirementId`),
  CONSTRAINT `enrollment_document_requirements_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `program_enrollments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enrollment_document_requirements_requirementId_fkey` FOREIGN KEY (`requirementId`) REFERENCES `document_requirements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment_document_requirements`
--

LOCK TABLES `enrollment_document_requirements` WRITE;
/*!40000 ALTER TABLE `enrollment_document_requirements` DISABLE KEYS */;
INSERT INTO `enrollment_document_requirements` VALUES ('0204b48a-3a2b-4139-bbb9-e681a7039654','b87db950-2755-45c4-a6e4-dab73a800ab8','849fd978-27a9-49ee-a464-d2e33d2b6268','IJAZAH','ijazah','ijazah',1,1,'2026-09-27 12:26:34.397','2026-09-27 12:26:34.397','PROGRAM_DEFAULT'),('386331bc-1748-45c8-befb-747157fb936d','7b671487-f777-45c9-b308-c36ffca2702a','58433267-4920-4fca-a850-82af8e6766d7','STUDENT_ID','Student ID','Kartu Pelajar / KTP',1,1,'2026-09-27 12:27:13.413','2026-09-27 12:27:13.413','PROGRAM_DEFAULT'),('76ee0b1b-6f0b-4b32-9892-6c863dcda874','b87db950-2755-45c4-a6e4-dab73a800ab8','ad782cf0-a07c-4149-aaa7-7613033c648a','STUDENT_ID','Student ID','Kartu Pelajar / KTP',1,1,'2026-09-27 12:26:34.397','2026-09-27 12:26:34.397','PROGRAM_DEFAULT'),('8de23d7e-bb7e-4f4b-9f52-ee051095cd0e','7b8ffe06-40d4-4afe-ba15-d8cfd94189bd','d7f5dc28-e8fd-4995-a117-ffa552fbd4ad','FOTO','foto 4x3','foto',1,1,'2026-09-27 12:27:12.359','2026-09-27 12:27:12.359','PROGRAM_DEFAULT'),('cf97a36f-4f32-4a57-a25b-ed9487563d1b','7b671487-f777-45c9-b308-c36ffca2702a','d7f5dc28-e8fd-4995-a117-ffa552fbd4ad','FOTO','foto 4x3','foto',1,1,'2026-09-27 12:27:13.413','2026-09-27 12:27:13.413','PROGRAM_DEFAULT'),('f705e43b-4266-4b4b-98e4-bdd8e53c95a5','7b8ffe06-40d4-4afe-ba15-d8cfd94189bd','58433267-4920-4fca-a850-82af8e6766d7','STUDENT_ID','Student ID','Kartu Pelajar / KTP',1,1,'2026-09-27 12:27:12.359','2026-09-27 12:27:12.359','PROGRAM_DEFAULT');
/*!40000 ALTER TABLE `enrollment_document_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '1.00',
  `unitPrice` decimal(12,2) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoice_items_invoiceId_idx` (`invoiceId`),
  CONSTRAINT `invoice_items_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoiceNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programEnrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courseEnrollmentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `taxAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discountAmount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `totalAmount` decimal(12,2) NOT NULL,
  `status` enum('DRAFT','ISSUED','PARTIALLY_PAID','PAID','OVERDUE','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `dueDate` datetime(3) NOT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdfUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoices_invoiceNumber_key` (`invoiceNumber`),
  KEY `invoices_clientId_idx` (`clientId`),
  KEY `invoices_programEnrollmentId_idx` (`programEnrollmentId`),
  KEY `invoices_courseEnrollmentId_idx` (`courseEnrollmentId`),
  KEY `invoices_createdById_idx` (`createdById`),
  KEY `invoices_status_idx` (`status`),
  KEY `invoices_dueDate_idx` (`dueDate`),
  CONSTRAINT `invoices_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `invoices_courseEnrollmentId_fkey` FOREIGN KEY (`courseEnrollmentId`) REFERENCES `course_enrollments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `invoices_programEnrollmentId_fkey` FOREIGN KEY (`programEnrollmentId`) REFERENCES `program_enrollments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `staffId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestedById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('ANNUAL','SICK','PERSONAL','MATERNITY','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `approvedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `attachmentFileName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachmentFileSize` int DEFAULT NULL,
  `attachmentMimeType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachmentObjectKey` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewNote` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `leave_requests_staffId_idx` (`staffId`),
  KEY `leave_requests_requestedById_idx` (`requestedById`),
  KEY `leave_requests_approvedById_idx` (`approvedById`),
  KEY `leave_requests_status_idx` (`status`),
  KEY `leave_requests_startDate_idx` (`startDate`),
  CONSTRAINT `leave_requests_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_requestedById_fkey` FOREIGN KEY (`requestedById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `staff_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_notes`
--

DROP TABLE IF EXISTS `meeting_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_notes` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bookingId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `meeting_notes_clientId_idx` (`clientId`),
  KEY `meeting_notes_consultantId_idx` (`consultantId`),
  KEY `meeting_notes_bookingId_idx` (`bookingId`),
  KEY `meeting_notes_createdById_idx` (`createdById`),
  CONSTRAINT `meeting_notes_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `meeting_notes_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `meeting_notes_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `meeting_notes_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_notes`
--

LOCK TABLES `meeting_notes` WRITE;
/*!40000 ALTER TABLE `meeting_notes` DISABLE KEYS */;
INSERT INTO `meeting_notes` VALUES ('8c3380e8-0f85-48ca-b0fb-5719425e203e','USR-2026-000001','USR-2026-000002',NULL,'Catatan Konsultan','ASdsd','USR-2026-000002','2026-09-29 13:01:39.981','2026-09-29 13:01:39.981');
/*!40000 ALTER TABLE `meeting_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `announcementId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('IN_APP','EMAIL','WHATSAPP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IN_APP',
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `readAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_userId_idx` (`userId`),
  KEY `notifications_announcementId_idx` (`announcementId`),
  KEY `notifications_isRead_idx` (`isRead`),
  KEY `notifications_createdAt_idx` (`createdAt`),
  CONSTRAINT `notifications_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `announcements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('021c116d-0bfd-4468-a8bf-3876b9338466','USR-2026-000001',NULL,'Document Follow Up','Requirement: ijazah\n\noi upload\n','IN_APP',0,NULL,'2026-09-29 02:18:37.692'),('a84f7f05-5842-4595-b9c1-ca3532f46c5b','USR-2026-000001',NULL,'Document Revision Required','Your document requires revision. Reason: dokument apa ini, ganti','IN_APP',0,NULL,'2026-09-29 03:41:57.574'),('bf7737e6-33f8-42c7-b2cc-bd0b13d20621','USR-2026-000001',NULL,'Document Follow Up','Requirement: Student ID\n\noi upload\n','IN_APP',0,NULL,'2026-09-29 02:18:42.841');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payslips`
--

DROP TABLE IF EXISTS `payslips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payslips` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `staffId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periodStart` datetime(3) NOT NULL,
  `periodEnd` datetime(3) NOT NULL,
  `baseSalary` decimal(12,2) NOT NULL,
  `allowances` decimal(12,2) NOT NULL DEFAULT '0.00',
  `deductions` decimal(12,2) NOT NULL DEFAULT '0.00',
  `netSalary` decimal(12,2) NOT NULL,
  `pdfUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payslips_staffId_periodStart_periodEnd_key` (`staffId`,`periodStart`,`periodEnd`),
  KEY `payslips_staffId_idx` (`staffId`),
  KEY `payslips_periodStart_idx` (`periodStart`),
  CONSTRAINT `payslips_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `staff_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payslips`
--

LOCK TABLES `payslips` WRITE;
/*!40000 ALTER TABLE `payslips` DISABLE KEYS */;
/*!40000 ALTER TABLE `payslips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_enrollments`
--

DROP TABLE IF EXISTS `program_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_enrollments` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programTypeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `consultantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ONBOARDING','PROCESSING','ACTIVE','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ONBOARDING',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `enrolledAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `notes` text COLLATE utf8mb4_unicode_ci,
  `extendedData` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `program_enrollments_clientId_idx` (`clientId`),
  KEY `program_enrollments_programTypeId_idx` (`programTypeId`),
  KEY `program_enrollments_consultantId_idx` (`consultantId`),
  KEY `program_enrollments_status_idx` (`status`),
  CONSTRAINT `program_enrollments_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `program_enrollments_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `program_enrollments_programTypeId_fkey` FOREIGN KEY (`programTypeId`) REFERENCES `program_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_enrollments`
--

LOCK TABLES `program_enrollments` WRITE;
/*!40000 ALTER TABLE `program_enrollments` DISABLE KEYS */;
INSERT INTO `program_enrollments` VALUES ('7b671487-f777-45c9-b308-c36ffca2702a','USR-2026-000001','fae207f9-a6d4-412a-b6de-c6a67104b0f5',NULL,'ACTIVE',0,'2026-09-27 12:27:13.413','Created via Wizard',NULL,'2026-09-27 12:27:13.413','2026-09-29 02:30:08.354'),('7b8ffe06-40d4-4afe-ba15-d8cfd94189bd','USR-2026-000001','fae207f9-a6d4-412a-b6de-c6a67104b0f5',NULL,'ONBOARDING',0,'2026-09-27 12:27:12.359','Created via Wizard',NULL,'2026-09-27 12:27:12.359','2026-09-27 12:27:12.359'),('b87db950-2755-45c4-a6e4-dab73a800ab8','USR-2026-000001','40ffb159-d236-4752-9fb6-e3a65835c7cb','USR-2026-000002','ONBOARDING',0,'2026-09-27 12:26:34.397','Created via Wizard',NULL,'2026-09-27 12:26:34.397','2026-09-27 12:26:34.397');
/*!40000 ALTER TABLE `program_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_types`
--

DROP TABLE IF EXISTS `program_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_types` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `programId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `deliveryType` enum('SERVICE','COURSE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SERVICE',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_types_code_key` (`code`),
  KEY `program_types_programId_idx` (`programId`),
  KEY `program_types_deliveryType_idx` (`deliveryType`),
  KEY `program_types_isActive_idx` (`isActive`),
  CONSTRAINT `program_types_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_types`
--

LOCK TABLES `program_types` WRITE;
/*!40000 ALTER TABLE `program_types` DISABLE KEYS */;
INSERT INTO `program_types` VALUES ('40ffb159-d236-4752-9fb6-e3a65835c7cb','3e1581f7-a751-45e3-9139-a4fce3d865d0','VISITOR_VISA','visitor visa','visitor visa','SERVICE',1,'2026-09-27 12:26:06.590','2026-09-27 12:26:06.590'),('fae207f9-a6d4-412a-b6de-c6a67104b0f5','0bc04ed7-9285-4897-99b3-a5755d2bbd6d','ENGLISH_COURSE','Engish Course','ini english course','COURSE',1,'2026-09-27 07:26:48.423','2026-09-27 07:26:48.423');
/*!40000 ALTER TABLE `program_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `programs_code_key` (`code`),
  KEY `programs_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES ('0bc04ed7-9285-4897-99b3-a5755d2bbd6d','CCACADEMY','CCACADEMY','CCACADEMY',1,'2026-09-27 07:25:34.178','2026-09-27 07:25:34.178'),('3e1581f7-a751-45e3-9139-a4fce3d865d0','CCABROAD','CCABROAD','CCABROAD',1,'2026-09-27 12:25:17.925','2026-09-27 12:25:17.925');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_change_requests`
--

DROP TABLE IF EXISTS `schedule_change_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_change_requests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestedDate` datetime(3) NOT NULL,
  `requestedStartTime` datetime(3) NOT NULL,
  `requestedEndTime` datetime(3) NOT NULL,
  `requestedMode` enum('ONLINE','OFFLINE','HYBRID') COLLATE utf8mb4_unicode_ci NOT NULL,
  `requestedLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedMeetingProvider` enum('ZOOM','GOOGLE_MEET','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedMeetingUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reviewedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewedAt` datetime(3) DEFAULT NULL,
  `reviewNote` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schedule_change_requests_sessionId_idx` (`sessionId`),
  KEY `schedule_change_requests_status_idx` (`status`),
  KEY `schedule_change_requests_reviewedById_fkey` (`reviewedById`),
  CONSTRAINT `schedule_change_requests_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `schedule_change_requests_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `course_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_change_requests`
--

LOCK TABLES `schedule_change_requests` WRITE;
/*!40000 ALTER TABLE `schedule_change_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule_change_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_sessionToken_key` (`sessionToken`),
  KEY `sessions_userId_idx` (`userId`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_profiles`
--

DROP TABLE IF EXISTS `staff_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff_profiles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` enum('HR','DOCUMENT_PROCESSING','MANAGEMENT','ACADEMIC','FINANCE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `staff_profiles_userId_key` (`userId`),
  UNIQUE KEY `staff_profiles_employeeNumber_key` (`employeeNumber`),
  KEY `staff_profiles_department_idx` (`department`),
  KEY `staff_profiles_isActive_idx` (`isActive`),
  KEY `staff_profiles_fullName_idx` (`fullName`),
  CONSTRAINT `staff_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_profiles`
--

LOCK TABLES `staff_profiles` WRITE;
/*!40000 ALTER TABLE `staff_profiles` DISABLE KEYS */;
INSERT INTO `staff_profiles` VALUES ('0b66d6fa-6518-44b5-9f4d-7f408076a2dc','USR-2026-000003','EMP-TCH-002','Teacher',NULL,'Teacher','ACADEMIC',1,'2026-09-27 07:23:48.843','2026-09-27 07:23:48.843'),('1f198272-9d5d-4b41-be62-8248435d36ce','USR-2026-000004','EMP-OPS-003','Processor',NULL,'Document Processing','DOCUMENT_PROCESSING',1,'2026-09-27 07:23:49.099','2026-09-27 07:23:49.099'),('35a3c202-2e92-400e-8b47-7fd6af80605f','USR-2026-000005','EMP-MGT-004','Management',NULL,'Management','MANAGEMENT',1,'2026-09-27 07:23:49.464','2026-09-27 07:23:49.464'),('b1a5da37-ae87-4e2a-8c04-f0d1cbfe7db1','USR-2026-000002','EMP-CNS-001','Consultant',NULL,NULL,'MANAGEMENT',1,'2026-10-02 15:25:23.963','2026-10-02 15:25:23.963');
/*!40000 ALTER TABLE `staff_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CLIENT','CONSULTANT','TEACHER','MANAGEMENT','PROCESSING_DEPARTMENT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CLIENT',
  `department` enum('HR','DOCUMENT_PROCESSING','MANAGEMENT','ACADEMIC','FINANCE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_role_idx` (`role`),
  KEY `users_department_idx` (`department`),
  KEY `users_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3fdf2a00-dff3-456f-980c-d22a7009dcd8','erick delenia','erickdelenia08@gmail.com',NULL,NULL,'$2b$10$d3sMdv04ZqzfINph.KFliea5XMnwD3qYT.fvC0hbgPBU7DOWQ/cJO','CLIENT',NULL,1,'2026-10-01 15:30:57.467','2026-10-01 15:30:57.467'),('USR-2026-000001','Client','student@demo.com','2026-09-27 07:23:47.411',NULL,'$2b$10$6K1vPSk8f7Qc3YcgmHGlwebpow6QsLg/Bi8M8LqL2a6Y1LHQVnpeW','CLIENT',NULL,1,'2026-09-27 07:23:48.131','2026-09-27 07:23:48.131'),('USR-2026-000002','Consultant','consultant@demo.com','2026-09-27 07:23:48.471',NULL,'$2b$10$zqIcZ9yW/eboKxFklDJxn.Z/YObLIDeVq9Ql8zzx36lMDFcEAre9O','CONSULTANT','MANAGEMENT',1,'2026-09-27 07:23:48.489','2026-09-27 07:23:48.489'),('USR-2026-000003','Teacher','teacher@demo.com','2026-09-27 07:23:48.758',NULL,'$2b$10$onX0REPoUbU5tYrL9hxgTOPviq9xD3x0axc7NVAFDNTgBzeom4obm','TEACHER','ACADEMIC',1,'2026-09-27 07:23:48.780','2026-09-27 07:23:48.780'),('USR-2026-000004','Processor','processor@demo.com','2026-09-27 07:23:49.037',NULL,'$2b$10$HV.gk7liS9M7gmYwCvQ6l.6QmHWNvFj1ZnNqKC4G/rvKQH9Bm6Cay','PROCESSING_DEPARTMENT','DOCUMENT_PROCESSING',1,'2026-09-27 07:23:49.052','2026-09-27 07:23:49.052'),('USR-2026-000005','Management','management@demo.com','2026-09-27 07:23:49.316',NULL,'$2b$10$ptCWUq/PHnJXLt1JymkiruwLsJwfqJbhUW/1/nOP7.rU2xmnRlphC','MANAGEMENT','MANAGEMENT',1,'2026-09-27 07:23:49.365','2026-09-27 07:23:49.365');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_tokens`
--

DROP TABLE IF EXISTS `verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_tokens` (
  `identifier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  UNIQUE KEY `verification_tokens_token_key` (`token`),
  UNIQUE KEY `verification_tokens_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_tokens`
--

LOCK TABLES `verification_tokens` WRITE;
/*!40000 ALTER TABLE `verification_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03  2:48:38
