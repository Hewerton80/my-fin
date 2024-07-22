import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FaTimes } from "react-icons/fa";

interface CloseButtonProps extends ComponentPropsWithRef<"span"> {}

export const CloseButton = forwardRef(
  ({ className, ...restProps }: CloseButtonProps, ref?: any) => {
    return (
      <span
        ref={ref}
        className={twMerge(
          "flex items-center justify-center rounded-full w-3 h-3 cursor-pointer duration-300",
          "text-foreground bg-background/50 hover:bg-primary hover:text-foreground",
          className
        )}
        {...restProps}
      >
        <FaTimes size={10} />
      </span>
    );
  }
);
