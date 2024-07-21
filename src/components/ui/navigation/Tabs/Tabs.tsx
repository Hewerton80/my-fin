import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import * as RadixTabs from "@radix-ui/react-tabs";

interface TabRootProps extends RadixTabs.TabsProps {}
interface TabListProps extends RadixTabs.TabsListProps {}
interface TabTriggerProps extends RadixTabs.TabsTriggerProps {}
interface TabContentProps extends RadixTabs.TabsContentProps {}

const Root = (
  { children, className, ...restProps }: TabRootProps,
  ref?: any
) => {
  return (
    <RadixTabs.Root ref={ref} className={twMerge("", className)} {...restProps}>
      {children}
    </RadixTabs.Root>
  );
};

const List = (
  { children, className, ...restProps }: TabListProps,
  ref?: any
) => {
  return (
    <RadixTabs.List
      ref={ref}
      className={twMerge(
        "flex p-1 outline-none rounded-md bg-accent dark:bg-muted",
        className
      )}
      {...restProps}
    >
      {children}
    </RadixTabs.List>
  );
};

const Trigger = (
  { children, className, disabled, ...restProps }: TabTriggerProps,
  ref?: any
) => {
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={twMerge(
        "text-xs sm:text-sm font-semibold rounded-[4px] bg-transparent text-muted-foreground",
        "flex items-center cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5",
        "data-[state=active]:text-dark-card data-[state=active]:bg-white",
        "dark:data-[state=active]:text-light dark:data-[state=active]:bg-dark-card",
        "data-[state=active]:ring-1 data-[state=active]:ring-dark/10",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </RadixTabs.Trigger>
  );
};

const Content = ({ children, ...restProps }: TabContentProps, ref?: any) => {
  return (
    <RadixTabs.Content ref={ref} {...restProps}>
      {children}
    </RadixTabs.Content>
  );
};

export const Tabs = {
  Root: forwardRef(Root),
  List: forwardRef(List),
  Trigger: forwardRef(Trigger),
  Content: forwardRef(Content),
};
