/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.21-MariaDB : Database - adam_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`adam_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `adam_db`;

/*Table structure for table `laporan` */

DROP TABLE IF EXISTS `laporan`;

CREATE TABLE `laporan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(100) NOT NULL,
  `long` int(11) NOT NULL,
  `lat` int(11) NOT NULL,
  `kategori` int(11) NOT NULL,
  `deskripsi` varchar(500) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `pelapor` (`user_id`),
  CONSTRAINT `pelapor` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `laporan` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `access` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`full_name`,`status`,`access`) values 
(1,'Laurel74@hotmail.com','123','Laurel Kub',1,0),
(2,'Adan.Gutkowski75@yahoo.com','123','Adan Gutkowski',1,0),
(3,'Karolann_Hills62@yahoo.com','123','Karolann Hills',1,1),
(4,'Precious.Pagac29@yahoo.com','123','Precious Pagac',1,0),
(5,'Skyla.Purdy87@hotmail.com','123','Skyla Purdy',1,0),
(6,'Herminio.Gleichner@yahoo.com','123','Herminio Gleichner',1,0),
(7,'Francesco_Marquardt29@yahoo.com','123','Francesco Marquardt',1,1),
(8,'Maida21@hotmail.com','123','Maida Murazik',1,1),
(9,'Nikolas_Abbott@hotmail.com','123','Nikolas Abbott',1,0),
(10,'Milford.Wunsch70@yahoo.com','123','Milford Wunsch',1,0),
(11,'abc@gmail.com','123','anak bang cecep',1,0),
(12,'Fredy26@hotmail.com','123','Fredy Rau',1,0),
(13,'Katelin4@gmail.com','123','Katelin McLaughlin',1,0),
(14,'Wilhelmine10@gmail.com','123','Wilhelmine Ferry',1,0),
(15,'Harold.Schneider37@yahoo.com','123','Harold Schneider',1,1),
(16,'Gwen.Pfeffer92@hotmail.com','123','Gwen Pfeffer',1,0),
(17,'Aliyah.Schulist66@hotmail.com','123','Aliyah Schulist',1,0),
(18,'Shana_Schimmel@hotmail.com','123','Shana Schimmel',1,0),
(19,'Leopoldo_Schmitt85@gmail.com','123','Leopoldo Schmitt',1,0),
(20,'Pedro_Blick@hotmail.com','123','Pedro Blick',1,1),
(21,'Malinda.Christiansen@gmail.com','123','Malinda Christiansen',1,0),
(22,'anderson@gmail.com','123','anderson',1,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
