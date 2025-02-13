import { twMerge } from "tailwind-merge";

const className = twMerge(
  "after:absolute after:h-5 after:w-5 after:animate-spin",
  "after:rounded-full after:border-b-2 after:border-l-2 after:border-white"
);

export const spinnerStyle = {
  root: className,
};
