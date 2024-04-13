import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface HiperLinkProps extends ComponentPropsWithRef<"span"> {
  asChild?: boolean;
}

export const HiperLink = forwardRef(
  (
    { className, children, asChild, ...restProps }: HiperLinkProps,
    ref?: any
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={twMerge(
          "inline-flex items-center text-info hover:underline hover:cursor-pointer",
          className
        )}
        ref={ref}
        {...restProps}
      >
        {children}
      </Comp>
    );
  }
);
