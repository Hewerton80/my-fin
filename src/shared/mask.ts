export const onlyNumbersMask = (value: string) => {
  return (value || "").replace(/\D/g, "");
};
