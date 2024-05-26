"use client";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { Dropdown } from "@/components/ui/overlay/Dropdown/Dropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPaid, MdHistory } from "react-icons/md";
import { ExpenseWithComputedFields } from "../types";
import { memo, useCallback } from "react";
import { usePayExpense } from "../hooks/usePayExpense";
import { ModalTriggerExpenseForm } from "./ModalTriggerExpenseForm";

interface TableExpenseActionsButtonsProps {
  expense?: ExpenseWithComputedFields;
  onSuccess?: () => void;
}

export const TableExpenseActionsButtons = memo(
  function TableExpenseActionsButtons({
    expense,
    onSuccess,
  }: TableExpenseActionsButtonsProps) {
    const { payExpense } = usePayExpense();

    const handlePayExpense = useCallback(() => {
      payExpense(expense?.id!, { onSuccess });
    }, [expense, payExpense, onSuccess]);

    return (
      <>
        <Dropdown>
          <Dropdown.Toogle asChild>
            <IconButton
              variantStyle="light-ghost"
              icon={<BsThreeDotsVertical />}
            />
          </Dropdown.Toogle>
          <Dropdown.Menu>
            {!expense?.isPaid && (
              <Dropdown.Item onClick={handlePayExpense} className="gap-2">
                <MdPaid />
                pay
              </Dropdown.Item>
            )}
            <Dropdown.Item
              className="gap-2"
              // onClick={() => handlePayExpense(expense)}
            >
              <MdHistory />
              history
            </Dropdown.Item>
            <ModalTriggerExpenseForm id={expense?.id} onSuccess={onSuccess}>
              <Dropdown.Item
                className="gap-2"
                // onClick={() => handlePayExpense(expense)}
              >
                <MdHistory />
                Editar
              </Dropdown.Item>
            </ModalTriggerExpenseForm>
            {/* <Dropdown.Item
                      className="gap-2"
                      onClick={() => setStateExerciseIndexToEdit(i)}
                    >
                      <FaPen />
                      editar
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="gap-2"
                      onClick={() => handleRemoveExercise(i)}
                    >
                      <FaTrash />
                      remover
                    </Dropdown.Item>
                    {!isFirstIndex && (
                      <Dropdown.Item
                        className="gap-2"
                        onClick={() => hamdleChangeExercisePosition(i, i - 1)}
                      >
                        <FaLongArrowAltUp />
                        Mover para cima
                      </Dropdown.Item>
                    )}
                    {!isLastIndex && (
                      <Dropdown.Item
                        className="gap-2"
                        onClick={() => hamdleChangeExercisePosition(i, i + 1)}
                      >
                        <FaLongArrowAltDown />
                        Mover para baixo
                      </Dropdown.Item>
                    )} */}
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
);
