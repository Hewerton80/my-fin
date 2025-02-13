import { ComponentProps, useMemo } from "react";
import {
  Tooltip,
  LineChart as LineChartRecharts,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/cards/Card";
import { ChartContainer } from "../ChartContainer";
import { LegendChart } from "../LegendChart/LegendChart";

interface LineChartProps {
  lineDataKeys: { name: string; color: string }[];
  xAxisDataKey: string;
  yAxisRange?: [number, number];
  data: any[];
}

const CustomTooltip = ({ active, payload }: ComponentProps<typeof Tooltip>) => {
  if (active && payload?.[0]?.payload) {
    const data = payload?.[0]?.payload;
    return (
      <Card.Root className="p-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <span className="text-xs">{key}: </span>
            <span className="text-xs font-bold">{String(value)}</span>
          </div>
        ))}
      </Card.Root>
    );
  }
  return <></>;
};

function CustomLabel(props: any) {
  return (
    <text
      className="fill-foreground text-xs"
      x={props?.x}
      y={props?.y}
      dy={-4}
      textAnchor="middle"
    >
      {props?.value}
    </text>
  );
}

function CustomizedXAxisTick(props: any) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        className="text-xs dark:fill-muted-foreground fill-black -rotate-[35deg]"
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
      >
        {payload.value}
      </text>
    </g>
  );
}
function CustomizedYAxisTick(props: any) {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        className="text-xs dark:fill-muted-foreground fill-black"
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
      >
        {payload.value}
      </text>
    </g>
  );
}

export function LineChart({
  data,
  lineDataKeys,
  xAxisDataKey,
  yAxisRange,
}: LineChartProps) {
  const lineDataKeysMemo = useMemo(() => {
    return lineDataKeys.map(({ color, name }) => (
      <Line
        key={name}
        type="monotone"
        dataKey={name}
        stroke={color}
        activeDot={{ r: 8 }}
        label={<CustomLabel />}
      />
    ));
  }, [lineDataKeys]);
  return (
    <ChartContainer className="min-h-[450px]!">
      <LineChartRecharts
        data={data}
        margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
        width={500}
        height={300}
      >
        <XAxis
          dataKey={xAxisDataKey}
          tick={<CustomizedXAxisTick />}
          allowDataOverflow
        />
        <YAxis range={yAxisRange} tick={<CustomizedYAxisTick />} />
        <Tooltip content={<CustomTooltip />} />
        {lineDataKeysMemo}
        <Legend name="name" content={<LegendChart />} />
      </LineChartRecharts>
    </ChartContainer>
  );
}
