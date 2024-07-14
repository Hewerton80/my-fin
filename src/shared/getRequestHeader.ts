import { getCurretToken } from "@/lib/cookie";

export const getRequestHeaders = () => {
  const token = getCurretToken();
  return { Authorization: `Bearer ${token}` };
};
