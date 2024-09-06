import { useAxios } from "../../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useCallback, useMemo } from "react";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import {
  InferPayTransitionHistoryFormSchema,
  payFrontendTransitionSchema,
} from "../schemas/frontendFormTransitionHistorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransitionHistoryWitchConputedFields } from "../types";

export function usePayTransitionHistory() {
  const { apiBase } = useAxios();
  const { closeAlert, showAlert } = useAlertModal();

  const {
    control: payTransitionHistoryControl,
    formState: payTransitionHistoryFormState,
    getValues: getPayTransitionHistoryValues,
    reset: resetPayTransitionHistoryForm,
    trigger: triggerPayTransitionHistoryForm,
    setValue: setPayTransitionHistoryValue,
  } = useForm<InferPayTransitionHistoryFormSchema>({
    defaultValues: { paidAt: "" },
    mode: "onTouched",
    resolver: zodResolver(payFrontendTransitionSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiBase.patch<TransitionHistoryWitchConputedFields>(
        `/me/transition-history/pay/${id}`,
        {
          paidAt: getPayTransitionHistoryValues().paidAt,
        }
      ),
  });

  const isPaying = useMemo(
    () => isPending || payTransitionHistoryFormState.isValidating,
    [isPending, payTransitionHistoryFormState.isValidating]
  );

  const payTransitionHistory = useCallback(
    async (id: string, callbacks?: { onSuccess?: () => void }) => {
      const isValid = await triggerPayTransitionHistoryForm();
      if (!isValid) return;
      const onSuccess = ({}: AxiosResponse<
        TransitionHistoryWitchConputedFields,
        any
      >) => {
        toast.success("Transition paid successfully");
        closeAlert();
        callbacks?.onSuccess?.();
      };
      const onError = () => {
        closeAlert();
        showAlert({
          variant: "danger",
          title: "Error",
          description: "Error paying transition",
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
    [showAlert, mutate, closeAlert, triggerPayTransitionHistoryForm]
  );

  return {
    payTransitionHistory,
    isPaying,
    payTransitionHistoryControl,
    payTransitionHistoryFormState,
    getPayTransitionHistoryValues,
    resetPayTransitionHistoryForm,
    setPayTransitionHistoryValue,
  };
}
