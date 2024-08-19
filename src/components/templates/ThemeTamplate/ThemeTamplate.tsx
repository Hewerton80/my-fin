"use client";
import { useTheme } from "@/hooks/useTheme";
import { CONSTANTS } from "@/utils/constants";
import { ReactNode, useEffect } from "react";

interface ThemeTamplateProps {
  children: ReactNode;
}

export function ThemeTamplate({ children }: ThemeTamplateProps) {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (localStorage.getItem(CONSTANTS.COOKIES_KEYS.THEME) === "dark") {
      setTheme("dark");
    }
    localStorage.setItem(CONSTANTS.COOKIES_KEYS.THEME, "dark");
  }, [setTheme]);

  useEffect(() => {
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
