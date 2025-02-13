import { Card } from "@/components/ui/cards/Card";
import { CardStats } from "@/components/ui/cards/CardStats";
import { LineChart } from "@/components/ui/charts/LineChart";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { FeedBackLoading } from "@/components/ui/feedback/FeedBackLoading";
import { TransitionHistoryWitchConputedFields } from "@/modules/transitionHistory/types";
import { getCurrencyFormat } from "@/utils/getCurrencyFormat";
import { isNumber } from "@/utils/isType";
import { format } from "date-fns/format";
import { useMemo } from "react";
import { MdPayment } from "react-icons/md";
import { TbCurrencyReal } from "react-icons/tb";

interface CategoryInsightsProps {
  transitionsHistory?: TransitionHistoryWitchConputedFields[];
  isLoadingTransitionsHistory?: boolean;
  transitionsHistoryError?: any;
  refetchTransitionsHistory?: () => void;
}

export function CategoryInsights({
  transitionsHistory,
  isLoadingTransitionsHistory,
  transitionsHistoryError,
  refetchTransitionsHistory,
}: CategoryInsightsProps) {
  const parsedDataChart = useMemo(() => {
    return (
      transitionsHistory?.map((transitionHistory) => {
        const currentInstallment = transitionHistory?.currentInstallment;
        const totalInstallments = transitionHistory?.totalInstallments;
        const installmentsString =
          isNumber(currentInstallment) && isNumber(totalInstallments)
            ? ` ${currentInstallment}/${totalInstallments}`
            : "";
        return {
          date: format(new Date(transitionHistory?.paidAt!), "dd MMM"),
          description: `${transitionHistory?.name}${installmentsString}`,
          amount: transitionHistory?.amount,
        };
      }) || []
    );
  }, [transitionsHistory]);

  const total = useMemo<number>(() => {
    return (
      transitionsHistory?.reduce(
        (acc, transition) => acc + Number(transition?.amount) || 0,
        0
      ) || 0
    );
  }, [transitionsHistory]);

  const transitionsHistoryAgroupedByMonth = useMemo(() => {
    return transitionsHistory?.reduce((acc, transition) => {
      const month = format(new Date(transition?.paidAt!), "MMM");
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += Number(transition?.amount) || 0;
      acc[month] = Number(acc[month]?.toFixed(2)) || 0;
      return acc;
    }, {} as Record<string, number>);
  }, [transitionsHistory]);

  if (isLoadingTransitionsHistory) {
    return <FeedBackLoading />;
  }
  if (transitionsHistoryError) {
    return <FeedBackError onTryAgain={refetchTransitionsHistory} />;
  }
  if (!transitionsHistory || !transitionsHistory?.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardStats.Root>
          <CardStats.Header icon={<TbCurrencyReal />}>
            Total Amount
          </CardStats.Header>
          <CardStats.Body>
            <span className="text-2xl font-bold">
              {getCurrencyFormat(total)}
            </span>
          </CardStats.Body>
        </CardStats.Root>
        <CardStats.Root>
          <CardStats.Header icon={<MdPayment />}>
            Total paymants
          </CardStats.Header>
          <CardStats.Body>
            <span className="text-2xl font-bold">
              {transitionsHistory?.length}
            </span>
          </CardStats.Body>
        </CardStats.Root>
      </div>
      <Card.Root>
        <Card.Header>
          <Card.Title>Stats by day</Card.Title>
        </Card.Header>
        <Card.Body>
          <LineChart
            data={parsedDataChart}
            lineDataKeys={[{ name: "amount", color: "var(--color-primary)" }]}
            xAxisDataKey="date"
          />
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Stats by Month</Card.Title>
        </Card.Header>
        <Card.Body>
          <LineChart
            data={Object.entries(transitionsHistoryAgroupedByMonth || {}).map(
              ([date, amount]) => ({ date, amount })
            )}
            lineDataKeys={[{ name: "amount", color: "var(--color-primary)" }]}
            xAxisDataKey="date"
          />
        </Card.Body>
      </Card.Root>
    </>
  );
}
