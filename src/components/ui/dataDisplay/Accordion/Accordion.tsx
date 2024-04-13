import * as RadixAccordion from "@radix-ui/react-accordion";
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FaChevronDown } from "react-icons/fa";

function AccordionRoot(props: ComponentProps<typeof RadixAccordion.Root>) {
  return <RadixAccordion.Root {...props} />;
}

const AccordionItem = forwardRef(
  (
    {
      children,
      className,
      ...props
    }: ComponentProps<typeof RadixAccordion.Item>,
    forwardedRef: any
  ) => (
    <RadixAccordion.Item
      className={twMerge("overflow-hidden", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </RadixAccordion.Item>
  )
);

const AccordionTrigger = forwardRef(
  (
    {
      children,
      className,
      ...props
    }: ComponentProps<typeof RadixAccordion.Trigger>,
    forwardedRef: any
  ) => (
    <RadixAccordion.Trigger
      className={twMerge("relative group", className)}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <FaChevronDown
        className={twMerge(
          "absolute right-4 top-1/2 -translate-y1/2 text-xs sm:text-base",
          "transition-transform duration-200 ease-linear group-data-[state=open]:rotate-180"
        )}
      />
    </RadixAccordion.Trigger>
  )
);

const AccordionContent = forwardRef(
  (
    {
      children,
      className,
      ...props
    }: ComponentProps<typeof RadixAccordion.Content>,
    forwardedRef: any
  ) => (
    <RadixAccordion.Content
      className={twMerge(
        "data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[15px] px-5">{children}</div>
    </RadixAccordion.Content>
  )
);

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
