import { ReactNode, ComponentPropsWithRef, forwardRef } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { twMerge } from "tailwind-merge";
import { FormLabel } from "../FormLabel";
import { FormHelperText } from "../FormHelperText";

interface RadioRootProps extends ComponentPropsWithRef<typeof RadioGroup.Root> {
  children: ReactNode;
  formControlClassName?: string;
  label?: string;
  error?: string;
  required?: boolean;
}
interface RadioItemProps {
  id?: string;
  label?: string;
  value: string;
  disabled?: boolean;
}

const Root = forwardRef(
  (
    {
      children,
      formControlClassName,
      orientation = "horizontal",
      label,
      error,
      required,
      ...restProps
    }: RadioRootProps,
    ref?: any
  ) => {
    return (
      <div className={twMerge("flex flex-col w-full", formControlClassName)}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <RadioGroup.Root
          ref={ref}
          className={twMerge(
            "flex flex-wrap gap-2",
            orientation === "vertical" && "flex-col",
            error && "[&_button]:border-danger"
          )}
          {...restProps}
        >
          {children}
        </RadioGroup.Root>
        {error && <FormHelperText>{error}</FormHelperText>}
      </div>
    );
  }
);

function Item({ label, id, value, ...restProps }: RadioItemProps) {
  const htmlFrom = id || value;
  return (
    <div className="flex items-center space-x-2">
      <RadioGroup.Item
        id={htmlFrom}
        className={twMerge(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary",
          "ring-offset-background focus:outline-hidden focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          "disabled:opacity-50"
        )}
        value={value}
        {...restProps}
      >
        <RadioGroup.Indicator className="flex items-center justify-center">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </RadioGroup.Indicator>
      </RadioGroup.Item>
      {label && (
        <label className="text-sm font-medium" htmlFor={htmlFrom}>
          {label}
        </label>
      )}
    </div>
  );
}

const Radio = { Root, Item };

export { Radio };
