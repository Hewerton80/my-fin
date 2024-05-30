import { Expense } from "@prisma/client";
import { isAfter } from "date-fns/isAfter";
import { subDays } from "date-fns/subDays";
import {
  BadgeVariatnsType,
  ExpenseStatus,
  ExpenseWithComputedFields,
} from "./types";
import { Badge } from "@/components/ui/dataDisplay/Badge";

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
  if (status === ExpenseStatus.PAID) {
    expense.dueDate = null;
  }
  return { ...expense, status };
};

const getListWitchComputedFields = (expenses: Expense[]) => {
  return expenses?.map((expense) => getWitchComputedFields(expense));
};

const getBadgeByStatus = (status: keyof typeof ExpenseStatus) => {
  const statusLowerCase = status.toLowerCase();
  const expenseBadge: BadgeVariatnsType = {
    PAID: <Badge variant="success">{statusLowerCase}</Badge>,
    OVERDUE: <Badge variant="danger">{statusLowerCase}</Badge>,
    PENDING: <Badge variant="warning">{statusLowerCase}</Badge>,
    "ON DAY": <Badge variant="info">{statusLowerCase}</Badge>,
  };
  return expenseBadge[status];
};

export const ExpenseUtils = {
  getListWitchComputedFields,
  getWitchComputedFields,
  getBadgeByStatus,
};
