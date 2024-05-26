import { Expense } from "@prisma/client";
import { isAfter } from "date-fns/isAfter";
import { subDays } from "date-fns/subDays";
import { ExpenseStatus, ExpenseWithComputedFields } from "./types";

const getExpenseStatusByDueDate = (expense: ExpenseWithComputedFields) => {
  if (expense?.isPaid) return ExpenseStatus.PAID;
  const dueDate = expense?.dueDate;
  if (!dueDate) return undefined;

  const now = new Date();
  if (dueDate && isAfter(now, dueDate)) {
    return ExpenseStatus.OVERDUE;
  }
  if (dueDate && isAfter(now, subDays(dueDate, 7))) {
    return ExpenseStatus.PENDING;
  }
  return ExpenseStatus["ON DAY"];
};

const getWitchComputedFields = (
  expense: Expense
): ExpenseWithComputedFields => {
  const status = getExpenseStatusByDueDate(expense);
  return { ...expense, status };
};

const getListWitchComputedFields = (expenses: Expense[]) => {
  return expenses?.map((expense) => getWitchComputedFields(expense));
};

export const ExpenseUtils = {
  getListWitchComputedFields,
  getWitchComputedFields,
};
