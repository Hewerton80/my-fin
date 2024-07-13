import { useCallback, useState } from "react";
import { CONSTANTS } from "@/shared/constants";
import { LoginCredentials } from "./types";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isLogging, setIsLogging] = useState(false);

  const {
    control: loginFormControl,
    handleSubmit,
    setError,
  } = useForm<LoginCredentials>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
  });

  const login = useCallback(
    async (loginCredentials: LoginCredentials) => {
      setIsLogging(true);
      try {
        const response = await signIn("credentials", {
          redirect: false,
          ...loginCredentials,
        });

        if (response?.error) {
          setError("email", { message: " " });
          setError("password", { message: response?.error });
        } else if (response?.ok) {
          router.replace("/home");
        }
      } catch (error) {
        setError("email", { message: " " });
        setError("password", {
          message: CONSTANTS.API_RESPONSE_MESSAGES.LOGIN_ERROR,
        });
      } finally {
        setIsLogging(false);
      }
    },
    [router, setError]
  );

  return { login: handleSubmit(login), loginFormControl, isLogging };
}
