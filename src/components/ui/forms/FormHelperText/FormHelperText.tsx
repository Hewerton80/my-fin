import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface FormHelperTextProps extends ComponentProps<"span"> {}

export function FormHelperText({
  children,
  className,
  ...restProps
}: FormHelperTextProps) {
  return (
    <span
      className={twMerge(
        "text-danger text-xs font-bold whitespace-nowrap mt-1",
        className
      )}
      {...restProps}
    >
      {children}
    </span>
  );
}
