import { CONSTANTS } from "@/shared/constants";
import { isNumber } from "@/shared/isType";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { REGEX } from "@/shared/regex";

const { REQUIRED_FIELD, MUST_BE_GREATER_THAN_ZERO, INVALID_DATE } =
  CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const frontendFormTransitionHistoryReceiveSchema = z
  .object({
    id: z.string().optional(),
    expenseId: z.string().optional().nullable(),
    name: z.string().min(1, REQUIRED_FIELD).trim().optional(),
    amount: z
      .number()
      .min(1, REQUIRED_FIELD)
      .refine((amount) => (isNumber(amount) ? amount > 0 : true), {
        message: MUST_BE_GREATER_THAN_ZERO,
      }),
    // .nullable(),
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
    isCloning: z.boolean().optional(),
  })
  .refine(({ expenseId, name }) => (expenseId ? true : name?.trim()), {
    message: REQUIRED_FIELD,
    path: ["name"],
  });

type InferBaseTransitionHistoryFormSchema = z.infer<
  typeof frontendFormTransitionHistoryReceiveSchema
>;

export type InferCreateTransitionHistoryFormSchema =
  InferBaseTransitionHistoryFormSchema;
