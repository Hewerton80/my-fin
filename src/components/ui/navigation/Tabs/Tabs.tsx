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
    <RadixTabs.Root
      ref={ref}
      className={twMerge("overflow-x-auto", className)}
      {...restProps}
    >
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
        "inline-flex h-10 items-center justify-center",
        "rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...restProps}
    >
      {children}
    </RadixTabs.List>
  );
};

const Trigger = (
  { children, className, ...restProps }: TabTriggerProps,
  ref?: any
) => {
  return (
    <RadixTabs.Trigger
      ref={ref}
      className={twMerge(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5",
        "text-xs sm:text-sm font-medium ring-offset-background transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
        "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground",
        "data-[state=active]:shadow-xs",
        className
      )}
      {...restProps}
    >
      {children}
    </RadixTabs.Trigger>
  );
};

const Content = (
  { children, className, ...restProps }: TabContentProps,
  ref?: any
) => {
  return (
    <RadixTabs.Content
      className={twMerge(
        "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      ref={ref}
      {...restProps}
    >
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
