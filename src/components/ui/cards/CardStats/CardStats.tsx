import { ReactNode, forwardRef } from "react";
import { Card, CardProps, CardBodyProps, CardHeaderProps } from "../Card";
import { twMerge } from "tailwind-merge";

interface RootProps extends CardProps {}
interface HaderProps extends CardHeaderProps {
  icon?: ReactNode;
}
interface BodyProps extends CardBodyProps {}

export const Root = (
  { children, className, ...restProps }: RootProps,
  ref?: any
) => {
  return (
    <Card.Root ref={ref} className={twMerge(className)} {...restProps}>
      {children}
    </Card.Root>
  );
};

export const Header = (
  { children, className, icon, ...restProps }: HaderProps,
  ref?: any
) => {
  return (
    <Card.Header
      ref={ref}
      className={twMerge("px-4 sm:px-4 py-6 pb-2 [&_h4]:text-sm", className)}
      {...restProps}
    >
      <Card.Title>{children}</Card.Title>
      {icon && <Card.Actions>{icon}</Card.Actions>}
    </Card.Header>
  );
};

export const Body = (
  { children, className, ...restProps }: BodyProps,
  ref?: any
) => {
  return (
    <Card.Body
      ref={ref}
      className={twMerge("p-4 sm:p-4 pt-0 sm:pt-0", className)}
      {...restProps}
    >
      {children}
    </Card.Body>
  );
};

export const CardStats = {
  Root: forwardRef(Root),
  Header: forwardRef(Header),
  Body: forwardRef(Body),
};
