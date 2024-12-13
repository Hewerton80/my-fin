const firstYear = 2024;
const nextYear = new Date().getFullYear() + 1;

export const yearOptions = Array.from(
  { length: nextYear - firstYear + 1 },
  (_, i) => {
    const year = firstYear + i;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  }
);
