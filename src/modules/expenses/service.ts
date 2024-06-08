import prisma from "@/lib/prisma";
import { ExpenseUtils } from "./utils";
import { ExpenseStatus, ExpenseWithComputedFields } from "./types";
import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import { Prisma } from "@prisma/client";
import { addDays } from "date-fns/addDays";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";

const getExpenseWhereInputByStatus = (status?: string) => {
  const where: Prisma.ExpenseWhereInput = {};

  if (!status || !ExpenseStatus?.[status as ExpenseStatus]) return where;

  const now = new Date();
  if (status === ExpenseStatus.PAID) {
    where.isPaid = true;
  } else if (status === ExpenseStatus.OVERDUE) {
    where.dueDate = { lt: now };
    where.isPaid = false;
  } else if (status === ExpenseStatus.PENDING) {
    where.dueDate = { gt: now, lt: addDays(now, 7) };
    where.isPaid = false;
  } else if (status === ExpenseStatus["ON DAY"]) {
    where.dueDate = { gt: addDays(now, 7) };
    where.isPaid = false;
  }
  return where;
};

const parseSearchParams = (searchParams: URLSearchParams) => {
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    status: searchParams.get("status") || undefined,
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};

const getListByUserId = async (
  userId: string,
  searchParams: URLSearchParams
) => {
  const { currentPage, perPage, keyword, status } =
    parseSearchParams(searchParams);
  const paginedExpenses = await prismaPagination<
    ExpenseWithComputedFields,
    Prisma.ExpenseWhereInput,
    any,
    Prisma.ExpenseInclude
  >({
    model: prisma.expense,
    paginationArgs: { currentPage, perPage },
    where: {
      userId,
      OR: [
        { name: { contains: keyword } },
        { subCategoriesName: { contains: keyword } },
      ],
      ...getExpenseWhereInputByStatus(status),
    },
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
      subCategories: { select: { id: true, name: true, iconName: true } },
    },
  });
  const expenseWitchComputedFields = ExpenseUtils.getWitchComputedFields(
    expense as ExpenseWithComputedFields
  );
  console.log(
    "expenseWitchComputedFieldssubCategories",
    expenseWitchComputedFields?.subCategories
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
