import prisma from "@/lib/prisma";
import { ExpenseUtils } from "./utils";
import { ExpenseWithComputedFields } from "./types";

const getExpenseById = async (id: string) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      creditCard: { select: { id: true, name: true } },
    },
  });
  const expenseWitchComputedFields = ExpenseUtils.getWitchComputedFields(
    expense as ExpenseWithComputedFields
  );
  return expenseWitchComputedFields;
};

const getParsedSubCategoriesByIds = async (ids: string[]) => {
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

export const ExpenseServices = {
  getParsedSubCategoriesByIds,
  getExpenseById,
};
