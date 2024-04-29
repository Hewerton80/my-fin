import { z } from "zod";
import { CONSTANTS } from "@/shared/constants";

const { REQUIRED_FIELD } = CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const trainingPlanSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELD })
    .min(1, REQUIRED_FIELD)
    .trim(),
});
