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
import { Frequency, PaymantType } from "@prisma/client";
import { capitalizeFisrtLetter } from "@/shared/string";
import { useGetCategories } from "@/hooks/api/useCategory";
import { Switch } from "@/components/ui/forms/Switch";
import { Select } from "@/components/ui/forms/selects/Select";
import { getRange } from "@/shared/getRange";
import { stringToBoolean } from "@/shared/stringToBoolean";
import { isBoolean } from "@/shared/isType";
import { useGetCreditCards } from "@/hooks/api/useCreditCard";
import { Button } from "@/components/ui/buttons/Button";
interface ExpenseFormProps {
  id?: string;
}

export function ExpenseForm({ id: expenseId }: ExpenseFormProps) {
  const { categories, isLoadingCategories, refetchCategories } =
    useGetCategories();
  const { creditCards, isLoadingCreditCards, refetchCreditCards } =
    useGetCreditCards();
  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState,
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      name: "",
      categoriesOptions: [],
      description: "",
      amount: undefined,
      isRepeat: false,
      isPaid: null,
      paymentType: null,
      frequency: null,
      hasInstallments: false,
      numberOfInstallments: undefined,
      creditCardId: "",
      dueDate: "",
      registrationDate: "",
    },
    mode: "onTouched",
    resolver: zodResolver(createExpenseSchema),
  });
  const { isRepeat, frequency, hasInstallments, isPaid, creditCardId } =
    useWatch({
      control,
    });

  const clearDatesFields = useCallback(() => {
    setValue("registrationDate", "", {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    setValue("dueDate", "", {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "isRepeat") {
        setValue("frequency", null, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        setValue("isPaid", null, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        setValue("creditCardId", "", {
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
      if (name === "isPaid") {
        clearDatesFields();
        setValue("creditCardId", "", {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        setValue("paymentType", null, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      }
      if (name === "creditCardId") {
        clearDatesFields();
      }
    });
    return () => subscription.unsubscribe();
  }, [useWatch, clearDatesFields, setValue]);

  const categoriesOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories.map((category) => ({
      label: category.name,
      options: category.subCategories.map((subCategory) => ({
        label: subCategory.name,
        value: subCategory.id,
      })),
    })) as SelectOption[];
  }, [categories]);

  const creditCardsOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(creditCards)) {
      return [];
    }
    return creditCards.map((creditCard) => ({
      label: creditCard?.name,
      value: creditCard?.id,
    })) as SelectOption[];
  }, [creditCards]);

  const handleFocusCategoriesSelect = useCallback(() => {
    if (!Array.isArray(categories) && !isLoadingCategories) {
      refetchCategories();
    }
  }, [categories]);

  const handleFocusCreditCardsSelect = useCallback(() => {
    if (!Array.isArray(creditCards) && !isLoadingCreditCards) {
      refetchCreditCards();
    }
  }, [creditCards]);

  const handleSubmitExpense = useCallback(() => {
    trigger();
    const expenseFormValues = getValues();
    console.log("expenseFormValues", expenseFormValues);
  }, [getValues, formState.isValid]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body asChild>
        <form onSubmit={handleSubmit(handleSubmitExpense)}>
          <div className="grid grid-cols-12 gap-6 pb-56">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  formControlClassName="col-span-12 sm:col-span-6"
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
                  onFocus={handleFocusCategoriesSelect}
                  isLoading={isLoadingCategories}
                  formControlClassName="col-span-12 sm:col-span-6"
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
                  label="Repeat"
                  required
                />
              )}
            />
            {!isRepeat && (
              <Controller
                control={control}
                name="isPaid"
                render={({
                  field: { onChange, value, ...restField },
                  fieldState,
                }) => (
                  <Radio.Root
                    {...restField}
                    value={isBoolean(value) ? String(value) : undefined}
                    formControlClassName="col-span-12"
                    label="Paid"
                    onValueChange={(newValue) =>
                      onChange(stringToBoolean(newValue))
                    }
                    error={fieldState?.error?.message}
                    required
                  >
                    <Radio.Item value="true" label="Yes" />
                    <Radio.Item value="false" label="No" />
                  </Radio.Root>
                )}
              />
            )}
            {isPaid && (
              <Controller
                control={control}
                name="paymentType"
                render={({
                  field: { onChange, value, ...restField },
                  fieldState,
                }) => (
                  <Radio.Root
                    {...restField}
                    value={value || undefined}
                    formControlClassName="col-span-12"
                    label="Payment type"
                    onValueChange={onChange}
                    error={fieldState?.error?.message}
                    required
                  >
                    {Object.keys(PaymantType).map((key) => (
                      <Radio.Item
                        key={key}
                        value={key}
                        label={capitalizeFisrtLetter(key.replace("_", " "))}
                      />
                    ))}
                  </Radio.Root>
                )}
              />
            )}
            {isRepeat && (
              <Controller
                control={control}
                name="frequency"
                render={({
                  field: { onChange, value, ...restField },
                  fieldState,
                }) => (
                  <Radio.Root
                    {...restField}
                    value={value || undefined}
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
                    formControlClassName="col-span-12 sm:col-span-6"
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
            {(isRepeat || isPaid === false) && (
              <Controller
                control={control}
                name="creditCardId"
                render={({
                  field: { value, onChange, ...restField },
                  fieldState,
                }) => (
                  <Select
                    {...restField}
                    isClearable
                    value={String(value || "")}
                    formControlClassName="col-span-12 sm:col-span-6"
                    label="Credit Card"
                    isLoading={isLoadingCreditCards}
                    onChange={(option) => onChange(String(option?.value))}
                    onFocus={handleFocusCreditCardsSelect}
                    options={creditCardsOptions}
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}
            {!creditCardId && !isPaid && (
              <>
                <Controller
                  control={control}
                  name="registrationDate"
                  render={({ field, fieldState }) => {
                    console.log("value", field.value);
                    return (
                      <Input
                        {...field}
                        formControlClassName="col-span-12 sm:col-span-6"
                        label="Registration date"
                        required
                        type="date"
                        error={fieldState.error?.message}
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      formControlClassName="col-span-12 sm:col-span-6"
                      label="Due date"
                      required
                      type="date"
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </>
            )}
          </div>
          <div className="flex mt-auto w-full">
            <Button
              onClick={handleSubmitExpense}
              fullWidth
              type="button"
              variantStyle="primary"
            >
              Criar
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
