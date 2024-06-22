/*
  Warnings:

  - You are about to drop the column `iconsName` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoriesName` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `iconsName`,
    DROP COLUMN `subCategoriesName`;
