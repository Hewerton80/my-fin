import { getRange } from "@/shared/getRange";
import {
  DataTable,
  IColmunDataTable,
  IRowDataTable,
} from "@/components/ui/dataDisplay/DataTable";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { twMerge } from "tailwind-merge";
import { useMemo } from "react";

interface TableSkeletonProps {
  numRows: number;
  columns: IColmunDataTable[];
}

export function TableSkeleton({ numRows, columns }: TableSkeletonProps) {
  const handledColumns = useMemo<IColmunDataTable[]>(() => {
    return columns.map((column, i) => ({
      ...column,
      onParse: () => (
        <Skeleton
          key={`skeleton-cell-${i}`}
          className={twMerge(
            "h-4 max-w-[146px] w-full",
            i === 0 && "w-8 h-8 rounded-full"
          )}
        />
      ),
    }));
  }, [columns]);

  const data = useMemo(() => getRange(numRows), [numRows]);

  return <DataTable columns={handledColumns} data={data} />;
}
