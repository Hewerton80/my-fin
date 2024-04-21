"use client";
import React, { forwardRef } from "react";
import { PrimitiveSelect, PrimitiveSelectProps } from "./../PrimitiveSelect";
import { ActionMeta } from "react-select";
import { OnchangeMultValue, SelectOption } from "../type";

export interface MultSelectSelectProps
  extends Omit<
    PrimitiveSelectProps,
    "isMult" | "onChangeSingleOption" | "onChangeMultValue" | "value"
  > {
  onChange?: OnchangeMultValue;
  value?: SelectOption[];
}

export const MultSelect = forwardRef(
  (
    { onChange, isSearchable = true, ...restProps }: MultSelectSelectProps,
    ref?: any
  ) => {
    return (
      <PrimitiveSelect
        onChangeMultValue={onChange}
        isMulti
        isSearchable={isSearchable}
        ref={ref}
        {...restProps}
      />
    );
  }
);
