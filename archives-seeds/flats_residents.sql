-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 09, 2017 at 08:23 PM
-- Server version: 10.0.29-MariaDB-0ubuntu0.16.04.1
-- PHP Version: 7.0.15-0ubuntu0.16.04.4

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
(1, 12, 13, '2017-04-09 14:42:06', NULL),
(2, 12, 18, '2017-04-09 14:42:06', NULL),
(3, 13, 14, '2017-04-09 14:42:33', NULL),
(4, 13, 19, '2017-04-09 14:42:33', NULL),
(5, 3, 9, '2017-04-09 14:42:49', NULL),
(6, 4, 4, '2017-04-09 14:43:22', NULL),
(7, 5, 15, '2017-04-09 14:43:36', NULL),
(8, 5, 20, '2017-04-09 14:43:36', NULL),
(9, 14, 10, '2017-04-09 14:44:35', NULL),
(10, 15, 11, '2017-04-09 14:44:52', NULL),
(11, 15, 12, '2017-04-09 14:44:52', NULL),
(12, 16, 16, '2017-04-09 14:45:11', NULL),
(13, 16, 21, '2017-04-09 14:45:11', NULL),
(14, 1, 1, '2017-04-09 14:45:21', NULL),
(15, 2, 2, '2017-04-09 14:45:29', NULL),
(16, 6, 3, '2017-04-09 14:45:38', NULL),
(17, 7, 4, '2017-04-09 14:46:21', NULL),
(18, 7, 22, '2017-04-09 14:46:21', NULL),
(19, 8, 5, '2017-04-09 14:46:32', NULL),
(20, 9, 17, '2017-04-09 14:46:51', NULL),
(21, 9, 23, '2017-04-09 14:46:51', NULL),
(22, 10, 6, '2017-04-09 14:47:06', NULL),
(23, 11, 7, '2017-04-09 14:47:13', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `flats_residents`
--
ALTER TABLE `flats_residents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flats_residents_flat_id_foreign` (`flat_id`),
  ADD KEY `flats_residents_resident_id_foreign` (`resident_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `flats_residents`
--
ALTER TABLE `flats_residents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `flats_residents`
--
ALTER TABLE `flats_residents`
  ADD CONSTRAINT `flats_residents_flat_id_foreign` FOREIGN KEY (`flat_id`) REFERENCES `flats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flats_residents_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
