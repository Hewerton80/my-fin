-- AlterTable
ALTER TABLE `TransitionHistory` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `creditCardId` VARCHAR(191) NULL,
    ADD COLUMN `frequency` ENUM('DO_NOT_REPEAT', 'MONTHLY') NULL,
    ADD COLUMN `paymentType` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'PIX', 'BANK_TRANSFER') NULL;

-- AddForeignKey
ALTER TABLE `TransitionHistory` ADD CONSTRAINT `TransitionHistory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransitionHistory` ADD CONSTRAINT `TransitionHistory_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `CreditCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
