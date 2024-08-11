import { CreditCard } from "@prisma/client";

export interface CreditCardWitchComputedFields extends Partial<CreditCard> {}

export enum CreditCardQueryKeys {
  LIST = "CREDIT_CARD_LIST",
  INSIGHTS = "CREDIT_CARD_INSIGHTS",
}
