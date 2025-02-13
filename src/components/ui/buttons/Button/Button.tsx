import {
  ComponentPropsWithRef,
  useMemo,
  createElement,
  ReactNode,
  Children,
  Fragment,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { spinnerStyle } from "./spinnerStyle";

interface ButtonStyle {
  bg: string;
  border: string;
  text: string;
  focusRing?: string;
  activeRing?: string;
  hoverBg?: string;
  hoverText?: string;
}

const generateButtonStyles = (baseStyles: ButtonStyle) => {
  const { bg, border, text, focusRing, activeRing, hoverBg, hoverText } =
    baseStyles;
  const commonClasses = [
    bg,
    border,
    text,
    activeRing,
    focusRing,
    hoverBg,
    hoverText,
  ];
  return twMerge(...commonClasses);
};

const buttonVariants = {
  style: {
    primary: generateButtonStyles({
      bg: "bg-primary hover:bg-primary/90",
      border: "border-primary",
      text: "text-primary-foreground",
      focusRing: "focus:ring-primary/40",
      activeRing: "active:ring-primary/40",
    }),
    success: generateButtonStyles({
      bg: "bg-success hover:bg-success/90",
      border: "border-success",
      text: "text-success-foreground",
      focusRing: "focus:ring-success/40",
      activeRing: "active:ring-success/40",
    }),
    info: generateButtonStyles({
      bg: "bg-info hover:bg-info/90",
      border: "border-info",
      text: "text-info-foreground",
      focusRing: "focus:ring-info/40",
      activeRing: "active:ring-info/40",
    }),
    warning: generateButtonStyles({
      bg: "bg-warning hover:bg-warning/90",
      border: "border-warning",
      text: "text-warning-foreground",
      focusRing: "focus:ring-warning/40",
      activeRing: "active:ring-warning/40",
    }),
    danger: generateButtonStyles({
      bg: "bg-danger hover:bg-danger/90",
      border: "border-danger",
      text: "text-danger-foreground",
      focusRing: "focus:ring-danger/40",
      activeRing: "active:ring-danger/40",
    }),
    secondary: generateButtonStyles({
      bg: "bg-secondary hover:bg-secondary/90",
      border: "border-secondary",
      text: "text-secondary-foreground",
      focusRing: "focus:ring-secondary/40",
      activeRing: "active:ring-secondary/40",
    }),
    dark: generateButtonStyles({
      bg: "bg-dark",
      border: "border-dark",
      text: "text-dark-foreground",
      focusRing: "focus:ring-dark/40",
      activeRing: "active:ring-dark/40",
      hoverBg: "hover:bg-dark/90",
    }),
    "primary-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-primary",
      hoverBg: "hover:bg-primary/20",
    }),
    "dark-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-accent-foreground",
      hoverBg: "hover:bg-accent hover:text-accent-foreground",
    }),
    outline: generateButtonStyles({
      bg: "bg-background",
      border: "border-input",
      text: "text-foreground",
      // focusRing: "focus:ring-dark/40",
      activeRing: "active:ring-accent/40",
      hoverBg: "hover:bg-accent hover:text-accent-foreground",
    }),
  },
};

export type ButtonVariantStyle = keyof typeof buttonVariants.style;

const getButtonVariantStyle = (variant: ButtonVariantStyle) => {
  return buttonVariants.style[variant];
};

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variantStyle?: ButtonVariantStyle;
  isLoading?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef(
  (
    {
      children,
      variantStyle = "primary",
      type = "button",
      isLoading,
      disabled,
      className,
      leftIcon,
      rightIcon,
      formTarget,
      fullWidth,
      asChild,
      ...restProps
    }: ButtonProps,
    ref?: any
  ) => {
    const Comp = asChild ? Slot : "button";

    const handledChildren = useMemo(() => {
      let handledChildrenTmp: ReactNode = Children.toArray(
        children || <></>
      )[0];

      const hasIcon = leftIcon || rightIcon;
      if (hasIcon) {
        const childrenIsHtmlTag = typeof handledChildrenTmp === "object";
        const ChildrenComp = Object(handledChildrenTmp);
        handledChildrenTmp = createElement(
          childrenIsHtmlTag ? ChildrenComp?.type : Fragment,
          ChildrenComp?.props || {},
          <>
            {leftIcon && <span className="mr-3">{leftIcon}</span>}
            {ChildrenComp?.props?.children || children}
            {rightIcon && <span className="ml-3">{rightIcon}</span>}
          </>
        );
      }
      return handledChildrenTmp;
    }, [children, leftIcon, rightIcon]);

    return (
      <Comp
        ref={ref}
        className={twMerge(
          "inline-flex items-center justify-center relative whitespace-nowrap",
          "h-10 px-4 py-2 w-fit sm:px-2.5 sm:py-1.5",
          "cursor-pointer ease-linear duration-200 border rounded-lg outline-hidden",
          "text-xs sm:text-sm font-medium leading-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus:ring-4 active:ring-4",
          fullWidth && "w-full",
          getButtonVariantStyle(variantStyle),
          isLoading && twMerge("text-transparent", spinnerStyle.root),
          className
        )}
        type={type}
        disabled={disabled || isLoading}
        {...restProps}
      >
        {handledChildren}
      </Comp>
    );
  }
);
