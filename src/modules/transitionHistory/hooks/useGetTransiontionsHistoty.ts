import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  GetTransionsHistoryByCategoryParams,
  IGetTransionsHistoryParams,
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isNumberable } from "@/shared/isType";
import {
  parseJsonToSearchParams,
  removeEmptyKeys,
} from "@/shared/parseJsonToSearchParams";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { useDebouncedCallback } from "use-debounce";
import { isValid as isValidDate } from "date-fns/isValid";

export function useGetTransiontionsHistoty() {
  const { apiBase } = useAxios();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const transionHistoriesQueryParams =
    useMemo<IGetTransionsHistoryParams>(() => {
      const startPaidAt = searchParams.get("startPaidAt");
      const endPaidAt = searchParams.get("endPaidAt");
      return {
        currentPage: isNumberable(searchParams.get("currentPage"))
          ? Number(searchParams.get("currentPage"))
          : 1,
        expenseId: searchParams.get("expenseId") || "",
        keyword: searchParams.get("keyword") || "",
        type: searchParams.get("type") || "",
        startPaidAt:
          startPaidAt && isValidDate(new Date(startPaidAt))
            ? (startPaidAt as string)
            : "",
        endPaidAt:
          endPaidAt && isValidDate(new Date(endPaidAt))
            ? (endPaidAt as string)
            : "",
      };
    }, [searchParams]);

  const [isSearching, setIsSearching] = useState(false);

  const [searchTransitionHistoryValue, setSearchTransitionHistoryValue] =
    useState(transionHistoriesQueryParams?.keyword);

  const {
    data: transitionsHistory,
    isFetching,
    refetch,
    error: transitionsHistoryError,
  } = useQuery({
    queryFn: () => {
      console.log({
        transionHistoriesQueryParams,
        "removeEmptyKeys(transionHistoriesQueryParams)": removeEmptyKeys(
          transionHistoriesQueryParams
        ),
      });
      return apiBase
        .get<IPaginatedDocs<TransitionHistoryWitchConputedFields>>(
          "/me/transition-history",
          {
            params: removeEmptyKeys(transionHistoriesQueryParams),
          }
        )
        .then((res) => res.data || { docs: [] })
        .finally(() => setIsSearching(false));
    },
    queryKey: [TransitionHistoryQueryKeys.LIST],
    enabled: false,
  });

  const isLoadingTransitionsHistory = useMemo(
    () => isFetching || isSearching,
    [isFetching, isSearching]
  );

  useEffect(() => {
    refetch();
  }, [transionHistoriesQueryParams, refetch]);

  const updateTransitionHistorysQueryParams = useCallback(
    (newTransitionHistorysQueryParams: IGetTransionsHistoryParams) => {
      const mergedQueryParams = parseJsonToSearchParams({
        ...transionHistoriesQueryParams,
        ...newTransitionHistorysQueryParams,
      });
      router.replace(`${pathname}${mergedQueryParams}`);
    },
    [router, transionHistoriesQueryParams, pathname]
  );

  const refetchTransitionHistorys = useCallback(() => {
    // updateTransitionHistorysQueryParams(newTransitionHistorysQueryParams || {});
    refetch();
  }, [refetch]);

  const goToPage = useCallback(
    (page: number) => {
      updateTransitionHistorysQueryParams({ currentPage: page });
    },
    [updateTransitionHistorysQueryParams]
  );

  const changeSearcheInputDebounced = useDebouncedCallback(
    useCallback(
      (value: string) => {
        updateTransitionHistorysQueryParams({
          currentPage: 1,
          keyword: value?.trim(),
        });
      },
      [updateTransitionHistorysQueryParams]
    ),
    1000
  );

  const changeSearcheInput = useCallback(
    (value: string) => {
      setIsSearching(true);
      setSearchTransitionHistoryValue(value);
      changeSearcheInputDebounced(value);
    },
    [changeSearcheInputDebounced]
  );

  const changeTransitionHistoryType = useCallback(
    (type: string) => {
      updateTransitionHistorysQueryParams({ currentPage: 1, type });
    },
    [updateTransitionHistorysQueryParams]
  );

  return {
    transitionsHistory,
    isLoadingTransitionsHistory,
    transionHistoriesQueryParams,
    transitionsHistoryError,
    searchTransitionHistoryValue,
    changeSearcheInput,
    refetchTransitionHistorys,
    changeTransitionHistoryType,
    goToPage,
  };
}
