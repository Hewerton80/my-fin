"use client";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/inputs/Input";
import { MultSelect, SelectOption } from "@/components/ui/forms/selects";
import { Textarea } from "@/components/ui/forms/Textarea/Textarea";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormValues, createExpenseSchema } from "@/hooks/api/useExpense";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { Radio } from "@/components/ui/forms/Radio";
import { Frequency } from "@prisma/client";
import { capitalizeFisrtLetter } from "@/shared/string";
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
  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);

  const { control } = useForm<ExpenseFormValues>({
    defaultValues: {
      name: "",
      categoriesOptions: [],
      description: "",
      amount: undefined,
      frequency: "",
    },
    mode: "onTouched",
    resolver: zodResolver(createExpenseSchema),
  });

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-12 gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                formControlClassName="col-span-6"
                label="Name"
                placeholder="pizza"
                required
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="categoriesOptions"
            render={({ field, fieldState }) => (
              <MultSelect
                {...field}
                formControlClassName="col-span-6"
                label="Categories"
                options={categoriesOptions}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                formControlClassName="col-span-12"
                label="Description"
                placeholder="..."
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <CurrencyInput
                {...field}
                formControlClassName="col-span-12"
                label="Amount"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, ...restField }, fieldState }) => (
              // <CurrencyInput
              //   {...field}
              //   formControlClassName="col-span-6"
              //   label="Amount"
              //   error={fieldState.error?.message}
              // />
              <Radio.Root
                {...restField}
                formControlClassName="col-span-12"
                label="Frequency"
                onValueChange={onChange}
                error={fieldState?.error?.message}
              >
                {Object.keys(Frequency).map((key) => (
                  <Radio.Item
                    key={key}
                    value={key}
                    label={capitalizeFisrtLetter(key)}
                  />
                ))}
              </Radio.Root>
            )}
          />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
