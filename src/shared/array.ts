export const removeElementsRepeated = (array: any[]) => {
  return array.filter((item, index) => array.indexOf(item) === index);
};
