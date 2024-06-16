import {
  LineChart as LineChartRecharts,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import assets from "../../../../../assets.json";
interface LineChartProps {
  lineDaraKey: string;
  xAxisDataKey: string;
  data: any[];
}
import { Card } from "@/components/ui/cards/Card";

function CustomLabel(props: any) {
  return (
    <text
      className="fill-black dark:fill-light text-xs"
      x={props?.x}
      y={props?.y}
      dy={-4}
      // fill={props?.stroke}
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

export function LineChart({ data, lineDaraKey, xAxisDataKey }: LineChartProps) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minWidth={150}
      minHeight={150}
    >
      <LineChartRecharts
        data={data}
        margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
      >
        <XAxis
          dataKey={xAxisDataKey}
          tick={<CustomizedXAxisTick />}
          allowDataOverflow
        />
        <YAxis tick={<CustomizedYAxisTick />} />
        <Tooltip
          content={({ active, payload }) => {
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
          }}
        />
        <Line
          type="monotone"
          dataKey={lineDaraKey}
          stroke={assets.colors.primary}
          activeDot={{ r: 8 }}
          label={<CustomLabel />}
        />
      </LineChartRecharts>
    </ResponsiveContainer>
  );
}
