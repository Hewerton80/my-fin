/*
  Warnings:

  - You are about to drop the column `registrationDay` on the `CreditCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CreditCard` DROP COLUMN `registrationDay`,
    ADD COLUMN `invoiceClosingDay` INTEGER NULL;
