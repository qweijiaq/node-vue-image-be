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