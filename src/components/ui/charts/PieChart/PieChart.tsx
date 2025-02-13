import { ComponentProps, useMemo } from "react";
import { Card } from "../../cards/Card";
import { Pie, Tooltip, PieChart as PieChartRecharts, Legend } from "recharts";
import { ChartContainer } from "../ChartContainer";
import { getContrastColor, getRandomRGBColor } from "@/utils/colors";
import { getCurrencyFormat } from "@/utils/getCurrencyFormat";
import { twMerge } from "tailwind-merge";
import colors from "tailwindcss/colors";
import { LegendChart } from "../LegendChart/LegendChart";

export interface PieChart {
  amount: number;
  name: string;
  fill?: string;
}
interface PieChartProps {
  data: PieChart[];
  labelType?: "lined" | "default";
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
              className="h-4 w-4 rounded-xs"
              style={{ backgroundColor: data?.fill }}
            />
            <span className="text-xs">{data.name} </span>
            <span className="text-xs ml-8">
              {getCurrencyFormat(data?.amount)}
            </span>
          </div>
        </Card.Root>
      );
    }
    return <></>;
  }, [active, payload]);

  return <>{tooltipLabel}</>;
};
const CustomizedLabel = (props: any) => {
  // console.log(props);
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const data = payload?.payload as PieChart & { fill: string };

  return (
    <text
      className="text-[0.5rem] md:text-xs"
      x={x}
      y={y}
      fill={data?.fill ? getContrastColor(data?.fill) : colors.white}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {getCurrencyFormat(data?.amount)}
    </text>
  );
};

export const PieChart = ({ data, labelType = "lined" }: PieChartProps) => {
  const dataWithFill = useMemo(() => {
    return data.map((item) => ({
      ...item,
      fill: item?.fill || getRandomRGBColor(),
    }));
  }, [data]);

  return (
    <ChartContainer className="min-w-[150px]! min-h-[150px]! lg:min-w-[300px]!  lg:min-h-[300px]!">
      <PieChartRecharts>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={dataWithFill}
          dataKey="amount"
          label={
            labelType === "lined" ? (
              ({ x, y, payload, ...props }: any) => {
                return (
                  <text
                    x={x}
                    y={y}
                    className={twMerge(
                      "text-[0.5rem] md:text-xs font-bold fill-foreground"
                    )}
                  >
                    {getCurrencyFormat(payload?.payload?.amount)}
                  </text>
                );
              }
            ) : (
              <CustomizedLabel />
            )
          }
          labelLine={labelType === "lined"}
        />
        <Legend name="name" content={<LegendChart />} />
      </PieChartRecharts>
    </ChartContainer>
  );
};
