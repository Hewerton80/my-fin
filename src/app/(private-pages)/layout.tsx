import { PrivatePagesTamplate } from "@/components/templates/PrivatePagesTamplate";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { NextAuthOptions } from "../api/auth/[...nextauth]/nextAuthOptions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const userSessions = await getServerSession(NextAuthOptions);

  // console.log({ userSessions });
  if (!userSessions) {
    return redirect("/auth/login");
  }
  return <PrivatePagesTamplate>{children}</PrivatePagesTamplate>;
}
