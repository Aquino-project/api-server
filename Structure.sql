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

 Date: 05/09/2014 12:06:01 PM
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
INSERT INTO `configs` VALUES ('', 'romain.addweb@gmail.com', '192.168.1.92');
COMMIT;

-- ----------------------------
--  Table structure for `hours_feed`
-- ----------------------------
DROP TABLE IF EXISTS `hours_feed`;
CREATE TABLE `hours_feed` (
  `hour` int(10) unsigned NOT NULL,
  `minute` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `hours_feed`
-- ----------------------------
BEGIN;
INSERT INTO `hours_feed` VALUES ('7', '50'), ('7', '30'), ('7', '20'), ('7', '0'), ('7', '10');
COMMIT;

-- ----------------------------
--  Table structure for `lights`
-- ----------------------------
DROP TABLE IF EXISTS `lights`;
CREATE TABLE `lights` (
  `hour_on` int(10) unsigned NOT NULL,
  `hour_off` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `notifications`
-- ----------------------------
BEGIN;
INSERT INTO `notifications` VALUES ('1', 'Test', 'defr'), ('2', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('3', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('4', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('5', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('6', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('7', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('8', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('9', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('10', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('11', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('12', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('13', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('14', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('15', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('16', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('17', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('18', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('19', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('20', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('21', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('22', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('23', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('24', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('25', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('26', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('27', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('28', 'Niveau d\'eau', 'Niveau d\'eau trop bas'), ('29', 'Niveau d\'eau', 'Niveau d\'eau trop bas');
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
INSERT INTO `water_level` VALUES ('0');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
