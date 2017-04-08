-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 08, 2017 at 07:28 PM
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
(3, 1, 1, '2017-04-08 08:05:20', NULL),
(4, 2, 2, '2017-04-08 08:05:28', NULL),
(5, 3, 9, '2017-04-08 08:05:52', NULL),
(6, 4, 4, '2017-04-08 08:06:04', NULL),
(9, 7, 5, '2017-04-08 08:06:34', NULL),
(10, 8, 3, '2017-04-08 08:06:45', NULL),
(11, 9, 6, '2017-04-08 08:07:04', NULL),
(12, 10, 7, '2017-04-08 08:07:12', NULL),
(13, 11, 13, '2017-04-08 08:07:24', NULL),
(15, 13, 14, '2017-04-08 08:07:53', NULL),
(16, 14, 10, '2017-04-08 08:08:07', NULL),
(17, 15, 11, '2017-04-08 08:08:21', NULL),
(18, 15, 12, '2017-04-08 08:08:21', NULL),
(20, 5, 15, '2017-04-08 13:52:47', NULL),
(21, 5, 20, '2017-04-08 13:52:47', NULL),
(22, 6, 4, '2017-04-08 13:53:06', NULL),
(23, 6, 22, '2017-04-08 13:53:06', NULL),
(24, 12, 17, '2017-04-08 13:54:04', NULL),
(25, 12, 23, '2017-04-08 13:54:04', NULL),
(26, 16, 16, '2017-04-08 13:54:26', NULL),
(27, 16, 21, '2017-04-08 13:54:26', NULL);

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
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
