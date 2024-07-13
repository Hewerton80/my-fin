"use client";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/forms/inputs/Input";
import { Button } from "@/components/ui/buttons/Button";
import { useAuth } from "@/modules/auth/useAuth";
import { Controller } from "react-hook-form";
import { useAuthLogin } from "@/modules/auth/hooks/useAuthLogin";

export default function LoginPage() {
  // const { login, loginFormControl, isLogging } = useAuth();
  const { login, loginFormControl, isLogging } = useAuthLogin();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen items-center">
      <div className="flex items-center justify-center w-full px-8">
        <form
          onSubmit={login}
          className={twMerge("flex flex-col max-w-md 2xl:max-w-lg w-full")}
        >
          <h2 className="text-black dark:text-light text-xl sm:text-2xl text-center mb-2 sm:mb-6">
            Sign in your account
          </h2>
          <div className="flex flex-col gap-4 mb-6">
            <Controller
              control={loginFormControl}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="user@email.com"
                  label="Email"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={loginFormControl}
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  placeholder="type tour password"
                  label="Password"
                  type="password"
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <Button isLoading={isLogging} fullWidth type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
