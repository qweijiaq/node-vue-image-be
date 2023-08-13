CREATE TABLE audit_log (
	id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId int(11) NOT NULL,
	userName VARCHAR(255) DEFAULT NULL,
	resourceType ENUM('post', 'comment') NOT NULL,
	resourceId int(11) NOT NULL,
	status ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
    created timestamp DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255) DEFAULT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;