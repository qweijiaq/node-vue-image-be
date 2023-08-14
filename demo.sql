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

