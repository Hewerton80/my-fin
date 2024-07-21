import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-primary text-white dark:bg-primary/20 dark:text-primary",
  info: "bg-info text-white dark:bg-info/20 dark:text-info",
  success: "bg-success text-white dark:bg-success/20 dark:text-success",
  danger: "bg-danger text-white dark:bg-danger/20 dark:text-danger",
  warning: "bg-warning text-white dark:bg-warning/20 dark:text-warning",
  dark: "text-light bg-text-accent dark:text-text-accent dark:bg-light",
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
        "text-xs font-semibold rounded-md whitespace-nowrap",
        variants[variant],
        className
      )}
      {...restProps}
    >
      {children}
    </span>
  );
};
