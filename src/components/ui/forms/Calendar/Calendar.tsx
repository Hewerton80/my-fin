"use client";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../../buttons/IconButton";
import {
  getButtonVariantStyle,
  getRootButtonStyle,
} from "../../buttons/Button";

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...restProps
}: CalendarProps) {
  return <></>;
}
