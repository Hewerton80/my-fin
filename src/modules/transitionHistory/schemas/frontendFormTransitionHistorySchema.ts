import { CONSTANTS } from "@/shared/constants";
import { isNumber } from "@/shared/isType";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { REGEX } from "@/shared/regex";

const { REQUIRED_FIELD, MUST_BE_GREATER_THAN_ZERO, INVALID_DATE } =
  CONSTANTS.VALIDATION_ERROR_MESSAGES;

const apiFormTransitionHistoryReceiveSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim()
    .optional(),
  amount: z
    .number()
    .min(1, REQUIRED_FIELD)
    .refine((amount) => (isNumber(amount) ? amount > 0 : true), {
      message: MUST_BE_GREATER_THAN_ZERO,
    }),
  paidAt: z
    .string()
    .min(1, REQUIRED_FIELD)
    .refine(
      (paidAt) =>
        paidAt
          ? paidAt.match(REGEX.isoDate) && isValidDate(new Date(paidAt))
          : true,
      INVALID_DATE
    ),
});

type InferBaseTransictionHistoryFormSchema = z.infer<
  typeof apiFormTransitionHistoryReceiveSchema
>;

export type InferCreateTransictionHistoryFormSchema =
  InferBaseTransictionHistoryFormSchema;
