import { ComponentProps, useMemo } from "react";
import { Card } from "../../cards/Card";
import { Pie, Tooltip, PieChart as PieChartRecharts } from "recharts";
import { ChartContainer } from "../ChartContainer";
import { getRandomRGBColor } from "@/shared/colors";

export interface PieChart {
  amount: number;
  name: string;
  fill?: string;
}
interface PieChartProps {
  data: PieChart[];
  dataKey: string;
}

const CustomTooltip = ({ active, payload }: ComponentProps<typeof Tooltip>) => {
  const tooltipLabel = useMemo(() => {
    if (active && payload?.[0]?.payload?.payload) {
      const data = payload?.[0]?.payload?.payload as PieChart & {
        fill: string;
      };
      return (
        <Card.Root className="p-1 flex-row" style={{ opacity: 1 }}>
          <div className="flex gap-2">
            <span
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: data?.fill }}
            />
            <span className="text-xs">{data.name} </span>
            <span className="text-xs ml-8">{data.amount} </span>
          </div>
        </Card.Root>
      );
    }
    return <></>;
  }, [active, payload]);

  return <>{tooltipLabel}</>;
};

export const PieChart = ({ data, dataKey }: PieChartProps) => {
  const dataWithFill = useMemo(() => {
    return data.map((item) => ({
      ...item,
      fill: item?.fill || getRandomRGBColor(),
    }));
  }, [data]);

  return (
    <ChartContainer
      // minWidth={300} minHeight={300}
      className="!min-w-[150px] !min-h-[150px] lg:!min-w-[300px]  lg:!min-h-[300px]"
    >
      <PieChartRecharts>
        <Tooltip content={<CustomTooltip />} />
        <Pie data={dataWithFill} dataKey={dataKey} label />
      </PieChartRecharts>
    </ChartContainer>
  );
};
