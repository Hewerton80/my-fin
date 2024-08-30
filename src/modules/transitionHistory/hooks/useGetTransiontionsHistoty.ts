import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  IGetTransionsHistoryParams,
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isNumberable } from "@/utils/isType";
import { removeEmptyKeys } from "@/utils/parseJsonToSearchParams";
import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { useDebouncedCallback } from "use-debounce";
import { isValid as isValidDate } from "date-fns/isValid";
import useQueryParams from "@/hooks/useQueryParams";
import { format } from "date-fns";

export function useGetTransiontionsHistoty(
  defaultParams?: IGetTransionsHistoryParams
) {
  const { apiBase } = useAxios();
  const { setQueryParams } = useQueryParams<IGetTransionsHistoryParams>();

  const searchParams = useSearchParams();

  const transionHistoriesQueryParams =
    useMemo<IGetTransionsHistoryParams>(() => {
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const referenceMonth = searchParams.get("referenceMonth");
      return {
        currentPage: isNumberable(searchParams.get("currentPage"))
          ? Number(searchParams.get("currentPage"))
          : 1,
        perPage: isNumberable(searchParams.get("perPage"))
          ? Number(searchParams.get("perPage"))
          : 25,
        keyword: searchParams.get("keyword") || "",
        type: searchParams.get("type") || "",
        startDate:
          startDate && isValidDate(new Date(startDate))
            ? (startDate as string)
            : "",
        endDate:
          endDate && isValidDate(new Date(endDate)) ? (endDate as string) : "",
        referenceMonth:
          referenceMonth && isValidDate(new Date(referenceMonth))
            ? (referenceMonth as string)
            : "",
        status: searchParams.get("status") || "",
        creditCardId: searchParams.get("creditCardId") || "",
        ...(defaultParams || {}),
      };
    }, [searchParams, defaultParams]);

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
        startDate: from ? from.toISOString() : "",
        endDate: to ? to.toISOString() : "",
      });
    },
    [setQueryParams]
  );

  const changeReferenceMonth = useCallback(
    (month: string) => {
      setQueryParams({
        currentPage: 1,
        referenceMonth: month,
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
    changeReferenceMonth,
    changeSearcheInput,
    refetchTransitionHistorys,
    changeTransitionHistoryType,
    changeDateRange,
    changeTransitionHistoryStatus,
    goToPage,
  };
}
