import { NextAuthOptions } from "@/lib/nextAuthConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userSessions = await getServerSession(NextAuthOptions);
  if (userSessions?.user) {
    return redirect("/home");
  }
  return <> {children} </>;
}
