import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { twMerge } from "tailwind-merge";
import { FaTimes } from "react-icons/fa";
import {
  Card,
  CardBodyProps,
  CardFooterProps,
} from "@/components/ui/cards/Card";

export interface ModalProps {
  children: ReactNode;
  id?: string;
  className?: string;
  show?: boolean;
  hideCloseIcon?: boolean;
  disableBackdropClick?: boolean;
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
  onClose,
  ...restProps
}: ModalProps) => {
  return (
    <Dialog.Root open={show}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="z-[10000] fixed inset-0 bg-black/30"
          onClick={() => !disableBackdropClick && onClose?.()}
        />
        <Card.Root
          asChild
          className={twMerge(
            "fixed z-[10001] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
            "w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] max-w-xl overflow-visible",
            "dark:bg-dark-card",
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
                className="absolute top-5 right-6 p-1 cursor-pointer text-black dark:text-light"
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
      <Card.Title {...restProps}>{children}</Card.Title>
    </Card.Header>
  );
};

const Body = ({ children, ...restProps }: ModalBodyProps) => {
  return <Card.Body {...restProps}>{children}</Card.Body>;
};

function Footer({ children, ...restProps }: ModalFooterProps) {
  return <Card.Footer {...restProps}>{children}</Card.Footer>;
}
const Modal = { Root, Title, Body, Footer };
// Modal.Title = Title;
// Modal.Body = Body;
// Modal.Footer = Footer;

export { Modal };
