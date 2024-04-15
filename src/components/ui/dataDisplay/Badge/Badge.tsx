import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-primary/20 text-primary",
  info: "bg-info/20 text-info",
  success: "bg-success/20 text-success",
  danger: "bg-danger/20 text-danger",
  warning: "bg-warning/20 text-warning",
  dark: "text-light bg-text-acent dark:text-text-acent dark:bg-light",
};
interface BadgeProps extends ComponentPropsWithRef<"span"> {
  variant: keyof typeof variants;
}
export const Badge = ({
  children,
  className,
  variant,
  ...restProps
}: BadgeProps) => {
  return (
    <span
      className={twMerge(
        "inline-flex items-center justify-center py-0.5 px-2.5 w-fit",
        "text-xs font-semibold rounded-md ",
        variants[variant],
        className
      )}
      {...restProps}
    >
      {children}
    </span>
  );
};
