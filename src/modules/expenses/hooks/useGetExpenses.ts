import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAxios } from "../../../hooks/useAxios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import {
  parseJsonToSearchParams,
  removeEmptyKeys,
} from "@/shared/parseJsonToSearchParams";
import {
  ExpenseQueryKeys,
  ExpenseWithComputedFields,
  IGetExpensesQueryParams,
} from "../types";
import { isNumberable } from "@/shared/isType";
import { useDebouncedCallback } from "use-debounce";

export function useGetExpenses() {
  const { apiBase } = useAxios();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryParams = useMemo<IGetExpensesQueryParams>(() => {
    console.log({ searchParams });
    return {
      currentPage: isNumberable(searchParams.get("currentPage"))
        ? Number(searchParams.get("currentPage"))
        : 1,
      keyword: searchParams.get("keyword")?.trim() || "",
    };
  }, [searchParams]);

  // const
  const [isSearching, setIsSearching] = useState(false);

  const [searchExpenseValue, setSearchExpenseValue] = useState(
    queryParams?.keyword
  );

  const {
    data: expenses,
    error: expensesError,
    isFetching,
    refetch,
  } = useQuery({
    queryFn: () =>
      apiBase
        .get<IPaginatedDocs<ExpenseWithComputedFields>>("/me/expenses", {
          params: removeEmptyKeys(queryParams),
        })
        .then((res) => res.data || { docs: [] })
        .finally(() => setIsSearching(false)),
    queryKey: [ExpenseQueryKeys.LIST],
    retry: 1,
  });

  const isLoadingExpenses = useMemo(
    () => isFetching || isSearching,
    [isFetching, isSearching]
  );

  useEffect(() => {
    refetch();
  }, [queryParams, refetch]);

  const updateExpensesQueryParams = useCallback(
    (newExpensesQueryParams: IGetExpensesQueryParams) => {
      const mergedQueryParams = parseJsonToSearchParams({
        ...queryParams,
        ...newExpensesQueryParams,
      });
      router.replace(`${pathname}${mergedQueryParams}`);
    },
    [router, queryParams, pathname]
  );

  const refetchExpenses = useCallback(() => {
    // updateExpensesQueryParams({});
    refetch();
  }, [refetch]);

  const goToPage = useCallback(
    (page: number) => {
      updateExpensesQueryParams({ currentPage: page });
    },
    [updateExpensesQueryParams]
  );

  const changeSearcheInputDebounced = useDebouncedCallback(
    useCallback(
      (value: string) => {
        updateExpensesQueryParams({ currentPage: 1, keyword: value?.trim() });
      },
      [updateExpensesQueryParams]
    ),
    1000
  );

  const changeSearcheQrCodeInput = useCallback(
    (value: string) => {
      setIsSearching(true);
      setSearchExpenseValue(value);
      changeSearcheInputDebounced(value);
    },
    [changeSearcheInputDebounced]
  );

  return {
    expenses,
    isLoadingExpenses,
    expensesError,
    searchExpenseValue,
    refetchExpenses,
    goToPage,
    changeSearcheQrCodeInput,
  };
}
