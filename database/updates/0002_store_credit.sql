CREATE TABLE IF NOT EXISTS `StoreCreditAccount` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StoreCreditAccount_userId_key`(`userId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `StoreCreditAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `StoreCreditTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `type` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `StoreCreditTransaction_accountId_idx`(`accountId`),
    INDEX `StoreCreditTransaction_adminUserId_idx`(`adminUserId`),
    CONSTRAINT `StoreCreditTransaction_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `StoreCreditAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `StoreCreditTransaction_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
