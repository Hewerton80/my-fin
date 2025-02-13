import { ComponentProps } from "react";
import { ResponsiveContainer } from "recharts";
import { twMerge } from "tailwind-merge";

export const ChartContainer = ({
  children,
  className,
  ...restProps
}: ComponentProps<typeof ResponsiveContainer>) => {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={twMerge(
        "min-w-[150px]! min-h-[150px]!",
        "[&_.recharts-surface]:overflow-visible",
        String(className)
      )}
      {...restProps}
    >
      {children}
    </ResponsiveContainer>
  );
};
