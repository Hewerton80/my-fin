import { PrivatePagesTamplate } from "@/components/templates/PrivatePagesTamplate";
import { NextAuthOptions } from "@/lib/nextAuthConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const userSessions = await getServerSession(NextAuthOptions);
  if (!userSessions) {
    return redirect("/auth/login");
  }
  return <PrivatePagesTamplate>{children}</PrivatePagesTamplate>;
}
