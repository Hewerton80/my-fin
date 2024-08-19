import axios from "axios";
import { useMemo } from "react";
import { axiosConfig } from "@/lib/axios";
import { useCookies } from "next-client-cookies";
import { CONSTANTS } from "@/utils/constants";

export const useAxios = () => {
  const cookies = useCookies();

  const apiBase = useMemo(
    () =>
      axios.create({
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          Authorization: `Bearer ${cookies.get(CONSTANTS.COOKIES_KEYS.TOKEN)}`,
        },
      }),
    [cookies]
  );
  return { apiBase };
};
