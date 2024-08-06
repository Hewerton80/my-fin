import { CONSTANTS } from "@/shared/constants";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { isBoolean, isNumber } from "@/shared/isType";
import {
  TransitionHistoryPaymantType,
  TransitionType,
  TransitionHistoryFrequency,
} from "@prisma/client";

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

export const apiFormTransitionHistorySchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
  type: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
  categoryId: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD),
  amount: z
    .number({
      required_error: REQUIRED_FIELD,
      invalid_type_error: MUST_BE_NUMBER,
    })
    .refine((amount) => isNumber(amount) && amount > 0, {
      message: MUST_BE_GREATER_THAN_ZERO,
    }),
  registrationDate: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .refine(
      (registrationDate) => isValidDate(new Date(registrationDate)),
      INVALID_DATE
    )
    .transform((registrationDate) => new Date(registrationDate)),
  frequency: z.string({ required_error: REQUIRED_FIELD }).nullable().optional(),
  totalInstallments: z
    .number({ invalid_type_error: MUST_BE_NUMBER })
    .refine(
      (totalInstallments) =>
        isNumber(totalInstallments) ? totalInstallments > 0 : true,
      {
        message: MUST_BE_GREATER_THAN_ZERO,
      }
    )
    .refine(
      (totalInstallments) =>
        isNumber(totalInstallments) ? totalInstallments <= 12 : true,
      {
        message: "Must be less than or equal to 12",
      }
    )
    .nullable()
    .optional(),
  creditCardId: z.string({ required_error: REQUIRED_FIELD }).trim().optional(),
  isPaid: z.boolean({ required_error: REQUIRED_FIELD }).nullable().optional(),
  paymentType: z
    .string({ required_error: REQUIRED_FIELD })
    .nullable()
    .optional(),
});

export const createApiTransitionHistorySchema = apiFormTransitionHistorySchema
  .refine(
    ({ isPaid, type }) =>
      type === TransitionType.PAYMENT ? isBoolean(isPaid) : true,
    {
      message: REQUIRED_FIELD,
      path: ["isPaid"],
    }
  )
  .refine(
    ({ paymentType, isPaid, type }) =>
      isPaid || type === TransitionType.RECEIPT ? paymentType : true,
    {
      message: REQUIRED_FIELD,
      path: ["paymentType"],
    }
  )
  .refine(
    ({ paymentType }) =>
      paymentType
        ? TransitionHistoryPaymantType?.[
            paymentType as keyof typeof TransitionHistoryPaymantType
          ]
        : true,
    { message: "Invalid payment type", path: ["paymentType"] }
  )
  .refine(({ isPaid, frequency }) => (isPaid ? true : frequency), {
    message: REQUIRED_FIELD,
    path: ["frequency"],
  })
  .refine(
    ({ frequency }) =>
      frequency
        ? TransitionHistoryFrequency?.[
            frequency as keyof typeof TransitionHistoryFrequency
          ]
        : true,
    { message: "Invalid frequency type", path: ["frequency"] }
  )
  .refine(
    ({ type }) =>
      type ? TransitionType?.[type as keyof typeof TransitionType] : true,
    { message: "Invalid 'type' type", path: ["type"] }
  )
  .refine(({ creditCardId, isPaid }) => (isPaid ? true : creditCardId), {
    message: REQUIRED_FIELD,
    path: ["creditCardId"],
  });

export const payTransitionHistorySchema = z.object({
  paidAt: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .refine((paidAt) => isValidDate(new Date(paidAt)), INVALID_DATE)
    .transform((paidAt) => new Date(paidAt)),
});

export const updateApiTransitionHistorySchema =
  apiFormTransitionHistorySchema.partial();
