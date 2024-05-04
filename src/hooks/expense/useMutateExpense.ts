import { useRouter } from "next/navigation";
import { useAxios } from "../utils/useAxios";
import { useCallback, useEffect, useMemo } from "react";

import { z } from "zod";
import { SelectOption } from "@/components/ui/forms/selects";
import { CONSTANTS } from "@/shared/constants";
import { REGEX } from "@/shared/regex";
import { isValid as isValidDate } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isBoolean } from "@/shared/isType";
import { PaymantType } from "@prisma/client";

const { VALIDATION_ERROR_MESSAGES } = CONSTANTS;

const baseExpenseSchema = z
  .object({
    name: z.string().min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD),
    categoriesOptions: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    description: z.string().optional(),
    amount: z.number().optional().nullable(),
    isPaid: z
      .boolean()
      .nullable()
      .refine(
        (isPaid) => isBoolean(isPaid),
        VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD
      ),
    paymentType: z.string().nullable().optional(),
    frequency: z
      .string()
      // .min(1, VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD)
      .nullable()
      .optional(),
    numberOfInstallments: z.number().optional().nullable(),
    creditCardId: z.string().optional(),
    dueDate: z
      .string()
      .refine(
        (dueDate) =>
          dueDate
            ? dueDate.match(REGEX.isoDate) && isValidDate(new Date(dueDate))
            : true,
        VALIDATION_ERROR_MESSAGES.INVALID_DATE
      )
      .optional(),
    registrationDate: z
      .string()
      .refine(
        (registrationDate) =>
          registrationDate
            ? registrationDate.match(REGEX.isoDate) &&
              isValidDate(new Date(registrationDate))
            : true,
        VALIDATION_ERROR_MESSAGES.INVALID_DATE
      )
      .optional(),
  })
  .refine(({ isPaid, frequency }) => (isPaid ? true : frequency), {
    message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
    path: ["frequency"],
  })
  .refine(({ paymentType, isPaid }) => (isPaid ? paymentType : true), {
    message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
    path: ["paymentType"],
  })
  .refine(
    ({ paymentType, creditCardId }) =>
      paymentType === PaymantType.CREDIT_CARD ? creditCardId : true,
    {
      message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
      path: ["creditCardId"],
    }
  )
  .refine(
    ({ creditCardId, isPaid, registrationDate }) =>
      creditCardId || isPaid ? true : registrationDate,
    {
      message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
      path: ["registrationDate"],
    }
  )
  .refine(
    ({ creditCardId, isPaid, dueDate }) =>
      creditCardId || isPaid ? true : dueDate,
    {
      message: VALIDATION_ERROR_MESSAGES.REQUIRED_FIELD,
      path: ["dueDate"],
    }
  );
export const createExpenseSchema = baseExpenseSchema;
type InferBaseExpenseFormSchema = z.infer<typeof baseExpenseSchema>;
type InferCreateExpenseFormSchema = z.infer<typeof createExpenseSchema>;
export type ExpenseFormValues = InferBaseExpenseFormSchema &
  InferCreateExpenseFormSchema & {
    categoriesOptions: SelectOption[];
  };

export function useMutateExpense(expenseId?: string) {
  const { apiBase } = useAxios();
  const router = useRouter();

  const {
    control: expenseFormControl,
    watch: watchExpense,
    setValue: setExpenseValue,
    getValues: getExpenseValues,
    trigger: triggerExpenseErrors,
    formState: expenseFormState,
    clearErrors: clearExpenseErrors,
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      name: "",
      categoriesOptions: [],
      description: "",
      amount: null,
      isPaid: null,
      paymentType: null,
      frequency: null,
      numberOfInstallments: null,
      creditCardId: "",
      dueDate: "",
      registrationDate: "",
    },
    mode: "onTouched",
    resolver: zodResolver(createExpenseSchema),
  });

  useEffect(() => {
    console.log("expenseFormState.errors", expenseFormState?.errors);
  }, [expenseFormState.errors]);

  const setValueOptions = useMemo(
    () => ({ shouldDirty: true, shouldTouch: true }),
    []
  );

  const isSubmitting = useMemo(() => {
    return expenseFormState.isValidating;
  }, [expenseFormState.isValidating]);

  //   useEffect(() => {
  //     console.log("expenseFormState", expenseFormState);
  //   }, [expenseFormState]);

  // useEffect(() => {
  //   console.log("isSubmitting", isSubmitting);
  // }, [isSubmitting]);

  const clearDatesFields = useCallback(() => {
    setExpenseValue("registrationDate", "", setValueOptions);
    setExpenseValue("dueDate", "", setValueOptions);
    clearExpenseErrors(["registrationDate", "dueDate"]);
  }, [setExpenseValue, , clearExpenseErrors, setValueOptions]);

  const clearCreditCardField = useCallback(() => {
    setExpenseValue("creditCardId", "", setValueOptions);
    clearExpenseErrors(["creditCardId"]);
  }, [setExpenseValue, clearExpenseErrors, setValueOptions]);

  useEffect(() => {
    const subscription = watchExpense((value, { name }) => {
      if (name === "isPaid") {
        setExpenseValue("paymentType", null, setValueOptions);
        setExpenseValue("frequency", null, setValueOptions);
        clearDatesFields();
        clearCreditCardField();
        clearExpenseErrors(["frequency", "paymentType"]);
      }
      if (name === "paymentType") {
        clearCreditCardField();
      }
      if (name === "creditCardId") {
        clearDatesFields();
      }
      if (name === "frequency") {
        setExpenseValue("numberOfInstallments", null, setValueOptions);
        clearExpenseErrors(["numberOfInstallments"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [
    setValueOptions,
    clearExpenseErrors,
    watchExpense,
    clearCreditCardField,
    clearDatesFields,
    setExpenseValue,
  ]);

  const getHandledExpenseFormValues = useCallback(() => {
    const expenseFormValues = { ...getExpenseValues() };
    let handledExpenseFormValues: any = {};
    Object.keys(expenseFormState.dirtyFields).forEach((field) => {
      const expenseFormValue =
        expenseFormValues[field as keyof ExpenseFormValues];

      handledExpenseFormValues[field] =
        expenseFormValue === "" ? null : expenseFormValue;
    });
    return handledExpenseFormValues as ExpenseFormValues;
  }, [getExpenseValues, expenseFormState.dirtyFields]);

  const handleSubmitExpense = useCallback(async () => {
    // setIsTriggingErrors(true);
    const isValid = await triggerExpenseErrors();
    // setIsTriggingErrors(false);
    const expenseFormValues = getExpenseValues();
    console.log("expenseFormValues", expenseFormValues);
    console.log("isValid", isValid);
    if (!isValid) {
      return;
    }
    const handledExpenseFormValues = getHandledExpenseFormValues();
    console.log("handledExpenseFormValues", handledExpenseFormValues);
  }, [getExpenseValues, triggerExpenseErrors, getHandledExpenseFormValues]);

  return {
    expenseFormControl,
    expenseFormState,
    isSubmitting,
    watchExpense,
    handleSubmitExpense,
    setExpenseValue,
    getExpenseValues,
    triggerExpenseErrors,
  };
}
