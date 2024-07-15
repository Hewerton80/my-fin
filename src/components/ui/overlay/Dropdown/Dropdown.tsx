"use client";
import React, { ComponentPropsWithRef, forwardRef } from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { twMerge } from "tailwind-merge";
import slideAndFadeANimation from "@/components/sharedStyles/slideAndFade.module.css";
import menuStyle from "@/components/sharedStyles/menu.module.css";

export interface DropdownProps
  extends ComponentPropsWithRef<typeof RadixDropdown.Root> {}

export interface DropdowToogleProps
  extends ComponentPropsWithRef<typeof RadixDropdown.Trigger> {}

export interface DropdowMenuProps
  extends ComponentPropsWithRef<typeof RadixDropdown.Content> {}

export interface DropdowItemProps
  extends ComponentPropsWithRef<typeof RadixDropdown.Item> {}
{
}

const Root = ({ children }: DropdownProps) => {
  return <RadixDropdown.Root modal={false}>{children}</RadixDropdown.Root>;
};

const Toogle = ({ children, ...restProps }: DropdowToogleProps, ref?: any) => {
  return (
    <RadixDropdown.Trigger ref={ref} {...restProps}>
      {children}
    </RadixDropdown.Trigger>
  );
};

const Menu = (
  { children, className, ...restProps }: DropdowMenuProps,
  ref?: any
) => {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        ref={ref}
        className={twMerge(
          menuStyle.root,
          "origin-top-right min-w-[13rem]",
          slideAndFadeANimation.root,
          className
        )}
        sideOffset={6}
        alignOffset={8}
        align="end"
        {...restProps}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  );
};

const Item = (
  { children, className, ...restProps }: DropdowItemProps,
  ref?: any
) => {
  return (
    <RadixDropdown.Item
      ref={ref}
      className={twMerge(menuStyle.item, className)}
      {...restProps}
    >
      {children}
    </RadixDropdown.Item>
  );
};

const Dropdown = {
  Root: Root,
  Toogle: forwardRef(Toogle),
  Menu: forwardRef(Menu),
  Item: forwardRef(Item),
};

export { Dropdown };
