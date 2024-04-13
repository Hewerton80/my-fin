"use client";
import React, { ComponentPropsWithRef } from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { twMerge } from "tailwind-merge";
import slideAndFadeANimation from "@/components/sharedStyles/slideAndFade.module.css";
import menuStyle from "@/components/sharedStyles/menu.module.css";

export interface DropdownProps
  extends ComponentPropsWithRef<typeof RadixDropdown.Root> {}
export interface DropdowToogleProps
  extends RadixDropdown.DropdownMenuTriggerProps {}

export interface DropdowMenuProps extends RadixDropdown.MenuContentProps {}
export interface DropdowItemProps extends RadixDropdown.MenuItemProps {}

function Dropdown({ children }: DropdownProps) {
  return <RadixDropdown.Root modal={false}>{children}</RadixDropdown.Root>;
}

function Toogle({ children, ...restProps }: DropdowToogleProps) {
  return (
    <RadixDropdown.Trigger {...restProps}>{children}</RadixDropdown.Trigger>
  );
}

function Menu({ children, className, ...restProps }: DropdowMenuProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
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
}

function Item({ children, className, ...restProps }: DropdowItemProps) {
  return (
    <RadixDropdown.Item
      className={twMerge(menuStyle.item, className)}
      {...restProps}
    >
      {children}
    </RadixDropdown.Item>
  );
}

Dropdown.Toogle = Toogle;
Dropdown.Menu = Menu;
Dropdown.Item = Item;

export { Dropdown };
