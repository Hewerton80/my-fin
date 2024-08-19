import { z } from "zod";
import { CONSTANTS } from "@/utils/constants";
import { REGEX } from "@/utils/regex";
import { isValid as isValidDate } from "date-fns";
import { isBoolean, isNumber } from "@/utils/isType";
import { PaymantType } from "@prisma/client";

const { VALIDATION_ERROR_MESSAGES } = CONSTANTS;

const frontendFormExpenseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD),
    categoryId: z.string().min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD),
    description: z.string().optional(),
    amount: z
      .number()
      .refine((amount) => (isNumber(amount) ? amount > 0 : true), {
        message: VALIDATION_ERROR_MESSAGES.MUST_BE_GREATER_THAN_ZERO,
      })
      .optional()
      .nullable(),
    isPaid: z
      .boolean()
      .refine(
        (isPaid) => isBoolean(isPaid),
        VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD
      )
      .optional()
      .nullable(),
    paymentType: z.string().nullable().optional(),
    frequency: z
      .string()
      // .min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD)
      .nullable()
      .optional(),
    totalInstallments: z.number().optional().nullable(),
    creditCardId: z.string().optional(),
    dueDate: z
      .string()
      .refine(
        (dueDate) =>
          dueDate
            ? dueDate.match(REGEX.isoDate) && isValidDate(new Date(dueDate))
            : true,
        VALIDATION_ERROR_MESSAGES.INVALID_DATE
      )
      .optional(),
    registrationDate: z
      .string()
      .min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD)
      .refine(
        (registrationDate) =>
          registrationDate
            ? registrationDate.match(REGEX.isoDate) &&
              isValidDate(new Date(registrationDate))
            : true,
        VALIDATION_ERROR_MESSAGES.INVALID_DATE
      )
      .optional(),
    isCloning: z.boolean().optional(),
  })
  .refine(({ isPaid, frequency }) => (isPaid ? true : frequency), {
    message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
    path: ["frequency"],
  })
  .refine(({ paymentType, isPaid }) => (isPaid ? paymentType : true), {
    message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
    path: ["paymentType"],
  })
  .refine(
    ({ paymentType, isPaid, creditCardId }) =>
      paymentType === PaymantType.CREDIT_CARD || !isPaid ? creditCardId : true,
    {
      message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
      path: ["creditCardId"],
    }
  );

export const payFrontendExpenseSchema = z.object({
  paidAt: z.string().refine((paidAt) => isValidDate(new Date(paidAt)), {
    message: VALIDATION_ERROR_MESSAGES.INVALID_DATE,
  }),
});

export const createFrontendExpenseSchema = frontendFormExpenseSchema;

type InferBaseExpenseFormSchema = z.infer<typeof frontendFormExpenseSchema>;
type InferCreateExpenseFormSchema = z.infer<typeof createFrontendExpenseSchema>;

export type ExpenseFormValues = InferBaseExpenseFormSchema &
  InferCreateExpenseFormSchema;

export type InferPayExpenseFormSchema = z.infer<
  typeof payFrontendExpenseSchema
>;
