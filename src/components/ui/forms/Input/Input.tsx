import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";

interface InputProps extends Omit<ComponentPropsWithRef<"input">, "className"> {
  formControlClassName?: string;
  inputClassName?: string;
  label?: string;
  error?: string;
}

export const Input = forwardRef(
  (
    {
      formControlClassName,
      inputClassName,
      label,
      error,
      required,
      ...restProps
    }: InputProps,
    ref?: any
  ) => {
    return (
      <div className={twMerge("flex flex-col w-full", formControlClassName)}>
        {label && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        <input
          ref={ref}
          required={required}
          className={twMerge(
            "px-3 py-1.5 h-10 w-full rounded-md bg-white dark:bg-dark-card ",
            "text-body-text dark:text-light dark:border-dark-border text-sm shadow-sm autofill:dark:!bg-dark-card",
            "placeholder:text-body-text/40 placeholder:dark:text-light/40",
            "outline-none border border-border focus-visible:border-primary",
            "dark:focus-visible:border-primary",
            "duration-150 ease-linear disabled:bg-border",
            error && "border-danger/60 focus-visible:border-danger",
            inputClassName
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
