import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { FaTimes } from "react-icons/fa";
import {
  Card,
  CardBodyProps,
  CardFooterProps,
} from "@/components/ui/cards/Card";

const sizes = {
  xs: "max-w-[444px]",
  sm: "max-w-[600px]",
  md: "max-w-[900px]",
  lg: "max-w-[1200px]",
  xl: "max-w-[1400px]",
};

export interface ModalProps {
  children: ReactNode;
  id?: string;
  className?: string;
  show?: boolean;
  hideCloseIcon?: boolean;
  disableBackdropClick?: boolean;
  size?: keyof typeof sizes;
  onClose?: () => void;
}
export interface ModalTitleProps extends ComponentPropsWithoutRef<"div"> {}
export interface ModalBodyProps extends CardBodyProps {}
export interface ModalFooterProps extends CardFooterProps {}

const Root = ({
  children,
  className,
  show,
  hideCloseIcon,
  disableBackdropClick,
  size = "sm",
  onClose,
  ...restProps
}: ModalProps) => {
  return (
    <Dialog.Root open={show}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="z-10000 fixed inset-0 bg-black/70"
          onClick={() => !disableBackdropClick && onClose?.()}
        />
        <Card.Root
          asChild
          className={twMerge(
            "fixed z-10001 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
            "w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-visible",
            "focus:outline-hidden",
            sizes[size],
            className
          )}
        >
          <Dialog.Content
            onOpenAutoFocus={(e) => e.preventDefault()}
            {...restProps}
          >
            {children}
            {!hideCloseIcon && (
              <Dialog.Close
                asChild
                className="absolute top-5 right-6 p-1 cursor-pointer text-foreground"
                onClick={onClose}
                role="button"
                aria-label="Close"
              >
                <span>
                  <FaTimes />
                </span>
              </Dialog.Close>
            )}
          </Dialog.Content>
        </Card.Root>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
const Title = ({ children, ...restProps }: ModalTitleProps) => {
  return (
    <Card.Header>
      <Dialog.Title asChild>
        <Card.Title {...restProps}>{children}</Card.Title>
      </Dialog.Title>
    </Card.Header>
  );
};

const Body = ({ children, ...restProps }: ModalBodyProps) => {
  return (
    <Dialog.Description asChild>
      <Card.Body {...restProps}>{children}</Card.Body>
    </Dialog.Description>
  );
};

function Footer({ children, className, ...restProps }: ModalFooterProps) {
  return (
    <Card.Footer
      orientation="end"
      className={twMerge("pt-5", className)}
      {...restProps}
    >
      {children}
    </Card.Footer>
  );
}
const Modal = { Root, Title, Body, Footer };
// Modal.Title = Title;
// Modal.Body = Body;
// Modal.Footer = Footer;

export { Modal };
