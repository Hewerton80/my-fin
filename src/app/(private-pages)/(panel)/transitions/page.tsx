"use client";

import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { Calendar } from "@/components/ui/forms/Calendar";
import { DatePicker } from "@/components/ui/forms/DatePicker/DatePicker";
import { Input } from "@/components/ui/forms/inputs/Input";
import { Tabs } from "@/components/ui/navigation/Tabs";
import { useGetTransiontionsHistoty } from "@/modules/transitionHistory/hooks/useGetTransiontionsHistoty";
import { TransitionHistoryWitchConputedFields } from "@/modules/transitionHistory/types";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { isNumber, isUndefined } from "@/shared/isType";
import { capitalizeFisrtLetter } from "@/shared/string";
import { TransitionType } from "@prisma/client";
import { format } from "date-fns";
import { useMemo, useState } from "react";
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
    goToPage,
  } = useGetTransiontionsHistoty();

  const cols = useMemo<
    IColmunDataTable<TransitionHistoryWitchConputedFields>[]
  >(
    () => [
      {
        label: "Name",
        field: "name",
        onParse: (transitionHistory) =>
          transitionHistory?.name || transitionHistory?.expense?.name || "-",
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
        label: "Installments",
        field: "totalInstallments",
        onParse: ({ currentInstallment, totalInstallments }) =>
          isNumber(currentInstallment) && isNumber(totalInstallments)
            ? `${currentInstallment}/${totalInstallments}`
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
    ],
    []
  );

  const [date, setDate] = useState<Date>();

  return (
    <>
      <DatePicker date={date} onChange={setDate} />
      <Card.Root>
        <Card.Header>
          <Card.Title>Historic Transtitons</Card.Title>
          <Card.Actions>
            {/* <Button onClick={() => setShowExpenseFormModal(true)}>
              Add Expense
            </Button> */}
          </Card.Actions>
        </Card.Header>
        <Card.Body>
          {/* <Calendar mode="single" selected={date} onSelect={setDate} /> */}
          <div className="flex items-center gap-2 sm:gap-2 flex-wrap mb-4">
            <Tabs.Root
              value={transionHistoriesQueryParams?.type}
              onValueChange={(value) => changeTransitionHistoryType(value)}
            >
              <Tabs.List>
                <Tabs.Trigger disabled={isLoadingTransitionsHistory} value="">
                  All
                </Tabs.Trigger>
                {Object.values(TransitionType).map((status) => (
                  <Tabs.Trigger
                    disabled={isLoadingTransitionsHistory}
                    key={status}
                    value={status}
                  >
                    {capitalizeFisrtLetter(status)}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
            <div className="ml-auto w-full sm:w-auto">
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
    </>
  );
}
