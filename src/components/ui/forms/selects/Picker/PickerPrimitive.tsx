import { ComponentPropsWithRef, forwardRef, ReactNode, useMemo } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  LuCheck as Check,
  LuChevronDown as ChevronDown,
  LuChevronUp as ChevronUp,
} from "react-icons/lu";
import { twMerge } from "tailwind-merge";

const Trigger = forwardRef(
  (
    {
      className,
      children,
      ...props
    }: ComponentPropsWithRef<typeof SelectPrimitive.Trigger>,
    ref?: any
  ) => {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={twMerge(
          "flex h-10 w-full items-center justify-between rounded-md border border-input",
          "bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ease-linear duration-200",
          "data-[state=open]:outline-hidden data-[state=open]:ring-4 data-[state=open]:ring-primary/40",
          "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);

const ScrollUpButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={twMerge(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));

const ScrollDownButton = forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={twMerge(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));

const Label = forwardRef(
  (
    {
      className,
      ...props
    }: ComponentPropsWithRef<typeof SelectPrimitive.Label>,
    ref?: any
  ) => {
    return (
      <SelectPrimitive.Label
        ref={ref}
        className={twMerge("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
        {...props}
      />
    );
  }
);

const Item = forwardRef(
  (
    {
      className,
      children,
      ...props
    }: ComponentPropsWithRef<typeof SelectPrimitive.Item>,
    ref?: any
  ) => {
    return (
      <SelectPrimitive.Item
        ref={ref}
        className={twMerge(
          "relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8",
          "pr-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    );
  }
);

// function Separator(
//   {
//     className,
//     ...props
//   }: ComponentPropsWithRef<typeof SelectPrimitive.Separator>,
//   ref?: any
// ) {
//   return (
//     <SelectPrimitive.Separator
//       ref={ref}
//       className={twMerge("-mx-1 my-1 h-px bg-muted", className)}
//       {...props}
//     />
//   );
// }

export const PickerPrimitive = {
  Trigger,
  Label,
  Item,
  ScrollUpButton,
  ScrollDownButton,
};
