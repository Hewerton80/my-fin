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
    <div className="rounded-md overflow-hidden border">
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
    <thead className={twMerge("text-xs", className)} {...restProps}>
      {children}
    </thead>
  );
}

function Th({ children, className, ...restProps }: ThProps) {
  return (
    <th
      className={twMerge(
        "align-middle font-medium h-10 px-2 text-muted-foreground border-b",
        className
      )}
      {...restProps}
    >
      <div className="flex items-start">{children}</div>
    </th>
  );
}

function Tr({ children, ...restProps }: TrProps) {
  return <tr {...restProps}>{children}</tr>;
}

function Tbody({ children, className, ...restProps }: TbodyProps) {
  return (
    <tbody
      className={twMerge(
        "[&_tr+tr_td]:border-t font-normal text-sm",
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
    <td className={twMerge("p-2", className)} {...restProps}>
      {children}
    </td>
  );
}

Table.Container = TableContainer;
Table.Head = Thead;
Table.HeadCell = Th;
Table.Row = Tr;
Table.Body = Tbody;
Table.Data = Td;

export { Table };
