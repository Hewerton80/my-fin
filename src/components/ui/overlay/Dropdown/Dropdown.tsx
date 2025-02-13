import React, { ComponentPropsWithRef, forwardRef } from "react";
import * as PrimitiveDropdown from "@radix-ui/react-dropdown-menu";
import { twMerge } from "tailwind-merge";

export interface DropdownProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Root> {}

export interface DropdowTriggerProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Trigger> {}

export interface DropdowSubTriggerProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.SubTrigger> {}

export interface DropdowContentProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Content> {}

export interface DropdowSubContentProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.SubContent> {}

export interface DropdowItemProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Item> {}

export interface DropdowLabelProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Label> {}

export interface DropdowSeparatorProps
  extends ComponentPropsWithRef<typeof PrimitiveDropdown.Separator> {}

const contentClasses = twMerge(
  "flex flex-col z-50 min-w-[8rem] overflow-hidden rounded-md border ",
  "bg-popover p-1 text-popover-foreground data-[state=open]:animate-in",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
  "data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 ",
  "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 ",
  "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 ",
  "data-[side=top]:slide-in-from-bottom-2"
);

const Root = ({ children }: DropdownProps) => {
  return (
    <PrimitiveDropdown.Root modal={false}>{children}</PrimitiveDropdown.Root>
  );
};

const Trigger = (
  { children, ...restProps }: DropdowTriggerProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Trigger ref={ref} {...restProps}>
      {children}
    </PrimitiveDropdown.Trigger>
  );
};

const SubTrigger = (
  { children, className, ...restProps }: DropdowSubTriggerProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.SubTrigger
      className={twMerge(
        "flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm",
        "outline-hidden focus:bg-accent data-[state=open]:bg-accent",
        className
      )}
      ref={ref}
      {...restProps}
    >
      {children}
    </PrimitiveDropdown.SubTrigger>
  );
};

const Content = (
  {
    children,
    className,
    sideOffset = 4,
    align = "end",
    ...restProps
  }: DropdowContentProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Portal>
      <PrimitiveDropdown.Content
        ref={ref}
        className={twMerge(contentClasses, "shadow-lg", className)}
        sideOffset={sideOffset}
        align={align}
        {...restProps}
      >
        {children}
      </PrimitiveDropdown.Content>
    </PrimitiveDropdown.Portal>
  );
};

const SubContent = (
  { children, className, sideOffset = 4, ...restProps }: DropdowSubContentProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Portal>
      <PrimitiveDropdown.SubContent
        ref={ref}
        sideOffset={sideOffset}
        className={twMerge(contentClasses, "shadow-md", className)}
        {...restProps}
      >
        {children}
      </PrimitiveDropdown.SubContent>
    </PrimitiveDropdown.Portal>
  );
};

const Item = (
  { children, className, ...restProps }: DropdowItemProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Item
      ref={ref}
      className={twMerge(
        "relative flex cursor-default select-none items-center rounded-md",
        "px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent",
        "focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...restProps}
    >
      {children}
    </PrimitiveDropdown.Item>
  );
};

const Label = (
  { children, className, ...restProps }: DropdowLabelProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Label
      ref={ref}
      className={twMerge("px-2 py-1.5 text-sm font-semibold", className)}
      {...restProps}
    >
      {children}
    </PrimitiveDropdown.Label>
  );
};

const Separator = (
  { className, ...restProps }: DropdowSeparatorProps,
  ref?: any
) => {
  return (
    <PrimitiveDropdown.Separator
      ref={ref}
      className={twMerge("-mx-1 my-1 h-px bg-muted", className)}
      {...restProps}
    />
  );
};

const Dropdown = {
  Root,
  Trigger: forwardRef(Trigger),
  SubTrigger: forwardRef(SubTrigger),
  Content: forwardRef(Content),
  Sub: PrimitiveDropdown.Sub,
  SubContent: forwardRef(SubContent),
  Item: forwardRef(Item),
  Label: forwardRef(Label),
  Separator: forwardRef(Separator),
};

export { Dropdown };
