import { TransitionHistory, TransitionHistoryStatus } from "@prisma/client";
import { IPaginateArgs } from "@/lib/prismaHelpers";
import { TransitionType } from "@prisma/client";
import { CategoryWitchComputedFields } from "../category/types";
import { CreditCardWitchComputedFields } from "../creditCard/types";

export interface TransitionHistoryWitchConputedFields
  extends TransitionHistory {
  category?: CategoryWitchComputedFields;
  creditCard?: CreditCardWitchComputedFields;
}

export interface IGetTransionsHistoryParams extends IPaginateArgs {
  keyword?: string;
  type?: TransitionType | string;
  status?: TransitionHistoryStatus | string;
  startDate?: string;
  endDate?: string;
  creditCardId?: string;
  referenceMonth?: string;
}

export interface GetTransionsHistoryByCategoryParams {
  categoryId?: string;
}

export enum TransitionHistoryQueryKeys {
  INFO = "INFO",
  LIST_BY_CATEGORY = "LIST_BY_CATEGORY",
  LIST = "LIST",
}
