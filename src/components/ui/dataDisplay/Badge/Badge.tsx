import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-primary/20 text-primary",
  success: "bg-success/20 text-success",
  danger: "bg-danger/20 text-danger",
  warning: "bg-warning/20 text-warningprimary",
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
        "inline-flex items-center justify-center py-1 px-2 w-fit",
        "text-[0.625rem] sm:text-xs font-semibold rounded-[0.625rem] ",
        variants[variant],
        className
      )}
      {...restProps}
    >
      {children}
    </span>
  );
};
