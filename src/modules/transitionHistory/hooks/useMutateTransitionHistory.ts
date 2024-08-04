import { useAlertModal } from "@/hooks/useAlertModal";
import { useAxios } from "@/hooks/useAxios";
import { useCallback, useEffect, useMemo } from "react";
import { InferCreateTransitionHistoryFormSchema } from "../schemas/frontendFormTransitionHistorySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { frontendFormTransitionHistoryReceiveSchema } from "../schemas/frontendFormTransitionHistorySchema";
import { useMutation } from "@tanstack/react-query";
import { getOnlyDirtyFields } from "@/lib/hookForm";
import { toast } from "react-toastify";

export function useMutateTransitionHistory() {
  const { apiBase } = useAxios();
  const { showAlert } = useAlertModal();

  const transitionHistoryFormDefaultValues =
    useMemo<InferCreateTransitionHistoryFormSchema>(
      () => ({
        id: "",
        name: "",
        amount: 0,
        registrationDate: "",
        type: null,
        categoryId: "",
        description: "",
        isPaid: null,
        paymentType: null,
        frequency: null,
        totalInstallments: null,
        creditCardId: "",
        isCloning: false,
      }),
      []
    );

  const {
    control: transitionHistoryFormControl,
    watch: watchTransitionHistory,
    getValues: getTransitionHistoryValues,
    formState: transitionHistoryFormState,
    clearErrors: clearTransitionHistoryErrors,
    trigger: triggerTransitionHistoryErrors,
    setValue: setTransitionHistoryValue,
    reset: resetTransitionHistoryForm,
  } = useForm<InferCreateTransitionHistoryFormSchema>({
    defaultValues: transitionHistoryFormDefaultValues,
    mode: "onTouched",
    resolver: zodResolver(frontendFormTransitionHistoryReceiveSchema),
  });

  const {
    mutate: createTransitionHistory,
    isPending: isCreatingTransitionHistory,
  } = useMutation({
    mutationFn: (
      transitionHistoryData: InferCreateTransitionHistoryFormSchema
    ) => apiBase.post("/me/transition-history", transitionHistoryData),
  });

  const isSubmittingTransitionHistory = useMemo(
    () =>
      transitionHistoryFormState.isValidating || isCreatingTransitionHistory,
    [transitionHistoryFormState.isValidating, isCreatingTransitionHistory]
  );

  const setValueOptions = useMemo(
    () => ({ shouldDirty: true, shouldTouch: true }),
    []
  );

  const clearCreditCardField = useCallback(() => {
    setTransitionHistoryValue("creditCardId", "", setValueOptions);
    clearTransitionHistoryErrors(["creditCardId"]);
  }, [
    setTransitionHistoryValue,
    clearTransitionHistoryErrors,
    setValueOptions,
  ]);

  useEffect(() => {
    const subscription = watchTransitionHistory((_, { name }) => {
      if (name === "type") {
        setTransitionHistoryValue("isPaid", null, setValueOptions);
        clearTransitionHistoryErrors(["isPaid"]);
      }
      if (name === "isPaid") {
        setTransitionHistoryValue("paymentType", null, setValueOptions);
        setTransitionHistoryValue("frequency", null, setValueOptions);
        clearTransitionHistoryErrors(["frequency", "paymentType"]);
        clearCreditCardField();
      }
      if (name === "paymentType") {
        clearCreditCardField();
      }
      if (name === "frequency") {
        setTransitionHistoryValue("totalInstallments", null, setValueOptions);
        clearTransitionHistoryErrors(["totalInstallments"]);
      }
    });
    return () => subscription.unsubscribe();
  }, [
    setValueOptions,
    clearTransitionHistoryErrors,
    watchTransitionHistory,
    clearCreditCardField,
    setTransitionHistoryValue,
  ]);

  const getHandledTransitionHistoryData = useCallback(() => {
    const transitionHistoryData = { ...getTransitionHistoryValues() };
    const handledTransitionHistoryFormValues = getOnlyDirtyFields(
      transitionHistoryData,
      transitionHistoryFormState.dirtyFields
    ) as InferCreateTransitionHistoryFormSchema;

    if (transitionHistoryData?.id) {
      handledTransitionHistoryFormValues.id = transitionHistoryData.id;
    }
    delete handledTransitionHistoryFormValues?.isCloning;

    return handledTransitionHistoryFormValues;
  }, [getTransitionHistoryValues, transitionHistoryFormState.dirtyFields]);

  const handleSubmitTransitionHistory = useCallback(
    async (callbacks?: { onSuccess?: () => void; onError?: () => void }) => {
      const isValid = await triggerTransitionHistoryErrors();
      if (!isValid) {
        return;
      }
      const handledTransitionHistoryFormValues =
        getHandledTransitionHistoryData();
      const isEdit = !!handledTransitionHistoryFormValues.id;
      const onSuccess = () => {
        callbacks?.onSuccess?.();
        toast.success(
          `Transition ${isEdit ? "edited" : "created"} successfully!`
        );
      };
      const onError = (error: any) => {
        console.error("error", error);
        showAlert({
          title: `Error to ${isEdit ? "edit" : "create"}`,
          variant: "danger",
        });
      };
      createTransitionHistory(handledTransitionHistoryFormValues, {
        onSuccess,
        onError,
      });
    },
    [
      createTransitionHistory,
      triggerTransitionHistoryErrors,
      getHandledTransitionHistoryData,
      showAlert,
    ]
  );

  return {
    transitionHistoryFormControl,
    transitionHistoryFormState,
    isSubmittingTransitionHistory,
    transitionHistoryFormDefaultValues,
    watchTransitionHistory,
    getTransitionHistoryValues,
    handleSubmitTransitionHistory,
    clearTransitionHistoryErrors,
    triggerTransitionHistoryErrors,
    setTransitionHistoryValue,
    resetTransitionHistoryForm,
    createTransitionHistory,
  };
}
