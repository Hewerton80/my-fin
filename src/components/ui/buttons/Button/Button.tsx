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
import spinnerStyle from "./spinner.module.css";

interface ButtonStyle {
  bg: string;
  border: string;
  text: string;
  focusRing?: string;
  activeRing?: string;
  hoverBg?: string;
  hoverText?: string;
  darkStyles?: string[];
}

const generateButtonStyles = (baseStyles: ButtonStyle) => {
  const {
    bg,
    border,
    text,
    focusRing,
    activeRing,
    hoverBg,
    hoverText,
    darkStyles,
  } = baseStyles;
  const commonClasses = [
    bg,
    border,
    text,
    activeRing,
    focusRing,
    hoverBg,
    hoverText,
    darkStyles,
  ];

  if (darkStyles) {
    commonClasses.push(...darkStyles);
  }

  return twMerge(...commonClasses);
};

const buttonVariants = {
  style: {
    primary: generateButtonStyles({
      bg: "bg-primary",
      border: "border-primary",
      text: "text-white",
      focusRing: "focus:ring-primary/40",
      activeRing: "active:ring-primary/40",
    }),
    success: generateButtonStyles({
      bg: "bg-success",
      border: "border-success",
      text: "text-white",
      focusRing: "focus:ring-success/40",
      activeRing: "active:ring-success/40",
    }),
    info: generateButtonStyles({
      bg: "bg-info",
      border: "border-info",
      text: "text-white",
      focusRing: "focus:ring-info/40",
      activeRing: "active:ring-info/40",
    }),
    warning: generateButtonStyles({
      bg: "bg-warning",
      border: "border-warning",
      text: "text-white",
      focusRing: "focus:ring-warning/40",
      activeRing: "active:ring-warning/40",
    }),
    danger: generateButtonStyles({
      bg: "bg-danger",
      border: "border-danger",
      text: "text-white",
      focusRing: "focus:ring-danger/40",
      activeRing: "active:ring-danger/40",
    }),
    light: generateButtonStyles({
      bg: "bg-light",
      border: "border-light",
      text: "text-black",
      focusRing: "focus:ring-light/40",
      activeRing: "active:ring-light/40",
    }),
    "primary-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-primary",
      hoverBg: "hover:bg-primary/20",
    }),
    "success-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-success",
      hoverBg: "hover:bg-success/10",
    }),
    "info-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-info",
      hoverBg: "hover:bg-info/10",
    }),
    "warning-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-warning",
      hoverBg: "hover:bg-warning/10",
    }),
    "danger-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-danger",
      hoverBg: "hover:bg-danger/10",
    }),
    "light-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-light",
      hoverBg: "hover:bg-light/10",
    }),
    "dark-ghost": generateButtonStyles({
      bg: "bg-transparent",
      border: "border-transparent",
      text: "text-body-text dark:text-light",
      hoverBg: "hover:bg-dark-card/10 dark:hover:bg-light/10",
    }),
  },
};

export type ButtonVariantStyle = keyof typeof buttonVariants.style;

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
          "h-fit w-fit px-3 py-2 sm:px-4 sm:py-2.5",
          "cursor-pointer ease-linear duration-200 border-2 rounded-lg outline-none",
          "text-xs sm:text-sm font-medium leading-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus:ring-4 active:ring-4",
          fullWidth && "w-full",
          buttonVariants.style[variantStyle],
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
