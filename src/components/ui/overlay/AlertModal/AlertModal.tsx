"use client";
import React, { forwardRef, useContext } from "react";
import { Modal, ModalProps } from "@/components/ui/overlay/Modal";
import { twMerge } from "tailwind-merge";
import { Button, ButtonVariantStyle } from "@/components/ui/buttons/Button";
import { isString } from "@/shared/isType";
import { Spinner } from "../../feedback/Spinner";
import { useAlertModal } from "@/hooks/utils/useAlertModal";

// type VariantsMap = {
//   [Property in Variant]: { icon: JSX.Element };
// };

const variants = {
  default: { color: "text-black" },
  success: { color: "text-success" },
  info: { color: "text-info" },
  warning: { color: "text-warning" },
  danger: { color: "text-danger" },
};

type VariantType = keyof typeof variants;

export interface AlertModalProps
  extends Omit<ModalProps, "children" | "hideCloseIcon"> {
  title?: string;
  variant?: VariantType;
  showCancelButton?: boolean;
  isSubmiting?: boolean;
  isLoading?: boolean;
  description?: string | JSX.Element;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariantStyle?: ButtonVariantStyle;
  cancelButtonVariantStyle?: ButtonVariantStyle;
  onClickConfirmButton?: () => void;
  onClickCancelButton?: () => void;
}

const AlertModal = forwardRef(() => {
  // const {
  //   alertArgs: {
  //     show,
  //     title,
  //     description,
  //     variant = "default",
  //     isLoading,
  //     isSubmiting,
  //     confirmButtonText = "Ok",
  //     cancelButtonText = "Voltar",
  //     confirmButtonVariantStyle = "primary",
  //     cancelButtonVariantStyle = "light",
  //     showCancelButton,
  //     onClose,
  //     onClickConfirmButton,
  //     onClickCancelButton,
  //     ...restProps
  //   },
  // } = useContext(AlertContext);
  const {
    alertArgs: {
      show,
      title,
      description,
      variant = "default",
      isLoading,
      isSubmiting,
      confirmButtonText = "Ok",
      cancelButtonText = "Voltar",
      confirmButtonVariantStyle = "primary",
      cancelButtonVariantStyle = "light",
      showCancelButton,
      onClose,
      onClickConfirmButton,
      onClickCancelButton,
      ...restProps
    },
  } = useAlertModal();

  return (
    <Modal.Root
      show={show}
      onClose={() => !isSubmiting && !isLoading && onClose?.()}
      className=" shadow-gray-100"
      hideCloseIcon
      {...restProps}
    >
      <Modal.Body>
        <div className="flex flex-col items-center space-y-3">
          {title && (
            <h4
              className={twMerge(
                "text-[1.375rem] text-center font-bold",
                variants[variant].color
              )}
            >
              {title}
            </h4>
          )}
          {isLoading ? (
            <Spinner size={48} />
          ) : (
            <>{isString(description) ? <p>{description}</p> : description}</>
          )}

          {/* {isString(description) ? <p>{description}</p> : description} */}
        </div>
      </Modal.Body>
      {!isLoading && (
        <Modal.Footer className="gap-4" orientation="center">
          {showCancelButton && (
            <Button
              variantStyle={cancelButtonVariantStyle}
              onClick={onClickCancelButton}
              disabled={isSubmiting}
            >
              {cancelButtonText}
            </Button>
          )}
          <Button
            variantStyle={confirmButtonVariantStyle}
            onClick={onClickConfirmButton}
            isLoading={isSubmiting}
          >
            {confirmButtonText}
          </Button>
        </Modal.Footer>
      )}
    </Modal.Root>
  );
});

export { AlertModal };
