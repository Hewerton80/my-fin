"use client";

import { Card } from "@/components/ui/cards/Card";
import { CardStats } from "@/components/ui/cards/CardStats";
import { PieChart } from "@/components/ui/charts/PieChart/PieChart";
import {
  DataTable,
  IColmunDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { useGetDashboard } from "@/modules/dashboard/hooks/useGetInsights";
import { CategoryInsights } from "@/modules/dashboard/types";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { useMemo } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import Link from "next/link";
import { IoEyeOutline, IoPieChartOutline } from "react-icons/io5";
import { capitalizeFisrtLetter } from "@/shared/string";
import { LineChart } from "@/components/ui/charts/LineChart";
import { BsGraphUp } from "react-icons/bs";
import { IconButton } from "@/components/ui/buttons/IconButton";
import { isNumber } from "@/shared/isType";
import { twMerge } from "tailwind-merge";
import { FaLongArrowAltUp } from "react-icons/fa";

import assets from "../../../../../assets.json";

export default function HomePage() {
  const { dashboard, isLoadingDashboard, dashboardError, refetchDashboard } =
    useGetDashboard();

  const categoryInsights = useMemo(() => {
    return dashboard?.categoryInsights;
  }, [dashboard]);

  const paidCreditCardExpensesInsights = useMemo(() => {
    return dashboard?.paidCreditCardExpensesInsights;
  }, [dashboard]);

  const oweCreditCardExpensesInsights = useMemo(() => {
    return dashboard?.oweCreditCardExpensesInsights;
  }, [dashboard]);

  const historicInsights = useMemo(() => {
    return dashboard?.historicInsights;
  }, [dashboard]);

  // const maxAndMinAmount = useMemo(() => {
  //   const maxAmount = Math.max(
  //     ...(historicInsights || []).map(
  //       (insight) => insight?.paymentsAmount || 0
  //     ),
  //     ...(historicInsights || []).map((insight) => insight?.receiptsAmount || 0)
  //   );
  //   const minAmount = Math.min(
  //     ...(historicInsights || []).map(
  //       (insight) => insight?.paymentsAmount || 0
  //     ),
  //     ...(historicInsights || []).map((insight) => insight?.receiptsAmount || 0)
  //   );

  //   return { maxAmount, minAmount };
  // }, [historicInsights]);

  const totalPaymentsAmount = useMemo(() => {
    return historicInsights?.reduce(
      (total, insight) => total + Number(insight?.paymentsAmount),
      0
    );
  }, [historicInsights]);

  const totalReceiptsAmount = useMemo(() => {
    return historicInsights?.reduce(
      (total, insight) => total + Number(insight?.receiptsAmount),
      0
    );
  }, [historicInsights]);

  const proft = useMemo(() => {
    if (!isNumber(totalReceiptsAmount) || !isNumber(totalPaymentsAmount)) {
      return undefined;
    }
    return totalReceiptsAmount! - totalPaymentsAmount!;
  }, [totalReceiptsAmount, totalPaymentsAmount]);

  const colsCategories = useMemo<IColmunDataTable<CategoryInsights>[]>(() => {
    return [
      {
        field: "name",
        label: "Name",
        onParse: (category) => (
          <Link
            className="hover:underline"
            href={`/categories?categoryId=${category?.id}`}
          >
            {category?.iconName} {category?.name!}
          </Link>
        ),
      },
      {
        field: "amount",
        label: "Amount",
        onParse: (category) => getCurrencyFormat(category?.amount!),
      },
      { field: "count", label: "Payments" },
      {
        field: "actions",
        label: "",
        onParse: (category) => (
          <div className="flex justify-end">
            <Link href={`/categories?categoryId=${category?.id}`}>
              <IconButton
                variantStyle="dark-ghost"
                icon={<IoEyeOutline className="text-lg" />}
              />
            </Link>
          </div>
        ),
      },
    ];
  }, []);

  if (isLoadingDashboard) {
    return (
      <Card.Root>
        <FeedBackLoading />
      </Card.Root>
    );
  }

  if (dashboardError) {
    return (
      <Card.Root>
        <Card.Body>
          <FeedBackError onTryAgain={refetchDashboard} />
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {Number(totalPaymentsAmount) > 0 && (
        <CardStats.Root className="col-span-12 md:col-span-4">
          <CardStats.Header icon={<TbCurrencyReal />}>
            Total paid expenses amount
          </CardStats.Header>
          <CardStats.Body>
            <span className="text-lg md:text-2xl font-bold">
              {getCurrencyFormat(totalPaymentsAmount!)}
            </span>
          </CardStats.Body>
        </CardStats.Root>
      )}

      {Number(totalReceiptsAmount) > 0 && (
        <CardStats.Root className="col-span-12 md:col-span-4">
          <CardStats.Header icon={<TbCurrencyReal />}>
            Total receipts amount
          </CardStats.Header>
          <CardStats.Body>
            <span className="text-lg md:text-2xl font-bold">
              {getCurrencyFormat(totalReceiptsAmount!)}
            </span>
          </CardStats.Body>
        </CardStats.Root>
      )}

      {isNumber(proft) && (
        <CardStats.Root className="col-span-12 md:col-span-4">
          <CardStats.Header icon={<TbCurrencyReal />}>Balance</CardStats.Header>
          <CardStats.Body>
            <span
              className={twMerge(
                "inline-flex items-center text-lg md:text-2xl font-bold gap-1",
                proft! > 0 && "text-success",
                proft! < 0 && "text-danger"
              )}
            >
              {proft! > 0 && <FaLongArrowAltUp className="text-xl" />}
              {proft! < 0 && (
                <FaLongArrowAltUp className="text-xl rotate-180" />
              )}
              {getCurrencyFormat(proft!)}
            </span>
          </CardStats.Body>
        </CardStats.Root>
      )}

      {paidCreditCardExpensesInsights && (
        <CardStats.Root className="col-span-12 md:col-span-6">
          <CardStats.Header icon={<IoPieChartOutline />}>
            Total Paid Credit Card expenses amount
          </CardStats.Header>
          <CardStats.Body>
            <PieChart
              data={paidCreditCardExpensesInsights?.map((insight) => ({
                amount: insight?.amount,
                name: insight?.name,
                fill: insight?.color,
              }))}
            />
          </CardStats.Body>
        </CardStats.Root>
      )}
      {oweCreditCardExpensesInsights && (
        <CardStats.Root className="col-span-12 md:col-span-6">
          <CardStats.Header icon={<IoPieChartOutline />}>
            Total Owe Credit Card expenses amount
          </CardStats.Header>
          <CardStats.Body>
            <PieChart
              data={oweCreditCardExpensesInsights?.map((insight) => ({
                amount: insight?.amount,
                name: insight?.name,
                fill: insight?.color,
              }))}
            />
          </CardStats.Body>
        </CardStats.Root>
      )}

      {historicInsights && (
        <CardStats.Root className="col-span-12">
          <CardStats.Header icon={<BsGraphUp />}>
            Historics Insights
          </CardStats.Header>
          <CardStats.Body>
            <LineChart
              data={
                historicInsights?.map((insight) => ({
                  "Receipts Amount": insight?.receiptsAmount,
                  "Payments Amount": insight?.paymentsAmount,
                  Balance: Number(
                    insight?.receiptsAmount - insight?.paymentsAmount
                  ).toFixed(2),
                  name: insight?.name,
                })) || []
              }
              lineDataKeys={[
                {
                  name: "Receipts Amount",
                  color: assets.colors.success.DEFAULT,
                },
                {
                  name: "Payments Amount",
                  color: assets.colors.danger.DEFAULT,
                },
              ]}
              xAxisDataKey="name"
            />
          </CardStats.Body>
        </CardStats.Root>
      )}
      <div className="col-span-12">
        <DataTable
          columns={colsCategories}
          data={categoryInsights}
          isLoading={isLoadingDashboard || !categoryInsights}
        />
      </div>
    </div>
  );
}
