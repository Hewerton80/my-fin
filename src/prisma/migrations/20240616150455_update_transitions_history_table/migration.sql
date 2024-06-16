/*
  Warnings:

  - You are about to drop the column `expenseId` on the `SubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `SubCategory` DROP FOREIGN KEY `SubCategory_expenseId_fkey`;

-- AlterTable
ALTER TABLE `SubCategory` DROP COLUMN `expenseId`;

-- AlterTable
ALTER TABLE `TransitionHistory` ADD COLUMN `paidAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `_ExpenseToSubCategory` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ExpenseToSubCategory_AB_unique`(`A`, `B`),
    INDEX `_ExpenseToSubCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ExpenseToSubCategory` ADD CONSTRAINT `_ExpenseToSubCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExpenseToSubCategory` ADD CONSTRAINT `_ExpenseToSubCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `SubCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
