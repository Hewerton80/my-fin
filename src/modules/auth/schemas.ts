import { CONSTANTS } from "@/utils/constants";
import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: CONSTANTS.VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD }),
  password: z
    .string()
    .min(1, { message: CONSTANTS.VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD }),
});
