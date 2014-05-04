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

 Date: 05/04/2014 13:04:46 PM
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
--  Table structure for `hours_feed`
-- ----------------------------
DROP TABLE IF EXISTS `hours_feed`;
CREATE TABLE `hours_feed` (
  `hour` int(10) unsigned NOT NULL,
  `minute` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `lights`
-- ----------------------------
DROP TABLE IF EXISTS `lights`;
CREATE TABLE `lights` (
  `intensity` int(10) unsigned NOT NULL,
  `hour_on` int(10) unsigned NOT NULL,
  `minute_on` int(10) unsigned NOT NULL,
  `hour_off` int(10) unsigned NOT NULL,
  `minute_off` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `water_level`
-- ----------------------------
DROP TABLE IF EXISTS `water_level`;
CREATE TABLE `water_level` (
  `min` int(11) NOT NULL,
  `max` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
