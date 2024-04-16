import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/Input";
import { ReactNode, useMemo } from "react";

interface ExpenseFormProps {
  id?: string;
}

export function ExpenseForm({ id: expenseId }: ExpenseFormProps) {
  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-12">
          <Input
            formControlClassName="col-span-6"
            label="Name"
            placeholder="pizza"
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
