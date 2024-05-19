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
import { ExpernseWithComputedFields } from "../types";

export function useMutateExpense() {
  const { apiBase } = useAxios();
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
    defaultValues: {
      name: "",
      categoriesOptions: [],
      description: "",
      amount: null,
      isPaid: null,
      paymentType: null,
      frequency: null,
      totalInstallments: null,
      creditCardId: "",
      dueDate: "",
      registrationDate: "",
    },
    mode: "onTouched",
    resolver: zodResolver(createFrontendExpenseSchema),
  });

  const { mutate: createQrCode, isPending: isCreatingExpense } = useMutation({
    mutationFn: (
      expenseData: Partial<ExpenseFormValues & ExpernseWithComputedFields>
    ) => apiBase.post("/expenses", expenseData),
  });

  useEffect(() => {
    console.log("expenseFormState.errors", expenseFormState?.errors);
  }, [expenseFormState.errors]);

  const setValueOptions = useMemo(
    () => ({ shouldDirty: true, shouldTouch: true }),
    []
  );

  const isSubmitting = useMemo(() => {
    return expenseFormState.isValidating || isCreatingExpense;
  }, [expenseFormState.isValidating, isCreatingExpense]);

  //   useEffect(() => {
  //     console.log("expenseFormState", expenseFormState);
  //   }, [expenseFormState]);

  // useEffect(() => {
  //   console.log("isSubmitting", isSubmitting);
  // }, [isSubmitting]);

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
      ExpenseFormValues & ExpernseWithComputedFields
    > = {};
    Object.keys(expenseFormState.dirtyFields).forEach((field) => {
      const expenseFormValue =
        expenseFormValues[field as keyof ExpenseFormValues];

      handledExpenseFormValues[field as keyof ExpenseFormValues] = (
        expenseFormValue === "" ? null : expenseFormValue
      ) as any;
    });
    if (handledExpenseFormValues?.categoriesOptions) {
      handledExpenseFormValues.subCategories =
        handledExpenseFormValues?.categoriesOptions.map(
          (category) => category.value
        ) as any;
    }
    delete handledExpenseFormValues?.categoriesOptions;
    return handledExpenseFormValues;
  }, [getExpenseValues, expenseFormState.dirtyFields]);

  const handleSubmitExpense = useCallback(
    async (callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
      // setIsTriggingErrors(true);
      const isValid = await triggerExpenseErrors();
      // setIsTriggingErrors(false);
      if (!isValid) {
        return;
      }
      const handledExpenseFormValues = getHandledExpenseFormValues();
      const onSuccess = () => {
        callbacks?.onSuccess?.();
        toast.success("Expense created successfully!");
      };
      const onError = (error: any) => {
        console.error("error", error);
      };
      createQrCode(handledExpenseFormValues, { onSuccess, onError });
    },
    [triggerExpenseErrors, getHandledExpenseFormValues, createQrCode]
  );

  return {
    expenseFormControl,
    expenseFormState,
    isSubmitting,
    watchExpense,
    handleSubmitExpense,
    setExpenseValue,
    getExpenseValues,
    triggerExpenseErrors,
    resetExpenseForm,
  };
}
