"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/lib/queryClient";
// import { ThemeTamplate } from "@/components/templates/ThemeTamplate";

interface ProvidersProps {
  children: ReactNode;
}
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
