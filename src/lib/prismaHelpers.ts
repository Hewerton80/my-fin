import { stringToBoolean } from "@/shared/stringToBoolean";
import { UserRolesNamesType } from "@/types/User";
import { Gender } from "@prisma/client";

export interface IPaginatedDocs<DocsType> {
  docs: DocsType[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
  prev: number | null;
  next: number | null;
}

export interface IPaginateArgs {
  currentPage?: number | string;
  perPage?: number | string;
}

interface IPaginateFunctionArgs<WhereInput, OrderInput> {
  model: any;
  where?: WhereInput;
  orderBy?: OrderInput;
  paginationArgs?: IPaginateArgs;
}

export const prismaPagination = async <DocsType, WhereInput, OrderInput>({
  model,
  where,
  orderBy,
  paginationArgs,
}: IPaginateFunctionArgs<WhereInput, OrderInput>) => {
  const currentPage = Number(paginationArgs?.currentPage) || 1;
  const perPage = Number(paginationArgs?.perPage) || 25;

  const skip = currentPage > 0 ? perPage * (currentPage - 1) : 0;
  const totalPromise = model.count({ where });
  const docsPromise = model.findMany({
    where,
    orderBy,
    take: perPage,
    skip,
  });
  const [total, docs] = await Promise.all([totalPromise, docsPromise]);
  const lastPage = Math.ceil(total / perPage);
  const paginatedResult: IPaginatedDocs<DocsType> = {
    docs,
    total,
    lastPage,
    currentPage,
    perPage,
    prev: currentPage > 1 ? currentPage - 1 : null,
    next: currentPage < lastPage ? currentPage + 1 : null,
  };
  return paginatedResult;
};

export const parseOrderBy = (orderBy: string | undefined) => {
  if (!orderBy) {
    return undefined;
  }
  const [field, order] = orderBy.split(" ");
  if (!field) {
    return undefined;
  }

  return {
    [field]: order ? order.toLocaleLowerCase() : undefined,
  };
};

export const parseUserSearchParams = (searchParams: URLSearchParams) => {
  return {
    keyword: searchParams.get("keyword") || "",
    isActive: stringToBoolean(searchParams.get("isActive")),
    gender: (searchParams.get("gender") as Gender) || undefined,
    role: (searchParams.get("role") as UserRolesNamesType) || undefined,
    currentPage: searchParams.get("currentPage") || 1,
    perPage: searchParams.get("perPage") || 25,
    orderBy: parseOrderBy(searchParams.get("orderBy") || undefined),
  };
};
