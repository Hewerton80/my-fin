export const isString = (value: any) => {
  return typeof value === "string";
};

export const isUndefined = (value: any) => {
  return typeof value === "undefined";
};

export const isNumber = (value: any) => {
  return typeof value === "number";
};

export const isBoolean = (value: any) => {
  return typeof value === "boolean";
};

export const isNull = (value: any) => {
  return value === null;
};

export const isNumberable = (value: any) => {
  return value && !isNaN(Number(value));
};
