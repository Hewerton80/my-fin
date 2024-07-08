import { TransitionHistory } from "@prisma/client";
import { ExpenseWithComputedFields } from "../expenses/types";

export interface TransitionHistoryWitchConputedFields
  extends TransitionHistory {
  expense?: ExpenseWithComputedFields;
}

export interface GetTransionsTransitionHistoryParams {
  categoryId?: string;
}

export enum TransitionHistoryQueryKeys {
  LIST_BY_CATEGORY = "LIST_BY_CATEGORY",
}
