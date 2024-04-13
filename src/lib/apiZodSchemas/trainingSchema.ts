import { z } from "zod";
import { CONSTANTS } from "@/shared/constants";

const { REQUIRED_FIELDS, MUST_BE_NUMBER, MUST_BE_POSITIVE, MUST_BE_ARRAY } =
  CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const trainingSchema = z.object({
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().min(1, REQUIRED_FIELDS).trim(),
        order: z
          .number({
            required_error: REQUIRED_FIELDS,
            invalid_type_error: MUST_BE_NUMBER,
          })
          .min(1, MUST_BE_POSITIVE),
        intervalInSeconds: z
          .number({
            required_error: REQUIRED_FIELDS,
            invalid_type_error: MUST_BE_NUMBER,
          })
          .min(1, MUST_BE_POSITIVE),
      }),
      { required_error: REQUIRED_FIELDS, invalid_type_error: MUST_BE_ARRAY }
    )
    .min(1, REQUIRED_FIELDS)
    .refine(
      (exercises: any[]) => {
        const exercisesIds = exercises.map((exercise) => exercise.exerciseId);
        return new Set(exercisesIds).size === exercises.length;
      },
      { message: "Há valores repetidos para exercícios" }
    )
    .refine(
      (exercises: any[]) => {
        const exercisesOrders = exercises.map((exercise) => exercise.order);
        return new Set(exercisesOrders).size === exercises.length;
      },
      { message: "Há valores repetidos para ordenação" }
    ),
});
