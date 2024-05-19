import { CreditCard, Expense, SubCategory } from "@prisma/client";
import { isAfter } from "date-fns/isAfter";
import { subDays } from "date-fns/subDays";
import { ExpenseStatus, ExpernseWithComputedFields } from "./types";

export const getExpenseStatusByDueDate = (dueDate?: Date | null) => {
  if (!dueDate) {
    return undefined;
  }
  const now = new Date();
  if (dueDate && isAfter(now, dueDate)) {
    return ExpenseStatus.OVERDUE;
  }
  if (dueDate && isAfter(now, subDays(dueDate, 7))) {
    return ExpenseStatus.PENDING;
  }
  return ExpenseStatus["ON DAY"];
};

export const getExpenseWitchComputedFields = (
  expense: ExpernseWithComputedFields
): ExpernseWithComputedFields => {
  const status = getExpenseStatusByDueDate(expense?.dueDate);
  return { ...expense, status };
};

export const getExpensesWitchComputedFields = (expenses: Expense[]) => {
  return expenses?.map((expense) => getExpenseWitchComputedFields(expense));
};
