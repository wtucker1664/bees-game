

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bees_test`
--
CREATE DATABASE `bees_test`;

use `bees_test`;

-- --------------------------------------------------------

--
-- Table structure for table `bees`
--

CREATE TABLE IF NOT EXISTS `bees` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `hive_id` bigint(20) NOT NULL,
  `type` enum('queen','worker','drone') COLLATE utf8_bin NOT NULL,
  `hits` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `hive_id` (`hive_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Dumping data for table `bees`
--

INSERT INTO `bees` (`id`, `hive_id`, `type`, `hits`) VALUES
(1, 1, 'queen', 100),
(2, 1, 'worker', 75),
(3, 1, 'worker', 75),
(4, 1, 'worker', 75),
(5, 1, 'worker', 75),
(6, 1, 'worker', 75),
(7, 1, 'drone', 50);
(8, 1, 'drone', 50);
(9, 1, 'drone', 50);
(10, 1, 'drone', 50);
(11, 1, 'drone', 50);
(12, 1, 'drone', 50);
(13, 1, 'drone', 50);
(3, 1, 'drone', 50);

-- --------------------------------------------------------

--
-- Table structure for table `hives`
--

CREATE TABLE IF NOT EXISTS `hives` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=2 ;

--
-- Dumping data for table `hives`
--

INSERT INTO `hives` (`id`, `name`) VALUES
(1, 'garden');
