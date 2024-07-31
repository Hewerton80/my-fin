import { CONSTANTS } from "@/shared/constants";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { isNumber } from "@/shared/isType";

const {
  REQUIRED_FIELD,
  INVALID_DATE,
  MUST_BE_NUMBER,
  MUST_BE_GREATER_THAN_ZERO,
} = CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const apiFormTransitionHistoryReceiveSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
  amount: z
    .number({
      required_error: REQUIRED_FIELD,
      invalid_type_error: MUST_BE_NUMBER,
    })
    .refine((amount) => isNumber(amount) && amount > 0, {
      message: MUST_BE_GREATER_THAN_ZERO,
    }),
  paidAt: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .refine((paidAt) => isValidDate(new Date(paidAt)), INVALID_DATE)
    .transform((paidAt) => new Date(paidAt)),
});
