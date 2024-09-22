/*
  Warnings:

  - You are about to drop the column `expenseId` on the `TransitionHistory` table. All the data in the column will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_creditCardId_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TransitionHistory` DROP FOREIGN KEY `TransitionHistory_expenseId_fkey`;

-- AlterTable
ALTER TABLE `TransitionHistory` DROP COLUMN `expenseId`;

-- DropTable
DROP TABLE `Expense`;
