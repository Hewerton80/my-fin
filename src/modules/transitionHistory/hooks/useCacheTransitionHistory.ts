import { useQueryClient } from "@tanstack/react-query";
import {
  TransitionHistoryQueryKeys,
  TransitionHistoryWitchConputedFields,
} from "../types";
import { useCallback } from "react";
import { IPaginatedDocs } from "@/lib/prismaHelpers";

export function useCacheTransitions() {
  const queryClient = useQueryClient();

  const updateCachedTransitionById = useCallback(
    (
      id: string,
      { ...newTransition }: TransitionHistoryWitchConputedFields
    ) => {
      queryClient.setQueryData<
        IPaginatedDocs<TransitionHistoryWitchConputedFields>
      >([TransitionHistoryQueryKeys.LIST], ({ ...oldTransitions }) => {
        if (!Array.isArray(oldTransitions?.docs)) return undefined;
        const docs = oldTransitions?.docs?.map((transition) => {
          if (transition.id === id) {
            return {
              ...transition,
              ...newTransition,
            };
          }
          return transition;
        });
        oldTransitions.docs = docs;
        return oldTransitions;
      });
    },
    [queryClient]
  );

  const resetTransitionInfoCahce = useCallback(() => {
    queryClient.resetQueries({
      queryKey: [TransitionHistoryQueryKeys.INFO],
      exact: true,
    });
    console.log("resetTransitionInfoCahce");
  }, [queryClient]);

  return { updateCachedTransitionById, resetTransitionInfoCahce };
}
