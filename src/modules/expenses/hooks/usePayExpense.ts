"use client";
import { useAxios } from "../../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useCallback, useMemo } from "react";
import { ExpenseWithComputedFields } from "../types";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import {
  InferPayExpenseFormSchema,
  payFrontendExpenseSchema,
} from "../schemas/frontendFormExpenseSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export function usePayExpense() {
  const { apiBase } = useAxios();
  const { closeAlert, showAlert } = useAlertModal();

  const {
    control: payExpenseControl,
    formState: payExpenseFormState,
    getValues: getPayExpenseValues,
    reset: resetPayExpenseForm,
    trigger: triggerPayExpenseForm,
  } = useForm<InferPayExpenseFormSchema>({
    defaultValues: { paidAt: "" },
    mode: "onTouched",
    resolver: zodResolver(payFrontendExpenseSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiBase.patch<ExpenseWithComputedFields>(`/me/expenses/pay/${id}`, {
        paidAt: getPayExpenseValues().paidAt,
      }),
  });

  const isPaying = useMemo(
    () => isPending || payExpenseFormState.isValidating,
    [isPending, payExpenseFormState.isValidating]
  );

  const payExpense = useCallback(
    async (id: string, callbacks?: { onSuccess?: () => void }) => {
      const isValid = await triggerPayExpenseForm();
      if (!isValid) return;
      const onSuccess = ({}: AxiosResponse<ExpenseWithComputedFields, any>) => {
        toast.success("Expense paid successfully");
        closeAlert();
        callbacks?.onSuccess?.();
      };
      const onError = () => {
        closeAlert();
        showAlert({
          variant: "danger",
          title: "Error",
          description: "Error paying expense",
        });
      };
      // const onClickConfirmButton = () => {
      //   mutate({ id }, { onSuccess, onError });
      // };
      // showAlert({
      //   title: "Are you sure?",
      //   showCancelButton: true,
      //   isAsync: true,
      //   onClickConfirmButton,
      // });
      mutate({ id }, { onSuccess, onError });
    },
    [showAlert, mutate, closeAlert, triggerPayExpenseForm]
  );

  return {
    payExpense,
    isPaying,
    payExpenseControl,
    payExpenseFormState,
    getPayExpenseValues,
    resetPayExpenseForm,
  };
}
