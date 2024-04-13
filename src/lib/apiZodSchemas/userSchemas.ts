import { Gender } from "@prisma/client";
import { z } from "zod";
import { CONSTANTS } from "@/shared/constants";
import { isValid as isValidDate } from "date-fns";
import { hashSync } from "bcrypt";

const {
  REQUIRED_FIELDS,
  INVALID_EMAIL,
  INVALID_DATE,
  PASSWORD_MIN_LENGTH,
  MUST_BE_VALID,
  MUST_BE_NUMBER,
  MUST_BE_GREATER_THAN_ZERO,
} = CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const createUserSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELDS })
    .min(1, REQUIRED_FIELDS)
    .trim(),
  email: z
    .string({ required_error: REQUIRED_FIELDS })
    .min(1, REQUIRED_FIELDS)
    .email({ message: INVALID_EMAIL })
    .trim(),
  password: z
    .string({ required_error: REQUIRED_FIELDS })
    .min(6, PASSWORD_MIN_LENGTH)
    .transform((password) => hashSync(String(password).trim(), 10)),
  gender: z
    .string({ required_error: REQUIRED_FIELDS })
    .refine(
      (gender) => Gender?.[gender as Gender],
      `${MUST_BE_VALID}: ${Object.keys(Gender).join(" | ")}`
    ),
  dateOfBirth: z
    .string({ required_error: REQUIRED_FIELDS })
    .refine((dateOfBirth) => isValidDate(new Date(dateOfBirth)), INVALID_DATE)
    .transform((dateOfBirth) => new Date(dateOfBirth)),
  isAdmin: z.boolean({ required_error: REQUIRED_FIELDS }),
  isTeacher: z.boolean({ required_error: REQUIRED_FIELDS }),
});

export const updateUserSchema = createUserSchema
  .omit({ email: true })
  .partial();

export const updateMeSchema = createUserSchema
  .omit({ email: true, isAdmin: true, isTeacher: true })
  .partial()
  .merge(
    z.object({
      currentPassword: z.string().optional(),
      heightInMt: z
        .number({
          required_error: REQUIRED_FIELDS,
          invalid_type_error: MUST_BE_NUMBER,
        })
        .min(0.1, MUST_BE_GREATER_THAN_ZERO)
        .optional(),
      weightInKg: z
        .number({
          required_error: REQUIRED_FIELDS,
          invalid_type_error: MUST_BE_NUMBER,
        })
        .min(0.1, MUST_BE_GREATER_THAN_ZERO)
        .optional(),
    })
  )
  .refine(
    ({ password, currentPassword }) =>
      password && !currentPassword ? false : true,
    {
      path: ["currentPassword"],
      message: REQUIRED_FIELDS,
    }
  )
  .refine(
    ({ password, currentPassword }) =>
      !password && currentPassword ? false : true,
    {
      path: ["password"],
      message: REQUIRED_FIELDS,
    }
  );
