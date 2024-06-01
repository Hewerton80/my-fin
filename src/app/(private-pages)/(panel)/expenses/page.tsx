"use client";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { isNumber, isUndefined } from "@/shared/isType";
import { useMemo } from "react";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { format } from "date-fns/format";
import { ModalTriggerExpenseForm } from "../../../../modules/expenses/components/ModalTriggerExpenseForm";
import { ExpenseWithComputedFields } from "@/modules/expenses/types";
import { TableExpenseActionsButtons } from "@/modules/expenses/components/TableExpenseActionsButtons";
import { capitalizeFisrtLetter } from "@/shared/string";
import { ExpenseUtils } from "@/modules/expenses/utils";
import { Input } from "@/components/ui/forms/inputs/Input";

export default function ExpensesPage() {
  const {
    expenses,
    isLoadingExpenses,
    expensesError,
    searchExpenseValue,
    goToPage,
    refetchExpenses,
    changeSearcheQrCodeInput,
  } = useGetExpenses();

  const cols = useMemo<IColmunDataTable<ExpenseWithComputedFields>[]>(
    () => [
      {
        label: "Nome",
        field: "name",
        onParse: (expense) => (
          <>
            {expense?.iconsName
              ? `${expense?.iconsName?.replaceAll(",", "")} `
              : ""}
            {expense?.name}
          </>
        ),
      },
      {
        label: "Amount",
        field: "amount",
        onParse: (expense) =>
          isNumber(expense?.amount) ? getCurrencyFormat(expense?.amount!) : "-",
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
        label: "Categories",
        field: "subCategoriesName",
        onParse: (expense) =>
          expense?.subCategoriesName
            ? expense?.subCategoriesName?.replaceAll(",", ", ")
            : "-",
      },
      {
        label: "Credit Card",
        field: "creditCard",
        onParse: (expense) => expense?.creditCard?.name || "-",
      },
      {
        label: "Frequency",
        field: "frequency",
        onParse: (expense) =>
          expense?.frequency ? capitalizeFisrtLetter(expense?.frequency) : "-",
      },
      {
        label: "Due Date",
        field: "dueDate",
        onParse: (expense) =>
          expense?.dueDate
            ? format(new Date(expense?.dueDate), "dd/MM/yyyy")
            : "-",
      },
      {
        label: "Status",
        field: "status",
        onParse: (expense) =>
          expense?.status
            ? ExpenseUtils.getBadgeByStatus(expense?.status)
            : "-",
      },
      {
        label: "",
        field: "actions",
        onParse: (expense) => (
          <TableExpenseActionsButtons
            expense={expense}
            onSuccess={refetchExpenses}
          />
        ),
      },
    ],
    [refetchExpenses]
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Expenses</Card.Title>
        <Card.Actions>
          <ModalTriggerExpenseForm onSuccess={() => refetchExpenses()}>
            <Button>Add Expense</Button>
          </ModalTriggerExpenseForm>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <div className="flex items-center gap-2 sm:gap-2 flex-wrap mb-4">
          {/* <HorizontalScrollView>
            <Picker
              label="Status"
              value={usersQueryParams.isActive}
              onChange={(value) => changeUserFilter({ isActive: value })}
              hideInput
              options={[
                { label: "Ativo", value: "true" },
                { label: "Inativo", value: "false" },
              ]}
            />
            <Picker
              label="Função"
              value={usersQueryParams.role}
              onChange={(value) => changeUserFilter({ role: value })}
              hideInput
              options={usersRolesOptions}
            />
            <Picker
              label="Ordenar por"
              value={usersQueryParams.orderBy}
              onChange={(value) => changeUserFilter({ orderBy: value })}
              hideInput
              hideCloseButton
              options={orderByUserOptions}
            />
          </HorizontalScrollView> */}
          <div className="ml-auto w-full sm:w-auto">
            <Input
              value={searchExpenseValue}
              onChange={(e) => changeSearcheQrCodeInput(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
        {/* <ErrorBoundary> */}
        {/* <Suspense fallback={<div>Loading...</div>}>
          <ExpensesTable
          />
        </Suspense> */}
        {/* </ErrorBoundary> */}
        <DataTable
          columns={cols}
          data={expenses?.docs}
          onTryAgainIfError={refetchExpenses}
          isError={Boolean(expensesError)}
          isLoading={isLoadingExpenses || isUndefined(expenses)}
          paginationConfig={{
            currentPage: expenses?.currentPage || 1,
            totalPages: expenses?.lastPage || 1,
            perPage: expenses?.perPage || 25,
            totalRecords: expenses?.total || 1,
            onChangePage: goToPage,
          }}
        />
      </Card.Body>
    </Card.Root>
  );
}
