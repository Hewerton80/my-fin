import { forwardRef, ReactNode, useMemo, useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { LuSearch } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "../../FormLabel";
import { FormHelperText } from "../../FormHelperText";
import { Spinner } from "@/components/ui/feedback/Spinner";
import { Input } from "../../inputs/Input";
import { PickerPrimitive } from "./PickerPrimitive";

export type PickerOption = {
  value: string;
  label: ReactNode;
  subOptions?: PickerOption[];
};

interface SelectProps
  extends Omit<SelectPrimitive.SelectProps, "onValueChange" | "children"> {
  id?: string;
  placeholder?: string;
  options?: PickerOption[];
  isLoading?: boolean;
  isSearchable?: boolean;
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Picker = forwardRef(
  (
    {
      placeholder = "Select...",
      options = [],
      isLoading,
      label,
      error,
      required,
      isSearchable,
      value,
      onBlur,
      onFocus,
      onChange,
      ...restProps
    }: SelectProps,
    ref?: any
  ) => {
    const [searchValue, setSearchValue] = useState("");

    const filterdOptions = useMemo(() => {
      if (!searchValue.trim()) return options;

      let optionsTmp = [...options];

      optionsTmp = optionsTmp.filter(({ ...option }) => {
        if (option?.subOptions) {
          return option.subOptions.some((subOption) =>
            subOption?.label
              ?.toString()
              ?.toLowerCase()
              ?.includes(searchValue.toLowerCase())
          );
        }
        return option?.label
          ?.toString()
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase());
      });
      console.log(optionsTmp);
      return optionsTmp;
    }, [options, searchValue]);

    const handledOptionsElement = useMemo(() => {
      return filterdOptions.map((option) => {
        if (option?.subOptions) {
          return (
            <SelectPrimitive.Group key={option.value}>
              <PickerPrimitive.Label>{option.label}</PickerPrimitive.Label>
              {option?.subOptions?.map((subOption) => (
                <PickerPrimitive.Item
                  key={subOption.value}
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
    }, [filterdOptions]);

    return (
      <div className={twMerge("flex flex-col w-full")}>
        {label && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        <SelectPrimitive.Root
          // open
          value={value}
          required={required}
          onValueChange={onChange}
          {...restProps}
        >
          <PickerPrimitive.Trigger
            className={twMerge(!value && "text-muted-foreground")}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
          </PickerPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              ref={ref}
              className={twMerge(
                "relative z-[99999] max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover",
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
              {isSearchable && options?.length > 0 && (
                <div className="flex items-center border-b pr-3">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                    leftIcon={<LuSearch />}
                    inputClassName="border-none focus-visible:ring-0"
                  />
                </div>
              )}
              <SelectPrimitive.Viewport
                className={twMerge(
                  "p-1",
                  // position === "popper" &&
                  "h-[var(--radix-select-trigger-height)] w-full",
                  "min-w-[var(--radix-select-trigger-width)]"
                )}
              >
                {isLoading ? (
                  <div className="flex w-full justify-center">
                    <Spinner size={18} />
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
