-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: schedule_new_test_one
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_username_unique` (`username`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','admin@example.com','$2y$12$HnvoC.5GS8oySgr4hQqyqOVR./KP.Nj.MFbTSUCdGn7cJsoH6r.0i','Administrator',NULL,'2026-06-08 00:33:26','2026-06-08 00:33:26');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_conversation_messages`
--

DROP TABLE IF EXISTS `agent_conversation_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_conversation_messages` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conversation_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tool_calls` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tool_results` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_index` (`conversation_id`,`user_id`,`updated_at`),
  KEY `agent_conversation_messages_user_id_index` (`user_id`),
  KEY `agent_conversation_messages_conversation_id_index` (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_conversation_messages`
--

LOCK TABLES `agent_conversation_messages` WRITE;
/*!40000 ALTER TABLE `agent_conversation_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `agent_conversation_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_conversations`
--

DROP TABLE IF EXISTS `agent_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_conversations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agent_conversations_user_id_updated_at_index` (`user_id`,`updated_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_conversations`
--

LOCK TABLES `agent_conversations` WRITE;
/*!40000 ALTER TABLE `agent_conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `agent_conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-schedule_run_4_section_4_last_error','s:43:\"Unknown teacher [Teacher A] returned by AI.\";',1780932754);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_username_unique` (`username`),
  UNIQUE KEY `clients_email_unique` (`email`),
  KEY `clients_school_id_foreign` (`school_id`),
  CONSTRAINT `clients_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,1,'school one','school_one@gmail.com','$2y$12$t1zHUwfyAVpUl6l4pzXuTOqu0nwQd54mEF/IGpN89v0fjpHrKggIC','Little Angle',1,NULL,'2026-06-08 00:36:52','2026-06-08 04:22:17');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
INSERT INTO `failed_jobs` VALUES (1,'b294c903-b304-4d22-add4-545dbdbadcc3','database','default','{\"uuid\":\"b294c903-b304-4d22-add4-545dbdbadcc3\",\"displayName\":\"App\\\\Jobs\\\\ProcessGradeScheduleJob\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":5,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":\"30,120,300,600\",\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\ProcessGradeScheduleJob\",\"command\":\"O:32:\\\"App\\\\Jobs\\\\ProcessGradeScheduleJob\\\":4:{s:8:\\\"schoolId\\\";i:1;s:14:\\\"gradeSectionId\\\";i:2;s:19:\\\"masterScheduleRunId\\\";i:2;s:24:\\\"remainingGradeSectionIds\\\";a:12:{i:0;i:6;i:1;i:4;i:2;i:5;i:3;i:9;i:4;i:7;i:5;i:8;i:6;i:12;i:7;i:10;i:8;i:11;i:9;i:15;i:10;i:13;i:11;i:14;}}\",\"batchId\":null},\"createdAt\":1780917788,\"delay\":null}','Illuminate\\Queue\\MaxAttemptsExceededException: App\\Jobs\\ProcessGradeScheduleJob has been attempted too many times. in C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\MaxAttemptsExceededException.php:24\nStack trace:\n#0 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(883): Illuminate\\Queue\\MaxAttemptsExceededException::forJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob))\n#1 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(592): Illuminate\\Queue\\Worker->maxAttemptsExceededException(Object(Illuminate\\Queue\\Jobs\\DatabaseJob))\n#2 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(493): Illuminate\\Queue\\Worker->markJobAsFailedIfAlreadyExceedsMaxAttempts(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 5)\n#3 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(454): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#4 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(212): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#5 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(149): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#6 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(132): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#7 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#8 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::{closure:Illuminate\\Container\\BoundMethod::call():35}()\n#9 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#10 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#11 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(799): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#12 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#13 C:\\Users\\User\\schedule-school-project\\vendor\\symfony\\console\\Command\\Command.php(341): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#14 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#15 C:\\Users\\User\\schedule-school-project\\vendor\\symfony\\console\\Application.php(1117): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#16 C:\\Users\\User\\schedule-school-project\\vendor\\symfony\\console\\Application.php(356): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#17 C:\\Users\\User\\schedule-school-project\\vendor\\symfony\\console\\Application.php(195): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#18 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(198): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#19 C:\\Users\\User\\schedule-school-project\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1235): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#20 C:\\Users\\User\\schedule-school-project\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#21 {main}','2026-06-08 08:04:05');
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade_sections`
--

DROP TABLE IF EXISTS `grade_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `grade_id` bigint unsigned NOT NULL,
  `section_id` bigint unsigned NOT NULL,
  `schedule_template_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grade_sections_school_id_grade_id_section_id_unique` (`school_id`,`grade_id`,`section_id`),
  KEY `grade_sections_grade_id_foreign` (`grade_id`),
  KEY `grade_sections_section_id_foreign` (`section_id`),
  KEY `grade_sections_schedule_template_id_index` (`schedule_template_id`),
  KEY `grade_sections_school_id_schedule_template_id_index` (`school_id`,`schedule_template_id`),
  CONSTRAINT `grade_sections_grade_id_foreign` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grade_sections_schedule_template_id_foreign` FOREIGN KEY (`schedule_template_id`) REFERENCES `schedule_templates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grade_sections_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `grade_sections_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_sections`
--

LOCK TABLES `grade_sections` WRITE;
/*!40000 ALTER TABLE `grade_sections` DISABLE KEYS */;
INSERT INTO `grade_sections` VALUES (1,1,1,1,1,'2026-06-08 01:09:35','2026-06-08 01:09:35'),(2,1,1,2,1,'2026-06-08 01:09:42','2026-06-08 01:09:42'),(3,1,1,3,1,'2026-06-08 01:09:48','2026-06-08 01:09:48'),(4,1,2,1,1,'2026-06-08 01:10:05','2026-06-08 01:10:05'),(5,1,2,2,1,'2026-06-08 01:10:10','2026-06-08 01:10:10'),(6,1,2,3,1,'2026-06-08 01:10:15','2026-06-08 01:10:15'),(7,1,3,1,1,'2026-06-08 01:10:23','2026-06-08 01:10:23'),(8,1,3,2,1,'2026-06-08 01:10:26','2026-06-08 01:10:26'),(9,1,3,3,1,'2026-06-08 01:10:31','2026-06-08 01:10:31');
/*!40000 ALTER TABLE `grade_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `grades_school_id_name_unique` (`school_id`,`name`),
  CONSTRAINT `grades_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (1,1,'Grade 6','2026-06-08 00:56:57','2026-06-08 00:56:57'),(2,1,'Grade 7','2026-06-08 00:57:03','2026-06-08 00:57:03'),(3,1,'Grade 8','2026-06-08 00:57:07','2026-06-08 00:57:07'),(4,1,'Grade 9','2026-06-08 00:57:12','2026-06-08 00:57:12'),(5,1,'Grade 10','2026-06-08 00:57:15','2026-06-08 00:57:15');
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_schedule_entries`
--

DROP TABLE IF EXISTS `master_schedule_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_schedule_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `master_schedule_run_id` bigint unsigned NOT NULL,
  `school_id` bigint unsigned NOT NULL,
  `grade_section_id` bigint unsigned NOT NULL,
  `grade_section` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `day` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time_slot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `schedule_entry_slot_unique` (`master_schedule_run_id`,`grade_section_id`,`day`,`time_slot`),
  KEY `master_schedule_entries_grade_section_id_foreign` (`grade_section_id`),
  KEY `master_schedule_entries_school_id_grade_section_id_index` (`school_id`,`grade_section_id`),
  CONSTRAINT `master_schedule_entries_grade_section_id_foreign` FOREIGN KEY (`grade_section_id`) REFERENCES `grade_sections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `master_schedule_entries_master_schedule_run_id_foreign` FOREIGN KEY (`master_schedule_run_id`) REFERENCES `master_schedule_runs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `master_schedule_entries_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=660 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_schedule_entries`
--

LOCK TABLES `master_schedule_entries` WRITE;
/*!40000 ALTER TABLE `master_schedule_entries` DISABLE KEYS */;
INSERT INTO `master_schedule_entries` VALUES (516,5,1,3,'Grade 6PM','W','10:35-11:15','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:44:00','2026-06-08 09:44:01'),(517,5,1,3,'Grade 6PM','Th','10:35-11:15','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:44:05','2026-06-08 09:44:07'),(518,5,1,3,'Grade 6PM','F','10:35-11:15','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:44:11','2026-06-08 09:44:12'),(519,5,1,3,'Grade 6PM','M','10:35-11:15','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:44:50','2026-06-08 09:44:57'),(520,5,1,3,'Grade 6PM','T','10:35-11:15','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:44:55','2026-06-08 09:44:58'),(521,5,1,3,'Grade 6PM','Th','14:05-14:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:45:34','2026-06-08 09:45:36'),(522,5,1,3,'Grade 6PM','F','15:00-15:45','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 09:45:51','2026-06-08 09:45:54'),(523,5,1,3,'Grade 6PM','M','13:20-14:05','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:02:41','2026-06-08 10:02:43'),(524,5,1,3,'Grade 6PM','T','13:20-14:05','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:02:47','2026-06-08 10:02:49'),(527,5,1,1,'Grade 6RR','M','13:20-14:05','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:06:12','2026-06-08 10:06:14'),(528,5,1,1,'Grade 6RR','W','13:20-14:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:06:34','2026-06-08 10:06:36'),(529,5,1,1,'Grade 6RR','Th','13:20-14:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:06:42','2026-06-08 10:06:47'),(530,5,1,1,'Grade 6RR','F','13:20-14:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:06:45','2026-06-08 10:06:49'),(531,5,1,1,'Grade 6RR','Th','14:05-14:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:07:05','2026-06-08 10:07:12'),(532,5,1,1,'Grade 6RR','F','14:05-14:45','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:07:11','2026-06-08 10:07:14'),(533,5,1,1,'Grade 6RR','M','15:00-15:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:07:25','2026-06-08 10:07:26'),(534,5,1,1,'Grade 6RR','T','15:00-15:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:07:31','2026-06-08 10:07:36'),(535,5,1,1,'Grade 6RR','W','15:00-15:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:07:35','2026-06-08 10:07:37'),(536,5,1,1,'Grade 6RR','T','13:20-14:05','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:08:27','2026-06-08 10:08:29'),(537,5,1,2,'Grade 6TM','M','12:05-12:45','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:08:53','2026-06-08 10:09:03'),(538,5,1,2,'Grade 6TM','T','12:05-12:45','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:08:58','2026-06-08 10:09:03'),(539,5,1,2,'Grade 6TM','W','12:05-12:45','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:02','2026-06-08 10:09:04'),(540,5,1,2,'Grade 6TM','Th','12:05-12:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:10','2026-06-08 10:09:11'),(541,5,1,2,'Grade 6TM','F','12:05-12:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:14','2026-06-08 10:09:16'),(542,5,1,2,'Grade 6TM','M','13:20-14:05','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:24','2026-06-08 10:09:25'),(543,5,1,2,'Grade 6TM','T','13:20-14:05','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:27','2026-06-08 10:09:29'),(544,5,1,2,'Grade 6TM','W','13:20-14:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:33','2026-06-08 10:09:34'),(546,5,1,2,'Grade 6TM','F','13:20-14:05','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:09:46','2026-06-08 10:09:46'),(547,5,1,2,'Grade 6TM','Th','14:05-14:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:10:02','2026-06-08 10:10:04'),(548,5,1,4,'Grade 7RR','M','11:25-12:05','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:10:41','2026-06-08 10:10:42'),(549,5,1,4,'Grade 7RR','T','11:25-12:05','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:10:47','2026-06-08 10:10:48'),(550,5,1,4,'Grade 7RR','W','11:25-12:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:10:53','2026-06-08 10:10:54'),(551,5,1,4,'Grade 7RR','Th','11:25-12:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:10:58','2026-06-08 10:10:59'),(552,5,1,4,'Grade 7RR','F','11:25-12:05','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:11:03','2026-06-08 10:11:04'),(553,5,1,4,'Grade 7RR','M','14:05-14:45','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:11:20','2026-06-08 10:11:22'),(554,5,1,4,'Grade 7RR','T','14:05-14:45','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:11:26','2026-06-08 10:11:35'),(555,5,1,4,'Grade 7RR','W','14:05-14:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:11:30','2026-06-08 10:11:36'),(556,5,1,4,'Grade 7RR','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:11:53','2026-06-08 10:11:54'),(557,5,1,4,'Grade 7RR','F','13:20-14:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:12:15','2026-06-08 10:12:17'),(558,5,1,5,'Grade 7TM','W','10:35-11:15','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:13:56','2026-06-08 10:14:05'),(559,5,1,5,'Grade 7TM','Th','10:35-11:15','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:14:01','2026-06-08 10:14:05'),(560,5,1,5,'Grade 7TM','F','10:35-11:15','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:14:04','2026-06-08 10:14:07'),(561,5,1,5,'Grade 7TM','F','11:25-12:05','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:14:31','2026-06-08 10:14:33'),(562,5,1,5,'Grade 7TM','M','14:05-14:45','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:14:52','2026-06-08 10:14:54'),(563,5,1,5,'Grade 7TM','T','14:05-14:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:15:00','2026-06-08 10:15:01'),(564,5,1,5,'Grade 7TM','W','14:05-14:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:15:09','2026-06-08 10:15:10'),(565,5,1,5,'Grade 7TM','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:22:54','2026-06-08 10:22:55'),(566,5,1,6,'Grade 7PM','M','11:25-12:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:25:52','2026-06-08 10:26:10'),(567,5,1,6,'Grade 7PM','T','11:25-12:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:25:56','2026-06-08 10:26:11'),(568,5,1,6,'Grade 7PM','W','11:25-12:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:26:00','2026-06-08 10:26:12'),(569,5,1,6,'Grade 7PM','Th','11:25-12:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:26:04','2026-06-08 10:26:13'),(570,5,1,6,'Grade 7PM','F','11:25-12:05','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:26:09','2026-06-08 10:26:14'),(571,5,1,6,'Grade 7PM','M','14:05-14:45','Dance Mam','Dance','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:26:28','2026-06-08 10:26:29'),(572,5,1,6,'Grade 7PM','W','14:05-14:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:26:35','2026-06-08 10:26:36'),(573,5,1,6,'Grade 7PM','T','15:00-15:45','Chinese Mam','Chinese','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:27:30','2026-06-08 10:27:40'),(574,5,1,6,'Grade 7PM','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:27:35','2026-06-08 10:27:41'),(575,5,1,6,'Grade 7PM','F','15:00-15:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:27:39','2026-06-08 10:27:42'),(578,5,1,9,'Grade 8PM','Th','09:40-10:25','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:29:18','2026-06-08 10:29:19'),(579,5,1,9,'Grade 8PM','F','09:40-10:25','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:29:22','2026-06-08 10:29:26'),(580,5,1,9,'Grade 8PM','W','11:25-12:05','Saliza mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:29:47','2026-06-08 10:29:49'),(581,5,1,9,'Grade 8PM','M','13:20-14:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:30:03','2026-06-08 10:30:11'),(582,5,1,9,'Grade 8PM','T','13:20-14:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-08 10:30:08','2026-06-08 10:30:11'),(583,5,1,7,'Grade 8RR','M','15:00-15:45','Nabin sir','Opt Maths','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:29:17','2026-06-09 20:29:27'),(584,5,1,7,'Grade 8RR','T','15:00-15:45','Nabin sir','Opt Maths','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:29:21','2026-06-09 20:29:27'),(585,5,1,7,'Grade 8RR','F','15:00-15:45','Nabin sir','Opt Maths','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:29:26','2026-06-09 20:29:29'),(586,5,1,4,'Grade 7RR','M','15:00-15:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:33:03','2026-06-09 20:33:17'),(587,5,1,4,'Grade 7RR','T','15:00-15:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:33:09','2026-06-09 20:33:16'),(588,5,1,4,'Grade 7RR','W','15:00-15:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:33:14','2026-06-09 20:33:16'),(589,5,1,4,'Grade 7RR','Th','14:05-14:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:33:31','2026-06-09 20:33:32'),(590,5,1,4,'Grade 7RR','F','15:00-15:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:33:38','2026-06-09 20:33:39'),(591,5,1,5,'Grade 7TM','M','13:20-14:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:34:03','2026-06-09 20:34:17'),(592,5,1,5,'Grade 7TM','T','13:20-14:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:34:06','2026-06-09 20:34:18'),(593,5,1,5,'Grade 7TM','W','13:20-14:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:34:09','2026-06-09 20:34:18'),(594,5,1,5,'Grade 7TM','Th','13:20-14:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:34:13','2026-06-09 20:34:19'),(595,5,1,5,'Grade 7TM','F','13:20-14:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:34:16','2026-06-09 20:34:20'),(596,5,1,6,'Grade 7PM','M','09:40-10:25','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:35:30','2026-06-09 20:35:44'),(597,5,1,6,'Grade 7PM','T','09:40-10:25','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:35:33','2026-06-09 20:35:45'),(598,5,1,6,'Grade 7PM','W','09:40-10:25','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:35:37','2026-06-09 20:35:46'),(599,5,1,6,'Grade 7PM','Th','09:40-10:25','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:35:40','2026-06-09 20:35:47'),(600,5,1,6,'Grade 7PM','F','09:40-10:25','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:35:43','2026-06-09 20:35:48'),(601,5,1,8,'Grade 8TM','M','11:25-12:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:36:12','2026-06-09 20:36:13'),(602,5,1,8,'Grade 8TM','T','14:05-14:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:36:38','2026-06-09 20:36:42'),(603,5,1,8,'Grade 8TM','W','14:05-14:45','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:36:41','2026-06-09 20:36:43'),(604,5,1,8,'Grade 8TM','Th','11:25-12:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:37:05','2026-06-09 20:37:11'),(605,5,1,8,'Grade 8TM','F','11:25-12:05','Sharmila mam','Social','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:37:09','2026-06-09 20:37:12'),(606,5,1,8,'Grade 8TM','M','10:35-11:15','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:37:51','2026-06-09 20:38:05'),(607,5,1,8,'Grade 8TM','T','10:35-11:15','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:37:56','2026-06-09 20:38:05'),(608,5,1,8,'Grade 8TM','W','10:35-11:15','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:37:59','2026-06-09 20:38:06'),(609,5,1,8,'Grade 8TM','Th','10:35-11:15','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:01','2026-06-09 20:38:07'),(610,5,1,8,'Grade 8TM','F','10:35-11:15','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:04','2026-06-09 20:38:08'),(611,5,1,9,'Grade 8PM','W','14:05-14:45','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:34','2026-06-09 20:38:58'),(612,5,1,9,'Grade 8PM','M','15:00-15:45','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:44','2026-06-09 20:38:56'),(613,5,1,9,'Grade 8PM','T','15:00-15:45','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:48','2026-06-09 20:38:57'),(614,5,1,9,'Grade 8PM','Th','14:05-14:45','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:52','2026-06-09 20:38:59'),(615,5,1,9,'Grade 8PM','F','15:00-15:45','Sandhya mam','English','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:38:55','2026-06-09 20:39:00'),(616,5,1,9,'Grade 8PM','W','15:00-15:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:39:15','2026-06-09 20:39:20'),(617,5,1,9,'Grade 8PM','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:39:18','2026-06-09 20:39:20'),(618,5,1,6,'Grade 7PM','M','10:35-11:15','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:40:45','2026-06-09 20:41:06'),(619,5,1,6,'Grade 7PM','T','10:35-11:15','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:40:49','2026-06-09 20:41:06'),(620,5,1,6,'Grade 7PM','W','10:35-11:15','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:40:54','2026-06-09 20:41:07'),(621,5,1,6,'Grade 7PM','Th','10:35-11:15','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:40:59','2026-06-09 20:41:08'),(622,5,1,6,'Grade 7PM','F','10:35-11:15','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:04','2026-06-09 20:41:09'),(623,5,1,7,'Grade 8RR','M','14:05-14:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:36','2026-06-09 20:41:48'),(624,5,1,7,'Grade 8RR','T','14:05-14:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:38','2026-06-09 20:41:49'),(625,5,1,7,'Grade 8RR','W','14:05-14:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:40','2026-06-09 20:41:49'),(626,5,1,7,'Grade 8RR','Th','14:05-14:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:44','2026-06-09 20:41:50'),(627,5,1,7,'Grade 8RR','F','14:05-14:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:41:47','2026-06-09 20:41:51'),(628,5,1,8,'Grade 8TM','M','12:05-12:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:04','2026-06-09 20:42:13'),(629,5,1,8,'Grade 8TM','T','12:05-12:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:06','2026-06-09 20:42:14'),(630,5,1,8,'Grade 8TM','W','12:05-12:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:08','2026-06-09 20:42:15'),(631,5,1,8,'Grade 8TM','Th','12:05-12:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:10','2026-06-09 20:42:15'),(632,5,1,8,'Grade 8TM','F','12:05-12:45','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:12','2026-06-09 20:42:16'),(633,5,1,9,'Grade 8PM','M','11:25-12:05','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:35','2026-06-09 20:42:37'),(634,5,1,9,'Grade 8PM','T','11:25-12:05','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:41','2026-06-09 20:42:44'),(635,5,1,9,'Grade 8PM','W','13:20-14:05','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:55','2026-06-09 20:42:56'),(636,5,1,9,'Grade 8PM','Th','13:20-14:05','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:42:58','2026-06-09 20:43:00'),(637,5,1,9,'Grade 8PM','F','13:20-14:05','Archana mam','Nepali','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:43:02','2026-06-09 20:43:03'),(638,5,1,3,'Grade 6PM','W','12:05-12:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 20:53:15','2026-06-09 20:53:19'),(639,5,1,5,'Grade 7TM','M','12:05-12:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:13:49','2026-06-09 21:14:19'),(640,5,1,5,'Grade 7TM','T','12:05-12:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:13:53','2026-06-09 21:14:20'),(641,5,1,5,'Grade 7TM','Th','14:05-14:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:14:17','2026-06-09 21:14:22'),(642,5,1,7,'Grade 8RR','W','12:05-12:45','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:39:18','2026-06-09 21:39:26'),(643,5,1,7,'Grade 8RR','Th','12:05-12:45','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:39:21','2026-06-09 21:39:27'),(644,5,1,7,'Grade 8RR','F','12:05-12:45','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:39:25','2026-06-09 21:39:30'),(646,5,1,7,'Grade 8RR','Th','10:35-11:15','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:41:11','2026-06-09 21:41:31'),(647,5,1,7,'Grade 8RR','F','10:35-11:15','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:41:14','2026-06-09 21:41:32'),(648,5,1,7,'Grade 8RR','W','10:35-11:15','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:41:17','2026-06-09 21:41:30'),(649,5,1,7,'Grade 8RR','W','15:00-15:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:42:48','2026-06-09 21:42:53'),(650,5,1,7,'Grade 8RR','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:42:52','2026-06-09 21:42:54'),(651,5,1,8,'Grade 8TM','W','09:40-10:25','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:43:40','2026-06-09 21:43:49'),(652,5,1,8,'Grade 8TM','Th','09:40-10:25','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:43:44','2026-06-09 21:43:50'),(653,5,1,8,'Grade 8TM','F','09:40-10:25','Salina Mam','ICT','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:43:47','2026-06-09 21:43:50'),(654,5,1,8,'Grade 8TM','Th','13:20-14:05','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:44:17','2026-06-09 21:52:07'),(655,5,1,8,'Grade 8TM','F','14:05-14:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:44:28','2026-06-09 21:52:08'),(657,5,1,8,'Grade 8TM','W','15:00-15:45','Game Sir','Games','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:52:30','2026-06-09 21:52:31'),(658,5,1,8,'Grade 8TM','Th','15:00-15:45','Club Sir','Club','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:52:42','2026-06-09 21:52:43'),(659,5,1,8,'Grade 8TM','M','14:05-14:45','Sabbu mam','Health','{\"source\": \"manual-assignment\", \"is_fixed\": true}','2026-06-09 21:53:11','2026-06-09 21:53:12');
/*!40000 ALTER TABLE `master_schedule_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_schedule_runs`
--

DROP TABLE IF EXISTS `master_schedule_runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_schedule_runs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `total_sections` int unsigned NOT NULL DEFAULT '0',
  `processed_sections` int unsigned NOT NULL DEFAULT '0',
  `failed_sections` int unsigned NOT NULL DEFAULT '0',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `master_schedule_runs_school_id_status_index` (`school_id`,`status`),
  CONSTRAINT `master_schedule_runs_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_schedule_runs`
--

LOCK TABLES `master_schedule_runs` WRITE;
/*!40000 ALTER TABLE `master_schedule_runs` DISABLE KEYS */;
INSERT INTO `master_schedule_runs` VALUES (5,1,'completed',0,0,0,NULL,NULL,NULL,'2026-06-08 09:39:47','2026-06-08 09:39:47');
/*!40000 ALTER TABLE `master_schedule_runs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_01_16_060055_create_personal_access_tokens_table',1),(5,'2026_05_26_000000_create_admins_table',1),(6,'2026_05_26_000000_create_schools_table',1),(7,'2026_05_26_000001_create_clients_table',1),(8,'2026_05_28_000000_create_teachers_table',1),(9,'2026_05_28_000100_create_grades_table',1),(10,'2026_05_28_000101_create_sections_table',1),(11,'2026_05_28_000102_create_grade_sections_table',1),(12,'2026_05_28_000200_create_subjects_table',1),(13,'2026_05_28_000300_create_schedule_templates_table',1),(14,'2026_05_28_000400_create_master_schedule_runs_table',1),(15,'2026_05_28_000401_create_master_schedule_entries_table',1),(16,'2026_05_28_000402_normalize_grade_section_schedule_template_ids',1),(17,'2026_06_06_151741_create_agent_conversations_table',1),(18,'2026_06_08_153543_add_allow_multiple_sessions_to_teachers_table',2),(19,'2026_06_08_154933_drop_schedule_teacher_slot_unique_from_master_schedule_entries',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (2,'App\\Models\\Client',1,'client-token','351bf839c985b7b1700a7cfcaf1386e1b3014a3a17ab51f92b26eaf48d82b678','[\"*\"]','2026-06-08 05:50:20',NULL,'2026-06-08 03:17:23','2026-06-08 05:50:20'),(3,'App\\Models\\Client',1,'client-token','8ef210b60e05c8281b14d7218e493f2935aed496bd88d1d7c32e24f726495204','[\"*\"]','2026-06-08 05:50:20',NULL,'2026-06-08 03:17:44','2026-06-08 05:50:20'),(5,'App\\Models\\Client',1,'client-token','7454ea6bec8da86cb4d85cb8596ac370d7fcc76e6a1d53431832f9bbfcf22543','[\"*\"]','2026-06-08 10:56:54',NULL,'2026-06-08 10:56:38','2026-06-08 10:56:54'),(6,'App\\Models\\Client',1,'client-token','afc18edd116dac4408a14a2d0ad288fdfb997f0b566778fe6a76d6f7277907f9','[\"*\"]','2026-06-08 11:01:19',NULL,'2026-06-08 10:57:09','2026-06-08 11:01:19'),(7,'App\\Models\\Client',1,'client-token','3151b00f0f5ba5c120968dcdb9af6d0017404ca52eb22884d20363c5c2caeaad','[\"*\"]','2026-06-08 11:01:46',NULL,'2026-06-08 10:59:15','2026-06-08 11:01:46'),(8,'App\\Models\\Client',1,'client-token','a7f198fe4cd7b276398cb3c3ae3821a11f3944ba2b77364f601aebb8dc378c19','[\"*\"]','2026-06-09 20:21:47',NULL,'2026-06-09 11:08:26','2026-06-09 20:21:47'),(10,'App\\Models\\Client',1,'client-token','d62c0f7a54f39fd287869e92b2a82fa06c49d80d4e6d99eb1749bc8793deee63','[\"*\"]','2026-06-09 21:53:33',NULL,'2026-06-09 21:07:58','2026-06-09 21:53:33');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_templates`
--

DROP TABLE IF EXISTS `schedule_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `grade_ids` json DEFAULT NULL,
  `days` json DEFAULT NULL,
  `periods` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `schedule_templates_school_id_name_unique` (`school_id`,`name`),
  KEY `schedule_templates_school_id_level_index` (`school_id`,`level`),
  CONSTRAINT `schedule_templates_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_templates`
--

LOCK TABLES `schedule_templates` WRITE;
/*!40000 ALTER TABLE `schedule_templates` DISABLE KEYS */;
INSERT INTO `schedule_templates` VALUES (1,1,'Six To Ten','high','09:40:00','15:45:00','[1, 2, 3, 4, 5]','[\"T\", \"W\", \"Th\", \"F\", \"M\"]','[{\"end\": \"10:25\", \"type\": \"academic\", \"start\": \"09:40\"}, {\"end\": \"10:35\", \"type\": \"break\", \"start\": \"10:25\"}, {\"end\": \"11:15\", \"type\": \"academic\", \"start\": \"10:35\"}, {\"end\": \"11:25\", \"type\": \"break\", \"start\": \"11:15\"}, {\"end\": \"12:05\", \"type\": \"academic\", \"start\": \"11:25\"}, {\"end\": \"12:45\", \"type\": \"academic\", \"start\": \"12:05\"}, {\"end\": \"13:20\", \"type\": \"break\", \"start\": \"12:45\"}, {\"end\": \"14:05\", \"type\": \"academic\", \"start\": \"13:20\"}, {\"end\": \"14:45\", \"type\": \"academic\", \"start\": \"14:05\"}, {\"end\": \"15:00\", \"type\": \"break\", \"start\": \"14:45\"}, {\"end\": \"15:45\", \"type\": \"academic\", \"start\": \"15:00\"}]','2026-06-08 01:09:12','2026-06-08 01:09:12');
/*!40000 ALTER TABLE `schedule_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schools`
--

DROP TABLE IF EXISTS `schools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schools` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `schools_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schools`
--

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;
INSERT INTO `schools` VALUES (1,'Little Angle','little-angle','school_one@gmail.com','981982983984','school_one@gmail.com',1,'2026-06-08 00:36:32','2026-06-08 00:36:32');
/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sections_school_id_name_unique` (`school_id`,`name`),
  CONSTRAINT `sections_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES (1,1,'RR','2026-06-08 00:57:22','2026-06-08 00:57:22'),(2,1,'TM','2026-06-08 00:57:25','2026-06-08 00:57:25'),(3,1,'PM','2026-06-08 00:57:29','2026-06-08 00:57:29');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('Hw0KrblcO1PYz82vXHNFXJZH1gplV5NWe7Saaqcu',NULL,'2400:1a00:4b40:4ed9:e05b:224b:8f12:cffc','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVVnSUtVbzYwNEtlSW5FdTMyU1BjUXJPa0ZtMFVBN3ZKWFhYSkdGUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NjQ6Imh0dHBzOi8vc25vd3Nob2UtYXBwZWFzaW5nLWJ1c2xvYWQubmdyb2stZnJlZS5kZXYvY2xpZW50L3NpZ24taW4iO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1781057197),('zcRFTY2Zl4cYlXCDA49LzT9nAyHMNy8c5ZHkq7q6',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzFaazA2UVlEaTVMYjVTMXVrUVdUQ01CaVNYR29rS3p3OWR4d09odSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdy5qcyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1781062701);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subjects_school_id_name_unique` (`school_id`,`name`),
  KEY `subjects_school_id_status_index` (`school_id`,`status`),
  CONSTRAINT `subjects_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,1,'Science','active','2026-06-08 00:39:23','2026-06-08 00:39:23'),(2,1,'Maths','active','2026-06-08 00:39:26','2026-06-08 00:39:26'),(3,1,'Nepali','active','2026-06-08 00:39:29','2026-06-08 00:39:29'),(4,1,'Social','active','2026-06-08 00:39:30','2026-06-08 00:39:30'),(5,1,'Dance','active','2026-06-08 00:39:32','2026-06-08 00:39:32'),(6,1,'English','active','2026-06-08 00:39:36','2026-06-08 00:39:36'),(7,1,'Health','active','2026-06-08 00:39:39','2026-06-08 00:39:39'),(8,1,'Games','active','2026-06-08 00:39:52','2026-06-08 00:39:52'),(9,1,'ICT','active','2026-06-08 00:39:57','2026-06-08 00:39:57'),(10,1,'Club','active','2026-06-08 00:40:00','2026-06-08 00:40:00'),(11,1,'Chinese','active','2026-06-08 00:40:04','2026-06-08 00:40:04'),(12,1,'Opt Maths','active','2026-06-08 00:53:03','2026-06-08 00:53:03'),(13,1,'FREE','active','2026-06-08 00:54:17','2026-06-08 00:54:17'),(14,1,'Population','active','2026-06-08 00:54:39','2026-06-08 00:54:39'),(15,1,'Computer','active','2026-06-08 02:15:05','2026-06-08 02:15:05');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint unsigned NOT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `employment_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'full-time',
  `max_daily_classes` tinyint unsigned NOT NULL DEFAULT '6',
  `allow_multiple_sessions` tinyint(1) NOT NULL DEFAULT '0',
  `ai_context_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `availability` json DEFAULT NULL,
  `assignments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teachers_school_id_employment_type_index` (`school_id`,`employment_type`),
  KEY `teachers_school_id_full_name_index` (`school_id`,`full_name`),
  CONSTRAINT `teachers_school_id_foreign` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,1,'Archana mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"3\", \"grade_section_id\": \"6\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"9\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"8\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"7\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 01:27:52','2026-06-09 20:48:30'),(2,1,'Ashok sir','full-time',2,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"14\", \"grade_section_id\": \"10\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"14\", \"grade_section_id\": \"11\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"14\", \"grade_section_id\": \"12\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"14\", \"grade_section_id\": \"13\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"14\", \"grade_section_id\": \"14\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"14\", \"grade_section_id\": \"15\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}]','2026-06-08 01:32:21','2026-06-08 01:32:21'),(3,1,'Awanti mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"6\", \"grade_section_id\": \"2\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"4\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"5\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"6\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"7\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"8\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"6\", \"grade_section_id\": \"9\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 01:35:03','2026-06-08 03:58:55'),(4,1,'Bhuwan sir','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"2\", \"grade_section_id\": \"10\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"11\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"12\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"13\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"14\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"15\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 5}]','2026-06-08 01:41:45','2026-06-08 01:41:45'),(5,1,'Bina mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"4\", \"grade_section_id\": \"1\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"2\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"3\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"7\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"9\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 01:44:22','2026-06-08 04:49:09'),(6,1,'Chandika mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"3\", \"grade_section_id\": \"1\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"2\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"3\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"4\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"3\", \"grade_section_id\": \"5\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 01:47:07','2026-06-08 04:11:18'),(7,1,'Kaushal sir','full-time',3,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"6\", \"grade_section_id\": \"11\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"6\", \"grade_section_id\": \"13\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"6\", \"grade_section_id\": \"14\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"6\", \"grade_section_id\": \"15\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}]','2026-06-08 01:51:32','2026-06-08 04:55:39'),(8,1,'Kusum mam','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}}','[]','2026-06-08 01:53:20','2026-06-09 20:47:48'),(9,1,'Manbahadur sir','full-time',3,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[]','2026-06-08 01:56:05','2026-06-09 20:47:03'),(10,1,'Mohit sir','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"2\", \"grade_section_id\": \"2\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"3\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"1\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"6\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"5\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 01:57:37','2026-06-08 03:59:29'),(11,1,'Monika mam','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"2\", \"grade_section_id\": \"4\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"9\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"8\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 5}, {\"subject_id\": \"2\", \"grade_section_id\": \"7\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 5}, {\"subject_id\": \"12\", \"grade_section_id\": \"9\", \"sessions_per_week\": 8, \"max_sessions_per_day\": 2}, {\"subject_id\": \"12\", \"grade_section_id\": \"8\", \"sessions_per_week\": 8, \"max_sessions_per_day\": 2}]','2026-06-08 02:03:16','2026-06-08 04:45:36'),(12,1,'Nabin sir','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"12\", \"grade_section_id\": \"10\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"12\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"13\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"14\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"11\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"15\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"12\", \"grade_section_id\": \"7\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 1}]','2026-06-08 02:11:57','2026-06-08 02:11:57'),(13,1,'Pratibha mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"1\", \"grade_section_id\": \"5\", \"sessions_per_week\": 26, \"max_sessions_per_day\": 6}, {\"subject_id\": \"1\", \"grade_section_id\": \"6\", \"sessions_per_week\": 26, \"max_sessions_per_day\": 6}, {\"subject_id\": \"1\", \"grade_section_id\": \"8\", \"sessions_per_week\": 26, \"max_sessions_per_day\": 6}, {\"subject_id\": \"1\", \"grade_section_id\": \"9\", \"sessions_per_week\": 26, \"max_sessions_per_day\": 6}, {\"subject_id\": \"1\", \"grade_section_id\": \"7\", \"sessions_per_week\": 26, \"max_sessions_per_day\": 6}]','2026-06-08 02:14:55','2026-06-08 04:00:21'),(14,1,'Neeraj sir','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"15\", \"grade_section_id\": \"15\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"15\", \"grade_section_id\": \"14\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"15\", \"grade_section_id\": \"13\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"15\", \"grade_section_id\": \"12\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"15\", \"grade_section_id\": \"11\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"15\", \"grade_section_id\": \"10\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}]','2026-06-08 02:17:16','2026-06-08 02:17:16'),(15,1,'Sabbu mam','full-time',7,0,'Do not allocate at any first class like allocation only from 10:35 AM','{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"10:30\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"10:30\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"10:30\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"10:30\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"10:30\"}}','[{\"subject_id\": \"7\", \"grade_section_id\": \"1\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"2\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"3\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"4\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"5\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"6\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"7\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"8\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}, {\"subject_id\": \"7\", \"grade_section_id\": \"9\", \"sessions_per_week\": 23, \"max_sessions_per_day\": 7}]','2026-06-08 02:19:29','2026-06-09 21:03:37'),(16,1,'Salina Mam','part-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:00\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:00\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:00\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:00\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:00\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"9\", \"grade_section_id\": \"1\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 5}, {\"subject_id\": \"9\", \"grade_section_id\": \"5\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 5}, {\"subject_id\": \"9\", \"grade_section_id\": \"6\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 5}, {\"subject_id\": \"9\", \"grade_section_id\": \"8\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 5}, {\"subject_id\": \"9\", \"grade_section_id\": \"7\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 5}]','2026-06-08 02:22:04','2026-06-08 10:57:54'),(17,1,'Saliza mam','part-time',3,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"13:00\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"13:00\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"13:00\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"13:00\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"13:00\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"9\", \"grade_section_id\": \"2\", \"sessions_per_week\": 12, \"max_sessions_per_day\": 3}, {\"subject_id\": \"9\", \"grade_section_id\": \"3\", \"sessions_per_week\": 12, \"max_sessions_per_day\": 3}, {\"subject_id\": \"9\", \"grade_section_id\": \"4\", \"sessions_per_week\": 12, \"max_sessions_per_day\": 3}, {\"subject_id\": \"9\", \"grade_section_id\": \"9\", \"sessions_per_week\": 12, \"max_sessions_per_day\": 3}]','2026-06-08 02:23:48','2026-06-08 10:57:43'),(18,1,'Sandhya mam','full-time',3,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}}','[{\"subject_id\": \"6\", \"grade_section_id\": \"8\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 4}, {\"subject_id\": \"6\", \"grade_section_id\": \"9\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 4}, {\"subject_id\": \"6\", \"grade_section_id\": \"10\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 4}, {\"subject_id\": \"6\", \"grade_section_id\": \"12\", \"sessions_per_week\": 19, \"max_sessions_per_day\": 4}]','2026-06-08 02:25:36','2026-06-08 04:52:06'),(19,1,'Sharmila mam','full-time',5,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"4\", \"grade_section_id\": \"4\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"5\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"8\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}, {\"subject_id\": \"4\", \"grade_section_id\": \"6\", \"sessions_per_week\": 25, \"max_sessions_per_day\": 5}]','2026-06-08 02:27:10','2026-06-09 20:32:44'),(20,1,'Sonam sir','full-time',2,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:46\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"6\", \"grade_section_id\": \"3\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}, {\"subject_id\": \"6\", \"grade_section_id\": \"1\", \"sessions_per_week\": 10, \"max_sessions_per_day\": 2}]','2026-06-08 02:29:01','2026-06-08 03:58:16'),(21,1,'Subash sir','full-time',3,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"1\", \"grade_section_id\": \"10\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"1\", \"grade_section_id\": \"12\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"1\", \"grade_section_id\": \"15\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"1\", \"grade_section_id\": \"14\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}, {\"subject_id\": \"1\", \"grade_section_id\": \"13\", \"sessions_per_week\": 15, \"max_sessions_per_day\": 3}]','2026-06-08 02:30:46','2026-06-08 04:52:57'),(22,1,'Tanju mam','full-time',4,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"1\", \"grade_section_id\": \"3\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"1\", \"grade_section_id\": \"2\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"1\", \"grade_section_id\": \"1\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}, {\"subject_id\": \"1\", \"grade_section_id\": \"4\", \"sessions_per_week\": 20, \"max_sessions_per_day\": 4}]','2026-06-08 02:32:51','2026-06-08 04:14:47'),(23,1,'Tanuja mam','full-time',1,0,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"1\", \"grade_section_id\": \"11\", \"sessions_per_week\": 5, \"max_sessions_per_day\": 1}]','2026-06-08 02:34:00','2026-06-08 05:17:23'),(24,1,'Dance Mam','full-time',3,1,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"5\", \"grade_section_id\": \"1\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}, {\"subject_id\": \"5\", \"grade_section_id\": \"2\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}, {\"subject_id\": \"5\", \"grade_section_id\": \"3\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}, {\"subject_id\": \"5\", \"grade_section_id\": \"4\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}, {\"subject_id\": \"5\", \"grade_section_id\": \"5\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}, {\"subject_id\": \"5\", \"grade_section_id\": \"6\", \"sessions_per_week\": 3, \"max_sessions_per_day\": 3}]','2026-06-08 03:14:09','2026-06-09 20:45:19'),(25,1,'Chinese Mam','part-time',4,1,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"11\", \"grade_section_id\": \"3\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}, {\"subject_id\": \"11\", \"grade_section_id\": \"2\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}, {\"subject_id\": \"11\", \"grade_section_id\": \"1\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}, {\"subject_id\": \"11\", \"grade_section_id\": \"6\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}, {\"subject_id\": \"11\", \"grade_section_id\": \"5\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}, {\"subject_id\": \"11\", \"grade_section_id\": \"4\", \"sessions_per_week\": 6, \"max_sessions_per_day\": 4}]','2026-06-08 03:33:37','2026-06-08 10:57:32'),(26,1,'Club Sir','part-time',9,1,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:30\"}}','[{\"subject_id\": \"10\", \"grade_section_id\": \"1\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"2\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"3\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"4\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"5\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"6\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"7\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"8\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}, {\"subject_id\": \"10\", \"grade_section_id\": \"9\", \"sessions_per_week\": 9, \"max_sessions_per_day\": 9}]','2026-06-08 03:38:22','2026-06-08 10:57:26'),(27,1,'Game Sir','part-time',11,1,NULL,'{\"Friday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Monday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Tuesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Thursday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}, \"Wednesday\": {\"active\": true, \"end_time\": \"15:45\", \"start_time\": \"09:40\"}}','[{\"subject_id\": \"8\", \"grade_section_id\": \"3\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"2\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"1\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"6\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"5\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"4\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"9\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"8\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}, {\"subject_id\": \"8\", \"grade_section_id\": \"7\", \"sessions_per_week\": 14, \"max_sessions_per_day\": 11}]','2026-06-08 04:19:54','2026-06-08 10:57:20');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-10  9:24:35
