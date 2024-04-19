"use client";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/Input";
import { MultSelect } from "@/components/ui/forms/selects/MultSelect";
import { SelectOption } from "@/components/ui/forms/selects/type";
import { Textarea } from "@/components/ui/forms/Textarea/Textarea";
import { useMemo, useState } from "react";

interface ExpenseFormProps {
  id?: string;
}

const categoriesOptions = [
  { label: "Food", value: "food", icon: "🍕" },
  { label: "Transport", value: "transport" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Others", value: "others" },
];

export function ExpenseForm({ id: expenseId }: ExpenseFormProps) {
  const [categories, setCategories] = useState<SelectOption[]>([]);
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
            value={categories}
            formControlClassName="col-span-6"
            label="Categories"
            options={categoriesOptions}
            onChange={(newValues) => setCategories(newValues)}
          />
          <Textarea
            formControlClassName="col-span-6 mb-32"
            label="Description"
            placeholder="..."
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
