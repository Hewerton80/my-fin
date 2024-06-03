import { useAxios } from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { ExpenseQueryKeys, ExpenseWithComputedFields } from "../types";

export function useGetExpense(id?: string) {
  const { apiBase } = useAxios();

  const { data: expense, isLoading: isFeLoadingExpense } = useQuery({
    enabled: !!id,
    queryFn: () =>
      apiBase
        .get<ExpenseWithComputedFields>(`/me/expenses/${id}`)
        .then((res) => res.data),
    queryKey: [ExpenseQueryKeys.INFO],
  });

  return { expense, isFeLoadingExpense };
}
