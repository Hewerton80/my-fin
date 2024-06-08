"use client";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPen, FaClone } from "react-icons/fa";
import { MdPaid, MdHistory } from "react-icons/md";
import { ExpenseStatus, ExpenseWithComputedFields } from "../types";
import { memo, useCallback } from "react";
import { usePayExpense } from "../hooks/usePayExpense";

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
    const { payExpense } = usePayExpense();

    const handlePayExpense = useCallback(() => {
      payExpense(expense?.id!, { onSuccess });
    }, [expense, payExpense, onSuccess]);

    return (
      <>
        <Dropdown.Root>
          <Dropdown.Toogle asChild>
            <IconButton
              variantStyle="light-ghost"
              icon={<BsThreeDotsVertical />}
            />
          </Dropdown.Toogle>
          <Dropdown.Menu>
            {!expense?.isPaid &&
              expense?.status !== ExpenseStatus["ON DAY"] && (
                <Dropdown.Item onClick={handlePayExpense} className="gap-2">
                  <MdPaid />
                  pay
                </Dropdown.Item>
              )}
            <Dropdown.Item className="gap-2">
              <MdHistory />
              history
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
          </Dropdown.Menu>
        </Dropdown.Root>
      </>
    );
  }
);
