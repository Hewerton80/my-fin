import { TransitionHistory } from "@prisma/client";
import { ExpenseWithComputedFields } from "../expenses/types";
import { IPaginateArgs } from "@/lib/prismaHelpers";
import { TransitionType } from "@prisma/client";
export interface TransitionHistoryWitchConputedFields
  extends TransitionHistory {
  expense?: ExpenseWithComputedFields;
}
export interface IGetTransionsHistoryParams extends IPaginateArgs {
  keyword?: string;
  type?: TransitionType | string;
  startPaidAt?: string;
  endPaidAt?: string;
}

export interface GetTransionsHistoryByCategoryParams {
  categoryId?: string;
}

export enum TransitionHistoryQueryKeys {
  INFO = "INFO",
  LIST_BY_CATEGORY = "LIST_BY_CATEGORY",
  LIST = "LIST",
}
