import { format } from "date-fns";

const monthsOptions: { label: string; value: string }[] = [];

let loopYear = 2023;
let loopMonth = 0;

const now = new Date();

const currentYear = now.getFullYear() + 1;
const currnetMonth = now.getMonth();

while (loopYear < currentYear || loopMonth <= currnetMonth) {
  const currentMonthDate = new Date(loopYear, loopMonth, 1);

  monthsOptions.push({
    value: format(currentMonthDate, "yyyy-MM-dd"),
    label: format(currentMonthDate, "MMM yyyy"),
  });

  if (loopMonth === 11) {
    loopMonth = 0;
    loopYear += 1;
  } else {
    loopMonth += 1;
  }
}
export { monthsOptions };
