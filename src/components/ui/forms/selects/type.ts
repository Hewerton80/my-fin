import { ReactNode } from "react";

export interface SelectOption {
  value?: string;
  label: string;
  icon?: ReactNode;
  options?: SelectOption[];
}

// export type SigleValueSelectOption = SingleValue<SelectOption>;

// export type OnchangeSigleValue = (newValue: SigleValueSelectOption) => void;

export type OnchangeMultValue = (
  newValue: SelectOption[],
  actionMeta: any
) => void;
