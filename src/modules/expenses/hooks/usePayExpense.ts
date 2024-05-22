import { useAxios } from "../../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAlertModal } from "@/hooks/useAlertModal";
import { useCallback } from "react";

export function usePayExpense() {
  const { apiBase } = useAxios();
  const { closeAlert, showAlert } = useAlertModal();

  const { mutate, isPending: isPaying } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiBase.patch(`/expenses/pay/${id}`),
  });

  const payExpense = useCallback(
    (id: string, callbacks?: { onSuccess?: () => void }) => {
      const onSuccess = () => {
        callbacks?.onSuccess?.();
        toast.success("Expense paid successfully");
        closeAlert();
      };
      const onError = () => {
        showAlert({
          variant: "danger",
          title: "Error",
          description: "Error paying expense",
        });
      };
      const onClickConfirmButton = () => {
        mutate({ id }, { onSuccess, onError });
      };
      showAlert({
        title: "Are you sure?",
        showCancelButton: true,
        isAsync: true,
        onClickConfirmButton,
      });
    },
    [showAlert, mutate, closeAlert]
  );

  return { payExpense, isPaying };
}
