"use client";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...restProps
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={twMerge("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: twMerge(
          "rounded-md hover:bg-accent hover:text-accent-foreground",
          "border flex items-center justify-center rouned-lg",
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: twMerge(
          "rounded-md h-9 w-9 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"
        ),
        day: twMerge(
          "hover:bg-accent hover:text-accent-foreground",
          "rounded-lg h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: twMerge(
          "rounded-md bg-dark text-dark-foreground hover:bg-dark",
          "hover:text-dark-foreground focus:bg-dark focus:text-dark-foreground"
        ),
        day_today: "bg-accent text-accent-foreground",
        day_outside: twMerge(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50",
          "aria-selected:text-muted-foreground aria-selected:opacity-30"
        ),
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <BsChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <BsChevronRight className="h-4 w-4" />,
      }}
      {...restProps}
    />
  );
}
