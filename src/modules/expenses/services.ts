import { Expense } from "@prisma/client";
import { isAfter } from "date-fns/isAfter";
import { subDays } from "date-fns/subDays";
import { ExpenseStatus, ExpernseWithComputedFields } from "./types";
import prisma from "@/lib/prisma";

export const getExpenseStatusByDueDate = (
  expense: ExpernseWithComputedFields
) => {
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

export const getExpenseWitchComputedFields = (
  expense: ExpernseWithComputedFields
): ExpernseWithComputedFields => {
  const status = getExpenseStatusByDueDate(expense);
  return { ...expense, status };
};

export const getExpensesWitchComputedFields = (expenses: Expense[]) => {
  return expenses?.map((expense) => getExpenseWitchComputedFields(expense));
};

export const getParsedSubCategoriesByIds = async (ids: string[]) => {
  const expenseData: any = {};
  const subCategoriesIds = ids.map((id) => ({ id }));
  const foundSubCategories = await prisma.subCategory.findMany({
    where: { id: { in: ids } },
  });
  expenseData.iconsName = foundSubCategories
    .map((subCategory) => subCategory.iconName)
    ?.join(",");
  expenseData.subCategoriesName = foundSubCategories
    .map((subCategory) => subCategory.name)
    ?.join(",");
  expenseData.subCategories = { connect: subCategoriesIds };
  return expenseData;
};
