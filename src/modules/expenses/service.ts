import prisma from "@/lib/prisma";
import { ExpenseUtils } from "./utils";
import { ExpenseWithComputedFields } from "./types";
import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import { ExpenseStatus, Prisma } from "@prisma/client";
import { addDays } from "date-fns/addDays";

const getExpenseWhereInputByStatus = (status?: string) => {
  const where: Prisma.ExpenseWhereInput = {};

  if (!status || !ExpenseStatus?.[status as ExpenseStatus]) return where;

  const now = new Date();
  if (status === ExpenseStatus.PAID) {
    where.isPaid = true;
  } else if (status === ExpenseStatus.CANCELED) {
    where.status = ExpenseStatus.CANCELED;
    where.isPaid = false;
  } else if (status === ExpenseStatus.OVERDUE) {
  } else if (status === ExpenseStatus.PENDING) {
    where.dueDate = { gt: now, lt: addDays(now, 7) };
    where.isPaid = false;
  } else if (status === ExpenseStatus["ON_DAY"]) {
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
        // { subCategoriesName: { contains: keyword } },
      ],
      ...getExpenseWhereInputByStatus(status),
    },
    orderBy: [{ isPaid: "asc" }, { dueDate: "asc" }],
    include: {
      creditCard: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, iconName: true } },
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
      category: { select: { id: true, name: true, iconName: true } },
      // subCategories: { select: { id: true, name: true, iconName: true } },
    },
  });
  const expenseWitchComputedFields = ExpenseUtils.getWitchComputedFields(
    expense as ExpenseWithComputedFields
  );
  return expenseWitchComputedFields;
};

export const ExpenseServices = {
  getOneById,
  getListByUserId,
};
