import { CreditCard, Expense, SubCategory } from "@prisma/client";

export enum ExpenseQueryKeys {
  LIST = "EXPENSE_LIST",
  INFO = "EXPENSE_INFO",
}

export enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  "ON DAY" = "ON DAY",
}

export interface ExpenseWithComputedFields extends Expense {
  status?: ExpenseStatus;
  subCategories?: SubCategory[];
  creditCard?: CreditCard;
}

export type BadgeVariatnsType = Record<keyof typeof ExpenseStatus, JSX.Element>;
