export const getRequestHeaders = (token: string) => {
  return { Authorization: `Bearer ${token}` };
};
