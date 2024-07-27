import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Popover } from "../../overlay/Popover/Popover";
import { Button } from "../../buttons/Button";
import { CiCalendar } from "react-icons/ci";
import { twMerge } from "tailwind-merge";
import { Calendar } from "../Calendar";
import { FormLabel } from "../FormLabel";
import { FormHelperText } from "../FormHelperText";

interface DatePickerProps {
  id?: string;
  label?: string;
  error?: string;
  required?: boolean;
  rangeDate?: DateRange | undefined;
  onChange?: (date?: DateRange) => void;
}

export function DateRangePicker({
  id,
  label,
  rangeDate,
  required,
  error,
  onChange,
}: DatePickerProps) {
  return (
    <div className="flex flex-col w-fit">
      {label && (
        <FormLabel required={required} htmlFor={id}>
          {label}
        </FormLabel>
      )}
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            id="date"
            variantStyle="outline"
            leftIcon={<CiCalendar className="h-4 w-4" />}
            className={twMerge(
              "max-w-[300px] justify-start text-left font-normal",
              !rangeDate && "text-muted-foreground"
            )}
          >
            {rangeDate?.from ? (
              rangeDate.to ? (
                <>
                  {format(rangeDate.from, "LLL dd, y")} -{" "}
                  {format(rangeDate.to, "LLL dd, y")}
                </>
              ) : (
                format(rangeDate.from, "LLL dd, y")
              )
            ) : (
              "Pick a date"
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            defaultMonth={rangeDate?.from || undefined}
            mode="range"
            selected={rangeDate}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </Popover.Content>
      </Popover.Root>
      {error && <FormHelperText>{error}</FormHelperText>}
    </div>
  );
}
