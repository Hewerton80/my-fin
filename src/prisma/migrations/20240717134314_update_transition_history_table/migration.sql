-- DropForeignKey
ALTER TABLE `TransitionHistory` DROP FOREIGN KEY `TransitionHistory_expenseId_fkey`;

-- AlterTable
ALTER TABLE `TransitionHistory` ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `expenseId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TransitionHistory` ADD CONSTRAINT `TransitionHistory_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
