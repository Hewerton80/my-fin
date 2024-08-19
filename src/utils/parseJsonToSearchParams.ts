export const parseJsonToSearchParams = (json: any = {}) => {
  const keys = Object.keys(json);
  if (!keys?.length) {
    return "";
  }
  return (
    "?" +
    keys
      .map((key) => {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(String(json[key]))
        );
      })
      .join("&")
  );
};

export const removeEmptyKeys = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (!newObj[key]) {
      delete newObj[key];
    }
  });
  return newObj;
};
