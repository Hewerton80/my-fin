"use client";
import { Button } from "@/components/ui/buttons/Button";
import { FaChevronDown } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import { Select, SelectOption } from "@/components/ui/forms/Select";
import { Input } from "@/components/ui/forms/Input";
import { twMerge } from "tailwind-merge";
import slideAndFade from "@/components/sharedStyles/slideAndFade.module.css";
import styled from "./Picker.module.css";
import { useCallback, useMemo, useState } from "react";
import { CloseButton } from "../../buttons/CloseButton";
import menuStyle from "@/components/sharedStyles/menu.module.css";

interface PickerProps {
  value?: string;
  label: string;
  options?: SelectOption[];
  onChange?: (value: string) => void;
  hideInput?: boolean;
  hideCloseButton?: boolean;
}

export function Picker({
  value,
  options,
  label,
  hideInput,
  hideCloseButton,
  onChange,
}: PickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const optionValuesKeysMapped = useMemo<{ [key: string]: string }>(() => {
    if (!Array.isArray(options)) {
      return {};
    }
    const optionValuesKeysMappedTmp: { [key: string]: string } = {};
    options.forEach((option) => {
      if (option?.value) {
        optionValuesKeysMappedTmp[option.value] = option.label;
      }
    });
    return optionValuesKeysMappedTmp;
  }, [options]);

  const filteredOptions = useMemo<SelectOption[]>(() => {
    if (!Array.isArray(options)) {
      return [];
    }
    if (!inputValue.trim()) {
      return options;
    }
    return options.filter((option) =>
      option?.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options]);

  const onSelectOption = useCallback(
    (newValue: string) => {
      setOpen(false);
      setInputValue("");
      if (value !== newValue) {
        onChange?.(newValue);
      }
    },
    [value, onChange]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          className="px-1 sm:px-2 text-sm"
          variantStyle="dark-ghost"
          rightIcon={<FaChevronDown />}
        >
          {label}
          {value && <>: {optionValuesKeysMapped[value]}</>}
          {value && !hideCloseButton && (
            <CloseButton onClick={() => onChange?.("")} className="ml-2" />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={4} align="start" asChild>
          <div
            className={twMerge(
              menuStyle.root,
              "origin-top-left border border-border py-2",
              "dark:border-dark-border dark:bg-dark-body",
              slideAndFade.root
            )}
          >
            {!hideInput && (
              <div className="flex px-2 pb-2 sm:px-4 sm:pb-4">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Filtrar..."
                />
              </div>
            )}
            <div className="flex">
              <Select
                selectClassName={styled.root}
                options={filteredOptions}
                onChangeSingleOption={(option) =>
                  onSelectOption(option?.value || "")
                }
                isAutocomplite
                menuIsOpen
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                tabSelectsValue={false}
                backspaceRemovesValue={false}
              />
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
