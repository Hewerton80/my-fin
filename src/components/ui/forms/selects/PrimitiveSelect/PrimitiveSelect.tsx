"use client";
import React, { forwardRef, ComponentPropsWithRef, useCallback } from "react";
import ReactSelect, { MultiValue, PropsValue, SingleValue } from "react-select";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@/components/ui/feedback/Spinner";
import styled from "./PrimitiveSelect.module.css";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";
import { OnchangeMultValue, OnchangeSigleValue, SelectOption } from "../type";

// export type SigleValueSelectOption = SingleValue<SelectOption>;

// export type OnchangeSigleValue = (newValue: SigleValueSelectOption) => void;

type MapedSelectProps = Pick<
  ComponentPropsWithRef<typeof ReactSelect>,
  | "isMulti"
  | "isClearable"
  | "controlShouldRenderValue"
  | "hideSelectedOptions"
  | "tabSelectsValue"
  | "backspaceRemovesValue"
  | "onBlur"
  | "autoFocus"
  | "inputValue"
  | "id"
  | "required"
  | "isSearchable"
  | "isLoading"
  | "placeholder"
  // | "onChange"
>;

export interface PrimitiveSelectProps extends MapedSelectProps {
  selectClassName?: string;
  error?: string;
  label?: string;
  formControlClassName?: string;
  options?: SelectOption[];
  value?: PropsValue<SelectOption> | null;
  // onChange: (newValue: MultiValue<SelectOption>, actionMeta: any) => void;
  disabled?: boolean;
  inputValue?: string;
  onChangeSingleOption?: OnchangeSigleValue;
  onChangeMultValue?: OnchangeMultValue;
  onInputChange?: (newValue: string) => void;
}

export const PrimitiveSelect = forwardRef(
  (
    {
      formControlClassName,
      error,
      label,
      disabled,
      selectClassName,
      options = [],
      isLoading,
      required,
      placeholder = "Search...",
      isMulti,
      onChangeSingleOption,
      onChangeMultValue,
      ...restProps
    }: PrimitiveSelectProps,
    ref?: any
  ) => {
    const handleChange = useCallback(
      (
        newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
        actionMeta: any
      ) => {
        if (isMulti) {
          onChangeMultValue?.(newValue as SelectOption[], actionMeta);
        } else {
          console.log({ newValue });
          onChangeSingleOption?.(newValue as SingleValue<SelectOption>);
        }
      },
      [isMulti, onChangeSingleOption, onChangeMultValue]
    );
    return (
      <div className={twMerge("flex flex-col w-full", formControlClassName)}>
        {label && (
          <FormLabel required={required} htmlFor={restProps?.id}>
            {label}
          </FormLabel>
        )}
        <ReactSelect
          required={required}
          placeholder={placeholder}
          classNamePrefix="select"
          isDisabled={disabled}
          className={twMerge(
            styled.root,
            error && styled.error,
            selectClassName
          )}
          onChange={handleChange}
          // formatOptionLabel={(option) => (
          //   <Badge variant="primary">{option.label}</Badge>
          // )}
          formatGroupLabel={(options) => (
            <>
              <span>{options.label}</span>
              <span>({options?.options?.length})</span>
            </>
          )}
          isMulti={isMulti}
          isLoading={isLoading}
          options={isLoading ? [] : options}
          noOptionsMessage={() => (
            <span className="text-sm">No options available</span>
          )}
          formatOptionLabel={(option) => (
            <>
              {option?.icon && <span className="mr-2">{option?.icon}</span>}
              {option.label}
            </>
          )}
          loadingMessage={() => (
            <div className="flex w-full justify-center">
              <Spinner size={18} />
            </div>
          )}
          {...restProps}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);
