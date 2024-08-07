import { useAxios } from "../../../hooks/useAxios";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ExpenseFormValues,
  createFrontendExpenseSchema,
} from "../schemas/frontendFormExpenseSchema";
import { ExpenseWithComputedFields } from "../types";
import { useAlertModal } from "@/hooks/useAlertModal";

export function useMutateExpense() {
  const { apiBase } = useAxios();
  const { showAlert } = useAlertModal();

  const expenseFormDefaultValues = useMemo<ExpenseFormValues>(
    () => ({
      id: "",
      name: "",
      categoryId: "",
      description: "",
      amount: null,
      isPaid: null,
      paymentType: null,
      frequency: null,
      totalInstallments: null,
      creditCardId: "",
      dueDate: "",
      registrationDate: "",
      isCloning: false,
    }),
    []
  );

  const {
    control: expenseFormControl,
    watch: watchExpense,
    setValue: setExpenseValue,
    getValues: getExpenseValues,
    trigger: triggerExpenseErrors,
    formState: expenseFormState,
    clearErrors: clearExpenseErrors,
    reset: resetExpenseForm,
  } = useForm<ExpenseFormValues>({
    defaultValues: expenseFormDefaultValues,
    mode: "onTouched",
    resolver: zodResolver(createFrontendExpenseSchema),
  });

  const { mutate: createQrCode, isPending: isCreatingExpense } = useMutation({
    mutationFn: (
      expenseData: Partial<ExpenseFormValues & ExpenseWithComputedFields>
    ) => apiBase.post("/me/expenses", expenseData),
  });

  const { mutate: updateQrCode, isPending: isUpdatingExpense } = useMutation({
    mutationFn: ({
      id,
      ...expenseData
    }: Partial<ExpenseFormValues & ExpenseWithComputedFields>) =>
      apiBase.patch(`/me/expenses/${id}`, expenseData),
  });

  const setValueOptions = useMemo(
    () => ({ shouldDirty: true, shouldTouch: true }),
    []
  );

  const isSubmitting = useMemo(() => {
    return (
      expenseFormState.isValidating || isCreatingExpense || isUpdatingExpense
    );
  }, [expenseFormState.isValidating, isCreatingExpense, isUpdatingExpense]);

  const clearDueDateField = useCallback(() => {
    setExpenseValue("dueDate", "", setValueOptions);
    clearExpenseErrors(["dueDate"]);
  }, [setExpenseValue, , clearExpenseErrors, setValueOptions]);

  const clearCreditCardField = useCallback(() => {
    setExpenseValue("creditCardId", "", setValueOptions);
    clearExpenseErrors(["creditCardId"]);
  }, [setExpenseValue, clearExpenseErrors, setValueOptions]);

  useEffect(() => {
    const subscription = watchExpense(({ name }) => {
      if (name === "isPaid") {
        setExpenseValue("paymentType", null, setValueOptions);
        setExpenseValue("frequency", null, setValueOptions);
        clearDueDateField();
        clearCreditCardField();
        clearExpenseErrors(["frequency", "paymentType"]);
      }
      if (name === "paymentType") {
        clearCreditCardField();
      }
      if (name === "creditCardId") {
        clearDueDateField();
      }
      if (name === "frequency") {
        setExpenseValue("totalInstallments", null, setValueOptions);
        clearExpenseErrors(["totalInstallments"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [
    setValueOptions,
    clearExpenseErrors,
    watchExpense,
    clearCreditCardField,
    clearDueDateField,
    setExpenseValue,
  ]);

  const getHandledExpenseFormValues = useCallback(() => {
    const expenseFormValues = { ...getExpenseValues() };
    let handledExpenseFormValues: Partial<
      ExpenseFormValues & ExpenseWithComputedFields
    > = {};

    if (expenseFormValues.isCloning) {
      handledExpenseFormValues = expenseFormValues as Partial<
        ExpenseFormValues & ExpenseWithComputedFields
      >;
    } else {
      Object.keys(expenseFormState.dirtyFields).forEach((field) => {
        const expenseFormValue =
          expenseFormValues[field as keyof ExpenseFormValues];
        handledExpenseFormValues[field as keyof ExpenseFormValues] = (
          expenseFormValue === "" ? null : expenseFormValue
        ) as any;
      });
    }
    if (expenseFormValues?.id) {
      handledExpenseFormValues.id = expenseFormValues.id;
    }
    delete handledExpenseFormValues?.isCloning;
    return handledExpenseFormValues;
  }, [getExpenseValues, expenseFormState.dirtyFields]);

  const handleSubmitExpense = useCallback(
    async (callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
      const isValid = await triggerExpenseErrors();
      if (!isValid) {
        return;
      }
      const handledExpenseFormValues = getHandledExpenseFormValues();
      const isEdit = !!handledExpenseFormValues?.id;
      const onSuccess = () => {
        callbacks?.onSuccess?.();
        toast.success(`Expense ${isEdit ? "edited" : "created"} successfully!`);
      };
      const onError = (error: any) => {
        console.error("error", error);
        showAlert({
          title: `Error to ${isEdit ? "edit" : "create"}`,
          variant: "danger",
        });
      };
      if (isEdit) {
        updateQrCode(handledExpenseFormValues, { onSuccess, onError });
      } else {
        createQrCode(handledExpenseFormValues, { onSuccess, onError });
      }
    },
    [
      triggerExpenseErrors,
      updateQrCode,
      showAlert,
      getHandledExpenseFormValues,
      createQrCode,
    ]
  );

  return {
    expenseFormControl,
    expenseFormState,
    isSubmitting,
    expenseFormDefaultValues,
    watchExpense,
    handleSubmitExpense,
    setExpenseValue,
    getExpenseValues,
    triggerExpenseErrors,
    resetExpenseForm,
  };
}
