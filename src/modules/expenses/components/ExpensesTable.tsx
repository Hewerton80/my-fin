import { IPaginatedDocs } from "@/lib/prismaHelpers";
import { ExpenseWithComputedFields } from "../types";
import { api } from "@/shared/baseApi";
import { Table } from "@/components/ui/dataDisplay/Table";
import { isNumber } from "@/shared/isType";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { capitalizeFisrtLetter } from "@/shared/string";
import { TableExpenseActionsButtons } from "./TableExpenseActionsButtons";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { revalidateTag } from "next/cache";

export default async function ExpensesTable() {
  console.log("---ExpensesTable---");
  revalidateTag("ExpensesTable");
  try {
    const { data: expenses } = await api.get<
      IPaginatedDocs<ExpenseWithComputedFields>
    >("/expense", { next: { tags: ["ExpensesTable"], revalidate: 0 } });
    console.log("---deu_Certo---");

    const cols = [
      {
        label: "Nome",
        field: "name",
      },
      {
        label: "Amount",
        field: "amount",
      },
      {
        label: "Installments",
        field: "totalInstallments",
      },
      {
        label: "Categories",
        field: "subCategoriesName",
      },
      {
        label: "Credit Card",
        field: "creditCard",
      },
      {
        label: "Frequency",
        field: "frequency",
      },
      {
        label: "",
        field: "Actions",
      },
    ];

    const parsedExpenses = expenses?.docs.map((expense) => ({
      id: expense?.id,
      name: (
        <>
          {expense?.iconsName
            ? `${expense?.iconsName?.replaceAll(",", "")} `
            : ""}
          {expense?.name}
        </>
      ),
      amount: isNumber(expense?.amount)
        ? getCurrencyFormat(expense?.amount!)
        : "-",
      installments:
        isNumber(expense?.currentInstallment) &&
        isNumber(expense?.totalInstallments)
          ? `${expense?.currentInstallment}/${expense?.totalInstallments}`
          : "-",
      categories: expense?.subCategoriesName
        ? expense?.subCategoriesName?.replaceAll(",", ", ")
        : "-",
      creditCard: expense?.creditCard?.name || "-",
      frequency: expense?.frequency
        ? capitalizeFisrtLetter(expense?.frequency)
        : "-",
      actions: <TableExpenseActionsButtons expense={expense} />,
    }));

    return (
      <>
        <Table.Container>
          <Table>
            <Table.Head>
              <Table.Row>
                {cols.map((col) => (
                  <Table.HeadCell key={col.field}>{col.label}</Table.HeadCell>
                ))}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {parsedExpenses.map((expense) => (
                <Table.Row key={expense.id}>
                  <Table.Data>{expense.name}</Table.Data>
                  <Table.Data>{expense.amount}</Table.Data>
                  <Table.Data>{expense.installments}</Table.Data>
                  <Table.Data>{expense.categories}</Table.Data>
                  <Table.Data>{expense.creditCard}</Table.Data>
                  <Table.Data>{expense.frequency}</Table.Data>
                  <Table.Data>{expense["actions"]}</Table.Data>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Table.Container>
      </>
    );
  } catch (error) {
    // revalidateTag("ExpensesTable");
    console.error(error);
    // return <></>
    return <FeedBackError />;
  }
}
