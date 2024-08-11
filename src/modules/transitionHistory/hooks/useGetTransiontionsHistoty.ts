import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  IGetTransionsHistoryParams,
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isNumberable } from "@/shared/isType";
import { removeEmptyKeys } from "@/shared/parseJsonToSearchParams";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { useDebouncedCallback } from "use-debounce";
import { isValid as isValidDate } from "date-fns/isValid";
import useQueryParams from "@/hooks/useQueryParams";

export function useGetTransiontionsHistoty() {
  const { apiBase } = useAxios();
  const { setQueryParams } = useQueryParams<IGetTransionsHistoryParams>();

  const searchParams = useSearchParams();

  const transionHistoriesQueryParams =
    useMemo<IGetTransionsHistoryParams>(() => {
      const startPaidAt = searchParams.get("startPaidAt");
      const endPaidAt = searchParams.get("endPaidAt");
      return {
        currentPage: isNumberable(searchParams.get("currentPage"))
          ? Number(searchParams.get("currentPage"))
          : 1,
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
        status: searchParams.get("status") || "",
        creditCardId: searchParams.get("creditCardId") || "",
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
    queryFn: () =>
      apiBase
        .get<IPaginatedDocs<TransitionHistoryWitchConputedFields>>(
          "/me/transition-history",
          {
            params: removeEmptyKeys(transionHistoriesQueryParams),
          }
        )
        .then((res) => res.data || { docs: [] })
        .finally(() => setIsSearching(false)),
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

  const refetchTransitionHistorys = useCallback(() => {
    refetch();
  }, [refetch]);

  const goToPage = useCallback(
    (page: number) => {
      setQueryParams({ currentPage: page });
    },
    [setQueryParams]
  );

  const changeSearcheInputDebounced = useDebouncedCallback(
    useCallback(
      (value: string) => {
        setQueryParams({ currentPage: 1, keyword: value?.trim() });
      },
      [setQueryParams]
    ),
    1000
  );

  const changeTransitionHistoryStatus = useCallback(
    (status: string) => {
      setQueryParams({ currentPage: 1, status });
    },
    [setQueryParams]
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
      setQueryParams({ currentPage: 1, type });
    },
    [setQueryParams]
  );

  const changeDateRange = useCallback(
    ({ from, to }: { from?: Date; to?: Date }) => {
      setQueryParams({
        currentPage: 1,
        startPaidAt: from ? from.toISOString() : "",
        endPaidAt: to ? to.toISOString() : "",
      });
    },
    [setQueryParams]
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
    changeDateRange,
    changeTransitionHistoryStatus,
    goToPage,
  };
}
