-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 16, 2017 at 11:03 AM
-- Server version: 10.0.29-MariaDB-0ubuntu0.16.04.1
-- PHP Version: 7.0.18-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devdb_apt_maint_acct`
--

-- --------------------------------------------------------

--
-- Table structure for table `flats`
--

CREATE TABLE `flats` (
  `id` int(10) UNSIGNED NOT NULL,
  `block_number` varchar(20) NOT NULL DEFAULT '0',
  `flat_number` varchar(20) NOT NULL,
  `remarks` varchar(254) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flats`
--

INSERT INTO `flats` (`id`, `block_number`, `flat_number`, `remarks`, `owner_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(33, '0', 'G1', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(34, '0', 'G2', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(35, '0', 'G3', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(36, '0', 'G4', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(37, '0', 'G5', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(38, '0', 'G6', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(39, '0', 'G7', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(40, '0', 'G8', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(41, '0', 'F1', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(42, '0', 'F2', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(43, '0', 'F3', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(44, '0', 'F4', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(45, '0', 'F5', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(46, '0', 'F6', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(47, '0', 'F7', NULL, 0, '2017-05-27 08:11:39', NULL, NULL),
(48, '0', 'F8', NULL, 0, '2017-05-27 08:11:39', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `flats_residents`
--

CREATE TABLE `flats_residents` (
  `id` int(10) UNSIGNED NOT NULL,
  `flat_id` int(10) UNSIGNED DEFAULT NULL,
  `resident_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flats_residents`
--

INSERT INTO `flats_residents` (`id`, `flat_id`, `resident_id`, `created_at`, `updated_at`) VALUES
(156, 44, 3, '2017-06-06 14:21:52', NULL),
(157, 45, 15, '2017-06-06 14:21:54', NULL),
(158, 45, 20, '2017-06-06 14:21:54', NULL),
(159, 46, 8, '2017-06-06 14:21:58', NULL),
(160, 47, 11, '2017-06-06 14:22:00', NULL),
(161, 47, 12, '2017-06-06 14:22:00', NULL),
(162, 48, 16, '2017-06-06 14:22:01', NULL),
(163, 48, 21, '2017-06-06 14:22:01', NULL),
(164, 33, 1, '2017-06-06 14:22:02', NULL),
(165, 34, 2, '2017-06-06 14:22:03', NULL),
(166, 35, 10, '2017-06-06 14:22:04', NULL),
(167, 36, 3, '2017-06-06 14:22:05', NULL),
(168, 36, 22, '2017-06-06 14:22:05', NULL),
(169, 37, 4, '2017-06-06 14:22:06', NULL),
(170, 38, 17, '2017-06-06 14:22:08', NULL),
(171, 38, 23, '2017-06-06 14:22:08', NULL),
(172, 39, 5, '2017-06-06 14:22:09', NULL),
(173, 40, 6, '2017-06-06 14:22:09', NULL),
(174, 41, 13, '2017-06-07 04:47:29', NULL),
(175, 41, 18, '2017-06-07 04:47:29', NULL),
(176, 42, 19, '2017-06-07 04:47:31', NULL),
(177, 42, 14, '2017-06-07 04:47:31', NULL),
(178, 43, 7, '2017-06-07 04:47:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(7, '20160714150016_users_table_creation.js', 1, '2017-03-21 11:42:29'),
(8, '20161208145952_maintenance_account_table_creation.js', 1, '2017-03-21 11:42:29'),
(9, '20170128095128_roles_table_creation.js', 1, '2017-03-21 11:42:30'),
(10, '20170128095204_roles_users_table_creation.js', 1, '2017-03-21 11:42:31'),
(11, '20170128095224_permissions_table_creation.js', 1, '2017-03-21 11:42:32'),
(12, '20170128095237_permissions_roles_table_creation.js', 1, '2017-03-21 11:42:34'),
(14, '20170401154601_flats_table_creation.js', 2, '2017-04-02 08:56:12'),
(17, '20170405130110_residents_table.js', 3, '2017-05-27 08:11:30'),
(18, '20170406103040_flats_residents_table_creation.js', 3, '2017-05-27 08:11:32');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`is_locked`) VALUES
(0);

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_accounts`
--

CREATE TABLE `maintenance_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `item` varchar(40) DEFAULT NULL,
  `flat_number` varchar(2) NOT NULL,
  `for_month` int(11) NOT NULL,
  `for_year` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `crdr` varchar(2) NOT NULL,
  `amount` decimal(8,2) DEFAULT NULL,
  `balance` decimal(8,2) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  `recorded_at` varchar(10) DEFAULT NULL,
  `remarks` varchar(254) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `maintenance_accounts`
--

INSERT INTO `maintenance_accounts` (`id`, `item`, `flat_number`, `for_month`, `for_year`, `name`, `crdr`, `amount`, `balance`, `category`, `recorded_at`, `remarks`, `owner_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(27, 'test', 'F1', 5, 2017, 'Tenantf1', 'cr', '600.00', '600.00', 'Monthly Maintenance', '2017-06-07', 'test', 27, '2017-06-07 09:10:29', '2017-06-07 09:11:07', NULL),
(28, 'testing', 'F2', 5, 2017, 'Tenantf2', 'cr', '600.00', '1200.00', 'Monthly Maintenance', '2017-06-07', 'testing', 28, '2017-06-07 09:11:06', '2017-06-07 09:11:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(10) UNSIGNED NOT NULL,
  `operations` varchar(4) DEFAULT 'CRUD',
  `resource` varchar(25) DEFAULT '*',
  `condition` varchar(180) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `operations`, `resource`, `condition`, `description`, `owner_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'R', 'accounts', NULL, 'Grants READ ONLY permissions to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 14:58:05', NULL),
(2, 'RUD', 'users', 'return data.user_id === data.model.owner_id', 'Grants RUD PERMISSIONS to user\'s OWN RECORDS', 0, '2017-03-21 11:43:30', '2017-05-31 16:18:52', NULL),
(3, 'CRUD', 'accounts', NULL, 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 14:59:46', NULL),
(4, 'R', 'accounts', 'return data.user_id == data.model.owner_id', 'Grants READ ONLY permissions to USER SPECIFIC record', 0, '2017-03-21 11:43:30', '2017-06-06 10:29:57', NULL),
(5, 'CRUD', 'roles', NULL, 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 15:00:33', NULL),
(6, 'CRUD', 'flats', NULL, 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-04-02 08:02:06', '2017-05-31 15:01:03', NULL),
(7, 'CRUD', 'residents', NULL, 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-04-05 16:01:55', '2017-05-31 15:02:02', NULL),
(9, 'CRUD', 'users', '', 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 15:02:25', NULL),
(16, 'R', 'users', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-05-31 15:28:29', '2017-05-31 15:28:29', NULL),
(17, 'R', 'flats', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-05-31 15:29:26', '2017-05-31 15:29:26', NULL),
(18, 'R', 'residents', NULL, 'Grants READ ONLY permission to ANY USER', 0, '2017-05-31 15:31:03', '2017-05-31 15:31:03', NULL),
(19, 'R', 'roles', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-02 05:43:59', '2017-06-02 05:43:59', NULL),
(20, 'CRUD', 'permissions', '', 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 15:02:25', NULL),
(21, 'R', 'permissions', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-02 11:19:40', '2017-06-02 11:19:40', NULL),
(22, 'RU', 'flats-residents', NULL, 'Grants READ and UPDATE permissions to ANY USERS', 0, '2017-06-02 12:30:40', '2017-06-03 09:10:01', NULL),
(23, 'R', 'flats-residents', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-02 12:31:09', '2017-06-02 12:31:09', NULL),
(24, 'RU', 'users-roles', NULL, 'Grants READ and UPDATE permissions to ANY USERS', 0, '2017-06-03 06:28:07', '2017-06-03 09:10:23', NULL),
(25, 'R', 'users-roles', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-03 06:28:29', '2017-06-03 06:28:29', NULL),
(26, 'RU', 'roles-permissions', NULL, 'Grants READ and UPDATE permissions to ANY USERS', 0, '2017-06-03 06:29:16', '2017-06-03 06:29:16', NULL),
(27, 'R', 'roles-permissions', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-03 06:29:40', '2017-06-03 06:29:40', NULL),
(28, 'D', 'accounts', NULL, 'Grants DELETE permission to ANY USERS', 0, '2017-06-06 07:36:32', '2017-06-06 07:36:32', NULL),
(29, 'CRU', 'accounts', NULL, 'Grants ALL but Delete permissions to ANY USERS', 0, '2017-06-06 07:37:57', '2017-06-06 07:37:57', NULL),
(30, 'R', 'accounts', 'return params.user_id === params.model.owner_id', 'Grants READ ONLY permissions to USER SPECIFIC record', 0, '2017-03-21 11:43:30', '2017-06-08 09:43:39', NULL),
(31, 'RU', 'user-profile', 'return data.user_id === data.model.owner_id', 'Grants RU permissions to USER\'s OWN RECORD', 0, '2017-06-08 09:42:40', '2017-06-08 09:42:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions_roles`
--

CREATE TABLE `permissions_roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `permission_id` int(10) UNSIGNED DEFAULT NULL,
  `role_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions_roles`
--

INSERT INTO `permissions_roles` (`id`, `permission_id`, `role_id`, `created_at`, `updated_at`) VALUES
(610, 29, 3, '2017-06-08 09:53:45', NULL),
(611, 31, 3, '2017-06-08 09:53:45', NULL),
(612, 28, 4, '2017-06-08 09:53:50', NULL),
(622, 1, 1, '2017-06-08 11:54:30', NULL),
(623, 17, 1, '2017-06-08 11:54:30', NULL),
(624, 16, 1, '2017-06-08 11:54:30', NULL),
(625, 18, 1, '2017-06-08 11:54:30', NULL),
(626, 23, 1, '2017-06-08 11:54:30', NULL),
(627, 21, 1, '2017-06-08 11:54:30', NULL),
(628, 25, 1, '2017-06-08 11:54:30', NULL),
(629, 19, 1, '2017-06-08 11:54:30', NULL),
(630, 27, 1, '2017-06-08 11:54:30', NULL),
(631, 3, 5, '2017-06-08 11:54:31', NULL),
(632, 5, 5, '2017-06-08 11:54:31', NULL),
(633, 6, 5, '2017-06-08 11:54:31', NULL),
(634, 7, 5, '2017-06-08 11:54:31', NULL),
(635, 9, 5, '2017-06-08 11:54:31', NULL),
(636, 20, 5, '2017-06-08 11:54:31', NULL),
(637, 22, 5, '2017-06-08 11:54:31', NULL),
(638, 24, 5, '2017-06-08 11:54:31', NULL),
(639, 26, 5, '2017-06-08 11:54:31', NULL),
(640, 31, 5, '2017-06-08 11:54:31', NULL),
(641, 4, 2, '2017-06-08 11:54:35', NULL),
(642, 17, 2, '2017-06-08 11:54:35', NULL),
(643, 18, 2, '2017-06-08 11:54:35', NULL),
(644, 31, 2, '2017-06-08 11:54:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `is_a` varchar(20) NOT NULL DEFAULT 'owner',
  `remarks` varchar(254) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `first_name`, `last_name`, `is_a`, `remarks`, `owner_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Hari', 'krish', 'owner', NULL, 22, '2017-05-27 08:11:40', '2017-06-06 12:27:08', NULL),
(2, 'Prab', '', 'owner', NULL, 27, '2017-05-27 08:11:40', '2017-06-07 05:37:40', NULL),
(3, 'Moha', '', 'owner', NULL, 28, '2017-05-27 08:11:40', '2017-06-07 05:37:51', NULL),
(4, 'Jeri', '', 'owner', NULL, 29, '2017-05-27 08:11:40', '2017-06-07 05:38:00', NULL),
(5, 'Srid', '', 'owner', NULL, 23, '2017-05-27 08:11:40', '2017-06-07 05:38:10', NULL),
(6, 'Srin', '', 'owner', NULL, 30, '2017-05-27 08:11:40', '2017-06-07 05:38:21', NULL),
(7, 'Arun', '', 'owner', NULL, 31, '2017-05-27 08:11:40', '2017-06-07 05:38:28', NULL),
(8, 'Jaya', '', 'owner', NULL, 32, '2017-05-27 08:11:40', '2017-06-07 05:38:35', NULL),
(9, 'Muth', '', 'owner', NULL, 22, '2017-05-27 08:11:40', '2017-06-07 04:50:53', NULL),
(10, 'Pret', '', 'owner', NULL, 27, '2017-05-27 08:11:40', '2017-06-07 05:38:50', NULL),
(11, 'Ezhi', '', 'owner', NULL, 28, '2017-05-27 08:11:40', '2017-06-07 05:38:58', NULL),
(12, 'Yoga', '', 'owner', NULL, 29, '2017-05-27 08:11:40', '2017-06-07 05:39:08', NULL),
(13, 'Ownerf1', '', 'owner', NULL, 23, '2017-05-27 08:11:40', '2017-06-07 05:39:18', NULL),
(14, 'Ownerf2', '', 'owner', NULL, 30, '2017-05-27 08:11:40', '2017-06-07 05:39:29', NULL),
(15, 'Ownerf5', '', 'owner', NULL, 31, '2017-05-27 08:11:40', '2017-06-07 05:39:38', NULL),
(16, 'Ownerf8', '', 'owner', NULL, 32, '2017-05-27 08:11:40', '2017-06-07 05:39:49', NULL),
(17, 'Ownerg6', '', 'owner', NULL, 22, '2017-05-27 08:11:40', '2017-06-07 05:40:05', NULL),
(18, 'Tenantf1', '', 'tenant', NULL, 27, '2017-05-27 08:11:40', '2017-06-07 05:40:14', NULL),
(19, 'Tenantf2', '', 'tenant', NULL, 28, '2017-05-27 08:11:40', '2017-06-07 05:40:27', NULL),
(20, 'Tenantf5', '', 'tenant', NULL, 29, '2017-05-27 08:11:40', '2017-06-07 05:40:35', NULL),
(21, 'Tenantf8', '', 'tenant', NULL, 22, '2017-05-27 08:11:40', '2017-06-07 05:41:10', NULL),
(22, 'Tenantg4', '', 'tenant', NULL, 27, '2017-05-27 08:11:40', '2017-06-07 05:41:18', NULL),
(23, 'Tenantg6', '', 'tenant', NULL, 28, '2017-05-27 08:11:40', '2017-06-07 05:41:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `inherits` varchar(255) DEFAULT NULL,
  `owner_id` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `inherits`, `owner_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'guest', 'A role to view records such as accounts', '', 0, '2017-03-21 11:43:30', '2017-05-31 16:10:19', NULL),
(2, 'member-t', 'Role can update own record, such as USER PROFILE', '', 0, '2017-03-21 11:43:30', '2017-06-03 09:17:06', NULL),
(3, 'supervisor', 'A role to add/edit records such as accounts', NULL, 0, '2017-03-21 11:43:30', NULL, NULL),
(4, 'manager', 'A role to delete records such as accounts', 'supervisor', 0, '2017-03-21 11:43:30', '2017-06-08 09:54:06', NULL),
(5, 'admin', 'A role to add/edit/delete records such as Roles, Permissions, Users', '', 0, '2017-03-21 11:43:30', '2017-06-08 09:52:54', NULL),
(6, 'member-o', 'Inherits member-t role; plus it has few read-only permissions on few modules', 'member-t', 0, '2017-06-05 12:30:00', '2017-06-05 12:30:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles_users`
--

CREATE TABLE `roles_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `role_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles_users`
--

INSERT INTO `roles_users` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(90, 21, 1, '2017-06-06 07:42:05', NULL),
(100, 25, 1, '2017-06-06 07:47:28', NULL),
(101, 25, 3, '2017-06-06 07:47:28', NULL),
(102, 25, 4, '2017-06-06 07:47:28', NULL),
(114, 24, 3, '2017-06-07 05:35:19', NULL),
(117, 30, 6, '2017-06-07 05:35:38', NULL),
(118, 31, 6, '2017-06-07 05:35:40', NULL),
(119, 32, 6, '2017-06-07 05:35:44', NULL),
(120, 28, 2, '2017-06-07 05:35:50', NULL),
(121, 29, 2, '2017-06-07 05:35:59', NULL),
(122, 26, 5, '2017-06-07 05:36:02', NULL),
(132, 23, 6, '2017-06-07 05:36:47', NULL),
(133, 22, 2, '2017-06-07 05:36:48', NULL),
(134, 27, 2, '2017-06-07 05:36:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `confirmed` int(11) DEFAULT NULL,
  `confirmation_code` varchar(50) DEFAULT NULL,
  `social_network_id` varchar(128) DEFAULT NULL,
  `social_network_name` varchar(25) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `first_name`, `last_name`, `email`, `password`, `confirmed`, `confirmation_code`, `social_network_id`, `social_network_name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(21, 'guestuser', 'guest', 'user', 'guest@eastgate.in', '$2a$10$cGegWnAnfgaWRBelZQNihOsQkTef7EAQ0zQnXsDm/G4DlgrGmW1cC', NULL, NULL, NULL, NULL, '2017-05-31 16:11:43', '2017-05-31 16:11:43', NULL),
(22, 'membert1user', 'membert1', 'user', 'membert1@eastgate.in', '$2a$10$rYmXiRI.mkJV57WC9.d.7OIOX6rHOxJnm3JUVmjOiAr722cKtRVY.', NULL, NULL, NULL, NULL, '2017-05-31 16:14:30', '2017-06-07 05:14:50', NULL),
(23, 'membero1user', 'membero1', 'user', 'membero1@eastgate.in', '$2a$10$ZVX8M1vHD6Ib.Crfq1WNg.LysdCwckEWpRY64viZRJswijJkwIy/S', NULL, NULL, NULL, NULL, '2017-06-05 12:24:18', '2017-06-07 05:16:12', NULL),
(24, 'superuser', 'super', 'user', 'su@eastgate.in', '$2a$10$/Ubq4LqNqBO1QzgHTECLGewcAC3XvXsnPa9fHD7h8z0pQlxskHYle', NULL, NULL, NULL, NULL, '2017-06-06 07:28:52', '2017-06-06 07:28:52', NULL),
(25, 'manageuser', 'manage', 'user', 'manager@eastgate.in', '$2a$10$jOFzHKTI9Duxy.hIYYrOuuJJou03rKO1IHGiB/42oGxASxvTPQBiq', NULL, NULL, NULL, NULL, '2017-06-06 07:33:33', '2017-06-06 07:33:33', NULL),
(26, 'adminuser', 'admin', 'user', 'admin@eastgate.in', '$2a$10$EBPS5L/mdfTRAlqOy7Z.D.zqe/pUjehoj4GVLhyMXMuKaCOnZyAyC', NULL, NULL, NULL, NULL, '2017-06-06 07:33:56', '2017-06-06 07:33:56', NULL),
(27, 'membert2user', 'Membert2', 'User', 'membert2@eastgate.in', '$2a$10$SQECON.2SDdSEu1HR7pmiulYyJJ68CC5eNAxGTSTNpv9DXBy/xCEC', NULL, NULL, NULL, NULL, '2017-06-07 05:30:44', '2017-06-07 05:30:44', NULL),
(28, 'Membert3User', 'Membert3', 'User', 'membert3@eastgate.in', '$2a$10$ausJ4lpriZjCxljSsUR9T.xkm4GXez7E/XIYqKhJZNoRwI2zrFMcy', NULL, NULL, NULL, NULL, '2017-06-07 05:32:03', '2017-06-07 05:32:03', NULL),
(29, 'Membert4User', 'Membert4', 'User', 'membert4@eastgate.in', '$2a$10$wKHPN0zpCzRff/iICIoN2uxHoiPg07w4UprIB5Xh/ReDApKB4DucC', NULL, NULL, NULL, NULL, '2017-06-07 05:32:41', '2017-06-07 05:32:41', NULL),
(30, 'Membero2User', 'Membero2', 'User', 'membero2@eastgate.in', '$2a$10$gwoDOLvehLRaF.Nw7bs9DOICqCbdXDkhFtX7m6DwE3vbBbzSUN066', NULL, NULL, NULL, NULL, '2017-06-07 05:33:14', '2017-06-07 05:33:14', NULL),
(31, 'Membero3User', 'Membero3', 'User', 'membero3@eastgate.in', '$2a$10$5FSUcoX2v7FoR17k0.SBfuL5aafSBuH0pKZkmF4OxSDZ2SwbLeTwm', NULL, NULL, NULL, NULL, '2017-06-07 05:33:47', '2017-06-07 05:33:47', NULL),
(32, 'Membero4User', 'Membero4', 'User', 'membero4@eastgate.in', '$2a$10$LZlp3RRBAA1BNphbpwXGl.I67ocU2JnJkXIEW6WJiQhnD.UgBuMQW', NULL, NULL, NULL, NULL, '2017-06-07 05:34:16', '2017-06-07 05:34:16', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `flats`
--
ALTER TABLE `flats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `flats_block_number_flat_number_unique` (`block_number`,`flat_number`);

--
-- Indexes for table `flats_residents`
--
ALTER TABLE `flats_residents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flats_residents_flat_id_foreign` (`flat_id`),
  ADD KEY `flats_residents_resident_id_foreign` (`resident_id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maintenance_accounts`
--
ALTER TABLE `maintenance_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_operations_resource_condition_unique` (`operations`,`resource`,`condition`);

--
-- Indexes for table `permissions_roles`
--
ALTER TABLE `permissions_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permissions_roles_permission_id_foreign` (`permission_id`),
  ADD KEY `permissions_roles_role_id_foreign` (`role_id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `residents_first_name_last_name_is_a_unique` (`first_name`,`last_name`,`is_a`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `roles_users`
--
ALTER TABLE `roles_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_users_user_id_foreign` (`user_id`),
  ADD KEY `roles_users_role_id_foreign` (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flats`
--
ALTER TABLE `flats`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
--
-- AUTO_INCREMENT for table `flats_residents`
--
ALTER TABLE `flats_residents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;
--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `maintenance_accounts`
--
ALTER TABLE `maintenance_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `permissions_roles`
--
ALTER TABLE `permissions_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=645;
--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `roles_users`
--
ALTER TABLE `roles_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `flats_residents`
--
ALTER TABLE `flats_residents`
  ADD CONSTRAINT `flats_residents_flat_id_foreign` FOREIGN KEY (`flat_id`) REFERENCES `flats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flats_residents_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permissions_roles`
--
ALTER TABLE `permissions_roles`
  ADD CONSTRAINT `permissions_roles_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permissions_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roles_users`
--
ALTER TABLE `roles_users`
  ADD CONSTRAINT `roles_users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `roles_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
