export const handleErrorMessage = (error: any) => {
  return error?.response?.data?.message || error?.message;
};
