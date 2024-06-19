"use client";

import { Card } from "@/components/ui/cards/Card";
import { CardStats } from "@/components/ui/cards/CardStats";
import { useGetInsights } from "@/modules/dashboard/hooks/useGetInsights";
import { getCurrencyFormat } from "@/shared/getCurrencyFormat";
import { MdPayment } from "react-icons/md";
import { TbCurrencyReal } from "react-icons/tb";

export default function HomePage() {
  const { insights, isLoadingInsights, refetchInsights } = useGetInsights();
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Dashboard</Card.Title>
      </Card.Header>
      <Card.Body asChild>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Number(insights?._sum?.amount) > 0 && (
            <CardStats.Root>
              <CardStats.Header icon={<TbCurrencyReal />}>
                Total Amount
              </CardStats.Header>
              <CardStats.Body>
                <span className="text-2xl font-bold">
                  {getCurrencyFormat(insights?._sum?.amount!)}
                </span>
              </CardStats.Body>
            </CardStats.Root>
          )}

          {Number(insights?._count) > 0 && (
            <CardStats.Root>
              <CardStats.Header icon={<MdPayment />}>
                Total paymants
              </CardStats.Header>
              <CardStats.Body>
                <span className="text-2xl font-bold">{insights?._count}</span>
              </CardStats.Body>
            </CardStats.Root>
          )}
        </div>
      </Card.Body>
    </Card.Root>
  );
}
