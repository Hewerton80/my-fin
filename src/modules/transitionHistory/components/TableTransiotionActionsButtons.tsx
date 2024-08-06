import { memo, useCallback, useMemo, useState } from "react";
import { TransitionHistoryWitchConputedFields } from "../types";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { usePayTransitionHistory } from "../hooks/usePayTransitionHistory";
import { Modal } from "@/components/ui/overlay/Modal";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/forms/inputs/Input";
import { TransitionHistoryStatus } from "@prisma/client";
import { MdPaid } from "react-icons/md";

interface TableTransitionActionsButtonsProps {
  transitionHistory?: TransitionHistoryWitchConputedFields;
  onClickToEdit?: () => void;
  onClickToClone?: () => void;
  onSuccess?: () => void;
}

export const TableTransitionActionsButtons = memo(
  function TableTransitionActionsButtons({
    transitionHistory,
    onSuccess,
    onClickToEdit,
    onClickToClone,
  }: TableTransitionActionsButtonsProps) {
    const {
      payTransitionHistory,
      payTransitionHistoryControl,
      resetPayTransitionHistoryForm,
      isPaying,
    } = usePayTransitionHistory();

    const [showModalPaidAt, setShowModalPaidAt] = useState(false);

    const handleCloseModal = useCallback(() => {
      setShowModalPaidAt(false);
      resetPayTransitionHistoryForm({ paidAt: "" });
    }, [resetPayTransitionHistoryForm]);

    const handlePayExpense = useCallback(() => {
      payTransitionHistory(transitionHistory?.id!, {
        onSuccess: () => {
          onSuccess?.();
          handleCloseModal();
        },
      });
    }, [transitionHistory, handleCloseModal, payTransitionHistory, onSuccess]);

    const showPayOption = useMemo(() => {
      return [
        TransitionHistoryStatus["OVERDUE"],
        TransitionHistoryStatus["PENDING"],
      ].includes(transitionHistory?.status as any);
    }, [transitionHistory]);

    return (
      <>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <IconButton
              variantStyle="dark-ghost"
              icon={<BsThreeDotsVertical />}
            />
          </Dropdown.Trigger>
          <Dropdown.Content>
            {showPayOption && (
              <Dropdown.Item
                onClick={() => setShowModalPaidAt(true)}
                className="gap-2"
              >
                <MdPaid />
                pay
              </Dropdown.Item>
            )}
            <Dropdown.Item className="gap-2" onClick={onClickToEdit}>
              <FaPen />
              Edit
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <Modal.Root size="xs" show={showModalPaidAt} onClose={handleCloseModal}>
          <Modal.Title>Pay Expense</Modal.Title>
          <Modal.Body>
            <Controller
              control={payTransitionHistoryControl}
              name="paidAt"
              render={({ field, fieldState }) => {
                return (
                  <Input
                    {...field}
                    label="Paid Date"
                    required
                    type="date"
                    error={fieldState.error?.message}
                  />
                );
              }}
            />
          </Modal.Body>
          <Modal.Footer className="gap-2">
            <Button
              variantStyle="secondary"
              onClick={handleCloseModal}
              disabled={isPaying}
            >
              Cancel
            </Button>
            <Button onClick={handlePayExpense} isLoading={isPaying}>
              Pay
            </Button>
          </Modal.Footer>
        </Modal.Root>
      </>
    );
  }
);
