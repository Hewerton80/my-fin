"use client";
import { Modal } from "@/components/ui/overlay/Modal";
import { useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button } from "@/components/ui/buttons/Button";
import { Input } from "@/components/ui/forms/inputs/Input";
import { MultSelect, SelectOption } from "@/components/ui/forms/selects";
import { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { useMutateExpense } from "@/modules/expenses/hooks/useMutateExpense";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { Radio } from "@/components/ui/forms/Radio";
import { Frequency, PaymantType } from "@prisma/client";
import { capitalizeFisrtLetter } from "@/shared/string";
import { Select } from "@/components/ui/forms/selects/Select";
import { getRange } from "@/shared/getRange";
import { stringToBoolean } from "@/shared/stringToBoolean";
import { isBoolean, isNull, isNumber } from "@/shared/isType";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { useGetCategories } from "@/modules/category/hooks/useGetCategories";
import { useGetCreditCards } from "@/modules/creditCard/hooks/useGetCreditCards";

interface ModalTriggerExpenseFormProps {
  id?: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function ModalTriggerExpenseForm({
  id: expenseId,
  children,
  onSuccess,
}: ModalTriggerExpenseFormProps) {
  const { categories, isLoadingCategories, refetchCategories } =
    useGetCategories();

  const { creditCards, isLoadingCreditCards, refetchCreditCards } =
    useGetCreditCards();

  const {
    expenseFormControl,
    watchExpense,
    isSubmitting,
    handleSubmitExpense,
    resetExpenseForm,
  } = useMutateExpense();

  const [isOpen, setOpen] = useState(false);

  const isEdit = useMemo(() => Boolean(expenseId), [expenseId]);

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

  const handleCloseModal = useCallback(() => {
    resetExpenseForm();
    setOpen(false);
  }, [resetExpenseForm]);

  useEffect(() => {
    console.log("isOpen", isOpen);
  }, [isOpen]);

  return (
    <>
      <Slot
        className="teste"
        onClick={() => {
          console.log("click to open");
          setOpen(true);
        }}
      >
        {children}
      </Slot>
      <Modal.Root size="md" show={isOpen} onClose={handleCloseModal}>
        <Modal.Title>{isEdit ? "Edit" : "Create"} Expense</Modal.Title>
        <Modal.Body className="overflow-y-auto" asChild>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4">
              <Controller
                control={expenseFormControl}
                name="name"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
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
                    label="Categories"
                    options={categoriesOptions}
                    error={fieldState.error?.message}
                  />
                )}
              />
              {/* <Controller
                control={expenseFormControl}
                name="description"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    id={field.name}
                    label="Description"
                    placeholder="..."
                    error={fieldState.error?.message}
                  />
                )}
              /> */}
              <Controller
                control={expenseFormControl}
                name="amount"
                render={({ field: { value, ...restField }, fieldState }) => (
                  <CurrencyInput
                    {...restField}
                    value={isNull(value) ? undefined : Number(value)}
                    label="Amount"
                    error={fieldState.error?.message}
                  />
                )}
              />
              {!isEdit && (
                <>
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
                        label="Paid off"
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
                          label="Payment type"
                          onValueChange={onChange}
                          error={fieldState?.error?.message}
                          required
                        >
                          {Object.keys(PaymantType).map((key) => (
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
                  {watchExpense("isPaid") === false && (
                    <>
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
                    </>
                  )}
                  {[
                    Frequency.DAILY,
                    Frequency.MONTHLY,
                    Frequency.YEARLY,
                  ].includes(watchExpense("frequency") as any) && (
                    <>
                      <Controller
                        control={expenseFormControl}
                        name="totalInstallments"
                        render={({
                          field: { value, onChange, ...restField },
                          fieldState,
                        }) => (
                          <Select
                            {...restField}
                            isClearable
                            value={String(value || "")}
                            label="Number of installments"
                            onChange={(option) =>
                              onChange(Number(option?.value))
                            }
                            options={getRange(12).map((i) => ({
                              label: `${i + 1}x`,
                              value: String(i + 1),
                            }))}
                            error={fieldState.error?.message}
                            subtitle={
                              watchExpense("amount") && isNumber(value)
                                ? `${value}x de ${getCurrencyFormat(
                                    Number(watchExpense("amount"))
                                  )}  |  total: ${getCurrencyFormat(
                                    Number(value) *
                                      Number(watchExpense("amount"))
                                  )}`
                                : undefined
                            }
                          />
                        )}
                      />
                    </>
                  )}
                </>
              )}

              <Controller
                control={expenseFormControl}
                name="registrationDate"
                render={({ field, fieldState }) => {
                  return (
                    <Input
                      {...field}
                      label="Purchase registration date"
                      required
                      type="date"
                      error={fieldState.error?.message}
                    />
                  );
                }}
              />
              {!isEdit &&
                (watchExpense("isPaid") === false ||
                  watchExpense("paymentType") === PaymantType.CREDIT_CARD) && (
                  <Controller
                    control={expenseFormControl}
                    name="creditCardId"
                    render={({
                      field: { value, onChange, ...restField },
                      fieldState,
                    }) => (
                      <Select
                        {...restField}
                        required
                        isClearable
                        value={String(value || "")}
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

              {/* {watchExpense("isPaid") === false &&
                !watchExpense("creditCardId") && (
                  <Controller
                    control={expenseFormControl}
                    name="dueDate"
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        label="Due date"
                        required
                        type="date"
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                )} */}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="gap-2">
          <Button
            onClick={handleCloseModal}
            disabled={isSubmitting}
            variantStyle="light"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleSubmitExpense({
                onSuccess: () => {
                  onSuccess?.();
                  handleCloseModal();
                },
              })
            }
            type="button"
            variantStyle="primary"
            isLoading={isSubmitting}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal.Root>
    </>
  );
}
