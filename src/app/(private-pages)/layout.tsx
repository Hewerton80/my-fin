"use client";
import { PrivatePagesTamplate } from "@/components/templates/PrivatePagesTamplate";
import { SplashScreen } from "@/components/ui/feedback/SplashScreen";
import { useGetme } from "@/modules/auth/hooks/useGetMe";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { fetchedSuccessfully, meError } = useGetme();

  if (fetchedSuccessfully) {
    return <PrivatePagesTamplate>{children}</PrivatePagesTamplate>;
  }
  if (meError) {
    return redirect("/auth/login");
  }
  return <SplashScreen />;
}
