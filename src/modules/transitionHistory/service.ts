import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransitionHistoryWitchConputedFields } from "./types";
import { TransitionType } from "@prisma/client";
import { isValid as isValidDate } from "date-fns/isValid";
const parseSearchParams = (searchParams: URLSearchParams) => {
  const startPaidAt = searchParams.get("startPaidAt");
  const endPaidAt = searchParams.get("endPaidAt");
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    type: searchParams.get("type")?.trim() || undefined,
    expenseId: searchParams.get("expenseId")?.trim() || undefined,
    startPaidAt:
      startPaidAt && isValidDate(new Date(startPaidAt))
        ? (startPaidAt as string)
        : undefined,
    endPaidAt:
      endPaidAt && isValidDate(new Date(endPaidAt))
        ? (endPaidAt as string)
        : undefined,
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};

const getListByUserId = async (
  userId: string,
  searchParams: URLSearchParams
) => {
  const {
    currentPage,
    perPage,
    keyword,
    type,
    expenseId,
    startPaidAt,
    endPaidAt,
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
      userId,
      expenseId,
      type: type as TransitionType,
      paidAt: { gte: startPaidAt, lte: endPaidAt },
      OR: [
        { name: { contains: keyword } },
        { expense: { name: { contains: keyword } } },
      ],
    },
    orderBy: [{ paidAt: "desc" }],
    include: { expense: { select: { id: true, name: true } } },
  });

  return paginedTransitionsHistory;
};

export const TransitionHistoryService = { getListByUserId };
