import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export function Skeleton({
  className,
  ...restProps
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={twMerge("animate-pulse rounded-lg bg-gray-600", className)}
      {...restProps}
    />
  );
}
