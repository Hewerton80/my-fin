import { CONSTANTS } from "@/shared/constants";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { PaymantType } from "@prisma/client";
import { isNumber } from "@/shared/isType";

const {
  REQUIRED_FIELD,
  INVALID_DATE,
  MUST_BE_NUMBER,
  MUST_BE_GREATER_THAN_ZERO,
} = CONSTANTS.VALIDATION_ERROR_MESSAGES;

const apiFormExpenseSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
  subCategories: z
    .array(z.string({ required_error: REQUIRED_FIELD }))
    .nullable()
    .optional(),
  description: z
    .string({ required_error: REQUIRED_FIELD })
    .trim()
    .nullable()
    .optional(),
  amount: z
    .number({
      required_error: REQUIRED_FIELD,
      invalid_type_error: MUST_BE_NUMBER,
    })
    .refine((amount) => (isNumber(amount) ? amount > 0 : true), {
      message: MUST_BE_GREATER_THAN_ZERO,
    })
    .nullable()
    .optional(),
  isPaid: z.boolean({ required_error: REQUIRED_FIELD }),
  paymentType: z
    .string({ required_error: REQUIRED_FIELD })
    .nullable()
    .optional(),
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
        isNumber(totalInstallments) ? totalInstallments > 0 : true,
      {
        message: MUST_BE_GREATER_THAN_ZERO,
      }
    )
    .nullable()
    .optional(),

  creditCardId: z.string({ required_error: REQUIRED_FIELD }).trim().optional(),
  dueDate: z
    .string()
    .refine(
      (dueDate) => (dueDate ? isValidDate(new Date(dueDate)) : true),
      INVALID_DATE
    )
    .transform((dueDate) => new Date(dueDate))
    .nullable()
    .optional(),
  registrationDate: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .refine(
      (registrationDate) =>
        registrationDate ? isValidDate(new Date(registrationDate)) : true,
      INVALID_DATE
    )
    .transform((registrationDate) => new Date(registrationDate))
    .nullable()
    .optional(),
});

export const createApiExpenseSchema = apiFormExpenseSchema
  .refine(({ paymentType, isPaid }) => (isPaid ? paymentType : true), {
    message: REQUIRED_FIELD,
    path: ["paymentType"],
  })
  .refine(
    ({ paymentType, isPaid }) =>
      isPaid ? PaymantType?.[paymentType as keyof typeof PaymantType] : true,
    { message: "Invalid payment type", path: ["paymentType"] }
  )
  .refine(({ isPaid, frequency }) => (isPaid ? true : frequency), {
    message: REQUIRED_FIELD,
    path: ["frequency"],
  })
  .refine(
    ({ paymentType, creditCardId, isPaid }) =>
      paymentType === PaymantType.CREDIT_CARD || !isPaid ? creditCardId : true,
    { message: REQUIRED_FIELD, path: ["creditCard"] }
  );

export const updateApiExpenseSchema = apiFormExpenseSchema.partial();

export const payExpenseSchema = z.object({
  paidAt: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .refine((paidAt) => isValidDate(new Date(paidAt)), INVALID_DATE)
    .transform((paidAt) => new Date(paidAt)),
});
