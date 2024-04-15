"use client";
import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

interface TableContainerProps extends ComponentPropsWithRef<"div"> {}
interface TableProps extends ComponentPropsWithRef<"table"> {}
interface TbodyProps extends ComponentPropsWithRef<"tbody"> {}
interface TheadProps extends ComponentPropsWithRef<"thead"> {}
interface ThProps extends ComponentPropsWithRef<"th"> {}
interface TrProps extends ComponentPropsWithRef<"tr"> {}
interface TdProps extends ComponentPropsWithRef<"td"> {}

function Table({ children, className, ...restProps }: TableProps) {
  return (
    <table className={twMerge("w-full text-sm")} {...restProps}>
      {children}
    </table>
  );
}

function TableContainer({
  className,
  children,
  ...restProps
}: TableContainerProps) {
  return (
    <div className="rounded-md overflow-hidden border border-border dark:border-dark-border">
      <div
        className={twMerge(
          "flex w-full overflow-x-auto custom-scroll ",
          className
        )}
        {...restProps}
      >
        {children}
      </div>
    </div>
  );
}

function Thead({ children, className, ...restProps }: TheadProps) {
  return (
    <thead
      className={twMerge(
        // "text-black dark:text-white font-bold border-b border-b-border",
        "text-xs text-muted-foreground",
        className
      )}
      {...restProps}
    >
      {children}
    </thead>
  );
}

function Th({ children, className, ...restProps }: ThProps) {
  return (
    <th
      className={twMerge(
        "align-middle font-medium h-10 px-2 border-border dark:border-dark-border border-b",
        className
      )}
      {...restProps}
    >
      <div className="flex items-start">{children}</div>
    </th>
  );
}

function Tr({ children, className, ...restProps }: TrProps) {
  return (
    <tr
      className={twMerge(
        // "[tbody>&]:odd:bg-row-table [tbody>&]:odd:dark:bg-transparent ",
        // "border-b border-b-border dark:border-b-body-text",
        // "border-b border-border",
        className
      )}
      {...restProps}
    >
      {children}
    </tr>
  );
}

function Tbody({ children, className, ...restProps }: TbodyProps) {
  return (
    <tbody
      className={twMerge(
        "[&_tr+tr_td]:border-t",
        "font-normal text-sm",
        className
      )}
      {...restProps}
    >
      {children}
    </tbody>
  );
}

function Td({ children, className, ...restProps }: TdProps) {
  return (
    <td
      className={twMerge(
        "p-2 border-border dark:border-dark-border",
        className
      )}
      {...restProps}
    >
      {children}
    </td>
  );
}

Table.Container = TableContainer;
Table.Head = Thead;
Table.HeadCell = Th;
Table.Roll = Tr;
Table.Body = Tbody;
Table.Data = Td;

export { Table };
