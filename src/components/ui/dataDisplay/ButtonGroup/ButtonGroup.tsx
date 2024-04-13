import React, { ComponentPropsWithRef, LegacyRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonGroupProps extends ComponentPropsWithRef<"div"> {
  vertical?: boolean;
}

export const ButtonGroup = forwardRef(
  (
    { children, className, vertical, ...restProps }: ButtonGroupProps,
    ref?: any
  ) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          "flex [&>button:not(:first-child):not(:last-child)]:rounded-none",
          vertical
            ? twMerge(
                "flex-col [&>button]:w-full",
                "[&>button:first-child]:rounded-b-none [&>button:last-child]:rounded-t-none",
                "[&>button+button]:border-t-0"
              )
            : twMerge(
                "[&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none",
                "[&>button+button]:border-l-0"
              ),
          className
        )}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);
