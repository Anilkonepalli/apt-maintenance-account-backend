-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 03, 2017 at 02:29 PM
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
(109, 41, 1, '2017-06-03 06:13:44', NULL),
(115, 42, 19, '2017-06-03 06:19:40', NULL),
(116, 42, 14, '2017-06-03 06:19:40', NULL),
(117, 43, 7, '2017-06-03 06:19:41', NULL);

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
(12, 'item11', 'F1', 4, 2017, 'Ownerf1', 'dr', '600.00', '-600.00', 'Monthly Maintenance', '2017-04-21', 'test', 0, '2017-04-25 17:19:01', '2017-05-16 17:46:34', NULL),
(13, NULL, 'G4', 4, 2017, NULL, '', '600.00', '600.00', NULL, '2017-04-29', NULL, 0, '2017-04-29 11:37:12', '2017-04-29 11:40:05', '2017-04-29 11:41:14'),
(14, NULL, 'F6', 4, 2017, NULL, 'cr', '600.00', '1200.00', 'Monthly Maintenance', '2017-04-29', 'paid', 0, '2017-04-29 11:39:41', '2017-04-29 11:41:14', '2017-04-29 11:41:16'),
(15, NULL, 'G8', 4, 2017, NULL, 'cr', '600.00', '1800.00', 'Monthly Maintenance', '2017-04-29', 'paid', 0, '2017-04-29 11:39:45', '2017-04-29 11:39:46', '2017-04-29 11:40:05'),
(16, NULL, 'G4', 4, 2017, NULL, 'cr', '600.00', '0.00', 'Monthly Maintenance', '2017-04-29', 'paid', 0, '2017-04-29 11:41:50', '2017-05-16 17:46:34', NULL),
(17, NULL, 'F4', 5, 2017, NULL, 'cr', '600.00', '600.00', 'Monthly Maintenance', '2017-05-01', 'paid', 0, '2017-05-01 05:27:44', '2017-05-16 17:46:34', NULL),
(18, NULL, 'G8', 5, 2017, NULL, 'cr', '600.00', '1200.00', 'Monthly Maintenance', '2017-05-01', 'paid', 0, '2017-05-01 17:57:15', '2017-05-16 17:46:34', NULL),
(19, NULL, 'F6', 5, 2017, NULL, 'cr', '600.00', '3000.00', 'Monthly Maintenance', '2017-05-02', 'paid', 0, '2017-05-02 07:06:28', '2017-05-13 04:02:06', '2017-05-13 04:02:06'),
(20, NULL, 'F1', 5, 2017, NULL, 'cr', '600.00', '3600.00', 'Monthly Maintenance', '2017-05-02', 'paid', 0, '2017-05-02 11:35:50', '2017-05-02 11:37:32', '2017-05-02 11:37:32'),
(21, 'Testing new Account form', 'F1', 1, 2017, 'Ownerf1', 'dr', '100.00', '1100.00', 'Monthly Maintenance', '2017-05-16', 'Testing new account form', 0, '2017-05-16 17:30:47', '2017-05-16 18:03:47', NULL),
(22, NULL, 'F5', 5, 2017, NULL, 'cr', '600.00', '1700.00', 'Monthly Maintenance', '2017-05-16', 'paid', 0, '2017-05-16 18:03:45', '2017-05-16 18:03:47', NULL),
(23, NULL, 'F6', 5, 2017, NULL, 'cr', '600.00', '2300.00', 'Monthly Maintenance', '2017-05-16', 'paid', 0, '2017-05-16 18:03:47', '2017-05-16 18:03:47', NULL);

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
(2, 'RUD', 'users', '(params)=>{return params.user.id === params.loggedUser.id;}', 'Grants RUD PERMISSIONS to user\'s OWN RECORDS', 0, '2017-03-21 11:43:30', '2017-05-31 16:18:52', NULL),
(3, 'CRUD', 'accounts', NULL, 'Grants ALL PERMISSIONS to ANY USERS', 0, '2017-03-21 11:43:30', '2017-05-31 14:59:46', NULL),
(4, 'CRUD', 'accounts', '(params)=>{return params.user.id === params.account.owner_id;}', 'Grants ALL PERMISSIONS to user\'s OWN RECORDS', 0, '2017-03-21 11:43:30', '2017-05-31 15:00:10', NULL),
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
(22, 'RU', 'flats-residents', NULL, 'Grants READ and EDIT permissions to ANY USERS', 0, '2017-06-02 12:30:40', '2017-06-02 12:30:40', NULL),
(23, 'R', 'flats-residents', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-02 12:31:09', '2017-06-02 12:31:09', NULL),
(24, 'RU', 'users-roles', NULL, 'Grants READ and Update permissions to ANY USERS', 0, '2017-06-03 06:28:07', '2017-06-03 06:28:07', NULL),
(25, 'R', 'users-roles', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-03 06:28:29', '2017-06-03 06:28:29', NULL),
(26, 'RU', 'roles-permissions', NULL, 'Grants READ and UPDATE permissions to ANY USERS', 0, '2017-06-03 06:29:16', '2017-06-03 06:29:16', NULL),
(27, 'R', 'roles-permissions', NULL, 'Grants READ ONLY permission to ANY USERS', 0, '2017-06-03 06:29:40', '2017-06-03 06:29:40', NULL);

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
(131, 9, 5, '2017-05-31 14:50:38', NULL),
(141, 2, 2, '2017-05-31 16:19:14', NULL),
(142, 4, 2, '2017-05-31 16:19:14', NULL),
(285, 1, 1, '2017-06-03 08:55:42', NULL),
(286, 17, 1, '2017-06-03 08:55:42', NULL),
(287, 16, 1, '2017-06-03 08:55:42', NULL),
(288, 18, 1, '2017-06-03 08:55:42', NULL),
(289, 19, 1, '2017-06-03 08:55:42', NULL),
(290, 21, 1, '2017-06-03 08:55:42', NULL),
(291, 23, 1, '2017-06-03 08:55:42', NULL),
(292, 25, 1, '2017-06-03 08:55:42', NULL),
(293, 27, 1, '2017-06-03 08:55:42', NULL),
(294, 1, 3, '2017-06-03 08:56:29', NULL),
(295, 3, 3, '2017-06-03 08:56:29', NULL),
(296, 5, 3, '2017-06-03 08:56:29', NULL),
(297, 6, 3, '2017-06-03 08:56:29', NULL),
(298, 7, 3, '2017-06-03 08:56:29', NULL),
(299, 9, 3, '2017-06-03 08:56:29', NULL),
(300, 20, 3, '2017-06-03 08:56:29', NULL),
(301, 22, 3, '2017-06-03 08:56:29', NULL),
(302, 24, 3, '2017-06-03 08:56:29', NULL),
(303, 26, 3, '2017-06-03 08:56:29', NULL);

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
(1, 'Hari', 'krish', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(2, 'Prab', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(3, 'Moha', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(4, 'Jeri', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(5, 'Srid', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(6, 'Srin', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(7, 'Arun', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(8, 'Jaya', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(9, 'Muth', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(10, 'Pret', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(11, 'Ezhi', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(12, 'Yoga', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(13, 'Ownerf1', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(14, 'Ownerf2', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(15, 'Ownerf5', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(16, 'Ownerf8', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(17, 'Ownerg6', '', 'owner', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(18, 'Tenantf1', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(19, 'Tenantf2', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(20, 'Tenantf5', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(21, 'Tenantf8', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(22, 'Tenantg4', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL),
(23, 'Tenantg6', '', 'tenant', NULL, 0, '2017-05-27 08:11:40', NULL, NULL);

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
(2, 'member', 'A role to update records such as user profiles', 'guest', 0, '2017-03-21 11:43:30', NULL, NULL),
(3, 'supervisor', 'A role to add/edit records such as accounts', NULL, 0, '2017-03-21 11:43:30', NULL, NULL),
(4, 'manager', 'A role to delete records such as accounts', 'member,supervisor', 0, '2017-03-21 11:43:30', NULL, NULL),
(5, 'admin', 'A role to add/edit/delete records such as Roles, Permissions, Users', 'manager', 0, '2017-03-21 11:43:30', NULL, NULL);

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
(19, 2, 1, '2017-05-30 16:08:17', NULL),
(65, 1, 3, '2017-06-03 08:27:52', NULL),
(67, 21, 1, '2017-06-03 08:37:38', NULL),
(68, 22, 2, '2017-06-03 08:38:20', NULL);

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
(1, 'testuser1', 'user1', 'test', 'user1@eastgate.in', '$2a$10$NvHqp/DRSKBPzcOP.xyMpeKl/TQZ5C5CJkSG/wtX3Uj.lFJmMBiB6', 1, '', NULL, NULL, '2017-03-21 11:43:31', NULL, NULL),
(2, 'testuser2', 'user2', 'test', 'user2@eastgate.in', '$2a$10$q5q7OSOeY/.VFOXvvNgjdeWNIjDyJ1bQkSvaDt/pIbmeQmedausDq', 1, '', NULL, NULL, '2017-03-21 11:43:31', NULL, NULL),
(3, 'testuser3', 'user3', 'test', 'user3@eastgate.in', '$2a$10$ceVkGEGEOzCWz5J0vAlHTusirSTUWwCxuT3ktXXx/dqsrPkaSLw6q', 1, '', NULL, NULL, '2017-03-21 11:43:31', NULL, NULL),
(7, 'armk100', NULL, NULL, 'armk100@gmail.com', '', NULL, NULL, '110460632763449158780', 'google', '2017-03-23 11:38:12', '2017-03-23 11:38:12', NULL),
(8, 'Mohankumar Anna', NULL, NULL, 'mohankumar.anna@outlook.com', '', NULL, NULL, '1140729172720113', 'facebook', '2017-03-23 11:38:24', '2017-03-23 11:38:24', '2017-05-27 16:17:51'),
(16, 'test11', 'test', 'test', 'test11@eastgate.com', '$2a$10$mRsFz.hurVhnKwCuj8wCLeVKtsVaF0c.tLOcoeJbaY6bbSjXWQgbi', NULL, NULL, NULL, NULL, '2017-05-28 12:38:34', '2017-05-28 12:38:34', '2017-05-31 16:10:50'),
(17, 'a', 'a', 'a', 'a@a.a', '$2a$10$hV9wKJlp68Bg/gPaHlfFFeHWGJCBmnL3NrrlZ4DoGONiJWc77lnv2', NULL, NULL, NULL, NULL, '2017-05-28 12:44:41', '2017-05-28 12:44:41', '2017-05-30 14:10:07'),
(18, 'd', 'd', 'd', 'd', '$2a$10$j5ZwglO2hpwwMpK7p6Zxo.oVvHOu9yx1KjrH5D94UwVRZQq4JB9FW', NULL, NULL, NULL, NULL, '2017-05-28 12:48:50', '2017-05-28 13:04:31', '2017-05-30 14:10:03'),
(19, 'a', 'a', 'a', 'a', '$2a$10$UyCALSL2COOVnJ/47xHQxuzjBWAF2rrT7QeFrWSDg61y9O2jCDze6', NULL, NULL, NULL, NULL, '2017-05-30 14:10:25', '2017-05-30 14:10:25', '2017-05-30 14:12:40'),
(20, 'b', 'b', 'b', 'b', '$2a$10$mVO.41XcvEwutUqhCQsEH.m83x7v6SMCahjvgJ.Sap5yEZywaeKa2', NULL, NULL, NULL, NULL, '2017-05-30 14:12:30', '2017-05-30 14:12:30', '2017-05-30 14:12:36'),
(21, 'guestuser', 'guest', 'user', 'guest@eastgate.in', '$2a$10$cGegWnAnfgaWRBelZQNihOsQkTef7EAQ0zQnXsDm/G4DlgrGmW1cC', NULL, NULL, NULL, NULL, '2017-05-31 16:11:43', '2017-05-31 16:11:43', NULL),
(22, 'memberuser', 'member', 'user', 'member@eastgate.in', '$2a$10$rhzYoc38TXJtYHcjrdCiKOuGsNbF2mC4.Ng68uDzhgMdAjNuEG.Fq', NULL, NULL, NULL, NULL, '2017-05-31 16:14:30', '2017-05-31 16:14:30', NULL);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;
--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `maintenance_accounts`
--
ALTER TABLE `maintenance_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `permissions_roles`
--
ALTER TABLE `permissions_roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=304;
--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `roles_users`
--
ALTER TABLE `roles_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
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
