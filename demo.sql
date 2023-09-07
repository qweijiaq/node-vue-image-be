CREATE TABLE IF NOT EXISTS `audit_log` (
	id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId int(11) NOT NULL,
	userName VARCHAR(255) DEFAULT NULL,
	resourceType ENUM('post', 'comment') NOT NULL,
	resourceId int(11) NOT NULL,
	status ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
    created timestamp DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255) DEFAULT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `access_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `userName` VARCHAR(255) DEFAULT NULL,
    `action` VARCHAR(255) DEFAULT NULL,
    `resourceType` VARCHAR(10) DEFAULT NULL,
    `resourceId` INT(11) DEFAULT NULL,
    `payload` TEXT DEFAULT NULL,
    `ip` VARCHAR(255) DEFAULT NULL,
    `origin` TEXT DEFAULT NULL,
    `referer` TEXT DEFAULT NULL,
    `agent` TEXT DEFAULT NULL,
    `language` VARCHAR(255) DEFAULT NULL,
    `originalUrl` TEXT DEFAULT NULL,
    `method` VARCHAR(10) DEFAULT NULL,
    `query` JSON DEFAULT NULL,
    `params` JSON DEFAULT NULL,
    `path` VARCHAR(255) DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE  CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `user_meta` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) NOT NULL,
    `type` ENUM('weixinUserInfo') NOT NULL,
    `info` JSON DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN Key (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `product` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `type` ENUM('license', 'subscription'),
    `title` VARCHAR(255) DEFAULT NULL,
    `description` JSON DEFAULT NULL,
    `price` DECIMAL(6, 2) NOT NULL,
    `salePrice` DECIMAL(6, 2) NOT NULL,
    `meta` JSON DEFAULT NULL,
    `status` ENUM('published', 'draft', 'archived') DEFAULT 'draft',
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN Key (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS  `payment` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` ENUM('wxpay', 'alipay'),
    `title` VARCHAR(255) DEFAULT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `index` INT(2) DEFAULT NULL,
    `meta` JSON DEFAULT NULL,
    `status` ENUM('published', 'draft', 'archived') DEFAULT 'draft'
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) NOT NULL,
    `productId` INT(11) NOT NULL,
    `status` ENUM('pending', 'completed', 'archived') NOT NULL,
    `payment` ENUM('wxpay', 'alipay') NOT NULL,
    `totalAmount` DECIMAL(6,2) DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `order_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `orderId` INT(11) DEFAULT NULL,
    `action` ENUM('orderCreated', 'orderUpdated', 'orderStatusChanged', 'orderPaymentrecived') NOT NULL,
    `meta` JSON DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `license` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `orderId` INT(11) DEFAULT NULL,
    `resourceType` ENUM('post') NOT NULL,
    `resourceId` INT(11) DEFAULT NULL,
    `status` ENUM('pending', 'valid', 'invalid') NOT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subscription` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `type` ENUM('standard', 'pro') NOT NULL,
    `status` ENUM('pending', 'valid', 'invalid', 'expired') NOT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `expired` TIMESTAMP DEFAULT NULL,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subscription_log` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `subscriptionId` INT(11) DEFAULT NULL,
    `userId` INT(11) DEFAULT NULL,
    `orderId` INT(11) DEFAULT NULL,
    `action` ENUM('create', 'upgrade', 'renew', 'resubscribe', 'statusChanged', 'renewed', 'upgraded', 'resubscribed') NOT NULL,
    `meta` JSON DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(`subscriptionId`) REFERENCES `subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `download` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT(11) DEFAULT NULL,
    `licenseId` INT(11) DEFAULT NULL,
    `token` VARCHAR(255) DEFAULT NULL,
    `resourceType` ENUM('post') NOT NULL,
    `resourceId` INT(11) DEFAULT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `used` TIMESTAMP DEFAULT NULL,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`licenseId`) REFERENCES `license`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `payment_url` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `orderId` INT(11) DEFAULT NULL,
    `token` VARCHAR(255) DEFAULT NULL,
    `url` TEXT NOT NULL,
    `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `used` TIMESTAMP DEFAULT NULL,

    FOREIGN KEY(`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE KEY,
    `password` VARCHAR(255) NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 内容表
CREATE TABLE IF NOT EXISTS `post` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `content` LONGTEXT,
    `userId` INT(11) DEFAULT NULL,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 文件（图片）表
CREATE TABLE IF NOT EXISTS `file` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `originalname` VARCHAR(255) NOT NULL,
    `mimetype` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `size` INT(11) NOT NULL,
    `postId` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,
    `width` SMALLINT(6) NOT NULL,
    `height` SMALLINT(6) NOT NULL,
    `metadata` JSON DEFAULT NULL,

    FOREIGN KEY(`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS `tag` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE KEY
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 内容-标签关联表
CREATE TABLE IF NOT EXISTS `post_tag` (
    `postId` INT(11) NOT NULL,
    `tagId` INT(11) NOT NULL,
    PRIMARY KEY (`postId`, `tagId`),

    FOREIGN KEY(`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS  `comment` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `content` LONGTEXT,
    `postId` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,
    `parentId` INT(11) DEFAULT NULL,

    FOREIGN KEY(`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`parentId`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 头像表
CREATE TABLE IF NOT EXISTS `avatar` (
    `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `mimetype` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `size` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,

    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 点赞表
CREATE TABLE IF NOT EXISTS `user_digg_post` (
    `postId` INT(11) NOT NULL,
    `userId` INT(11) NOT NULL,
    PRIMARY KEY (`postId`, `userId`),

    FOREIGN KEY(`postId`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;