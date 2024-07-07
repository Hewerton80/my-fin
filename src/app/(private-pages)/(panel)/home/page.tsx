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
import { Insights } from "@/modules/dashboard/types";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { useMemo } from "react";
import { MdPayment } from "react-icons/md";
import { TbCurrencyReal } from "react-icons/tb";
import { CiCreditCard1 } from "react-icons/ci";

export default function HomePage() {
  const { dashboard, isLoadingDashboard, dashboardError, refetchDashboard } =
    useGetDashboard();

  const insights = useMemo(() => {
    return dashboard?.insights;
  }, [dashboard]);

  const creditCardInsights = useMemo(() => {
    return dashboard?.creditCardInsights;
  }, [dashboard]);

  const totalAmount = useMemo(() => {
    return insights?.reduce(
      (total, insight) => total + Number(insight?.amount),
      0
    );
  }, [insights]);

  const totalPayments = useMemo(() => {
    return insights?.reduce(
      (total, insight) => total + Number(insight?.count),
      0
    );
  }, [insights]);

  const colsCategories = useMemo<IColmunDataTable<Insights>[]>(() => {
    return [
      { field: "name", label: "Name" },
      {
        field: "amount",
        label: "Amount",
        onParse: (insight) => getCurrencyFormat(insight?.amount!),
      },
      { field: "count", label: "Payments" },
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
        <FeedBackError onTryAgain={refetchDashboard} />
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
              <CardStats.Header icon={<CiCreditCard1 />}>
                CreditCard Insights
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
          <div className="col-span-12">
            <DataTable
              columns={colsCategories}
              data={insights}
              isLoading={isLoadingDashboard || !insights}
            />
          </div>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
