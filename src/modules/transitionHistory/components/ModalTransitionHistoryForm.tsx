import { Modal } from "@/components/ui/overlay/Modal";
import { useCallback, useEffect, useMemo } from "react";
import { useMutateTransitionHistory } from "../hooks/useMutateTransitionHistory";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/forms/inputs/Input";
import { CurrencyInput } from "@/components/ui/forms/inputs/CurrencyInput";
import { isBoolean, isNull, isNumber } from "@/utils/isType";
import { Button } from "@/components/ui/buttons/Button";
import { useGetTransiontionHistoty } from "../hooks/useGetTransiontionHistoty";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { format } from "date-fns";
import { Select, SelectOption } from "@/components/ui/forms/selects";
import { useGetGroupCategories } from "@/modules/category/hooks/useGetGroupCategories";
import { Radio } from "@/components/ui/forms/Radio";
import { stringToBoolean } from "@/utils/stringToBoolean";
import {
  PaymantType,
  TransitionHistoryFrequency,
  TransitionHistoryPaymantType,
  TransitionHistoryStatus,
  TransitionType,
} from "@prisma/client";
import { capitalizeFisrtLetter } from "@/utils/string";
import { getRange } from "@/utils/getRange";
import { getCurrencyFormat } from "@/utils/getCurrencyFormat";
import { useGetCreditCards } from "@/modules/creditCard/hooks/useGetCreditCards";
import { useCacheTransitions } from "../hooks/useCacheTransitionHistory";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";

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
  const { resetTransitionInfoCahce } = useCacheTransitions();

  const {
    isSubmittingTransitionHistory,
    transitionHistoryFormDefaultValues,
    transitionHistoryFormControl,
    transitionHistoryFormState,
    resetTransitionHistoryForm,
    handleSubmitTransitionHistory,
    watchTransitionHistory,
  } = useMutateTransitionHistory();

  const { groupCategories, isLoadingCategories, refetchCategories } =
    useGetGroupCategories();

  const { creditCards, isLoadingCreditCards, refetchCreditCards } =
    useGetCreditCards();

  const {
    transitionHisory: currentTransitionHistory,
    isLoadingTransiotionHistory,
    errorTransiotionHistory,
    fetchTransiotionHistory,
  } = useGetTransiontionHistoty(transictionHistoryId);

  useEffect(() => {
    if (show && transictionHistoryId) {
      fetchTransiotionHistory();
    }
  }, [fetchTransiotionHistory, transictionHistoryId, show]);

  useEffect(() => {
    console.log("currentTransitionHistory", currentTransitionHistory);
    if (currentTransitionHistory) {
      resetTransitionHistoryForm({
        id: isCloning ? "" : currentTransitionHistory?.id || "",
        name: currentTransitionHistory?.name || "",
        amount: currentTransitionHistory?.amount || 0,
        type: currentTransitionHistory?.type || null,
        isPaid: isCloning ? null : currentTransitionHistory?.status === "PAID",
        paymentType: currentTransitionHistory?.paymentType || null,
        frequency: currentTransitionHistory?.frequency || null,
        totalInstallments: currentTransitionHistory?.totalInstallments || null,
        registrationDate: currentTransitionHistory?.registrationDate
          ? format(
              new Date(currentTransitionHistory?.registrationDate),
              "yyyy-MM-dd"
            )
          : "",
        creditCardId: currentTransitionHistory?.creditCardId || "",
        categoryId: currentTransitionHistory?.categoryId || "",
        isCloning,
      });
    }
  }, [currentTransitionHistory, isCloning, resetTransitionHistoryForm]);

  const isEdit = useMemo(() => {
    console.log({
      transictionHistoryIdToEditInModalForm: transictionHistoryId,
    });
    return Boolean(transictionHistoryId) && !isCloning;
  }, [transictionHistoryId, isCloning]);

  const categoriesOptions = useMemo<SelectOption[]>(() => {
    if (
      currentTransitionHistory?.category?.id &&
      !Array.isArray(groupCategories)
    ) {
      return [
        {
          value: currentTransitionHistory?.category?.id,
          label: currentTransitionHistory?.category?.name!,
          icon: currentTransitionHistory?.category?.iconName!,
        },
      ];
    }
    if (!Array.isArray(groupCategories)) {
      return [];
    }
    return groupCategories?.map((groupCategory) => ({
      label: groupCategory.name,
      options:
        groupCategory?.categories?.map((category) => ({
          label: category?.name,
          value: category?.id,
        })) || [],
    })) as SelectOption[];
  }, [groupCategories, currentTransitionHistory]);

  const creditCardsOptions = useMemo<SelectOption[]>(() => {
    if (
      currentTransitionHistory?.creditCard?.id &&
      !Array.isArray(creditCards)
    ) {
      return [
        {
          label: currentTransitionHistory?.creditCard?.name as string,
          value: currentTransitionHistory?.creditCard?.id,
        },
      ];
    }
    if (!Array.isArray(creditCards)) {
      return [];
    }
    return creditCards.map((creditCard) => ({
      label: creditCard?.name || "",
      value: creditCard?.id,
    })) as SelectOption[];
  }, [creditCards, currentTransitionHistory]);

  const handleFocusCategoriesSelect = useCallback(() => {
    if (!Array.isArray(groupCategories) && !isLoadingCategories) {
      refetchCategories();
    }
  }, [groupCategories, isLoadingCategories, refetchCategories]);

  const handleFocusCreditCardsSelect = useCallback(() => {
    if (!Array.isArray(creditCards) && !isLoadingCreditCards) {
      refetchCreditCards();
    }
  }, [creditCards, isLoadingCreditCards, refetchCreditCards]);

  const handleCloseModal = useCallback(() => {
    resetTransitionHistoryForm(transitionHistoryFormDefaultValues);
    onClose?.();
    resetTransitionInfoCahce();
  }, [
    resetTransitionHistoryForm,
    onClose,
    resetTransitionInfoCahce,
    transitionHistoryFormDefaultValues,
  ]);

  return (
    <>
      <Modal.Root size="md" show={show} onClose={handleCloseModal}>
        <Modal.Title>{isEdit ? "Edit" : "Create"} Transition</Modal.Title>

        {isLoadingTransiotionHistory ? (
          <div className="flex items-center justify-center py-40">
            <Spinner size={64} />
          </div>
        ) : errorTransiotionHistory ? (
          <FeedBackError onTryAgain={fetchTransiotionHistory} />
        ) : (
          <>
            <Modal.Body asChild>
              <form
                className="grid grid-cols-1 gap-4 overflow-y-auto"
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
                  name="categoryId"
                  render={({
                    field: { value, onChange, ...restField },
                    fieldState,
                  }) => (
                    <Select
                      {...restField}
                      value={value || ""}
                      required
                      isSearchable
                      onFocus={handleFocusCategoriesSelect}
                      onChange={(option) => onChange(option?.value)}
                      isLoading={isLoadingCategories}
                      label="Category"
                      options={categoriesOptions}
                      error={fieldState.error?.message}
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
                {!isEdit && (
                  <Controller
                    control={transitionHistoryFormControl}
                    name="type"
                    render={({
                      field: { onChange, value, ...restField },
                      fieldState,
                    }) => (
                      <Radio.Root
                        {...restField}
                        value={value || undefined}
                        label="Transition Type"
                        onValueChange={onChange}
                        error={fieldState?.error?.message}
                        required
                      >
                        {Object.keys(TransitionType).map((key) => (
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

                {!isEdit &&
                  watchTransitionHistory("type") === TransitionType.PAYMENT && (
                    <>
                      <Controller
                        control={transitionHistoryFormControl}
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
                      {watchTransitionHistory("isPaid") && (
                        <Controller
                          control={transitionHistoryFormControl}
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
                              {Object.keys(TransitionHistoryPaymantType)
                                .filter(
                                  (paymentType) =>
                                    paymentType !==
                                    String(PaymantType.CREDIT_CARD)
                                )
                                .map((key) => (
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
                      {watchTransitionHistory("isPaid") === false && (
                        <>
                          <Controller
                            control={transitionHistoryFormControl}
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
                                {Object.keys(TransitionHistoryFrequency).map(
                                  (key) => (
                                    <Radio.Item
                                      key={key}
                                      value={key}
                                      label={capitalizeFisrtLetter(key)}
                                    />
                                  )
                                )}
                              </Radio.Root>
                            )}
                          />
                        </>
                      )}
                      {watchTransitionHistory("frequency") ===
                        TransitionHistoryFrequency.MONTHLY && (
                        <>
                          <Controller
                            control={transitionHistoryFormControl}
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
                                options={getRange(0, 12).map((i) => ({
                                  label: `${i + 1}x`,
                                  value: String(i + 1),
                                }))}
                                error={fieldState.error?.message}
                                subtitle={
                                  watchTransitionHistory("amount") &&
                                  isNumber(value)
                                    ? `${value}x de ${getCurrencyFormat(
                                        Number(watchTransitionHistory("amount"))
                                      )}  |  total: ${getCurrencyFormat(
                                        Number(value) *
                                          Number(
                                            watchTransitionHistory("amount")
                                          )
                                      )}`
                                    : undefined
                                }
                              />
                            )}
                          />
                        </>
                      )}

                      {!isEdit &&
                        watchTransitionHistory("isPaid") === false && (
                          <Controller
                            control={transitionHistoryFormControl}
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
                                onChange={(option) =>
                                  onChange(String(option?.value))
                                }
                                onFocus={handleFocusCreditCardsSelect}
                                options={creditCardsOptions}
                                error={fieldState.error?.message}
                              />
                            )}
                          />
                        )}
                    </>
                  )}
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
                disabled={!transitionHistoryFormState.isDirty && !isCloning}
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
