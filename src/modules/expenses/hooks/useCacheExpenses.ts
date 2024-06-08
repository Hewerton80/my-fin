import { useQueryClient } from "@tanstack/react-query";
import { ExpenseQueryKeys, ExpenseWithComputedFields } from "../types";
import { useCallback } from "react";
import { IPaginatedDocs } from "@/lib/prismaHelpers";

export function useCacheExpenses() {
  const queryClient = useQueryClient();

  const updateCachedExpenseById = useCallback(
    (id: string, { ...newExpense }: ExpenseWithComputedFields) => {
      queryClient.setQueryData<IPaginatedDocs<ExpenseWithComputedFields>>(
        [ExpenseQueryKeys.LIST],
        ({ ...oldExpenses }) => {
          if (!Array.isArray(oldExpenses?.docs)) return undefined;
          const docs = oldExpenses?.docs?.map((expense) => {
            if (expense.id === id) {
              return {
                ...expense,
                ...newExpense,
              };
            }
            return expense;
          });
          oldExpenses.docs = docs;
          return oldExpenses;
        }
      );
    },
    [queryClient]
  );

  const resetExpenseInfoCahce = useCallback(() => {
    queryClient.resetQueries({
      queryKey: [ExpenseQueryKeys.INFO],
      exact: true,
    });
    console.log("resetExpenseInfoCahce");
  }, [queryClient]);

  return { updateCachedExpenseById, resetExpenseInfoCahce };
}
