import { CONSTANTS } from "@/shared/constants";
import { isBoolean, isNumber } from "@/shared/isType";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { REGEX } from "@/shared/regex";
import { TransitionType } from "@prisma/client";

const { REQUIRED_FIELD, MUST_BE_GREATER_THAN_ZERO, INVALID_DATE } =
  CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const frontendFormTransitionHistoryReceiveSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, REQUIRED_FIELD).trim().optional(),
    categoryId: z.string().min(1, REQUIRED_FIELD),
    type: z.string().min(1, REQUIRED_FIELD).optional(),
    amount: z
      .number()
      .min(1, REQUIRED_FIELD)
      .refine((amount) => (isNumber(amount) ? amount > 0 : true), {
        message: MUST_BE_GREATER_THAN_ZERO,
      }),
    registrationDate: z
      .string()
      .min(1, REQUIRED_FIELD)
      .refine(
        (registrationDate) =>
          registrationDate
            ? registrationDate.match(REGEX.isoDate) &&
              isValidDate(new Date(registrationDate))
            : true,
        INVALID_DATE
      ),
    isPaid: z
      .boolean()
      // .refine((isPaid) => isBoolean(isPaid), REQUIRED_FIELD)
      .optional()
      .nullable(),
    frequency: z
      .string()
      // .min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD)
      .nullable()
      .optional(),
    paymentType: z.string().nullable().optional(),
    totalInstallments: z.number().optional().nullable(),
    creditCardId: z.string().optional(),

    isCloning: z.boolean().optional(),
  })
  .refine(({ id, type }) => (id ? true : Boolean(type)), {
    message: REQUIRED_FIELD,
    path: ["type"],
  })
  .refine(
    ({ isPaid, type }) =>
      type === TransitionType.PAYMENT ? isBoolean(isPaid) : true,
    {
      message: REQUIRED_FIELD,
      path: ["isPaid"],
    }
  )
  .refine(({ isPaid, id, frequency }) => (isPaid || id ? true : frequency), {
    message: REQUIRED_FIELD,
    path: ["frequency"],
  })
  .refine(({ paymentType, isPaid }) => (isPaid ? paymentType : true), {
    message: REQUIRED_FIELD,
    path: ["paymentType"],
  })
  .refine(({ isPaid, creditCardId }) => (!isPaid ? creditCardId : true), {
    message: REQUIRED_FIELD,
    path: ["creditCardId"],
  });

export const payFrontendTransitionSchema = z.object({
  paidAt: z.string().refine((paidAt) => isValidDate(new Date(paidAt)), {
    message: INVALID_DATE,
  }),
});

type InferBaseTransitionHistoryFormSchema = z.infer<
  typeof frontendFormTransitionHistoryReceiveSchema
>;

export type InferPayTransitionHistoryFormSchema = z.infer<
  typeof payFrontendTransitionSchema
>;

export type InferCreateTransitionHistoryFormSchema =
  InferBaseTransitionHistoryFormSchema;
