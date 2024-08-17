import { parseOrderBy, prismaPagination } from "../../lib/prismaHelpers";
import prisma from "../../lib/prisma";
import { Prisma, TransitionHistoryStatus } from "@prisma/client";
import { TransitionHistoryWitchConputedFields } from "./types";
import { TransitionType } from "@prisma/client";
import { isValid as isValidDate } from "date-fns/isValid";
import { CONSTANTS } from "../../shared/constants";
import { endOfDay, isAfter, startOfYear, subDays } from "date-fns";
import { CreditCardWitchComputedFields } from "../creditCard/types";

const parseSearchParams = (searchParams: URLSearchParams) => {
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    type:
      TransitionType?.[searchParams.get("type")?.trim() as TransitionType] ||
      undefined,
    creditCardId: searchParams.get("creditCardId")?.trim() || undefined,
    status:
      TransitionHistoryStatus?.[
        searchParams.get("status")?.trim() as TransitionHistoryStatus
      ] || undefined,
    startDate:
      startDate && isValidDate(new Date(startDate))
        ? (startDate as string)
        : startOfYear(new Date()),
    endDate:
      endDate && isValidDate(new Date(endDate))
        ? (endDate as string)
        : undefined,
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};

const getListByUserId = async (
  userId: string,
  {
    searchParams,
    where = {},
  }: {
    searchParams: URLSearchParams;
    where?: Prisma.TransitionHistoryWhereInput;
  }
) => {
  const {
    currentPage,
    perPage,
    keyword,
    status,
    type,
    creditCardId,
    startDate,
    endDate,
  } = parseSearchParams(searchParams);
  const paginedTransitionsHistory = await prismaPagination<
    TransitionHistoryWitchConputedFields,
    Prisma.TransitionHistoryWhereInput,
    any,
    Prisma.TransitionHistoryInclude
  >({
    model: prisma.transitionHistory,
    paginationArgs: { currentPage, perPage },
    where: {
      AND: [
        { userId },
        { name: { contains: keyword } },
        { type },
        { status },
        { creditCardId },
        {
          OR: [
            { paidAt: { gte: startDate, lte: endDate } },
            { registrationDate: { gte: startDate, lte: endDate } },
            { dueDate: { gte: startDate, lte: endDate } },
          ],
        },
      ],
      ...where,
    },
    orderBy: [{ dueDate: "desc" }],
    include: {
      category: { select: { id: true, name: true, iconName: true } },
      creditCard: { select: { id: true, name: true } },
    },
  });

  return paginedTransitionsHistory;
};

const getStatusByDueDate = (dueDate?: Date) => {
  if (!dueDate) return null;

  const now = new Date();
  if (isAfter(now, dueDate)) {
    return TransitionHistoryStatus.OVERDUE;
  }
  if (isAfter(now, subDays(dueDate, 7))) {
    return TransitionHistoryStatus.PENDING;
  }
  return TransitionHistoryStatus["ON_DAY"];
};

const getDueDateByRegistrationDateAndCreditCard = (
  registrationDate: Date,
  creditCard: CreditCardWitchComputedFields
) => {
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

const getDueDateByRegistrationDateAndCreditCardId = async (
  registrationDate: Date,
  creditCardId: string
) => {
  const creditCard = await prisma.creditCard.findUnique({
    where: { id: creditCardId },
  });

  if (!creditCard) {
    throw new Error(CONSTANTS.API_RESPONSE_MESSAGES.CREDIT_CARD_NOT_FOUND);
  }

  return getDueDateByRegistrationDateAndCreditCard(
    registrationDate,
    creditCard
  );
};

export const TransitionHistoryService = {
  getListByUserId,
  getDueDateByRegistrationDateAndCreditCardId,
  getDueDateByRegistrationDateAndCreditCard,
  getStatusByDueDate,
};
