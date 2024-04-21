"use client";
import React, { forwardRef, useMemo } from "react";
import { PrimitiveSelect, PrimitiveSelectProps } from "../PrimitiveSelect";
import { ActionMeta } from "react-select";
import { OnchangeMultValue, OnchangeSigleValue, SelectOption } from "../type";

export interface SelectSelectProps
  extends Omit<
    PrimitiveSelectProps,
    "isMult" | "onChangeSingleOption" | "onChangeMultValue" | "value"
  > {
  onChange?: OnchangeSigleValue;
  value?: string;
}

export const Select = forwardRef(
  (
    {
      onChange,
      value,
      placeholder = "Select",
      options = [],
      ...restProps
    }: SelectSelectProps,
    ref?: any
  ) => {
    const mapedObjectOptions = useMemo(() => {
      let mapedObjectOptionsTmp: { [key: string]: SelectOption } = {};
      options.forEach((option) => {
        if (option?.options) {
          option?.options.forEach((subOption) => {
            if (subOption.value) {
              mapedObjectOptionsTmp[subOption.value] = subOption;
            }
          });
        } else if (option?.value) {
          mapedObjectOptionsTmp[option.value] = option;
        }
      });
      return mapedObjectOptionsTmp;
    }, [options]);

    const handledValue = useMemo(() => {
      if (!value) {
        return undefined;
      }
      return mapedObjectOptions[value];
    }, [value, mapedObjectOptions]);

    return (
      <PrimitiveSelect
        value={handledValue}
        options={options}
        onChangeSingleOption={onChange}
        ref={ref}
        placeholder={placeholder}
        {...restProps}
      />
    );
  }
);
