-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 19, 2017 at 01:27 PM
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
(194, 41, 9, '2017-06-19 07:47:29', NULL),
(195, 41, 25, '2017-06-19 07:47:29', NULL),
(198, 42, 10, '2017-06-19 07:47:46', NULL),
(199, 42, 26, '2017-06-19 07:47:46', NULL),
(201, 43, 11, '2017-06-19 07:47:57', NULL),
(203, 44, 12, '2017-06-19 07:48:07', NULL),
(212, 45, 13, '2017-06-19 07:48:45', NULL),
(213, 45, 29, '2017-06-19 07:48:45', NULL),
(214, 46, 14, '2017-06-19 07:48:47', NULL),
(220, 47, 15, '2017-06-19 07:49:02', NULL),
(224, 48, 16, '2017-06-19 07:49:18', NULL),
(225, 48, 32, '2017-06-19 07:49:18', NULL),
(232, 33, 1, '2017-06-19 07:49:44', NULL),
(233, 33, 17, '2017-06-19 07:49:44', NULL),
(239, 34, 2, '2017-06-19 07:49:52', NULL),
(241, 35, 3, '2017-06-19 07:50:07', NULL),
(244, 36, 4, '2017-06-19 07:50:29', NULL),
(245, 36, 20, '2017-06-19 07:50:29', NULL),
(247, 37, 5, '2017-06-19 07:50:39', NULL),
(250, 38, 6, '2017-06-19 07:50:56', NULL),
(251, 38, 22, '2017-06-19 07:50:56', NULL),
(253, 39, 7, '2017-06-19 07:51:07', NULL),
(254, 39, 23, '2017-06-19 07:51:07', NULL),
(256, 40, 8, '2017-06-19 07:51:20', NULL),
(257, 40, 24, '2017-06-19 07:51:20', NULL);

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
(28, 'testing', 'F2', 5, 2017, 'Tenantf2', 'cr', '600.00', '1200.00', 'Monthly Maintenance', '2017-06-07', 'testing', 28, '2017-06-07 09:11:06', '2017-06-07 09:11:07', NULL),
(29, NULL, 'F2', 6, 2017, NULL, 'cr', '600.00', '1800.00', 'Monthly Maintenance', '2017-06-17', 'paid', 0, '2017-06-17 16:33:55', '2017-06-17 16:33:55', NULL);

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
(656, 26, 5, '2017-06-19 07:52:56', NULL),
(657, 22, 5, '2017-06-19 07:52:56', NULL),
(658, 6, 5, '2017-06-19 07:52:56', NULL),
(659, 5, 5, '2017-06-19 07:52:56', NULL),
(660, 3, 5, '2017-06-19 07:52:56', NULL),
(661, 9, 5, '2017-06-19 07:52:56', NULL),
(662, 7, 5, '2017-06-19 07:52:56', NULL),
(663, 24, 5, '2017-06-19 07:52:56', NULL),
(664, 31, 5, '2017-06-19 07:52:56', NULL),
(665, 20, 5, '2017-06-19 07:52:56', NULL),
(666, 1, 1, '2017-06-19 07:53:00', NULL),
(667, 17, 1, '2017-06-19 07:53:00', NULL),
(668, 16, 1, '2017-06-19 07:53:00', NULL),
(669, 23, 1, '2017-06-19 07:53:00', NULL),
(670, 21, 1, '2017-06-19 07:53:00', NULL),
(671, 25, 1, '2017-06-19 07:53:00', NULL),
(672, 19, 1, '2017-06-19 07:53:00', NULL),
(673, 27, 1, '2017-06-19 07:53:00', NULL),
(674, 18, 1, '2017-06-19 07:53:00', NULL),
(680, 4, 2, '2017-06-19 07:53:14', NULL),
(681, 17, 2, '2017-06-19 07:53:14', NULL),
(682, 18, 2, '2017-06-19 07:53:14', NULL),
(683, 31, 2, '2017-06-19 07:53:14', NULL),
(684, 29, 3, '2017-06-19 07:53:21', NULL),
(685, 31, 3, '2017-06-19 07:53:21', NULL),
(686, 28, 4, '2017-06-19 07:53:39', NULL);

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
(1, 'og1', '', 'owner', NULL, 23, '2017-05-27 08:11:40', '2017-06-19 07:46:38', NULL),
(2, 'og2', '', 'owner', NULL, 30, '2017-05-27 08:11:40', '2017-06-19 07:34:16', NULL),
(3, 'og3', '', 'owner', NULL, 31, '2017-05-27 08:11:40', '2017-06-19 07:34:30', NULL),
(4, 'og4', '', 'owner', NULL, 32, '2017-05-27 08:11:40', '2017-06-19 07:34:41', NULL),
(5, 'og5', '', 'owner', NULL, 139, '2017-05-27 08:11:40', '2017-06-19 07:34:56', NULL),
(6, 'og6', '', 'owner', NULL, 140, '2017-05-27 08:11:40', '2017-06-19 07:35:12', NULL),
(7, 'og7', '', 'owner', NULL, 141, '2017-05-27 08:11:40', '2017-06-19 07:35:25', NULL),
(8, 'og8', '', 'owner', NULL, 142, '2017-05-27 08:11:40', '2017-06-19 07:35:42', NULL),
(9, 'of1', '', 'owner', NULL, 151, '2017-05-27 08:11:40', '2017-06-19 07:36:20', NULL),
(10, 'of2', '', 'owner', NULL, 152, '2017-05-27 08:11:40', '2017-06-19 07:36:35', NULL),
(11, 'of3', '', 'owner', NULL, 153, '2017-05-27 08:11:40', '2017-06-19 07:36:50', NULL),
(12, 'of4', '', 'owner', NULL, 154, '2017-05-27 08:11:40', '2017-06-19 07:37:06', NULL),
(13, 'of5', '', 'owner', NULL, 155, '2017-05-27 08:11:40', '2017-06-19 07:37:22', NULL),
(14, 'of6', '', 'owner', NULL, 156, '2017-05-27 08:11:40', '2017-06-19 07:37:34', NULL),
(15, 'of7', '', 'owner', NULL, 157, '2017-05-27 08:11:40', '2017-06-19 07:37:47', NULL),
(16, 'of8', '', 'owner', NULL, 158, '2017-05-27 08:11:40', '2017-06-19 07:37:58', NULL),
(17, 'tg1', '', 'tenant', NULL, 22, '2017-05-27 08:11:40', '2017-06-19 07:38:15', NULL),
(18, 'tg2', '', 'tenant', NULL, 27, '2017-05-27 08:11:40', '2017-06-19 07:38:23', NULL),
(19, 'tg3', '', 'tenant', NULL, 28, '2017-05-27 08:11:40', '2017-06-19 07:38:31', NULL),
(20, 'tg4', '', 'tenant', NULL, 29, '2017-05-27 08:11:40', '2017-06-19 07:38:38', NULL),
(21, 'tg5', '', 'tenant', NULL, 135, '2017-05-27 08:11:40', '2017-06-19 07:38:51', NULL),
(22, 'tg6', '', 'tenant', NULL, 136, '2017-05-27 08:11:40', '2017-06-19 07:39:01', NULL),
(23, 'tg7', '', 'tenant', NULL, 137, '2017-05-27 08:11:40', '2017-06-19 07:39:14', NULL),
(24, 'tg8', '', 'tenant', NULL, 138, '2017-06-19 07:03:12', '2017-06-19 07:39:39', NULL),
(25, 'tf1', '', 'tenant', NULL, 143, '2017-06-19 07:03:25', '2017-06-19 07:40:40', NULL),
(26, 'tf2', '', 'tenant', NULL, 144, '2017-06-19 07:04:11', '2017-06-19 07:40:55', NULL),
(27, 'tf3', '', 'tenant', NULL, 145, '2017-06-19 07:04:31', '2017-06-19 07:41:09', NULL),
(28, 'tf4', '', 'tenant', NULL, 146, '2017-06-19 07:05:04', '2017-06-19 07:41:28', NULL),
(29, 'tf5', '', 'tenant', NULL, 147, '2017-06-19 07:05:40', '2017-06-19 07:41:47', NULL),
(30, 'tf6', '', 'tenant', NULL, 148, '2017-06-19 07:06:16', '2017-06-19 07:42:01', NULL),
(31, 'tf7', '', 'tenant', NULL, 149, '2017-06-19 07:06:57', '2017-06-19 07:42:22', NULL),
(32, 'tf8', '', 'tenant', NULL, 150, '2017-06-19 07:10:11', '2017-06-19 07:42:46', NULL);

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
(143, 26, 5, '2017-06-19 07:54:16', NULL),
(144, 21, 1, '2017-06-19 07:54:17', NULL),
(145, 25, 1, '2017-06-19 07:54:18', NULL),
(146, 25, 3, '2017-06-19 07:54:18', NULL),
(147, 25, 4, '2017-06-19 07:54:18', NULL),
(148, 151, 6, '2017-06-19 07:54:27', NULL),
(149, 152, 6, '2017-06-19 07:54:33', NULL),
(150, 153, 6, '2017-06-19 07:54:39', NULL),
(151, 154, 6, '2017-06-19 07:54:44', NULL),
(152, 155, 6, '2017-06-19 07:54:49', NULL),
(153, 156, 6, '2017-06-19 07:54:54', NULL),
(154, 157, 6, '2017-06-19 07:55:00', NULL),
(155, 158, 6, '2017-06-19 07:55:04', NULL),
(156, 23, 6, '2017-06-19 07:55:07', NULL),
(157, 30, 6, '2017-06-19 07:55:14', NULL),
(158, 31, 6, '2017-06-19 07:55:17', NULL),
(159, 32, 6, '2017-06-19 07:55:18', NULL),
(160, 139, 6, '2017-06-19 07:55:23', NULL),
(161, 140, 6, '2017-06-19 07:55:27', NULL),
(162, 141, 6, '2017-06-19 07:55:32', NULL),
(163, 142, 6, '2017-06-19 07:55:37', NULL),
(164, 24, 3, '2017-06-19 07:55:46', NULL),
(165, 143, 2, '2017-06-19 07:55:55', NULL),
(166, 144, 2, '2017-06-19 07:56:03', NULL),
(167, 145, 2, '2017-06-19 07:56:08', NULL),
(168, 146, 2, '2017-06-19 07:56:15', NULL),
(169, 147, 2, '2017-06-19 07:56:29', NULL),
(170, 148, 2, '2017-06-19 07:56:40', NULL),
(171, 149, 2, '2017-06-19 07:56:45', NULL),
(172, 150, 2, '2017-06-19 07:56:50', NULL),
(173, 22, 2, '2017-06-19 07:56:52', NULL),
(174, 27, 2, '2017-06-19 07:56:55', NULL),
(175, 28, 2, '2017-06-19 07:56:56', NULL),
(176, 29, 2, '2017-06-19 07:56:57', NULL),
(177, 135, 2, '2017-06-19 07:57:01', NULL),
(178, 136, 2, '2017-06-19 07:57:06', NULL),
(179, 137, 2, '2017-06-19 07:57:11', NULL),
(180, 138, 2, '2017-06-19 07:57:16', NULL);

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
(21, 'guestuser', 'guest', 'user', 'guest@eastgate.in', '$2a$10$cGegWnAnfgaWRBelZQNihOsQkTef7EAQ0zQnXsDm/G4DlgrGmW1cC', 1, NULL, NULL, NULL, '2017-05-31 16:11:43', '2017-05-31 16:11:43', NULL),
(22, 'tg1', 'tg1', 'user', 'tg1@eastgate.in', '$2a$10$XN0LWOv/Kr/S8L0kcOsGn.s6srfKRRSSoC10Ek.O.1gS5yJP34epO', NULL, NULL, NULL, NULL, '2017-05-31 16:14:30', '2017-06-19 07:15:16', NULL),
(23, 'og1', 'og1', 'user', 'og1@eastgate.in', '$2a$10$r59lI3VXyww/xD2in7F3.OLI9hGLTj.wff6mB0evX/qFU21PREv5u', NULL, NULL, NULL, NULL, '2017-06-05 12:24:18', '2017-06-19 07:15:40', NULL),
(24, 'superuser', 'super', 'user', 'su@eastgate.in', '$2a$10$/Ubq4LqNqBO1QzgHTECLGewcAC3XvXsnPa9fHD7h8z0pQlxskHYle', NULL, NULL, NULL, NULL, '2017-06-06 07:28:52', '2017-06-06 07:28:52', NULL),
(25, 'manageuser', 'manage', 'user', 'manager@eastgate.in', '$2a$10$jOFzHKTI9Duxy.hIYYrOuuJJou03rKO1IHGiB/42oGxASxvTPQBiq', NULL, NULL, NULL, NULL, '2017-06-06 07:33:33', '2017-06-06 07:33:33', NULL),
(26, 'adminuser', 'admin', 'user', 'admin@eastgate.in', '$2a$10$EBPS5L/mdfTRAlqOy7Z.D.zqe/pUjehoj4GVLhyMXMuKaCOnZyAyC', 1, '', NULL, NULL, '2017-06-06 07:33:56', '2017-06-06 07:33:56', NULL),
(27, 'tg2', 'tg2', 'user', 'tg2@eastgate.in', '$2a$10$Q.7ZsdJRFUooBpN7EcNSm.vwXHx0t5dI3nLKscuGG0hqZpJTpkyLC', NULL, NULL, NULL, NULL, '2017-06-07 05:30:44', '2017-06-19 07:16:15', NULL),
(28, 'tg3', 'tg3', 'user', 'tg3@eastgate.in', '$2a$10$tO8kwLEPTKoGtnUf7pyAU.jid.HgNuV2o.XQDpr48VfLpPYbGsj5m', NULL, NULL, NULL, NULL, '2017-06-07 05:32:03', '2017-06-19 07:16:43', NULL),
(29, 'tg4', 'tg4', 'user', 'tg4@eastgate.in', '$2a$10$z5qjcfW2UUq/P1xRlH0F/ehmgrxxeeWqaIyCPJicQ62OBsKim2YPC', NULL, NULL, NULL, NULL, '2017-06-07 05:32:41', '2017-06-19 07:17:17', NULL),
(30, 'og2', 'og2', 'user', 'og2@eastgate.in', '$2a$10$U7qKYvIWvrgoX3U01JppmOqFqa3F6zJ5/rNk1/itbK6gkln/3MGWG', NULL, NULL, NULL, NULL, '2017-06-07 05:33:14', '2017-06-19 07:17:40', NULL),
(31, 'og3', 'og3', 'user', 'og3@eastgate.in', '$2a$10$1GI3a24ADPwL4tHAKy9YWedL8tKf5.SsU1MAaKFfDnsrVA6TjnwQO', NULL, NULL, NULL, NULL, '2017-06-07 05:33:47', '2017-06-19 07:18:22', NULL),
(32, 'og4', 'og4', 'user', 'og4@eastgate.in', '$2a$10$NrrDcyZWpKdY5fg92PrxBuAvqa2PgSWyUR54woeVI8.TXg6KHe0Ze', NULL, NULL, NULL, NULL, '2017-06-07 05:34:16', '2017-06-19 07:18:45', NULL),
(134, 'test', 'test', 'user', 'mohankumar.anna@outlook.com', '$2a$10$ZnAt1SXBx7jWTowvg7OddubG.cZ2l86.B8IDaouJFkE/HDDsAFGwa', 1, NULL, NULL, NULL, '2017-06-16 07:54:02', '2017-06-17 12:29:06', NULL),
(135, 'tg5', 'tg5', 'user', 'tg5@eastgate.in', '$2a$10$XN0LWOv/Kr/S8L0kcOsGn.s6srfKRRSSoC10Ek.O.1gS5yJP34epO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(136, 'tg6', 'tg6', 'user', 'tg6@eastgate.in', '$2a$10$Q.7ZsdJRFUooBpN7EcNSm.vwXHx0t5dI3nLKscuGG0hqZpJTpkyLC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(137, 'tg7', 'tg7', 'user', 'tg7@eastgate.in', '$2a$10$tO8kwLEPTKoGtnUf7pyAU.jid.HgNuV2o.XQDpr48VfLpPYbGsj5m', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(138, 'tg8', 'tg8', 'user', 'tg8@eastgate.in', '$2a$10$z5qjcfW2UUq/P1xRlH0F/ehmgrxxeeWqaIyCPJicQ62OBsKim2YPC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(139, 'og5', 'og5', 'user', 'og5@eastgate.in', '$2a$10$r59lI3VXyww/xD2in7F3.OLI9hGLTj.wff6mB0evX/qFU21PREv5u', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(140, 'og6', 'og6', 'user', 'og6@eastgate.in', '$2a$10$U7qKYvIWvrgoX3U01JppmOqFqa3F6zJ5/rNk1/itbK6gkln/3MGWG', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(141, 'og7', 'og7', 'user', 'og7@eastgate.in', '$2a$10$1GI3a24ADPwL4tHAKy9YWedL8tKf5.SsU1MAaKFfDnsrVA6TjnwQO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(142, 'og8', 'og8', 'user', 'og8@eastgate.in', '$2a$10$NrrDcyZWpKdY5fg92PrxBuAvqa2PgSWyUR54woeVI8.TXg6KHe0Ze', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(143, 'tf1', 'tf1', 'user', 'tf1@eastgate.in', '$2a$10$XN0LWOv/Kr/S8L0kcOsGn.s6srfKRRSSoC10Ek.O.1gS5yJP34epO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(144, 'tf2', 'tf2', 'user', 'tf2@eastgate.in', '$2a$10$Q.7ZsdJRFUooBpN7EcNSm.vwXHx0t5dI3nLKscuGG0hqZpJTpkyLC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(145, 'tf3', 'tf3', 'user', 'tf3@eastgate.in', '$2a$10$tO8kwLEPTKoGtnUf7pyAU.jid.HgNuV2o.XQDpr48VfLpPYbGsj5m', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(146, 'tf4', 'tf4', 'user', 'tf4@eastgate.in', '$2a$10$z5qjcfW2UUq/P1xRlH0F/ehmgrxxeeWqaIyCPJicQ62OBsKim2YPC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(147, 'tf5', 'tf5', 'user', 'tf5@eastgate.in', '$2a$10$XN0LWOv/Kr/S8L0kcOsGn.s6srfKRRSSoC10Ek.O.1gS5yJP34epO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(148, 'tf6', 'tf6', 'user', 'tf6@eastgate.in', '$2a$10$Q.7ZsdJRFUooBpN7EcNSm.vwXHx0t5dI3nLKscuGG0hqZpJTpkyLC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(149, 'tf7', 'tf7', 'user', 'tf7@eastgate.in', '$2a$10$tO8kwLEPTKoGtnUf7pyAU.jid.HgNuV2o.XQDpr48VfLpPYbGsj5m', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(150, 'tf8', 'tf8', 'user', 'tf8@eastgate.in', '$2a$10$z5qjcfW2UUq/P1xRlH0F/ehmgrxxeeWqaIyCPJicQ62OBsKim2YPC', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(151, 'of1', 'of1', 'user', 'of1@eastgate.in', '$2a$10$r59lI3VXyww/xD2in7F3.OLI9hGLTj.wff6mB0evX/qFU21PREv5u', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(152, 'of2', 'of2', 'user', 'of2@eastgate.in', '$2a$10$U7qKYvIWvrgoX3U01JppmOqFqa3F6zJ5/rNk1/itbK6gkln/3MGWG', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(153, 'of3', 'of3', 'user', 'of3@eastgate.in', '$2a$10$1GI3a24ADPwL4tHAKy9YWedL8tKf5.SsU1MAaKFfDnsrVA6TjnwQO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(154, 'of4', 'of4', 'user', 'of4@eastgate.in', '$2a$10$NrrDcyZWpKdY5fg92PrxBuAvqa2PgSWyUR54woeVI8.TXg6KHe0Ze', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(155, 'of5', 'of5', 'user', 'of5@eastgate.in', '$2a$10$r59lI3VXyww/xD2in7F3.OLI9hGLTj.wff6mB0evX/qFU21PREv5u', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(156, 'of6', 'of6', 'user', 'of6@eastgate.in', '$2a$10$U7qKYvIWvrgoX3U01JppmOqFqa3F6zJ5/rNk1/itbK6gkln/3MGWG', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(157, 'of7', 'of7', 'user', 'of7@eastgate.in', '$2a$10$1GI3a24ADPwL4tHAKy9YWedL8tKf5.SsU1MAaKFfDnsrVA6TjnwQO', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL),
(158, 'of8', 'of8', 'user', 'of8@eastgate.in', '$2a$10$NrrDcyZWpKdY5fg92PrxBuAvqa2PgSWyUR54woeVI8.TXg6KHe0Ze', NULL, NULL, NULL, NULL, '2017-06-19 07:32:13', NULL, NULL);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;
--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `maintenance_accounts`
--
ALTER TABLE `maintenance_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `permissions_roles`
--
ALTER TABLE `permissions_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=687;
--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `roles_users`
--
ALTER TABLE `roles_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;
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
