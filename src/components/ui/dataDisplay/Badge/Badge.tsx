import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary:
    "bg-primary dark:bg-primary/20 text-primary-foreground dark:text-primary",
  info: "bg-info dark:bg-info/20 text-info-foreground dark:text-info",
  success:
    "bg-success dark:bg-success/20 text-success-foreground dark:text-success",
  danger: "bg-danger dark:bg-danger/20 text-danger-foreground dark:text-danger",
  warning: "bg-warning text-white dark:bg-warning/20 dark:text-warning",
  dark: "bg-dark text-white dark:bg-dark/20 dark:text-dark",
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
