import { IPaginateArgs } from "@/lib/prismaHelpers";
import { Category, CreditCard, Expense, ExpenseStatus } from "@prisma/client";

export enum ExpenseQueryKeys {
  LIST = "EXPENSE_LIST",
  INFO = "EXPENSE_INFO",
}

export interface ExpenseWithComputedFields extends Expense {
  category?: Category;
  creditCard?: CreditCard;
}

export type BadgeVariatnsType = Record<keyof typeof ExpenseStatus, JSX.Element>;

export interface IGetExpensesQueryParams extends IPaginateArgs {
  keyword?: string;
  status?: ExpenseStatus | string;
}
