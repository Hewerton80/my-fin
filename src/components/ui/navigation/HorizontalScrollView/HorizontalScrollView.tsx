import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface HorizontalScrollViewProps extends ComponentPropsWithRef<"div"> {}

export const HorizontalScrollView = forwardRef(
  (
    { className, children, ...restField }: HorizontalScrollViewProps,
    ref?: any
  ) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          "flex items-center py-1 px-1 overflow-x-auto justify-start gap-x-1 sm:gap-x-2",
          className
        )}
        {...restField}
      >
        {children}
      </div>
    );
  }
);
