import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";

interface TextareaProps
  extends Omit<ComponentPropsWithRef<"textarea">, "className"> {
  formControlClassName?: string;
  textareaClassName?: string;
  label?: string;
  error?: string;
}

export const Textarea = forwardRef(
  (
    {
      formControlClassName,
      textareaClassName,
      label,
      error,
      required,
      ...restProps
    }: TextareaProps,
    ref?: any
  ) => {
    return (
      <div className={twMerge("flex flex-col w-full", formControlClassName)}>
        {label && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        <textarea
          ref={ref}
          required={required}
          className={twMerge(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium ease-linear duration-200",
            "placeholder:text-muted-foreground outline-none focus-visible:ring-2",
            "focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/40",
            textareaClassName
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
