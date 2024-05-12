import { Modal } from "@/components/ui/overlay/Modal";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/buttons/Button";

interface ModalTriggerExpenseFormProps {
  children: React.ReactNode;
}

export function ModalTriggerExpenseForm({
  children,
}: ModalTriggerExpenseFormProps) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Slot onClick={() => setOpen(true)}>{children}</Slot>
      <Modal.Root show={isOpen} onClose={() => setOpen(false)}>
        <Modal.Title>Create Expense</Modal.Title>
        <Modal.Body className="overflow-y-auto">
          <ExpenseForm />
        </Modal.Body>
        <Modal.Footer className="justify-end gap-2">
          <Button variantStyle="light">Cancel</Button>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal.Root>
    </>
  );
}
