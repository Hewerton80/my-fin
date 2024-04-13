import { Card, CardProps } from "@/components/ui/cards/Card";
import { isString } from "@/shared/isType";
import { twMerge } from "tailwind-merge";

const variants = {
  success: {
    bg: "bg-success",
    bgTransparent: "bg-success/20",
    text: "text-success",
  },
  info: {
    bg: "bg-info",
    bgTransparent: "bg-info/20",
    text: "text-info",
  },
  secondary: {
    bg: "bg-secondary",
    bgTransparent: "bg-secondary/20",
    text: "text-secondary",
  },
};

interface WidgetCardProps extends Omit<CardProps, "title"> {
  title: string | JSX.Element;
  description: string | JSX.Element;
  icon: JSX.Element;
  variant?: keyof typeof variants;
}

export function WidgetCard({
  title,
  description,
  icon,
  variant = "success",
  className,
  children,
  ...restProps
}: WidgetCardProps) {
  return (
    <Card.Root className={twMerge("relative", className)} {...restProps}>
      <Card.Body className="flex-row items-center gap-3 sm:gap-6">
        <span
          className={twMerge(
            "flex items-center justify-center rounded-full text-xl sm:text-4xl",
            "min-w-[2.5rem] min-h-[2.5rem] max-w-[2.5rem] max-h-[2.5rem]",
            "sm:min-w-[5rem] sm:min-h-[5rem] sm:max-w-[5rem] sm:max-h-[5rem]",
            variants[variant].bgTransparent,
            variants[variant].text
          )}
        >
          {icon}
        </span>
        <div className="flex flex-col w-full sm:gap-3">
          {isString(title) ? (
            <p className="text-xs sm:text-sm">{title}</p>
          ) : (
            title
          )}

          {isString(description) ? (
            <b className="text-black dark:text-light text-lg sm:text-[1.75rem] font-semibold">
              {description}
            </b>
          ) : (
            description
          )}
        </div>
      </Card.Body>
      <div
        className={twMerge(
          "absolute h-1 w-full bottom-0",
          variants[variant].bg
        )}
      />
    </Card.Root>
  );
}
