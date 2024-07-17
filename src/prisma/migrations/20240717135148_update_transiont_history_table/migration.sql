-- AlterTable
ALTER TABLE `TransitionHistory` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TransitionHistory` ADD CONSTRAINT `TransitionHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
