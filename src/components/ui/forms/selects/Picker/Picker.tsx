import { forwardRef, useEffect, useMemo, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "../../FormLabel";
import { FormHelperText } from "../../FormHelperText";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { PickerPrimitive } from "./PickerPrimitive";

export type PickerOption = {
  value: string;
  label: string;
  subOptions?: PickerOption[];
};

interface SelectProps
  extends Omit<SelectPrimitive.SelectProps, "onValueChange" | "children"> {
  id?: string;
  placeholder?: string;
  options?: PickerOption[];
  isLoading?: boolean;
  label?: string;
  showLabelInner?: boolean;
  error?: string;
  full?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onOpen?: () => void;
}

export const Picker = forwardRef(
  (
    {
      placeholder = "Select...",
      options = [],
      full,
      isLoading,
      label,
      showLabelInner,
      error,
      required,
      value,
      onBlur,
      onFocus,
      onChange,
      onOpen,
      ...restProps
    }: SelectProps,
    ref?: any
  ) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (open) {
        onOpen?.();
      }
    }, [open, onOpen]);

    const handledOptionsElement = useMemo(() => {
      return options.map((option, i) => {
        if (option?.subOptions) {
          return (
            <SelectPrimitive.Group key={option.value + i}>
              <PickerPrimitive.Label>{option.label}</PickerPrimitive.Label>
              {option?.subOptions?.map((subOption, j) => (
                <PickerPrimitive.Item
                  key={subOption.value + option.value + j}
                  value={subOption.value}
                >
                  {subOption.label}
                </PickerPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          );
        }
        return (
          <PickerPrimitive.Item key={option.value} value={option.value}>
            {option.label}
          </PickerPrimitive.Item>
        );
      });
    }, [options]);

    return (
      <div className={twMerge("flex flex-col", full ? "w-full" : "w-fit")}>
        {label && !showLabelInner && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        <SelectPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          value={value}
          required={required}
          onValueChange={onChange}
          {...restProps}
        >
          <PickerPrimitive.Trigger
            className={twMerge(
              !value && "text-muted-foreground",
              full ? "w-full" : "w-max"
            )}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
          >
            {showLabelInner && label && (
              <span className={value && "mr-3"}>
                {label}
                {label && ":"}
              </span>
            )}
            <SelectPrimitive.Value
              placeholder={!showLabelInner ? placeholder : undefined}
            />
          </PickerPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              ref={ref}
              className={twMerge(
                "relative z-99999 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover",
                "text-popover-foreground shadow-md data-[state=open]:animate-in",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                "data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95",
                "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2",
                // position === "popper" &&
                // twMerge(
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
                "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
                // ),
              )}
              position="popper"
            >
              <PickerPrimitive.ScrollUpButton />
              <SelectPrimitive.Viewport
                className={twMerge(
                  "p-1",
                  // position === "popper" &&
                  "h-[var(--radix-select-trigger-height)] w-full",
                  "min-w-[var(--radix-select-trigger-width)]"
                )}
              >
                {isLoading ? (
                  <div className="flex w-full justify-center py-4">
                    <Spinner size={24} />
                  </div>
                ) : (
                  handledOptionsElement
                )}
              </SelectPrimitive.Viewport>
              <PickerPrimitive.ScrollDownButton />
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
