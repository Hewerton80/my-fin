import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { FaRegSmile } from "react-icons/fa";
import { Slot } from "@radix-ui/react-slot";
import {
  IoIosInformationCircleOutline,
  IoMdCheckboxOutline,
} from "react-icons/io";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineDangerous, MdWarningAmber } from "react-icons/md";

export const alertVariants = {
  primary: {
    root: "bg-primary",
    icon: <FaRegSmile />,
  },
  success: {
    root: "bg-success",
    icon: <IoMdCheckboxOutline />,
  },
  secondary: {
    root: "bg-secondary",
    icon: <AiOutlineLike />,
  },
  info: {
    root: "bg-info",
    icon: <IoIosInformationCircleOutline />,
  },
  danger: {
    root: "bg-danger",
    icon: <MdOutlineDangerous />,
  },
  warning: {
    root: "bg-warning",
    icon: <MdWarningAmber />,
  },
};

export type alertVariants = keyof typeof alertVariants;

interface AlertProps extends ComponentPropsWithRef<"div"> {
  variant: alertVariants;
}

export function Callout({
  variant = "info",
  children,
  className,
  ...rest
}: AlertProps) {
  return (
    <div
      className={twMerge(
        "flex items-center px-6 py-4 w-full border-1 rounded-[0.625rem]",
        "text-sm sm:text-base text-white gap-4",
        alertVariants[variant].root,
        className
      )}
      {...rest}
    >
      <Slot className="text-2xl">{alertVariants[variant].icon}</Slot>
      {children}
    </div>
  );
}
