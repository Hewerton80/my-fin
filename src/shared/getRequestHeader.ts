import { getCurretToken } from "@/lib/cookie";

export const getRequestHeaders = () => {
  const token = getCurretToken();
  console.log({ token });
  return { Authorization: `Bearer ${token}` };
};
