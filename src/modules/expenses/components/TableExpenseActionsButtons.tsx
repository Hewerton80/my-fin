"use client";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPen, FaClone } from "react-icons/fa";
import { MdPaid, MdHistory } from "react-icons/md";
import { ExpenseStatus, ExpenseWithComputedFields } from "../types";
import { memo, useCallback, useState } from "react";
import { usePayExpense } from "../hooks/usePayExpense";
import { Modal } from "@/components/ui/overlay/Modal";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/forms/inputs/Input";
import { Button } from "@/components/ui/buttons/Button";
import Link from "next/link";

type OnClickType = (expenseId: string) => void;

interface TableExpenseActionsButtonsProps {
  expense?: ExpenseWithComputedFields;
  onClickToEdit?: OnClickType;
  onClickToClone?: OnClickType;
  onSuccess?: () => void;
}

export const TableExpenseActionsButtons = memo(
  function TableExpenseActionsButtons({
    expense,
    onSuccess,
    onClickToEdit,
    onClickToClone,
  }: TableExpenseActionsButtonsProps) {
    const {
      payExpense,
      payExpenseControl,
      payExpenseFormState,
      resetPayExpenseForm,
      isPaying,
    } = usePayExpense();

    const [showModalPaidAt, setShowModalPaidAt] = useState(false);

    const handlePayExpense = useCallback(() => {
      payExpense(expense?.id!, { onSuccess });
    }, [expense, payExpense, onSuccess]);

    const handleCloseModal = useCallback(() => {
      setShowModalPaidAt(false);
      resetPayExpenseForm({ paidAt: "" });
    }, [resetPayExpenseForm]);

    return (
      <>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <IconButton variantStyle="ghost" icon={<BsThreeDotsVertical />} />
          </Dropdown.Trigger>
          <Dropdown.Content>
            {!expense?.isPaid &&
              expense?.status !== ExpenseStatus["ON DAY"] && (
                <Dropdown.Item
                  onClick={() => setShowModalPaidAt(true)}
                  className="gap-2"
                >
                  <MdPaid />
                  pay
                </Dropdown.Item>
              )}
            <Dropdown.Item asChild className="gap-2">
              <Link href={`/transitions?expenseId=${expense?.id}`}>
                <MdHistory />
                history
              </Link>
            </Dropdown.Item>

            <Dropdown.Item
              className="gap-2"
              onClick={() => onClickToEdit?.(expense?.id!)}
            >
              <FaPen />
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              className="gap-2"
              onClick={() => onClickToClone?.(expense?.id!)}
            >
              <FaClone />
              Clone
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <Modal.Root show={showModalPaidAt} onClose={handleCloseModal}>
          <Modal.Title>Pay Expense</Modal.Title>
          <Modal.Body>
            <Controller
              control={payExpenseControl}
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
