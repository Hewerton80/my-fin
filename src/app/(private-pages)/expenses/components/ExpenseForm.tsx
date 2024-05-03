"use client";
import { Card } from "@/components/ui/cards/Card";
import { Input } from "@/components/ui/forms/inputs/Input";
import { MultSelect, SelectOption } from "@/components/ui/forms/selects";
import { Textarea } from "@/components/ui/forms/Textarea/Textarea";
import { useCallback, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useMutateExpense } from "@/hooks/expense/useMutateExpense";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { Radio } from "@/components/ui/forms/Radio";
import { Frequency, PaymantType } from "@prisma/client";
import { capitalizeFisrtLetter } from "@/shared/string";
import { useGetCategories } from "@/hooks/category/useCategory";
import { Switch } from "@/components/ui/forms/Switch";
import { Select } from "@/components/ui/forms/selects/Select";
import { getRange } from "@/shared/getRange";
import { stringToBoolean } from "@/shared/stringToBoolean";
import { isBoolean, isNull } from "@/shared/isType";
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

  const {
    expenseFormControl,
    watchExpense,
    expenseFormState,
    isSubmitting,
    handleSubmitExpense,
    // getExpenseValues,
    // triggerExpenseErrors,
  } = useMutateExpense();

  const isEditExpense = useMemo(() => Boolean(expenseId), [expenseId]);

  const { isRepeat, isPaid, creditCardId, paymentType } = useWatch({
    control: expenseFormControl,
    exact: true,
  });

  const showCreditCardField = useMemo(() => {
    return (
      isRepeat || isPaid === false || paymentType === PaymantType.CREDIT_CARD
    );
  }, [isRepeat, isPaid, paymentType]);

  const categoriesOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories.map((category) => ({
      label: category.name,
      options:
        category?.subCategories?.map((subCategory) => ({
          label: subCategory.name,
          value: subCategory.id,
        })) || [],
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
  }, [categories, isLoadingCategories, refetchCategories]);

  const handleFocusCreditCardsSelect = useCallback(() => {
    if (!Array.isArray(creditCards) && !isLoadingCreditCards) {
      refetchCreditCards();
    }
  }, [creditCards, isLoadingCreditCards, refetchCreditCards]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{isEditExpense ? "Edit" : "Create"} Expense</Card.Title>
      </Card.Header>
      <Card.Body asChild>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-12 gap-6 pb-56">
            <Controller
              control={expenseFormControl}
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
              control={expenseFormControl}
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
              control={expenseFormControl}
              name="description"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  id={field.name}
                  formControlClassName="col-span-12"
                  label="Description"
                  placeholder="..."
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={expenseFormControl}
              name="amount"
              render={({ field: { value, ...restField }, fieldState }) => (
                <CurrencyInput
                  {...restField}
                  value={isNull(value) ? undefined : Number(value)}
                  formControlClassName="col-span-12"
                  label="Amount"
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={expenseFormControl}
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
                control={expenseFormControl}
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
            {watchExpense("isPaid") && (
              <Controller
                control={expenseFormControl}
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
                control={expenseFormControl}
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
            {watchExpense("frequency") && (
              <Controller
                control={expenseFormControl}
                name="hasInstallments"
                render={({ field: { value, onChange, ...restFields } }) => {
                  console.log("hasInstallments value", value);
                  return (
                    <Switch
                      {...restFields}
                      checked={value}
                      onCheckedChange={onChange}
                      formControlClassName="col-span-12"
                      label="Are there installments?"
                      required
                    />
                  );
                }}
              />
            )}
            {/* {console.log("hasInstallments", watchExpense('hasInstallments')} */}
            {watchExpense("hasInstallments") && (
              <Controller
                control={expenseFormControl}
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
            {showCreditCardField && (
              <Controller
                control={expenseFormControl}
                name="creditCardId"
                render={({
                  field: { value, onChange, ...restField },
                  fieldState,
                }) => (
                  <Select
                    {...restField}
                    required={
                      watchExpense("paymentType") === PaymantType.CREDIT_CARD
                    }
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
                  control={expenseFormControl}
                  name="registrationDate"
                  render={({ field, fieldState }) => {
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
                  control={expenseFormControl}
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
              isLoading={isSubmitting}
            >
              Criar
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
