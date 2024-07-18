import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  GetTransionsHistoryByCategoryParams,
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

export function useGetTransiontionsHistotyByCategory() {
  const { apiBase } = useAxios();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const transionHistoriesQueryParams =
    useMemo<GetTransionsHistoryByCategoryParams>(() => {
      return {
        categoryId: searchParams.get("categoryId") || "",
      };
    }, [searchParams]);

  const {
    data: transitionsHistory,
    isLoading: isLoadingTransitionsHistory,
    refetch,
    error: transitionsHistoryError,
  } = useQuery({
    queryFn: () =>
      apiBase
        .get<TransitionHistoryWitchConputedFields[]>(
          `/me/transition-history/category/${transionHistoriesQueryParams?.categoryId}`
        )
        .then((res) => res.data || []),
    gcTime: 1000 * 60 * 10,
    queryKey: [
      TransitionHistoryQueryKeys.LIST_BY_CATEGORY,
      transionHistoriesQueryParams?.categoryId,
    ],
    enabled: false,
  });

  useEffect(() => {
    if (transionHistoriesQueryParams?.categoryId) {
      refetch();
    }
  }, [transionHistoriesQueryParams, refetch]);

  const fetchTransitionsHistory = useCallback(
    (categoryId?: string) => {
      if (categoryId) {
        router.push(`${pathname}?categoryId=${categoryId}`);
      } else {
        refetch();
      }
    },
    [refetch, router, pathname]
  );

  return {
    transitionsHistory,
    isLoadingTransitionsHistory,
    fetchTransitionsHistory,
    transionHistoriesQueryParams,
    transitionsHistoryError,
  };
}
