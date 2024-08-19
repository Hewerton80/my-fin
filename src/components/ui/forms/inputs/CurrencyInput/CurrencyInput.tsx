import { getCurrencyFormat } from "@/utils/getCurrencyFormat";
import { ChangeEvent, forwardRef, useCallback, useMemo } from "react";
import { Input, InputProps } from "../Input";
import { onlyNumbersMask } from "@/utils/mask";

interface CurrencyInputProps extends Omit<InputProps, "value" | "onChange"> {
  value?: number;
  onChange?: (value?: number) => void;
}

export const CurrencyInput = forwardRef(
  (
    {
      placeholder = "R$ 0.000,00",
      value,
      onChange,
      ...restProps
    }: CurrencyInputProps,
    ref?: any
  ) => {
    const handledValue = useMemo(() => {
      if (value === undefined) {
        return "";
      }
      return getCurrencyFormat(Number(value));
    }, [value]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange?.(
          value === "R$ 0,0" ? undefined : Number(onlyNumbersMask(value)) / 100
        );
      },
      [onChange]
    );

    return (
      <Input
        value={handledValue}
        onChange={handleChange}
        placeholder={placeholder}
        ref={ref}
        {...restProps}
      />
    );
  }
);
