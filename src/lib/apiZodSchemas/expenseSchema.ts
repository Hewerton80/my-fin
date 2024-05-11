import { CONSTANTS } from "@/shared/constants";
import { z } from "zod";
import { isValid as isValidDate } from "date-fns";
import { REGEX } from "@/shared/regex";
import { PaymantType } from "@prisma/client";

const {
  REQUIRED_FIELD,
  INVALID_DATE,
  MUST_BE_VALID,
  MUST_BE_NUMBER,
  MUST_BE_GREATER_THAN_ZERO,
} = CONSTANTS.VALIDATION_ERROR_MESSAGES;

const baseExpenseSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
  subCategories: z
    .array(z.string({ required_error: REQUIRED_FIELD }))
    .optional(),
  description: z.string({ required_error: REQUIRED_FIELD }).trim().optional(),
  amount: z
    .number({
      required_error: REQUIRED_FIELD,
      invalid_type_error: MUST_BE_NUMBER,
    })
    .optional(),
  isPaid: z.boolean({ required_error: REQUIRED_FIELD }),
  paymentType: z.string({ required_error: REQUIRED_FIELD }).optional(),
  frequency: z.string({ required_error: REQUIRED_FIELD }).optional(),
  totalInstallments: z
    .number({ invalid_type_error: MUST_BE_NUMBER })
    .optional(),
  creditCard: z
    .object(
      { id: z.string(), dueDay: z.number(), invoiceClosingDay: z.number() },
      { required_error: REQUIRED_FIELD }
    )
    .optional(),
  dueDate: z
    .string()
    .refine(
      (dueDate) => (dueDate ? isValidDate(new Date(dueDate)) : true),
      INVALID_DATE
    )
    .transform((dueDate) => new Date(dueDate))
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
    .optional(),
});

export const createExpenseSchema = baseExpenseSchema
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
    ({ paymentType, creditCard, isPaid }) =>
      isPaid && paymentType === PaymantType.CREDIT_CARD
        ? creditCard?.id && creditCard?.dueDay && creditCard?.invoiceClosingDay
        : true,
    { message: REQUIRED_FIELD, path: ["creditCard"] }
  )
  .refine(
    ({ paymentType, creditCard, isPaid }) =>
      isPaid && paymentType !== PaymantType.CREDIT_CARD && creditCard?.id
        ? false
        : true,
    { message: "Do not required", path: ["creditCard"] }
  )
  .refine(
    ({ creditCard, isPaid, dueDate }) =>
      creditCard?.id || isPaid ? true : dueDate,
    { message: REQUIRED_FIELD, path: ["dueDate"] }
  );
