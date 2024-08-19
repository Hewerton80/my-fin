import prisma from "@/lib/prisma";
import { ExpenseUtils } from "./utils";
import { ExpenseWithComputedFields } from "./types";
import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import { ExpenseStatus, Prisma } from "@prisma/client";
import { CONSTANTS } from "@/utils/constants";
import { endOfDay } from "date-fns";

const parseSearchParams = (searchParams: URLSearchParams) => {
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    status: (searchParams.get("status") as ExpenseStatus) || undefined,
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
      OR: [{ name: { contains: keyword } }],
      status,

      // ...getExpenseWhereInputByStatus(status),
    },
    orderBy: [{ isPaid: "asc" }, { dueDate: "asc" }],
    include: {
      creditCard: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, iconName: true } },
    },
  });
  return paginedExpenses;
};

const getDueDateAndReferenceMonthByRegistrationDateAndCreditCardId = async (
  registrationDate: Date,
  creditCardId: string
) => {
  const creditCard = await prisma.creditCard.findUnique({
    where: { id: creditCardId },
  });

  if (!creditCard) {
    throw new Error(CONSTANTS.API_RESPONSE_MESSAGES.CREDIT_CARD_NOT_FOUND);
  }

  const currentDayOfMonth = registrationDate.getDate();
  const creditCardDueDay = creditCard?.dueDay!;
  const creditCardInvoiceClosingDay = creditCard?.invoiceClosingDay!;
  const handledDueDate = new Date(
    registrationDate.getFullYear(),
    registrationDate.getMonth(),
    creditCardDueDay
  );
  if (creditCardInvoiceClosingDay <= creditCardDueDay) {
    if (currentDayOfMonth > creditCardInvoiceClosingDay) {
      handledDueDate.setMonth(handledDueDate.getMonth() + 1);
    }
  } else {
    if (currentDayOfMonth > creditCardInvoiceClosingDay) {
      handledDueDate.setMonth(handledDueDate.getMonth() + 2);
    } else {
      handledDueDate.setMonth(handledDueDate.getMonth() + 1);
    }
  }
  return endOfDay(handledDueDate);
};

const getOneById = async (id: string) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      creditCard: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, iconName: true } },
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
  getDueDateAndReferenceMonthByRegistrationDateAndCreditCardId,
};
