import { isString } from "./isType";

export const removeElementsRepeated = (array: any[]) => {
  return array.filter((item, index) => array.indexOf(item) === index);
};

export const sortObjectsByProperty = <T = any>({
  array,
  sortBy,
  order = "asc",
}: {
  array: T[];
  sortBy: keyof T;
  order?: "asc" | "desc";
}): T[] => {
  const verifyTypeAndHandle = (value: any) => {
    if (isString(value)) {
      return value.toLocaleLowerCase();
    }
    return value;
  };

  const result = array.slice().sort((a, b) => {
    return verifyTypeAndHandle(a?.[sortBy] as any) >
      verifyTypeAndHandle(b?.[sortBy] as any)
      ? 1
      : -1;
  });
  if (order === "desc") {
    result.reverse();
  }
  return result;
};
