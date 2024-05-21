/*
  Warnings:

  - You are about to drop the column `iconName` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `iconName`,
    ADD COLUMN `iconsName` VARCHAR(191) NULL,
    ADD COLUMN `subCategoriesName` VARCHAR(191) NULL;
