import { twMerge } from "tailwind-merge";
import { ImSpinner2 } from "react-icons/im";
import { ComponentPropsWithRef } from "react";

interface SpinnerProps extends ComponentPropsWithRef<"span"> {
  size?: number;
}

export function Spinner({ className, size = 32, ...restProps }: SpinnerProps) {
  return (
    <span className={twMerge("animate-spin", className)} {...restProps}>
      <ImSpinner2 size={size} className="text-primary dark:text-light" />
    </span>
  );
}
