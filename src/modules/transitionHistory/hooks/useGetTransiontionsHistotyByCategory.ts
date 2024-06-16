import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";

export function useGetTransiontionsHistotyByCategory(categoryId: string) {
  const { apiBase } = useAxios();
  const {
    data: transitionsHistory,
    isLoading: isLoadingTransitionsHistory,
    refetch: refetchTransitionsHistory,
    error: transitionsHistoryError,
  } = useQuery({
    queryKey: [TransitionHistoryQueryKeys.LIST_BY_CATEGORY, categoryId],
    gcTime: 1000 * 60 * 10,
    queryFn: () =>
      apiBase
        .get<TransitionHistoryWitchConputedFields[]>(
          `/me/transition-history/category/${categoryId}`
        )
        .then((res) => res.data || []),
    enabled: false,
  });

  return {
    transitionsHistory,
    isLoadingTransitionsHistory,
    refetchTransitionsHistory,
    transitionsHistoryError,
  };
}
