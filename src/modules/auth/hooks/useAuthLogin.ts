import { useForm } from "react-hook-form";
import { LoginCredentials } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "../schemas";
import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/shared/constants";
import { handleErrorMessage } from "@/shared/handleErrorMessage";
import { useCookies } from "next-client-cookies";
import { useGetLoggedUser } from "./useGetLoggedUser";

export function useAuthLogin() {
  const { apiBase } = useAxios();
  const cookies = useCookies();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setContextLoggedUser } = useGetLoggedUser();

  const {
    control: loginFormControl,
    formState,
    handleSubmit,
    trigger,
    getValues,
    setError,
  } = useForm<LoginCredentials>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const onLoginSuccess = useCallback(
    async (token: string) => {
      cookies.set(CONSTANTS.COOKIES_KEYS.TOKEN, token);
      router.replace("/home");
    },
    [router, cookies]
  );

  const {
    isPending,
    error,
    mutate: mutateLogin,
  } = useMutation({
    mutationFn: () =>
      apiBase.post<string>("/auth/login", getValues()).then((res) => res.data),
    onSuccess: onLoginSuccess,
  });

  const loginError = useMemo(() => error as any, [error]);

  useEffect(() => {
    if (!loginError) return;
    const statusCode = loginError?.response?.status;
    if (statusCode === 401) {
      setError("email", { message: " " });
      setError("password", { message: handleErrorMessage(loginError) });
    } else {
      setError("email", { message: " " });
      setError("password", { message: "Falha ao fazer login" });
    }
  }, [loginError, setError]);

  const isLogging = useMemo(
    () => isPending || formState.isValidating,
    [isPending, formState.isValidating]
  );

  const login = useCallback(async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    mutateLogin();
  }, [trigger, mutateLogin]);

  const logout = useCallback(() => {
    cookies.remove(CONSTANTS.COOKIES_KEYS.TOKEN);
    queryClient.clear();
    router.replace("/auth/login");
    setContextLoggedUser(null);
  }, [queryClient, cookies, router, setContextLoggedUser]);

  return { login: handleSubmit(login), logout, loginFormControl, isLogging };
}
