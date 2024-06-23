"use client";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { isNumber, isUndefined } from "@/shared/isType";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetExpenses } from "@/modules/expenses/hooks/useGetExpenses";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { format } from "date-fns/format";
import { ModalTriggerExpenseForm } from "../../../../modules/expenses/components/ModalTriggerExpenseForm";
import {
  ExpenseStatus,
  ExpenseWithComputedFields,
} from "@/modules/expenses/types";
import { TableExpenseActionsButtons } from "@/modules/expenses/components/TableExpenseActionsButtons";
import { capitalizeFisrtLetter } from "@/shared/string";
import { ExpenseUtils } from "@/modules/expenses/utils";
import { Input } from "@/components/ui/forms/inputs/Input";
import { Tabs } from "@/components/ui/navigation/Tabs";

export default function ExpensesPage() {
  const {
    expenses,
    isLoadingExpenses,
    expensesError,
    searchExpenseValue,
    expenseFilterQueryParams,
    goToPage,
    refetchExpenses,
    changeSearcheQrCodeInput,
    changeExpenseStatus,
  } = useGetExpenses();

  const [showExpenseFormModal, setShowExpenseFormModal] = useState(false);
  const [expenseIdToEdit, setExpenseIdToEdit] = useState("");
  const [isCloningExpense, setIsCloningExpense] = useState(false);

  useEffect(() => {
    if (expenseIdToEdit) {
      setShowExpenseFormModal(true);
    }
  }, [expenseIdToEdit]);

  const cols = useMemo<IColmunDataTable<ExpenseWithComputedFields>[]>(
    () => [
      {
        label: "Nome",
        field: "name",
        onParse: (expense) => (
          <>
            {expense?.category?.iconName
              ? `${expense?.category?.iconName} `
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
        field: "category",
        onParse: (expense) => expense?.category?.name || "-",
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
        label: "Registration Date",
        field: "registrationDate",
        onParse: (expense) =>
          expense?.registrationDate
            ? format(new Date(expense?.registrationDate), "dd/MM/yyyy")
            : "-",
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
            onClickToEdit={(expenseId) => setExpenseIdToEdit(expenseId)}
            onClickToClone={(expenseId) => {
              setExpenseIdToEdit(expenseId);
              setIsCloningExpense(true);
            }}
          />
        ),
      },
    ],
    [refetchExpenses]
  );

  const handleCloseFormModal = useCallback(() => {
    setExpenseIdToEdit("");
    setShowExpenseFormModal(false);
    setIsCloningExpense(false);
  }, []);

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title>Expenses</Card.Title>
          <Card.Actions>
            <Button onClick={() => setShowExpenseFormModal(true)}>
              Add Expense
            </Button>
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
            <Tabs.Root
              value={expenseFilterQueryParams?.status}
              onValueChange={(value) => changeExpenseStatus(value)}
            >
              <Tabs.List>
                <Tabs.Trigger disabled={isLoadingExpenses} value="">
                  All
                </Tabs.Trigger>
                {Object.values(ExpenseStatus).map((status) => (
                  <Tabs.Trigger
                    disabled={isLoadingExpenses}
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
                value={searchExpenseValue}
                onChange={(e) => changeSearcheQrCodeInput(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>
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
      <ModalTriggerExpenseForm
        show={showExpenseFormModal}
        expenseId={expenseIdToEdit}
        isCloning={isCloningExpense}
        onClose={handleCloseFormModal}
        onSuccess={refetchExpenses}
      />
    </>
  );
}
