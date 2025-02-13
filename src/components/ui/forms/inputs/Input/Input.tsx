import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";
import { Slot } from "@radix-ui/react-slot";

export interface InputProps
  extends Omit<ComponentPropsWithRef<"input">, "className"> {
  formControlClassName?: string;
  inputClassName?: string;
  leftIcon?: JSX.Element;
  label?: string;
  error?: string;
}

export const Input = forwardRef(
  (
    {
      formControlClassName,
      inputClassName,
      leftIcon,
      label,
      error,
      required,
      ...restProps
    }: InputProps,
    ref?: any
  ) => {
    return (
      <div
        className={twMerge(
          "flex flex-col w-full relative",
          formControlClassName
        )}
      >
        {label && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        {leftIcon && (
          <Slot className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
            {leftIcon}
          </Slot>
        )}
        <input
          ref={ref}
          required={required}
          className={twMerge(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium ease-linear duration-200",
            "placeholder:text-muted-foreground outline-hidden focus-visible:ring-2",
            "focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/40",
            leftIcon && "pl-8",
            inputClassName
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
