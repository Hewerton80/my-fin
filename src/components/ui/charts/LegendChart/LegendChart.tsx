import { ComponentProps } from "react";
import { Legend } from "recharts";

export function LegendChart(props: ComponentProps<typeof Legend>) {
  const payload = props?.payload;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
      {payload?.map((data, i) => (
        <div key={`legend-chart-${i}`} className="flex gap-2">
          <span
            className="h-4 w-4 rounded-xs"
            style={{ backgroundColor: data?.color }}
          />
          <span className="text-xs">{data.value} </span>
        </div>
      ))}
    </div>
  );
}
