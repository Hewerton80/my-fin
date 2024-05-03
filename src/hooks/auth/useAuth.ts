import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { z } from "zod";
import { ToZodObjectSchema } from "@/lib/zodHelpers";
import { LoginCredentials } from "@/dtos/loginCredentials";
import { useRouter } from "next/navigation";
import { useAxios } from "@/hooks/utils/useAxios";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserWithComputedFields } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { CONSTANTS } from "@/shared/constants";
import Cookies from "js-cookie";
import { removeAllCookies } from "@/lib/cookie";

interface IResponseLogin {
  token: string;
  user: UserWithComputedFields;
}

export const loginFormSchema = z.object<ToZodObjectSchema<LoginCredentials>>({
  email: z.string().min(1, { message: "Um email deve ser informado" }),
  password: z.string().min(1, { message: "Uma senha deve ser informada" }),
});

export function useAuth() {
  const router = useRouter();
  const { apiBase } = useAxios();

  const { loggedUser, setContextLoggedUser } = useAuthStore(
    useShallow((state) => state)
  );

  const isLogged = useMemo(() => Boolean(loggedUser), [loggedUser]);

  const onLoginSuccess = useCallback(
    async ({ user, token }: IResponseLogin) => {
      Cookies.set(CONSTANTS.COOKIES_KEYS.TOKEN, token);
      if (user?.roles?.includes("ADMIN")) {
        router.replace("/admin/users");
      } else if (user?.roles?.includes("TEACHER")) {
        router.replace("/teacher/students");
      } else {
        router.replace("/student/home");
      }
    },
    [router]
  );

  const {
    isPending: isLoging,
    error: error,
    mutate: login,
  } = useMutation({
    mutationFn: (loginCrentials: LoginCredentials) =>
      apiBase
        .post<IResponseLogin>("/auth/login", loginCrentials)
        .then((res) => res.data),
    onSuccess: onLoginSuccess,
  });

  const loginError = useMemo<any>(() => error, [error]);

  const logout = useCallback(() => {
    router.replace("/auth/login?logout=true");
    removeAllCookies();
  }, [router]);

  return {
    loggedUser,
    isLogged,
    isLoging,
    loginError,
    handleSetContextLoggedUser: setContextLoggedUser,
    login,
    logout,
  };
}
