import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransitionHistoryWitchConputedFields } from "./types";
import { TransitionType } from "@prisma/client";

const parseSearchParams = (searchParams: URLSearchParams) => {
  return {
    keyword: searchParams.get("keyword")?.trim() || "",
    type: searchParams.get("type")?.trim() || undefined,
    expenseId: searchParams.get("expenseId")?.trim() || undefined,
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};

const getListByUserId = async (
  userId: string,
  searchParams: URLSearchParams
) => {
  const { currentPage, perPage, keyword, type, expenseId } =
    parseSearchParams(searchParams);
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
