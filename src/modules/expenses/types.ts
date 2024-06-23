import { IPaginateArgs } from "@/lib/prismaHelpers";
import { Category, CreditCard, Expense } from "@prisma/client";

export enum ExpenseQueryKeys {
  LIST = "EXPENSE_LIST",
  INFO = "EXPENSE_INFO",
}

export enum ExpenseStatus {
  OVERDUE = "OVERDUE",
  PENDING = "PENDING",
  "ON DAY" = "ON DAY",
  PAID = "PAID",
}

export interface ExpenseWithComputedFields extends Expense {
  status?: ExpenseStatus;
  category?: Category;
  creditCard?: CreditCard;
}

export type BadgeVariatnsType = Record<keyof typeof ExpenseStatus, JSX.Element>;

export interface IGetExpensesQueryParams extends IPaginateArgs {
  keyword?: string;
  status?: ExpenseStatus | string;
}
