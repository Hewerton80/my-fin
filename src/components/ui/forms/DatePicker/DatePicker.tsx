import { format } from "date-fns";
import { Popover } from "../../overlay/Popover/Popover";
import { twMerge } from "tailwind-merge";
import { Button } from "../../buttons/Button";
import { Calendar } from "../Calendar";
import { CiCalendar } from "react-icons/ci";
import { forwardRef } from "react";
import { FormLabel } from "../FormLabel";
import { FormHelperText } from "../FormHelperText";

interface DatePickerProps {
  id?: string;
  date?: Date;
  label?: string;
  required?: boolean;
  error?: string;
  onChange?: (date?: Date) => void;
}

export const DatePicker = forwardRef(
  ({ required, id, label, error, date, onChange }: DatePickerProps) => {
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
              variantStyle="outline"
              leftIcon={<CiCalendar className="h-4 w-4" />}
              className={twMerge(
                "max-w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-danger"
              )}
            >
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={onChange} />
          </Popover.Content>
        </Popover.Root>
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
