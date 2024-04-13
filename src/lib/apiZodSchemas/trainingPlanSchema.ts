import { z } from "zod";
import { CONSTANTS } from "@/shared/constants";

const { REQUIRED_FIELDS } = CONSTANTS.VALIDATION_ERROR_MESSAGES;

export const trainingPlanSchema = z.object({
  name: z
    .string({ required_error: REQUIRED_FIELDS })
    .min(1, REQUIRED_FIELDS)
    .trim(),
});
