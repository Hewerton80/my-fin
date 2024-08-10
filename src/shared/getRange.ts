export const getRange = (startIndex: number, endIndex: number) => {
  return Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );
};
