/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50533
 Source Host           : localhost
 Source Database       : aquino

 Target Server Type    : MySQL
 Target Server Version : 50533
 File Encoding         : utf-8

 Date: 05/10/2014 22:29:38 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `configs`
-- ----------------------------
DROP TABLE IF EXISTS `configs`;
CREATE TABLE `configs` (
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `camera` varchar(100) NOT NULL,
  KEY `camera` (`camera`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `configs`
-- ----------------------------
BEGIN;
INSERT INTO `configs` VALUES ('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'romain.addweb@gmail.com', '192.168.0.200');
COMMIT;

-- ----------------------------
--  Table structure for `hours_feed`
-- ----------------------------
DROP TABLE IF EXISTS `hours_feed`;
CREATE TABLE `hours_feed` (
  `hour` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `lights`
-- ----------------------------
DROP TABLE IF EXISTS `lights`;
CREATE TABLE `lights` (
  `hour_on` int(10) unsigned NOT NULL,
  `hour_off` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `lights`
-- ----------------------------
BEGIN;
INSERT INTO `lights` VALUES ('7', '18');
COMMIT;

-- ----------------------------
--  Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `notifications`
-- ----------------------------
BEGIN;
INSERT INTO `notifications` VALUES ('5', 'Test', 'Essais'), ('6', 'Test', 'Essais'), ('7', 'Test', 'Essais'), ('8', 'Test', 'Essais'), ('9', 'Test', 'Essais'), ('10', 'Test', 'Essais');
COMMIT;

-- ----------------------------
--  Table structure for `water_level`
-- ----------------------------
DROP TABLE IF EXISTS `water_level`;
CREATE TABLE `water_level` (
  `min` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `water_level`
-- ----------------------------
BEGIN;
INSERT INTO `water_level` VALUES ('40');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
