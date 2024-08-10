"use client";

import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { DateRangePicker } from "@/components/ui/forms/DateRangePicker";
import { Input } from "@/components/ui/forms/inputs/Input";
import { Picker } from "@/components/ui/forms/selects/Picker/Picker";
import { Tabs } from "@/components/ui/navigation/Tabs";
import { ModalTransitionHistory } from "@/modules/transitionHistory/components/ModalTransitionHistoryForm";
import { TableTransitionActionsButtons } from "@/modules/transitionHistory/components/TableTransiotionActionsButtons";
import { TransitionStatusBadge } from "@/modules/transitionHistory/components/TransitionStatusBadge";
import { useGetTransiontionsHistoty } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistoty";
import { TransitionHistoryWitchConputedFields } from "@/modules/transitionHistory/types";
import { CONSTANTS } from "@/shared/constants";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { isNumber, isUndefined } from "@/shared/isType";
import { capitalizeFisrtLetter } from "@/shared/string";
import { TransitionHistoryStatus, TransitionType } from "@prisma/client";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function TranstitonsPage() {
  const {
    transitionsHistory,
    isLoadingTransitionsHistory,
    transionHistoriesQueryParams,
    transitionsHistoryError,
    searchTransitionHistoryValue,
    changeTransitionHistoryType,
    changeSearcheInput,
    refetchTransitionHistorys,
    changeDateRange,
    goToPage,
    changeTransitionHistoryStatus,
  } = useGetTransiontionsHistoty();

  const [showTransitionFormModal, setShowTransitionFormModal] = useState(false);
  const [transitionIdToEdit, setTransitionIdToEdit] = useState("");
  const [isCloningTransition, setIsCloningTransition] = useState(false);

  useEffect(() => {
    if (transitionIdToEdit) {
      setShowTransitionFormModal(true);
    }
  }, [transitionIdToEdit]);

  const cols = useMemo<
    IColmunDataTable<TransitionHistoryWitchConputedFields>[]
  >(
    () => [
      {
        label: "Nome",
        field: "name",
        onParse: (transitionHistory) => (
          <span
            className={twMerge(
              transitionHistory?.status === TransitionHistoryStatus.CANCELED &&
                "line-through"
            )}
          >
            {transitionHistory?.category?.iconName
              ? `${transitionHistory?.category?.iconName} `
              : ""}
            {transitionHistory?.name}
          </span>
        ),
      },
      {
        label: "Amount",
        field: "amount",
        onParse: (transitionHistory) =>
          isNumber(transitionHistory?.amount) ? (
            <span
              className={twMerge(
                transitionHistory?.type === TransitionType.RECEIPT
                  ? "text-success"
                  : "text-warning"
              )}
            >
              {getCurrencyFormat(transitionHistory?.amount!)}
            </span>
          ) : (
            "-"
          ),
      },
      {
        label: "Installment",
        field: "totalInstallments",
        onParse: ({ currentInstallment, totalInstallments }) =>
          isNumber(currentInstallment) && isNumber(totalInstallments)
            ? `${currentInstallment}/${totalInstallments}`
            : "-",
      },
      {
        label: "Category",
        field: "category",
        onParse: (transitionHistory) =>
          transitionHistory?.category?.name || "-",
      },
      {
        label: "Credit Card",
        field: "creditCard",
        onParse: (transitionHistory) =>
          transitionHistory?.creditCard?.name || "-",
      },
      {
        label: "Frequency",
        field: "frequency",
        onParse: (transitionHistory) =>
          transitionHistory?.frequency
            ? capitalizeFisrtLetter(transitionHistory?.frequency)
            : "-",
      },
      {
        label: "Paid at",
        field: "paidAt",
        onParse: (transitionHistory) =>
          transitionHistory?.paidAt
            ? format(new Date(transitionHistory?.paidAt), "dd/MM/yyyy")
            : "-",
      },
      {
        label: "Registrated at",
        field: "registrationDate",
        onParse: (transitionHistory) =>
          transitionHistory?.registrationDate
            ? format(
                new Date(transitionHistory?.registrationDate),
                "dd/MM/yyyy"
              )
            : "-",
      },
      {
        label: "Due Date",
        field: "dueDate",
        onParse: (transitionHistory) =>
          transitionHistory?.dueDate
            ? format(new Date(transitionHistory?.dueDate), "dd/MM/yyyy")
            : "-",
      },
      {
        label: "Status",
        field: "status",
        onParse: (transitionHistory) =>
          transitionHistory?.status ? (
            <TransitionStatusBadge status={transitionHistory?.status} />
          ) : (
            "-"
          ),
      },
      {
        label: "",
        field: "actions",
        onParse: (transitionHistory) => (
          <TableTransitionActionsButtons
            transitionHistory={transitionHistory}
            onClickToEdit={() => setTransitionIdToEdit(transitionHistory?.id)}
            onClickToClone={() => {
              setTransitionIdToEdit(transitionHistory?.id);
              setIsCloningTransition(true);
            }}
            onSuccess={refetchTransitionHistorys}
          />
        ),
      },
    ],
    [refetchTransitionHistorys]
  );

  const handleCloseFormModal = useCallback(() => {
    setShowTransitionFormModal(false);
    setTransitionIdToEdit("");
  }, []);

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title>Historic Transitions</Card.Title>
          <Card.Actions>
            <Button onClick={() => setShowTransitionFormModal(true)}>
              Add Transition
            </Button>
          </Card.Actions>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center gap-2 sm:gap-2 flex-wrap mb-4">
            <Picker
              value={transionHistoriesQueryParams?.type}
              onChange={(value) => changeTransitionHistoryType(value)}
              label="Type"
              showLabelInner
              options={[
                { label: "All", value: CONSTANTS.FIELDS_VALUES.ALL },
                ...Object.values(TransitionType).map((type) => ({
                  label: capitalizeFisrtLetter(type),
                  value: type,
                })),
              ]}
            />
            <Picker
              value={transionHistoriesQueryParams?.status}
              onChange={(value) => changeTransitionHistoryStatus(value)}
              label="Status"
              showLabelInner
              options={[
                { label: "All", value: CONSTANTS.FIELDS_VALUES.ALL },
                ...Object.values(TransitionHistoryStatus).map((status) => ({
                  label: capitalizeFisrtLetter(status),
                  value: status,
                })),
              ]}
            />

            <div className="ml-auto flex items-center gap-2 sm:gap-2 w-full sm:w-auto">
              <DateRangePicker
                rangeDate={{
                  from: transionHistoriesQueryParams?.startPaidAt
                    ? new Date(transionHistoriesQueryParams?.startPaidAt)
                    : undefined,
                  to: transionHistoriesQueryParams?.endPaidAt
                    ? new Date(transionHistoriesQueryParams?.endPaidAt)
                    : undefined,
                }}
                onChange={(rangeDate) => {
                  changeDateRange({
                    from: rangeDate?.from,
                    to: rangeDate?.to,
                  });
                }}
              />
              <Input
                value={searchTransitionHistoryValue}
                onChange={(e) => changeSearcheInput(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>
          <DataTable
            columns={cols}
            data={transitionsHistory?.docs}
            onTryAgainIfError={refetchTransitionHistorys}
            isError={Boolean(transitionsHistoryError)}
            isLoading={
              isLoadingTransitionsHistory || isUndefined(transitionsHistory)
            }
            paginationConfig={{
              currentPage: transitionsHistory?.currentPage || 1,
              totalPages: transitionsHistory?.lastPage || 1,
              perPage: transitionsHistory?.perPage || 25,
              totalRecords: transitionsHistory?.total || 1,
              onChangePage: goToPage,
            }}
          />
        </Card.Body>
      </Card.Root>
      <ModalTransitionHistory
        show={showTransitionFormModal}
        transictionHistoryId={transitionIdToEdit}
        isCloning={isCloningTransition}
        onClose={handleCloseFormModal}
        onSuccess={refetchTransitionHistorys}
      />
    </>
  );
}
