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
import { MdPayment } from "react-icons/md";
import { TbCurrencyReal } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { capitalizeFisrtLetter } from "@/shared/string";
import { Frequency } from "@prisma/client";
import { LineChart } from "@/components/ui/charts/LineChart";
import { BsGraphUp } from "react-icons/bs";
import { IoPieChartOutline } from "react-icons/io5";
import { IconButton } from "@/components/ui/buttons/IconButton";

export default function HomePage() {
  const { dashboard, isLoadingDashboard, dashboardError, refetchDashboard } =
    useGetDashboard();

  const categoryInsights = useMemo(() => {
    return dashboard?.categoryInsights;
  }, [dashboard]);

  const creditCardInsights = useMemo(() => {
    return dashboard?.creditCardInsights;
  }, [dashboard]);

  const frequencyInsights = useMemo(() => {
    return dashboard?.frequencyInsights;
  }, [dashboard]);

  const historicInsights = useMemo(() => {
    return dashboard?.historicInsights;
  }, [dashboard]);

  const totalAmount = useMemo(() => {
    return categoryInsights?.reduce(
      (total, insight) => total + Number(insight?.amount),
      0
    );
  }, [categoryInsights]);

  const totalPayments = useMemo(() => {
    return categoryInsights?.reduce(
      (total, insight) => total + Number(insight?.count),
      0
    );
  }, [categoryInsights]);

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
                variantStyle="light-ghost"
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
    <Card.Root>
      <Card.Header>
        <Card.Title>Dashboard</Card.Title>
      </Card.Header>
      <Card.Body asChild>
        <div className="grid grid-cols-12 gap-4">
          {Number(totalAmount) > 0 && (
            <CardStats.Root className="col-span-12 md:col-span-4">
              <CardStats.Header icon={<TbCurrencyReal />}>
                {"Total expenses's amount"}
              </CardStats.Header>
              <CardStats.Body>
                <span className="text-lg md:text-2xl font-bold">
                  {getCurrencyFormat(totalAmount!)}
                </span>
              </CardStats.Body>
            </CardStats.Root>
          )}

          {Number(totalPayments) > 0 && (
            <CardStats.Root className="col-span-12 md:col-span-4">
              <CardStats.Header icon={<MdPayment />}>
                {"Total expenses's paymants"}
              </CardStats.Header>
              <CardStats.Body>
                <span className="text-lg md:text-2xl font-bold">
                  {totalPayments}
                </span>
              </CardStats.Body>
            </CardStats.Root>
          )}
          {creditCardInsights && (
            <CardStats.Root className="col-span-12 md:col-span-6">
              <CardStats.Header icon={<IoPieChartOutline />}>
                Credit Card
              </CardStats.Header>
              <CardStats.Body>
                <PieChart
                  data={creditCardInsights?.map((insight) => ({
                    amount: insight?.amount,
                    name: insight?.name,
                    fill: insight?.color,
                  }))}
                />
              </CardStats.Body>
            </CardStats.Root>
          )}
          {frequencyInsights && (
            <CardStats.Root className="col-span-12 md:col-span-6">
              <CardStats.Header icon={<IoPieChartOutline />}>
                Expense Frequency
              </CardStats.Header>
              <CardStats.Body>
                <PieChart
                  data={frequencyInsights?.map((insight) => ({
                    amount: insight?.amount,
                    name: capitalizeFisrtLetter(
                      insight?.name || Frequency.DO_NOT_REPEAT
                    ),
                  }))}
                />
              </CardStats.Body>
            </CardStats.Root>
          )}
          {historicInsights && (
            <CardStats.Root className="col-span-12">
              <CardStats.Header icon={<BsGraphUp />}>
                Paymants historics Insights
              </CardStats.Header>
              <CardStats.Body>
                <LineChart
                  data={
                    historicInsights?.map((insight) => ({
                      amount: insight?.amount,
                      count: insight?.count,
                      name: insight?.name,
                    })) || []
                  }
                  lineDaraKey="amount"
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
      </Card.Body>
    </Card.Root>
  );
}
