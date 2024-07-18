import { parseOrderBy, prismaPagination } from "@/lib/prismaHelpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { TransitionHistoryWitchConputedFields } from "./types";

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
      OR: [
        { name: { contains: keyword } },
        { expense: { name: { contains: keyword } } },
      ],
    },
    orderBy: [{ isPaid: "asc" }],
    include: { expense: { select: { id: true, name: true } } },
  });

  return paginedTransitionsHistory;
};

export const TransitionHistoryService = { getListByUserId };
