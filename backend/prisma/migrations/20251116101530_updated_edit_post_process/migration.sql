-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('USER', 'MODERATOR', 'ADMIN', 'BOT') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `EditSuggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `suggestedById` INTEGER NOT NULL,
    `moderatorId` INTEGER NULL,
    `data` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EditSuggestion` ADD CONSTRAINT `EditSuggestion_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EditSuggestion` ADD CONSTRAINT `EditSuggestion_suggestedById_fkey` FOREIGN KEY (`suggestedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EditSuggestion` ADD CONSTRAINT `EditSuggestion_moderatorId_fkey` FOREIGN KEY (`moderatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
