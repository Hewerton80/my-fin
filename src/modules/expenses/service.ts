import prisma from "@/lib/prisma";
import { ExpenseUtils } from "./utils";
import { ExpenseWithComputedFields } from "./types";
import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import { Prisma } from "@prisma/client";

const parseSearchParams = (searchParams: URLSearchParams) => {
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};

const getListByUserId = async (
  userId: string,
  searchParams: URLSearchParams
) => {
  const { currentPage, perPage, keyword } = parseSearchParams(searchParams);
  const paginedExpenses = await prismaPagination<
    ExpenseWithComputedFields,
    Prisma.ExpenseWhereInput,
    any,
    Prisma.ExpenseInclude
  >({
    model: prisma.expense,
    paginationArgs: { currentPage, perPage },
    where: { userId, name: { contains: keyword } },
    orderBy: [{ isPaid: "asc" }, { dueDate: "asc" }],
    include: {
      creditCard: { select: { id: true, name: true } },
    },
  });
  paginedExpenses.docs = ExpenseUtils.getListWitchComputedFields(
    paginedExpenses.docs
  );
  return paginedExpenses;
};

const getOneById = async (id: string) => {
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
  getOneById,
  getListByUserId,
};
