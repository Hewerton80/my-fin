import { getCurretToken, removeAllCookies } from "@/lib/cookie";
import axios from "axios";
import { useCallback, useEffect, useMemo } from "react";
import { useAlertModal } from "./useAlertModal";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/shared/constants";

export const useAxios = () => {
  const { showAlert } = useAlertModal();
  const router = useRouter();

  const apiBase = useMemo(
    () =>
      axios.create({
        baseURL: "/api",
        headers: {
          Authorization: `Bearer ${getCurretToken()}`,
        },
      }),
    []
  );

  const logout = useCallback(() => {
    router.replace("/auth/login?logout=true");
    removeAllCookies();
  }, [router]);

  useEffect(() => {
    apiBase.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const reponseError = error.response;
        if (reponseError.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiBase.interceptors.response.clear();
    };
  }, [apiBase, showAlert, logout]);

  return { apiBase };
};
