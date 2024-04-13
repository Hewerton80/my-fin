"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import styled from "./side.module.css";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/buttons/Button";
import { useAuth, loginFormSchema } from "@/hooks/api/useAuth";
import { useCallback, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginCredentials } from "@/dtos/loginCredentials";
import { handleErrorMessage } from "@/shared/handleErrorMessage";
import { useParams, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { login, loginError, isLoging, handleSetContextLoggedUser } = useAuth();

  const { control, handleSubmit, setError, clearErrors } =
    useForm<LoginCredentials>({
      defaultValues: { email: "", password: "" },
      resolver: zodResolver(loginFormSchema),
      mode: "onSubmit",
    });

  useEffect(() => {
    console.log({ searchParams: searchParams.get("logout") });
    if (searchParams.get("logout")) {
      handleSetContextLoggedUser(null);
    }
  }, [searchParams, handleSetContextLoggedUser]);

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

  const handleLogin = useCallback(
    (loginCredentials: LoginCredentials) => {
      login(loginCredentials);
      clearErrors();
    },
    [login, clearErrors]
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen items-center">
      <div
        className={twMerge(
          "pt-0 lg:pt-20 mb-4 sm:mb-8 lg:mb-0 relative z-10 shadow-sm sm:shadow-lg",
          "h-auto lg:h-screen max-w-full lg:max-w-[22.5rem] 2xl:max-w-[35rem] w-full",
          "after:absolute after:-z-10 after:h-full after:top-0 after:right-[-8.75rem]",
          "after:bg-white after:w-[8.75rem] after:hidden lg:after:block",
          "bg-white dark:bg-dark-card dark:after:bg-dark-card",
          styled.side
        )}
      >
        <div className="flex flex-col items-center pt-4 sm:pt-12">
          <div className="flex items-center gap-3 mb-2 sm:mb-6">
            {/* <Image
              className="h-10 sm:h-20 w-10 sm:w-20"
              src="/images/logo-1.png"
              alt="logo"
              width={80}
              height={80}
              priority
            />
            <Image
              className="h-6 hidden sm:block dark:brightness-[35.5]"
              src="/images/logo-2.png"
              alt="logo2"
              width={108}
              height={24}
              priority
            /> */}
          </div>
          <h2 className="text-xl sm:text-2xl text-heading dark:text-light mb-1 sm:mb-2 font-medium">
            Welcome back!
          </h2>
          <p className="text-center text-sm sm:text-base">
            User Experience & Interface Design <br /> Strategy SaaS Solutions
          </p>
        </div>
        <div className="mx-auto max-w-[180px] lg:max-w-full w-full">
          <Image
            className="py-3 sm:py-6 lg:py-28"
            src="/images/personal_trainer_re_cnua.svg"
            alt="logo3"
            width={450}
            height={80}
            priority
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full px-8">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className={twMerge("flex flex-col max-w-md 2xl:max-w-lg w-full")}
        >
          <h2 className="text-black dark:text-light text-xl sm:text-2xl text-center mb-2 sm:mb-6">
            Sign in your account
          </h2>
          <div className="flex flex-col gap-4 mb-6">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  placeholder="user@email.com"
                  label="Email"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, ...restField }, fieldState }) => (
                <Input
                  value={value || ""}
                  placeholder="type tour password"
                  label="Password"
                  type="password"
                  error={fieldState.error?.message}
                  {...restField}
                />
              )}
            />
          </div>
          <Button isLoading={isLoging} fullWidth type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
