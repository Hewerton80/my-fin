import { IPaginateArgs } from "@/lib/prismaHelpers";
import { CreditCard, Expense, SubCategory } from "@prisma/client";

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
  subCategories?: SubCategory[];
  creditCard?: CreditCard;
}

export type BadgeVariatnsType = Record<keyof typeof ExpenseStatus, JSX.Element>;

export interface IGetExpensesQueryParams extends IPaginateArgs {
  keyword?: string;
  status?: ExpenseStatus | string;
}
