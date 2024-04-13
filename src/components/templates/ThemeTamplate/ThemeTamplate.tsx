"use client";
import { useTheme } from "@/hooks/utils/useTheme";
import { CONSTANTS } from "@/shared/constants";
import { ReactNode, useEffect } from "react";

interface ThemeTamplateProps {
  children: ReactNode;
}

export function ThemeTamplate({ children }: ThemeTamplateProps) {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    console.log({
      localStorage: localStorage.getItem(CONSTANTS.COOKIES_KEYS.THEME),
    });

    if (localStorage.getItem(CONSTANTS.COOKIES_KEYS.THEME) === "dark") {
      setTheme("dark");
    }
    localStorage.setItem(CONSTANTS.COOKIES_KEYS.THEME, "dark");
  }, [setTheme]);

  useEffect(() => {
    console.log({ theme });
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem(CONSTANTS.COOKIES_KEYS.THEME, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(CONSTANTS.COOKIES_KEYS.THEME, "light");
    }
  }, [theme]);

  return <>{children}</>;
}
