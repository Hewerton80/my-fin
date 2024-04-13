import React, { useCallback, forwardRef } from "react";
import ReactSelect, { MultiValue, PropsValue, SingleValue } from "react-select";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@/components/ui/feedback/Spinner";
import styled from "./Select.module.css";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";

export interface SelectOption {
  value?: string;
  label: string;
  options?: SelectOption[];
}

export type OnchangeSigleValue = (newValue: SingleValue<SelectOption>) => void;

export type OnchangeMultValue = (
  newValue: SelectOption[],
  actionMeta: any
) => void;

export interface SelectProps {
  selectClassName?: string;
  id?: string;
  error?: string;
  label?: string;
  formControlClassName?: string;
  options?: SelectOption[];
  value?: PropsValue<SelectOption> | null;
  isAutocomplite?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  inputValue?: string;
  placeholder?: string;
  isMulti?: boolean;
  required?: boolean;
  menuIsOpen?: boolean;
  isClariable?: boolean;
  controlShouldRenderValue?: boolean;
  hideSelectedOptions?: boolean;
  tabSelectsValue?: boolean;
  backspaceRemovesValue?: boolean;
  onChangeSingleOption?: OnchangeSigleValue;
  onChangeMultValue?: OnchangeMultValue;
  onInputChange?: (newValue: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export const Select = forwardRef(
  (
    {
      formControlClassName,
      error,
      label,
      disabled,
      selectClassName,
      isAutocomplite = false,
      options = [],
      isMulti,
      required,
      onChangeSingleOption,
      onChangeMultValue,
      placeholder = "Selecione...",
      ...restProps
    }: SelectProps,
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
          // menuIsOpen
          className={twMerge(
            styled.root,
            error && styled.error,
            selectClassName
          )}
          // formatOptionLabel={(option) => (
          //   <Badge variant="primary">{option.label}</Badge>
          // )}
          formatGroupLabel={(options) => (
            <>
              <span>{options.label}</span>
              <span>({options?.options?.length})</span>
            </>
          )}
          options={options}
          onChange={handleChange}
          isMulti={isMulti}
          isSearchable={isAutocomplite}
          noOptionsMessage={() => (
            <span className="text-primary-100 text-xs">
              Nenhum opção encontrada
            </span>
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
