import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

interface FormLabelProps extends ComponentPropsWithRef<"label"> {
  required?: boolean;
}

export function FormLabel({
  children,
  className,
  required,
  ...restProps
}: FormLabelProps) {
  return (
    <label
      className={twMerge(
        "mb-2 text-sm font-medium whitespace-nowrap",
        required && "after:content-['*'] after:text-danger",
        className
      )}
      {...restProps}
    >
      {children}
    </label>
  );
}
