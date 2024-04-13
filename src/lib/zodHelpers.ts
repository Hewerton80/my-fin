import { z } from "zod";

export type ToZodObjectSchema<Type> = {
  [Property in keyof Type]?: z.ZodTypeAny;
};

export const handleZodValidationError = (error: z.ZodError) => {
  const responseError: { [key: string]: string } = {};
  error.issues.forEach((err) => {
    const errorMessage = err.message;
    const errorPath = err.path.join(".");
    responseError[errorPath] = errorMessage;
    return { [errorPath]: errorMessage };
  });
  return { validationError: responseError };
};
