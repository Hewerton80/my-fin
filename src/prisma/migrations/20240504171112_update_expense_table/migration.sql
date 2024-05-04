-- AlterTable
ALTER TABLE `Expense` MODIFY `frequency` ENUM('DO_NOT_REPEAT', 'DAILY', 'MONTHLY', 'YEARLY') NULL;
