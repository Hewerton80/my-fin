import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";
import style from "@/components/sharedStyles/textField.module.css";

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
            style.root,
            error && style.error,
            textareaClassName
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
