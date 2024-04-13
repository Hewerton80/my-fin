import { twMerge } from "tailwind-merge";
import { ComponentPropsWithRef, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

export interface CardHeaderProps extends ComponentPropsWithRef<"div"> {}
export interface CardActionsProps extends ComponentPropsWithRef<"div"> {}
export interface CardBodyProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}
export interface CardFooterProps extends ComponentPropsWithRef<"div"> {
  orientation?: "start" | "end" | "center";
  asChild?: boolean;
}

export const Root = forwardRef(
  ({ children, className, asChild, ...restProps }: CardProps, ref?: any) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={twMerge(
          "flex flex-col w-full rounded-[1.25rem] overflow-hidden",
          "shadow-sm bg-card dark:bg-dark-card/70",
          className
        )}
        {...restProps}
      >
        {children}
      </Comp>
    );
  }
);

const Header = forwardRef(
  ({ children, className, ...restProps }: CardHeaderProps, ref?: any) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          "flex items-center justify-between px-4 sm:px-[1.875rem] pt-5 sm:pt-6",
          className
        )}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

const Actions = forwardRef(
  ({ children, className, ...restProps }: CardActionsProps, ref?: any) => {
    return (
      <div
        ref={ref}
        className={twMerge("flex items-center", className)}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

export const Title = forwardRef(
  ({ children, className, asChild, ...rest }: CardProps, ref?: any) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={twMerge("flex items-center", className)}
        {...rest}
      >
        <h4 className="text-base sm:text-xl text-black dark:text-white font-medium">
          {children}
        </h4>
      </Comp>
    );
  }
);

const Body = forwardRef(
  ({ children, className, asChild, ...rest }: CardBodyProps, ref?: any) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={twMerge("flex flex-col p-4 sm:p-[1.875rem]", className)}
        {...rest}
      >
        {children}
      </Comp>
    );
  }
);

const Footer = forwardRef(
  (
    { children, className, orientation = "start", ...rest }: CardFooterProps,
    ref?: any
  ) => {
    return (
      <div
        className={twMerge(
          "flex items-center mt-auto px-4 sm:px-[1.875rem] pb-5",
          orientation === "start" && "justify-start",
          orientation === "center" && "justify-center",
          orientation === "end" && "justify-end",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
const Card = { Root, Header, Title, Actions, Body, Footer };

export { Card };
