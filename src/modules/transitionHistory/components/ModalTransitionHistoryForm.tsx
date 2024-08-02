import { Modal } from "@/components/ui/overlay/Modal";
import { useCallback, useEffect, useMemo } from "react";
import { useMutateTransitionHistory } from "../hooks/useMutateTransitionHistory";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/forms/inputs/Input";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { isNull } from "@/shared/isType";
import { Button } from "@/components/ui/buttons/Button";
import { useGetTransiontionHistoty } from "../hooks/useGetTransiontionHistoty";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { format } from "date-fns";

interface ModalTransitionHistoryFormProps {
  transictionHistoryId?: string;
  show: boolean;
  isCloning?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModalTransitionHistory({
  transictionHistoryId,
  show,
  isCloning,
  onClose,
  onSuccess,
}: ModalTransitionHistoryFormProps) {
  const {
    isSubmittingTransitionHistory,
    transitionHistoryFormDefaultValues,
    transitionHistoryFormControl,
    transitionHistoryFormState,
    resetTransitionHistoryForm,
    handleSubmitTransitionHistory,
  } = useMutateTransitionHistory();

  const {
    transitionHisory: currentTransitionHistory,
    isLoadingTransiotionHistory,
    fetchTransiotionHistory,
  } = useGetTransiontionHistoty(transictionHistoryId);

  useEffect(() => {
    if (show && transictionHistoryId) {
      fetchTransiotionHistory();
    }
  }, [fetchTransiotionHistory, transictionHistoryId, show]);

  useEffect(() => {
    if (currentTransitionHistory) {
      resetTransitionHistoryForm({
        id: isCloning ? "" : currentTransitionHistory?.id || "",
        expenseId: currentTransitionHistory?.expenseId || null,
        name: currentTransitionHistory?.name || "",
        amount: currentTransitionHistory?.amount || 0,
        paidAt: currentTransitionHistory?.paidAt
          ? format(new Date(currentTransitionHistory?.paidAt), "yyyy-MM-dd")
          : "",
        isCloning,
      });
    }
  }, [currentTransitionHistory, isCloning, resetTransitionHistoryForm]);

  const isEdit = useMemo(
    () => Boolean(transictionHistoryId),
    [transictionHistoryId]
  );

  const handleCloseModal = useCallback(() => {
    resetTransitionHistoryForm(transitionHistoryFormDefaultValues);
    onClose?.();
  }, [resetTransitionHistoryForm, onClose, transitionHistoryFormDefaultValues]);

  return (
    <>
      <Modal.Root size="xs" show={show} onClose={handleCloseModal}>
        <Modal.Title>{isEdit ? "Edit" : "Create"} Transition</Modal.Title>

        {isLoadingTransiotionHistory ? (
          <div className="flex items-center justify-center py-40">
            <Spinner size={64} />
          </div>
        ) : (
          <>
            <Modal.Body asChild>
              <form
                className="grid grid-cols-1 gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Controller
                  control={transitionHistoryFormControl}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Name"
                      placeholder="Name"
                      required
                      error={fieldState?.error?.message}
                    />
                  )}
                />
                <Controller
                  control={transitionHistoryFormControl}
                  name="amount"
                  render={({ field: { value, ...restField }, fieldState }) => (
                    <CurrencyInput
                      {...restField}
                      required
                      value={isNull(value) ? undefined : Number(value)}
                      label="Amount"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={transitionHistoryFormControl}
                  name="paidAt"
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
              </form>
            </Modal.Body>
            <Modal.Footer className="gap-2">
              <Button
                onClick={handleCloseModal}
                disabled={isSubmittingTransitionHistory}
                variantStyle="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleSubmitTransitionHistory({
                    onSuccess: () => {
                      onSuccess?.();
                      handleCloseModal();
                    },
                  })
                }
                type="button"
                variantStyle="primary"
                isLoading={isSubmittingTransitionHistory}
                disabled={!transitionHistoryFormState.isDirty}
              >
                {isEdit ? "Update" : "Save"}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Root>
    </>
  );
}
