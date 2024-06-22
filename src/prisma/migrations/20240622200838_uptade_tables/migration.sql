/*
  Warnings:

  - You are about to drop the `ExpenseSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExpenseToSubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ExpenseSubCategory` DROP FOREIGN KEY `ExpenseSubCategory_expenseId_fkey`;

-- DropForeignKey
ALTER TABLE `ExpenseSubCategory` DROP FOREIGN KEY `ExpenseSubCategory_subCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `SubCategory` DROP FOREIGN KEY `SubCategory_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `_ExpenseToSubCategory` DROP FOREIGN KEY `_ExpenseToSubCategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ExpenseToSubCategory` DROP FOREIGN KEY `_ExpenseToSubCategory_B_fkey`;

-- DropTable
DROP TABLE `ExpenseSubCategory`;

-- DropTable
DROP TABLE `SubCategory`;

-- DropTable
DROP TABLE `_ExpenseToSubCategory`;
