import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  TransitionHistoryWitchConputedFields,
  TransitionHistoryQueryKeys,
} from "../types";

export function useGetTransiontionHistoty(id?: string) {
  const { apiBase } = useAxios();

  const {
    data: transitionHisory,
    refetch: fetchTransiotionHistory,
    isLoading,
    isRefetching,
  } = useQuery({
    queryFn: () =>
      apiBase

        .get<TransitionHistoryWitchConputedFields>(
          `/me/transition-history/${id}`
        )
        .then((res) => res.data),
    queryKey: [TransitionHistoryQueryKeys.INFO],
    refetchOnMount: true,
  });
  const isLoadingTransiotionHistory = useMemo(
    () => isLoading || isRefetching,
    [isLoading, isRefetching]
  );
  return {
    transitionHisory,
    isLoadingTransiotionHistory,
    fetchTransiotionHistory,
  };
}
