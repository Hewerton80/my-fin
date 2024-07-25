import { Expense, ExpenseStatus } from "@prisma/client";
import { isAfter } from "date-fns/isAfter";
import { subDays } from "date-fns/subDays";
import { BadgeVariatnsType, ExpenseWithComputedFields } from "./types";
import { Badge } from "@/components/ui/dataDisplay/Badge";
import { capitalizeFisrtLetter } from "@/shared/string";

const getExpenseStatusByDueDate = (expense: ExpenseWithComputedFields) => {
  if (expense?.isPaid) return ExpenseStatus.PAID;
  if (expense?.status === ExpenseStatus.CANCELED) return ExpenseStatus.CANCELED;
  const dueDate = expense?.dueDate;
  if (!dueDate) return null;

  const now = new Date();
  if (dueDate && isAfter(now, dueDate)) {
    return ExpenseStatus.OVERDUE;
  }
  if (dueDate && isAfter(now, subDays(dueDate, 7))) {
    return ExpenseStatus.PENDING;
  }
  return ExpenseStatus["ON_DAY"];
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
  const statusLowerCase = capitalizeFisrtLetter(status);
  const expenseBadge: BadgeVariatnsType = {
    PAID: <Badge variant="success">{statusLowerCase}</Badge>,
    OVERDUE: <Badge variant="danger">{statusLowerCase}</Badge>,
    PENDING: <Badge variant="warning">{statusLowerCase}</Badge>,
    ON_DAY: <Badge variant="info">{statusLowerCase}</Badge>,
    CANCELED: <Badge variant="dark">{statusLowerCase}</Badge>,
  };
  return expenseBadge[status];
};

export const ExpenseUtils = {
  getListWitchComputedFields,
  getWitchComputedFields,
  getBadgeByStatus,
};
