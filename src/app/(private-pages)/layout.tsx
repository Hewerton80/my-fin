import { PrivatePagesTamplate } from "@/components/templates/PrivatePagesTamplate";
import { AuthService } from "@/modules/auth/service";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { user } = await AuthService.fetchUser();
  if (!user) {
    return redirect("/auth/login");
  }
  return <PrivatePagesTamplate user={user}>{children}</PrivatePagesTamplate>;
}
