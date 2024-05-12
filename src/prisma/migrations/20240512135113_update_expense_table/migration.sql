/*
  Warnings:

  - Made the column `invoiceClosingDay` on table `CreditCard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `CreditCard` MODIFY `invoiceClosingDay` INTEGER NOT NULL;
