import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";
import style from "@/components/sharedStyles/textField.module.css";

export interface InputProps
  extends Omit<ComponentPropsWithRef<"input">, "className"> {
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
            style.root,
            "h-9",
            error && style.error,
            inputClassName
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
