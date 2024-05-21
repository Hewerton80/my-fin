"use client";
import React, {
  forwardRef,
  ComponentPropsWithRef,
  useCallback,
  useState,
  Fragment,
} from "react";
import ReactSelect, {
  MultiValue,
  PropsValue,
  SingleValue,
  components,
} from "react-select";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@/components/ui/feedback/Spinner";
import styled from "./PrimitiveSelect.module.css";
import { FormLabel } from "@/components/ui/forms/FormLabel";
import { FormHelperText } from "@/components/ui/forms/FormHelperText";
import { OnchangeMultValue, OnchangeSigleValue, SelectOption } from "../type";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { CloseButton } from "@/components/ui/buttons/CloseButton";
import { Badge } from "@/components/ui/dataDisplay/Badge";
import menuStyle from "@/components/sharedStyles/menu.module.css";
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
  | "onFocus"
>;

export interface PrimitiveSelectProps extends MapedSelectProps {
  selectClassName?: string;
  error?: string;
  label?: string;
  formControlClassName?: string;
  menuIsOpen?: boolean;
  options?: SelectOption[];
  value?: PropsValue<SelectOption> | null;
  // onChange: (newValue: MultiValue<SelectOption>, actionMeta: any) => void;
  disabled?: boolean;
  inputValue?: string;
  subtitle?: string;
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
      isSearchable = false,
      subtitle,
      onChangeSingleOption,
      onChangeMultValue,
      ...restProps
    }: PrimitiveSelectProps,
    ref?: any
  ) => {
    const [_menuIsOpen, _setMenuIsOpen] = useState(false);

    const handleChange = useCallback(
      (
        newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
        actionMeta: any
      ) => {
        if (isMulti) {
          onChangeMultValue?.(newValue as SelectOption[], actionMeta);
        } else {
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
          ref={ref}
          onMenuOpen={() => _setMenuIsOpen(true)}
          menuIsOpen={_menuIsOpen}
          onMenuClose={() => _setMenuIsOpen(false)}
          required={required}
          placeholder={placeholder}
          classNamePrefix="select"
          isDisabled={disabled}
          closeMenuOnSelect={!isMulti}
          className={twMerge(
            styled.root,
            error && styled.error,
            selectClassName
          )}
          components={{
            IndicatorSeparator: () => null,
            // CrossIcon: () => <FaChevronDown className="text-red-500" />,
            // DownChevron: () => <FaChevronDown className="text-red-500" />,
            ClearIndicator: () => null,
            Menu: ({ children, ...restProps }) => (
              <components.Menu
                className={twMerge(menuStyle.root, "mt-1.5")}
                {...restProps}
              >
                {children}
              </components.Menu>
            ),
            MenuList: ({ children, ...restProps }) => (
              <components.MenuList
                className={twMerge(
                  "flex flex-col space-y-1 max-h-64 overflow-y-auto custom-scroll"
                )}
                {...restProps}
              >
                {children}
              </components.MenuList>
            ),

            Option: ({ children, isFocused, isSelected, ...restProps }) => (
              <components.Option
                {...restProps}
                className={twMerge(
                  menuStyle.item,
                  (isSelected || isFocused) && menuStyle["is-active"]
                )}
                isFocused={isFocused}
                isSelected={isSelected}
                getStyles={() => ({ fontSize: 14, padding: "6px 8px", gap: 0 })}
              >
                {children}
              </components.Option>
            ),
            GroupHeading: ({ children }) => (
              <div
                className={twMerge(
                  "text-muted-foreground px-2 text-xs mb-1 font-bold"
                )}
              >
                {children}
              </div>
            ),
            MultiValueContainer: ({ children }) => (
              <Badge variant="primary">{children}</Badge>
            ),
            MultiValueLabel: ({ children }) => <Fragment>{children}</Fragment>,
            MultiValueRemove: ({ innerProps }) => (
              <CloseButton
                {...innerProps}
                className={twMerge("ml-1", innerProps?.className)}
              />
            ),
            DropdownIndicator: () => (
              <span
                className={twMerge(
                  "text-sm dark:text-light text-dark-card/50 hover:text-primary",
                  "-translate-x-2"
                )}
              >
                {isSearchable ? (
                  <FaSearch />
                ) : (
                  <FaChevronDown
                    className={twMerge(_menuIsOpen && "rotate-180")}
                  />
                )}
              </span>
            ),
            NoOptionsMessage: () => (
              <div className="flex w-full justify-center ">
                <span className="text-sm text-dark-border dark:text-border">
                  No options available
                </span>
              </div>
            ),
          }}
          onChange={handleChange}
          // formatOptionLabel={(option) => (
          //   <Badge variant="info">{option.label}</Badge>
          // )}
          formatGroupLabel={(options) => (
            <>
              <span>{options.label}</span>
              <span> ({options?.options?.length})</span>
            </>
          )}
          isMulti={isMulti}
          isSearchable={isSearchable}
          isLoading={isLoading}
          options={isLoading ? [] : options}
          formatOptionLabel={(option) => (
            <>
              {option?.icon && <span className="mr-1">{option?.icon}</span>}
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
        {subtitle && (
          <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    );
  }
);
