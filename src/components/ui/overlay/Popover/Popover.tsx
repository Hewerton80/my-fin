import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { twMerge } from "tailwind-merge";

function Content(
  {
    className,
    align = "center",
    sideOffset = 4,
    ...restProps
  }: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
  ref?: any
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={twMerge(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
          "outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...restProps}
      />
    </PopoverPrimitive.Portal>
  );
}

export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Content: forwardRef(Content),
};
