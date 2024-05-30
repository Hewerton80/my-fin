"use client";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  return <h1>Olá, {session?.user?.name}</h1>;
}
