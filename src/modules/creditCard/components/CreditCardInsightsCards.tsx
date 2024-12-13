import { CardStats } from "@/components/ui/cards/CardStats";
import { PieChart } from "@/components/ui/charts/PieChart/PieChart";
import { CreditCardInsights } from "@/modules/dashboard/types";
import { IoPieChartOutline } from "react-icons/io5";

interface CreditCardInsightsProps {
  paidCreditCardInsights?: CreditCardInsights[];
  oweCreditCardInsights?: CreditCardInsights[];
}
interface PaidCreditCardInsightsProps {
  paidCreditCardInsights?: CreditCardInsights[];
  className?: string;
}
interface OweCreditCardInsightsProps {
  oweCreditCardInsights?: CreditCardInsights[];
  className?: string;
}

function Paid({
  paidCreditCardInsights,
  className,
}: PaidCreditCardInsightsProps) {
  if (!paidCreditCardInsights?.length) return <></>;
  return (
    paidCreditCardInsights && (
      <CardStats.Root className={className}>
        <CardStats.Header icon={<IoPieChartOutline />}>
          Total Paid Credit Card expenses amount
        </CardStats.Header>
        <CardStats.Body>
          <PieChart
            data={paidCreditCardInsights?.map((insight) => ({
              amount: insight?.amount,
              name: insight?.name,
              fill: insight?.color,
            }))}
          />
        </CardStats.Body>
      </CardStats.Root>
    )
  );
}

function Owe({ oweCreditCardInsights, className }: OweCreditCardInsightsProps) {
  if (!oweCreditCardInsights?.length) return <></>;
  return (
    oweCreditCardInsights && (
      <CardStats.Root className={className}>
        <CardStats.Header icon={<IoPieChartOutline />}>
          Total Owe Credit Card expenses amount
        </CardStats.Header>
        <CardStats.Body>
          <PieChart
            data={oweCreditCardInsights?.map((insight) => ({
              amount: insight?.amount,
              name: insight?.name,
              fill: insight?.color,
            }))}
          />
        </CardStats.Body>
      </CardStats.Root>
    )
  );
}

export const CreditCardInsightsCards = { Paid, Owe };
