import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { ExpenseQueryKeys, ExpenseWithComputedFields } from "../types";
import { useMemo } from "react";

export function useGetExpense(id?: string) {
  const { apiBase } = useAxios();

  const {
    data: expense,
    refetch: fetchExpense,

    isLoading,
    isRefetching,
  } = useQuery({
    queryFn: () =>
      apiBase

        .get<ExpenseWithComputedFields>(`/me/expenses/${id}`)
        .then((res) => res.data),
    queryKey: [ExpenseQueryKeys.INFO],
    refetchOnMount: true,
  });
  const isLoadingExpense = useMemo(
    () => isLoading || isRefetching,
    [isLoading, isRefetching]
  );
  return { expense, isLoadingExpense, fetchExpense };
}
