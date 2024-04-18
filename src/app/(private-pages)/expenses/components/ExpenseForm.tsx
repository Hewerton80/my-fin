"use client";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/Input";
import { MultSelect } from "@/components/ui/forms/MultSelect";
import { Textarea } from "@/components/ui/forms/Textarea/Textarea";
import { useMemo } from "react";

interface ExpenseFormProps {
  id?: string;
}

const categoriesOptions = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Others", value: "others" },
];

export function ExpenseForm({ id: expenseId }: ExpenseFormProps) {
  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-12 gap-4">
          <Input
            formControlClassName="col-span-6"
            label="Name"
            placeholder="pizza"
            required
          />
          <MultSelect
            formControlClassName="col-span-6"
            label="Categories"
            placeholder="..."
            options={categoriesOptions}
          />
          <Textarea
            formControlClassName="col-span-6"
            label="Description"
            placeholder="..."
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
