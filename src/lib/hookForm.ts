export const getOnlyDirtyFields = <T extends Record<string, any>>(
  formValues: T,
  dirtyFields: Record<string, boolean>
) => {
  const arrayDirtyFields = Object.keys(dirtyFields);
  return arrayDirtyFields.reduce((acc: Record<string, any>, field) => {
    const formValue = formValues[field];
    acc[field] = formValue === "" ? null : formValues[field];
    return acc;
  }, {});
};
