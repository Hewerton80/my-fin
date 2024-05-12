"use client";
import { Button } from "@/components/ui/buttons/Button";
import { Card } from "@/components/ui/cards/Card";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { isNumber, isUndefined } from "@/shared/isType";
import Link from "next/link";
import { useMemo } from "react";
import { ExpernseWithComputedFields } from "@/types/Expense";
import { useGetExpenses } from "@/hooks/expense/useGetExpenses";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { format } from "date-fns/format";
import { getExpenseBadge } from "@/shared/statusExpenseBadge";
import { ModalTriggerExpenseForm } from "./components/ModalTriggerExpenseForm";

export default function UsersPage() {
  // const {
  //   users,
  //   isLoadingUsers,
  //   usersError,
  //   usersQueryParams,
  //   refetchUsers,
  //   changeUserFilter,
  //   goToPage,
  // } = useGetUsers();
  const {
    expenses,
    isLoadingExpenses,
    expensesError,
    goToPage,
    refetchExpenses,
  } = useGetExpenses();

  const cols = useMemo<IColmunDataTable<ExpernseWithComputedFields>[]>(
    () => [
      {
        label: "Nome",
        field: "name",
        onParse: (expernse) => <>{expernse?.name}</>,
      },
      {
        label: "Amount",
        field: "amount",
        onParse: (expernse) =>
          isNumber(expernse?.amount)
            ? getCurrencyFormat(expernse?.amount!)
            : "-",
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
        field: "subCategories",
        onParse: (expernse) =>
          expernse?.subCategories?.length
            ? expernse?.subCategories
                ?.map((subCategory) => subCategory?.name)
                ?.join(", ")
            : "-",
      },
      {
        label: "Credit Card",
        field: "creditCard",
        onParse: (expernse) => expernse?.creditCard?.name || "-",
      },
      {
        label: "Frequency",
        field: "frequency",
        onParse: (expernse) =>
          expernse?.frequency ? expernse?.frequency?.toLocaleLowerCase() : "-",
      },
      {
        label: "Due Date",
        field: "dueDate",
        onParse: (expernse) =>
          expernse?.dueDate
            ? format(new Date(expernse?.dueDate), "dd/MM/yyyy")
            : "-",
      },
      {
        label: "Status",
        field: "status",
        onParse: (expernse) =>
          expernse?.status ? getExpenseBadge(expernse?.status) : "-",
      },
    ],
    []
  );

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Expenses</Card.Title>
        <Card.Actions>
          <ModalTriggerExpenseForm>
            <Button>Add Expense</Button>
          </ModalTriggerExpenseForm>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        {/* <div className="flex items-center gap-2 sm:gap-2 flex-wrap">
          <HorizontalScrollView>
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
          </HorizontalScrollView>
          <div className="ml-auto w-full sm:w-auto">
            <Input
              value={usersQueryParams.keyword}
              onChange={(e) => changeUserFilter({ keyword: e.target.value })}
              placeholder="Pesquisar"
            />
          </div>
        </div> */}
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
