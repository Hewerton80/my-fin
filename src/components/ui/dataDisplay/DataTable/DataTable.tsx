"use client";
import React, { ComponentPropsWithRef, ReactNode, useMemo } from "react";
import { Table } from "@/components/ui/dataDisplay/Table/Table";
import { FeedBackError } from "@/components/ui/feedback/FeedBackError";
import { TableSkeleton } from "@/components/ui/feedback/TableSkeleton";
import {
  PaginationBar,
  PaginationBarProps,
} from "@/components/ui/navigation/PaginationBar";

export interface IColmunDataTable<T = any> {
  field: keyof (T & { actions: string });
  label: ReactNode;
  onParse?: (value: T) => ReactNode;
}
export interface IRowDataTable {
  value: string;
  contents: ReactNode[];
}

export interface DataTableProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  columns: IColmunDataTable[];
  data?: any[];
  isError?: boolean;
  numSkeletonRows?: number;
  isLoading?: boolean;
  paginationConfig?: PaginationBarProps;
  onTryAgainIfError?: () => void;
}

export function DataTable({
  columns,
  data = [],
  isError,
  isLoading,
  numSkeletonRows = 15,
  paginationConfig,
  onTryAgainIfError,
  ...restProps
}: DataTableProps) {
  const handledDesktopData = useMemo(() => {
    return data?.map((cellData, i) => (
      <Table.Row key={`row-${i}`}>
        {columns.map((column, j) => (
          <Table.Data key={`row-${i}-column-${j}`}>
            {column?.onParse?.(cellData) || cellData?.[column.field] || ""}
          </Table.Data>
        ))}
      </Table.Row>
    ));
  }, [data, columns]);

  // const handledMobileData = useMemo(() => {
  //   return data?.map((cellData, i) => (
  //     <div className="flex flex-col text-xs py-2" key={`${i}-resposive`}>
  //       {columns.map((column, j) => (
  //         <div
  //           className="flex gap-1 p-1 odd:bg-muted/50 rounded-sm"
  //           key={`column-${i}-${j}-responsive`}
  //         >
  //           {columns[j].label && (
  //             <div className="font-bold">{columns[j].label}:</div>
  //           )}
  //           <div className="text-right ml-auto">
  //             {column?.onParse?.(cellData) || cellData?.[column.field] || ""}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   ));
  // }, [data, columns]);

  if (isError) {
    return <FeedBackError onTryAgain={onTryAgainIfError} />;
  }

  if (isLoading) {
    return <TableSkeleton columns={columns} numRows={numSkeletonRows} />;
  }

  return (
    <>
      <Table.Container className="flex flex-col" {...restProps}>
        <Table>
          <Table.Head>
            <Table.Row>
              {columns.map((col, i) => (
                <Table.HeadCell key={`col-${i}`}>{col.label}</Table.HeadCell>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>{handledDesktopData}</Table.Body>
        </Table>
        {data?.length === 0 && (
          <div className="flex justify-center items-center p-8">
            <h5 className="text-2xl text-gray-70">Tabela vazia</h5>
          </div>
        )}
      </Table.Container>
      {/* <div
        className="flex sm:hidden flex-col divide-y divide-border dark:divide-muted"
        role="table"
      >
        {handledMobileData}
      </div> */}
      {paginationConfig && Number(data?.length) > 0 && (
        <div className="flex w-full justify-end mt-4 sm:mt-8">
          <PaginationBar
            currentPage={paginationConfig?.currentPage}
            onChangePage={paginationConfig?.onChangePage}
            totalPages={paginationConfig?.totalPages}
            disabled={isLoading}
            perPage={paginationConfig?.perPage}
            totalRecords={paginationConfig?.totalRecords}
          />
        </div>
      )}
    </>
  );
}
