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
            "flex gap-2",
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
        className="rounded-full relative border-2 border-primary size-4 bg-transparent"
        value={value}
        {...restProps}
      >
        <RadioGroup.Indicator
          className={twMerge(
            "rounded-full size-2 bg-primary",
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        />
      </RadioGroup.Item>
      {label && (
        <label
          className="text-sm font-medium text-dark-card dark:text-item"
          htmlFor={htmlFrom}
        >
          {label}
        </label>
      )}
    </div>
  );
}

const Radio = { Root, Item };

export { Radio };
