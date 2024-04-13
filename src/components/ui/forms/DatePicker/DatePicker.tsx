// "use client";
// import { FormControl, FormControlProps } from "../FormControl";
// import { twMerge } from "tailwind-merge";
// import { Input, InputProps } from "@/components/ui/forms/Input";
// import {
//   ChangeEvent,
//   useCallback,
//   forwardRef,
//   Ref,
//   useState,
//   useMemo,
// } from "react";
// import { inputMasks } from "../masks";
// import * as Popover from "@radix-ui/react-popover";
// import { DayPicker } from "react-day-picker";
// import { ptBR } from "date-fns/locale";
// import { parse, format } from "date-fns";
// import { regex } from "@/utils/regex";
// import { CalendarIcon } from "@/components/icons/CalendarIcon";
// import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
// import assets from "../../../../../assets.json";

// interface DatePickerProps
//   extends Pick<FormControlProps, "error" | "label" | "id">,
//     Pick<InputProps, "disabled" | "value" | "onFocus" | "onBlur"> {
//   timePickerClassName?: string;
//   formControlClassName?: string;
//   onChange?: (value: string) => void;
// }

// export const DatePicker = forwardRef(
//   (
//     {
//       formControlClassName,
//       error,
//       label,
//       timePickerClassName,
//       disabled,
//       id,
//       value,
//       onChange,
//       onBlur,
//       onFocus,
//       ...restProps
//     }: DatePickerProps,
//     ref?: Ref<HTMLInputElement>
//   ) => {
//     const [showTimeOptions, setShowTimeOptions] = useState(false);

//     const selectedDate = useMemo(() => {
//       if (value?.match(regex.dateFormat)) {
//         return parse(value, "dd/MM/yyyy", new Date());
//       }
//     }, [value]);

//     const rightIcon = useMemo(() => {
//       return (
//         <Popover.Trigger
//           className={twMerge(!disabled && "cursor-pointer")}
//           asChild
//           disabled={disabled}
//         >
//           <CalendarIcon />
//         </Popover.Trigger>
//       );
//     }, [disabled]);

//     const handleChange = useCallback(
//       (e: ChangeEvent<HTMLInputElement>) => {
//         onChange?.(inputMasks.date.apply(e.target.value));
//       },
//       [onChange]
//     );

//     const handlePickDate = useCallback(
//       (date?: Date) => {
//         if (date) {
//           onChange?.(format(date, "dd/MM/yyyy"));
//         }
//       },
//       [onChange]
//     );

//     return (
//       <FormControl
//         className={twMerge(formControlClassName, "[&_.right-icon]:right-5")}
//         label={label}
//         labelStyle="fixed"
//         error={error}
//       >
//         <Popover.Root
//           open={showTimeOptions}
//           onOpenChange={(open) => !disabled && setShowTimeOptions(open)}
//         >
//           <Input
//             ref={ref}
//             placeholder={inputMasks.date.placeholder}
//             disabled={disabled}
//             rightIcon={rightIcon}
//             id={id}
//             onBlur={onBlur}
//             onFocus={onFocus}
//             value={value}
//             onChange={handleChange}
//             {...restProps}
//           />
//           <Popover.Portal>
//             <Popover.Content
//               asChild
//               sideOffset={22}
//               alignOffset={-18}
//               align="end"
//             >
//               <div className="z-50">
//                 <DayPicker
//                   mode="single"
//                   locale={ptBR}
//                   showOutsideDays
//                   selected={selectedDate}
//                   onSelect={handlePickDate}
//                   className={twMerge(
//                     "p-3 border-2 border-primary-100 rounded-lg bg-white"
//                   )}
//                   classNames={{
//                     months: twMerge(
//                       "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0"
//                     ),
//                     month: "space-y-4",
//                     caption: "flex justify-center pt-1 relative items-center",
//                     caption_label: "text-sm font-medium",
//                     nav: "space-x-1 flex items-center",
//                     nav_button: twMerge(
//                       // buttonVariants({ variant: "outline" }),
//                       "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//                     ),
//                     nav_button_previous: "absolute left-1",
//                     nav_button_next: "absolute right-1",
//                     table: "w-full border-collapse space-y-1",
//                     head_row: "flex",
//                     head_cell: "rounded-md w-9 font-bold text-sm",
//                     row: "flex w-full mt-2",
//                     cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//                     day: twMerge(
//                       // buttonVariants({ variant: "ghost" }),
//                       "text-gray-160",
//                       "flex justify-center items-center cursor-pointer hover:bg-primary-60",
//                       "hover:text-white rounded-md h-9 w-9 p-0 font-bold aria-selected:opacity-100"
//                     ),
//                     day_selected: twMerge(
//                       "!bg-primary-100 text-white hover:bg-primary-100 hover:text-white",
//                       "focus:bg-primary focus:text-white"
//                       // "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
//                     ),
//                     day_today: "bg-gray-40/40",
//                     day_outside: "text-gray-100 opacity-50",
//                     day_disabled: "text-muted-foreground opacity-50",
//                     day_range_middle:
//                       "aria-selected:bg-accent aria-selected:text-accent-foreground",
//                     day_hidden: "invisible",
//                     // ...classNames,
//                   }}
//                   components={{
//                     IconLeft: () => (
//                       <ChevronLeftIcon
//                         color={assets.colors.gray[130]}
//                         width={28}
//                         height={28}
//                       />
//                     ),
//                     IconRight: () => (
//                       <ChevronRightIcon
//                         color={assets.colors.gray[130]}
//                         width={28}
//                         height={28}
//                       />
//                     ),
//                   }}
//                   // {...props}
//                 />
//               </div>
//             </Popover.Content>
//           </Popover.Portal>
//         </Popover.Root>
//       </FormControl>
//     );
//   }
// );
