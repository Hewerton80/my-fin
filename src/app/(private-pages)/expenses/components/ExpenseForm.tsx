"use client";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/inputs/Input";
import { MultSelect, SelectOption } from "@/components/ui/forms/selects";
import { Textarea } from "@/components/ui/forms/Textarea/Textarea";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormValues, createExpenseSchema } from "@/hooks/api/useExpense";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { Radio } from "@/components/ui/forms/Radio";
import { Frequency } from "@prisma/client";
import { capitalizeFisrtLetter } from "@/shared/string";
import { useGetCategories } from "@/hooks/api/useCategory";
import { Switch } from "@/components/ui/forms/Switch";
import { Select } from "@/components/ui/forms/selects/Select";
import { getRange } from "@/shared/getRange";
interface ExpenseFormProps {
  id?: string;
}

export function ExpenseForm({ id: expenseId }: ExpenseFormProps) {
  const { categories, isLoadingCategories, refetchCategories } =
    useGetCategories();
  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);

  const { control, watch, setValue } = useForm<ExpenseFormValues>({
    defaultValues: {
      name: "",
      categoriesOptions: [],
      description: "",
      amount: undefined,
      isRepeat: false,
      frequency: "",
      hasInstallments: true,
      numberOfInstallments: undefined,
    },
    mode: "onTouched",
    resolver: zodResolver(createExpenseSchema),
  });
  const { isRepeat, frequency, hasInstallments } = useWatch({ control });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "isRepeat") {
        setValue("frequency", "", {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      }
      if (name === "frequency") {
        setValue("hasInstallments", value.frequency ? true : false, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      }
      if (name === "hasInstallments") {
        setValue("numberOfInstallments", undefined, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [useWatch]);

  const categoriesOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories.map((category) => ({
      label: category.name,
      // value: category.id,
      options: category.subCategories.map((subCategory) => ({
        label: subCategory.name,
        value: subCategory.id,
      })),
    })) as SelectOption[];
  }, [categories]);

  const handleFocusCategoriesAutoComplite = useCallback(() => {
    if (!Array.isArray(categories) || !isLoadingCategories) {
      refetchCategories();
    }
  }, []);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-12 gap-6 pb-80">
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
                onFocus={handleFocusCategoriesAutoComplite}
                isLoading={isLoadingCategories}
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
            name="isRepeat"
            render={({ field: { value, onChange, ...restFields } }) => (
              <Switch
                {...restFields}
                checked={value}
                onCheckedChange={onChange}
                formControlClassName="col-span-12"
                label="Repeat?"
                required
              />
            )}
          />
          {isRepeat && (
            <Controller
              control={control}
              name="frequency"
              render={({ field: { onChange, ...restField }, fieldState }) => (
                <Radio.Root
                  {...restField}
                  formControlClassName="col-span-12"
                  label="Frequency"
                  onValueChange={onChange}
                  error={fieldState?.error?.message}
                  required
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
          )}
          {frequency && (
            <Controller
              control={control}
              name="hasInstallments"
              render={({ field: { value, onChange, ...restFields } }) => (
                <Switch
                  {...restFields}
                  checked={value}
                  onCheckedChange={onChange}
                  formControlClassName="col-span-12"
                  label="Are there installments?"
                  required
                />
              )}
            />
          )}
          {hasInstallments && (
            <Controller
              control={control}
              name="numberOfInstallments"
              render={({
                field: { value, onChange, ...restField },
                fieldState,
              }) => (
                <Select
                  {...restField}
                  isClearable
                  value={String(value || "")}
                  formControlClassName="col-span-6"
                  label="Number of installments"
                  onChange={(option) => onChange(Number(option?.value))}
                  options={getRange(12).map((i) => ({
                    label: `${i + 1}x`,
                    value: String(i + 1),
                  }))}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          )}
        </div>
      </Card.Body>
    </Card.Root>
  );
}
